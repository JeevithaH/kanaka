import { getD1Database, ensureD1Tables } from './d1';

// Global memory cache for fallback
const globalEdgeStore: Record<string, any[]> = {};

function getEdgeCollection(name: string): any[] {
  if (!globalEdgeStore[name]) {
    globalEdgeStore[name] = [];
  }
  return globalEdgeStore[name];
}

// Allowed columns per table in Cloudflare D1
const TABLE_COLUMNS: Record<string, Set<string>> = {
  users: new Set(['id', 'fullName', 'email', 'passwordHash', 'role', 'accountStatus', 'isActive', 'profile', 'registrationDate', 'lastLogin', 'isEmailVerified', 'createdAt', 'updatedAt']),
  courses: new Set(['courseId', 'title', 'description', 'instructor', 'image', 'originalPrice', 'discountedPrice', 'discountPercentage', 'rating', 'studentsCount', 'category', 'difficulty', 'durationMinutes', 'lessonCount', 'certificateEligible', 'isPublished', 'skills', 'modules', 'tests', 'createdAt', 'updatedAt']),
  enrollments: new Set(['id', 'userId', 'courseId', 'enrollmentDate', 'status', 'paymentStatus', 'amountPaid', 'paymentDate', 'progressPercentage', 'completedLessons', 'testStatus', 'certificateStatus', 'couponUsed', 'createdAt', 'updatedAt']),
  coupons: new Set(['id', 'code', 'discountPercentage', 'discountAmount', 'type', 'applicableTo', 'maxUses', 'currentUses', 'isActive', 'createdBy', 'validUntil', 'createdAt', 'updatedAt']),
  payments: new Set(['id', 'transactionId', 'userId', 'userName', 'userEmail', 'amount', 'currency', 'paymentStatus', 'paymentMethod', 'serviceType', 'serviceId', 'serviceName', 'couponUsed', 'discountAmount', 'gatewayReference', 'createdAt', 'updatedAt']),
  certificates: new Set(['certificateId', 'userId', 'courseId', 'userName', 'courseTitle', 'issueDate', 'completionDate', 'testScore', 'testTotal', 'authorizedIssuer', 'createdAt', 'updatedAt']),
  tasks: new Set(['id', 'userId', 'courseId', 'courseTitle', 'title', 'description', 'dueDate', 'status', 'createdAt', 'updatedAt']),
  feedbacks: new Set(['id', 'userId', 'courseId', 'rating', 'review', 'createdAt', 'updatedAt']),
  internships: new Set(['id', 'internshipId', 'title', 'organization', 'mode', 'durationWeeks', 'validationFee', 'isPublished', 'description', 'deliverables', 'createdAt', 'updatedAt']),
  internship_enrollments: new Set(['id', 'userId', 'internshipId', 'enrollmentDate', 'status', 'progressPercentage', 'validationStatus', 'validationFee', 'taskProgress', 'certificateStatus', 'createdAt', 'updatedAt']),
  task_submissions: new Set(['id', 'taskId', 'userId', 'courseId', 'submissionContent', 'submittedAt', 'status', 'mentorFeedback', 'createdAt', 'updatedAt']),
  notifications: new Set(['id', 'userId', 'title', 'message', 'type', 'isRead', 'relatedId', 'createdAt', 'updatedAt']),
  test_attempts: new Set(['id', 'userId', 'courseId', 'testId', 'score', 'totalMarks', 'passed', 'answers', 'attemptedAt', 'createdAt', 'updatedAt']),
};

