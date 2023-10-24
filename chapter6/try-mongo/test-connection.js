
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ljm5436124:wjdals7692!@cluster0.guruc7r.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() { //1.async가 있으므로 비동기 처리 함수
  await client.connect();
  const adminDB = client.db('test').admin(); //2. adminDB 인스턴스
  const listDatabases = await adminDB.listDatabases();  //3.데이터 베이스 정보 가져오기
  console.log(listDatabases);
  return "OK";
}

run() //4.실행함수
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

