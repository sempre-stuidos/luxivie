"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function CustomerReviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reviews = [
    {
      quote: "My hair has never felt this full. The rosemary oil has become my holy grail product!",
      name: "Sarah M.",
      location: "Toronto, ON",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      initials: "SM",
    },
    {
      quote: "Clean, fresh scent. Canadian brand I trust. Love supporting local businesses that care.",
      name: "Jessica K.",
      location: "Vancouver, BC",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      initials: "JK",
    },
    {
      quote: "Affordable luxury. My new go-to. Finally found products that work without breaking the bank.",
      name: "Emily R.",
      location: "Montreal, QC",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      initials: "ER",
    },
  ];

  return (
    <section id="reviews" ref={ref} className="py-24 bg-white">
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
              Customer Love
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Star className="w-6 h-6 fill-[#BFC8B3] text-[#BFC8B3]" />
                </motion.div>
              ))}
            </div>
            <p className="text-gray-600">Trusted by 10,000+ happy customers across Canada</p>
          </motion.div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 50, rotateY: -15 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-[#F9F9F6] to-[#E8E8E0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#BFC8B3] text-[#BFC8B3]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 italic">"{review.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-300">
                  <Avatar>
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback className="bg-[#BFC8B3] text-white">
                      {review.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}