// Cloudflare D1 Helper & Adapter
let isTablesInitialized = false;

export function getD1Database(): any {
  // Check Cloudflare Context or globalThis / process.env
  try {
    if (typeof (globalThis as any).DB !== 'undefined') {
      return (globalThis as any).DB;
    }
  } catch {}

  try {
    if (typeof (process.env as any).DB !== 'undefined') {
      return (process.env as any).DB;
    }
  } catch {}

  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      return ctx.env.DB;
    }
  } catch {}

  return null;
}

export async function initD1Tables(db: any) {
  if (!db || isTablesInitialized) return;

  try {
    await db.batch([
      db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
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
          createdAt TEXT,
          updatedAt TEXT
        );
      `),
      db.prepare(`
        CREATE TABLE IF NOT EXISTS courses (
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
        );
      `),
      db.prepare(`
        CREATE TABLE IF NOT EXISTS enrollments (
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
          createdAt TEXT,
          updatedAt TEXT,
          UNIQUE(userId, courseId)
        );
      `),
      db.prepare(`
        CREATE TABLE IF NOT EXISTS certificates (
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
        );
      `),
      db.prepare(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          courseId TEXT,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          dueDate TEXT,
          status TEXT DEFAULT 'pending',
          createdAt TEXT,
          updatedAt TEXT
        );
      `),
      db.prepare(`
        CREATE TABLE IF NOT EXISTS feedbacks (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          courseId TEXT NOT NULL,
          rating REAL NOT NULL,
          review TEXT DEFAULT '',
          createdAt TEXT,
          updatedAt TEXT,
          UNIQUE(userId, courseId)
        );
      `)
    ]);

    isTablesInitialized = true;
    console.log('Successfully initialized Cloudflare D1 tables!');
  } catch (err: any) {
    console.warn('D1 Table initialization note:', err.message);
  }
}
