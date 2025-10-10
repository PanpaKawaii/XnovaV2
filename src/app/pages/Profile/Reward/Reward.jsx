import Spinner from './Spinner.jsx';
import RewardList from './RewardList.jsx';

export default function RandomWheel() {

    const names = ["An", "Binh", "Cuong", "Duong", "En", "Giang", "Huong", "In", "Khanh", "Linh", "Manh", "Nhan", "Oanh", "Phuoc", "Quynh", "Rot", "Son", "Thien", "Uyen", "Viet", "Xinh", "Yen"];
    const name = [1, 2, 3, 4, 5, 6];

    return (
        <div className="">
            <Spinner items={names} />
            <RewardList/>
        </div>
    )
}
