import React from 'react';
import './Membership.css';

export default function Membership() {

    const Purchase = async () => {
        window.location.href = '/payment-status/?membership=vip';
    }

    const features = [
        { name: 'Đặt sân theo thời gian thực', type: 'Regular' },
        { name: 'Xem giờ trống, giá sân, địa điểm', type: 'Regular' },
        { name: 'Đánh giá và xem đánh giá sân', type: 'Regular' },
        { name: 'Tích điểm đổi quà', type: 'Regular' },
        { name: 'Gợi ý sân gần nhất', type: 'Regular' },
        { name: 'Gợi ý sân theo thói quen', type: 'Regular' },
        { name: 'Ưu đãi (Dùng điểm đổi)', type: 'Regular' },
        { name: 'Nhắc lịch tự động (Khi đã đặt)', type: 'Regular' },
        { name: 'Tạo nhóm chơi', type: 'Regular' },
        { name: 'Tạo giải đấu', type: 'VIP' },
        { name: 'Gợi ý khung giờ trống phù hợp nhóm bạn', type: 'VIP' },
        { name: 'Nhắc lịch đặt sân (Khi chưa đặt)', type: 'VIP' },
        { name: 'Nhận voucher siêu hot', type: 'VIP' },
        { name: 'Tặng điểm mỗi tháng', type: 'VIP' },
        { name: 'Hủy đặt sân hoàn tiền', type: 'VIP' },
    ]

    return (
        <div className='membership'>
            <h1 className='title'>Chọn gói thành viên</h1>

            <div className='plans'>
                <div className='card-normal'>
                    <div className='content'>
                        <div className='plan-title'>Regular</div>
                        <ul>
                            {features?.map((feature, idx) => (
                                <li key={idx}>
                                    <div className='feature'>
                                        <div>{feature.name}</div>
                                        <i className={`fa-solid fa-${feature.type == 'Regular' ? 'check' : 'xmark'}`}></i>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className='btn' disabled>ĐANG SỬ DỤNG</button>
                    </div>
                </div>

                <div className='card-border'>
                    <div className='content'>
                        <div className='plan-title'>VIP</div>
                        <ul>
                            {features?.map((feature, idx) => (
                                <li key={idx}>
                                    <div className='feature'>
                                        <div>{feature.name}</div>
                                        <i className={`fa-solid fa-${feature.type !== '' ? 'check' : 'xmark'}`}></i>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className='btn' onClick={() => Purchase()}>ĐĂNG KÝ NGAY</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
