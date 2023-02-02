import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from '../models/User.js'

export const register=async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            Phone: req.body.Phone,
            fullName: req.body.fullName,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, 'secret123',
            {
                expiresIn: '30d'
            });

        const { passwordHash, ...userData } = user._doc;  

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        });
    }
};

export const login =  async (req, res) => {
    try {
         const user = await UserModel.findOne({ email: req.body.email });
      
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'   
            });
        }


        const token = jwt.sign({
            _id: user._id
        }, 'secret123',
            {
                expiresIn: '30d'
            });

        const { passwordHash, ...userData } = user._doc;   

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться"
        });
    }

};

export const getInfo=async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const { passwordHash, ...userData } = user._doc; 

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить информацию"
        });
    }
}
export const updateProfileById=async (req, res) => {
  
    try {
        const userId= req.params.id;
        UserModel.findOneAndUpdate({
            _id:userId
        },{
            email: req.body.email,
            passwordHash: req.body.password,
            Phone: req.body.Phone,
            username: req.body.username,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl
        },{
            returnDocument:'after',
        }, (err,doc)=>{  

            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "Не удалось изменить данные аккаунта"
                }); 
            }
            if(!doc){   
                console.log(err);
                return res.status(404).json({
                    message: "Аккаунт не найден"
                }); 
            }

            res.json(doc);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить информацию"
        });
    }
}