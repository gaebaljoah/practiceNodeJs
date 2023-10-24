const axios = require("axios");

async function getTop20Movies(){    //await을 사용하므로 async를 붙힘
    const url = "https://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json";
    try{
        //2.네트워크에서 데이터를 받아오므로 await로 기다림
        const result = await axios.get(url);
        const {data} = result;
        if (!data.articleList || data.articleList.size == 0){
            throw new Error("데이터가 없습니다.");
        }
        //data에서 필요한 영화 제목과 순위 정보를 뽑아냄
        const movieInfos = data.articleList.map((article, idx) => {
            return { title: article.title, rank: idx +1};
        });

        //데이터 출력
        for(let movieInfo of movieInfos){
            console.log(`[${movieInfo.rank}위] ${movieInfo.title}`);
        }
    } catch(err){
        //3.예외 처리는 기존 코드와 같게 try catch로 감쌈
        throw new Error(err);
    }
}

getTop20Movies();