import { Outlet,NavLink } from "react-router";

const UserLayout = () => {
    return(
        <>
        <h1>我是前台版型</h1>
        <nav className="mb-5">
            <NavLink to='/home' className={({isActive})=> isActive?'btn btn-warning mx-2':'btn btn-outline-warning mx-2'}>首頁</NavLink>
            <NavLink to='/products' className={({isActive})=> isActive?'btn btn-warning mx-2':'btn btn-outline-warning mx-2'}>產品列表</NavLink>
            <NavLink to='/carts' className={({isActive})=> isActive?'btn btn-warning mx-2':'btn btn-outline-warning mx-2'}>購物車列表</NavLink>
            <NavLink to='/login' className={({isActive})=> isActive?'btn btn-danger mx-2':'btn btn-outline-danger mx-2'}>登入</NavLink>
        </nav>
        
        <Outlet/>

        <footer className="mt-5">@嚼勁先生的作業網站</footer>
        </>
    )
};

export default UserLayout;