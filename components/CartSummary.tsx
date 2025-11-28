"use client";

import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartSummaryProps {
  items?: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
}

export function CartSummary({ 
  items: initialItems, 
  onUpdateQuantity,
  onRemoveItem 
}: CartSummaryProps) {
  const defaultItems: CartItem[] = [
    {
      id: "1",
      name: "Rosemary + Mint Hair Oil",
      image: "https://images.unsplash.com/photo-1549049950-48d5887197a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlbWFyeSUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NjM0OTc5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 32.00,
      quantity: 1,
    },
    {
      id: "2",
      name: "Rosemary Shampoo + Conditioner Set",
      image: "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFtcG9vJTIwYm90dGxlJTIwY2xlYW58ZW58MXx8fHwxNzYzNDk3OTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 48.00,
      quantity: 1,
    },
  ];

  const [items, setItems] = useState<CartItem[]>(initialItems || defaultItems);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
    onUpdateQuantity?.(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    onRemoveItem?.(id);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">Your Cart</h2>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 text-sm font-medium line-clamp-2">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-end">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#BFC8B3] hover:bg-[#BFC8B3]/10 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#BFC8B3] hover:bg-[#BFC8B3]/10 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-gray-900 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-xl text-gray-900 font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
