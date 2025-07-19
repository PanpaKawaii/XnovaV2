import { useRef, useState } from 'react';
import { postData } from '../../../../mocks/CallingAPI.js';
import LogoImage from '../../../assets/LOGO.png';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import CheckValidation from './CheckValidation.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import './Register.css';

export default function Register({ setIsLogin, setIsLoginModalOpen }) {
    console.log('Register');
    const { login } = useAuth();

    const ResetRegisterInputs = () => {
        var inputs = document.querySelectorAll('input');
        inputs.forEach(function (input) {
            input.value = '';
        });
        setRegisterError({ value: '', name: '' });
        setRegisterSuccess('');
    };

    const [showPassword, setShowPassword] = useState(false);
    const [Accept, setAccept] = useState(false);
    const [loading, setLoading] = useState(false);
    const [RegisterError, setRegisterError] = useState({ value: '', name: '' });
    const [RegisterSuccess, setRegisterSuccess] = useState(null);

    const SendOTP = async (Email, Name, Phone, Password, Confirm) => {

        const Validate = CheckValidation(Email, Name, Phone, Password, Confirm, Accept);
        console.log('Validate: ', Validate);
        if (Validate.value != 'OK') {
            console.log('Validation Is False');
            setRegisterError(Validate);
            setRegisterSuccess('');
            return;
        }

        const RegisterData = {
            name: Name,
            email: Email,
            password: Password,
            image: 'https://i.pinimg.com/736x/b0/91/5f/b0915f3c86472ea1ad3d1472cebd6c15.jpg',
            role: 'Customer',
            description: '',
            phoneNumber: Phone,
            point: 0,
            type: 'Regular',
        };
        console.log('RegisterData:', RegisterData);

        try {
            setLoading(true);
            const result = await postData('User/register-request', RegisterData, '');
            console.log('result', result);

            setRegisterSuccess('Gửi OTP thành công!');
            setRegisterError({ value: '', name: '' });
            setLoading(false);
        } catch (error) {
            console.log('Gửi OTP thất bại:', error);
            setRegisterError({ value: 'Gửi OTP thất bại', name: 'Email or OTP' });
            setRegisterSuccess('');
            setLoading(false);
        }
    };

    const handleSendOTP = (e) => {
        e.preventDefault();
        setRegisterError({ value: '', name: '' });
        setRegisterSuccess('');
        const Email = e.target.email.value;
        const Name = e.target.name.value;
        const Phone = e.target.phone.value;
        const Password = e.target.password.value;
        const Confirm = e.target.confirm.value;
        console.log({
            Email,
            Name,
            Phone,
            Password,
            Confirm,
            Accept,
        });
        SendOTP(
            Email,
            Name,
            Phone,
            Password,
            Confirm
        );
    };

    const handleAccept = () => {
        setAccept(p => !p);
    };


    const SubmitRegister = async (Email, OTP) => {

        console.log('CHECK OTP ======================================');

        const CheckOTP = {
            email: Email,
            otp: OTP,
        };
        console.log('CheckOTP:', CheckOTP);

        try {
            setLoading(true);
            const result = await postData('User/register-confirm', CheckOTP, '');
            console.log('result', result);

            // if (data.role && data.role === 'User') { }
            setRegisterSuccess('Đăng kí thành công!');
            setRegisterError({ value: '', name: '' });
            setLoading(false);
            login(result);
            setIsLoginModalOpen(false);
        } catch (error) {
            console.log('Đăng kí thất bại:', error);
            setRegisterError({ value: 'Đăng kí thất bại', name: 'Email or OTP' });
            setRegisterSuccess('');
            setLoading(false);
        }
    };



    const EmailRef = useRef(null);
    const NameRef = useRef(null);
    const PhoneRef = useRef(null);
    const PasswordRef = useRef(null);
    const ConfirmRef = useRef(null);

    const OTPRef = useRef(null);

    const handleSubmitRegister = (e) => {
        e.preventDefault();
        setRegisterError({ value: '', name: '' });
        setRegisterSuccess('');
        const Email = EmailRef.current.value;
        const OTP = OTPRef.current.value;
        if (!Email || !OTP) {
            setRegisterError({ value: 'Email hoặc OTP không hợp lệ', name: 'OTP' });
            setRegisterSuccess('');
            return;
        }
        console.log({
            Email,
            OTP
        });
        SubmitRegister(
            Email,
            OTP
        );
    };


    const formRef = useRef(null);
    const handleSendOtpFromOutSide = () => {
        console.log("Nút bên ngoài đã được nhấn!");
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    // const EmailRef = useRef(null);
    // const [DisabledInput, setDisabledInput] = useState(true);
    // // Hàm được gọi khi nhấn nút
    // const handleCheckLength = () => {
    //     // 2. Truy cập trực tiếp vào phần tử DOM thông qua `EmailRef.current`
    //     // và lấy giá trị của nó bằng `.value`
    //     const currentValue = EmailRef.current.value;

    //     if (!currentValue) {
    //         alert(`Nhập mail đi ba: "${currentValue}"`);
    //     } else {
    //         alert(`Nhập OTP đi ${currentValue}`);
    //         setDisabledInput(false);
    //     }

    //     // Bạn cũng có thể tương tác trực tiếp với DOM, ví dụ: focus vào input
    //     // EmailRef.current.focus();
    // };

    // // State cho chuỗi điều kiện (ví dụ: mã PIN)
    // const [PinCode, setPinCode] = useState('');

    // // State cho input bạn muốn kiểm soát
    // const [DisabledData, setDisabledData] = useState('');

    // --- Logic kiểm soát cốt lõi ---
    // Biến boolean này sẽ quyết định input có bị vô hiệu hóa hay không.
    // Input sẽ bị vô hiệu hóa (disabled = true) NẾU độ dài PinCode KHÁC 6.
    // const DisabledInput = PinCode.length !== 6;

    // const handlePinChange = (e) => {
    //     // Cập nhật state của mã PIN mỗi khi người dùng nhập
    //     setPinCode(e.target.value);
    // };

    // const handleDisabledDataChange = (e) => {
    //     setDisabledData(e.target.value);
    // };

    return (
        <div className='card-body' id='card-register'>
            <div className='header'>
                <img src={LogoImage} alt='XNOVA Logo' />
                <div className='title'>Tham gia Xnova</div>
                <div className='subtitle'>Tạo tài khoản để bắt đầu</div>
            </div>
            <form ref={formRef} onSubmit={handleSendOTP}>
                <div className='form-group form-input-register'>
                    <i className={`fa-solid fa-envelope ${RegisterError.name.includes('Email') && 'invalid-icon'}`}></i>
                    <input type='email' name='email' placeholder='Email đăng kí' ref={EmailRef} style={{ border: RegisterError.name.includes('Email') && '1px solid #dc3545', }} />
                    {/* <input type='email' name='email' placeholder='Email đăng kí' ref={EmailRef} style={{ border: RegisterError.name.includes('Email') && '1px solid #dc3545', }} /> */}
                </div>
                <div className='form-group form-input-register'>
                    <i className={`fa-solid fa-user ${RegisterError.name.includes('Name') && 'invalid-icon'}`}></i>
                    <input type='text' name='name' placeholder='Họ tên' ref={NameRef} style={{ border: RegisterError.name.includes('Name') && '1px solid #dc3545', }} />
                </div>
                <div className='form-group form-input-register'>
                    <i className={`fa-solid fa-phone ${RegisterError.name.includes('Phone') && 'invalid-icon'}`}></i>
                    <input type='text' name='phone' placeholder='Số điện thoại' ref={PhoneRef} style={{ border: RegisterError.name.includes('Phone') && '1px solid #dc3545', }} />
                </div>
                <div className='form-group form-input-register'>
                    <i className={`fa-solid fa-key ${RegisterError.name.includes('Password') && 'invalid-icon'}`}></i>
                    <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Mật khẩu đăng kí' ref={PasswordRef} style={{ border: RegisterError.name.includes('Password') && '1px solid #dc3545', }} />
                    <button type='button' className='btn-password' onClick={() => setShowPassword(p => !p)}>
                        {showPassword ? <i className='fa-solid fa-eye'></i> : <i className='fa-solid fa-eye-slash'></i>}
                    </button>
                </div>
                <div className='form-group form-input-register'>
                    <i className='fa-solid fa-key dobble-icon'></i>
                    <i className={`fa-solid fa-key ${RegisterError.name.includes('Confirm') && 'invalid-icon'}`}></i>
                    <input type='password' name='confirm' placeholder='Xác nhận mật khẩu' ref={ConfirmRef} style={{ border: RegisterError.name.includes('Confirm') && '1px solid #dc3545', }} />
                </div>
                <div className='form-check form-check-register'>
                    <a href='https://docs.google.com/document/d/1gpc5I74B66ldC76mSZsafEXuumeYlhSbV1ocqHCrrR4/edit?tab=t.0' className='provision' target='_blank'><b>ĐIỀU KHOẢN</b></a>

                    <div className='form-accept'>
                        <label className='label-accept' style={{ borderBottom: RegisterError.name.includes('Accept') && '2px solid #dc3545', color: RegisterError.name.includes('Accept') && '#dc3545', }}>
                            <input type='checkbox' id='checkbox-accept' checked={Accept} onChange={handleAccept} />
                            Đồng ý điều khoản
                        </label>
                    </div>
                </div>

                <div className='form-otp'>
                    <div className='form-group form-input-register'>
                        <i className={`fa-solid ${RegisterSuccess === 'Đăng kí thành công!' ? 'fa-unlock' : 'fa-lock'} ${RegisterError.name.includes('OTP') && 'invalid-icon'}`}></i>
                        <input min={0} type='number' name='otp' placeholder='Mã OTP' ref={OTPRef} style={{ border: RegisterError.name.includes('OTP') && '1px solid #dc3545', }} />
                        {/* <input disabled={DisabledInput} min={0} type='number' name='otp' value={PinCode} onChange={handlePinChange} placeholder='Mã OTP' style={{ border: RegisterError.name.includes('OTP') && '1px solid #dc3545', }} /> */}
                    </div>
                    {/* <button type='button' className='btn' onClick={handleSendOTP}>GỬI OTP</button> */}
                    <CountdownTimer
                        DoAction={handleSendOtpFromOutSide}
                        EmailRef={EmailRef}
                        NameRef={NameRef}
                        PhoneRef={PhoneRef}
                        PasswordRef={PasswordRef}
                        ConfirmRef={ConfirmRef}
                        Accept={Accept} />
                </div>

                {RegisterError.value && <div className='message error-message'>{RegisterError.value}</div>}
                {RegisterSuccess && <div className='message success-message'>{RegisterSuccess}</div>}
                {!RegisterError.value && !RegisterSuccess && <div className='message'></div>}
            </form>

            <form onSubmit={handleSubmitRegister}>
                <div className='btn-box btn-register'>
                    <button type='submit' className='btn btn-submit' disabled={loading}>{!loading ? 'ĐĂNG KÝ' : 'ĐANG XỬ LÝ...'}</button>
                    <button type='reset' className='btn btn-reset' onClick={ResetRegisterInputs}>XÓA</button>
                </div>
            </form>

            <div className='link-box'>
                <div className=''>Đã có tài khoản?</div>
                <div className='link' onClick={() => setIsLogin(true)}>Đăng nhập ngay!</div>
            </div>

            {/* <div>
                <button
                    onClick={handleSendOtpFromOutSide}
                    style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px' }}
                >
                    Gửi Form từ bên ngoài
                </button>
            </div> */}

            {/* <form>
                <div>
                    <label htmlFor="pincode">
                        <strong>Nhập mã PIN (yêu cầu đủ 6 ký tự): </strong>
                    </label>
                    <br />
                    <input
                        type="text"
                        id="pincode"
                        value={PinCode}
                        onChange={handlePinChange}
                        placeholder="Nhập mã PIN ở đây..."
                        maxLength="6" // Thuộc tính này giúp người dùng không nhập thừa
                        style={{ padding: '8px', marginTop: '5px' }}
                    />
                    <p>Độ dài mã PIN hiện tại: {PinCode.length} / 6</p>
                </div>

                <hr />

                <div>
                    <label htmlFor="secret">
                        <strong>Nhập dữ liệu bí mật:</strong>
                    </label>
                    <br />
                    <input
                        type="text"
                        id="secret"
                        value={DisabledData}
                        onChange={handleDisabledDataChange}
                        placeholder="Ô này sẽ mở khi PIN đủ 6 ký tự"
                        // Sử dụng biến điều kiện để bật/tắt input
                        disabled={DisabledInput}
                        style={{ padding: '8px', marginTop: '5px', backgroundColor: DisabledInput ? '#e9ecef' : 'white' }}
                    />
                </div>

                {DisabledInput && PinCode.length > 0 && (
                    <p style={{ color: 'red' }}>
                        Vui lòng nhập đủ 6 ký tự cho mã PIN để có thể nhập dữ liệu.
                    </p>
                )}
            </form> */}
        </div>
    )
}
