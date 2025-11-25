import { createServerSupabaseClient } from './supabase'
import { validatePreviewToken } from './preview'

export interface Page {
  id: string
  org_id: string
  name: string
  slug: string
  template?: string
  status: 'published' | 'dirty' | 'draft'
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  page_id: string
  org_id: string
  key: string
  label: string
  component: string
  position: number
  published_content: Record<string, unknown>
  draft_content: Record<string, unknown>
  status: 'published' | 'dirty' | 'draft'
  created_at: string
  updated_at: string
}

/**
 * Get page by slug for a business
 */
export async function getPageBySlug(
  businessSlug: string,
  pageSlug: string
): Promise<Page | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // First get business by slug (NOT organizations table)
    // Use .limit(1) instead of .single() to handle RLS better
    // If RLS blocks access, .single() throws an error, but .limit(1) returns empty array
    // Select all fields to verify we get the correct business
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, slug')
      .eq('slug', businessSlug)
      .limit(1)

    if (businessError) {
      console.error('[getPageBySlug] Business lookup error:', {
        businessSlug,
        error: businessError.message,
        code: businessError.code,
        details: businessError.details,
        hint: businessError.hint,
      })
      return null
    }

    if (!businesses || businesses.length === 0) {
      console.error('[getPageBySlug] Business not found (RLS may be blocking):', {
        businessSlug,
        businessesReturned: businesses?.length || 0,
      })
      return null
    }

    const business = businesses[0]
    
    // Validate that we got a valid business ID
    if (!business || !business.id) {
      console.error('[getPageBySlug] Invalid business returned from lookup:', {
        businessSlug,
        business,
        businessesReturned: businesses?.length || 0,
      })
      return null
    }

    // Validate that the returned business slug matches what we queried for
    // This is critical to catch cases where RLS or caching returns wrong data
    if (business.slug !== businessSlug) {
      console.error('[getPageBySlug] Business slug mismatch - wrong business returned:', {
        businessSlug,
        returnedBusinessId: business.id,
        returnedBusinessSlug: business.slug,
        returnedBusinessName: business.name,
        allBusinessesReturned: businesses,
      })
      return null
    }

    // Verify the business ID actually exists in the database by querying by slug again
    // This is a defensive check to ensure we're not using a stale or invalid ID
    // Query by slug again (not by ID) to ensure we get the correct business
    const { data: businessVerify, error: verifyError } = await supabase
      .from('businesses')
      .select('id, name, slug')
      .eq('slug', businessSlug)
      .limit(1)

    if (verifyError) {
      console.error('[getPageBySlug] Business verification error (query by slug):', {
        businessSlug,
        businessId: business.id,
        error: verifyError.message,
        code: verifyError.code,
      })
      return null
    }

    if (!businessVerify || businessVerify.length === 0) {
      console.error('[getPageBySlug] Business not found on verification query:', {
        businessSlug,
        businessId: business.id,
        businessReturnedFromLookup: business,
      })
      return null
    }

    // Verify the business ID from verification matches the original lookup
    // If they don't match, something is wrong (caching, RLS issue, etc.)
    if (businessVerify[0].id !== business.id) {
      console.error('[getPageBySlug] Business ID mismatch between lookup and verification:', {
        businessSlug,
        originalBusinessId: business.id,
        verifiedBusinessId: businessVerify[0].id,
        originalBusiness: business,
        verifiedBusiness: businessVerify[0],
      })
      // Use the verified business ID instead of the original (more reliable)
      return null
    }

    // Double-check the verified business slug matches
    if (businessVerify[0].slug !== businessSlug) {
      console.error('[getPageBySlug] Verified business slug mismatch:', {
        businessSlug,
        businessId: business.id,
        verifiedBusinessSlug: businessVerify[0].slug,
        verifiedBusinessName: businessVerify[0].name,
      })
      return null
    }

    // Log successful business lookup for debugging
    console.log('[getPageBySlug] Business lookup successful:', {
      businessSlug,
      businessId: business.id,
      businessName: businessVerify[0].name,
      verifiedSlug: businessVerify[0].slug,
    })

    // Then get page by slug for this business
    // Use .limit(1) instead of .single() to handle RLS better
    // If RLS blocks access, .single() throws an error, but .limit(1) returns empty array
    const { data: pages, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('org_id', business.id)
      .eq('slug', pageSlug)
      .limit(1)

    if (pageError) {
      console.error('[getPageBySlug] Page lookup error:', {
        businessSlug,
        businessId: business.id,
        pageSlug,
        error: pageError.message,
        code: pageError.code,
        details: pageError.details,
        hint: pageError.hint,
      })
      return null
    }

    if (!pages || pages.length === 0) {
      console.error('[getPageBySlug] Page not found (RLS may be blocking):', {
        businessSlug,
        businessId: business.id,
        pageSlug,
        pagesReturned: pages?.length || 0,
      })
      return null
    }

    const page = pages[0]

    return page as Page
  } catch (error) {
    console.error('Error in getPageBySlug:', {
      businessSlug,
      pageSlug,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return null
  }
}

/**
 * Get page sections with preview support
 */
export async function getPageSections(
  pageId: string,
  useDraft: boolean = false,
  previewToken?: string
): Promise<{ sections: PageSection[]; useDraft: boolean }> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Validate preview token if provided
    let shouldUseDraft = useDraft
    if (previewToken) {
      const validation = await validatePreviewToken(previewToken, undefined, pageId)
      shouldUseDraft = validation.valid
    }

    const { data, error } = await supabase
      .from('page_sections_v2')
      .select('*')
      .eq('page_id', pageId)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching sections:', error)
      return { sections: [], useDraft: shouldUseDraft }
    }

    if (!data) {
      return { sections: [], useDraft: shouldUseDraft }
    }

    const sections = data as PageSection[]
    
    if (shouldUseDraft) {
      // When previewing, return sections exactly as stored so the caller can use draft_content directly
      return { sections, useDraft: true }
    }

    // For public view, include sections that have been published or have dirty (unpublished) changes
    const publishedSections = sections.filter(section => {
      const hasStatus = section.status === 'published' || section.status === 'dirty'
      return hasStatus && (section.published_content || section.draft_content)
    })

    return {
      sections: publishedSections.map(section => ({
        ...section,
        // Ensure we at least fall back to draft content if published content is empty
        published_content: section.published_content || section.draft_content || {},
      })),
      useDraft: false,
    }
  } catch (error) {
    console.error('Error in getPageSections:', error)
    return { sections: [], useDraft: useDraft }
  }
}

