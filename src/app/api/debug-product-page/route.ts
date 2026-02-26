import { NextResponse } from 'next/server';
import { allProducts, getProductById, normalizeProductId } from '@/lib/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';

  // mimic the product page logic
  const slug = normalizeProductId(id);
  const product = allProducts.find((p) => p.id === slug) ?? getProductById(id);

  return NextResponse.json({
    input: id,
    slug,
    availableIds: allProducts.map((p) => p.id),
    found: !!product,
    product: product ? { id: product.id, name: product.name, price: product.price } : null
  });
}
