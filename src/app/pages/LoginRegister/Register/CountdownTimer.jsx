import React, { useState, useEffect } from 'react';
import CheckValidation from './CheckValidation';

const THOI_GIAN_BAT_DAU = 5;

export default function CountdownTimer({ DoAction, EmailRef, NameRef, PhoneRef, PasswordRef, ConfirmRef, Accept }) {

    const [SecondsLeft, setSecondsLeft] = useState(THOI_GIAN_BAT_DAU);
    const [isActive, setIsActive] = useState(false);

    console.log('Time: ', SecondsLeft);

    useEffect(() => {
        if (isActive && SecondsLeft > 0) {
            const interval = setInterval(() => {
                setSecondsLeft((prevSeconds) => prevSeconds - 1);
            }, 1000);
            return () => { clearInterval(interval) };
        }
        resetTimer();
    }, [isActive, SecondsLeft]);

    const toggleTimer = () => {
        console.log('EmailRef', EmailRef.current.value);
        console.log('NameRef', NameRef.current.value);
        console.log('PhoneRef', PhoneRef.current.value);
        console.log('PasswordRef', PasswordRef.current.value);
        console.log('ConfirmRef', ConfirmRef.current.value);
        console.log('Accept', Accept);

        const Email = EmailRef.current.value;
        const Name = NameRef.current.value;
        const Phone = PhoneRef.current.value;
        const Password = PasswordRef.current.value;
        const Confirm = ConfirmRef.current.value;

        const Validate = CheckValidation(Email, Name, Phone, Password, Confirm, Accept);
        console.log('Validate: ', Validate);
        if (Validate.value != 'OK') {
            console.log('Validation Is False');
            return;
        } else {
            setIsActive(true);
        }
        DoAction();
    };

    const resetTimer = () => {
        setIsActive(false);
        setSecondsLeft(THOI_GIAN_BAT_DAU);
    };

    const minutes = Math.floor(SecondsLeft / 60);
    const remainingSeconds = SecondsLeft % 60;
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return (
        <button
            type='submit'
            className='btn'
            onClick={toggleTimer}
            disabled={isActive}
        >
            {isActive ? `${minutes}:${formattedSeconds}` : 'GỬI OTP'}
        </button>
    );
}
