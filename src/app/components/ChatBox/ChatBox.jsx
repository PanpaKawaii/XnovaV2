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

    useEffect(() => {
        setMessages([]);
    }, [user]);

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
        width: '360px',
        height: '440px',
    }
    const StyleHeight = {
        width: '360px',
        height: '90vh',
    }
    const StyleFull = {
        width: 'calc(100% - 16px)',
        height: '90vh',
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
                        <div className='name'>Xnova</div>
                        <div>
                            {WidthFull ?
                                <i className='fa-solid fa-minimize' onClick={() => setWidthFull(false)}></i>
                                :
                                <i className='fa-solid fa-maximize' onClick={() => setWidthFull(true)}></i>
                            }
                            {HeightFull ?
                                <i className='fa-solid fa-arrow-down' onClick={() => setHeightFull(false)}></i>
                                :
                                <i className='fa-solid fa-arrows-up-down' onClick={() => setHeightFull(true)}></i>
                            }
                            <i className='fa-solid fa-xmark' onClick={() => setDisplayChat(false)}></i>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className='chat-content'>
                        {Messages.map((msg, idx) => (
                            <div key={idx} className='message'
                                style={{
                                    alignSelf: idx % 2 === 0 ? 'flex-end' : 'flex-start',
                                }}
                            >
                                {msg}
                            </div>
                        ))}
                        {loading &&
                            <div className='message' style={{ alignSelf: 'flex-start' }}>
                                ...
                            </div>
                        }
                    </div>

                    <form onSubmit={handleSend}>
                        <div className='form-name form-group'>
                            <input type='text' id='chat' name='chat' placeholder='Câu hỏi của bạn' />
                        </div>
                        <button className='btn'>GỬI</button>
                    </form>
                </div>
            }
        </div>
    )
}
