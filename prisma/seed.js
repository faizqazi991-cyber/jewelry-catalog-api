const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
  { name: 'Aurora Gold Necklace', description: 'Minimal 18K gold-plated necklace for everyday wear.', price: 8999, category: 'necklaces', images: ['https://placehold.co/600x600/png?text=Aurora+Necklace'], stock: 14 },
  { name: 'Celeste Diamond Ring', description: 'Classic solitaire-inspired ring with a polished finish.', price: 24999, category: 'rings', images: ['https://placehold.co/600x600/png?text=Celeste+Ring'], stock: 6 },
  { name: 'Luna Pearl Earrings', description: 'Elegant pearl drop earrings with a lightweight design.', price: 6499, category: 'earrings', images: ['https://placehold.co/600x600/png?text=Luna+Earrings'], stock: 22 },
  { name: 'Nova Silver Bracelet', description: 'Contemporary sterling-silver style bracelet.', price: 4599, category: 'bracelets', images: ['https://placehold.co/600x600/png?text=Nova+Bracelet'], stock: 0 },
  { name: 'Solstice Pendant', description: 'Geometric pendant designed for layered styling.', price: 7299, category: 'pendants', images: ['https://placehold.co/600x600/png?text=Solstice+Pendant'], stock: 9 },
  { name: 'Eclipse Hoop Earrings', description: 'Polished hoops with a modern silhouette.', price: 3199, category: 'earrings', images: ['https://placehold.co/600x600/png?text=Eclipse+Hoops'], stock: 18 },
  { name: 'Serenity Chain', description: 'Fine-link chain suitable for charms and pendants.', price: 5799, category: 'chains', images: ['https://placehold.co/600x600/png?text=Serenity+Chain'], stock: 11 },
  { name: 'Opal Garden Ring', description: 'Colorful opal-inspired statement ring.', price: 11999, category: 'rings', images: ['https://placehold.co/600x600/png?text=Opal+Ring'], stock: 4 }
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN' },
    create: { email, passwordHash, role: 'ADMIN' }
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
      update: product,
      create: { ...product, id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
    });
  }

  console.log(`Seeded admin: ${email}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
