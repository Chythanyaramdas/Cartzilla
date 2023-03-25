const User=require("../models/userModel");
const product=require("../models/productModel")
const  Categorie=require("../models/categoryModel")
const banner = require('../models/bannerModel')
const  coupon=require('../models/couponModel')
const order=require('../models/orderModel')
const orderItems=require('../models/orderItemsModel')
 const bcrypt=require("bcrypt");
 const sharp=require('sharp')




// html to pdf require
const ejs = require('ejs')
const pdf = require("html-pdf")
const fs = require('fs')
const path = require('path')



//===================================LoginManagement============================================================

const loadLogin=async(req,res)=>{

    try{
        res.render('login')


    }
    catch(error){
        console.log(error);

    }
}


const verifyLogin= async (req, res) => {
    try {
    
      const email=req.body.email;
      const password=req.body.password
      const adminData= await User.findOne({ email:email });
      console.log("yes start");

      if(adminData)
      {
        console.log("yes here");
        const passwordMatch=await bcrypt.compare(password,adminData.password)
        

        if(passwordMatch){
    
      if(adminData.is_admin ===0){
       
        res.render('login',{message:"Invalid User Or Password"})
      }
      
      else{
       
       console.log("yes");
         res.redirect('/admin/dashBoard')
      }
        
    }
else{
    res.render('login',{message:"Invalid User Or Password"})
}

      }else{
        res.render('login',{message:"Invalid User Or Password"})
      }

                    
               
        
    

   
      
    } catch (error) {
      console.log(error)
    }
      }




//==================================================CategoryManagement=====================================================


const CategoryPage=async(req,res)=>{
    try {

        const category=await Categorie.find({}) 
        res.render('category',{category})
        
    } catch (error) {

        console.log(error);
        
    }
}






// const loadCategorys=async(req,res)=>{
//         console.log('load category')
//         try{
//         const category=new Categorie ({
//          name:req.body.name,
//          description:req.body.description
//         });
    
    
       
       
    
//         const categoryData=await category.save().then(()=>{
//             res.redirect("/admin/category")
//          })
    
//        }
    
       
         
         
     
        
//         catch(error){
    
//            console.log(error);
         
//         }
//      }
  


const loadAddCategory=async(req,res)=>{

    try {

        const category=await Categorie.find({}) 
        res.render('addCategory',{category})
        
    } catch (error) {

        console.log(error);
        
    }
}
     
 const loadCategory=async(req,res)=>
 {
    try{
        
        const name=req.body.name
        const description=req.body.description
        const existCategory=await Categorie.findOne({name:{$regex:name,$options:'i'}})


        if(existCategory){

            res.render('addCategory',{message:'category already existed'})
        }

        else
        {

            const category=new Categorie({
                name:req.body.name,
                description:req.body.description
                
             

            })

            const categoryData= await category.save()
            if(categoryData){
                res.render('addCategory',{message:"category added successfully"})
            }

            else{
                res.render('addCategory',{message:"something went wrong"})

            }
        }

    }

    catch(error){

        console.log(error);
    }
 }
 
//  ===================================week8code======================================
// const loadCategory = async(req,res)=>{
//     try {
//         const name = req.body.name;
//         const description = req.body.description
//         const oldCategorie = await Categorie.findOne({name:{$regex:name,$options:'i'}});
//         if(oldCategorie){
//             res.render('category',{message: 'Already exists this category'})
//         }else{
//             const newcategorie = new Categorie({
//                 name : name,
//                 description : description,
               
//             });
//             const categorieData = await newcategorie.save()
//             if(categorieData){
//                 res.render('category',{message : 'Successfully added new categorie'})
//             }else{
//                 res.render('category',{message : 'something went wrong.Try again'})
//             }
//         }  
//     } catch (error) {
//         console.log(error)
//     }
// }







