// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import './PaymentStatus.css';

// export default function PaymentStatus() {
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         // const paymentData = {
//         //     amount: parseInt(urlParams.get('vnp_Amount')) / 100,
//         //     bankCode: urlParams.get('vnp_BankCode'),
//         //     bankTranNo: urlParams.get('vnp_BankTranNo'),
//         //     orderInfo: urlParams.get('vnp_OrderInfo'),
//         //     payDate: urlParams.get('vnp_PayDate'),
//         //     responseCode: urlParams.get('vnp_ResponseCode'),
//         //     transactionNo: urlParams.get('vnp_TransactionNo'),
//         //     transactionStatus: urlParams.get('vnp_TransactionStatus'),
//         //     txnRef: urlParams.get('vnp_TxnRef')
//         // };
//         // setPaymentInfo(paymentData);
//         // console.log('paymentData', paymentData);

//         const messageParam = urlParams.get('message');
//         setMessage(messageParam);
//     }, []);

//     return (
//         <div className='payment-status'>
//             <div className='payment-status-content'>
//                 <div className='payment-status-card'
//                     style={{
//                         boxShadow: message && decodeURIComponent(message) === 'Thanh toán thành công' ? '5px 5px 10px 0 #28a74550' : '5px 5px 10px 0 #dc354550',
//                         color: message && decodeURIComponent(message) === 'Thanh toán thành công' ? '#28a745' : '#dc3545'
//                     }}>

//                     {message &&
//                         (decodeURIComponent(message) === 'Thanh toán thành công' ?
//                             <>
//                                 <h1><b>{decodeURIComponent(message)}</b></h1>
//                                 <i className='fa-solid fa-circle-check icon-check'></i>
//                                 {/* <p><b>Ngày thanh toán:</b> {new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19)}</p> */}
//                                 {/* <p><b>Phương thức thanh toán:</b> Thanh toán qua VNPay</p> */}
//                             </>
//                             :
//                             <>
//                                 <h1><b>{decodeURIComponent(message)}</b></h1>
//                                 <i className='fa-solid fa-circle-xmark icon-xmark'></i>
//                             </>
//                         )
//                     }
//                     {/* <p>Ngày giờ toISOString (GMT+7): {new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19)}</p>
//                     <p>Ngày giờ toISOString: {new Date().toISOString()}</p>
//                     <p>Ngày giờ toLocaleString: {new Date().toLocaleString()}</p> */}
//                     <div className='payment-active-button'>
//                         <Link to='/'><button>VỀ TRANG CHỦ</button></Link>
//                         <Link to='/profile'><button>XEM CHI TIẾT</button></Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./PaymentStatus.css";

export default function PaymentStatus() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const messageParam = urlParams.get('message');
        setMessage(decodeURIComponent(messageParam));
    }, []);

    return (
        <div className="payment-status">
            <div className="card">
                {message && (
                    message == 'Thanh toán thành công' ?
                        <>
                            <div className="icon">✓</div>
                            <div className="title success">{message}</div>
                        </>
                        :
                        <>
                            <div className="icon">×</div>
                            <div className="title fail">{message}</div>
                        </>
                )}
                <Link to='/'><button className="btn-continue">VỀ TRANG CHỦ</button></Link>
            </div>
        </div>
    )
}
