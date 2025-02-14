import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const UnitProduct = () => {
    const params = useParams();
    const {id} = params;
    const [unitProduct,setUnitProduct] = useState({});
    const navigate = useNavigate();
    
    useEffect(()=>{
        (async()=>{
            try {
                const res = await axios.get(`${baseUrl}/api/${apiPath}/product/${id}`);
                setUnitProduct(res.data.product);
            } catch (err) {
                console.log(err);
            }
        })();
    },[]);

    const backPage = () => {
        navigate(-1);
    }

    return(
        <>
        <div className="card mx-auto" style={{width:'320px'}}>
            <img src={unitProduct.imageUrl} className="card-img-top" alt={unitProduct.title}/>
            <div className="card-body">
                <h5 className="card-title">{unitProduct.title}</h5>
                <p className="card-text">{unitProduct.content}</p>
                <p className="d-block my-1">分類：{unitProduct.category}</p>
                <del className="d-block my-1 text-muted">特價：{unitProduct.origin_price}元</del>
                <strong className="d-block my-1">特價：{unitProduct.price}元</strong>
                <small className="d-block my-1">單位：{unitProduct.unit}</small>
                <button type="button" className="btn btn-success">立即購買</button>
            </div>
        </div>
        <button type="button" className="btn btn-outline-danger mt-3" onClick={backPage}>回到上一頁</button>
        </>
    )
};

export default UnitProduct;