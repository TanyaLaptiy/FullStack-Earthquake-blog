import mongoose from 'mongoose';

const CommentSchema=new mongoose.Schema({
    text:{
        type: String,
        required:true,
    },
    postid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
},{
    timestamps:true, //Дата создания и обновления это сущности будет всегда запонинаться при создании
});

export default mongoose.model("Comment",CommentSchema);