const editCategoryLoad=async(req,res)=>{
    try {

        const  id=req.query.id;

        const category=await Categorie.findById({_id:id});

        res.render('edit-category',{category})

        
        
    } catch (error) {
        console.log(error);
        
    }
}


 
 
   const updateCategory=async(req,res)=>{
    try {

       
        const category=await Categorie.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,description:req.body.description}})
        
        res.redirect("/admin/category")
        console.log("also false");
    } catch (error) {

        console.log(error);
        
    }
   }



   const deleteCategory=async(req,res)=>{

        try{
    
            const  id=req.query.id;
            await Categorie .findByIdAndDelete({_id:id});
            res.redirect('/admin/category');
    
        }
    
        catch(error){
    
            console.log(error.message);
        }
    }
   


    //==============================================ProductManagement=====================================================


   const products=async(req,res)=>{
    

    try {

        const productData=await product.find({is_delete:false}).populate('category')
        const categoriesData=await Categorie.find({is_delete:false});
        console.log(productData);
        res.render('product',{product:productData,category:categoriesData})
        
        
    } catch (error) {

        console.log(error);
        
    }

 }

 const loadAddProduct=async(req,res)=>{

    try {

        const categoriesData=await Categorie.find({});
        // const allowedSizes = await product.schema.path('sizes').enumValues;
        // console.log(allowedSizes);
        res.render('addProduct',{category:categoriesData})
        
    } catch (error) {

        console.log(error);
        
    }



 }


 const addProduct=async (req, res) => {
   

    try {
       
        
        console.log(req.body.category)
        console.log(req.files)
        //  const images = req.file.filename
        // const images = req.files.map((files)=> files.filename)
       
// ================================================================================================

      let imageId = [];

        const cropWidth = 550;
        const cropHeight = 370;

        for (let i = 0; i < req.files.length; i++) {
            const imagePath = path.join(__dirname, '../public/img/marketplace/products', req.files[i].filename);
            const croppedImagePath = path.join(__dirname, '../public/img/marketplace/products', 'address_' + req.files[i].filename);

            // Load the image using sharp
            const image = sharp(imagePath);

            // Convert the image to JPEG format with higher quality
            await image
                .jpeg({ quality: 90 })
                .resize(cropWidth, cropHeight, { fit: 'cover' })
                .toFile(croppedImagePath);

            // Add the cropped image to the imageId array
            imageId.push('address_' + req.files[i].filename);

            try {
                // Change the file permissions to allow deletion
                fs.chmodSync(imagePath, 0o777);

                // Delete the original WebP file
                fs.unlinkSync(imagePath);
            }catch(err){
                console.log(err.message);
            }
        }
        
        const productData = new product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: imageId,
            category:req.body.category,
              
                quantity: req.body.quantity
          });
            

     const data=await  productData.save()
     res.redirect('/admin/product');
     console.log(data);
        res.render('product',{product:productData});
    //  =============================================================================================================
    } catch (err) {
      console.log(err);
    }


  }

//   const updateProduct = async(req,res)=>{
//     try {
//             if(req.session.userid){
//                 console.log('hello');
//                 const productData = await product.findOne({_id:req.query.id});
//                 console.log(productData)
//                 // const allowedSizes = await product.schema.path('sizes').enumValues
//                 const category = await Categorie.find({})
//                 res.render('updateProduct',{product:productData,category:category})
//             }
          

//     } catch (error) {
//         console.log(error.message)
//     }
// }



const editProduct=async(req,res)=>{
try {
     
    const  id=req.query.id;
        const productData=await product.findOne({_id:id}).populate('category')

    const categoryData = await Categorie.find({})
    res.render('updateProduct',{product:productData,category:categoryData})
    
} catch (error) {
    console.log(error);
    
}



}


// const updateProduct=async(req,res)=>{
//     try{
//         const categoryData=await Categorie.find({})
//         console.log("vann");
//         // const images= req. file.filename
//         const productData=await product.findOneAndUpdate({_id:req.body.id},{$set:{name:req.body.name,description:req.body.description,price:req.body.price,category:req.body.category,quantity:req.body.quantity}},{new:true})
//        console.log("vidm vann");
        
