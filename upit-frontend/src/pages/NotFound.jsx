import { Link } from "react-router-dom";
import Header from "../components/Header";
import {Footer} from "../components/Footer";
export default function NotFound() {
  return (
    <>
    <Header/>
    
    <div style={{ textAlign: "center", marginTop: "50px"}}>  
      <img src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/grimacing-face.png" alt="" />
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn’t exist.</p>
      <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go back Home
      </Link>
    </div>  
    
    
    <Footer/>
    </>
    
  );
}
