import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    messages:[],
}

export const toastSlice = createSlice({
    name:'toast',
    initialState,
    reducers:{
        pushMsg(state,action){
            const {text,status} = action.payload;
            const id = Date.now();
            state.messages.push({
                id,
                text,
                status,
            })
        },
        removeMsg(state,action){
            const msgID = action.payload;
            const index = state.messages.findIndex(message =>message.id === msgID);
            if (index!==-1) {
                state.messages.splice(index,1);
            }
        }
    }
});

export const {pushMsg,removeMsg} = toastSlice.actions;

export default toastSlice.reducer;