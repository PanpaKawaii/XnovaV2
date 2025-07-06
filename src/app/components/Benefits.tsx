import React from 'react';
import { 
  Clock, 
  Shield, 
  Users, 
  MapPin, 
  Star, 
  Zap,
  Calendar,
  Trophy,
  Target
} from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Đặt Sân Ngay',
      description: 'Đặt sân chỉ trong vài giây với tình trạng sân cập nhật theo thời gian thực',
      color: 'neon-green',
      delay: '0'
    },
    {
      icon: Shield,
      title: 'Thanh Toán An Toàn',
      description: 'Giao dịch bảo vệ với cam kết hoàn tiền',
      color: 'light-purple',
      delay: '100'
    },
    {
      icon: Users,
      title: 'Tìm Đồng Đội',
      description: 'Kết nối với cầu thủ cùng trình độ ngay lập tức',
      color: 'yellow-400',
      delay: '200'
    },
    {
      icon: MapPin,
      title: 'Vị Trí Đắc Địa',
      description: 'Tiếp cận các sân bóng chất lượng ở vị trí thuận tiện nhất',
      color: 'blue-400',
      delay: '300'
    },
    {
      icon: Star,
      title: 'Sân Được Đánh Giá',
      description: 'Chỉ những sân chất lượng cao, được đánh giá tốt',
      color: 'orange-400',
      delay: '400'
    },
    {
      icon: Trophy,
      title: 'Giải Đấu',
      description: 'Tham gia các giải đấu và cuộc thi độc quyền',
      color: 'pink-400',
      delay: '500'
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Lên Lịch Thông Minh',
      description: 'Lên lịch bằng AI phù hợp với sở thích của bạn',
      stats: '99.9% hoạt động'
    },
    {
      icon: Target,
      title: 'Ghép Trình Độ',
      description: 'Thuật toán nâng cao ghép bạn với người cùng trình độ',
      stats: '95% hài lòng'
    },
    {
      icon: Zap,
      title: 'Thông Báo Nhanh',
      description: 'Cập nhật tức thì về đặt sân và yêu cầu đồng đội',
      stats: '<1s phản hồi'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-light-purple/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-white mb-6">
            Vì Sao Chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-lime-400">Xnova</span>
          </h2>
          <p className="text-xl text-light-text-secondary dark:text-gray-300 max-w-3xl mx-auto">
            Trải nghiệm tương lai của việc đặt sân bóng với công nghệ hiện đại và sự tiện lợi vượt trội
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`group bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-${benefit.color}/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-${benefit.color}/10 animate-slide-up`}
                style={{ animationDelay: `${benefit.delay}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${benefit.color}/10 border border-${benefit.color}/20 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-${benefit.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-light-text dark:text-white mb-2 group-hover:text-neon-green transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-light-text-secondary dark:text-gray-300 group-hover:text-light-text dark:group-hover:text-gray-200 transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Featured Benefits */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-gray-100 to-light-card dark:from-gray-800 dark:to-card-bg rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:border-neon-green/50 transition-all duration-500 group animate-fade-in`}
                style={{ animationDelay: `${600 + index * 200}ms` }}
              >
                <div className="absolute top-4 right-4 text-neon-green font-mono text-sm bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20">
                  {feature.stats}
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-neon-green/10 rounded-2xl p-4 border border-neon-green/20 group-hover:bg-neon-green/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-neon-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-light-text dark:text-white group-hover:text-neon-green transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-light-text-secondary dark:text-gray-300 text-lg group-hover:text-light-text dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
                
                <div className="mt-6 h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-green to-lime-400 rounded-full group-hover:animate-pulse transition-all duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;