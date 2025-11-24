"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Leaf, MapPin, FlaskConical, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  content?: {
    badge?: {
      icon?: string;
      text?: string;
    };
    title?: string;
    subtitle?: string;
    primaryCta?: {
      label?: string;
      href?: string;
    };
    secondaryCta?: {
      label?: string;
      href?: string;
    };
    heroImage?: string;
    accentImage?: string;
  };
}

// Icon mapping for badge
const iconMap: Record<string, typeof Leaf> = {
  Leaf,
  MapPin,
  FlaskConical,
  Sparkles,
};

export function HeroSection({ content }: HeroSectionProps = {}) {
  // Safely extract values, handling cases where content might be incorrectly structured
  const getStringValue = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If it's an object, try to extract a string value (fallback for incorrectly structured data)
      const obj = value as Record<string, unknown>
      if (typeof obj.value === 'string') return obj.value
      if (typeof obj.text === 'string') return obj.text
      if (typeof obj.label === 'string') return obj.label
    }
    return ''
  }

  const getObjectValue = <T,>(value: unknown, defaultValue: T): T => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as T
    }
    return defaultValue
  }

  // Ensure content is an object, not a string or other type
  const normalizedContent = React.useMemo(() => {
    if (!content) {
      console.warn('[HeroSection] No content provided')
      return {}
    }
    if (typeof content === 'string') {
      console.warn('[HeroSection] Content is a string, expected object:', content)
      return {}
    }
    if (typeof content === 'object' && !Array.isArray(content)) {
      const contentObj = content as Record<string, unknown>
      // Debug: log content in iframe context
      if (typeof window !== 'undefined' && window.parent !== window) {
        console.log('[HeroSection] Content in iframe:', {
          keys: Object.keys(contentObj),
          hasTitle: !!contentObj.title,
          hasSubtitle: !!contentObj.subtitle,
          hasBadge: !!contentObj.badge,
          content: contentObj
        })
      }
      return contentObj
    }
    console.warn('[HeroSection] Content is not an object:', typeof content, content)
    return {}
  }, [content])

  const badge = getObjectValue(normalizedContent?.badge, { icon: 'Leaf', text: 'Made in Canada' });
  
  // Check if content has meaningful data (not just empty object or empty strings)
  const hasMeaningfulContent = React.useMemo(() => {
    if (!normalizedContent || typeof normalizedContent !== 'object') return false
    const keys = Object.keys(normalizedContent)
    if (keys.length === 0) return false
    // Check if at least one key has a non-empty value
    return keys.some(key => {
      const value = normalizedContent[key]
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() !== '') return true
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) return true
      if (Array.isArray(value) && value.length > 0) return true
      return false
    })
  }, [normalizedContent])
  
  const titleValue = getStringValue(normalizedContent?.title)
  const title = titleValue || 'Clean Beauty That Works—Made With Care in Canada';
  const subtitleValue = getStringValue(normalizedContent?.subtitle)
  const subtitle = subtitleValue || 'Luxurious hair care and skincare crafted with clean ingredients, gentle botanicals, and modern science.';
  const primaryCta = getObjectValue(normalizedContent?.primaryCta, { label: 'Shop Bestsellers', href: '#products' });
  const secondaryCta = getObjectValue(normalizedContent?.secondaryCta, { label: 'See Our Ingredients', href: '#ingredients' });
  const heroImageValue = getStringValue(normalizedContent?.heroImage)
  // Use null instead of empty string for images to avoid browser warnings
  const heroImage = heroImageValue || 'https://images.unsplash.com/photo-1739980213756-753aea153bb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0JTIwbWFyYmxlfGVufDF8fHx8MTc2MzQ5NzkyN3ww&ixlib=rb-4.1.0&q=80&w=1080';
  const accentImageValue = getStringValue(normalizedContent?.accentImage)
  const accentImage = accentImageValue || 'https://images.unsplash.com/photo-1763154045793-4be5374b3e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldWNhbHlwdHVzJTIwbGVhdmVzJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080';
  
  const BadgeIcon = badge.icon ? (iconMap[badge.icon] || Leaf) : Leaf;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F9F6] via-[#F9F9F6] to-[#E8E8E0]" />
      
      {/* Decorative botanical accent */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 0.1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-10 right-10"
      >
        <Leaf className="w-64 h-64 text-[#BFC8B3]" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left space-y-8">
            {badge.text && (
            <div data-section-component-key="badge">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-[#BFC8B3]/30"
              >
                  <BadgeIcon className="w-4 h-4 text-[#BFC8B3]" />
                  <span className="text-sm text-gray-700">{badge.text}</span>
              </motion.div>
            </div>
            )}
            
            <div data-section-component-key="title">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl text-gray-900 leading-tight"
              >
                {title}
              </motion.h1>
            </div>
            
            <div data-section-component-key="subtitle">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-gray-600 max-w-xl"
              >
                {subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {primaryCta?.label && (
              <div data-section-component-key="primaryCta">
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-full shadow-lg"
                    asChild={!!primaryCta.href}
                  >
                    {primaryCta.href ? (
                      <a href={primaryCta.href}>{primaryCta.label}</a>
                    ) : (
                      <span>{primaryCta.label}</span>
                    )}
                </Button>
              </div>
              )}
              {secondaryCta?.label && (
              <div data-section-component-key="secondaryCta">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 hover:border-[#BFC8B3] hover:bg-white px-8 py-6 rounded-full"
                    asChild={!!secondaryCta.href}
                  >
                    {secondaryCta.href ? (
                      <a href={secondaryCta.href}>{secondaryCta.label}</a>
                    ) : (
                      <span>{secondaryCta.label}</span>
                    )}
                </Button>
              </div>
              )}
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            {heroImage && (
            <div data-section-component-key="heroImage" className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={heroImage}
                alt="Luxivie beauty products on marble"
                className="w-full h-[600px] object-cover"
              />
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
            )}

            {/* Floating botanical accent */}
            {accentImage && (
            <div data-section-component-key="accentImage">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-8 -left-8 w-32 h-32"
              >
                <ImageWithFallback
                    src={accentImage}
                  alt="Eucalyptus accent"
                  className="w-full h-full object-cover rounded-full shadow-xl"
                />
              </motion.div>
            </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}