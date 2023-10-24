const http = require("http");
const url = require("url");

http
    .createServer((req,res) => {

        const path = url.parse(req.url,true).pathname;
        res.setHeader("Content-Type","text/html");

        if(path in urlMap){
            console.log(path)
            urlMap[path](req,res);
        }else {
            notFound(req,res);
        }
    })
    .listen("3000", () => console.log("라우터를 리팩토링해보자!!"))

const user = (req,res) => {
    //res.end(`[user] name : andy, age : 30`);
    //동적으로 응답하도록 변경
    const userInfo = url.parse(req.url, true).query;
    //쿼리 스트링 데이터를 userInfo에 전달
    res.end(`[user] name : ${userInfo.name}, age: ${userInfo.age}`);
    //결괏값으로 이름과 나이 설정
};

const feed = (req,res) => {
    res.end(`<ul>
    <li>picture1</li>
    <li>picture2</li>
    <li>picture3</li>
    <li>picture4</li>
    </ul>
    `);
};

const notFound = (req,res) => {
    res.statusCode = 404;
    res.end("404 page not fount");
};

const urlMap ={
    "/" : (req,res) => res.end("Home"),
    "/user" : user,
    "/feed" : feed,
};
