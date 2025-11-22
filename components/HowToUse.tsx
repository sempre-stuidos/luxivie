"use client";

import { Button } from "./ui/button";
import { Droplets, HandMetal, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface HowToUseProps {
  content?: {
    title?: string;
    subtitle?: string;
    steps?: Array<{
      number?: string;
      icon?: string;
      title?: string;
      description?: string;
    }>;
    ctaLabel?: string;
  };
}

// Icon mapping
const iconMap: Record<string, typeof Droplets> = {
  Droplets,
  HandMetal,
  Clock,
  Sparkles,
};

export function HowToUse({ content }: HowToUseProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultSteps = [
    { number: "1", icon: Droplets, title: "Apply 2–3 drops to scalp", description: "Focus on areas that need extra care" },
    { number: "2", icon: HandMetal, title: "Massage gently", description: "Use circular motions to stimulate blood flow" },
    { number: "3", icon: Clock, title: "Leave overnight or 30 minutes", description: "Let the botanicals work their magic" },
    { number: "4", icon: Sparkles, title: "Rinse with Luxivie Shampoo", description: "For best results, use our complete system" },
  ];

  const steps = content?.steps?.map(step => ({
    number: step.number || "",
    icon: step.icon ? (iconMap[step.icon] || Droplets) : Droplets,
    title: step.title || "",
    description: step.description || "",
  })) || defaultSteps;

  const title = content?.title || "Your Hair Care Ritual";
  const subtitle = content?.subtitle || "Simple steps for transformative results";
  const ctaLabel = content?.ctaLabel || "See Full Routine";

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-white to-[#F9F9F6]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-600">
              {subtitle}
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative text-center space-y-4"
              >
                {/* Step number badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-[#BFC8B3] text-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <span>{step.number}</span>
                </motion.div>

                {/* Icon */}
                <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-200/50 space-y-4 pt-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#BFC8B3]/20 rounded-full mx-auto">
                    {typeof step.icon === 'function' ? (
                      <step.icon className="w-8 h-8 text-[#8B9A7F]" />
                    ) : (
                      <Droplets className="w-8 h-8 text-[#8B9A7F]" />
                    )}
                  </div>
                  
                  <h3 className="text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {/* Connector line (except for last item) */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                    className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#BFC8B3]/30 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-center"
          >
            <Button 
              variant="outline"
              className="border-2 border-gray-300 hover:border-[#BFC8B3] hover:bg-white px-8 py-6 rounded-full"
            >
              {ctaLabel}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}