import React from 'react'

const CheckValidation = (Email, Name, Phone, Password, Confirm, Accept) => {

    if (!Email) {
        console.error('Invalid email');
        return {
            value: 'Email không hợp lệ',
            name: 'Email',
        };
    }
    if (!Name) {
        console.error('Invalid full name');
        return {
            value: 'Họ tên không hợp lệ',
            name: 'Name',
        };
    }
    if (!Phone) {
        console.error('Invalid phone number');
        return {
            value: 'Số điện thoại không hợp lệ',
            name: 'Phone',
        };
    }
    if (!Password) {
        console.error('Invalid password');
        return {
            value: 'Mật khẩu không hợp lệ',
            name: 'Password',
        };
    }
    if (!Confirm) {
        console.error('Invalid password confirmation');
        return {
            value: 'Xác nhận mật khẩu không hợp lệ',
            name: 'Confirm',
        };
    }

    if (!/^\d+$/.test(Phone)) {
        console.error('Phone number must contain only digits');
        return {
            value: 'Số điện thoại không hợp lệ',
            name: 'Phone',
        };
    }
    if (Phone.length !== 10) {
        console.error('Phone number must contain exactly 10 digits');
        return {
            value: 'Số điện thoại phải có 10 chữ số',
            name: 'Phone',
        };
    }
    if (Password.length < 6) {
        console.error('Password must be at least 6 characters long');
        return {
            value: 'Mật khẩu phải ít nhất 6 kí tự',
            name: 'Password',
        };
    }
    if (Password != Confirm) {
        console.error('Wrong password confirmation');
        return {
            value: 'Mật khẩu xác nhận không khớp',
            name: 'Password or Confirm',
        };
    }
    if (Accept === false) {
        console.error('Accept is false');
        return {
            value: 'Bạn chưa đồng ý điều khoản',
            name: 'Accept',
        };
    }

    return {
        value: 'OK',
        name: 'OK',
    };
}

export default CheckValidation;