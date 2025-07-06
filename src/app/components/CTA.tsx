import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Trophy } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 via-transparent to-light-purple/10"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-light-card/30 dark:via-card-bg/30 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-3xl p-8 md:p-16 border border-gray-200 dark:border-gray-700 shadow-2xl relative overflow-hidden transition-colors duration-300">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8">
              <Zap className="w-16 h-16 text-neon-green" />
            </div>
            <div className="absolute top-8 right-8">
              <Users className="w-16 h-16 text-light-purple" />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Trophy className="w-20 h-20 text-yellow-400" />
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Header */}
            <h2 className="text-4xl md:text-6xl font-bold text-light-text dark:text-white mb-6 leading-tight">
              Sẵn Sàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-lime-400">Nâng Tầm</span>
              <br />
              Trận Đấu Của Bạn?
            </h2>
            
            <p className="text-xl text-light-text-secondary dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Tham gia cuộc cách mạng đặt sân bóng đá. Kết nối với cộng đồng cầu thủ tuyệt vời,
              đặt sân chất lượng và trải nghiệm bóng đá như chưa từng có.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/booking"
                className="group flex items-center space-x-3 bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg px-10 py-5 rounded-full font-bold text-lg hover:from-lime-400 hover:to-neon-green transition-all duration-300 hover:shadow-xl hover:shadow-neon-green/25 hover:scale-105"
              >
                <Zap className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span>Bắt Đầu Đặt Sân</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/find-teammates"
                className="group flex items-center space-x-3 border-2 border-light-purple text-light-purple px-10 py-5 rounded-full font-bold text-lg hover:bg-light-purple hover:text-white transition-all duration-300 hover:shadow-xl hover:shadow-light-purple/25"
              >
                <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Tìm Cộng Đồng</span>
              </Link>
            </div>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-neon-green/10 rounded-2xl p-6 border border-neon-green/20 hover:bg-neon-green/20 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-neon-green mb-3">Truy Cập Nhanh</h3>
                <p className="text-light-text-secondary dark:text-gray-300">
                  Đặt sân chỉ trong vài giây với hệ thống đặt sân siêu tốc
                </p>
              </div>
              
              <div className="bg-light-purple/10 rounded-2xl p-6 border border-light-purple/20 hover:bg-light-purple/20 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-light-purple mb-3">Ghép Thông Minh</h3>
                <p className="text-light-text-secondary dark:text-gray-300">
                  Ghép đồng đội bằng AI dựa trên trình độ và sở thích
                </p>
              </div>
              
              <div className="bg-yellow-400/10 rounded-2xl p-6 border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Chất Lượng Cao Cấp</h3>
                <p className="text-light-text-secondary dark:text-gray-300">
                  Chỉ tiếp cận các sân được đánh giá cao, bảo trì chuyên nghiệp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;