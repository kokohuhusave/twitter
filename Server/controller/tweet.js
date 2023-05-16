import * as tweetRepository from '../data/tweets.js';
import { getSocketIO } from '../connection/socket.js';

export async function getTweets(req, res) {
    const username = req.query.username;
    const data = await (username
        ? tweetRepository.getAllByUsername(username)
        : tweetRepository.getAll());
    res.status(200).json(data);
};

export async function getTweetById(req, res) {
    const id = req.params.id;
    const tweet = await(tweetRepository.getById(id));
    if(tweet){
        res.status(200).json(tweet);
    }
    else{
        res.status(404).json({message: `Tweet id(${id}) not found`});
    }
};

export async function addTweet(req, res) {
    const { text } = req.body;
    const tweet = await(tweetRepository.addTweet(text, req.userId));

    res.status(201).json(tweet);
};

export async function createTweet(req, res, next){
    const {text } = req.body;
    // console.log(userId);
    // console.log(text);
    const tweet = await tweetRepository.create(text, req.userId);
    res.status(201).json(tweet);
    getSocketIO().emit('tweets',tweet);
}

export async function updateTweet(req, res) {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.getById(id);

    if(!tweet){
        res.status(404).json({message: `Tweet id(${id}) not found`});
    }

    if(tweet.userId !== req.userId){
        return res.sendStatus(403);
    }
    
    const updated = await tweetRepository.update(id,text);
    res.status(200).json(updated);
};

export async function deleteTweet(req, res) {
    const id = req.params.id;
    const tweet = await(tweetRepository.getById(id));
    if (!tweet) {
        return res.status(404).json({message: `Tweet id(${id}) not found`});
    }

    if(tweet.userId !== req.userId){
        return res.sendStatus(403);
    }

    await(tweetRepository.deleteTweet(id));

    res.send(204);

};