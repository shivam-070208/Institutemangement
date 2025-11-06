import React from 'react';
import HeroSection from '@/components/HeroSection';


import TestimonialsSection from '@/components/Testimonial';
import Footer from '@/components/Footer';
import FeatureSection from '@/components/FeatureSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
