import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
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
    <section className="testimonials">
      {/* Background */}
      <div className="testimonials__bg-overlay"></div>
      <div className="testimonials__bg-element testimonials__bg-element--left"></div>
      <div className="testimonials__bg-element testimonials__bg-element--right"></div>
      
      <div className="testimonials__container">
        {/* Header */}
        <div className="testimonials__header">
          <h2 className="testimonials__title">
            Cầu Thủ <span className="testimonials__title-highlight">Nói Gì</span>
          </h2>
          <p className="testimonials__subtitle">
            Tham gia cùng hàng ngàn cầu thủ hài lòng đã thay đổi trải nghiệm bóng đá với Xnova
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="testimonials__carousel">
          <div className="testimonials__card">
            {/* Quote Icon */}
            <div className="testimonials__quote-icon">
              <Quote className="testimonials__quote-svg" />
            </div>
            
            {/* Content */}
            <div className="testimonials__content">
              {/* Stars */}
              <div className="testimonials__stars">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="testimonials__star" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <blockquote className="testimonials__text">
                "{testimonials[currentIndex].text}"
              </blockquote>
              
              {/* Author */}
              <div className="testimonials__author">
                <div className="testimonials__avatar-wrapper">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="testimonials__avatar"
                  />
                  <div className="testimonials__avatar-glow"></div>
                </div>
                <div className="testimonials__author-info">
                  <h4 className="testimonials__author-name">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="testimonials__author-role">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="testimonials__author-location">
                    {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="testimonials__nav testimonials__nav--prev"
          >
            <ChevronLeft className="testimonials__nav-icon" />
          </button>
          <button
            onClick={nextTestimonial}
            className="testimonials__nav testimonials__nav--next"
          >
            <ChevronRight className="testimonials__nav-icon" />
          </button>

          {/* Dots Indicator */}
          <div className="testimonials__dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`testimonials__dot ${index === currentIndex ? 'testimonials__dot--active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="testimonials__stats">
          <div className="testimonials__stat">
            <div className="testimonials__stat-number testimonials__stat-number--neon">4.9</div>
            <div className="testimonials__stat-label">Đánh Giá Trung Bình</div>
          </div>
          <div className="testimonials__stat">
            <div className="testimonials__stat-number testimonials__stat-number--purple">15k+</div>
            <div className="testimonials__stat-label">Khách Hàng Hài Lòng</div>
          </div>
          <div className="testimonials__stat">
            <div className="testimonials__stat-number testimonials__stat-number--yellow">98%</div>
            <div className="testimonials__stat-label">Tỉ Lệ Hài Lòng</div>
          </div>
          <div className="testimonials__stat">
            <div className="testimonials__stat-number testimonials__stat-number--blue">24/7</div>
            <div className="testimonials__stat-label">Hỗ Trợ 24/7</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
