import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"

export const patientRegister = catchAsyncErros(async (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !role
  ) {
    return next(new ErrorHandler("Please Fill all the details", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User Already registered", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    phone,
    email,
    password,
    gender,
    dob,
    nic,
    role,
  });

  generateToken(user, "User registerd successfully", 200, res);
});

export const login = catchAsyncErros(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please provide all details", 400));
  }

  if (password != confirmPassword) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid password or Email", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Password and confirmPassword does not match", 400)
    );
  }

  if (role != user.role) {
    return next(new ErrorHandler("User with this role not found", 400));
  }

  generateToken(user, "User Logged in successfully", 200, res);
});

export const addNewAdmin = catchAsyncErros(async (req, res, next) => {
  const { firstName, lastName, phone, email, password, gender, dob, nic } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic
  ) {
    return next(new ErrorHandler("Please Fill all the details", 400));
  }

  const isRegistered = await User.findOne({ email })

  if(isRegistered){
    return next(new ErrorHandler(`${isRegistered.role} With This Email Already Exists`))
  }

  const admin = await User.create({
    firstName,
    lastName,
    phone,
    email,
    password,
    gender,
    dob,
    nic,
    role : "Admin"
  });
  res.status(200).json({
    success : true,
    message : "New Admin Registered"
  })
});

export const getAllDoctors = catchAsyncErros(async(req, res, next) =>{
  const doctors = await User.find({role : "Doctor"});
  res.status(200).json({
    success: true,
    doctors
  })
});

export const getUserDetails = catchAsyncErros(async(req, res, next)=>{
  const user = req.user;
  res.status(200).json({
    success : true,
    user
  })
});

export const logoutAdmin = catchAsyncErros(async(req, res, next) =>{
  res.status(200).cookie("adminToken", "", {
    httpOnly : true,
    expires : new Date(Date.now()),
    secure: true,
    sameSite: "None"
  }).json({
    success: true,
    message : "User Log Out Successfully"
  })
});

export const logoutPatient = catchAsyncErros(async(req, res, next) =>{
  res.status(200).cookie("patientToken", "", {
    httpOnly : true,
    expires : new Date(Date.now()),
    secure: true,
    sameSite: "None"
  }).json({
    success: true,
    message : "User Log Out Successfully"
  })
});

export const addNewDoctor = catchAsyncErros(async(req, res, next) =>{
  if(!req.files || Object.keys(req.files).length === 0){
    return next(new ErrorHandler("Doctor Avatar is Required", 400));
  }

  const {docAvatar} = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if(!allowedFormats.includes(docAvatar.mimetype)){
    return next(new ErrorHandler("File Formats Not Supported", 400))
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if(
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ){
    return next(new ErrorHandler("Please fill all the details", 400))
  }

  const isRegistered = await User.findOne({email});

  if(isRegistered){
    return next(new ErrorHandler("Doctor with this Email already Exists!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );

    return next(new ErrorHandler("Failed to upload Doctor Avatar to cloudinary", 500));
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id : cloudinaryResponse.public_id,
      url : cloudinaryResponse.secure_url,
    },
  });
  
  res.status(200).json({
    success : "true",
    message : "New Doctor Registered",
    doctor
  })
});
