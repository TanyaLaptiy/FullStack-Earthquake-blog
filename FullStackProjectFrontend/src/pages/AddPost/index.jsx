import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useDispatch, useSelector } from 'react-redux'  

import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";  


export const AddPost = () => {
 
  const [text, setText] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const inputfileRef = React.useRef(null);//Для загрузки картинки
  const navigate = useNavigate();
  const { id } = useParams(); //id страницы, которую мы редактируем
  let isEditing = Boolean(id);
  const { state } = useLocation();


  if (state) {
    console.log('there is state!!');
    console.log(state);


  } else {
    console.log("NONE");
  }
  const handleChangeFile = async (event) => { 
    try {
      
      const formData = new FormData();
      formData.append('image', event.target.files[0]) 
      const { data } = await axios.post('/upload', formData);
      console.log(data.url);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      alert('Ошибка при загрузке изображения')
    }
  
  };

  const onClickRemoveImage = () => {
    setImageUrl(null);
  };

  const onChange = React.useCallback((value) => { 
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      let imagiLink = null;
      if (imageUrl) {
        imagiLink = `http://localhost:4444${imageUrl}`;
      }
      console.log(tags);
      const fields = {
        title, text, imagiLink, tags
      }

      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);
      const post_id = isEditing ? id : data._id;

      navigate(`/posts/${post_id}`);
    } catch (err) {
      console.log(err);
      alert('Ошибка при создании')
    }
  }


  const userData = useSelector((state) => state.auth.data);

  React.useEffect(() => {
   

    if (id) {//Значит путь у нас не такой /add-post а такой /posts/:id/edit
     

    
      if (!state) {
        axios.get(`/posts/${id}`).then(res => {
          console.log(res);
          setTitle(res.data.title);
          setText(res.data.text);
          if (res.data.tags && res.data.tags.length > 0) {
            setTags(res.data.tags.join(','))
          }
          if (res.data.imageUrl) {
            setImageUrl(res.data.imageUrl.split('4444')[1]);
          }
        }).catch(err => {
          console.log(err);
          alert('Ошибка при получении статьи')
        })
      }

    }

  }, [])


  const options = React.useMemo( 
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token')) {
    return <Navigate to="/" />; 
  }


  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputfileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputfileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />

      <div className={styles.buttons}>

        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large" >Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
