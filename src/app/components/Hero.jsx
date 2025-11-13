import { ArrowRight, MapPin, PlayCircle, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from '../../mocks/CallingAPI.js';
import HomeBackGround from "../assets/HomeBackGround.jpg";
import { useAuth } from '../hooks/AuthContext/AuthContext.jsx';
import "./Hero.css";

const Hero = () => {
  const { user } = useAuth();

  const [BOOKINGs, setBOOKINGs] = useState([]);
  const [SLOTs, setSLOTs] = useState([]);
  const [FIELDs, setFIELDs] = useState([]);
  const [VENUEs, setVENUEs] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = user?.token;
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const DataBookings = await fetchData('booking', token);
        console.log('DataBookings', DataBookings);
        const UserBookings = DataBookings?.filter(booking => booking.userId == user?.id);
        console.log('UserBookings', UserBookings);

        const DataSlots = await fetchData('slot', token);
        console.log('DataSlots', DataSlots);

        const DataFields = await fetchData('field', token);
        console.log('DataFields', DataFields);

        const DataVenues = await fetchData('venue', token);
        console.log('DataVenues', DataVenues);

        setBOOKINGs(UserBookings);
        setSLOTs(DataSlots);
        setFIELDs(DataFields);
        setVENUEs(DataVenues);

        const userData = await fetchData(`User/${user.id}`, token);
        setUserInfo(userData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const sortedBookings = [...BOOKINGs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  console.log('sortedBookings', sortedBookings);

  const suggessBookingRaw = sortedBookings[0];

  let suggessBooking = null;
  if (suggessBookingRaw) {
    const updatedBookingSlots = suggessBookingRaw.bookingSlots?.map(bs => {
      const slot = SLOTs.find(slot => slot.id == bs.slotId);
      return {
        ...bs,
        slot: slot || null,
      };
    }).sort((a, b) => {
      const aTime = a.slot?.startTime ?? '';
      const bTime = b.slot?.startTime ?? '';
      return aTime.localeCompare(bTime);
    });

    const field = FIELDs.find(field => field.id == suggessBookingRaw.fieldId);
    const venue = VENUEs.find(venue => venue.id == field.venueId);
    const totalAmount = updatedBookingSlots?.reduce((sum, item) => sum + (item.slot.price || 0), 0);
    console.log('totalAmount', totalAmount);

    suggessBooking = {
      ...suggessBookingRaw,
      bookingSlots: updatedBookingSlots || [],
      field: field || null,
      venue: venue || null,
      totalAmount: totalAmount,
    };
  }
  console.log('suggessBooking', suggessBooking);

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
              <div className="main">Your Next Game</div>
              <div className="highlight">START HERE</div>
              <div className="subtitle">Bắt đầu trận đấu tiếp theo ngay tại đây</div>
            </h1>

            <div className="desc">
              <span>Xnova</span>
              <span> – Nền tảng đặt sân đầu tiên tại Việt Nam ứng dụng AI, được thiết kế như người bạn đồng hành thể thao thông minh, giúp việc chơi thể thao dễ dàng và cá nhân hóa hơn.</span>
            </div>

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
          {suggessBooking &&
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
                  <h3 className="card-title">Gợi ý sân quen thuộc</h3>
                  <div className="location">
                    <MapPin className="loc-icon" />
                    <span>{suggessBooking?.venue?.name}</span>
                  </div>
                </div>

                <div className="info">
                  <div className="box time">
                    <div className="label green">Hôm nay</div>
                    {suggessBooking?.bookingSlots?.map((slot, i) => (
                      <div key={slot.slotId}>
                        <div className="value">{slot.slot?.startTime?.slice(0, 5)} - {slot.slot?.endTime?.slice(0, 5)}</div>
                      </div>
                    ))}
                    <div className="sub">{suggessBooking?.bookingSlots?.length / 2}h</div>
                  </div>
                  <div className="box price">
                    <div className="label purple">Tổng</div>
                    <div className="value">{suggessBooking?.totalAmount?.toLocaleString('vi-VN')} VND</div>
                    {/* <div className="sub">mỗi giờ</div> */}
                  </div>
                </div>

                {/* <div className="progress">
                <div className="progress-head">
                  <span className="label">Cần thêm cầu thủ</span>
                  <span className="status">Còn 3 chỗ</span>
                </div>
                <div className="bar">
                  <div className="fill"></div>
                </div>
              </div> */}

                <Link
                  to="/booking"
                  state={{ user, userInfo, section: "bookingHistory" }}
                >
                  <button className="join">ĐẶT SÂN NGAY</button>
                </Link>
              </div>
            </div>}
        </div>
      </div>
    </section >
  );
};

export default Hero;
