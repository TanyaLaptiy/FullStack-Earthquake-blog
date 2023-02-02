import {body} from 'express-validator';

export const registerValidation=[
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
    body('fullName','Имя должно быть минимум 3 символов').isLength({min:3}),
]
export const loginValidation=[
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
   
]

export const createPostValidation=[
    body('title','Введите заголовок статьи').isLength({min:3}).isString(),
    body('text','Введите текст статьи').isLength({min:10}).isString(),
    body('tags','Неверный формат тэгов (укажите массив)').optional(),
    body('imageUrl','Неверная ссылка на изображение').optional().isURL(),
]