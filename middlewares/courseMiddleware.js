const UserModel = require('../models/user')

module.exports = async (req, res, next)=>{
    if (req.session.type != 'student'){
        return next();
    }
    let user = await UserModel.getUser(req.session.username, 'student')
    if (!user.courses){
        return res.redirect('/courses')
    }
    next()
}