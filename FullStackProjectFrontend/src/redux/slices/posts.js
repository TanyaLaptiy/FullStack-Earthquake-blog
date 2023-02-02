import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts=createAsyncThunk('posts/fetchPosts',async()=>{
   const {data}=await axios.get('/posts');
   return data;
});
export const fetchSortedPosts=createAsyncThunk('posts/fetchSortedPosts',async()=>{
  const {data}=await axios.get('/posts/sorted');
  return data;
});
export const fetchRemovePost=createAsyncThunk('posts/fetchRemovePosts',async(id)=>await axios.delete(`/posts/${id}`));


export const fetchTags=createAsyncThunk('tags/fetchPosts',async()=>{
    const {data}=await axios.get('/tags');
    return data;
 });

const initialState={
    posts:{
        items:[],
        status:'loading',
    },
    tags:{
        items:[],
        status:'loading',
    },
};

const postsSlice=createSlice({
    name:'posts',
    initialState,
    reducers:{},
    extraReducers:{
       
      [fetchPosts.pending]:(state,action)=>{  
        state.posts.items=[];
        state.posts.status='loading';
      },
      [fetchPosts.fulfilled]:(state,action)=>{  
        state.posts.items=action.payload;
        state.posts.status='loaded';
      },
      [fetchPosts.rejected]:(state,action)=>{  
        state.posts.items=[];
        state.posts.status='error';
      },
     
      [fetchTags.pending]:(state,action)=>{ 
        state.tags.items=[];
        state.tags.status='loading';
      },
      [fetchTags.fulfilled]:(state,action)=>{ 
        state.tags.items=action.payload;
        state.tags.status='loaded';
      },
      [fetchTags.rejected]:(state,action)=>{ 
        state.tags.items=[];
        state.tags.status='error';
      },

      //Удаление статей
      [fetchRemovePost.pending]:(state,action)=>{ //не дожидаясь сразу удаляем
        state.posts.items=state.posts.items.filter(obj=>obj._id!==action.meta.arg);
      },

      //sorted posrs
      [fetchSortedPosts.pending]:(state,action)=>{ 
        state.posts.items=[];
        state.posts.status='loading';
      },
      [fetchSortedPosts.fulfilled]:(state,action)=>{ 
        state.posts.items=action.payload;
        state.posts.status='loaded';
      },
      [fetchSortedPosts.rejected]:(state,action)=>{ 
        state.posts.items=[];
        state.posts.status='error';
      },
    }
});

export const postsReducer=postsSlice.reducer;