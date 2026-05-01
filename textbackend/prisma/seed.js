const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const adminRole = await prisma.role.upsert({ where: { name: 'Admin' }, update: {}, create: { name: 'Admin' } });
  const authorRole = await prisma.role.upsert({ where: { name: 'Author' }, update: {}, create: { name: 'Author' } });
  const readerRole = await prisma.role.upsert({ where: { name: 'Reader' }, update: {}, create: { name: 'Reader' } });

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@blogify.local';
  const pwd = process.env.SEED_ADMIN_PASSWORD || 'password123';
  const hashed = await bcrypt.hash(pwd, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { username: 'admin', password: hashed, roleId: adminRole.id },
    create: { email, username: 'admin', password: hashed, name: 'Administrator', roleId: adminRole.id }
  });

  console.log('Seeded admin:', admin.email);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
