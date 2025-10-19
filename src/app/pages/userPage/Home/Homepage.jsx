import { useEffect, useState } from 'react';
import Benefits from '../../../components/Benefits';
import CTA from '../../../components/CTA';
import Hero from '../../../components/Hero';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation.jsx';
import Testimonials from '../../../components/Testimonials';
import './Homepage.css';

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <LoadingAnimation /> : (
    <div className="homepage">
      <Hero />
      <Benefits />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Homepage;
