const UserModel = require('../models/user')

module.exports = async (req, res, next)=>{
    if (req.session.type != 'student'){
        return res.redirect("/");
    }
    next()
}