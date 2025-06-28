import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight, Star, Users, MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-light-bg via-gray-50 to-light-card dark:from-dark-bg dark:via-gray-900 dark:to-card-bg transition-colors duration-300"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-light-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-light-text-secondary dark:text-gray-300 text-sm">Trusted by 10,000+ players</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-light-text dark:text-white">Book Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-lime-400 animate-float">
                Dream Field
              </span>
            </h1>
            
            <p className="text-xl text-light-text-secondary dark:text-gray-300 mb-8 max-w-2xl">
              Join the ultimate football community. Book premium fields, find skilled teammates, 
              and elevate your game with Xnova's revolutionary platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/booking"
                className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg px-8 py-4 rounded-full font-semibold text-lg hover:from-lime-400 hover:to-neon-green transition-all duration-300 hover:shadow-xl hover:shadow-neon-green/25 hover:scale-105"
              >
                <PlayCircle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/find-teammates"
                className="group flex items-center justify-center space-x-2 border-2 border-light-purple text-light-purple px-8 py-4 rounded-full font-semibold text-lg hover:bg-light-purple hover:text-white transition-all duration-300 hover:shadow-xl hover:shadow-light-purple/25"
              >
                <Users className="w-6 h-6" />
                <span>Find Players</span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-green mb-2">500+</div>
                <div className="text-light-text-secondary dark:text-gray-400 text-sm">Premium Fields</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-light-purple mb-2">50k+</div>
                <div className="text-light-text-secondary dark:text-gray-400 text-sm">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">25+</div>
                <div className="text-light-text-secondary dark:text-gray-400 text-sm">Cities</div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="relative animate-fade-in">
            <div className="relative z-10 bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="absolute top-4 right-4 bg-neon-green text-dark-bg px-3 py-1 rounded-full text-sm font-semibold">
                Live
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-light-text dark:text-white mb-2">Next Available Slot</h3>
                <div className="flex items-center space-x-2 text-light-text-secondary dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-neon-green" />
                  <span>Premium Field - Downtown</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neon-green/10 rounded-xl p-4 border border-neon-green/20">
                  <div className="text-neon-green font-semibold text-lg">Today</div>
                  <div className="text-light-text dark:text-white text-2xl font-bold">6:00 PM</div>
                  <div className="text-light-text-secondary dark:text-gray-400 text-sm">2 hours</div>
                </div>
                <div className="bg-light-purple/10 rounded-xl p-4 border border-light-purple/20">
                  <div className="text-light-purple font-semibold text-lg">Price</div>
                  <div className="text-light-text dark:text-white text-2xl font-bold">$45</div>
                  <div className="text-light-text-secondary dark:text-gray-400 text-sm">per hour</div>
                </div>
              </div>
              
              <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-light-text-secondary dark:text-gray-300">Players Needed</span>
                  <span className="text-neon-green font-semibold">3 more</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                  <div className="bg-gradient-to-r from-neon-green to-lime-400 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg py-3 rounded-xl font-semibold hover:from-lime-400 hover:to-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/25">
                Join Match
              </button>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-light-purple/20 rounded-2xl p-4 backdrop-blur-lg border border-light-purple/30 animate-float">
              <Users className="w-8 h-8 text-light-purple" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-neon-green/20 rounded-2xl p-4 backdrop-blur-lg border border-neon-green/30 animate-float delay-1000">
              <PlayCircle className="w-8 h-8 text-neon-green" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;