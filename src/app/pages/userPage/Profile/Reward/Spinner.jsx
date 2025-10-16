import { useState } from 'react';
import './Spinner.css';

export default function Spinner({ items }) {

    const [randomDegree, setRandomDegree] = useState(0);

    const numItems = items.length;
    const anglePerItem = 360 / numItems;
    const hueStep = 360 / numItems;

    const gradientColors = items.map((_, index) => {
        const currentHue = Math.round((numItems == 101 ? index : index * 101) * hueStep);
        const color = `hsl(${currentHue}, 90%, 60%)`;
        const startAngle = index * anglePerItem;
        const endAngle = (index + 1) * anglePerItem;
        return `${color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');

    const getRandomDegree = () => {
        const NewRandomDegree = Math.floor(Math.random() * 360) + 3600;
        setRandomDegree(p => p + NewRandomDegree);
    }

    return (
        <div className="spinner-container">
            <div
                className="spinner-wheel"
                style={{
                    background: `conic-gradient(${gradientColors})`,
                    transform: `rotateZ(${randomDegree}deg)`
                }}>
                {items.map((item, index) => {
                    const rotationAngle = index * anglePerItem + anglePerItem / 2 + 90;
                    return (
                        <div key={index} className="spinner-text" style={{ transform: `translate(-50%, -50%) rotateZ(${-rotationAngle}deg) translateX(100px)` }}>
                            {item}
                        </div>
                    );
                })}
            </div>
            <div className="spinner-pointer"></div>
            <div className="spinner-center" onClick={() => getRandomDegree()}></div>
            {/* <div className='result'>{items[Math.floor(randomDegree % 360 / anglePerItem)]} - Deg: {randomDegree} - Deg(360): {randomDegree % 360} - randomDegree % 360 / anglePerItem : {randomDegree % 360 / anglePerItem}</div> */}
            <div className='result'>{items[Math.floor(randomDegree % 360 / anglePerItem)]}</div>
        </div>
    )
}
