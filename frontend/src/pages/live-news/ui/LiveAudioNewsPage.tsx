import { useUserInfoStore } from "features/user-info";
import { useNavigate } from 'react-router-dom';

export function LiveAudioNewsPage() {
    const { userData } = useUserInfoStore();
    const navigate = useNavigate();
    
    if (userData == null) {
        navigate('/interview');
    }
    
    return (
        <>
            <h1>Live audio news page</h1>
            <h2>User data</h2>
            <p>{JSON.stringify(userData)}</p>
        </>
    )
}