//       res.render('updateProduct',{product:productData,category:categoryData})
//     // if(productData){
//     //     res.render('updateProduct',{message:'successfully updated',product:productData,category:categoryData})
//     // }else{
//     //     res.render('updateProduct',{message:'something went wrong'});
//     // }
    
//     }
//     catch(error){

//         console.log(error);
//     }
// }


const updateProduct=async(req,res)=>{
    try{
        const id=req.query.id
        const bid=req.body.id
        console.log(id);
        const productDatas=await product.findById({_id:id})
        const categoryData=await Categorie.find({})
        
        
        
      let imageId = [];

      const cropWidth = 1100;
      const cropHeight = 1467;

      for (let i = 0; i < req.files.length; i++) {
          const imagePath = path.join(__dirname, '../public/img/marketplace/products', req.files[i].filename);
          const croppedImagePath = path.join(__dirname, '../public/img/marketplace/products', 'address_' + req.files[i].filename);

          // Load the image using sharp
          const image = sharp(imagePath);

          // Convert the image to JPEG format with higher quality
          await image
              .jpeg({ quality: 90 })
              .resize(cropWidth, cropHeight, { fit: 'cover' })
              .toFile(croppedImagePath);

          // Add the cropped image to the imageId array
          imageId.push('address_' + req.files[i].filename);

          try {
              // Change the file permissions to allow deletion
              fs.chmodSync(imagePath, 0o777);

              // Delete the original WebP file
              fs.unlinkSync(imagePath);
          }catch(err){
              console.log(err.message);
          }
      }
      
        // const image = req.files.map((files)=> files.filename)
        console.log("vann");

        for(let i=0;i<imageId.length;i++){

            const imagesUploads=imageId[i]
            const productData=await product.updateOne({_id:id},{$push:{image:imagesUploads}})
            console.log('productData'+productData);
           

        }
        
            const productData=await product.findByIdAndUpdate({_id:bid},{$set:{name:req.body.name,
                description:req.body.description,
                price:req.body.price,
                // image:image,
                category:req.body.category,
                quantity:req.body.quantity}})
        
            console.log(productData);
    
    
    // await productData.save().then(()=>{
        // res.render('product',{product:productData,category:categoryData})
        res.redirect('/admin/product')

   
}
catch(error){

    console.log(error);
}



}



const deleteImage=async(req,res)=>{
    try {

        const id=req.query.id;
        const pId = req.query.pid
        const imageUpdates=await product.updateOne({image:id},{$pull:{image:{$in:[id]}}})
        console.log(imageUpdates);
       if(imageUpdates){
        res.redirect('/admin/updateProduct/?id='+pId)
        // res.redirect('/admin/product')
       }
       
       const imagePath = path.join(__dirname,'..','public','img','marketplace','products',id)
        fs.unlink(imagePath,(err)=>{
            if(err){
                console.log(err.message);
                throw err
            }else{
                console.log(`${id} deleted!`);
            }
        })

    } catch (error) {

        console.log(error);
        
    }
}

const deleteProduct=async(req,res)=>{

    try {

        const id=req.query.id
        await product.findByIdAndUpdate({_id:id},{$set:{is_delete:true}})
      res.redirect('/admin/product')

        
    } catch (error) {

        console.log(error);
        
    }
}



 

//====================================================Dashboard===================================================


