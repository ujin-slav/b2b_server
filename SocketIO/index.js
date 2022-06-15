const userSocketIdMap = new Map()
const ChatModel = require('../models/chat-model')
const UnreadModel = require('../models/unread-model')
const UnreadQuestModel = require('../models/unreadQuest-model')
const UnreadInvitedModel = require('../models/unreadInvited-model')
const UserModel =require('../models/user-model')
const ContactsModel =require('../models/contacts-model')
const SocketIOFile = require('socket.io-file');
const mailService =require('../service/mail-service')
const path = require('path');
const fs = require("fs");

const IOconnect = (socket,io) =>{
  console.log(`User Connected: ${socket.id} id ${socket.user.id}`);
  const userId = socket.user.id;
  userSocketIdMap.set(userId, socket.id);

  var uploader = new SocketIOFile(socket, {
        // uploadDir: {			// multiple directories
        // 	music: 'data/music',
        // 	document: 'data/document'
        // },
        uploadDir: './uploads',							// simple directory
        maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
        chunkSize: 10240,	
        transmissionDelay: 0,	
        overwrite: false,					// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
        rename: function(filename, fileInfo) {
          var file = path.parse(filename);
          var fname = Date.now();
          var ext = file.ext;
        return `${fname}${ext}`;
     } 							
    });

  const getUnread = async(id)=>{
    try {
      var unreadMessage = [];
      const from = await UnreadModel.find({
        To:id
      }).distinct("From")
      await Promise.all(from.map(async (item)=>{
          const count = await UnreadModel.find({
              To:id,
              From: item
            }).countDocuments()
            unreadMessage.push({ID:item,count})
      }))
      return unreadMessage;
    } catch (error) {
      console.log(error) 
    }
  }

  uploader.on('complete', async (fileInfo) => {
    try {
    console.log('Upload Complete.');
    const data = fileInfo.data
    const message = await ChatModel.create({
      To: await UserModel.findOne({_id:data.Recevier}),
      Author: await  UserModel.findOne({_id:data.Author}),
      Date: data.Date,
      File: fileInfo.name
      }) 
      const unread = await UnreadModel.create({
        Message: message,  
        To: await UserModel.findOne({_id:data.Recevier}),
        From: await UserModel.findOne({_id:data.Author})
      })
      if(userSocketIdMap.has(data.Recevier)) {
        io.sockets.sockets.get(userSocketIdMap.get(data.Recevier)).emit("new_message", data);
        io.sockets.sockets.get(userSocketIdMap.get(data.Recevier)).emit("unread_message",await getUnread(data.Recevier));
      }
      io.sockets.sockets.get(userSocketIdMap.get(data.Author)).emit("new_message", data);
    }catch (error) {
     console.log(error) 
    }
  });

  socket.on("unread_quest", async (data) => {
    const unreadQuest = await UnreadQuestModel.find({To:data.id}).countDocuments()
    if(userSocketIdMap.has(data.id)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.id)).emit("get_unread_quest",unreadQuest);
    }
  })
  socket.on("unread_quest_mail", async (data) => {
    const unreadQuest = await UnreadQuestModel.find({To:data.data.Destination}).countDocuments()
    const user = await UserModel.findOne({_id:data.data.Destination})
    const author = await UserModel.findOne({_id:data.data.Author})
    if(userSocketIdMap.has(data.data.Destination)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.data.Destination)).emit("get_unread_quest",unreadQuest);
    }else if(user.notiQuest){
      mailService.sendQuest(user.email,author,data.data.Text,data.data.Location)
    }
  })
  socket.on("unread_invited", async (data) => {
    await Promise.all(data.checkedEmail.map(async (item)=>{
        const user = await UserModel.findOne({email:item.Email})
        if(user){
          if(userSocketIdMap.has(user.id)) {
            const unreadInvited = await UnreadInvitedModel.find({To:user.id}).countDocuments()
            io.sockets.sockets.get(userSocketIdMap.get(user.id)).emit("get_unread_invited",unreadInvited);
          }
        }
    }))
  })
  socket.on("get_unread", async () => {
    io.sockets.sockets.get(socket.id).emit("unread_message",await getUnread(userId));
    const unreadQuest = await UnreadQuestModel.find({To:userId}).countDocuments()
    io.sockets.sockets.get(userSocketIdMap.get(userId)).emit("get_unread_quest",unreadQuest);
    const unreadInvited = await UnreadInvitedModel.find({To:userId}).countDocuments()
    io.sockets.sockets.get(userSocketIdMap.get(userId)).emit("get_unread_invited",unreadInvited);
  })
  socket.on("delete_message", async (data) => { 
    if("File" in data){
      if (fs.existsSync(__dirname+'\\..\\' + '\\uploads\\'+data.File)) {
        fs.unlink(__dirname+'\\..\\' + '\\uploads\\'+data.File, function(err){
          if (err) {
              console.log(err);
          } else {
              console.log("Файл удалён");
          }
      })
      }
    }
    await ChatModel.deleteOne({_id:data._id})
    if(userSocketIdMap.has(data.To)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.To)).emit("delete_message",{Author:data.To});
    }
    if(userSocketIdMap.has(data.Author)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.Author)).emit("delete_message",{Author:data.Author});
    }
  })

  socket.on("send_message", async (data) => {
    try {    
      const userRecevier = await UserModel.findOne({_id:data.Recevier})
      const message = await ChatModel.create({
      Text: data.Text,  
      To: await UserModel.findOne({_id:data.Recevier}),
      Author: await  UserModel.findOne({_id:data.Author}),
      Date: data.Date
      }) 
      const unread = await UnreadModel.create({
        Message: message,  
        To: await UserModel.findOne({_id:data.Recevier}),
        From: await UserModel.findOne({_id:data.Author})
      }) 
      if(userSocketIdMap.has(data.Recevier)) {
        io.sockets.sockets.get(userSocketIdMap.get(data.Recevier)).emit("new_message", data);
        io.sockets.sockets.get(userSocketIdMap.get(data.Recevier)).emit("unread_message",await getUnread(data.Recevier));
      }else if(userRecevier.notiMessage){
        mailService.sendMessage(userRecevier,data) 
      }
      let contactRecevier = await ContactsModel.findOne({owner:data.Recevier,contact:data.Author})
      if(contactRecevier===null){
        await ContactsModel.create({owner:data.Recevier,contact:data.Author})
      }else{
        await ContactsModel.deleteOne({owner:data.Recevier,contact:data.Author})
        await ContactsModel.create({owner:data.Recevier,contact:data.Author})
      }
      let contactAuthor = await ContactsModel.findOne({owner:data.Author,contact:data.Recevier})
      if(contactAuthor===null){
        await ContactsModel.create({owner:data.Author,contact:data.Recevier})
      }else{
        await ContactsModel.deleteOne({owner:data.Author,contact:data.Recevier})
        await ContactsModel.create({owner:data.Author,contact:data.Recevier})
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("get_message", async (data)=>{
      try {
          const messages = await ChatModel.paginate({
          "$or": [{
              To: await UserModel.findOne({_id:data.UserId}),
              Author: await UserModel.findOne({_id:data.RecevierId})
          }, {
              To: await UserModel.findOne({_id:data.RecevierId}),
              Author: await UserModel.findOne({_id:data.UserId})
          }]
          },{page:1,limit:data.limit,sort:{Date:-1}});
          await UnreadModel.deleteMany({
            To: await UserModel.findOne({_id:data.UserId}),
            From: await UserModel.findOne({_id:data.RecevierId})
          }) 
          io.sockets.sockets.get(socket.id).emit("receive_message", messages)
          console.log(data)
      } catch (error) {
        console.log(error)
      }
  })

  socket.on("disconnect", () => {
    userSocketIdMap.delete(userId);
    console.log("User Disconnected", socket.id);
    console.log(userSocketIdMap)
  });
};

function addClientToMap(userName, socketId){
  if (!userSocketIdMap.has(userName)) {
    userSocketIdMap.set(userName, new Set([socketId]));
  } else{
    userSocketIdMap.get(userName).add(socketId);
  }
  }
  function removeClientFromMap(userName, socketID){
    if (userSocketIdMap.has(userName)) {
      let userSocketIdSet = userSocketIdMap.get(userName);
      userSocketIdSet.delete(socketID);
    if (userSocketIdSet.size ==0 ) {
      userSocketIdMap.delete(userName);
    }
   }
  }

module.exports = IOconnect;