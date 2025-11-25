import { Navigation } from "@/components/Navigation";
import DynamicSection from "@/components/dynamic-section";
import { CanvasEditorHandler } from "@/components/canvas-editor-handler";
import { getPageBySlug, getPageSections } from "@/lib/pages";
import { validatePreviewToken } from "@/lib/preview";

interface HomeProps {
  searchParams: Promise<{ token?: string; page?: string; business?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const previewToken = params.token
  const pageSlug = params.page || 'home'
  
  // Get business slug from query parameter (for iframe previews) or environment variable
  // Query parameter takes precedence to support multi-tenant previews
  const businessSlug = params.business || process.env.NEXT_PUBLIC_ORG_SLUG || 'default'
  
  // Get the page
  const page = await getPageBySlug(businessSlug, pageSlug)
  
  // If no page found, show default static content
  if (!page) {
    return (
      <div className="min-h-screen bg-[#F9F9F6]">
        <Navigation />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Page not found. Please configure your pages in the dashboard.</p>
        </div>
      </div>
    )
  }

  // Validate preview token if provided
  let useDraft = false
  if (previewToken) {
    const validation = await validatePreviewToken(previewToken, undefined, page.id)
    useDraft = validation.valid
  }

  // Get sections for this page
  const { sections, useDraft: resolvedUseDraft } = await getPageSections(
    page.id,
    useDraft,
    previewToken
  )

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />
      {sections.map((section) => {
        // Helper function to check if content has meaningful data
        const hasContent = (content: unknown): boolean => {
          if (!content) return false
          if (typeof content !== 'object') return false
          if (Array.isArray(content)) return content.length > 0
          const contentObj = content as Record<string, unknown>
          const keys = Object.keys(contentObj)
          if (keys.length === 0) return false
          // Check if at least one key has a non-empty value
          return keys.some(key => {
            const value = contentObj[key]
            if (value === null || value === undefined) return false
            if (typeof value === 'string' && value.trim() === '') return false
            if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false
            return true
          })
        }

        // When in draft mode, prioritize draft_content; when in published mode, use published_content
        // Only fall back if the primary content is empty/null or has no meaningful data
        let content: Record<string, unknown>
        if (resolvedUseDraft) {
          // In draft/preview mode: try draft_content first, fall back to published_content
          if (hasContent(section.draft_content)) {
            content = section.draft_content
          } else if (hasContent(section.published_content)) {
            content = section.published_content
          } else {
            content = {}
          }
        } else {
          // In published mode: try published_content first, fall back to draft_content
          if (hasContent(section.published_content)) {
            content = section.published_content
          } else if (hasContent(section.draft_content)) {
            content = section.draft_content
          } else {
            content = {}
          }
        }

        // Special handling for HeroSection: if content looks like just a badge object, 
        // it means the content was incorrectly extracted - use published_content as fallback
        if (section.component === 'HeroSection') {
          const contentKeys = Object.keys(content)
          // If content only has 'icon' and 'text', it's just the badge, not full content
          if (contentKeys.length === 2 && contentKeys.includes('icon') && contentKeys.includes('text')) {
            console.warn('[page.tsx] HeroSection content appears to be just badge, using published_content fallback')
            // Try to get the full content from published_content
            if (hasContent(section.published_content)) {
              content = section.published_content
            } else if (hasContent(section.draft_content) && Object.keys(section.draft_content).length > 2) {
              content = section.draft_content
            }
          }
        }

        // Debug logging for HeroSection in iframe context
        if (section.component === 'HeroSection' && previewToken) {
          console.log('[page.tsx] HeroSection content selection:', {
            sectionKey: section.key,
            resolvedUseDraft,
            hasDraftContent: hasContent(section.draft_content),
            hasPublishedContent: hasContent(section.published_content),
            draftContentKeys: section.draft_content ? Object.keys(section.draft_content) : [],
            publishedContentKeys: section.published_content ? Object.keys(section.published_content) : [],
            selectedContentKeys: Object.keys(content),
            selectedContent: content
          })
        }

        return (
          <section
            key={section.id}
            data-section-key={section.key}
            data-section-id={section.id}
          >
            <DynamicSection component={section.component} content={content} />
          </section>
        )
      })}
      <CanvasEditorHandler sections={sections.map(s => ({ id: s.id, key: s.key }))} />
    </div>
  )
}

