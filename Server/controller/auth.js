import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../data/auth.js";
import {config} from "../config.js";

export async function signup(req, res) {
    const {username, password, name, email, url }  = req.body;
    const found = await userRepository.searchID(username);
    if (found) {
        return res.status(409).json({ message: `${username}은 이미 가입되었습니다`})
    }
    const hashed = await(bcrypt.hash(password, config.bcrypt.saltRound));
    const userId = await(userRepository.createUser({
        username,
        password: hashed,
        name,
        email,
        url
    }));
    
    const token = createJwtToken(userId);
    res.status(201).json({token, username});
    // req.body 데이터를 받아 회원가입 시키는 함수
    // const result = await(userRepository.searchID(data.username));
    // if (result) {
    //     // 해당 아이디가 존재한다면 409를 리턴
    //     return res.status(409);
    // }
    // const hashedPW = bcrypt.hashSync(data.password, 10);
    // data.password = hashedPW;
    // userRepository에 데이터를 저장(비밀번호는 bcrypt를 사용하여 저장)
    // JWT를 이용하여 사용자에게 json으로 전달
}

export async function login(req, res) {
    const {username, password} = req.body;
    const user = await(userRepository.searchID(username));
    if (!user) {
        return res.status(401).json({message: "요청한 아이디가 존재하지 않습니다"})
    }

    const isValidpassword = await(bcrypt.compare(password, user.password));
    if(!isValidpassword){
        return res.status(401).json({message: "아이디 또는 비밀번호를 확인하세요"})
    }
    const token = createJwtToken(user.id);
    res.status(200).json({token, username})


    // req.body 데이터를 받아 해당 아이디로 로그인 여부를 판단
    // const data  = req.body;
    // 해당 아이디가 존재하지 않으면 "401"을 리턴
    // const result = await(userRepository.searchID(data.username));
    // if (!result) {
    //     return res.status(401);
    // }
    // const hashedPW = bcrypt.hashSync(data.password, 10);
    // data.password = hashedPW;
    // const login = userRepository.login(data);

    // if (login) {
    //     res.status(200).json(data);
    // }
    // return res.status(401);

    // bcrypt를 이용하여 비밀번호까지 모두 맞다면 해당 정보를 JWT를 이용하여 사용자에게 json으로 전달
}

export async function me(req, res, next) {
    const user = await(userRepository.findById(req.userId));
    if(!user){
        return res.status(404).json({message: "사용자가 존재하지 않습니다."})
    }
    res.status(200).json({token:req.token, username: user.username})
}

function createJwtToken(id) {
    return jwt.sign({id}, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec});
}