import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;




const ProductsList = () => {
    const [products,setProducts] = useState([]);
    useEffect(()=>{
        (async()=>{
            try {
                const res = await axios.get(`${baseUrl}/api/${apiPath}/products/all`);
                setProducts(res.data.products);
            } catch (err) {
                console.log(err);
            }
        })();
    },[]);

    return(
        <>
        <div className="container">
            <div className="row row-cols-md-3 row-cols-1 g-4">
                {
                    products?.map(product=>
                        <div className="col" key={product.id}>
                            <div className="card" >
                                <img src={product.imageUrl} className="card-img-top" alt={product.title}/>
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <strong className="d-block my-1">價格：{product.price}元</strong>
                                    <small className="d-block my-1">單位：{product.unit}</small>
                                    <Link to={`/product/${product.id}`} className="btn btn-primary">查看更多</Link>
                                </div>
                            </div>
                        </div>
                    )
                }
                
                
            </div>
        </div>
        
        </>
    )
};

export default ProductsList;