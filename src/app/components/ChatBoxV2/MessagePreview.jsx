import './MessagePreview.css';

const MessagePreview = ({ visible, message }) => {

    if (!visible) return null;

    return (
        <div className='message-preview'>
            {message}
        </div>
    );
};

export default MessagePreview;
