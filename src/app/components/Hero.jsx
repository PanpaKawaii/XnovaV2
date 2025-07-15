import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight, Star, Users, MapPin } from 'lucide-react';
import HomeBackGround from '../assets/HomeBackGround.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Background Elements */}
      <div className="hero__background-gradient"></div>
      {/* Background Image */}
      <img
        src={HomeBackGround}
        alt="Home Background"
        className="hero__background-image"
      />
      <div className="hero__floating-bg hero__floating-bg--left"></div>
      <div className="hero__floating-bg hero__floating-bg--right"></div>
      
      {/* Content */}
      <div className="hero__container">
        <div className="hero__grid">
          {/* Left Column */}
          <div className="hero__content">
            <div className="hero__rating">
              <div className="hero__stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="hero__star" />
                ))}
              </div>
              <span className="hero__rating-text">Được tin tưởng bởi hơn 10.000 cầu thủ</span>
            </div>
            
            <h1 className="hero__title">
              <span className="hero__title-main">Đặt Sân</span>
              <br />
              <span className="hero__title-highlight">
                Trong Mơ
              </span>
            </h1>
            
            <p className="hero__description">
              Tham gia cộng đồng bóng đá đỉnh cao. Đặt sân chất lượng, tìm đồng đội phù hợp,
              và nâng tầm trận đấu của bạn với nền tảng Xnova.
            </p>
            
            <div className="hero__actions">
              <Link to="/booking" className="hero__cta hero__cta--primary">
                <PlayCircle className="hero__cta-icon hero__cta-icon--rotate" />
                <span>Đặt Sân Ngay</span>
                <ArrowRight className="hero__cta-icon hero__cta-icon--arrow" />
              </Link>
              
              <Link to="/find-teammates" className="hero__cta hero__cta--secondary">
                <Users className="hero__cta-icon" />
                <span>Tìm Cầu Thủ</span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-number hero__stat-number--green">500+</div>
                <div className="hero__stat-label">Sân Cao Cấp</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number hero__stat-number--purple">50k+</div>
                <div className="hero__stat-label">Cầu Thủ Hoạt Động</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number hero__stat-number--yellow">25+</div>
                <div className="hero__stat-label">Thành Phố</div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="hero__card-container">
            <div className="hero__card">
              <div className="hero__card-badge">Live</div>
              
              <div className="hero__card-header">
                <h3 className="hero__card-title">Khung Giờ Sắp Tới</h3>
                <div className="hero__card-location">
                  <MapPin className="hero__location-icon" />
                  <span>Sân Cao Cấp - Trung Tâm</span>
                </div>
              </div>
              
              <div className="hero__card-info">
                <div className="hero__info-box hero__info-box--time">
                  <div className="hero__info-label hero__info-label--green">Hôm nay</div>
                  <div className="hero__info-value">18:00</div>
                  <div className="hero__info-subtitle">2 giờ</div>
                </div>
                <div className="hero__info-box hero__info-box--price">
                  <div className="hero__info-label hero__info-label--purple">Giá</div>
                  <div className="hero__info-value">1.000.000₫</div>
                  <div className="hero__info-subtitle">mỗi giờ</div>
                </div>
              </div>
              
              <div className="hero__progress-section">
                <div className="hero__progress-header">
                  <span className="hero__progress-label">Cần thêm cầu thủ</span>
                  <span className="hero__progress-status">Còn 3 chỗ</span>
                </div>
                <div className="hero__progress-bar">
                  <div className="hero__progress-fill"></div>
                </div>
              </div>
              
              <button className="hero__join-button">
                Tham Gia Trận Đấu
              </button>
            </div>
            
            {/* Floating Elements */}
            <div className="hero__floating-element hero__floating-element--purple">
              <Users className="hero__floating-icon" />
            </div>
            <div className="hero__floating-element hero__floating-element--green">
              <PlayCircle className="hero__floating-icon" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
