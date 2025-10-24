import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import { useTheme } from '../../../../hooks/ThemeContext';
import SubUserHeader from '../../../../layouts/UserLayout/SubUserHeader/SubUserHeader.jsx';
import RewardList from './RewardList.jsx';
import RewardResult from './RewardResult.jsx';
import Spinner from './Spinner.jsx';

export default function Reward() {
    const { user } = useAuth();

    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const passedUser = location.state?.user || {};
    const passedUserInfo = location.state?.userInfo || {};
    const [activeTab, setActiveTab] = useState('reward');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'profile') {
            navigate('/profile', {
                state: {
                    user: passedUser,
                    userInfo: passedUserInfo
                }
            });
        } else if (tab === 'team') {
            navigate('/team', {
                state: {
                    user: passedUser,
                    userInfo: passedUserInfo
                }
            });
        }
    };

    const [vouchers, setVouchers] = useState([]);
    const [result, setResult] = useState('');
    const [PopupOpen, setPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className={`reward-management ${theme} custom-container`}>
            <SubUserHeader activeTab={activeTab} onTabChange={handleTabChange} />
            <Spinner items={vouchers} setResult={setResult} setPopupOpen={setPopupOpen} />
            <RewardResult result={result} PopupOpen={PopupOpen} setPopupOpen={setPopupOpen} />
            <RewardList vouchers={vouchers} />
        </div>
    )
}
