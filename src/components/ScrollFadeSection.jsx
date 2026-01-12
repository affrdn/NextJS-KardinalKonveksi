// components/ScrollOpacityReduce.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollOpacityReduce({
  children,
  minOpacity = 0.9, // opacity minimum saat sudah masuk section berikutnya
}) {
  const ref = useRef(null);

  // Track scroll progress relative to this component
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Opacity mapping:
  // scroll 0   → opacity 1  (normal)
  // scroll 1   → opacity 0.3 (diredupkan)
  const opacity = useTransform(scrollYProgress, [0, 1], [1, minOpacity]);

  return (
    <motion.div ref={ref} style={{ opacity }}>
      {children}
    </motion.div>
  );
}
