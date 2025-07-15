import React from 'react';
import Hero from '../../components/Hero';
import Benefits from '../../components/Benefits';
import Testimonials from '../../components/Testimonials';
import CTA from '../../components/CTA';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <Hero />
      <Benefits />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Homepage;
