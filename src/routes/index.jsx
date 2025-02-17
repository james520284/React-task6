import AdminLayout from "../layout/AdminLayout";
import UserLayout from "../layout/UserLayout";
import OrderManage from "../pages/admin/OrderManage";
import ProductsManage from "../pages/admin/ProductsManage";
import Carts from "../pages/front/Carts";
import Login from "../pages/front/Login";
import NotFound from "../pages/front/NotFound";
import ProductsList from "../pages/front/ProductsList";
import UnitProduct from "../pages/front/UnitProduct";



const routes = [
    {
        path:'/',
        element:<UserLayout/>,
        children:[
            {
                path:'products',
                element:<ProductsList/>
            },
            {
                path:'product/:id',
                element:<UnitProduct/>
            },
            {
                path:'carts',
                element:<Carts/>
            },
            {
                path:'login',
                element:<Login/>
            },
        ]
    },
    {
        path:'/admin',
        element:<AdminLayout/>,
        children:[
            {
                path:'products_manage',
                element:<ProductsManage/>
            },
            {
                path:'order_manage',
                element:<OrderManage/>
            }
        ]
    },
    {
        path:'*',
        element:<NotFound/>
    }
];

export default routes;