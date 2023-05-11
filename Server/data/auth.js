// import {db} from '../db/database.js';
import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNULL: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(45),
            allowNULL: false
        },
        password:{
            type: DataTypes.STRING(128),
            allowNULL: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNULL: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNULL: false
        },
        url: DataTypes.TEXT,
        regdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    
    { timestamps: false } //(created_at)과 수정일(updated_at)을 자동으로 생성
)

export async function searchID(username) {
    return User.findOne({ where: {username}}); //username필드안에 username을 찾는다
}

export async function findById(id) {
    return User.findByPk(id); //User필드안에 PK를 찾는다
}

export async function createUser(user) {
    return User.create(user).then((data) => data.dataValues.id);
}
//함수 내부에서는 User.create(user)를 호출하여 데이터베이스에 새로운 유저를 생성합니다. 이때 User는 Sequelize에서 정의한 모델 객체이며, user는 생성할 유저의 정보가 담긴 객체입니다.

// export async function login(user) {
//     return User.find((users) => users.username === user.username && users.password === user.password);
// }