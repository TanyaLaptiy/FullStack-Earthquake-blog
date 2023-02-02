import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments=createAsyncThunk('comments/fetchComments',async()=>{
   const {data}=await axios.get('/comments');
   return data;
});
export const fetchCommentsByObject=createAsyncThunk('comments/fetchCommentsByObject',async(id)=>{
  const {data}=await axios.get(`/${id}/comments`);
  return data;
});

const initialState={
    comments:{
        items:[],
        status:'loading',
    }
};

const commentsSlice=createSlice({
    name:'comments',
    initialState,
    reducers:{},
    extraReducers:{
     
      [fetchComments.pending]:(state,action)=>{ 
        state.comments.items=[];
        state.comments.status='loading';
      },
      [fetchComments.fulfilled]:(state,action)=>{ 
        state.comments.items=action.payload;
        state.comments.status='loaded';
      },
      [fetchComments.rejected]:(state,action)=>{ 
        state.comments.items=[];
        state.comments.status='error';
      },
      [fetchCommentsByObject.pending]:(state,action)=>{ 
        state.comments.items=[];
        state.comments.status='loading';
      },
      [fetchCommentsByObject.fulfilled]:(state,action)=>{ 
        state.comments.items=action.payload;
        state.comments.status='loaded';
      },
      [fetchCommentsByObject.rejected]:(state,action)=>{ 
        state.comments.items=[];
        state.comments.status='error';
      },
     
    }
});

export const commentsReducer=commentsSlice.reducer;