const loadDashBoard=async(req,res)=>{
    try {

    const userData=await User.find({is_admin:0,isBlocked:false}).countDocuments()  
    const orderData=await order.find({}).sort({createdDate:-1}).populate('user','name') 
        const pipeLine=[
            {
                $group:{
                    _id:null,
                    totalOrder:{$sum:1},
                    totalSales:{$sum:'$totalPrice'}
                }
            }
        ]
        const orderDetails=await order.aggregate(pipeLine)
       
         // const circular = categoryWise
         

        const categoryWise = await order.aggregate([
            {
                 $match:{orderStatus:"Placed"}
            },
            {
                $unwind:"$product"
            },
            {
                $lookup:{
                    from:"products",
                    localField:"product.productId",
                    foreignField:"_id",
                    as:"product"
                }
            },
            {
                $unwind:"$product"
            },

            {
                $lookup:{
                    from:"categories",
                    localField:"product.category",
                    foreignField:"_id",
                    as:"category"

                }
            },
            {
                $unwind:"$category"
            },
            {
                $group:{
                    "_id":"$category.name",
                    "totalSale":{$sum:"$product.price"}
                }
            }
            // {
            //     $group:{
            //         _id:"$product.category",
            //        totalSale:{$sum:"$product.price"}
            //     }
            // }
           
        ])
        console.log(categoryWise);
        const categoryName = categoryWise.map((category)=>category._id)
        const circular = categoryWise.map((category)=>category.totalSale)
        console.log(categoryName);
        console.log(circular);
        
        // doughnut
        const totalOrder=await order.find({orderStatus:"Placed"}).countDocuments()
        const paymentMethod =await order.aggregate([
            {
                $match:{orderStatus:"Placed"}
            },
            {
                $group:{
                    _id:"$paymentMethod",
                    count:{$sum:1}
                }
            },
            {
                $project:{
                    _id:0,
                    paymentMethod:"$_id",
                    percentage:{
                        $multiply:[
                            {$divide:["$count",totalOrder]},100
                        ]
                    }
                }
            },
            {
                $sort:{
                    paymentMethod:1
                }
            }
        ])
        console.log(paymentMethod)


        // bar chart



        
        const donutChart = paymentMethod.map((payment)=> payment.percentage) 


        
        //  res.render('home',{admin: userData,orderDetails,totalUser,orderData,circular,donutChart})

        const weeklySales = await order.aggregate([
            {$match:{
                createdDate:{
                    $gte: new Date(new Date().getTime() - (7*24*60*60*1000))
                },
                orderStatus:"Placed"
            }
            
        },
        {
            $group:{
                _id:{
                    $dayOfWeek:'$createdDate'
                },
                totalAmount:{
                    $sum:
                        "$totalPrice"  
                }
            }
        },{
            $sort:{
                _id:1
            }
        }

        ])

        // weekly sales

        // const weeklySales = await order.aggregate([
        //     {$match:{
        //         createdDate:{
        //             $gte: new Date(new Date() - 7*24*60*1000)
        //         },
            
        //     orderStatus:"Placed"
        //     }
        // },
        // {
        //     $group:{
        //         _id:{
        //             $dayOfWeek: "$createdDate"
                    
        //         },
        //         totalAmount:{
        //             $sum:{
        //                 $add:["$totalPrice"]
        //             }
        //         }
        //     }
        // },{
        //     $sort:{
        //         _id:1
        //     }
        // }

        // ])
        // ==========================================================================================
        // const weeklySales = await order.aggregate([
        //     {
        //         $project: {
        //             dayOfWeek: { $dayOfWeek: "$createdDate" },
        //             totalPrice: 1,
        //             orderStatus: 1
        //         }
        //     },
        //     {
        //         $match: {
        //             dayOfWeek: { $gte: 2, $lte: 7 }, // Monday to Sunday
        //             orderStatus: "Placed",
        //             createdDate: {
        //                 $gte: new Date(new Date() - 7*24*60*60*1000) // last 7 days
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$dayOfWeek",
        //             totalAmount: { $sum: "$totalPrice" }
        //         }
        //     },
        //     {
        //         $sort: { _id: 1 }
        //     }
        // ]);
        const barChart=weeklySales.map(item=> item.totalAmount);
        
        console.log("barChart:"+weeklySales);

        res.render('dashBoard',{orderData,orderDetails,userData,circular,categoryName,donutChart, barChart})

    } catch (error) {

        console.log(error);
        
    }
}


//================================================= sales report===================================================
 
