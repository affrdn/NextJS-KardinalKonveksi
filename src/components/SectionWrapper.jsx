// components/SectionWrapper.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SectionWrapper({ children, direction = "up" }) {
  const variants = {
    up: { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -60 }, show: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      variants={variants[direction]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
