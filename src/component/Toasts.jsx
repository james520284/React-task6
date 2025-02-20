import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Toast } from "bootstrap";
import { useDispatch } from "react-redux";
import { removeMsg } from "../redux/slice/toastSlice";

const Toasts = () => {

    const messages = useSelector(state => state.toastStorage.messages);
    console.log(messages);
    
    const toastRef = useRef({});

    const dispatch = useDispatch();

    useEffect(()=>{
        messages.forEach(message => {
            const toastElement = toastRef.current[message.id];

            if (toastElement) {
                const toastInstance = new Toast(toastElement);
                toastInstance.show();

                setTimeout(()=>{
                    dispatch(removeMsg(message.id));
                },2000);
            }
        });

        
    },[messages]);

    return(<>

    {
        messages.map(message=>
            <div 
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 10000 }}
            key={message.id}
            ref={(el)=>toastRef.current[message.id]=el}
            >
                <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className={`toast-header text-white ${message.status==='success'?'bg-success':'bg-danger'}`}>
                    <strong className="me-auto">{message.status==='success'?'成功':'失敗'}</strong>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                    ></button>
                    </div>
                    <div className="toast-body">{message.text}</div>
                </div>
            </div>
        )
    }
    
    
    </>)
};

export default Toasts;