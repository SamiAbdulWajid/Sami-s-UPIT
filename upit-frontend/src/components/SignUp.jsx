

import {useNavigate} from 'react-router-dom';
 function SignUp(){
   const navigate=useNavigate();

   const goToSignUp=()=>{
    navigate('/signup');
   }
    return (
        <div className="SignUpBtn" >
            
           <button onClick={goToSignUp}>SignUp</button>
        </div>
    )
} 

export default SignUp;

 
