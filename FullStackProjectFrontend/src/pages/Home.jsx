import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axios from '../axios';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux' 
import { fetchPosts, fetchTags, fetchSortedPosts } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';

export const Home = () => {
  const [value, setValue] = React.useState(0); 
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments); 

  const { posts, tags } = useSelector((state) => state.posts); 
  const userData = useSelector((state) => state.auth.data); 
  const isPostLoading = posts.status == 'loading';
  const isTagsLoading = tags.status == 'loading';


  React.useEffect(() => {  
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    if (newValue === 1) {
      dispatch(fetchSortedPosts());
    } else {
      dispatch(fetchPosts());
    }

  };
 
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} onChange={handleChange} value={value} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>

      <Grid container spacing={4}>

        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostLoading ? (<Post key={index} isLoading={true} />)
              :
              (
                <Post
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.commentCount}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}  
                />
              ))}
        </Grid>


        <Grid xs={4} item>

          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
 
          <CommentsBlock
            items={comments.items}
           
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
