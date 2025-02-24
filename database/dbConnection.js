import mongoose from "mongoose";
// mongoose is used to connect the database mongodb

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName : "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM_DEPLOYED"
    }).then(() => {
        console.log("connected successfully to database");
    }).catch((err) =>{
        console.log(`some error occured ${err}`)
    })
}

