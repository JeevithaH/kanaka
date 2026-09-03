// Cloudflare D1 Helper with Context Detection

let schemaInitialized = false;

export function getD1Database(): any {
  // 1. Try official @opennextjs/cloudflare getCloudflareContext
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      return ctx.env.DB;
    }
  } catch {}

  // 2. OpenNext Cloudflare global context symbol (production)
  try {
    const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
    if (cfContext?.env?.DB) {
      return cfContext.env.DB;
    }
  } catch {}

  // 3. Direct globalThis binding
  try {
    if (typeof (globalThis as any).DB !== 'undefined' && (globalThis as any).DB !== null) {
      return (globalThis as any).DB;
    }
  } catch {}

  // 4. process.env binding
  try {
    if (typeof (process.env as any).DB !== 'undefined' && (process.env as any).DB !== null) {
      return (process.env as any).DB;
    }
  } catch {}

  return null;
}

const TABLE_SCHEMAS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    accountStatus TEXT DEFAULT 'active',
    isActive INTEGER DEFAULT 1,
    profile TEXT DEFAULT '{}',
    registrationDate TEXT,
    lastLogin TEXT,
    isEmailVerified INTEGER DEFAULT 1,
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS courses (
    courseId TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    instructor TEXT DEFAULT '{}',
    image TEXT DEFAULT '',
    originalPrice REAL DEFAULT 1999,
    discountedPrice REAL DEFAULT 199,
    discountPercentage REAL DEFAULT 90,
    rating REAL DEFAULT 4.8,
    studentsCount INTEGER DEFAULT 0,
    category TEXT DEFAULT 'General',
    difficulty TEXT DEFAULT 'Foundational',
    durationMinutes INTEGER DEFAULT 300,
    lessonCount INTEGER DEFAULT 10,
    certificateEligible INTEGER DEFAULT 1,
    isPublished INTEGER DEFAULT 1,
    skills TEXT DEFAULT '[]',
    modules TEXT DEFAULT '[]',
    tests TEXT DEFAULT '[]',
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    enrollmentDate TEXT,
    status TEXT DEFAULT 'active',
    paymentStatus TEXT DEFAULT 'paid',
    amountPaid REAL DEFAULT 199,
    paymentDate TEXT,
    progressPercentage REAL DEFAULT 0,
    completedLessons TEXT DEFAULT '[]',
    testStatus TEXT DEFAULT '[]',
    certificateStatus TEXT DEFAULT '{}',
    couponUsed TEXT DEFAULT '',
    createdAt TEXT,
    updatedAt TEXT,
    UNIQUE(userId, courseId)
  )`,
  `CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discountPercentage REAL DEFAULT 90,
    discountAmount REAL DEFAULT 0,
    type TEXT DEFAULT 'percentage',
    applicableTo TEXT DEFAULT 'all',
    maxUses INTEGER DEFAULT 1000,
    currentUses INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdBy TEXT DEFAULT '',
    validUntil TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    transactionId TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    userName TEXT,
    userEmail TEXT,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    paymentStatus TEXT DEFAULT 'completed',
    paymentMethod TEXT DEFAULT 'upi',
    serviceType TEXT DEFAULT 'course',
    serviceId TEXT NOT NULL,
    serviceName TEXT NOT NULL,
    couponUsed TEXT DEFAULT '',
    discountAmount REAL DEFAULT 0,
    gatewayReference TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS certificates (
    certificateId TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT,
    userName TEXT NOT NULL,
    courseTitle TEXT NOT NULL,
    issueDate TEXT,
    completionDate TEXT,
    testScore REAL DEFAULT 0,
    testTotal REAL DEFAULT 100,
    authorizedIssuer TEXT DEFAULT 'Skyrellac Global Credentials',
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT,
    courseTitle TEXT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    dueDate TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    rating REAL NOT NULL,
    review TEXT DEFAULT '',
    createdAt TEXT,
    updatedAt TEXT,
    UNIQUE(userId, courseId)
  )`,
  `CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY,
    internshipId TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    organization TEXT DEFAULT 'Skyrellac Labs',
    mode TEXT DEFAULT 'Remote',
    durationWeeks INTEGER DEFAULT 8,
    validationFee REAL DEFAULT 499,
    isPublished INTEGER DEFAULT 1,
    description TEXT DEFAULT '',
    deliverables TEXT DEFAULT '[]',
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS internship_enrollments (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    internshipId TEXT NOT NULL,
    enrollmentDate TEXT,
    status TEXT DEFAULT 'active',
    progressPercentage REAL DEFAULT 0,
    validationStatus TEXT DEFAULT 'pending',
    validationFee REAL DEFAULT 499,
    taskProgress TEXT DEFAULT '[]',
    certificateStatus TEXT DEFAULT '{}',
    createdAt TEXT,
    updatedAt TEXT,
    UNIQUE(userId, internshipId)
  )`,
  `CREATE TABLE IF NOT EXISTS task_submissions (
    id TEXT PRIMARY KEY,
    taskId TEXT,
    userId TEXT NOT NULL,
    courseId TEXT,
    submissionContent TEXT,
    submittedAt TEXT,
    status TEXT DEFAULT 'submitted',
    mentorFeedback TEXT DEFAULT '',
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    isRead INTEGER DEFAULT 0,
    relatedId TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS test_attempts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    testId TEXT,
    score REAL DEFAULT 0,
    totalMarks REAL DEFAULT 100,
    passed INTEGER DEFAULT 0,
    answers TEXT DEFAULT '[]',
    attemptedAt TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )`,
];

export async function ensureD1Tables(db: any) {
  if (!db || schemaInitialized) return;

  try {
    for (const schema of TABLE_SCHEMAS) {
      try {
        await db.prepare(schema).run();
      } catch (tableErr: any) {
        // Individual table create notice
      }
    }

    const safeMigrations = [
      "ALTER TABLE coupons ADD COLUMN createdBy TEXT DEFAULT ''",
      'ALTER TABLE coupons ADD COLUMN validUntil TEXT',
      'ALTER TABLE users ADD COLUMN isEmailVerified INTEGER DEFAULT 1',
      "ALTER TABLE enrollments ADD COLUMN couponUsed TEXT DEFAULT ''",
    ];

    for (const migration of safeMigrations) {
      try {
        await db.prepare(migration).run();
      } catch {}
    }

    schemaInitialized = true;
  } catch (err: any) {
    schemaInitialized = true;
  }
}
