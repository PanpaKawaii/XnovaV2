import './RewardResult.css';

export default function RewardResult({ result, PopupOpen, setPopupOpen }) {
    console.log('RewardResult');

    return (
        <div id='RewardResult' className={`overlay ${!PopupOpen ? 'hidden' : ''}`}>
            <div className='popup'>
                <i className='fa-solid fa-xmark' onClick={() => setPopupOpen(false)}></i>
                <div className='title'>CHÚC MỪNG</div>
                <div>Bạn đã nhận được "{result?.name}"</div>
                <button className='btn' onClick={() => setPopupOpen(false)}>NHẬN VOUCHER</button>
            </div>
        </div>
    )
}
