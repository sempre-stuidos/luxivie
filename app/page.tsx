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
  
  // Log business slug source for debugging
  if (typeof window === 'undefined') {
    // Server-side logging
    console.log('[page.tsx] Business slug resolved:', {
      fromQueryParam: params.business,
      fromEnv: process.env.NEXT_PUBLIC_ORG_SLUG,
      finalBusinessSlug: businessSlug,
      pageSlug,
    })
  }
  
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
  let tokenValid = false
  if (previewToken) {
    const validation = await validatePreviewToken(previewToken, undefined, page.id)
    useDraft = validation.valid
    tokenValid = validation.valid
    if (typeof window === 'undefined') {
      console.log('[page.tsx] Preview token validation:', {
        token: previewToken.substring(0, 8) + '...',
        valid: validation.valid,
        error: validation.error,
        useDraft,
      })
    }
  }

  // Get sections for this page
  const { sections, useDraft: resolvedUseDraft } = await getPageSections(
    page.id,
    useDraft,
    previewToken
  )

  if (typeof window === 'undefined') {
    console.log('[page.tsx] Content mode resolved:', {
      previewToken: previewToken ? previewToken.substring(0, 8) + '...' : null,
      tokenValid,
      useDraft,
      resolvedUseDraft,
      sectionsCount: sections.length,
    })
  }

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

        // Content selection: Simple and consistent logic
        // When in draft mode (preview token valid), use draft_content
        // When in published mode (no token or invalid token), use published_content
        let content: Record<string, unknown>
        const isDraftMode = resolvedUseDraft
        
        if (isDraftMode) {
          // Draft mode: Use draft_content if it exists and has content, otherwise fall back to published_content
          if (hasContent(section.draft_content)) {
            content = section.draft_content as Record<string, unknown>
          } else if (hasContent(section.published_content)) {
            content = section.published_content as Record<string, unknown>
          } else {
            content = {}
          }
        } else {
          // Published mode: Use published_content if it exists and has content, otherwise fall back to draft_content
          if (hasContent(section.published_content)) {
            content = section.published_content as Record<string, unknown>
          } else if (hasContent(section.draft_content)) {
            content = section.draft_content as Record<string, unknown>
          } else {
            content = {}
          }
        }

        // Debug logging for HeroSection to track content selection
        if (section.component === 'HeroSection') {
          const logData = {
            sectionKey: section.key,
            isDraftMode,
            hasDraftContent: hasContent(section.draft_content),
            hasPublishedContent: hasContent(section.published_content),
            draftBadge: section.draft_content && typeof section.draft_content === 'object' && 'badge' in section.draft_content 
              ? (section.draft_content as Record<string, unknown>).badge 
              : null,
            draftTitle: section.draft_content && typeof section.draft_content === 'object' && 'title' in section.draft_content 
              ? (section.draft_content as Record<string, unknown>).title 
              : null,
            publishedBadge: section.published_content && typeof section.published_content === 'object' && 'badge' in section.published_content 
              ? (section.published_content as Record<string, unknown>).badge 
              : null,
            publishedTitle: section.published_content && typeof section.published_content === 'object' && 'title' in section.published_content 
              ? (section.published_content as Record<string, unknown>).title 
              : null,
            selectedBadge: content && 'badge' in content ? content.badge : null,
            selectedTitle: content && 'title' in content ? content.title : null,
            previewToken: previewToken ? previewToken.substring(0, 8) + '...' : null,
          }
          console.log('[page.tsx] HeroSection content selection:', logData)
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

