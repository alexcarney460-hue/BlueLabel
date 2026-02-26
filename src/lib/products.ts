import products from './products.json' assert { type: 'json' };

export type Product = (typeof products)[number];

export const allProducts = products as Product[];

const productMap = new Map(allProducts.map((product) => [product.id, product] as const));

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const normalizeProductId = (raw: string) => {
  return safeDecode(raw || '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const getProductById = (raw: string) => {
  const key = normalizeProductId(raw);
  return productMap.get(key);
};

export const requiredProductIds = ['cherry', 'mix-berry', 'strawberry', 'watermelon'] as const;
