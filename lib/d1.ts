// Cloudflare D1 Lightweight Helper

export function getD1Database(): any {
  try {
    if (typeof (globalThis as any).DB !== 'undefined' && (globalThis as any).DB !== null) {
      return (globalThis as any).DB;
    }
  } catch {}

  try {
    if (typeof (process.env as any).DB !== 'undefined' && (process.env as any).DB !== null) {
      return (process.env as any).DB;
    }
  } catch {}

  return null;
}
