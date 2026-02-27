export const allProducts = [
  {
    id: 'cherry',
    shortName: 'Cherry',
    name: 'Cherry 7-OH',
    image: '/products/cherry.png',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 24.99,
    summary: 'Premium cherry-flavored 7-OH tablets. 20mg per unit.',
    description: 'Premium cherry-flavored 7-OH tablets with consistent specs and clean packaging.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '1 tablet per unit',
      'HPLC & GC-MS tested',
      'Certificate of Analysis included'
    ]
  },
  {
    id: 'mix-berry',
    shortName: 'Mix Berry',
    name: 'Mix Berry 7-OH',
    image: '/products/mix-berry.png',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 24.99,
    summary: 'Enhanced berry blend 7-OH tablets. 20mg per unit.',
    description: 'Enhanced berry blend 7-OH tablets with consistent specs for retail and wholesale.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '1 tablet per unit',
      'Advanced alkaloid blend',
      'Serialized COA included'
    ]
  },
  {
    id: 'strawberry',
    shortName: 'Strawberry',
    name: 'Strawberry 7-OH',
    image: '/products/strawberry.png',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 24.99,
    summary: 'Premium strawberry-flavored 7-OH tablets. 20mg per unit.',
    description: 'Lab-verified strawberry-flavored 7-OH tablets with consistent specs.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '1 tablet per unit',
      'HPLC & GC-MS tested',
      'Chain-of-custody documentation'
    ]
  },
  {
    id: 'watermelon',
    shortName: 'Watermelon',
    name: 'Watermelon 7-OH',
    image: '/products/watermelon.png',
    purityLabel: 'Lab-verified purity',
    dosage: '20mg per unit',
    price: 24.99,
    summary: 'Premium watermelon-flavored 7-OH tablets. 20mg per unit.',
    description: 'Premium watermelon-flavored 7-OH tablets with comprehensive verification.',
    details: [
      'Lab-verified purity with serialized COA',
      '20mg per tablet',
      '1 tablet per unit',
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
