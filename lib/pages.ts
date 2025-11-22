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
  published_content: Record<string, any>
  draft_content: Record<string, any>
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
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', businessSlug)
      .single()

    if (businessError || !business) {
      return null
    }

    // Then get page by slug for this business
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('org_id', business.id)
      .eq('slug', pageSlug)
      .single()

    if (pageError || !page) {
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
): Promise<PageSection[]> {
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
      return []
    }

    if (!data) {
      return []
    }

    const sections = data as PageSection[]
    
    // If using draft/preview, return sections with draft_content as published_content
    if (shouldUseDraft) {
      return sections.map(section => ({
        ...section,
        published_content: section.draft_content,
      }))
    }

    // For public view, return sections that have published_content
    // This includes sections with status 'published' or 'dirty' (unpublished changes)
    // Sections with 'dirty' status will show published_content, not draft_content
    return sections
      .filter(s => {
        // Include sections that are published OR have unpublished changes (dirty)
        // Exclude only sections that are draft-only (never published)
        return (s.status === 'published' || s.status === 'dirty') && s.published_content
      })
      .map(section => ({
        ...section,
        // Always use published_content for public view, even if section has draft changes
        published_content: section.published_content || {},
      }))
  } catch (error) {
    console.error('Error in getPageSections:', error)
    return []
  }
}

