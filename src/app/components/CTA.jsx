import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Trophy } from 'lucide-react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta">
      {/* Background */}
      <div className="cta__bg-gradient"></div>
      <div className="cta__bg-overlay"></div>
      
      <div className="cta__container">
        <div className="cta__card">
          {/* Background Pattern */}
          <div className="cta__pattern">
            <div className="cta__pattern-icon cta__pattern-icon--top-left">
              <Zap className="cta__pattern-svg" />
            </div>
            <div className="cta__pattern-icon cta__pattern-icon--top-right">
              <Users className="cta__pattern-svg" />
            </div>
            <div className="cta__pattern-icon cta__pattern-icon--bottom-center">
              <Trophy className="cta__pattern-svg" />
            </div>
          </div>
          
          <div className="cta__content">
            {/* Header */}
            <h2 className="cta__title">
              Sẵn Sàng <span className="cta__title-highlight">Nâng Tầm</span>
              <br />
              Trận Đấu Của Bạn?
            </h2>
            
            <p className="cta__subtitle">
              Tham gia cuộc cách mạng đặt sân bóng đá. Kết nối với cộng đồng cầu thủ tuyệt vời,
              đặt sân chất lượng và trải nghiệm bóng đá như chưa từng có.
            </p>
            
            {/* CTA Buttons */}
            <div className="cta__buttons">
              <Link
                to="/booking"
                className="cta__button cta__button--primary"
              >
                <Zap className="cta__button-icon cta__button-icon--primary" />
                <span>Bắt Đầu Đặt Sân</span>
                <ArrowRight className="cta__button-arrow" />
              </Link>
              
              <Link
                to="/find-teammates"
                className="cta__button cta__button--secondary"
              >
                <Users className="cta__button-icon cta__button-icon--secondary" />
                <span>Tìm Cộng Đồng</span>
              </Link>
            </div>
            
            {/* Features Grid */}
            <div className="cta__features">
              <div className="cta__feature cta__feature--neon">
                <h3 className="cta__feature-title">Truy Cập Nhanh</h3>
                <p className="cta__feature-description">
                  Đặt sân chỉ trong vài giây với hệ thống đặt sân siêu tốc
                </p>
              </div>
              
              <div className="cta__feature cta__feature--purple">
                <h3 className="cta__feature-title">Ghép Thông Minh</h3>
                <p className="cta__feature-description">
                  Ghép đồng đội bằng AI dựa trên trình độ và sở thích
                </p>
              </div>
              
              <div className="cta__feature cta__feature--yellow">
                <h3 className="cta__feature-title">Chất Lượng Cao Cấp</h3>
                <p className="cta__feature-description">
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
