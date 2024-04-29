module.exports = (req, res, next)=>{
    if (!req.session.email || !req.session.username){
        return res.redirect("login");
    }
    next()
}