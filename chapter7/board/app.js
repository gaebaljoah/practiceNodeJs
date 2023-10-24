const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const postService = require("./services/post-service"); // 서비스 파일 로딩
const {ObjectId} = require("mongodb");

//req.body와 post요청을 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
//몽고디비 연결 함수
const mongodbConnection = require("./configs/mongodb-connection");

app.engine(
    "handlebars", 
    handlebars.create({
        helpers : require("./configs/handlebars-helpers"),
    }).engine,
);  //1.핸들바 생성 및 엔진 반환

app.set("view engine", "handlebars");           //2. 웹페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname + "/views");         //3. 뷰 디렉터리를 views로 설정

console.log("dirname이란..?",__dirname); //C:\node\chapter7\board

//4. 라우터 설정

//4-1 글목록
app.get("/", async(req,res) => {
    const page = parseInt(req.query.page) || 1;  //현재 페이지 데이터
    console.log("page...?",page);
    const search = req.query.search || "";
    console.log("searchValue...?",search);
    try {
        const [posts,paginator] = await postService.list(collection, page, search);
        res.render("home",{title: "테스트 게시판",search, paginator, posts});
    } catch (error) {
        console.log(error);
        res.render("home", {title:"테스트 게시판"});
    }
});

//4-2 글쓰기페이지
app.get("/write",(req,res)=>{
    res.render("write", { title: "테스트 게시판", mode: "create" });
});

//4-3 상세페이지 이동
app.get("/detail/:id", async(req,res) =>{
    
    //1.게시글 정보 가져오기
    const result = await postService.getDetailPost(collection,req.params.id);
    console.log("result...?",result);
    res.render("detail",{
        title : "테스트 게시판",
        post : result.value,
    });
});

//4-4 글쓰기 
app.post("/write", async(req,res) => {
    const post = req.body;
    console.log("req.body...?",post);
    const result = await postService.writePost(collection, post);
    console.log("result...?",result);
    res.redirect(`/detail/${result.insertedId}`);
});

//4-5 패스워드 체크
app.post("/check-password", async(req,res) => {
    const { id,password } = req.body;
    //2.postService의 getPostByIdAndPassWord() 함수를 사용해 게시글 데이터 확인
    const post = await postService.getPostByIdAndPassword(collection, { id, password });
    
    //데이터가 있으면 isExist true, 없으면 isExist False
    if(!post){
        return res.status(404).json({ isExist : false });
    }else{
        return res.json({ isExist : true });
    }
});

//4-6수정 페이지로 이동
app.get("/modify/:id", async (req,res) =>{
    const { id } = req.params.id;
    //getPostById() 함수로 게시글 데이터를 받아옴
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", { title: "테스트 게시판", mode : "modify", post});
});

//4-7게시글 수정 API
app.post("/modify/", async(req,res)=>{
    const { id, title, writer, password, content} = req.body;
    
    const post = {
        title,
        writer,
        password,
        content,
        createdDt : new Date().toISOString(),
    };

    //업데이트 결과
    const result = postService.updatePost(collection, id, post);
    console.log("result",result);
    res.redirect(`/detail/${id}`);
})

//4-8게시글 삭제
app.delete("/delete", async(req,res)=>{
    
    const { id, password } = req.body;
    try {
        //collection의 deleteOne을 사용해 게시글 하나를 삭제
        const result = await collection.deleteOne({ _id: ObjectId(id), password: password });
        //삭제 결과가 잘 못된 경우의 처리
        if(result.deletedCount !== 1){
            console.log("삭제 실패");
            return res.json({ isSuccess : false});
        }
        return res.json({ isSuccess : true});

    } catch (error) {
        console.log(error);
        return res.json({ isSuccess: false })
    }
});

//4-9 댓글 추가
app.post("/write-comment", async (req,res) => {
    console.log("댓글추가히 영역");
    //1.body에서 데이터를 가져오기  
    const { id, name, password, comment} = req.body;
    //2.id로 게시글 정보 가져오기
    const post = await postService.getPostById(collection, id);

    //3.게시글에 기존 댓글 리스트가 있으면 추가
    if(post.comments){
        post.comments.push({
            idx: post.comments.length + 1,
            name,
            password,
            comment,
            createdDt: new Date().toISOString(),
        });
    } else {
        //4. 게시글에 댓글 정보가 없으면 리스트에 댓글 정보 추가
        post.comments = [
            {
                idx:1,
                name,
                password,
                comment,
                createdDt : new Date().toISOString(),
            },
        ];
    }

    //5.업데이트하기. 업데이트 후에는 상세페이지로 다시 리다이렉트
    postService.updatePost(collection, id, post);
    return res.redirect(`/detail/${id}`);
});

//4-10.댓글 삭제
app.delete("/delete-comment", async (req,res) =>{
    const { id, idx, password } = req.body;

    console.log("req.body....?",req.body);

    //1.게시글(post)의 comments 안에 있는 특정 댓글 데이터를 찾기
    const post = await collection.findOne(
        {
            _id: ObjectId(id),
            comments: { $elemMatch: { idx: parseInt(idx), password } }, 
        },
        postService.projectionOption,
    );

    //2.데이터가 없으면 isSuccess : false를 주면서 종료
    if(!post){
        return res.json({ isSuccess: false });
    }

    //3.댓글 번호가 idx이외인 것만 comments에 다시 할당 후 저장
    post.comments = post.comments.filter((comment) => comment.idx != idx);
    postService.updatePost(collection, id, post);
    return res.json({ isSuccess: true });
});


let collection;
app.listen(3000,async () => {
    console.log("Server started");
    //mongodbConnection()의 결과는 mongoClient
    const mongoClient = await mongodbConnection();
    console.log("mongoClient...?",mongoClient);
    //mongoClient.db()로 디비 선택 collection()으로 컬렉션 선택 후 collection에 할당
    collection = mongoClient.db().collection("post"); 
    //명시할 시 해당 db와 collection으로 데이터를 생성함 명시 안할시에는 test디비에 자동 설정
    console.log("collection...?",collection);
    console.log("MongoDB connected");
});