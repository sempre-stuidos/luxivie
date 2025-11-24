"use client"

import * as React from "react"

interface CanvasEditorHandlerProps {
  sections: Array<{ id: string; key: string }>
}

export function CanvasEditorHandler({ sections }: CanvasEditorHandlerProps) {
  // Add click event listeners to sections
  React.useEffect(() => {
    const handleSectionClick = (e: MouseEvent, sectionId: string, sectionKey: string) => {
      e.stopPropagation()
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'section-click',
          sectionId,
          sectionKey,
        }, '*')
      }
    }

    const cleanupFunctions: Array<() => void> = []

    sections.forEach((section) => {
      const element = document.querySelector(`[data-section-key="${section.key}"]`)
      if (element) {
        // Get section key from element's data attribute as fallback
        const elementKey = element.getAttribute('data-section-key') || section.key
        const elementId = element.getAttribute('data-section-id') || section.id
        
        // Add click listener
        const clickHandler = (e: MouseEvent) => {
          // Use element's data attributes to ensure we have the correct values
          const key = element.getAttribute('data-section-key') || section.key
          const id = element.getAttribute('data-section-id') || section.id
          handleSectionClick(e, id, key)
        }
        element.addEventListener('click', clickHandler)
        
        // Add visual indication that section is clickable
        const htmlElement = element as HTMLElement
        htmlElement.style.cursor = 'pointer'
        htmlElement.style.transition = 'opacity 0.2s'
        
        // Optional: Add hover effect
        const hoverHandler = () => {
          htmlElement.style.opacity = '0.95'
        }
        const leaveHandler = () => {
          htmlElement.style.opacity = '1'
        }
        element.addEventListener('mouseenter', hoverHandler)
        element.addEventListener('mouseleave', leaveHandler)

        cleanupFunctions.push(() => {
          element.removeEventListener('click', clickHandler)
          element.removeEventListener('mouseenter', hoverHandler)
          element.removeEventListener('mouseleave', leaveHandler)
          htmlElement.style.cursor = ''
          htmlElement.style.opacity = ''
          htmlElement.style.transition = ''
        })
      }
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [sections])

  // This component doesn't render anything
  return null
}
