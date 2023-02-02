import React from "react";

import styles from "./AddComment.module.scss";
import axios from '../../axios';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux'

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');

  const { id } = useParams(); //id страницы, которую мы редактируем
  const userData = useSelector((state) => state.auth.data); //пригодится для определения хозяина статьи
  const hasAvatar = Boolean(userData.avatarUrl);
  const navigate = useNavigate();
  function refreshPage() {
    window.location.reload(false);
  }
  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        id, text
      }
      console.log("fields" + JSON.stringify(fields));
      const { data } = await axios.post('/comments', fields);
      console.log(data);
      setText('');
      refreshPage();
    } catch (err) {
      console.log(err);
      alert('Ошибка при создании')
    }
  }
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={userData.avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            value={text}
            onChange={e => setText(e.target.value)}
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
