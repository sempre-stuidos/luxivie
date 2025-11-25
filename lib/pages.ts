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
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id')
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

    // Then get page by slug for this business
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('org_id', business.id)
      .eq('slug', pageSlug)
      .single()

    if (pageError) {
      console.error('[getPageBySlug] Page lookup error:', {
        businessId: business.id,
        pageSlug,
        error: pageError.message,
        code: pageError.code,
        details: pageError.details,
      })
      return null
    }

    if (!page) {
      console.error('[getPageBySlug] Page not found:', {
        businessId: business.id,
        pageSlug,
      })
      return null
    }

    return page as Page
  } catch (error) {
    console.error('Error in getPageBySlug:', error)
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

