module.exports = (req, res, next)=>{
    if (!req.session.email || !req.session.username || !req.session.type){
        return res.redirect("/login");
    }
    next()
}