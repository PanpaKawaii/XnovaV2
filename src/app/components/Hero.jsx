import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight, Star, Users, MapPin } from 'lucide-react';
import HomeBackGround from '../assets/HomeBackGround.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Background */}
      <div className="bg-gradient"></div>
      <img src={HomeBackGround} alt="Home Background" className="bg-image" />
      <div className="float-bg left"></div>
      <div className="float-bg right"></div>

      {/* Content */}
      <div className="container">
        <div className="grid">
          {/* Left Column */}
          <div className="content">
            <div className="rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star" />
                ))}
              </div>
              <span className="rating-text">
                Xnova luôn đặt trải nghiệm của bạn lên hàng đầu
              </span>
            </div>

            <h1 className="title">
              <span className="main">Đặt Sân</span>
              <br />
              <span className="highlight">Trong Mơ</span>
            </h1>

            <p className="desc">
              Tham gia cộng đồng bóng đá đỉnh cao. Đặt sân chất lượng, tìm đồng đội phù hợp,
              và nâng tầm trận đấu của bạn với nền tảng Xnova.
            </p>

            <div className="actions">
              <Link to="/booking" className="cta primary">
                <PlayCircle className="icon rotate" />
                <span>Đặt Sân Ngay</span>
                <ArrowRight className="icon arrow" />
              </Link>

              <Link to="/find-teammates" className="cta secondary">
                <Users className="icon" />
                <span>Tìm Cầu Thủ</span>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="card-wrap">

            {/* Floating Icons */}
            <div className="float-item purple">
              <Users className="float-icon" />
            </div>
            <div className="float-item green">
              <PlayCircle className="float-icon" />
            </div>

            <div className="card">
              <div className="badge">Live</div>

              <div className="card-header">
                <h3 className="card-title">Khung Giờ Sắp Tới</h3>
                <div className="location">
                  <MapPin className="loc-icon" />
                  <span>Sân Cao Cấp - Trung Tâm</span>
                </div>
              </div>

              <div className="info">
                <div className="box time">
                  <div className="label green">Hôm nay</div>
                  <div className="value">18:00</div>
                  <div className="sub">2 giờ</div>
                </div>
                <div className="box price">
                  <div className="label purple">Giá</div>
                  <div className="value">1.000.000₫</div>
                  <div className="sub">mỗi giờ</div>
                </div>
              </div>

              <div className="progress">
                <div className="progress-head">
                  <span className="label">Cần thêm cầu thủ</span>
                  <span className="status">Còn 3 chỗ</span>
                </div>
                <div className="bar">
                  <div className="fill"></div>
                </div>
              </div>

              <button className="join">Tham Gia Trận Đấu</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
