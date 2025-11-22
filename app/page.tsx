import { Navigation } from "@/components/Navigation";
import DynamicSection from "@/components/dynamic-section";
import { getPageBySlug, getPageSections } from "@/lib/pages";
import { validatePreviewToken } from "@/lib/preview";

interface HomeProps {
  searchParams: Promise<{ token?: string; page?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const previewToken = params.token
  const pageSlug = params.page || 'home'
  
  // Get business slug from environment (this is the business slug, not org slug)
  const businessSlug = process.env.NEXT_PUBLIC_ORG_SLUG || 'default'
  
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
  const sections = await getPageSections(page.id, useDraft, previewToken)

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />
      {sections.map((section) => (
        <DynamicSection
          key={section.id}
          component={section.component}
          content={section.published_content || {}}
        />
      ))}
    </div>
  )
}

