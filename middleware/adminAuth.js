// const isLogin=async(req,res)=>{
//     try{

//         if(req.session.admin_id)
//         {
//         next();
//         }
    
//     else
//     {
//         res.redirect('/admin')
//     }
// }
//     catch(error){
//         console.log(error.message)
//     }
// }

// const isLogout=async(req,res)=>{
//     try{
//         if(req.session.admin_id)
//         {
//             res.redirect('/admin/dashBoard')
//         }

//         else{

//             next();
//         }

//     }
//     catch(error)
//     {
//         console.log(error.message)
//     }
// }

// module.exports={
//     isLogin,isLogout
// }


const isLogin = async (req, res, next) => {
    try {
        if (req.session.adminId) {
            next()
        } else {
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    isLogin
}