import * as userRepository from "../data/auth.js"
// import {db} from '../db/database.js';
import SQ, { Sequelize } from 'sequelize';
import { sequelize } from '../db/database.js';
import {User} from './auth.js';


const DataTypes = SQ.DataTypes;

const Tweet = sequelize.define(
    'tweet',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
        }
    }
);

Tweet.belongsTo(User);

const INCLUDE_USER = {
    attribute: [
        'id',
        'text',
        'createdAt',
        'userid',
        [Sequelize.col('user.name'),'name'],
        [Sequelize.col('user.username'),'username'],
        [Sequelize.col('user.url'),'url']
    ],
    include:{
        model: User,
        attribute: []
    }
}

//user에 대한 정보가 다 모여서 해당 값에 정보를 빼네서
//name,username,url이라고 넣음

const ORDER_DESC = {
        order: [['createdAt','DESC']]
}



export async function getAllByUsername(username) {
    return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC,
    include: {
        ...INCLUDE_USER.include,
        where: {username}
    }});
}

export async function getAll(){
    return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC});
}

export async function getById(id) {
    return Tweet.findOne({
        where: {id}, 
        ...INCLUDE_USER
    });
}

export async function update(id, text){
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
        tweet.text = text;
        return tweet.save();
    });
}

export async function deleteTweet(id) {
    return Tweet.findByPk(id).then((tweet) => {
        tweet.destroy();
    });
}
//
export async function create(text, userId){
    return Tweet.create({text, userId}).then((data) => {
        console.log(data);
        return data;
    });
}

