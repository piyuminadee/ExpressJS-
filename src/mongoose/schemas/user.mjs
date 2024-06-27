import mongoose from "mongoose";
import passport from "passport";

const UserSchema = new mongoose.Schema({
    name : {
       type : mongoose.Schema.Types.String,
       required : true,
       unique : true,
    },
    displayNAme : mongoose.Schema.Types.String,
    
    password : {
        type : mongoose.Schema.Types.String,
        required : true,
    },
});

export const User = mongoose.model("User", UserSchema);