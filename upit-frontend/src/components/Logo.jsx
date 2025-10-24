import { useNavigate } from 'react-router-dom';
import "../App.css"
function Logo() {
    const navigate = useNavigate();

    const goToSearch = () => {
        navigate('/searchProject')
    };

    return (
        <div >
            <button className="LogoButton" onClick={goToSearch} style={{backgroundColor:"#f8f9fa",border:"none",outline:"none",boxShadow:"none",cursor:"pointer"}}>
                <img src="/UPIT.png" alt="" style={{height:"50px",backgroundColor:"#f8f9fa"}}/>
            </button>
        </div>
    )
}

export default Logo;