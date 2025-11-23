import { useEffect, useState } from 'react';
import { fetchData, patchData, postData } from '../../../../../mocks/CallingAPI';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import './Spinner.css';

export default function Spinner({ items, setResult, setPopupOpen, thisUser, setThisUser }) {
    const { user } = useAuth();

    const [randomDegree, setRandomDegree] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const receiveVoucher = async (voucherId, point) => {
        setLoading(true);
        const token = user?.token || null;
        const UserVoucherData = {
            userId: user?.id,
            voucherId: voucherId,
            voucherPoint: point,
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

    const numItems = items.length;
    const anglePerItem = 360 / numItems;
    const hueStep = 360 / numItems;

    const gradientColors = items.map((_, index) => {
        const currentHue = Math.round((numItems == 101 ? index : index * 101) * hueStep);
        const color = `hsl(${currentHue}, 90%, 30%)`;
        const startAngle = index * anglePerItem;
        const endAngle = (index + 1) * anglePerItem;
        return `${color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const getRandomDegree = async () => {
        setError(null);
        if (thisUser?.point < 100) {
            setError('Not enough points to spin the wheel!');
            return;
        }
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
        receiveVoucher(items[Math.floor((NewRandomDegree) % 360 / anglePerItem)]?.id, 100);
    }

    const addPoint = async () => {
        setLoading(true);
        const token = user?.token || null;
        const UserData = { name: thisUser?.name, point: (thisUser?.point || 0) + 100 };
        console.log('UserData', UserData);
        try {
            const postDataResponse = await patchData(`User/${user?.id}`, UserData, token);
            console.log('postDataResponse', postDataResponse);
            setThisUser({ ...thisUser, point: UserData?.point });
        } catch (err) {
            setError(err && JSON.stringify(err));
            console.error('Error adding point data:', JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='spinner-container'>
            <div className='spinner'>
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
                <div className='spinner-center' onClick={() => getRandomDegree()}>ROLL</div>
            </div>
            <div className='point'>Balance: {thisUser?.point || '0'} Nova</div>
            {/* <button className='btn' onClick={() => addPoint()}>Add Point</button> */}
            <div className='cost'>Cost: 100 Nova / Roll</div>
            {error && <div className='error'>{error}</div>}
        </div>
    )
}
