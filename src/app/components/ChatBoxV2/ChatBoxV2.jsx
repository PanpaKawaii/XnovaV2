import React, { useEffect, useRef, useState } from 'react';
import { postData } from '../../../mocks/CallingAPI.js';
import { useAuth } from '../../hooks/AuthContext/AuthContext.jsx';
import './ChatBoxV2.css';

export default function ChatBoxV2() {
    const { user } = useAuth();

    const [Messages, setMessages] = useState([]);
    const [WidthFull, setWidthFull] = useState(false);
    const [HeightFull, setHeightFull] = useState(false);
    const [DisplayChat, setDisplayChat] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setMessages(['Xin chào! Tôi là trợ lý AI của bạn. Hãy đặt câu hỏi để tôi hỗ trợ nhé!']);
    }, [user]);

    const addMessage = async (newMessage) => {
        console.log('newMessage: ', newMessage);
        const SendMessage = { message: newMessage };
        setLoading(true);
        const token = user?.token;
        try {
            const result = await postData('Chat/ask', SendMessage, token);
            console.log('result', result);
            if (result.reply?.includes('The model is overloaded. Please try again later.')) setMessages((prev) => [...prev, 'Kết nối không ổn định, bạn hãy thử lại sau nhé!']);
            else setMessages((prev) => [...prev, result.reply]);
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
        width: '320px',
        height: '420px',
    }
    const StyleHeight = {
        width: '320px',
        height: '80vh',
    }
    const StyleFull = {
        width: 'calc(100vw - 40px)',
        height: '80vh',
        maxWidth: '1000px',
    }

    let chatStyle = StyleNormal;
    if (WidthFull) {
        chatStyle = StyleFull;
    } else if (HeightFull) {
        chatStyle = StyleHeight;
    }

    const renderFormattedText = (text) => {
        // Bước 1: Tách từng dòng theo dấu `*`
        const lines = text.split(/(?<=\s)\*(?=\s)/);

        return lines.map((line, idx) => {
            // Bước 2: Tách và xử lý in đậm từng phần trong dòng
            const parts = line.split(/(\*\*.*?\*\*)/g); // Giữ lại các đoạn có **...**
            return (
                <div key={idx}>
                    {parts.map((part, i) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={i}>{part.slice(2, -2)}</strong>
                        ) : (
                            <span key={i}>{part}</span>
                        )
                    )}
                </div>
            );
        });
    };

    return (
        <div className='chat-box-v2-container'>
            {!DisplayChat &&
                <div className='open-icon' onClick={() => setDisplayChat(true)}>
                    Xnova
                </div>
            }
            {DisplayChat &&
                <div className='chat-box' style={chatStyle}>
                    <div className='heading'>
                        <div className='name'>
                            <span>Xnova AI</span>
                        </div>
                        <div>
                            {WidthFull ?
                                <i className='fa-solid fa-compress-arrows-alt' onClick={() => setWidthFull(false)} title='Thu nhỏ'></i>
                                :
                                <i className='fa-solid fa-arrows-alt' onClick={() => setWidthFull(true)} title='Mở rộng'></i>
                            }
                            {HeightFull ?
                                <i className='fa-solid fa-arrows-alt-v fa-rotate-90' onClick={() => setHeightFull(false)} title='Thu nhỏ chiều cao'></i>
                                :
                                <i className='fa-solid fa-arrows-alt-v' onClick={() => setHeightFull(true)} title='Mở rộng chiều cao'></i>
                            }
                            <i className='fa-solid fa-times' onClick={() => setDisplayChat(false)} title='Đóng'></i>
                        </div>
                    </div>
                    <div ref={chatContainerRef} className='chat-content'>
                        {/* {Messages.length === 0 && !loading && ( */}
                            <div className='welcome-message'>
                                <i className='fa-solid fa-comments welcome-icon'></i>
                                <div className='welcome-text'>
                                    <h3>Chào mừng bạn đến với Xnova AI!</h3>
                                    <p>Hãy bắt đầu cuộc trò chuyện bằng cách nhập tin nhắn bên dưới.</p>
                                </div>
                            </div>
                        {/* )} */}
                        {Messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`message ${idx % 2 === 0 ? 'bot-message' : 'user-message'}`}
                            >
                                <div>{renderFormattedText(msg)}</div>
                                <div className='logo-bot'>X</div>
                            </div>
                        ))}
                        {loading && (
                            <div className='typing-indicator'>
                                <div className='dot'></div>
                                <div className='dot'></div>
                                <div className='dot'></div>
                                <div className='logo-bot'>X</div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSend}>
                        <div className='form-group'>
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