const salesReport=async(req,res)=>{
     try {

       
       //
    //      const circular = categoryWise
         

    //     const categoryWise = await order.aggregate([
    //         {
    //              $match:{orderStatus:"Placed"}
    //         },
    //         {
    //             $unwind:"$product"
    //         },
    //         {
    //             $lookup:{
    //                 from:"products",
    //                 localField:"product.productId",
    //                 foreignField:"_id",
    //                 as:"product"
    //             }
    //         },
    //         {
    //             $unwind:"$product"
    //         },

    //         {
    //             $lookup:{
    //                 from:"categories",
    //                 localField:"product.category",
    //                 foreignField:"_id",
    //                 as:"category"

    //             }
    //         },
    //         {
    //             $unwind:"$category"
    //         },
    //         {
    //             $group:{
    //                 "_id":"$category.name",
    //                 "totalSale":{$sum:"$product.price"}
    //             }
    //         },
    //         {
    //             $group:{
    //                 "_id":null,
    //                 "totalSalesAmount":{$sum:"$totalSale"},
    //                 "categorySales":{$push:{category:"$_id",totalSale:"$totalSale"}}
    //             }
    //         }
    //     ])
    //     console.log(totalSales[0])
    //     const totalSale = totalSales[0]


         res.render('salesReport')
        
    } catch (error) {
        
    }
}

const loadSalesReport = async(req,res)=>{
    try {
        // const totalSales = await order.aggregate([
        //     {
        //         $match:{orderStatus:'Placed'}
        //     },
        //     {
        //         $unwind:"$product"
        //     },
        //     {
        //         $lookup:{
        //             from:"products",
        //             localField:"product.productId",
        //             foreignField:"_id",
        //             as:"product"
        //         }
        //     },
        //     {
        //         $unwind:"$product"
        //     },
        //     {
        //         $lookup:{
        //             from:'categories',
        //             localField:"product.category",
        //             foreignField:"_id",
        //             as:"category"
        //         }
        //     },
        //     {
        //         $unwind:"$category"
        //     },
        //     {
        //         $group:{
        //             "_id":"$category.Title",
        //             "totalSale":{$sum:"$product.price"}

        //         }
        //     },
        //     {
        //         $group:{
        //             "_id":null,
        //             "totalSalesAmount":{$sum:"$totalSale"},
        //             "categorySales":{$push:{category:"$_id",totalSale:"$totalSale"}}
        //         }
        //     }
        // ])
        let from;
        let to;
        if(req.query.from && req.query.to){
            from = req.query.from
            to = req.query.to
        console.log(from)
        console.log(to)
        

        // at the time of rendering (default)
        }else{
            to = new Date()
            let fromDate = new Date(to.getTime()-(7*24*60*60*1000))
            from = fromDate
            console.log(from)
            console.log(to)
        }
       
        const orderData = await order.find({createdDate:{$gte: from,$lte:to}}).sort({createdDate:-1}).populate('user').populate("product.productId","name")
       console.log("ghjgikg"+orderData);
     
        res.render('salesReport',{orderData})
    } catch (error) {
        console.log(error.message);
    }
}

const salesReportDownload = async(req,res)=>{

    try {
        let from;
        let to;
        if(req.body.from && req.body.to){
            console.log('hesr');
            from = req.body.from
            to = req.body.to
        console.log(from)
        console.log(to)
        
        }else{
            to = new Date()
            let fromDate = new Date(to.getTime()-(7*24*60*60*1000))
            from = fromDate
            console.log(from)
            console.log(to)
        }
        const orderData = await order.find({createdDate:{$gte:from,$lte:to}}).sort({createdDate:-1}).populate("user").populate("product.productId","name")
        const data= {
            orderData:orderData,
            from, to
        }
        const filePathName = path.resolve(__dirname,'../views/admin/htmlToPdf.ejs')
        const htmlString = fs.readFileSync(filePathName).toString()
        const ejsData = ejs.render(htmlString,data)
        const option = {
            format:"letter",
        }
        pdf.create(ejsData,option).toFile('./public/reports/saleReport.pdf',(err,response)=>{
            if(err)console.log(error.message);

            console.log("file created");
            res.json({});
        })

    } catch (error) {
        console.log(error.message);
    }
}

//===================================================UserManagement=================================================



