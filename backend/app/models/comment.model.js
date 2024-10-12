const mongoose = require('mongoose');
const User = require("./user.model");

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
},
{
    timestamps: true
});

commentSchema.methods.toCommentResponse = async function (user) {
    const author = await User.findById(this.author).exec();
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: {
            email: author.email,
            token: author.token,
            username: author.username,
            bio: author.bio,
            image: author.image
        }
    };
};

module.exports = mongoose.model('Comment', commentSchema);