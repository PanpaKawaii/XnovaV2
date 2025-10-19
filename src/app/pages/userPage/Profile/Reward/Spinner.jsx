import { useState } from 'react';
import { postData } from '../../../../../mocks/CallingAPI';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import './Spinner.css';

export default function Spinner({ items, setResult, setPopupOpen }) {
    const { user } = useAuth();

    const [randomDegree, setRandomDegree] = useState(0);
    const [loading, setLoading] = useState(false);
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

    const numItems = items.length;
    const anglePerItem = 360 / numItems;
    const hueStep = 360 / numItems;

    const gradientColors = items.map((_, index) => {
        const currentHue = Math.round((numItems == 101 ? index : index * 101) * hueStep);
        const color = `hsl(${currentHue}, 90%, 60%)`;
        const startAngle = index * anglePerItem;
        const endAngle = (index + 1) * anglePerItem;
        return `${color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const getRandomDegree = async () => {

        const spinnerWheel = document.getElementsByClassName('spinner-wheel');
        Array.from(spinnerWheel).forEach(w => {
            w.style.animation = 'none';
        });
        await sleep(10);

        const NewRandomDegree = randomDegree + Math.floor(Math.random() * 360) + 3600;
        setRandomDegree(NewRandomDegree);
        await sleep(5100);

        setResult(items[Math.floor((NewRandomDegree) % 360 / anglePerItem)]);
        setPopupOpen(true);
        receiveVoucher(items[Math.floor((NewRandomDegree) % 360 / anglePerItem)]?.id);
    }

    return (
        <div className='spinner-container'>
            <div
                className='spinner-wheel'
                style={{
                    background: `conic-gradient(${gradientColors})`,
                    transform: `rotateZ(${randomDegree}deg)`
                }}>
                {items.map((item, index) => {
                    const rotationAngle = index * anglePerItem + anglePerItem / 2 + 90;
                    return (
                        <div key={index} className='spinner-text' style={{ transform: `translate(-50%, -50%) rotateZ(${-rotationAngle}deg) translateX(100px)` }}>
                            {item.name}
                        </div>
                    );
                })}
            </div>
            <div className='spinner-pointer'></div>
            <div className='spinner-center' onClick={() => getRandomDegree()}></div>
        </div>
    )
}
