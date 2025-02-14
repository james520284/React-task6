import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const Login = () => {
    const userInfoFormat = {
    username: "",
    password: ""
    };
    const [userInfo,setUserInfo] = useState(userInfoFormat);
    const navigate = useNavigate();

    const handleLogin = (e)=>{
        const {name,value} = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]:value
        }));
    };

    const postLogin = (e) => {
        e.preventDefault();
        (async()=>{
            try {
                const res = await axios.post(`${baseUrl}/admin/signin`,userInfo);
                const {token,expired} = res.data;
                document.cookie =`myToken=${token}; expires=${new Date(expired)};`;
                axios.defaults.headers.common['Authorization'] = token;
                navigate('/admin/products_manage');
            } catch (err) {
                console.log(err);
            }
        })();
    };

    return(
        <>
        <form className="w-50 mx-auto" onSubmit={e => postLogin(e)}>
            <div className="form-floating mb-3">
                <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="username" 
                placeholder="name@example.com"
                value={userInfo.username}
                onChange={handleLogin}
                />
                <label htmlFor="email">信箱</label>
            </div>
            <div className="form-floating">
                <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={userInfo.password}
                onChange={handleLogin}
                />
                <label htmlFor="password">密碼</label>
            </div>
            <button className="btn btn-primary w-100 mt-3">登入</button>
        </form>
        </>
    )
};

export default Login;