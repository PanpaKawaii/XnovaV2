import React, { useEffect, useRef, useState } from 'react';
import { postData } from '../../../mocks/CallingAPI.js';
import { useAuth } from '../../hooks/AuthContext/AuthContext.jsx';
import './ChatBox.css';

export default function ChatBox() {
    const { user } = useAuth();

    const [Messages, setMessages] = useState([]);
    const [WidthFull, setWidthFull] = useState(false);
    const [HeightFull, setHeightFull] = useState(false);
    const [DisplayChat, setDisplayChat] = useState(false);
    // const handleSetHeight = (status) => {
    //     setHeightFull(p => status);
    // }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addMessage = async (newMessage) => {

        console.log('newMessage: ', newMessage);

        const SendMessage = {
            message: newMessage,
        };

        setLoading(true);
        const token = user?.token;
        try {
            const result = await postData('Chat/ask', SendMessage, token);
            console.log('result', result);

            setMessages((prev) => [...prev, result.reply]);
        } catch (error) {
            setMessages((prev) => [...prev, 'Kết nối không ổn định, bạn hãy thử lại sau nhé!']);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const chatContainerRef = useRef(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [Messages]);

    const addMyMessage = (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (e.target.chat.value && loading === false) {
            addMyMessage(e.target.chat.value);
            addMessage(e.target.chat.value);
            e.target.chat.value = '';
        }
    }

    const StyleNormal = {
        width: '380px',
        height: '520px',
    }
    const StyleHeight = {
        width: '380px',
        height: '85vh',
    }
    const StyleFull = {
        width: 'calc(100vw - 40px)',
        height: '85vh',
        maxWidth: '1200px',
    }

    return (
        <div className='chat-box-container'>

            {!DisplayChat &&
                <div className='open-icon' onClick={() => setDisplayChat(true)}>
                    Xnova
                </div>
            }

            {DisplayChat &&
                <div className='chat-box' style={WidthFull ? StyleFull : (HeightFull ? StyleHeight : StyleNormal)}>

                    <div className='heading'>
                        <div className='name'>
                            <i className='fa-solid fa-robot'></i>
                            <span>Xnova AI</span>
                        </div>
                        <div>
                            {WidthFull ?
                                <i className='fa-solid fa-compress' onClick={() => setWidthFull(false)} title='Thu nhỏ'></i>
                                :
                                <i className='fa-solid fa-expand' onClick={() => setWidthFull(true)} title='Mở rộng'></i>
                            }
                            {HeightFull ?
                                <i className='fa-solid fa-down-left-and-up-right-to-center' onClick={() => setHeightFull(false)} title='Thu nhỏ chiều cao'></i>
                                :
                                <i className='fa-solid fa-up-right-and-down-left-from-center' onClick={() => setHeightFull(true)} title='Mở rộng chiều cao'></i>
                            }
                            <i className='fa-solid fa-xmark' onClick={() => setDisplayChat(false)} title='Đóng'></i>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className='chat-content'>
                        {Messages.length === 0 && !loading && (
                            <div className='welcome-message'>
                                <i className='fa-solid fa-comments welcome-icon'></i>
                                <div className='welcome-text'>
                                    <h3>Chào mừng bạn đến với Xnova AI!</h3>
                                    <p>Hãy bắt đầu cuộc trò chuyện bằng cách nhập tin nhắn bên dưới.</p>
                                </div>
                            </div>
                        )}
                        {Messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`message ${idx % 2 === 0 ? 'user-message' : 'bot-message'}`}
                            >
                                {msg}
                            </div>
                        ))}
                        {loading && (
                            <div className='typing-indicator'>
                                <div className='dot'></div>
                                <div className='dot'></div>
                                <div className='dot'></div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend}>
                        <div className='form-name form-group'>
                            <i className='fa-solid fa-comment-dots input-icon'></i>
                            <input 
                                type='text' 
                                id='chat' 
                                name='chat' 
                                placeholder='Nhập tin nhắn của bạn...' 
                                disabled={loading}
                            />
                        </div>
                        <button className='btn' type='submit' disabled={loading} title='Gửi tin nhắn'>
                            {loading ? (
                                <i className='fa-solid fa-spinner fa-spin'></i>
                            ) : (
                                <i className='fa-solid fa-paper-plane'></i>
                            )}
                        </button>
                    </form>
                </div>
            }
        </div>
    )
}
