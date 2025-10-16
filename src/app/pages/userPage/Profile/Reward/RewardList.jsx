import React from 'react';
import './RewardList.css'; // Import file CSS thuần

const rewardsData = [
    { id: 1, description: 'Giảm 10% cho lần đặt sân tiếp theo', points: 30 },
    { id: 2, description: 'Tặng thêm 1 giờ chơi miễn phí', points: 50 },
    { id: 3, description: 'Kích hoạt gói Premium 1 tuần', points: 100 },
    { id: 4, description: 'Voucher 200.000đ sân VIP', points: 200 },
    { id: 5, description: 'Voucher 300.000đ sân VIP', points: 500 },
];

function getButtonColorClass(points) {
    if (points >= 500) return 'yellow';
    if (points >= 100) return 'green';
    return 'blue';
}

export default function RewardList() {
    return (
        // Class cha bao bọc toàn bộ component
        <div className="reward-list">
            <div className="items">
                {rewardsData.map((reward, index) => {
                    // Dùng 2 class riêng biệt: 'item' và 'selected'
                    const itemClasses = index === 0 ? "item selected" : "item";
                    const buttonColorClass = getButtonColorClass(reward.points);

                    return (
                        <div key={reward.id} className={itemClasses}>
                            <div className="info">
                                <i className='fa-solid fa-location-dot'></i>
                                <p className="description">{reward.description}</p>
                            </div>
                            <div className="action">
                                <span className="points">{reward.points}</span>
                                {/* Nút có class 'button' và class màu */}
                                <button className={`button ${buttonColorClass}`}>
                                    Nova
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
