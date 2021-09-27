import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[A-Z0-9._%-]+@[A-Z0-8.-]+\.[A-Z]{2,4}$/i
    },
    password:{
        type:String,
        required:true,
        minlength:10,
        match:/(?=.*[a-zA-Z]+)(?=.*[0-9]+)(?=.*[!#$%&*]+).*/
    }
})


export const userModel = model('user', userSchema)