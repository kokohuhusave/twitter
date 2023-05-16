
import {config} from "../config.js";
import Mongoose from 'mongoose';

let db;

export async function connectDB(){
    return Mongoose.connect(config.db.host);
}

export function useVirtualId(Schema){
    Schema.virtual('id').get(function(){
        return this._id.toString();
    });
    Schema.set('toJSON', {virtual:true});
    Schema.set('toObject', {virtual:true});
}

export function getUsers(){
    return db.collection('users');
}

export function getTweets(){
    return db.collection('tweets');
}

