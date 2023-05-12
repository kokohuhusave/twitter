import {getUsers} from '../db/database.js';
import MongoDb from 'mongodb';
const ObjectID = MongoDb.ObjectId;



export async function searchID(username) {
    return getUsers().find({username})
    .next()
    .then(mapOptionalUser)
}
//User.findOne({ where: {username}}); //username필드안에 username을 찾는다

export async function findById(id) {
    return getUsers()
    .find({ _id: new ObjectID(id)})
    .next()
    .then(mapOptionalUser);
}

function mapOptionalUser(user){
    return user ? { ...user, id: user._id.toString() } : user;
}

// return null //User.findByPk(id); //User필드안에 PK를 찾는다
export async function createUser(user) {
    return getUsers().insertOne(user)
    .then((result) => {
        console.log(result);
        //result.ops[0]._id.toString()
    });
    //return null//User.create(user).then((data) => data.dataValues.id);
}
//함수 내부에서는 User.create(user)를 호출하여 데이터베이스에 새로운 유저를 생성합니다. 이때 User는 Sequelize에서 정의한 모델 객체이며, user는 생성할 유저의 정보가 담긴 객체입니다.

// export async function login(user) {
//     return User.find((users) => users.username === user.username && users.password === user.password);
// }