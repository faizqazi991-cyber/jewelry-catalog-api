const prisma = require('../db');

function serializeProduct(product) {
  return { ...product, price: Number(product.price), inStock: product.stock > 0 };
}

async function create(req, res) {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ data: serializeProduct(product) });
}

async function list(req, res) {
  const { search, category, minPrice, maxPrice, inStock, page, limit, sortBy, sortOrder } = req.query;
  const where = {};
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } },
    { category: { contains: search, mode: 'insensitive' } }
  ];
  if (category) where.category = { equals: category, mode: 'insensitive' };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (inStock !== undefined) where.stock = inStock === 'true' ? { gt: 0 } : { lte: 0 };

  const skip = (page - 1) * limit;
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
    prisma.product.count({ where })
  ]);

  res.json({ data: products.map(serializeProduct), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

async function getById(req, res) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } });
  res.json({ data: serializeProduct(product) });
}

async function update(req, res) {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } });
  const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  res.json({ data: serializeProduct(product) });
}

async function remove(req, res) {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } });
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

module.exports = { create, list, getById, update, remove };
