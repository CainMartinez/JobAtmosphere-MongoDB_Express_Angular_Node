const Job = require('../models/job.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const asyncHandler = require('express-async-handler');

const addCommentsToJob = asyncHandler(async (req, res) => {
    const id = req.userId;
    const commenter = await User.findById(id).exec();
    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    const { slug } = req.params;
    const job = await Job.findOne({slug}).exec();
    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    const { body } = req.body.comment;
    const newComment = await Comment.create({
        body: body,
        author: commenter._id,
        job: job._id
    });
    await job.addComment(newComment._id);

    return res.status(200).json({
        comment: await newComment.toCommentResponse(commenter)
    });
});

const getCommentsFromJob = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const job = await Job.findOne({slug}).exec();
    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }

    const loggedin = req.loggedin;

    if (loggedin) {
        const loginUser = await User.findById(req.userId).exec();
        return await res.status(200).json({
            comments: await Promise.all(job.comments.map(async commentId => {
                const commentObj = await Comment.findById(commentId).exec();
                if (commentObj) {
                    return await commentObj.toCommentResponse(loginUser);
                }
                return null;
            })).then(comments => comments.filter(comment => comment !== null))
        });
    } else {
        return await res.status(200).json({
            comments: await Promise.all(job.comments.map(async (commentId) => {
                const commentObj = await Comment.findById(commentId).exec();
                if (commentObj) {
                    return await commentObj.toCommentResponse(null);
                }
                return null;
            })).then(comments => comments.filter(comment => comment !== null))
        });
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const commenter = await User.findById(userId).exec();
    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    const { slug, id } = req.params;
    const job = await Job.findOne({slug}).exec();
    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }
    const comment = await Comment.findById(id).exec();
    if (comment.author.toString() === commenter._id.toString()) {
        await job.removeComment(comment._id);
        await Comment.deleteOne({ _id: comment._id });
        return res.status(200).json({
            message: "Comment has been successfully deleted!!!"
        });
    } else {
        return res.status(403).json({
            error: "Only the author of the comment can delete the comment"
        });
    }
});

module.exports = {
    addCommentsToJob,
    getCommentsFromJob,
    deleteComment
};