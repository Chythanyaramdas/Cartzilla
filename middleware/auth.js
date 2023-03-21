// const isLogin=async(req,res,next)=>{

//     try{
//         if(req.session.user_id){
// next();

//         }

//         else{
//             res.redirect('/')
          
//         }

      

//     }
//     catch(error){
//         console.log(error.message);
//     }

// }

// const isLogout=async(req,res,next)=>{

//     try{

//         if(req.session.user_id)
//         {
//             res.redirect('/')
            
//         }
//         else{
//             next();

//         }

    
       

//     }
//     catch(error){
//         console.log(error.message);
//     }

// }

// module.exports={
//     isLogin,isLogout
// }





const isLogin = async (req, res, next) => {
    try {
        if (req.session.userid) {
            next()
        } else {
            res.redirect("/sign")
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    isLogin
}