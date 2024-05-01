module.exports = (req, res, next)=>{
    if (req.session.type != 'hod'){
        return res.redirect("/login");
    }
    next()
}