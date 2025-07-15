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
import './Benefits.css';

const Benefits = () => {
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
    <section className="benefits">
      {/* Background Elements */}
      <div className="benefits__bg-element benefits__bg-element--top-left"></div>
      <div className="benefits__bg-element benefits__bg-element--bottom-right"></div>
      
      <div className="benefits__container">
        {/* Header */}
        <div className="benefits__header">
          <h2 className="benefits__title">
            Vì Sao Chọn <span className="benefits__title-highlight">Xnova</span>
          </h2>
          <p className="benefits__subtitle">
            Trải nghiệm tương lai của việc đặt sân bóng với công nghệ hiện đại và sự tiện lợi vượt trội
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits__grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`benefits__card benefits__card--${benefit.color}`}
                style={{ animationDelay: `${benefit.delay}ms` }}
              >
                <div className={`benefits__icon benefits__icon--${benefit.color}`}>
                  <Icon className="benefits__icon-svg" />
                </div>
                <h3 className="benefits__card-title">
                  {benefit.title}
                </h3>
                <p className="benefits__card-description">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Featured Benefits */}
        <div className="benefits__features">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="benefits__feature"
                style={{ animationDelay: `${600 + index * 200}ms` }}
              >
                <div className="benefits__feature-stats">
                  {feature.stats}
                </div>
                
                <div className="benefits__feature-header">
                  <div className="benefits__feature-icon">
                    <Icon className="benefits__feature-icon-svg" />
                  </div>
                  <h3 className="benefits__feature-title">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="benefits__feature-description">
                  {feature.description}
                </p>
                
                <div className="benefits__feature-progress">
                  <div className="benefits__feature-progress-bar"></div>
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
