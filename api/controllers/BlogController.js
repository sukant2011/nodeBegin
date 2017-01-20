/*
* Author : Vishesh Tanwar
* Module : BlogController
*
*/
const AppMessages = require(APP_PATH + '/config/Message.js');
const AppConstants = require(APP_PATH + '/config/Constant.js');
const BlogModel = require(APP_PATH + '/api/models/BlogModel.js');

class BlogController  {

     admin_add (req, res) {
          const CommonService = require(APP_PATH + '/api/services/CommonService.js');
          const fs = require('fs');
          const gm = require('gm');
          const imageMagick = gm.subClass({ imageMagick: true });
          const formidable = require('formidable');
          const form = new formidable.IncomingForm();
          let RecordLocator = "";
          form.parse(req, function(err, fields, files){
               //console.log(files); return;
               let obj = {};
               obj.userId = fields.userId;
               obj.title = fields.title;
               obj.description = fields.description;
               //console.log(obj); return;

               if(files.file && files.file.name){
                    let uploadDir = 'public' + '/media/admin/';
                    fs.access(uploadDir, fs.F_OK, function(err) {
                         if (!err) {
                              let fileName = files.file.name;
                              let fileStrArr = fileName.split('.');
                              let ext = fileStrArr[fileStrArr.length - 1];
                              let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                              fs.rename(files.file.path, uploadDir + "/" + newFileName, function(err) {
                                   if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                   let path = '/media/admin/';
                                   obj.image = {path : path, photo : newFileName,  photoOriginal : fileName};
                                   BlogModel(obj).save(function(err,resData){
                                        if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg :"Blog Has been saved", result: resData});
                                   });
                              });
                         } else {
                              fs.mkdirSync(uploadDir);
                         }
                    });
               }
               else {
                    if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                    return res.json({resStatus:'error', msg :'Featured Image is required'});
               }
          });
     }

     admin_update (req, res) {
          const CommonService = require(APP_PATH + '/api/services/CommonService.js');
          const fs = require('fs');
          const gm = require('gm');
          const imageMagick = gm.subClass({ imageMagick: true });
          const formidable = require('formidable');
          const form = new formidable.IncomingForm();
          let RecordLocator = "";
          form.parse(req, function(err, fields, files){
               let obj = {};
               let blogId = fields.blogId;
               obj.title = fields.title;
               obj.userId = fields.userId;

               obj.description = fields.description;
               //console.log(obj); return;
               if(files.file && files.file.name){
                    let uploadDir = 'public' + '/media/admin/';
                    fs.access(uploadDir, fs.F_OK, function(err) {
                         if (!err) {
                              let fileName = files.file.name;
                              let fileStrArr = fileName.split('.');
                              let ext = fileStrArr[fileStrArr.length - 1];
                              let newFileName = CommonService.generateRandom(8)+(new Date()).getTime() + CommonService.generateRandom(6) + '.' + ext;
                              fs.rename(files.file.path, uploadDir + "/" + newFileName, function(err) {
                                   if(err) return res.json({resStatus:'error', msg :AppMessages.SERVER_ERR});
                                   let path = '/media/admin/';
                                   obj.image = {path : path, photo : newFileName,  photoOriginal : fileName};
                                   BlogModel.findOneAndUpdate({"_id" : blogId}, obj, {upsert:false, new:true},function (err, resData) {
                                        if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                                        return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
                                   });
                              });
                         } else {
                              fs.mkdirSync(uploadDir);
                         }
                    });
               } else {
                    BlogModel.findOneAndUpdate({"_id" : blogId}, obj, {upsert:false, new:true},function (err, resData) {
                         if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
                         return res.json({resStatus:'success', msg :'Update Successfll',result: resData});
                    });
               }
          });
     }

     admin_view (req, res) {
          BlogModel.findOne({_id:req.query.blogId}, function ( err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :"Blog View", result : resData});
          });
     }

     admin_list (req, res) {
          BlogModel.find({isDeleted : false},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Blog List', result : resData});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }

     admin_remove (req, res) {
          BlogModel.findOneAndUpdate({_id:req.query.blogId},{'isDeleted':true}, {new:true},function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Blog has been removed Successfully'});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }

     getBlogs (req, res) {
          BlogModel.find({isDeleted : false}).populate({path : 'userId', select : 'name profile'}).exec(function(err, resData){
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               if (resData) {
                    return res.json({resStatus:'success', msg :'Blog List', result : resData});
               } else {
                    return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               }
          });
     }
     view (req, res) {
          BlogModel.findOne({_id:req.query.blogId}).populate({path : 'userId',select : 'name profile'}).exec(function ( err, resData) {
               if (err) return res.json({resStatus:'error', msg : AppMessages.SERVER_ERR});
               return res.json({resStatus:'success', msg :"Blog View", result : resData});
          });
     }



}



module.exports = new BlogController();
