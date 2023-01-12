const userSocketIdMap = new Map()
const ChatModel = require('../models/chat-model')
const UnreadModel = require('../models/unread-model')
const UnreadQuestModel = require('../models/unreadQuest-model')
const UnreadInvitedModel = require('../models/unreadInvited-model')
const UnreadInvitedPriceModel = require('../models/unreadInvitedPrice-model')
const UnreadSpecAskModel = require('../models/unreadSpecAsk-model')
const UnreadStatusAskModel = require('../models/unreadStatusAsk-model')
const UserModel =require('../models/user-model')
const ContactsModel =require('../models/contacts-model')
const LastVisitModel =require('../models/lastVisit-model')
const SocketIOFile = require('socket.io-file');
const mailService = require('../service/mail-service')
const path = require('path');
const fs = require("fs");

const IOconnectNotAuth = (socket,io)=>{
  socket.on("unread_invitedPrice", async (data) => {
    console.log("NotAuth invitedPrice" + data)
    const unreadInvitedPrice = await UnreadInvitedPriceModel.find({To:data.To}).countDocuments()
    if(userSocketIdMap.has(data.To)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.To)).emit("get_unread_invitedPrice",unreadInvitedPrice);
    }
  })
  socket.on("unread_specOfferAsk", async (data) => {
    const UnreadSpecAsk = await UnreadSpecAskModel.find({To:data.To}).countDocuments()
    if(userSocketIdMap.has(data.To)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.To)).emit("get_unread_specOfferAsk",UnreadSpecAsk);
    }
  })
}

const IOconnect = async (socket,io) =>{
  if(socket.notAuth){
    return IOconnectNotAuth(socket,io)
  }
  console.log(`User Connected: ${socket.id} id ${socket.user.id}`);
  const userId = socket.user.id;
  userSocketIdMap.set(userId, socket.id);

  const contacts = await ContactsModel.find({contact:userId}).populate({path:'owner', select:'id'})
  contacts.map((item)=>{
    if(userSocketIdMap.has(item.owner.id)){
      io.sockets.sockets.get(userSocketIdMap.get(item.owner.id)).emit("user_connected", userId)
    }
  })

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
    await Promise.all(data.map(async (item)=>{
        const user = await UserModel.findOne({_id:item.idContr})
        if(user){
          if(userSocketIdMap.has(user.id)) {
            const unreadInvited = await UnreadInvitedModel.find({To:user.id}).countDocuments()
            io.sockets.sockets.get(userSocketIdMap.get(user.id)).emit("get_unread_invited",unreadInvited);
          }
        }
    }))
  })
  socket.on("unread_invitedPrice", async (data) => {
    console.log("unread_invitedPrice")
    console.log(data)
    const unreadInvitedPrice = await UnreadInvitedPriceModel.find({To:data.To}).countDocuments()
    if(userSocketIdMap.has(data.To)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.To)).emit("get_unread_invitedPrice",unreadInvitedPrice);
    }
  })
  socket.on("unread_changeStatus", async (data) => {
    const UnreadStatusAsk = await UnreadStatusAskModel.find({To:data.To}).countDocuments()
    if(userSocketIdMap.has(data.To)) {
      console.log(UnreadStatusAsk)
      io.sockets.sockets.get(userSocketIdMap.get(data.To)).emit("get_unread_statusAsk",UnreadStatusAsk);
    }
  })
  socket.on("get_unread_message", async () => {
    io.sockets.sockets.get(socket.id).emit("unread_message",await getUnread(userId));
  })
  const getRestUnread = async () => {
    io.sockets.sockets.get(socket.id).emit("unread_message",await getUnread(userId));
    
    const unreadQuest = await UnreadQuestModel.find({To:userId}).countDocuments()
    const unreadInvited = await UnreadInvitedModel.find({To:userId}).countDocuments()
    const unreadInvitedPrice = await UnreadInvitedPriceModel.find({To:userId}).countDocuments()
    const UnreadSpecAsk = await UnreadSpecAskModel.find({To:userId}).countDocuments()
    const UnreadStatusAsk = await UnreadStatusAskModel.find({To:userId}).countDocuments()

    const result = {
      unreadQuest,
      unreadInvited,
      unreadInvitedPrice,
      UnreadSpecAsk,
      UnreadStatusAsk,
    }

    io.sockets.sockets.get(userSocketIdMap.get(userId)).emit("unread_rest",result);
  }
  getRestUnread()
  socket.on("get_unread", async () => {
    console.log("unread")
    getRestUnread()
  })
  socket.on("delete_message", async (data) => { 
    if("File" in data){
      if (fs.existsSync(__dirname+'\\..\\' + '\\uploads\\'+data.File.filename)) {
        fs.unlink(__dirname+'\\..\\' + '\\uploads\\'+data.File.filename, function(err){
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
      To: data.Recevier,
      Author: data.Author,
      Date: data.Date
      }) 
      const unread = await UnreadModel.create({
        Message: message,  
        To: data.Recevier,
        From: data.Author
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

  socket.on('uploadcomplete', async (data) => {
    try {
      console.log(data)
    const message = await ChatModel.create({
      To: await UserModel.findOne({_id:data.Recevier}),
      Author: await  UserModel.findOne({_id:data.Author}),
      Date: data.Date,
      Text:"",
      File: data.File
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

  socket.on("get_message", async (data)=>{
      const searchText = data.SearchText || ""
      const regex = searchText.replace(/\s{20000,}/g, '*.*')
      try {
          const messages = await ChatModel.paginate({
          "$or": [{
              To: await UserModel.findOne({_id:data.UserId}),
              Author: await UserModel.findOne({_id:data.RecevierId}),
              Text: {$regex: regex,$options: 'i'}
          }, {
              To: await UserModel.findOne({_id:data.RecevierId}),
              Author: await UserModel.findOne({_id:data.UserId}),
              Text: {$regex: regex,$options: 'i'}
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

  socket.on("disconnect",async () => {
    userSocketIdMap.delete(userId);
    console.log("User Disconnected", socket.id);
    console.log(userSocketIdMap)

    const contacts = await ContactsModel.find({contact:userId}).populate({path:'owner', select:'id'})
    contacts.map((item)=>{
      if(userSocketIdMap.has(item.owner.id)){
        io.sockets.sockets.get(userSocketIdMap.get(item.owner.id)).emit("user_disconnected", userId)
      }
    })
    const lastVisit = await LastVisitModel.findOne({User:userId})
    if(lastVisit===null){
        await LastVisitModel.create({User:userId,Date: new Date()})
    }else{
        await LastVisitModel.updateOne({User:userId},{$set:{Date: new Date()}})
    }
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
module.exports.userSocketIdMap = userSocketIdMap