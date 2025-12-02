import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchData, patchData } from '../../../mocks/CallingAPI';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import './PaymentStatus.css';

export default function PaymentStatus() {
    const { user } = useAuth();

    const [message, setMessage] = useState('');
    const [thisUser, setThisUser] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const messageParam = urlParams.get('message');
        setMessage(decodeURIComponent(messageParam));
        if (
            messageParam.includes('Membership')
            && messageParam == 'Thanh toán Membership thành công'
        ) {
            console.log('Set');
            if (!localStorage.getItem('ActivateMembership')) {
                localStorage.setItem('ActivateMembership', 'ReadyToActivate');
            }
            console.log('Set DONE');
        }
    }, []);

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
    }, [user?.id, refresh]);

    const changeUserType = async (type) => {
        setLoading(true);
        const token = user?.token || null;
        try {
            const UserData = {
                name: thisUser?.name,
                type: type,
            };
            console.log('UserData:', UserData);

            const result = await patchData(`User/${user?.id}`, UserData, token);
            console.log('result', result);

            if (result?.message == 'Cập nhật người dùng thành công.' && type == 'VIP') {
                localStorage.removeItem('ActivateMembership');
            }
            if (result?.message == 'Cập nhật người dùng thành công.' && type == 'Regular') {
                localStorage.setItem('ActivateMembership', 'ReadyToActivate');
            }
        } catch (err) {
            console.error('Error', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefresh(p => p + 1);
        }
    }

    const ActivateMembership = localStorage.getItem('ActivateMembership');

    return (
        <div className='payment-status'>
            <div className='card'>
                {message ?
                    ((message == 'Thanh toán thành công' || message == 'Thanh toán Membership thành công') ?
                        <>
                            <div className='icon'>✓</div>
                            <div className='title success'>{message}</div>
                            {/* <div className='title success'>Thanh toán thành công</div> */}
                            {/* <div className='title success'>Thanh toán Membership thành công</div> */}
                            {/* <div className='title fail'>Thanh toán không thành công</div> */}
                            {/* <div className='title fail'>Thanh toán thất bại</div> */}
                        </>
                        :
                        <>
                            <div className='icon'>×</div>
                            <div className='title fail'>{message}</div>
                        </>
                    )
                    :
                    <div className='icon'><i className='fa-solid fa-spinner' /></div>
                }
                <div className='buttons'>
                    {(ActivateMembership && message == 'Thanh toán Membership thành công') &&
                        <>
                            {ActivateMembership == 'ReadyToActivate' &&
                                <button className='btn-in-payment-status' onClick={() => changeUserType('VIP')} disabled={loading}>
                                    {loading ? 'ĐANG KÍCH HOẠT...' : 'KÍCH HOẠT MEMBERSHIP ✓'}
                                </button>
                            }
                        </>
                    }
                    {(!ActivateMembership && thisUser?.type == 'VIP') &&
                        <button className='btn-in-payment-status' disabled={thisUser?.type == 'VIP'}>BẠN ĐÃ KÍCH HOẠT MEMBERSHIP</button>
                    }
                    <Link to='/'><button className='btn-in-payment-status'>VỀ TRANG CHỦ</button></Link>
                    {/* <div>Controll Button</div>
                    <button className='btn-in-payment-status' onClick={() => localStorage.setItem('ActivateMembership', 'ReadyToActivate')}>SET ReadyToActivate</button>
                    <button className='btn-in-payment-status' onClick={() => localStorage.removeItem('ActivateMembership')}>REMOVE</button>
                    <div>Navigate</div>
                    <Link to='/payment-status/?message=Thanh%20toán%20Membership%20thành%20công'><button className='btn-in-payment-status'>Thanh toán Membership thành công</button></Link>
                    <Link to='/payment-status/?message=Thanh%20toán%20thành%20công'><button className='btn-in-payment-status'>Thanh toán thành công</button></Link>
                    <Link to='/payment-status/?message=Thanh%20toán%20không%20thành%20công'><button className='btn-in-payment-status'>Thanh toán không thành công</button></Link>
                    <div>{thisUser?.name} - {thisUser?.type}</div>
                    <button className='btn-in-payment-status' onClick={() => changeUserType('Regular')}>BỎ KÍCH HOẠT</button> */}
                </div>
            </div>
        </div>
    )
}
