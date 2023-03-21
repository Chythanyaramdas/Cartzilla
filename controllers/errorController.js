exports.get404 = (req,res,next)=>{
    res.status(404).render('users/404',{message:'Page Not Found'});
};