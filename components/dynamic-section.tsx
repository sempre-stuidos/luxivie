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
  // Content structure is now guaranteed by Zod validation
  // All sections receive validated, flat structure - no special handling needed
  const normalizedContent = normalizeContent(content) as Record<string, unknown>

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

