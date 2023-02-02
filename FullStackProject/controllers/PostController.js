import PostModel from '../models/Post.js'
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(
            posts
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить посты"
        });
    }
};
export const getSortedPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort('viewsCount').populate('user').exec();
        posts.reverse();
        res.json(
            posts
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить посты"
        });
    }
};
export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        let hasTags = Boolean(req.body.tags);

        const posts = await PostModel.updateOne({ _id: postId }, {
            title: req.body.title,
            text: req.body.text,
            tags: hasTags ? req.body.tags.split(',') : null,
            user: req.userId,
            imageUrl: req.body.imageUrl
        });

        res.json(
            { "success": true }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить пост"
        });
    }
};
export const deleteOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findByIdAndDelete({ _id: postId }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Не удалось удалить статью"
                });
            }
            if (!doc) {
                console.log(err);
                return res.status(404).json({
                    message: "Статья не была найдена"
                });
            }

            res.json({ success: true });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось удалить пост"
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({
            _id: postId
        }, {
            $inc: { viewsCount: 1 },
        }, {
            returnDocument: 'after',
        }, (err, doc) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Не удалось вернуть статью"
                });
            }
            if (!doc) {
                console.log(err);
                return res.status(404).json({
                    message: "Статья не найдена"
                });
            }

            res.json(doc);
        }).populate('user');

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить посты"
        });
    }
};
export const create = async (req, res) => {
    try {
        let hasTags = Boolean(req.body.tags);
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: hasTags ? req.body.tags.split(',') : null,
            user: req.userId,
            imageUrl: req.body.imagiLink
        });

        const post = await doc.save();

        res.json(
            post
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось добавить пост"
        });
    }
};

export const getLastTags = async (req, res) => {
    try {

        const posts = await PostModel.find();
        const tags = posts.reverse().map((obj) => obj.tags).filter(Boolean).flat().slice(0, 5);

        res.json(
            tags
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить теги"
        });
    }
};