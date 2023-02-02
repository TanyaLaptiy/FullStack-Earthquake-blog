import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios';


export const fetchUserData=createAsyncThunk('auth/fetchAuth',async(params)=>{  
    const {data}=await axios.post('/auth/login',params);
    return data;
 });
 export const fetchUserRegistration=createAsyncThunk('auth/fetchRegistration',async(params)=>{  
  const {data}=await axios.post('/auth/register',params);
  return data;
});

export const fetchUserEdit=createAsyncThunk('auth/fetchUserEdit',async(params)=>{ 
  const {data}=await axios.put(`/users/${params.id}`,params.body);
  return data;
});

 export const fetchAuth=createAsyncThunk('auth/fetchAuthMe',async()=>{ 
  const {data}=await axios.get('/auth/me');
  return data;
});

const initialState={
    data:null,
    status:'loading',
   
};

const authSlice= createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout:(state)=>{
          state.data=null;
          window.localStorage.removeItem('token');
        }
    },
    extraReducers:{
        [fetchUserData.pending]:(state,action)=>{ 
          state.data=null;
          state.status='loading';
        },
        [fetchUserData.fulfilled]:(state,action)=>{
          state.data=action.payload;
          state.status='loaded';
        },
        [fetchUserData.rejected]:(state,action)=>{ 
          state.data=null;
          state.status='error';
        },
        [fetchAuth.pending]:(state,action)=>{  
          state.data=null;
          state.status='loading';
        },
        [fetchAuth.fulfilled]:(state,action)=>{ 
          state.data=action.payload;
          state.status='loaded';
        },
        [fetchAuth.rejected]:(state,action)=>{ 
          state.data=null;
          state.status='error';
        },
        [fetchUserRegistration.pending]:(state,action)=>{ 
          state.data=null;
          state.status='loading';
        },
        [fetchUserRegistration.fulfilled]:(state,action)=>{ 
          state.data=action.payload;
          state.status='loaded';
        },
        [fetchUserRegistration.rejected]:(state,action)=>{ 
          state.data=null;
          state.status='error';
        },
        [fetchUserEdit.pending]:(state,action)=>{
          state.data=null;
          state.status='loading';
        },
        [fetchUserEdit.fulfilled]:(state,action)=>{ 
          state.data=action.payload;
          state.status='loaded';
        },
        [fetchUserEdit.rejected]:(state,action)=>{
          state.data=null;
          state.status='error';
        },
    }
});
export const selectIsAuth= (state)=>Boolean(state.auth.data);
export const authReducer=authSlice.reducer;
export const {logout} = authSlice.actions;