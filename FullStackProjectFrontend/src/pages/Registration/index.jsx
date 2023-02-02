import React from 'react';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux' //useDispatch - Что бы отправить асинхронную функцию fetchPosts в slices/posts
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { fetchUserRegistration, selectIsAuth ,fetchUserEdit} from '../../redux/slices/auth';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import axios from '../../axios';
import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom"; // Navigate нужен для перехода на другую страницу

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
 
  const userData = useSelector((state) => state.auth.data); 

  const inputfileRef = React.useRef(null);//Для загрузки картинки
  const [imageUrl, setImageUrl] = React.useState(null);
  const { id } = useParams(); //id страницы, которую мы редактируем
  let isEditing = Boolean(id);
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(null);
  const [userFullName, setUserFullName] = React.useState(null);
  const [userAvatar, setUserAvatar] = React.useState(null);
  const [userEmail, setUserEmail] = React.useState(null);
  const [userPhone, setuserPhone] = React.useState(null);
  
  React.useEffect(() => { //запрос на backend
    axios.get('/auth/me').then(res=>{
      setUserFullName(res.data.username)
      setUserName(res.data.fullName)
      setUserAvatar(res.data.avatarUrl)
      setUserEmail(res.data.email)
      setuserPhone(res.data.Phone)
    })
  }, []);

  const handleChangeFile = async (event) => { //для обработки выбранной фотографии

    try {
      //специальный формат который позволит вшивать изображение и отправлять в backend
      const formData = new FormData();
      formData.append('image', event.target.files[0]) // применяем к себе специальное свойство для этого
      const { data } = await axios.post('/upload', formData);
      console.log(data.url);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      alert('Ошибка при загрузке изображения')
    }
 
  };

  const onSubmit = async (values) => {
  
    if(imageUrl){
      values.avatarUrl=`http://localhost:4444${imageUrl}`;
    }
    if(isEditing){
      let o = Object.fromEntries(Object.entries(values).filter(([_, v]) => v != '')); //удаляем все пустые/неизмененные поля
      const data = await dispatch(fetchUserEdit({id:id,body:o}));
      console.log("data")
      console.log(o)
      if (data.payload) {
        navigate('/')
              } else {
        alert('Не удалось внести изменения');
      }
    }else{
      const data = await dispatch(fetchUserRegistration(values));
      if (data.payload) {
        window.localStorage.setItem('token', data.payload.token); //сохраняем локально токен в браузере
      } else {
        alert('Не удалось зарегистрироваться');
      }
    }
 
  }

  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    },
    made: 'onChange',
  });
  if (isAuth&&!isEditing) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
      {isEditing ? "Редактирование аккаунта" : "Создание аккаунта"} 
      </Typography>


      <div className={styles.avatar}>
        <Avatar
         onClick={() => inputfileRef.current.click()}  
        sx={{ width: 100, height: 100 }} 
          src={(isEditing? (userAvatar):(<></>))}
        />
      </div>

      <input ref={inputfileRef}   type="file" onChange={handleChangeFile} hidden />
      <form onSubmit={handleSubmit(onSubmit)}>

       
        <TextField className={styles.field}
         
          label={(isEditing? (userName):("Логин"))} 
          error={Boolean(errors.fullName?.message)} 
          helperText={errors.fullName?.message}
          {...register('fullName', { required:(isEditing? (null):('Укажите логин'))  })}
          fullWidth />
        
        <TextField className={styles.field}
         
         label={(isEditing? (userFullName):("Полное имя"))} 
         error={Boolean(errors.fullName?.message)} 
         helperText={errors.fullName?.message}
         {...register('username', { required:(isEditing? (null):('Укажите полное имя'))  })}
         fullWidth />

        <TextField className={styles.field}
         
         label={(isEditing? (userPhone):("Номер телефона"))} 
         error={Boolean(errors.Phone?.message)} 
         helperText={errors.Phone?.message}
         {...register('Phone', { required:(isEditing? (null):('Укажите номер телефона'))  })}
         fullWidth />

        <TextField
          className={styles.field}
          label={(isEditing? (userEmail):("E-Mail"))} 
          error={Boolean(errors.email?.message)} 
          helperText={errors.email?.message}
          {...register('email', { required: (isEditing? (null):('Укажите почту')) })}
          fullWidth />

        <TextField
          className={styles.field}
          label="Пароль"

          error={Boolean(errors.password?.message)} 
          helperText={errors.password?.message}
          {...register('password', { required: (isEditing? (null):('Укажите пароль')) })}
          fullWidth />

        <Button type="submit" size="large" variant="contained" fullWidth>
           {isEditing ? "Сохранить" : "Зарегистрироваться"} 
        </Button>
      </form>
    </Paper>
  );
};
