import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        minLength : [3, "Name should be at least three character"]
    },
    lastName: {
        type : String,
        required : true,
        minLength : [3, "Name should be at least three character"]
    },
    email: {
        type : String,
        required : true,
        validate : [validator.isEmail, "Please provide valid email"]

    },
    phone: {
        type : String,
        required : true,
        minLength : [10, "Phone number must contain at least 10 digit"],
        maxLength : [10, "Phone number must contain at least 10 digit"]
        
    },
    message: {
        type : "String",
        required : true,
        minLength : [10, "Message must contain at least 10 character"],

    }
});

export const Message = mongoose.model("Message", messageSchema);