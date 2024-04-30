module.exports = (req, res, next)=>{
    if (req.session.email || req.session.username || res.session.type){
        return res.redirect("home");
    }
    next()
}