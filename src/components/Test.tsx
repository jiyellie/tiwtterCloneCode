import {  useEffect } from "react";
import {  ILogin, IMember } from "../intefaces/service/member";
import {  IDeleteNestedReply, IDeleteReply, IDeleteTwit, IFollower, ILike, INestedReply,  IReply,  ITwitLoginInfo } from "../intefaces/service/twit";
import { memberService } from "../service/member-service";
import { twitService } from "../service/twit-service";

const Test = () => {

    const testJoinTwit = () => {
        const param:IMember = {
            no : 2000,
            name : 'test1',
            birth : '2000-02-01',
            password : '1234'
        }
        memberService.joinTwit(param);

        // const member = memberService.getMember(2000)
        // if( member && member.no === 2000){
        //     console.log(' 테스트 성공 ');
        // }else{
        //     console.log(' 테스트 실패 ');
        // }
    }

    const testLogin = () => {
        const param:ILogin = {
            no :2000,
            password :"1234"
        }
        
        const login = memberService.loginTwit(param);
        console.log(login)
    }

    const testUpdate = () => {
        const param:IMember = {
            no :2000,
            name : 'test1',
            birth : '2000-02-01',
            password : '12341' 
        }
        
        memberService.updateMember(param);
    }

    const testSaveTwit = () => {
        const param = {
            no : 4000,
            name :  "4000", // 회원명
            image : "string", // 이미지 또는 동영상
            content : "오리 눈 만들고 싶다.", // 내용
            // circleMemberNo: [4000,2000],
            // follow : false
        }
        
        twitService.saveTwit(param);
    }

    // const testDeleteTwit = () => {
    //     const params : IDeleteTwit= {
    //         no : 2000,
    //         twitNo : 71
    //     }
    //     twitService.deleteTwit(params);
    // }

    // const testGetList = () => {
    //     let loginStr = localStorage.getItem("loginInfo");
    //     if(loginStr === null){
    //         loginStr = '0';
    //     }
    //     const loginMemberNo = JSON.parse(loginStr);

    //     const param:ITwitLoginInfo = {
    //         no :loginMemberNo,
    //     }
        
    //     const getTwits = twitService.getTwitList(param);

    //     getTwits.sort(function(a,b){
    //         const dateA = a.registerDate;
    //         const dateB = b.registerDate;
    //         if(dateA && dateB) {
    //             if(dateA > dateB){
    //                 return -1;
    //             }
    //             if(dateA < dateB){
    //                 return 1;
    //             }
    //         }    
    //         return 0;
    //     })
    //     console.log(getTwits);
    // }
    
    // const testReplyTwit = () => {
    //     const params :IReply = {
    //         twitNo:758,
    //         no : 2000,
    //         name: "2000",
    //         content: "string",
    //         image:"string"
    //     }
        
    //     const reply = twitService.replyTwit(params);
    //     console.log(reply);
    // }

    // const testDeleteReply = () => {
    //     const params : IDeleteReply = {
    //         no: 2000,
    //         replyNo : 22
    //     }

    //     twitService.deleteReply(params);
    // }

    // const testNestedReply = () => {
    //     const params : IReply = {
    //         twitNo: 758,
    //         replyNo: 26,
    //         no : 2000,
    //         name: "2000",
    //         content: "string",
    //         image: "string"
    //     }
    //     twitService.nestedReplyTwit(params);
    // }

    // const testDeleteNestedReply = () => {
    //     const params = {
    //         no : 2000,
    //         nestedReplyNo : 446
    //     }

    //     twitService.deleteNestedReply(params);
    // }

    // const testLike = () => {
    //     const params : ILike = {
    //         twitNo : 758,
    //         memberNo : 2000
    //     }
    //     twitService.likeTwit(params);
    // }

    // const testFollow = () => {
    //     const params : IFollower = {
    //         followerNo : 2000,//나 
    //         followNo : 6000               
    //     }
        
    //     const follow = twitService.followTwit(params);
    //     console.log(follow);
    // }

    // const testSaveRetwit = () => {
    //     const param = {
    //         no : 3000,
    //         name :  "3000", // 회원명
    //         image : "string", // 이미지 또는 동영상
    //         content : "내용", // 내용
    //         retwitNo : 781,
    //     }
        
    //     twitService.saveRetwit(param);
    // }

    const testKeyword = () => {
        const param = {
            keyword : "모나리자"
        }

        const trend = twitService.trendKeyword(param);
        console.log(trend)
    }

    useEffect(() => {
        // 회원 가입 테스트
        // testJoinTwit();
        // 회원조회 테스트
        // const getMember = memberService.getMember(2000);
        // console.log(getMember);
        // 로그인 테스트
        //  testLogin();
        // 수정 테스트
        // testUpdate();
        // 삭제 테스트
        // memberService.deleteMember(4000);
         // 로그아웃 테스트
        // memberService.logoutTwit(3000);
        // 회원 목록
        // const memberList = twitService.getMemberList()
        // console.log(memberList )
        // 트윗 저장
        // testSaveTwit();
        // 트윗 전체 목록
        // testGetList();
        // 트윗 삭제하기
        // testDeleteTwit();
        // 트윗 상세보기
        // const detail = twitService.getTiwtDetail(758);
        // console.log(detail);
        // 댓글 달기
        // testReplyTwit();
        // 댓글 삭제하기
        // testDeleteReply();
        // 대댓글 작성하기
        // testNestedReply()
        // 대댓글 삭제하기
        // testDeleteNestedReply();
        // testLike();
        // testFollow();
        // twitService.saveRetwit(758);
        testKeyword();
    },[])

    return <div>test</div>
}

export default Test;
