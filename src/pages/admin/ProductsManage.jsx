import axios from "axios";
import { useRef, useState,useEffect } from "react";
import { Modal } from "bootstrap";
import { useForm ,useWatch,useFieldArray} from "react-hook-form";
import { useDispatch } from "react-redux";
import { pushMsg } from "../../redux/slice/toastSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const ProductsManage = () => {
    const [productsData,setProductsData] = useState([]);
    const [unitProductData,setUnitProductData] = useState({});
    const [pages,setPages] = useState({});
    const [modalType,setModalType] = useState('');
    const modalRef = useRef(null);

    const getProductsList = async(page=1) => {
        try {
            const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/products?page=${page}`);
            setProductsData(res.data.products);
            setPages(res.data.pagination);
        } catch (err) {
            console.log(err);
        }
    };

    const openModal = () => {
        modalRef.current.show();
    };

    const closeModal = () => {
        modalRef.current.hide();
    };

    useEffect(()=>{
        getProductsList();
        setTimeout(()=>{
            if (modalRef.current) {
                modalRef.current = new Modal(modalRef.current);
            }
        },0);
        
    },[]);

    


    return(
        <>
        <button 
        type="button"
        className="btn btn-dark d-block ms-auto"
        onClick={()=>{
            setModalType('new');
            openModal();
        }}
        >建立新產品</button>
        <table className="table">
            <thead>
                <tr>
                    <th>分類</th>
                    <th>品名</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>狀態</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    productsData.map(product=>
                        <tr key={product.id}>
                            <td>{product.category}</td>
                            <td>{product.title}</td>
                            <td>{product.origin_price}</td>
                            <td>{product.price}</td>
                            <td className={`${product.is_enabled?'text-success':'text-danger'}`}>
                                {product.is_enabled?'啟用':'關閉'}
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-outline-primary"
                                    onClick={()=>{
                                        setUnitProductData(product);
                                        setModalType('edit');
                                        openModal();
                                    }}
                                    >編輯</button>
                                    <button type="button" className="btn btn-outline-danger"
                                    onClick={()=>{
                                        setUnitProductData(product);
                                        setModalType('delete');
                                        openModal();
                                    }}
                                    >刪除</button>
                                </div>
                            </td>
                        </tr>
                    )
                }
                
            </tbody>
        </table>
        <Pagination pages={pages} getProductsList={getProductsList}/>
        <ModalTemplate
        modalRef={modalRef}
        closeModal={closeModal}
        modalType={modalType}
        unitProductData={unitProductData}
        getProductsList={getProductsList}
        />
        </>
    )
};

const Pagination = ({pages,getProductsList}) => {
    return(
        <>
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className={`page-item ${!pages.has_pre&&'disabled'}`}>
                    <a type="button" className="page-link"  aria-label="Previous"
                    onClick={()=>getProductsList(pages.current_page-1)}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {
                    Array.from({length:pages.total_pages}).map((_,index)=>
                        <li className={`page-item ${pages.current_page===index+1&&'active'}`} key={index}>
                            <a type="button" className="page-link" 
                            onClick={()=>getProductsList(index+1)}
                            >{index+1}</a>
                        </li>
                    )
                }
                <li className={`page-item ${!pages.has_next&&'disabled'}`}>
                    <a type="button" className="page-link"  aria-label="Next"
                    onClick={()=>getProductsList(pages.current_page+1)}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        </>
    )
};

const ModalTemplate = ({modalRef,closeModal,modalType,unitProductData,getProductsList}) => {
    const dispatch = useDispatch();

    const{
        register,
        handleSubmit,
        reset,
        formState:{errors},
        control,
    }=useForm({
        defaultValues:{
            imagesUrl:[''],
        },
        mode:'onBlur'
    });
    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control,
        name:'imagesUrl',
    });

    const watchForm = useWatch({control});

    useEffect(() => {
        if (modalType === 'edit' && unitProductData) {
            const {title,category,unit,origin_price,price,description,content,imageUrl,imagesUrl,is_enabled} = unitProductData;
            reset({
                title,
                category,
                unit,
                origin_price,
                price,
                description,
                content,
                imageUrl,
                imagesUrl: imagesUrl?.length ? imagesUrl : [],
                is_enabled,
            });
        }else if (modalType === 'new') {
            reset({
                title:'',
                category:'',
                unit:'',
                origin_price:'',
                price:'',
                description:'',
                content:'',
                imageUrl:'',
                imagesUrl:[],
                is_enabled:false,
            });
        }
    }, [modalType, unitProductData, reset]);

    const submitForm = async(formData) => {
        const dataFormat = {
            data:{
            ...formData,
            origin_price:Number(formData.origin_price),
            price:Number(formData.price),
            }
        }
        try {
            await axios.post(`${baseUrl}/api/${apiPath}/admin/product`,dataFormat);
            dispatch(pushMsg({
                text:'成功新增產品',
                status:'success'
            }));
        } catch (err) {
            const {message} = err?.response?.data;
            dispatch(pushMsg({
                text:message.join('、'),
                status:'fail'
            }));
        }
    };
    
    const deleteProduct = async() => {
        try {
            await axios.delete(`${baseUrl}/api/${apiPath}/admin/product/${unitProductData.id}`);
            dispatch(pushMsg({
                text:'成功刪除產品',
                status:'success'
            }));
        } catch (err) {
            const {message} = err?.response?.data;
            dispatch(pushMsg({
                text:message.join('、'),
                status:'fail'
            }));
        }
    };

    const updateProduct = async() => {
        const dataFormat = {
            data:{
            ...watchForm,
            origin_price:Number(watchForm.origin_price),
            price:Number(watchForm.price),
            }
        }
        try {
            const res = await axios.put(`${baseUrl}/api/${apiPath}/admin/product/${unitProductData.id}`,dataFormat);
            console.log(res.data);
            dispatch(pushMsg({
                text:'成功修改產品',
                status:'success'
            }));
        } catch (err) {
            const {message} = err?.response?.data;
            dispatch(pushMsg({
                text:message.join('、'),
                status:'fail'
            }));
        }
    };

    const handleClickBtn = async() => {
        if (modalType === 'new') {
            await handleSubmit(submitForm)();
        }else if (modalType === 'delete') {
            await deleteProduct();
        }else if (modalType === 'edit') {
            await updateProduct();
        }
        await getProductsList();
        closeModal();
    };

    useEffect(()=>{
        console.log(unitProductData);
    },[unitProductData])

    return(<>
        <div className="modal" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className={`modal-header text-white ${modalType==='new'?'bg-dark':(modalType==='edit'?'bg-primary':'bg-danger')}`}>
                        <h5 className="modal-title">{
                        modalType==='new'?'新增產品':(modalType==='edit'?'編輯產品':'刪除產品')
                    }</h5>
                        <button type="button" className="btn-close btn-close-white"  onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                        {
                            modalType==='delete'?(  
                                <p>你確定要刪除產品「{unitProductData.title}」嗎?</p>
                            ):(
                                <>
                                <form  >
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-floating my-3">
                                                <input
                                                {...register('imageUrl',{
                                                    required:'請貼入主圖網址',
                                                })}
                                                type="text"
                                                className={`form-control`}
                                                id="imageUrl"
                                                placeholder="imageUrl"/>
                                                <label htmlFor="imageUrl">貼入主圖網址</label>
                                                <p className="text-danger text-end">{errors.imageUrl?errors.imageUrl.message:''}</p>
                                            </div>
                                            {
                                                watchForm.imageUrl&&(
                                                <>
                                                <img src={watchForm.imageUrl} alt='主圖' className="img-fluid"/>
                                                <button type="button" className="btn btn-outline-primary w-100 my-2"
                                                onClick={()=>append('')}
                                                >新增副圖</button>
                                                </>
                                                )
                                            }
                                            {
                                                fields.map((field,index)=>
                                                    <div key={field.id}>
                                                        <div className="form-floating my-3" >
                                                            <input
                                                            {...register(`imagesUrl.${index}`,{
                                                                required:'請貼入副圖網址',
                                                            })}
                                                            type="text"
                                                            className={`form-control`}
                                                            id={`url${index}`}
                                                            placeholder="imagesUrl"/>
                                                            <label htmlFor={`url${index}`}>貼入副圖網址</label>
                                                        </div>
                                                        {
                                                            watchForm.imagesUrl?.[index]&&
                                                            <img src={watchForm?.imagesUrl[index]} alt={`副圖${index+1}`} className="img-fluid"/>
                                                        }
                                                        {
                                                            watchForm.imagesUrl?.length <5 &&
                                                            <div className="btn-group w-100">
                                                                <button type="button" className="btn btn-outline-primary w-100 my-2"
                                                                onClick={()=>append('')}
                                                                >新增副圖</button>
                                                                <button type="button" className="btn btn-outline-danger w-100 my-2"
                                                                onClick={()=>remove(index)}
                                                                >刪除副圖</button>
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                                
                                            }
                                        </div>
                                        <div className="col-8">
                                            <div className="form-floating my-3">
                                                <input
                                                {...register('title',{
                                                    required:'請輸入產品名稱',
                                                })}
                                                type="text"
                                                className={`form-control ${errors.title&&'is-invalid'}`}
                                                id="title"
                                                placeholder="title"/>
                                                <label htmlFor="title">產品名稱</label>
                                                <p className="text-danger text-end">{errors.title?errors.title.message:''}</p>
                                            </div>
                                            <div className="row row-cols-2">
                                                <div className="col">
                                                    <div className="form-floating my-3">
                                                        <input
                                                        {...register('category',{
                                                            required:'請輸入分類',
                                                        })}
                                                        type="text"
                                                        className={`form-control ${errors.category&&'is-invalid'}`}
                                                        id="category"
                                                        placeholder="category"/>
                                                        <label htmlFor="category">分類</label>
                                                        <p className="text-danger text-end">{errors.category?errors.category.message:''}</p>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating my-3">
                                                        <input
                                                        {...register('unit',{
                                                            required:'請輸入單位',
                                                        })}
                                                        type="text"
                                                        className={`form-control ${errors.unit&&'is-invalid'}`}
                                                        id="unit"
                                                        placeholder="unit"/>
                                                        <label htmlFor="unit">單位</label>
                                                        <p className="text-danger text-end">{errors.unit?errors.unit.message:''}</p>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating my-3">
                                                        <input
                                                        {...register('origin_price',{
                                                            required:'請輸入原價',
                                                            min:{
                                                                value:0,
                                                                message:'原價不能小於0'
                                                            }
                                                        })}
                                                        type="number"
                                                        className={`form-control ${errors.origin_price&&'is-invalid'}`}
                                                        id="origin_price"
                                                        placeholder="origin_price"/>
                                                        <label htmlFor="origin_price">原價</label>
                                                        <p className="text-danger text-end">{errors.origin_price?errors.origin_price.message:''}</p>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating my-3">
                                                        <input
                                                        {...register('price',{
                                                            required:'請輸入售價',
                                                            min:{
                                                                value:0,
                                                                message:'售價不能小於0'
                                                            }
                                                        })}
                                                        type="number"
                                                        min={0}
                                                        className={`form-control ${errors.price&&'is-invalid'}`}
                                                        id="price"
                                                        placeholder="price"/>
                                                        <label htmlFor="price">售價</label>
                                                        <p className="text-danger text-end">{errors.price?errors.price.message:''}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-floating my-3">
                                                <textarea
                                                {...register('description')}
                                                type="text"
                                                className={`form-control`}
                                                id="description"
                                                placeholder="description"
                                                style={{height:'100px'}}
                                                />
                                                <label htmlFor="description">產品描述</label>
                                                <p className="text-danger text-end">{errors.description?errors.description.message:''}</p>
                                            </div>
                                            <div className="form-floating my-3">
                                                <textarea
                                                {...register('content')}
                                                type="text"
                                                className={`form-control`}
                                                id="content"
                                                placeholder="content"
                                                style={{height:'100px'}}
                                                />
                                                <label htmlFor="content">產品內容</label>
                                                <p className="text-danger text-end">{errors.content?errors.content.message:''}</p>
                                            </div>
                                            <div className="text-start">
                                                <input 
                                                {...register('is_enabled')}
                                                type="checkbox"
                                                name="is_enabled"
                                                id="is_enabled" />
                                                <label htmlFor="is_enabled">是否上架</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                </>
                            )
                        }
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                        onClick={closeModal} >取消</button>
                        <button type="button" className="btn btn-primary" onClick={handleClickBtn}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
};

export default ProductsManage;