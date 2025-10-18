import { useEffect, useState } from 'react';
import { fetchData } from '../../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import RewardList from './RewardList.jsx';
import Spinner from './Spinner.jsx';
import RewardResult from './RewardResult.jsx';

export default function RandomWheel() {
    const { user } = useAuth();

    // API data states
    const [vouchers, setVouchers] = useState([]);
    const [result, setResult] = useState('');
    const [PopupOpen, setPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch venue data when modal opens
    useEffect(() => {
        const fetchVoucherData = async () => {
            const token = user?.token || null;
            try {
                const vouchersResponse = await fetchData('Voucher', token);
                setVouchers(vouchersResponse);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching voucher data:', JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };

        fetchVoucherData();
    }, [user?.token]);


    const names = ['An', 'Binh', 'Cuong', 'Duong', 'En', 'Giang', 'Huong', 'In', 'Khanh', 'Linh', 'Manh', 'Nhan', 'Oanh', 'Phuoc', 'Quynh', 'Rot', 'Son', 'Thien', 'Uyen', 'Viet', 'Xinh', 'Yen'];
    const name = [1, 2, 3, 4, 5, 6];

    return (
        <div className=''>
            <Spinner items={vouchers} setResult={setResult} setPopupOpen={setPopupOpen} />
            <RewardResult result={result} PopupOpen={PopupOpen} setPopupOpen={setPopupOpen} />
            <RewardList vouchers={vouchers} />
        </div>
    )
}
