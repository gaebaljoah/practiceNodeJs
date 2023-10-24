const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://ljm5436124:wjdals7692!@cluster0.guruc7r.mongodb.net/?retryWrites=true&w=majority";

//1.mongoDB client 생성
const client = new MongoClient(uri,{useNewUrlParser:true});

async function main(){
    try{
        //2.커넥션을 생성하고 연결 시도
        await client.connect();

        console.log('MongoDB 접속 성공');

        //3.test 데이터베이스의 person 컬렉션 가져오기
        const collection = client.db('test').collection('person');

        //4.문서 하나 추가
        await collection.insertOne({name:'Andy', age:30});
        console.log('문서 추가 완료');

        //5.문서 찾기
        const documents = await collection.find({name:'Andy'}).toArray();
        console.log('찾은 문서:',documents);

        //6.문서 갱신하기
        await collection.updateOne({name: 'Andy'}, {$set:{age:31}});
        console.log("문서 업데이트");

        //7.갱신된 문서 확인하기
        const updatedDocuments = await collection.find({name:'Andy'}).toArray();
        console.log('갱신된 문서:',updatedDocuments);

        //8.문서 삭제하기
        // await collection.deleteOne({name:'Andy'});
        // console.log('문서 삭제');
        
        //연결끊기
        await client.close();
    } catch(err){
        console.error(err);
    }
}

main();

