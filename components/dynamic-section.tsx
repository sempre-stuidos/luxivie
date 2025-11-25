import { HeroSection } from './HeroSection'
import { BrandPromise } from './BrandPromise'
import { IngredientTransparency } from './IngredientTransparency'
import { FeaturedProducts } from './FeaturedProducts'
import { BrandStory } from './BrandStory'
import { CustomerReviews } from './CustomerReviews'
import { HowToUse } from './HowToUse'
import { Sustainability } from './Sustainability'
import { FinalCTA } from './FinalCTA'
import { normalizeContent } from '@/lib/normalize-content'

interface DynamicSectionProps {
  component: string
  content: Record<string, unknown>
}

export default function DynamicSection({ component, content }: DynamicSectionProps) {
  // Debug: log raw content before any processing for HeroSection
  if (component === 'HeroSection') {
    console.log('[DynamicSection] HeroSection RAW content received:', {
      type: typeof content,
      isArray: Array.isArray(content),
      keys: content && typeof content === 'object' ? Object.keys(content) : [],
      content: content
    })
  }
  
  // For HeroSection, be more lenient with normalization - preserve the content structure
  // Other sections can use full normalization
  let normalizedContent: Record<string, unknown>
  
  if (component === 'HeroSection') {
    // For HeroSection, skip normalization entirely - pass content as-is
    // The normalizeContent function is too aggressive and can strip nested objects
    // We'll handle unwrapping in HeroSection itself if needed
    if (content && typeof content === 'object' && !Array.isArray(content)) {
      // Check if content looks like it's already been normalized incorrectly
      // If content only has 'icon' and 'text' keys, it might be just the badge
      const contentKeys = Object.keys(content)
      if (contentKeys.length === 2 && contentKeys.includes('icon') && contentKeys.includes('text')) {
        console.warn('[DynamicSection] HeroSection content appears to be just badge object, not full content:', content)
        // This shouldn't happen, but if it does, wrap it back
        normalizedContent = { badge: content } as Record<string, unknown>
      } else {
        // Content looks correct, use it as-is but handle title unwrapping
        normalizedContent = Object.fromEntries(
          Object.entries(content).map(([key, value]) => {
            // Handle title: { title: "..." } -> title: "..."
            if (key === 'title' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
              const titleObj = value as Record<string, unknown>
              if ('title' in titleObj && typeof titleObj.title === 'string') {
                return [key, titleObj.title]
              }
            }
            // Everything else stays as-is
            return [key, value]
          })
        ) as Record<string, unknown>
      }
    } else {
      normalizedContent = content || {}
    }
    
    // Debug: log content for HeroSection in iframe
    if (typeof window !== 'undefined' && window.parent !== window) {
      console.log('[DynamicSection] HeroSection normalized content:', {
        rawKeys: Object.keys(content || {}),
        normalizedKeys: Object.keys(normalizedContent || {}),
        rawContent: content,
        normalizedContent: normalizedContent
      })
    }
  } else {
    // For other sections, use full normalization
    normalizedContent = normalizeContent(content) as Record<string, unknown>
  }

  switch (component) {
    case 'HeroSection':
      return <HeroSection content={normalizedContent} />
    
    case 'BrandPromise':
      return <BrandPromise content={normalizedContent} />
    
    case 'IngredientTransparency':
      return <IngredientTransparency content={normalizedContent} />
    
    case 'FeaturedProducts':
      return <FeaturedProducts content={normalizedContent} />
    
    case 'BrandStory':
      return <BrandStory content={normalizedContent} />
    
    case 'CustomerReviews':
      return <CustomerReviews content={normalizedContent} />
    
    case 'HowToUse':
      return <HowToUse content={normalizedContent} />
    
    case 'Sustainability':
      return <Sustainability content={normalizedContent} />
    
    case 'FinalCTA':
      return <FinalCTA content={normalizedContent} />
    
    default:
      return (
        <div className="p-4 border rounded-lg">
          <p className="text-muted-foreground">Component {component} not found</p>
        </div>
      )
  }
}

