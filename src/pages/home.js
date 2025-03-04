import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderComponent from '../components/header';
import Hero from '../components/heroSection';
import FeaturedProducts from '../components/products';
import SpecialOffers from '../components/specialoffers';
import Testimonials from '../components/testimonials';
import Newsletter from '../components/newsletter';
import Footer from '../components/footer';
import Loader from '../components/loader';

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    },);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeaderComponent />

      <motion.div variants={fadeInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Hero />
      </motion.div>

      <motion.div variants={fadeInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <FeaturedProducts />
      </motion.div>

      <motion.div variants={fadeInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <SpecialOffers />
      </motion.div>

      <motion.div variants={fadeInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Testimonials />
      </motion.div>

      <motion.div variants={fadeInVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Newsletter />
      </motion.div>

      <Footer />
    </>
  );
};

export default Home;
