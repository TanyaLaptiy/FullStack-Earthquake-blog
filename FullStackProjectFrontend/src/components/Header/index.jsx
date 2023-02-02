import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, logout } from '../../redux/slices/auth';


export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);


  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout())
    }
  };


  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Earthquake BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button className={styles.write} variant="contained">Написать статью</Button>
                </Link>
                <Button className={styles.exit} onClick={onClickLogout} variant="contained"  >
                  Выйти
                </Button>

                <div className={styles.dropdown}>
                  <Button className={styles.menu} variant="contained">Меню</Button>
                  <div className={styles.dropdowncontent}>
                     <a href={`/users/${userData._id}`}>Profile</a> 
                    <a href="/">Objects</a>
                    <a  href="/criterias-list">Characteristics</a>
                </div>
              </div>
              
              </>
          ) : (
          <>

            <Link to="/login">
              <Button variant="outlined">Войти</Button>
            </Link>
            <Link to="/register">
              <Button variant="contained">Создать аккаунт</Button>
            </Link>
          </>
            )}
        </div>
    </div>
      </Container >
    </div >
  );
};
