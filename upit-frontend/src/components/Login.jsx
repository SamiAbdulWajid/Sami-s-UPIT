import {useNavigate} from 'react-router-dom';
 function Login(){
   const navigate=useNavigate();

   const goToLogin=()=>{
    navigate('/login');
   }

   const goToSignup=()=>{
    navigate('/signup');
   }
    return (
        <div className="LoginBtn" >
            
           <button onClick={goToLogin}>Login</button>
          
        </div>
    )
} 

export default Login;

 