function matchFilter(item: any, filter: any): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  if (filter.$or && Array.isArray(filter.$or)) {
    return filter.$or.some((f: any) => matchFilter(item, f));
  }

  for (const key of Object.keys(filter)) {
    if (key === '$or') continue;
    const filterVal = filter[key];
    const itemVal = key === '_id' ? (item._id || item.id) : (item[key] !== undefined ? item[key] : (key === 'id' ? item._id : undefined));

    if (filterVal && typeof filterVal === 'object') {
      if (filterVal.$oid) {
        if (String(itemVal) !== String(filterVal.$oid)) return false;
      } else if (filterVal.$in && Array.isArray(filterVal.$in)) {
        if (!filterVal.$in.map(String).includes(String(itemVal))) return false;
      }
    } else if (filterVal !== undefined && itemVal !== undefined) {
      if (typeof filterVal === 'boolean') {
        if (Boolean(itemVal) !== filterVal) return false;
      } else if (String(itemVal).toLowerCase() !== String(filterVal).toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}

export function parseD1Row(row: any): any {
  if (!row) return null;
  const parsed = { ...row };
  const unifiedId = row.id || row.courseId || row.internshipId || row.certificateId || row._id || '';
  parsed.id = unifiedId;
  parsed._id = unifiedId;

  if (typeof parsed.isActive === 'number') {
    parsed.isActive = parsed.isActive === 1;
  }
  if (typeof parsed.isPublished === 'number') {
    parsed.isPublished = parsed.isPublished === 1;
  }
  if (typeof parsed.certificateEligible === 'number') {
    parsed.certificateEligible = parsed.certificateEligible === 1;
  }
  if (typeof parsed.isRead === 'number') {
    parsed.isRead = parsed.isRead === 1;
  }
  if (typeof parsed.passed === 'number') {
    parsed.passed = parsed.passed === 1;
  }

  // Auto-parse JSON string fields
  const jsonFields = [
    'profile',
    'instructor',
    'skills',
    'modules',
    'tests',
    'completedLessons',
    'testStatus',
    'certificateStatus',
    'deliverables',
    'taskProgress',
    'answers',
  ];

  for (const field of jsonFields) {
    if (typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch {}
    }
  }
  return parsed;
}

class EdgeQuery<T> {
  private collection: string;
  private filter: any;
  private findOneMode: boolean;
  private modelClass: any;

  constructor(collection: string, filter: any, findOneMode: boolean, modelClass: any) {
    this.collection = collection;
    this.filter = filter || {};
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
        await ensureD1Tables(db);
        let query = `SELECT * FROM ${this.collection}`;
        const params: any[] = [];
        const conditions: string[] = [];

        // Handle $or at root level
        if (this.filter.$or && Array.isArray(this.filter.$or)) {
          const orClauses: string[] = [];
          for (const subFilter of this.filter.$or) {
            const subConds: string[] = [];
            for (const key of Object.keys(subFilter)) {
              const col = key === '_id' ? 'id' : key;
              let val = subFilter[key];
              if (typeof val === 'boolean') val = val ? 1 : 0;

              if (val && typeof val === 'object' && val.$in && Array.isArray(val.$in)) {
                if (val.$in.length === 0) {
                  subConds.push('1 = 0');
                } else {
                  subConds.push(`${col} IN (${val.$in.map(() => '?').join(', ')})`);
                  params.push(...val.$in);
                }
              } else {
                subConds.push(`${col} = ?`);
                params.push(val);
              }
            }
            if (subConds.length > 0) {
              orClauses.push(`(${subConds.join(' AND ')})`);
            }
          }
          if (orClauses.length > 0) {
            conditions.push(`(${orClauses.join(' OR ')})`);
          }
        }

        // Handle normal filter keys
        for (const key of Object.keys(this.filter)) {
          if (key === '$or') continue;
          const col = key === '_id' ? 'id' : key;
          let val = this.filter[key];
          if (typeof val === 'boolean') val = val ? 1 : 0;

          if (val && typeof val === 'object') {
            if (val.$in && Array.isArray(val.$in)) {
              if (val.$in.length === 0) {
                conditions.push('1 = 0');
              } else {
                conditions.push(`${col} IN (${val.$in.map(() => '?').join(', ')})`);
                params.push(...val.$in);
              }
            } else if (val.$oid) {
              conditions.push(`${col} = ?`);
              params.push(String(val.$oid));
            } else {
              conditions.push(`${col} = ?`);
              params.push(JSON.stringify(val));
            }
          } else if (val !== undefined) {
            conditions.push(`${col} = ?`);
            params.push(val);
          }
        }

        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }

        if (this.findOneMode) {
          query += ' LIMIT 1';
          const row = await db.prepare(query).bind(...params).first();
          if (row) {
            return new this.modelClass(parseD1Row(row));
          }
          return null;
        } else {
          const { results } = await db.prepare(query).bind(...params).all();
          if (results && results.length > 0) {
            return results.map((r: any) => new this.modelClass(parseD1Row(r)));
          }
          return [];
        }
      } catch (err: any) {
        console.warn(`D1 query notice on ${this.collection}:`, err?.message || err);
      }
    }

    // Memory store fallback
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
    const id = doc.id || doc._id || doc.courseId || doc.internshipId || doc.certificateId || 'id_' + Math.random().toString(36).substring(2, 10);
    const normalizedDoc: any = {
      ...doc,
      id,
      _id: id,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await ensureD1Tables(db);
        const allowedCols = TABLE_COLUMNS[this.collection];
        const keys: string[] = [];
        const values: any[] = [];

        for (const key of Object.keys(normalizedDoc)) {
          if (key === '_id' || key === '__v' || key === 'save' || key === 'toObject') continue;
          if (allowedCols && !allowedCols.has(key)) continue;

          let v = normalizedDoc[key];
          if (typeof v === 'function') continue;

          keys.push(key);
          if (typeof v === 'boolean') {
            values.push(v ? 1 : 0);
          } else if (typeof v === 'object' && v !== null) {
            values.push(JSON.stringify(v));
          } else {
            values.push(v ?? null);
          }
        }

        if (keys.length > 0) {
          const placeholders = keys.map(() => '?').join(', ');
          const sql = `INSERT OR REPLACE INTO ${this.collection} (${keys.join(', ')}) VALUES (${placeholders})`;
          await db.prepare(sql).bind(...values).run();
        }
      } catch (err: any) {
        console.warn(`D1 create notice on ${this.collection}:`, err?.message || err);
      }
    }

    const store = getEdgeCollection(this.collection);
    const existingIdx = store.findIndex(item => item.id === id || (doc.email && item.email === doc.email));
    if (existingIdx !== -1) {
      store[existingIdx] = normalizedDoc;
    } else {
      store.push(normalizedDoc);
    }
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
        await ensureD1Tables(db);
        const allowedCols = TABLE_COLUMNS[this.collection];
        const setClauses: string[] = [];
        const values: any[] = [];

        for (const key of Object.keys(updateData)) {
          if (key === '_id' || key === '__v' || key === 'save' || key === 'toObject') continue;
          if (allowedCols && !allowedCols.has(key)) continue;

          let v = updateData[key];
          if (typeof v === 'function') continue;

          setClauses.push(`${key} = ?`);
          if (typeof v === 'boolean') {
            values.push(v ? 1 : 0);
          } else if (typeof v === 'object' && v !== null) {
            values.push(JSON.stringify(v));
          } else {
            values.push(v ?? null);
          }
        }

        const whereClauses: string[] = [];
        for (const key of Object.keys(filter)) {
          const col = key === '_id' ? 'id' : key;
          whereClauses.push(`${col} = ?`);
          let v = filter[key];
          if (typeof v === 'boolean') v = v ? 1 : 0;
          values.push(v);
        }

        if (setClauses.length > 0 && whereClauses.length > 0) {
          const sql = `UPDATE ${this.collection} SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')}`;
          await db.prepare(sql).bind(...values).run();
        }
      } catch (err: any) {
        console.warn(`D1 updateOne notice on ${this.collection}:`, err?.message || err);
      }
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
        const whereClauses: string[] = [];
        const values: any[] = [];
        for (const key of Object.keys(filter)) {
          const col = key === '_id' ? 'id' : key;
          whereClauses.push(`${col} = ?`);
          values.push(filter[key]);
        }
        if (whereClauses.length > 0) {
          await db.prepare(`DELETE FROM ${this.collection} WHERE ${whereClauses.join(' AND ')}`).bind(...values).run();
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
      if (!this._id && this.id) this._id = this.id;
      if (!this.id && this._id) this.id = this._id;
    }

    toObject() {
      const obj: any = {};
      for (const k of Object.keys(this)) {
        if (typeof this[k] !== 'function') {
          obj[k] = this[k];
        }
      }
      return obj;
    }

    async save() {
      const modelInstance = new AtlasModel<T>(collection, modelClass);
      const id = this.id || this._id;
      const cleanData = this.toObject();

      if (id) {
        await modelInstance.updateOne({ id }, cleanData);
        return this;
      }
      const created = await modelInstance.create(cleanData);
      Object.assign(this, created);
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
  const db = getD1Database();
  if (db) {
    await ensureD1Tables(db);
  }
  return true;
}
