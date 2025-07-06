import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Alex Rodriguez',
      role: 'Professional Player',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'Xnova revolutionized how I book training sessions. The quality of fields and ease of finding teammates is unmatched.',
      location: 'Madrid, Spain'
    },
    {
      name: 'Sarah Johnson',
      role: 'Team Captain',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'As a team captain, organizing matches was always stressful. Xnova makes it effortless with instant booking and reliable players.',
      location: 'London, UK'
    },
    {
      name: 'Miguel Santos',
      role: 'Weekend Warrior',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'I used to struggle finding good fields for weekend games. Now I have access to premium locations anytime.',
      location: 'Barcelona, Spain'
    },
    {
      name: 'Emma Wilson',
      role: 'Youth Coach',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'Training young players requires the best facilities. Xnova consistently delivers top-quality fields with perfect scheduling.',
      location: 'Manchester, UK'
    },
    {
      name: 'David Kim',
      role: 'Amateur League',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      text: 'The teammate matching feature is incredible. I met my current team through Xnova and we play every week now.',
      location: 'Seoul, Korea'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-card/50 dark:via-card-bg/50 to-transparent"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-light-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-white mb-6">
            Cầu Thủ <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-purple to-pink-400">Nói Gì</span>
          </h2>
          <p className="text-xl text-light-text-secondary dark:text-gray-300 max-w-3xl mx-auto">
            Tham gia cùng hàng ngàn cầu thủ hài lòng đã thay đổi trải nghiệm bóng đá với Xnova
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden transition-colors duration-300">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-24 h-24 text-neon-green" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex items-center justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-light-text dark:text-white text-center leading-relaxed mb-8 font-light">
                "{testimonials[currentIndex].text}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <div className="relative">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full border-2 border-neon-green/30"
                  />
                  <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-lg"></div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-light-text dark:text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-neon-green font-medium">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-light-text-secondary dark:text-gray-400 text-sm">
                    {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 dark:bg-gray-800/80 hover:bg-neon-green/20 border border-gray-300 dark:border-gray-700 hover:border-neon-green/50 rounded-full p-3 text-light-text dark:text-white hover:text-neon-green transition-all duration-300 backdrop-blur-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200/80 dark:bg-gray-800/80 hover:bg-neon-green/20 border border-gray-300 dark:border-gray-700 hover:border-neon-green/50 rounded-full p-3 text-light-text dark:text-white hover:text-neon-green transition-all duration-300 backdrop-blur-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-neon-green w-8'
                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-neon-green mb-2">4.9</div>
            <div className="text-light-text-secondary dark:text-gray-300 text-sm">Đánh Giá Trung Bình</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-light-purple mb-2">15k+</div>
            <div className="text-light-text-secondary dark:text-gray-300 text-sm">Khách Hàng Hài Lòng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">98%</div>
            <div className="text-light-text-secondary dark:text-gray-300 text-sm">Tỉ Lệ Hài Lòng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-light-text-secondary dark:text-gray-300 text-sm">Hỗ Trợ 24/7</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;