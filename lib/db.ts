import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async()=>{
    const connectionSate = mongoose.connection.readyState;
    if (connectionSate===1) {
        return ;
    }
    if (connectionSate===2) {
        return ;
    }
    try{
        mongoose.connect(MONGODB_URI!,{dbName:"demoapp",bufferCommands: false})
    }catch(error){
        console.log("Error in connecting to Database",error);
        throw new Error("Error in connecting to Database");

    };

}

export default connect;