const userManagement = async(req,res)=>{
  try {
      
      var search = '';
      if(req.query.search){
          search = req.query.search;
      }

      const userData = await User.find({is_admin: 0,$or:[
          {name:{$regex:'.*'+search+'.*',$options:'i'}},
          {emali:{$regex:'.*'+search+'.*',$options:'i'}}
      ]})
      res.render('userManagement',{users:userData})

  } catch (error) {
      console.log(error.message)
  }
} 

const blockUser = async(req,res)=>{
  try {
      
      const id = req.query.id;
      console.log(id)
      const userData = await User.findOneAndUpdate({_id:id},{$set:{isBlocked:true}})
      req.session.userid=""
      res.redirect('/admin/user')
  } catch (error) {
      console.log(error.message)
  }
}


const UnblockUser = async(req,res)=>{
  try {
      const id = req.query.id;
      console.log(id)
      const userData = await User.findOneAndUpdate({_id:id},{$set:{isBlocked:false}})
      res.redirect('/admin/user')
  } catch (error) {
      console.log(error.message)
  }
}


const deleteUser = async(req,res)=>{
  try {
      const id = req.query.id;
      await User.deleteOne({_id: id});
      res.redirect('/admin/user')
  } catch (error) {
      console.log(error.message)
  }
}

  //===================================bannerManagement===================


  const loadBannerManagement = async(req,res)=>{
    try {
        // if(req.session.userid){
            const bannerData = await banner.find({is_delete:false})
            
            res.render('bannerManagement',{banner:bannerData})
        // }
        // }else{
        //     res.redirect('/admin')
        // }
    } catch (error) {
        console.log(error.message);
    }
}

const loadaddBanner = async(req,res)=>{
  try {
             res.render('addBanner')
      }
    //   else{
    //       res.redirect('/admin')
    //   }
  catch (error) {
      console.log(error.message)
  }
}


const addBanner = async(req,res)=>{
  try {
    //   const images = req.files.map(file=>file.filename)
    const images = req.files.filename
      const bannerData = new banner({
        title : req.body.name,
        image : images,
        url : req.body.url ,
        description: req.body.description 
      })
    //   if(bannerData){
          await bannerData.save()
          res.redirect('/admin/banners')
    //   }
    //   else{
    //       res.redirect('/admin/add_banner')
    //   }
      
      
  } catch (error) {
      console.log(error.message)
  }
}


const loadupdateBanner = async(req,res)=>{
  try {
      const id = req.query.id;
      const bannerData = await banner.findById({_id:id})
      res.render('updateBanner',{banner:bannerData})
      
  } catch (error) {
      console.log(error.message);
  }
}

const updateBanner = async(req,res)=>{
  try {
      const id = req.body.id
    //   const images = req.files.map(file=>file.filename)
    
    if(req.file){await banner.findByIdAndUpdate(id,{image:req.file.filename})}

      const bannerData = await banner.findByIdAndUpdate({_id:id},{$set:{
          title: req.body.name,  
        //   image : images,
        // image:req.file.filename,
        
          url : req.body.url ,
          description: req.body.description 
      }});
      const updatedBanner = await bannerData.save();
    //   if(updatedBanner){
          res.redirect('/admin/banners')
    //   }
    //   else{
    //       res.redirect('/admin/home')
    //   }
  } catch (error) {
      console.log(error.message);
  }
}

const deleteBanner = async(req,res)=>{
  try {
      const id = req.query.id;
       await banner.findByIdAndUpdate({_id:id},{$set:{is_delete:true}})
      res.redirect('/admin/banners')
  } catch (error) {
      console.log(error.message);
  }
}


//=======================coupon management=========================

const coupons=async(req,res)=>
{
    try{

const couponData= await coupon.find({is_delete:false}).sort({createdDate:-1})
res.render('couponManagement',{coupon:couponData})

    }
    catch(error){
        console.log(error);

    }
}

