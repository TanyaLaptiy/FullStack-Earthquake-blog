import CommentModel from '../models/Comment.js'
import PostModel from '../models/Post.js'

export const getAllComments = async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('user').populate('postid').exec();
        res.json(
            comments
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить кооментарии"
        });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await CommentModel.find({ "postid": { _id: postId }, }).populate('user').populate('postid').exec();

        res.json(
            comments
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить кооментарии"
        });
    }
};

export const createComment = async (req, res) => {

    try {

        const doc = new CommentModel({
            text: req.body.text,
            postid: req.body.id,
            user: req.userId,

        });

        const comment = await doc.save();

        PostModel.findOneAndUpdate({
            _id: req.body.id
        }, {
            $inc: { commentCount: 1 },
        }, {
            returnDocument: 'after',
        }, (err, doc) => {  //пишем функция для обработки ошибок, так как await не используется здесь

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Не удалось вернуть статью"
                });
            }
            if (!doc) {  //если ошибки нет, но документ = undifined
                console.log(err);
                return res.status(404).json({
                    message: "Статья не найдена"
                });
            }


        }).populate('user');
        
        res.json(
            comment
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось добавить комментарий"
        });
    }
};

