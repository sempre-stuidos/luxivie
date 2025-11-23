"use client";

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface BrandStoryProps {
  content?: {
    title?: string;
    paragraphs?: string[];
    image?: string;
    ctaLabel?: string;
  };
}

export function BrandStory({ content }: BrandStoryProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const title = content?.title || "Clean Beauty Rooted in Canada";
  const defaultParagraphs = [
    "Luxivie was created to bring high-quality, clean, effective, and affordable beauty to Canadians.",
    "We believe that everyone deserves access to products that are both luxurious and transparent. That's why every formula is crafted with care, using botanical ingredients backed by modern science.",
    "Some products are 100% made in Canada, while others are formulated here and crafted in trusted GMP-certified facilities abroad—always meeting Health Canada and FDA standards.",
    "From our bottles to your beauty ritual, Luxivie is a promise of purity, performance, and pride.",
  ];
  const paragraphs = content?.paragraphs || defaultParagraphs;
  const image = content?.image || "https://images.unsplash.com/photo-1763154045793-4be5374b3e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldWNhbHlwdHVzJTIwbGVhdmVzJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const ctaLabel = content?.ctaLabel || "Our Story";

  return (
    <section id="story" ref={ref} className="py-24 bg-[#F9F9F6] relative overflow-hidden">
      {/* Decorative botanical */}
      <motion.div
        initial={{ opacity: 0, rotate: 45 }}
        animate={isInView ? { opacity: 0.05, rotate: 0 } : { opacity: 0, rotate: 45 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 left-0"
      >
        <Leaf className="w-96 h-96 text-[#BFC8B3]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={image}
                  alt="Natural botanicals"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>

            {/* Right: Story */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-4xl lg:text-5xl text-gray-900">
                {title}
              </h2>
              
              <div className="space-y-4 text-gray-600">
                {paragraphs.map((paragraph, index) => (
                <motion.p
                    key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                    {paragraph}
                </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button 
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-[#BFC8B3] hover:bg-white px-8 py-6 rounded-full"
                >
                  {ctaLabel}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}