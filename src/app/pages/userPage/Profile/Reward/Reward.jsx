import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import { useTheme } from '../../../../hooks/ThemeContext';
import SubUserHeader from '../../../../layouts/UserLayout/SubUserHeader/SubUserHeader.jsx';
import Voucher from '../Voucher.jsx';
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

    const [thisUser, setThisUser] = useState(null);
    console.log('thisUser', thisUser);

    useEffect(() => {
        (async () => {
            const token = user?.token || null;
            try {
                const userResponse = await fetchData(`User/${user?.id}`, token);
                console.log('userResponse', userResponse);
                const UserData = {
                    id: userResponse?.id,
                    name: userResponse?.name,
                    email: userResponse?.email,
                    password: userResponse?.password,
                    image: userResponse?.image,
                    role: userResponse?.role,
                    description: userResponse?.description,
                    phoneNumber: userResponse?.phoneNumber,
                    point: userResponse?.point,
                    type: userResponse?.type,
                    status: userResponse?.status
                };
                setThisUser(UserData);
            } catch (err) {
                setError(err && JSON.stringify(err));
                console.error('Error fetching user data:', JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    useEffect(() => {
        const fetchVoucherData = async () => {
            const token = user?.token || null;
            try {
                const vouchersResponse = await fetchData('Voucher', token);
                console.log('vouchersResponse', vouchersResponse);

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

    return (
        <div className={`reward-management ${theme} custom-container`}>
            <SubUserHeader activeTab={activeTab} onTabChange={handleTabChange} />
            <Spinner items={vouchers} setResult={setResult} setPopupOpen={setPopupOpen} thisUser={thisUser} setThisUser={setThisUser} />
            <RewardResult result={result} PopupOpen={PopupOpen} setPopupOpen={setPopupOpen} />
            <RewardList vouchers={vouchers} setThisUser={setThisUser} />
            <div style={{
                maxWidth: '800px',
                margin: 'auto',
                padding: '20px',
            }}>
                <Voucher />
            </div>
        </div>
    )
}
