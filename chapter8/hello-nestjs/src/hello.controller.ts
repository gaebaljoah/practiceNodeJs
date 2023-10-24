import { Controller, Get } from "@nestjs/common"; //1.필요한 함수 임포트

@Controller()   //2.컨트롤러 데코레이터
export class HelloController{   //3. 외부에서 사용하므로 export를 붙혀줍니다.
    @Get()      //4. GET 요청 처리 데코레이터
    hello(){
        return "안녕하세요! NestJS로 만든 첫 어플리케이션입니다,";
    }
}
