module.exports = (app) => {
    const {verifyJWT} = require('../middleware/verifyJWT');
    const verifyJWTOptional = require('../middleware/verifyJWTOptional');
    const comment = require('../controllers/comment.controller');
    
    app.get('/:slug/comments', verifyJWTOptional, comment.getCommentsFromJob);

    app.post('/:slug/comments', verifyJWT, comment.addCommentsToJob);

    app.delete('/:slug/comments/:id', verifyJWT, comment.deleteComment);
    
    // Si nos sobra el tiempo haremos el update. 
    // app.put('/:slug/comments/:id', verifyJWT, comment.updateComment);
}