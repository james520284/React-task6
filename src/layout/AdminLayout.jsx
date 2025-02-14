
import axios from "axios";
import { Outlet,NavLink } from "react-router";
import { useEffect} from "react";
import { useNavigate } from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const AdminLayout = () => {
    const navigate = useNavigate();
    const logout = async() => {
        try {
            const res = await axios.post(`${baseUrl}/logout`);
            console.log(res);
            navigate('/home');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        const getToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
        );
        axios.defaults.headers.common['Authorization'] = getToken;
    },[]);


    return(
        <>
        <h1>我是後台版型</h1>
        <nav className="mb-5">
            <NavLink to='products_manage' className={({isActive})=> isActive?'btn btn-success mx-2':'btn btn-outline-success mx-2'}>產品管理</NavLink>
            <NavLink to='order_manage' className={({isActive})=> isActive?'btn btn-success mx-2':'btn btn-outline-success mx-2'}>訂單管理</NavLink>
            <button type="button" className='btn btn-danger mx-2' onClick={logout}>登出</button>
        </nav>
        <Outlet />
        </>
    )
};

export default AdminLayout;