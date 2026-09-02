import mongoose, { Schema } from 'mongoose';

// Global in-memory storage fallback for offline / disconnected state
const memoryStore: Record<string, any[]> = {};

function getMemoryCollection(name: string): any[] {
  if (!memoryStore[name]) {
    memoryStore[name] = [];
  }
  return memoryStore[name];
}

function getMongooseModel(collection: string) {
  const modelName = collection.charAt(0).toUpperCase() + collection.slice(1);
  return mongoose.models[modelName] || mongoose.model(modelName, new Schema({}, { strict: false, timestamps: true }), collection);
}

function isMongoActive(): boolean {
  return mongoose.connection.readyState === 1;
}

function matchFilter(item: any, filter: any): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key of Object.keys(filter)) {
    const filterVal = filter[key];
    const itemVal = item[key];
    if (filterVal && typeof filterVal === 'object') {
      if (filterVal.$oid) {
        if (String(itemVal) !== String(filterVal.$oid)) return false;
      }
    } else if (filterVal !== undefined && itemVal !== undefined) {
      if (String(itemVal).toLowerCase() !== String(filterVal).toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}

class MemoryQuery<T> {
  private collection: string;
  private filter: any;
  private findOneMode: boolean;
  private modelClass: any;

  constructor(collection: string, filter: any, findOneMode: boolean, modelClass: any) {
    this.collection = collection;
    this.filter = filter;
    this.findOneMode = findOneMode;
    this.modelClass = modelClass;
  }

  sort() { return this; }
  limit() { return this; }
  select() { return this; }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  async execute(): Promise<any> {
    const items = getMemoryCollection(this.collection);
    const matches = items.filter(item => matchFilter(item, this.filter));
    if (this.findOneMode) {
      const match = matches[0];
      return match ? new this.modelClass(match) : null;
    }
    return matches.map(m => new this.modelClass(m));
  }
}

export class AtlasModel<T> {
  constructor(public collection: string, private modelClass: any) {}

  find(filter: any = {}) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).find(filter) as any;
    }
    return new MemoryQuery<any>(this.collection, filter, false, this.modelClass);
  }

  findOne(filter: any = {}) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).findOne(filter) as any;
    }
    return new MemoryQuery<any>(this.collection, filter, true, this.modelClass);
  }

  async create(doc: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).create(doc) as any;
    }
    const store = getMemoryCollection(this.collection);
    if (Array.isArray(doc)) {
      const created = doc.map(d => {
        const item = { ...d, _id: d._id || 'mem_' + Math.random().toString(36).substring(2, 9) };
        store.push(item);
        return new this.modelClass(item);
      });
      return created;
    }
    const item = { ...doc, _id: doc._id || 'mem_' + Math.random().toString(36).substring(2, 9) };
    store.push(item);
    return new this.modelClass(item);
  }

  async insertMany(docs: any[]) {
    return this.create(docs);
  }

  async updateOne(filter: any, update: any, options?: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).updateOne(filter, update, options) as any;
    }
    const store = getMemoryCollection(this.collection);
    const index = store.findIndex(item => matchFilter(item, filter));
    if (index !== -1) {
      const updateData = update.$set || update;
      store[index] = { ...store[index], ...updateData };
    } else if (options?.upsert) {
      const updateData = update.$set || update;
      store.push({ ...filter, ...updateData, _id: 'mem_' + Math.random().toString(36).substring(2, 9) });
    }
    return { modifiedCount: index !== -1 ? 1 : 0 };
  }

  async updateMany(filter: any, update: any, options?: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).updateMany(filter, update, options) as any;
    }
    const store = getMemoryCollection(this.collection);
    let modified = 0;
    const updateData = update.$set || update;
    store.forEach((item, index) => {
      if (matchFilter(item, filter)) {
        store[index] = { ...item, ...updateData };
        modified++;
      }
    });
    return { modifiedCount: modified };
  }

  async findOneAndUpdate(filter: any, update: any, options?: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).findOneAndUpdate(filter, update, { new: true, ...options }) as any;
    }
    await this.updateOne(filter, update, options);
    return this.findOne(filter);
  }

  async deleteOne(filter: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).deleteOne(filter) as any;
    }
    const store = getMemoryCollection(this.collection);
    const index = store.findIndex(item => matchFilter(item, filter));
    if (index !== -1) {
      store.splice(index, 1);
    }
    return { deletedCount: index !== -1 ? 1 : 0 };
  }

  async deleteMany(filter: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).deleteMany(filter) as any;
    }
    const store = getMemoryCollection(this.collection);
    const initialLen = store.length;
    memoryStore[this.collection] = store.filter(item => !matchFilter(item, filter));
    return { deletedCount: initialLen - memoryStore[this.collection].length };
  }

  async countDocuments(filter: any = {}) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).countDocuments(filter) as any;
    }
    const store = getMemoryCollection(this.collection);
    return store.filter(item => matchFilter(item, filter)).length;
  }

  findById(id: string) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).findById(id) as any;
    }
    return this.findOne({ _id: id });
  }

  async findByIdAndUpdate(id: string, update: any, options?: any) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).findByIdAndUpdate(id, update, { new: true, ...options }) as any;
    }
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async bulkWrite(operations: any[]) {
    if (isMongoActive()) {
      return getMongooseModel(this.collection).bulkWrite(operations) as any;
    }
    const results = [];
    for (const op of operations) {
      if (op.updateOne) {
        const { filter, update, upsert } = op.updateOne;
        const res = await this.updateOne(filter, update, { upsert });
        results.push(res);
      }
    }
    return results;
  }
}

export function createModel<T>(collection: string) {
  const modelClass = class {
    [key: string]: any;

    constructor(data: any) {
      Object.assign(this, data);
    }

    toObject() {
      return { ...this };
    }

    async save() {
      if (isMongoActive()) {
        const model = getMongooseModel(collection);
        const doc = new model(this);
        const saved = await doc.save();
        Object.assign(this, saved.toObject());
        return this;
      }
      
      const store = getMemoryCollection(collection);
      const id = this._id;
      if (id) {
        const idx = store.findIndex(item => String(item._id) === String(id));
        if (idx !== -1) {
          store[idx] = { ...this };
          return this;
        }
      }
      this._id = this._id || 'mem_' + Math.random().toString(36).substring(2, 9);
      store.push({ ...this });
      return this;
    }
  };

  const modelInstance = new AtlasModel<T>(collection, modelClass);

  for (const key of Object.getOwnPropertyNames(AtlasModel.prototype)) {
    if (key !== 'constructor') {
      (modelClass as any)[key] = (modelInstance as any)[key].bind(modelInstance);
    }
  }

  return modelClass as any;
}

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return true;

  const defaultUri = 'mongodb+srv://kanakaambara65_db_user:kiXbnPqWN1rEoc1u@cluster0.afjssmq.mongodb.net/skyrellac?retryWrites=true&w=majority';
  const rawUri = process.env.MONGODB_URI || defaultUri;
  const cleanUri = rawUri.replace(/wmode=/g, 'w=').trim();

  try {
    console.log('Connecting Mongoose to MongoDB Atlas...');
    await mongoose.connect(cleanUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Successfully connected to MongoDB Atlas!');
    return true;
  } catch (err: any) {
    console.warn('Mongoose connection failed:', err.message);
    return false;
  }
}
