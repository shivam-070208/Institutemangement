import React from "react";
import { motion } from "motion/react";

const plans = [
  {
    title: "Basic",
    price: "Free",
    features: ["Access to Dashboard", "Basic Support", "Limited Usage"],
  },
  {
    title: "Standard",
    price: "$19/month",
    features: ["All Basic Features", "Priority Support", "Unlimited Usage"],
    highlighted: true,
  },
  {
    title: "Premium",
    price: "$49/month",
    features: ["Everything in Standard", "Dedicated Manager", "Advanced Tools"],
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 mb-12">Simple, transparent pricing for everyone.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className={`rounded-2xl p-8 border backdrop-blur-xl shadow-lg transition-all 
              ${plan.highlighted ? "bg-white shadow-2xl border-blue-500" : "bg-white/70 border-gray-200"}`}
            >
              <h3 className="text-2xl font-semibold">{plan.title}</h3>
              <p className="mt-4 text-3xl font-bold text-blue-600">{plan.price}</p>

              <ul className="mt-6 space-y-2 text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex justify-center">
                    ✅ {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition 
                ${
                  plan.highlighted
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-800 hover:bg-black"
                }`}
              >
                Choose {plan.title}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
