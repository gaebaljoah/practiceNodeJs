function myWork(work){
    return new Promise((resolve,reject) =>{
        if(work === 'done'){
            resolve('게임 가능');
        } else {
            reject(new Error("게임 불가능"));
        }
    })
}
//1.콜백과 다를 바가 없음
myWork('done').then(function (value) { console.log(value) }, function (err){
console.error(err)});

//2.좋음
myWork('doing')
    .then(function (value) {console.log(value)})
    .catch(function (err) {console.error(err)})
    .finally(console.log("어찌나 저찌나 우리인생"));