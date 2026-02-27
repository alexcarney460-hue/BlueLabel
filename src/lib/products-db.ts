import { createClient } from '@supabase/supabase-js';

export type DbProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  summary: string | null;
  description: string | null;
  active: boolean;
  sort: number;
};

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('missing_supabase_env');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getActiveProductsFromDb(): Promise<DbProduct[] | null> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('products')
      .select('id,name,price,image_url,summary,description,active,sort')
      .eq('active', true)
      .order('sort', { ascending: true });

    if (error) return null;
    return (data as any) ?? null;
  } catch {
    return null;
  }
}
