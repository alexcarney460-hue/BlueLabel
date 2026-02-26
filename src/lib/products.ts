import productsJson from './products.json' assert { type: 'json' };

const resolvedProducts: any = (productsJson as any)?.default ?? productsJson;
const productsArray = Array.isArray(resolvedProducts) ? resolvedProducts : [];

export type Product = (typeof productsArray)[number];

export const allProducts = productsArray as Product[];

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
