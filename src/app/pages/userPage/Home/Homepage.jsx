import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Benefits from '../../../components/Benefits';
import CTA from '../../../components/CTA';
import Hero from '../../../components/Hero';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation.jsx';
import Testimonials from '../../../components/Testimonials';
import './Homepage.css';

const Homepage = () => {

  const navigate = useNavigate();
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   console.log('window.location.search', urlParams);
  //   const messageParam = urlParams.get('message');
  //   if (messageParam) navigate(`/payment-status/?${(window.location.search)?.split('?')[1]}`);
  // }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(timer);

      const urlParams = new URLSearchParams(window.location.search);
      console.log('window.location.search', urlParams);
      const messageParam = urlParams.get('message');
      if (messageParam) navigate(`/payment-status/?${(window.location.search)?.split('?')[1]}`);
    };
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
