const http = require("http"); //1.http 객체 생성
let count = 0;

const server = http.createServer((req,res) => { //2.서버 객체 생성
    log(count);                                 //3.카운트 1 증가               
    res.stausCode = 200;                        //4.결괏값 200
    res.setHeader("Content-Type","text/plain"); //5.헤더 설정
    res.write("hello\n");                       //6.응답값 설정
    setTimeout(()=>{
        res.end("Node.js");                     //7.2초 후 Node.js 출력
    },2000);
});

function log(count){
    console.log((count += 1));
}

server.listen(8000);                            //8000번 포트로 서버 실행.

