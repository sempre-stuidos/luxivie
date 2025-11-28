"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, Lock, ChevronDown } from "lucide-react";

interface CheckoutFormProps {
    onSubmit?: (data: FormData) => void;
}

interface FormData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
}

const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan"
];

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {step === 'shipping' ? (
                    <motion.form
                        key="shipping"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleNextStep}
                        className="space-y-8"
                    >
                        {/* Shipping Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl p-8 lg:p-10"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-16 h-16 bg-[#BFC8B3]/20 rounded-full flex items-center justify-center">
                                    <MapPin className="w-7 h-7 text-[#8B9A7F]" />
                                </div>
                                <h2 className="text-2xl text-gray-900 font-normal">Shipping Address</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-base text-gray-700 mb-3 font-normal">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-base text-gray-700 mb-3 font-normal">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-base text-gray-700 mb-3 font-normal">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        required
                                        className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                        placeholder="123 Main Street"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <label htmlFor="city" className="block text-base text-gray-700 mb-3 font-normal">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            required
                                            className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                            placeholder="Toronto"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="province" className="block text-base text-gray-700 mb-3 font-normal">
                                            Province
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="province"
                                                name="province"
                                                required
                                                className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all appearance-none cursor-pointer text-base text-gray-700 pr-10"
                                                value={formData.province}
                                                onChange={handleChange}
                                                style={{
                                                    color: formData.province ? '#374151' : '#9CA3AF'
                                                }}
                                            >
                                                <option value="" disabled>Select</option>
                                                {provinces.map((prov) => (
                                                    <option key={prov} value={prov}>
                                                        {prov}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="postalCode" className="block text-base text-gray-700 mb-3 font-normal">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            required
                                            className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                            placeholder="M5V 3A8"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Next Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 h-9 w-full"
                            >
                                Payment Details
                            </button>
                        </motion.div>
                    </motion.form>
                ) : (
                    <motion.form
                        key="payment"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        {/* Payment Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl p-8 lg:p-10"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-16 h-16 bg-[#BFC8B3]/20 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-7 h-7 text-[#8B9A7F]" />
                                </div>
                                <h2 className="text-2xl text-gray-900 font-normal">Payment Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="cardNumber" className="block text-base text-gray-700 mb-3 font-normal">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        required
                                        maxLength={19}
                                        className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                        placeholder="1234 5678 9012 3456"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cardName" className="block text-base text-gray-700 mb-3 font-normal">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="cardName"
                                        name="cardName"
                                        required
                                        className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                        placeholder="John Doe"
                                        value={formData.cardName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <label htmlFor="expiryDate" className="block text-base text-gray-700 mb-3 font-normal">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            name="expiryDate"
                                            required
                                            maxLength={5}
                                            className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="cvv" className="block text-base text-gray-700 mb-3 font-normal">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            name="cvv"
                                            required
                                            maxLength={4}
                                            className="w-full px-4 py-3 bg-[#F9F9F6] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BFC8B3] transition-all text-base text-gray-700 placeholder:text-gray-400"
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2 text-sm text-gray-500 bg-[#F9F9F6] px-4 py-3 rounded-2xl">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                    <span>Your payment information is encrypted and secure</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 h-9 w-full"
                            >
                                Complete Order
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                                By completing your order, you agree to our Terms & Conditions
                            </p>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
