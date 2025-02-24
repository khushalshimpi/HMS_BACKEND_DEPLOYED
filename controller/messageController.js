import {catchAsyncErros} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {Message} from "../models/messageSchema.js"


export const sendMessage = catchAsyncErros(async(req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please Fill all the details", 400))
    }
    await Message.create({firstName, lastName, email, phone, message});
    res.status(200).json({
        success : "true",
        message : "Message send successfully"
    });
});

export const getAllMessages = catchAsyncErros(async(req, res, next) =>{
    const message = await Message.find();
    res.status(200).json({
        success : "true",
        message
    })
});