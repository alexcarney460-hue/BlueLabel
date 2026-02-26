export const allProducts = [
  {
    id: 'cherry',
    shortName: 'Cherry',
    name: 'Cherry 7-OH',
    image: '/cherry.jpg',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 29.99,
    summary: 'Premium cherry-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.',
    description: 'Premium cherry-flavored 7-OH tablets crafted for research use.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'HPLC & GC-MS tested',
      'Certificate of Analysis included'
    ]
  },
  {
    id: 'mix-berry',
    shortName: 'Mix Berry',
    name: 'Mix Berry 7-OH',
    image: '/mixberry.jpg',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 32.99,
    summary: 'Enhanced berry blend 7-OH tablets. 20mg per unit, 2 containers of 10.',
    description: 'Enhanced berry blend 7-OH tablets optimized for research applications.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'Advanced alkaloid blend',
      'Serialized COA included'
    ]
  },
  {
    id: 'strawberry',
    shortName: 'Strawberry',
    name: 'Strawberry 7-OH',
    image: '/strawberry.jpg',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 29.99,
    summary: 'Premium strawberry-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.',
    description: 'Lab-verified strawberry-flavored 7-OH tablets for research.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'HPLC & GC-MS tested',
      'Chain-of-custody documentation'
    ]
  },
  {
    id: 'watermelon',
    shortName: 'Watermelon',
    name: 'Watermelon 7-OH',
    image: '/watermelon.jpg',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 31.99,
    summary: 'Premium watermelon-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.',
    description: 'Premium watermelon-flavored 7-OH tablets with comprehensive verification.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'Microbial analysis included',
      'ISO 17025 certified testing'
    ]
  }
] as const;

export type Product = (typeof allProducts)[number];

const productMap = new Map<string, Product>(allProducts.map((product) => [product.id, product] as const));

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
