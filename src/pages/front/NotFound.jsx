import { useEffect } from "react";
import { useNavigate } from "react-router";

const NotFound = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        setTimeout(()=>{
            navigate('/home')
        },3000);
    },[]);

    return(
        <>
        <h1>你迷路囉~我幫你送回家</h1>
        </>
    )
};

export default NotFound;