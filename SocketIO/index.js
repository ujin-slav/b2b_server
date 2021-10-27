const IOconnect = (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    // socket.on("send_message", (data) => {
    //   socket.to(data.room).emit("receive_message", data);
    // });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  };
  
module.exports = IOconnect;