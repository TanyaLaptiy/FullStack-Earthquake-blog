import React from "react";
import axios from '../axios';
import '../index.scss';
import { useParams } from 'react-router-dom';
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown"
import { fetchCommentsByObject } from '../redux/slices/comments';
import { selectIsAuth } from '../redux/slices/auth';

import { useDispatch, useSelector } from 'react-redux' 

export const FullPost = () => {
  const isAuth = useSelector(selectIsAuth);

  const [data, setData] = React.useState({});
  const [isLoading, setLoading] = React.useState(true);

  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { comments } = useSelector((state) => state.comments); 
  

  React.useEffect(() => {
    dispatch(fetchCommentsByObject(id));

    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
    }).catch(err => {
      console.warn(err);
      alert('Ошибка при получении статьи!');
    }).finally(() => { setLoading(false) });

  }, []);  

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentCount}
        tags={data.tags}
        isFullPost
      >
   
        <ReactMarkdown children={data.text} />

      </Post>


      <CommentsBlock items={comments.items}

        isLoading={false}
      >
      { isAuth? (<Index />):(<></>)}
      </CommentsBlock>
    </>
  );
};
