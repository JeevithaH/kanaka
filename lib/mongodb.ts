import { getD1Database } from './d1';

// Global memory cache for edge worker isolates
const globalEdgeStore: Record<string, any[]> = {};

function getEdgeCollection(name: string): any[] {
  if (!globalEdgeStore[name]) {
    globalEdgeStore[name] = [];
  }
  return globalEdgeStore[name];
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

class EdgeQuery<T> {
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
    const db = getD1Database();
    if (db) {
      try {
        const filterKeys = Object.keys(this.filter || {});
        let query = `SELECT * FROM ${this.collection}`;
        const params: any[] = [];

        if (filterKeys.length > 0) {
          const conditions = filterKeys.map(k => {
            params.push(this.filter[k]);
            return `${k} = ?`;
          });
          query += ` WHERE ${conditions.join(' AND ')}`;
        }

        if (this.findOneMode) {
          query += ' LIMIT 1';
          const row = await db.prepare(query).bind(...params).first();
          if (!row) return null;
          return new this.modelClass({ ...row, _id: row.id || row.courseId || row.certificateId });
        } else {
          const { results } = await db.prepare(query).bind(...params).all();
          return (results || []).map((r: any) => new this.modelClass({ ...r, _id: r.id || r.courseId || r.certificateId }));
        }
      } catch (err: any) {
        // Fallback to local memory store if table not queried
      }
    }

    const items = getEdgeCollection(this.collection);
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
    return new EdgeQuery<any>(this.collection, filter, false, this.modelClass);
  }

  findOne(filter: any = {}) {
    return new EdgeQuery<any>(this.collection, filter, true, this.modelClass);
  }

  async create(doc: any) {
    const db = getD1Database();
    const id = doc.id || doc._id || doc.courseId || doc.certificateId || 'id_' + Math.random().toString(36).substring(2, 10);
    const normalizedDoc = { ...doc, id, _id: id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

    if (db) {
      try {
        const keys = Object.keys(normalizedDoc).filter(k => k !== '_id');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => {
          const v = normalizedDoc[k];
          return typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
        });

        const sql = `INSERT OR REPLACE INTO ${this.collection} (${keys.join(', ')}) VALUES (${placeholders})`;
        await db.prepare(sql).bind(...values).run();
      } catch (err: any) {}
    }

    const store = getEdgeCollection(this.collection);
    store.push(normalizedDoc);
    return new this.modelClass(normalizedDoc);
  }

  async insertMany(docs: any[]) {
    return Promise.all(docs.map(d => this.create(d)));
  }

  async updateOne(filter: any, update: any, options?: any) {
    const db = getD1Database();
    const updateData = update.$set || update;

    if (db) {
      try {
        const updateKeys = Object.keys(updateData);
        const filterKeys = Object.keys(filter);

        if (updateKeys.length > 0 && filterKeys.length > 0) {
          const setClause = updateKeys.map(k => `${k} = ?`).join(', ');
          const whereClause = filterKeys.map(k => `${k} = ?`).join(' AND ');
          const values = [
            ...updateKeys.map(k => {
              const v = updateData[k];
              return typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
            }),
            ...filterKeys.map(k => filter[k])
          ];

          await db.prepare(`UPDATE ${this.collection} SET ${setClause} WHERE ${whereClause}`).bind(...values).run();
        }
      } catch (err: any) {}
    }

    const store = getEdgeCollection(this.collection);
    const index = store.findIndex(item => matchFilter(item, filter));
    if (index !== -1) {
      store[index] = { ...store[index], ...updateData };
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async updateMany(filter: any, update: any, options?: any) {
    return this.updateOne(filter, update, options);
  }

  async findOneAndUpdate(filter: any, update: any, options?: any) {
    await this.updateOne(filter, update, options);
    return this.findOne(filter);
  }

  async deleteOne(filter: any) {
    const db = getD1Database();
    if (db) {
      try {
        const filterKeys = Object.keys(filter);
        if (filterKeys.length > 0) {
          const whereClause = filterKeys.map(k => `${k} = ?`).join(' AND ');
          const values = filterKeys.map(k => filter[k]);
          await db.prepare(`DELETE FROM ${this.collection} WHERE ${whereClause}`).bind(...values).run();
        }
      } catch (err: any) {}
    }

    const store = getEdgeCollection(this.collection);
    const index = store.findIndex(item => matchFilter(item, filter));
    if (index !== -1) {
      store.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(filter: any) {
    return this.deleteOne(filter);
  }

  async countDocuments(filter: any = {}) {
    const db = getD1Database();
    if (db) {
      try {
        const res = await db.prepare(`SELECT COUNT(*) as count FROM ${this.collection}`).first();
        if (res && typeof res.count === 'number') return res.count;
      } catch (err: any) {}
    }
    const store = getEdgeCollection(this.collection);
    return store.filter(item => matchFilter(item, filter)).length;
  }

  findById(id: string) {
    return this.findOne({ id });
  }

  async findByIdAndUpdate(id: string, update: any, options?: any) {
    return this.findOneAndUpdate({ id }, update, options);
  }

  async bulkWrite(operations: any[]) {
    return [];
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
      const modelInstance = new AtlasModel<T>(collection, modelClass);
      if (this.id || this._id) {
        await modelInstance.updateOne({ id: this.id || this._id }, this);
        return this;
      }
      return modelInstance.create(this);
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
  return true;
}
