import Express from "express";
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'; //что бы разрешить подклюсчение из loclhost 8000 to 4444
import { registerValidation, createPostValidation,loginValidation } from './validations/validation.js'
import {register,login,getInfo,updateProfileById} from './controllers/UserController.js'
import {create,getAll,getOne,deleteOne,update,getLastTags,getSortedPosts} from './controllers/PostController.js'
import  {getAllComments, createComment,getCommentsByPost} from './controllers/CommentController.js'

import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'

mongoose.connect('mongodb+srv://admin:wwww@cluster0.ppxmvhw.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => { console.log('DB ok'); })
    .catch((err) => { console.log('DB error', err) });

const app = Express();

//создаем хранилище картинок
const storage=multer.diskStorage({
   destination: (_,__,cb)=>{
    cb(null, 'uploads'); //какой путь используем
   },
   filename:(_,file,cb)=>{
    cb(null, file.originalname);// перед тем как сохранить, присваиваем имя файла
   },
});
const upload=multer({storage});

app.use(Express.json());
app.use(cors());
app.use('/uploads', Express.static('uploads')); // static - get запрос на получение именно статичного файла(картинки)

app.post('/upload',upload.single('image'),(req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`
    })
})

app.post('/auth/login',loginValidation,handleValidationErrors, login);
app.post('/auth/register', registerValidation,handleValidationErrors,register );
app.get('/auth/me', checkAuth, getInfo);
app.put('/users/:id', checkAuth, updateProfileById);

app.get('/posts', getAll);
app.get('/posts/sorted', getSortedPosts);
app.get('/posts/:id', getOne);
app.post('/posts',checkAuth,createPostValidation,handleValidationErrors, create);
app.delete('/posts/:id', checkAuth,deleteOne);
app.patch('/posts/:id',checkAuth, createPostValidation, handleValidationErrors, update);

app.post('/comments',checkAuth, createComment);
app.get('/comments', getAllComments);
app.get('/:id/comments', getCommentsByPost);

app.get('/tags', getLastTags);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});

