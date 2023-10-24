const {MongoClient} = require("mongodb");
//1.몽고디비 연결 주소 
const uri = "mongodb+srv://ljm5436124:wjdals7692!@cluster0.guruc7r.mongodb.net"

module.exports = function (callback){   //2.몽고디비 커넥션 연결 함수 반환
    return MongoClient.connect(uri, callback);
};