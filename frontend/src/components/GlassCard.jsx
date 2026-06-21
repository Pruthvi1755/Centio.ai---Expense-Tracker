import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0, hover = true, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4, scale: 1.005 } : {}}
      onClick={onClick}
      className={`glass-card ${className}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