const loadaddCoupon = async(req,res)=>{
    try {
            const couponData =await coupon.find({})
            
               res.render('addCoupon',{coupon:couponData})
        }
      //   else{
      //       res.redirect('/admin')
      //   }
    catch (error) {
        console.log(error.message)
    }
  }
  

  const addCoupon = async(req,res)=>{
    try {
      
      
      
        const couponData = new coupon({
           
            couponCode : req.body.couponCode,
          discount:req.body.discount,
            minimumAmount:req.body.minimumAmount,
            maximumAmount:req.body.maximumAmount,
            expiryDate:req.body.expiryDate




        })
      
            await couponData.save()
            res.redirect('/admin/coupon')
      
        
        
    } catch (error) {
        console.log(error.message)
    }
  }


  const loadupdateCoupon = async(req,res)=>{
    try {
        const id = req.query.id;
        const couponData = await coupon.findById({_id:id})
        res.render('updateCoupon',{coupon:couponData})
        
    } catch (error) {
        console.log(error.message);
    }
  }

  const updateCoupon=async(req,res)=>{
    try {

        
        const couponData=await coupon.findByIdAndUpdate({_id: req.body.id},{$set:{
            
            
            couponCode : req.body.couponCode,
            discount:req.body.discount,
            minimumAmount:req.body.minimumAmount,
            maximumAmount:req.body.maximumAmount,
            expiryDate:req.body.expiryDate

        }})


        const updateCoupon=await couponData.save();
        console.log(updateCoupon);
        res.redirect('/admin/coupon')
    } catch (error) {

        console.log(error);
        
    }
  }

  
const deleteCoupon=async(req,res)=>{
try {

    const id = req.query.id;
       await coupon.findByIdAndUpdate({_id:id},{$set:{is_delete:true}})
      res.redirect('/admin/coupon')
    
} catch (error) {

    console.log(error.message);
    
}


}



//================================OrderManagement=====================================


const orderPage=async(req,res)=>{
    try {

        const orders=await order.find().populate('user','name').populate({path:'product',populate:'productId'}) 
        console.log(orders);
        const orderStatus = order.schema.path('orderStatus').enumValues
        res.render('orderManagement',{order:orders,orderStatus})
        
    } catch (error) {

        console.log(error);
        
    }
}


const viewOrderDetails=async(req,res)=>{

    try {

        const id=req.query.id
        console.log(id);
        const orders=await order.findById({_id:id}).populate('user').populate({path:'product',populate:'productId'})
       console.log('gh');
        console.log(orders);
        const orderStatus = order.schema.path('orderStatus').enumValues
        const paymentStatus=order.schema.path('paymentStatus').enumValues
        res.render('orderDetails',{order:orders,orderStatus:orderStatus,paymentStatus:paymentStatus})
        
    } catch (error) {

        console.log(error);
        
    }
}


//===============================================orderStatus ================================================

const orderStatusChange = async(req,res)=>{
    try {
        console.log(req.body);
        const orderStatus = req.body.orderStatus
        const paymentStatus = req.body.paymentStatus
        console.log(orderStatus);
        console.log(paymentStatus);
        const updatedOrder = await order.findByIdAndUpdate({_id:req.body.id},{$set:{
            orderStatus:orderStatus,
            paymentStatus:paymentStatus
        }})
        
        if(updatedOrder){
            console.log(updatedOrder);
            res.redirect('/admin/order')
        }
      
        
    } catch (error) {
         console.log(error.message); 
    }
}



module.exports={
    
    loadLogin,
    verifyLogin,
    CategoryPage,
    deleteCategory,
    loadCategory
    ,products,
    loadAddProduct,
    loadAddCategory,
    loadDashBoard,
    editCategoryLoad
    ,updateCategory,
    addProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    blockUser,
    UnblockUser,
    deleteUser,
    userManagement,
  loadBannerManagement,
  loadaddBanner,
  addBanner,
  loadupdateBanner,
  updateBanner,
   deleteBanner,
   coupons,
   loadaddCoupon,
addCoupon ,
updateCoupon,
loadupdateCoupon,
deleteCoupon,
orderPage,
viewOrderDetails,
orderStatusChange,
deleteImage,
salesReport,
loadSalesReport,
salesReportDownload}
// block,unblock,customers
//blockUser,UnblockUser,deleteUser,userManagement
    