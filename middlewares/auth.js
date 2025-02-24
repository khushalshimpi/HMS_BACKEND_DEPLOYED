import { User } from "../models/userSchema.js"
import {catchAsyncErros} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import jwt from "jsonwebtoken"

export const isAdminAuthenticated = catchAsyncErros(async(req, res, next) =>{
   const token = req.cookies.adminToken;

   if(!token){
    return next(new ErrorHandler("Admin not Authenticated", 400))
   }
   const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
   req.user = await User.findById(decode.id);

   if(req.user.role !== "Admin"){
    return next(new ErrorHandler(`${req.user.role} is not authorized by resource`, 403))
   }
   next()
});

export const isPatientAuthenticated = catchAsyncErros(async(req, res, next) =>{
   const token = req.cookies.patientToken;

   if(!token){
    return next(new ErrorHandler("Patient not Authenticated", 400))
   }
   const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
   req.user = await User.findById(decode.id);

   if(req.user.role !== "Patient"){
    return next(new ErrorHandler(`${req.user.role} is not authorized by resource`, 403))
   }
   next()
});