import { useState } from 'react';
import { postData } from '../../../../../mocks/CallingAPI';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import './RewardList.css';

export default function RewardList({ vouchers }) {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const receiveVoucher = async (voucherId) => {
        setLoading(true);
        const UserVoucherData = {
            id: 0,
            receiveDate: new Date(),
            userId: user?.id,
            voucherId: voucherId,
        }
        const token = user?.token || null;

        try {
            await postData('UserVoucher', UserVoucherData, token);
        } catch (err) {
            setError(err.message);
            console.error('Error posting voucher data:', JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    };

    const getButtonColorClass = (points) => {
        if (points >= 20000) return 'yellow';
        if (points >= 10000) return 'green';
        return 'blue';
    }

    return (
        <div className='reward-list'>
            <div className='items'>
                {vouchers.map((v, index) => {
                    const itemClasses = index === 0 ? 'item selected' : 'item';
                    const buttonColorClass = getButtonColorClass(v.maxEffect);
                    return (
                        <div key={v.id} className={itemClasses}>
                            <div className='info'>
                                <i className='fa-solid fa-location-dot'></i>
                                <p className='description'>{v.name}</p>
                            </div>
                            <p className='min'>Đơn tối thiểu {v.minEffect?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <p className='max'>Giảm tối đa {v.maxEffect?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <div className='action'>
                                {/* <span className='points'>{v.points}</span> */}
                                <button className={`button ${buttonColorClass}`} onClick={() => receiveVoucher(v.id)}>{v.minEffect} Nova</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
