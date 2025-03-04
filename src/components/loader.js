import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div 
      className="loader-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: "easeOut" }}
    >
      <div className="loader"></div>
    </motion.div>
  );
};

export default Loader;
