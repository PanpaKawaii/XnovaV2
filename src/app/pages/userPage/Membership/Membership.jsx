import { useEffect, useState } from 'react';
import { fetchData, postData } from '../../../../mocks/CallingAPI';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import './Membership.css';

export default function Membership() {
    const { user } = useAuth();

    const [thisUser, setThisUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const amount = 79000;

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            const token = user?.token || null;
            try {
                const thisUserData = await fetchData(`User/${user?.id}`, token);
                console.log('thisUserData', thisUserData);
                setThisUser(thisUserData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id]);

    const Purchase = async () => {
        setLoading(true);
        const token = user?.token || null;
        try {
            // const BookingData = {
            //     id: 0,
            //     date: new Date().toLocaleDateString('en-CA'),
            //     rating: 0,
            //     feedback: '',
            //     currentDate: new Date(),
            //     status: 2,
            //     userId: user?.id,
            //     fieldId: 45,
            //     slotIds: [508],
            // };
            // console.log('BookingData:', BookingData);

            // const result = await postData('Booking', BookingData, token);
            // console.log('result', result);

            const result = await fetchData('Booking', token);
            console.log('result', result);
            const maxBooking = result?.reduce((max, item) =>
                item.id > max.id ? item : max
            )?.id;
            console.log('maxBooking', maxBooking);

            // if (result.id) {
            if (maxBooking) {
                const PaymentData = {
                    // orderId: result.id,
                    orderId: maxBooking + 1,
                    amount: amount,
                };
                console.log('PaymentData:', PaymentData);

                const resultPaymentData = await postData('Payment/create-payos-voucher', PaymentData, token);
                console.log('resultPaymentData', resultPaymentData);
                window.location.href = resultPaymentData.paymentUrl;
            }
        } catch (err) {
            console.error('Error', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
    ];

    // console.log('Date: ', (new Date().toLocaleString()?.replace(':', '')?.replace(':', '')?.replace(' ', '')?.replace('/', '')?.replace('/', '')) + 'ID' + user?.id);
    // console.log('Date: ', Number(new Date().toLocaleString()?.replace(':', '')?.replace(':', '')?.replace(' ', '')?.replace('/', '')?.replace('/', '')) * 1000 + Number(user?.id));
    // console.log('Date: ', (new Date())?.getTime());

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
                        <button className='btn' disabled>MẶC ĐỊNH</button>
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
                        <button
                            className='btn'
                            onClick={() => Purchase()}
                            disabled={
                                loading
                                || thisUser?.type == 'VIP'
                            }
                        >
                            {loading ? 'ĐANG XỬ LÝ...' : (thisUser?.type == 'VIP' ? 'BẠN ĐANG SỬ DỤNG GÓI VIP' : `ĐĂNG KÝ NGAY ${amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
