"use client";

import { Leaf, Droplet, Heart, Award, Recycle, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Sustainability() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Leaf,
      title: "Clean Ingredients",
      description: "No harmful chemicals",
    },
    {
      icon: Droplet,
      title: "No Parabens / No Sulfates",
      description: "Gentle on hair & scalp",
    },
    {
      icon: Heart,
      title: "Cruelty-Free",
      description: "Never tested on animals",
    },
    {
      icon: Award,
      title: "GMP Certified",
      description: "Quality you can trust",
    },
    {
      icon: Recycle,
      title: "Recyclable Packaging",
      description: "Better for the planet",
    },
    {
      icon: Palette,
      title: "Safe for Color-Treated Hair",
      description: "Protects your investment",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
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
              Sustainability + Quality
            </h2>
            <p className="text-xl text-gray-600">
              Good for your hair, good for the planet
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/60 backdrop-blur-md border border-[#BFC8B3]/30 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-all hover:border-[#BFC8B3]"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#BFC8B3]/20 to-[#BFC8B3]/10 rounded-full"
                >
                  <feature.icon className="w-8 h-8 text-[#8B9A7F]" />
                </motion.div>
                <h3 className="text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}