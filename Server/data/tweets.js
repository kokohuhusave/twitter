
import MongoDb from 'mongodb';
import {getTweets} from '../db/database.js';
import * as userRepository from './auth.js';

const ObjectID = MongoDb.ObjectId;



export async function getAllByUsername(username) {
    return getTweets()
    .find({ username })
    .sort({ createdAt: -1})
    .toArray()
    .then(mapTweets);
}


export async function getAll(){
    return getTweets()
    .find()
    .sort({createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
    return getTweets()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalTweet);
}



export async function update(id, text){
    return getTweets().findOneAndUpdate(
        { _id: new ObjectID(id)},
        { $set: { text } },
        { returnOriginal: false}
    )
    .then((result) => result.value)
    .then(mapOptionalTweet)
}

export async function deleteTweet(id) {
    return getTweets().deleteOne({_id: new ObjectID(id)});
}

export async function create(text, userId){
    return userRepository.findById(userId)
    .then((user) => getTweets().insertOne({
        text,
        createdAt: new Date(),
        userId,
        name: user.name,
        username: user.username,
        url: user.url
    })).then((result) => console.log(result)).then(mapOptionalTweet);
}

function mapOptionalTweet(tweet){
    return tweet ? {...tweet, id: tweet._id.toString()} : tweet;
}

function mapTweets(tweets){
    return tweets.map(mapOptionalTweet);
}

