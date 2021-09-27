import { Schema, model } from 'mongoose';

const loginTrackerSchema = new Schema({
    key:{
        type:String,
        required:true
    },
    failed_attempts:{
        type:Number, 
        default:0
    },
    timeout:{
        type:Date,
        default: new Date(),
    },
    in_progress:{
        type:Boolean,
        default:false
    }
})

loginTrackerSchema.static('canLogin', async function(key){
    const login = await this.findOne({key:key});

    if (!login || login.failed_attempts < 2){
        return true;
    }

    const timeout_difference = new Date().getTime() - new Date(login.timeout).getTime();

    //1min === 60000millseconds
    if (timeout_difference >= (60000 * 2)){
        await login.remove()
        return true;
    }
    return false;
})

loginTrackerSchema.static('loginSuccess', async function(key){
    const login = await this.findOne({key:key});
    if (login){
        return await login.remove();
    }
})

loginTrackerSchema.static('loginFail', async function(key){
    return await this.findOneAndUpdate({key:key}, { $inc:{failed_attempts:1}, timeout: new Date(), in_progress:false}, { new:true, upsert:true })
})

loginTrackerSchema.static('loginInProgress', async function(key){
    const login = await this.findOne({key:key});
    await this.findOneAndUpdate({key:key}, {$set:{in_progress:true}}, {new:true, upsert:true})
    return login && login.in_progress
})

export const loginTrackerModel = model('logintracker', loginTrackerSchema)