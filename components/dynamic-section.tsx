import { HeroSection } from './HeroSection'
import { BrandPromise } from './BrandPromise'
import { IngredientTransparency } from './IngredientTransparency'
import { FeaturedProducts } from './FeaturedProducts'
import { BrandStory } from './BrandStory'
import { CustomerReviews } from './CustomerReviews'
import { HowToUse } from './HowToUse'
import { Sustainability } from './Sustainability'
import { FinalCTA } from './FinalCTA'

interface DynamicSectionProps {
  component: string
  content: Record<string, any>
}

export default function DynamicSection({ component, content }: DynamicSectionProps) {
  switch (component) {
    case 'HeroSection':
      return <HeroSection content={content} />
    
    case 'BrandPromise':
      return <BrandPromise content={content} />
    
    case 'IngredientTransparency':
      return <IngredientTransparency content={content} />
    
    case 'FeaturedProducts':
      return <FeaturedProducts content={content} />
    
    case 'BrandStory':
      return <BrandStory content={content} />
    
    case 'CustomerReviews':
      return <CustomerReviews content={content} />
    
    case 'HowToUse':
      return <HowToUse content={content} />
    
    case 'Sustainability':
      return <Sustainability content={content} />
    
    case 'FinalCTA':
      return <FinalCTA content={content} />
    
    default:
      return (
        <div className="p-4 border rounded-lg">
          <p className="text-muted-foreground">Component {component} not found</p>
        </div>
      )
  }
}

