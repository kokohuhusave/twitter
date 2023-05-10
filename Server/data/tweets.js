import * as userRepository from "../data/auth.js"
import {db} from '../db/database.js';

const SELECT_JOIN = 'select tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.email, us.url from tweets as tw left outer join users as us on tw.userId = us.id';

const ORDER_DESC = 'order by tw.createdAt desc'

export async function getAllByUsername(username) {
    return db.execute(`${SELECT_JOIN} WHERE us.username=? ${ORDER_DESC}`,[username])
    .then((result) => result[0]);
}

export async function getAll(){
    return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`)
    .then((result) => result[0]);
}

export async function getById(id) {
    return db.execute(`${SELECT_JOIN} WHERE tw.id=? `,[id])
    .then((result) => result[0][0]);
}

export async function update(id, text){
    return db.execute('update tweets SET text=? where id=?', [text,id])
    .then(() => getById(id));
}

export async function deleteTweet(id) {
    return db.execute('delete from tweets where id=?', [id])
}
//
export async function create(text, userId){
    return db.execute('insert into tweets (text, createdAt, userId) values (?, ?, ?)', [text, new Date(), userId])
    .then((result) => console.log(result));
}

