// Edge-compatible MongoDB Atlas Data API wrapper for Cloudflare Workers

const DATA_API_URL = process.env.MONGODB_DATA_API_URL || '';
const DATA_API_KEY = process.env.MONGODB_DATA_API_KEY || '';
const DATABASE = process.env.MONGODB_DATA_API_DATABASE || 'skyrellac';
const DATASOURCE = process.env.MONGODB_DATA_API_DATASOURCE || 'Cluster0';

async function fetchAtlas(action: string, body: any) {
  if (!DATA_API_URL || !DATA_API_KEY) {
    throw new Error('Please define MONGODB_DATA_API_URL and MONGODB_DATA_API_KEY environment variables');
  }

  const url = `${DATA_API_URL}/action/${action}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': DATA_API_KEY,
    },
    body: JSON.stringify({
      dataSource: DATASOURCE,
      database: DATABASE,
      ...body,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MongoDB Data API error: ${response.statusText} - ${text}`);
  }

  return response.json();
}

function serialize(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) {
    return { $date: obj.toISOString() };
  }
  if (Array.isArray(obj)) {
    return obj.map(serialize);
  }
  if (typeof obj === 'object') {
    if (obj._bsontype === 'ObjectID' || obj.constructor?.name === 'ObjectID' || obj.constructor?.name === 'ObjectId') {
      return { $oid: obj.toString() };
    }
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = serialize(obj[key]);
    }
    return result;
  }
  return obj;
}

function deserialize(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(deserialize);
  }
  if (typeof obj === 'object') {
    if (obj.$date) {
      return new Date(obj.$date);
    }
    if (obj.$oid) {
      return obj.$oid;
    }
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = deserialize(obj[key]);
    }
    return result;
  }
  return obj;
}

class AtlasQuery<T> {
  private collection: string;
  private filter: any;
  private sortOption: any = null;
  private limitOption: number | null = null;
  private selectOption: string | null = null;
  private findOneMode: boolean = false;
  private modelClass: any;

  constructor(collection: string, filter: any, findOneMode: boolean, modelClass: any) {
    this.collection = collection;
    this.filter = filter;
    this.findOneMode = findOneMode;
    this.modelClass = modelClass;
  }

  sort(sortOpt: any) {
    this.sortOption = sortOpt;
    return this;
  }

  limit(limitOpt: number) {
    this.limitOption = limitOpt;
    return this;
  }

  select(selectOpt: string) {
    this.selectOption = selectOpt;
    return this;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  async execute(): Promise<any> {
    const payload: any = {
      collection: this.collection,
      filter: serialize(this.filter)
    };

    if (this.sortOption) {
      payload.sort = this.sortOption;
    }
    if (this.limitOption !== null) {
      payload.limit = this.limitOption;
    }
    if (this.selectOption) {
      const projection: any = {};
      const fields = this.selectOption.split(' ');
      for (const field of fields) {
        if (field.startsWith('-')) {
          projection[field.substring(1)] = 0;
        } else if (field.length > 0) {
          projection[field] = 1;
        }
      }
      payload.projection = projection;
    }

    if (this.findOneMode) {
      const res = await fetchAtlas('findOne', payload);
      const doc = deserialize(res.document);
      return doc ? new this.modelClass(doc) : null;
    } else {
      const res = await fetchAtlas('find', payload);
      const docs = deserialize(res.documents || []);
      return docs.map((doc: any) => new this.modelClass(doc));
    }
  }
}

export class AtlasModel<T> {
  constructor(public collection: string, private modelClass: any) {}

  find(filter: any = {}) {
    return new AtlasQuery<any>(this.collection, filter, false, this.modelClass);
  }

  findOne(filter: any = {}) {
    return new AtlasQuery<any>(this.collection, filter, true, this.modelClass);
  }

  async create(doc: any) {
    if (Array.isArray(doc)) {
      const serializedDocs = doc.map(serialize);
      const res = await fetchAtlas('insertMany', { collection: this.collection, documents: serializedDocs });
      return res.insertedIds.map((id: string, index: number) => new this.modelClass({ ...doc[index], _id: id }));
    }
    const serializedDoc = serialize(doc);
    const res = await fetchAtlas('insertOne', { collection: this.collection, document: serializedDoc });
    return new this.modelClass({ ...doc, _id: res.insertedId });
  }

  async insertMany(docs: any[]) {
    return this.create(docs);
  }

  async updateOne(filter: any, update: any, options?: any) {
    const payload: any = {
      collection: this.collection,
      filter: serialize(filter),
      update: serialize(update)
    };
    if (options && options.upsert) {
      payload.upsert = true;
    }
    const res = await fetchAtlas('updateOne', payload);
    return res;
  }

  async updateMany(filter: any, update: any, options?: any) {
    const payload: any = {
      collection: this.collection,
      filter: serialize(filter),
      update: serialize(update)
    };
    if (options && options.upsert) {
      payload.upsert = true;
    }
    const res = await fetchAtlas('updateMany', payload);
    return res;
  }

  async findOneAndUpdate(filter: any, update: any, options?: any) {
    await this.updateOne(filter, update, options);
    return this.findOne(filter);
  }

  async deleteOne(filter: any) {
    const res = await fetchAtlas('deleteOne', {
      collection: this.collection,
      filter: serialize(filter)
    });
    return res;
  }

  async deleteMany(filter: any) {
    const res = await fetchAtlas('deleteMany', {
      collection: this.collection,
      filter: serialize(filter)
    });
    return res;
  }

  async countDocuments(filter: any = {}) {
    const res = await fetchAtlas('aggregate', {
      collection: this.collection,
      pipeline: [
        { $match: serialize(filter) },
        { $count: 'count' }
      ]
    });
    return res.documents?.[0]?.count || 0;
  }

  findById(id: string) {
    return this.findOne({ _id: typeof id === 'string' && id.length === 24 ? { $oid: id } : id });
  }

  async findByIdAndUpdate(id: string, update: any, options?: any) {
    return this.findOneAndUpdate({ _id: typeof id === 'string' && id.length === 24 ? { $oid: id } : id }, update, options);
  }

  async bulkWrite(operations: any[]) {
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
      const docCopy = { ...this };
      return docCopy;
    }

    async save() {
      const id = this._id;
      const filter = id ? { _id: typeof id === 'string' && id.length === 24 ? { $oid: id } : id } : null;
      
      const docCopy: any = { ...this };
      delete docCopy._id;

      if (filter) {
        await fetchAtlas('updateOne', {
          collection,
          filter,
          update: { $set: serialize(docCopy) }
        });
      } else {
        const res = await fetchAtlas('insertOne', {
          collection,
          document: serialize(docCopy)
        });
        this._id = res.insertedId;
      }
      return this;
    }
  };

  const modelInstance = new AtlasModel<T>(collection, modelClass);

  // Copy static methods from modelInstance to modelClass
  for (const key of Object.getOwnPropertyNames(AtlasModel.prototype)) {
    if (key !== 'constructor') {
      (modelClass as any)[key] = (modelInstance as any)[key].bind(modelInstance);
    }
  }

  return modelClass as any;
}

// Mongoose compat exports
export async function connectToDatabase() {
  return true;
}
