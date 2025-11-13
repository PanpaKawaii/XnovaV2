import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PaymentStatus.css';

export default function PaymentStatus() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const messageParam = urlParams.get('message');
        setMessage(decodeURIComponent(messageParam));
    }, []);

    return (
        <div className='payment-status'>
            <div className='card'>
                {message ?
                    (message == 'Thanh toán thành công' ?
                        <>
                            <div className='icon'>✓</div>
                            <div className='title success'>{message}</div>
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
                <Link to='/'><button className='btn-continue'>VỀ TRANG CHỦ</button></Link>
            </div>
        </div>
    )
}
