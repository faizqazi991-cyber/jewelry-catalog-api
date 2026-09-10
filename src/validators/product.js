const { z } = require('zod');

const productBody = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  price: z.coerce.number().finite().nonnegative().max(999999999),
  category: z.string().trim().min(2).max(80),
  images: z.array(z.string().url()).max(10).default([]),
  stock: z.coerce.number().int().nonnegative().max(1000000).default(0)
});

const productUpdate = productBody.partial().refine(value => Object.keys(value).length > 0, { message: 'At least one field is required' });

const idParam = z.object({ id: z.string().min(1) });

const listQuery = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().finite().nonnegative().optional(),
  maxPrice: z.coerce.number().finite().nonnegative().optional(),
  inStock: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'price', 'stock', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
}).refine(v => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, {
  message: 'minPrice cannot be greater than maxPrice', path: ['minPrice']
});

module.exports = { productBody, productUpdate, idParam, listQuery };
