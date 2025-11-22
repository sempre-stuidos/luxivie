"use client";

import { Button } from "./ui/button";
import { Leaf, Droplets, Zap, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function IngredientTransparency() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const ingredients = [
    {
      icon: Leaf,
      name: "Rosemary Extract",
      benefit: "Scalp stimulation",
    },
    {
      icon: Droplets,
      name: "Peppermint Oil",
      benefit: "Cooling + soothing",
    },
    {
      icon: Zap,
      name: "Biotin",
      benefit: "Strengthening",
    },
    {
      icon: Shield,
      name: "Keratin",
      benefit: "Smoothing",
    },
    {
      icon: Sparkles,
      name: "Natural Oils Blend",
      benefit: "Nourish + shine",
    },
  ];

  return (
    <section id="ingredients" ref={ref} className="py-24 bg-gradient-to-b from-[#F9F9F6] to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              Pure, Tested, and Transparent
            </h2>
            <p className="text-xl text-gray-600">
              Every ingredient is chosen for a reason
            </p>
          </motion.div>

          {/* Ingredients Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/60 backdrop-blur-md border border-[#BFC8B3]/30 rounded-2xl p-6 text-center space-y-3 hover:shadow-lg transition-all hover:border-[#BFC8B3]"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#BFC8B3]/20 rounded-full">
                  <ingredient.icon className="w-6 h-6 text-[#8B9A7F]" />
                </div>
                <h4 className="text-gray-900">{ingredient.name}</h4>
                <p className="text-sm text-gray-600">{ingredient.benefit}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-center"
          >
            <Button 
              variant="outline"
              className="border-2 border-gray-300 hover:border-[#BFC8B3] hover:bg-white px-8 py-6 rounded-full"
            >
              See Full Ingredient Breakdown
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}