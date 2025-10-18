import { useState } from 'react';
import Login from './Login/Login';
import './LoginRegister.css';
import Register from './Register/Register';

export default function LoginRegister({ isOpen, setIsLoginModalOpen }) {
    console.log('Login-Register');

    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className='loginregister-container'>
            {/* <div className='card-box'> */}
                <div className='bg-pattern-1'></div>
                <div className='bg-pattern-2'></div>
                {isLogin ?
                    <Login setIsLogin={setIsLogin} setIsLoginModalOpen={setIsLoginModalOpen} />
                    :
                    <Register setIsLogin={setIsLogin} setIsLoginModalOpen={setIsLoginModalOpen} />
                }
            {/* </div> */}
        </div>
    )
}
