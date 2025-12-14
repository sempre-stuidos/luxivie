import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessSlug = searchParams.get('businessSlug') || process.env.NEXT_PUBLIC_ORG_SLUG || 'luxivie';

    // Get business by slug
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('slug', businessSlug)
      .limit(1)
      .single();

    if (businessError || !businesses) {
      console.error('Error fetching business:', businessError);
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const businessId = businesses.id;

    // Fetch active products for this business
    const { data: products, error: productsError } = await supabaseAdmin
      .from('retail_products_table')
      .select('id, name, price, image_url, benefits, status')
      .eq('business_id', businessId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Transform products to include only first 3 benefits
    const transformedProducts = (products || []).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price ? parseFloat(String(product.price)) : 0,
      image_url: product.image_url || '',
      benefits: product.benefits && Array.isArray(product.benefits) 
        ? product.benefits.slice(0, 3) 
        : [],
      status: product.status || 'active',
    }));

    // Add cache headers for better performance
    const response = NextResponse.json({ products: transformedProducts });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { products: [] },
      { status: 200 }
    );
  }
}
