import {configureStore} from '@reduxjs/toolkit';
import {postsReducer} from './slices/posts';
import {commentsReducer} from './slices/comments';
import {authReducer} from './slices/auth';

const store=configureStore({
    reducer:{
      posts:postsReducer,
      auth:authReducer,
      comments:commentsReducer
    },
});

export default store;
