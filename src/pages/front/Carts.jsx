import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const Carts = () => {
    const [cartsData,setCartsData] = useState({});

    const getCart = async()=>{
            try {
                const res = await axios.get(`${baseUrl}/api/${apiPath}/cart`);
                
                setCartsData(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

    const removeCart = async(id) =>{
        try {
            const res = await axios.delete(`${baseUrl}/api/${apiPath}/cart/${id}`);
            getCart();
            
        } catch (err) {
            console.log(err);
        }
    };

    const removeAllCarts = async() => {
        try {
            const res = await axios.delete(`${baseUrl}/api/${apiPath}/carts`);
            getCart();
        } catch (err) {
            console.log(err);
        }
    };

    const putCart = async(cart_id,product_id,qty) => {
        const dataFormat = {
            data:{
                product_id,
                qty,
            }
        }
        try {
            const res = await axios.put(`${baseUrl}/api/${apiPath}/cart/${cart_id}`,dataFormat);
            getCart();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{
        getCart();
    },[]);

    return(
        <>
        <button type="button" className={`d-block ms-auto btn btn-danger ${cartsData.carts?.length===0&&'disabled'}`} onClick={removeAllCarts}>清空購物車</button>
        <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>品名</th>
                    <th>數量/單位</th>
                    <th>單價</th>
                </tr>
            </thead>
            <tbody>
                {
                    cartsData.carts?.map(cart => 
                        <tr key={cart.id}>
                            <td>
                                <i className="bi bi-x-octagon text-danger" onClick={()=>removeCart(cart.id)} style={{cursor:'pointer'}}></i>
                            </td>
                            <td>{cart.product.title}</td>
                            <td>
                                <div className="btn-group">
                                    <button type="button" className={`btn btn-dark ${cart.qty===1&&'disabled'}`}
                                    onClick={()=>putCart(cart.id,cart.product_id,(cart.qty-1))}
                                    >–</button>
                                    <button type="button" className="btn btn-outline-dark" style={{width:'60px'}} disabled>{cart.qty}</button>
                                    <button type="button" className={`btn btn-dark ${cart.qty===5&&'disabled'}`}
                                    onClick={()=>putCart(cart.id,cart.product_id,(cart.qty+1))}
                                    >+</button>
                                </div>
                            </td>
                            <td>{cart.product.price}</td>
                        </tr>
                    )
                }
                
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3} className="text-end">
                        總計：
                    </td>
                    <td>
                        {cartsData.final_total}
                    </td>
                </tr>
            </tfoot>
        </table>
        <Form cartsData={cartsData} getCart={getCart}/>
        </>
    )
};

const Form = ({cartsData,getCart}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors},
    } = useForm({
        mode:'onBlur'
    });

    const onSubmitData = async(form_data) => {
        const {message,...userInfo} = form_data;
        const dataFormat = {
            data:{
                user:userInfo
            },
            message,
        }
        try {
            const res = await axios.post(`${baseUrl}/api/${apiPath}/order`,dataFormat);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
        reset();
        await getCart();
    };
    

    return(
    <>
    <form className="w-50 mx-auto" onSubmit={handleSubmit(onSubmitData)}>
        <div className="form-floating my-3">
            <input
            {...register('name',{
                required:'請輸入姓名',
            })}
            type="text"
            className={`form-control ${errors.name&&'is-invalid'}`}
            id="name"
            placeholder="name"/>
            <label htmlFor="name">姓名</label>
            <p className="text-danger text-end">{errors.name?errors.name.message:''}</p>
        </div>
        <div className="form-floating my-3">
            <input
            {...register('email',{
                required:'請輸入電子信箱',
                pattern:{
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:'請輸入正確的信箱格式'
                },
            })}
            type="email"
            className={`form-control ${errors.email&&'is-invalid'}`}
            id="email"
            placeholder="email"/>
            <label htmlFor="email">信箱</label>
            <p className="text-danger text-end">{errors.email?errors.email.message:''}</p>
        </div>
        <div className="form-floating my-3">
            <input
            {...register('tel',{
                required:'請輸入手機號碼',
                pattern:{
                    value: /^[0-9]{10}$/,
                    message: '手機號碼格式錯誤',
                },
            })}
            type="tel"
            className={`form-control ${errors.tel&&'is-invalid'}`}
            id="tel"
            placeholder="tel"/>
            <label htmlFor="tel">手機</label>
            <p className="text-danger text-end">{errors.tel?errors.tel.message:''}</p>
        </div>
        <div className="form-floating my-3">
            <input
            {...register('address',{
                required:'請輸入收件地址',
            })}
            type="text"
            className={`form-control ${errors.address&&'is-invalid'}`}
            id="address"
            placeholder="address"/>
            <label htmlFor="address">收件地址</label>
            <p className="text-danger text-end">{errors.address?errors.address.message:''}</p>
        </div>
        <div className="form-floating my-3">
            <textarea
            {...register('message')}
            type="text"
            className='form-control'
            id="message"
            placeholder="message"
            style={{height:'100px'}}
            />
            <label htmlFor="message">備註</label>
        </div>
        
        <button
        className={`btn btn-primary w-100 ${(Object.keys(errors).length!==0 ||cartsData.carts?.length===0 )&&'disabled'}`}
        >送出</button>
    </form>
    </>
    )
};

export default Carts;