const userSocketIdMap = new Map()
const ChatModel = require('../models/chat-model')
const UnreadModel = require('../models/unread-model')
const UserModel =require('../models/user-model')
const SocketIOFile = require('socket.io-file');
const path = require('path');
const fs = require("fs");

const IOconnect = (socket,io) =>{
  console.log(`User Connected: ${socket.id} id ${socket.handshake.query.userId}`);
  const userId = socket.handshake.query.userId;
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

  const getUnread = async()=>{
      var unreadMessage = [];
      const from = await UnreadModel.find({
        To:socket.handshake.query.userId
      }).distinct("From")
      await Promise.all(from.map(async (item)=>{
          const count = await UnreadModel.find({
              To:socket.handshake.query.userId,
              From: item
            }).countDocuments()
            unreadMessage.push({ID:item,count})
      }))
      return unreadMessage;
  }

  uploader.on('complete', async (fileInfo) => {
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
        io.sockets.sockets.get(userSocketIdMap.get(data.Recevier)).emit("unread_message",await getUnread());
      }
      io.sockets.sockets.get(userSocketIdMap.get(data.Author)).emit("new_file_message", fileInfo.name);
  });

  socket.on("unread_quest", async (data) => {
    console.log(data)
    if(userSocketIdMap.has(data.id)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.id)).emit("get_unread_quest");
    }
  })
  socket.on("get_unread", async () => {
    io.sockets.sockets.get(socket.id).emit("unread_message",await getUnread());
  })
  socket.on("delete_message", async (data) => {
    await ChatModel.deleteOne({_id:data._id})
    if(userSocketIdMap.has(data.To)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.To)).emit("delete_message",{Author:data.iD});
    }
    if(userSocketIdMap.has(data.Author)) {
      io.sockets.sockets.get(userSocketIdMap.get(data.Author)).emit("delete_message",{Author:data.iD});
    }
  })

  socket.on("send_message", async (data) => {
    try {    
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
        io.sockets.sockets.get(userSocketIdMap.get(data.Recevier)).emit("unread_message",await getUnread());
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("get_message", async (data)=>{
      try {
          const messages = await ChatModel.find({
          "$or": [{
              To: await UserModel.findOne({_id:data.UserId}),
              Author: await UserModel.findOne({_id:data.RecevierId})
          }, {
              To: await UserModel.findOne({_id:data.RecevierId}),
              Author: await UserModel.findOne({_id:data.UserId})
          }]
          });
          await UnreadModel.deleteMany({
            To: await UserModel.findOne({_id:data.UserId}),
            From: await UserModel.findOne({_id:data.RecevierId})
          }) 
          io.sockets.sockets.get(socket.id).emit("receive_message", messages);
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