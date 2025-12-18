import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'frontend', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function attemptLogin(email, password, selectedRole) {
  const emailNorm = (email||'').trim().toLowerCase();
  const passwordTrim = (password||'').trim();
  const users = db.users || [];
  const found = users.find(u => (u.email||'').trim().toLowerCase() === emailNorm);
  if (!found) return { ok: false, reason: 'no-user' };
  if (found.password !== passwordTrim) return { ok: false, reason: 'bad-password', expected: found.password };
  if (found.role !== selectedRole) return { ok: false, reason: 'role-mismatch', actual: found.role };
  return { ok: true, user: found };
}

const tests = [
  ['amit.user@gmail.com', '123456', 'user'],
  ['neha.user@gmail.com', '123456', 'user'],
  ['rohit.doctor@gmail.com', '123456', 'provider'],
  ['admin@easyfind.com', 'admin123', 'admin'],
  ['amit.user@gmail.com', 'wrong', 'user'],
  ['AMIT.USER@gmail.com', '123456', 'user'],
  [' amit.user@gmail.com ', '123456', 'user']
];

tests.forEach(t => {
  const res = attemptLogin(...t);
  console.log('test', t, '=>', res);
});
