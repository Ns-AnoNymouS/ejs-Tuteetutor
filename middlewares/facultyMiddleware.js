module.exports = (req, res, next)=>{
    if (req.session.type != 'hod' && req.session.type != 'faculty'){
        return res.redirect("/");
    }
    next()
}