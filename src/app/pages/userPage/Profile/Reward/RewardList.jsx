import { Gift } from 'lucide-react';
import { useState } from 'react';
import { postData } from '../../../../../mocks/CallingAPI';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import './RewardList.css';

export default function RewardList({ vouchers, setThisUser }) {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const receiveVoucher = async (voucherId, cost) => {
    //     setLoading(true);
    //     const token = user?.token || null;
    //     const UserVoucherData = {
    //         userId: user?.id,
    //         voucherId: voucherId,
    //         voucherPoint: cost,
    //         receiveDate: new Date(),
    //     }
    //     console.error('UserVoucherData', UserVoucherData);
    //     try {
    //         const postDataResponse = await postData('UserVoucher/create', UserVoucherData, token);
    //         console.error('postDataResponse', postDataResponse);
    //         setUserPoint({ point: postDataResponse?.remainingPoint });
    //     } catch (err) {
    //         setError(err.message);
    //         console.error('Error posting voucher data:', JSON.stringify(err));
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const receiveVoucher = async (voucherId, cost) => {
        setLoading(true);
        const token = user?.token || null;
        const UserVoucherData = {
            userId: user?.id,
            voucherId: voucherId,
            voucherPoint: cost,
            receiveDate: new Date(),
        }
        console.log('UserVoucherData', UserVoucherData);
        try {
            const postDataResponse = await postData('UserVoucher/create', UserVoucherData, token);
            console.log('postDataResponse', postDataResponse);
            setThisUser(prevUser => ({ ...prevUser, point: postDataResponse?.remainingPoint }));
        } catch (err) {
            setError(err && JSON.stringify(err));
            console.error('Error posting voucher data:', JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    };

    const getButtonColorClass = (points) => {
        if (points >= 200) return 'yellow';
        if (points >= 100) return 'green';
        return 'blue';
    }

    const voucherCost = [80, 160, 220, 260, 50, 90, 120, 150];

    return (
        <div className='reward-list'>
            <div className='items'>
                {vouchers.map((v, index) => {
                    const itemClasses = index === 0 ? 'item selected' : 'item';
                    const buttonColorClass = getButtonColorClass(voucherCost[index]);
                    return (
                        <div key={v.id} className={itemClasses}>
                            <div className='info'>
                                <Gift />
                                {/* <i className='fa-solid fa-location-dot'></i> */}
                                <p className='description'>{v.name}</p>
                            </div>
                            <p className='min'>Đơn tối thiểu {v.minEffect?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <p className='max'>Giảm tối đa {v.maxEffect?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <div className='action'>
                                {/* <span className='points'>{v.points}</span> */}
                                <button className={`button ${buttonColorClass}`} onClick={() => receiveVoucher(v.id, voucherCost[index])}>{voucherCost[index]} Nova</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
