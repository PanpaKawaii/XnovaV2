import React, { useEffect, useState } from 'react';
import Login from './Login/Login';
import Register from './Register/Register';
import './LoginRegister.css';

// import LoginImage from '../../assets/Purple.png';
// import RegisterImage from '../../assets/Green.png';
// import Transparent from '../../assets/Transparent.png';
// import JellyFish from '../../assets/JellyFish.png';

export default function LoginRegister({ isOpen, setIsLoginModalOpen }) {
    console.log('Login-Register');

    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className='loginregister-container'>
            <div className='card-box'>
                <div className='bg-pattern-1'></div>
                <div className='bg-pattern-2'></div>
                {isLogin ?
                    <Login setIsLogin={setIsLogin} setIsLoginModalOpen={setIsLoginModalOpen} />
                    :
                    <Register setIsLogin={setIsLogin} />
                }
                <button className='close-button' onClick={() => setIsLoginModalOpen(false)}>
                    <i className='fa-solid fa-xmark'></i>
                </button>
                {/* <div className='moving-image' id='MovingImage'></div> */}
            </div>
        </div>
    )
}
