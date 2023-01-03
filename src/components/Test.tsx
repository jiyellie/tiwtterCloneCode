import {  useEffect, useState } from "react";
import {  ILogin, IMember } from "../intefaces/service/member";
import { IDeleteNestedReply, IDeleteReply, IDeleteTwit, IFollower, ILike,  IReply,  ITwitLoginInfo } from "../intefaces/service/twit";
import { memberService } from "../service/member-service";
import { twitService } from "../service/twit-service";
import { Link } from 'react-router-dom';
import { TestJoin } from "./member/TestJoin";
import TestTwitList from "./twit/TestTwitList";

const Test = () => {
    const [loginNo, setLoginNo] = useState();

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
            memberNo : 5000,
            name :  "5000", // 회원명
            image : "https://pbs.twimg.com/profile_images/1509863180386041859/iEBdA9jn_400x400.jpg", // 이미지 또는 동영상
            content : "더 글로리 존잼.", // 내용
            // circleMemberNo: [4000,5000],
            // follow : false
        }
        
        twitService.saveTwit(param);
    }

    const testDeleteTwit = () => {
        const params : IDeleteTwit= {
            memberNo : loginNo,
            twitNo : 370
        }
        twitService.deleteTwit(params);
    }

    const login = () => {
        let loginStr = localStorage.getItem("loginInfo");
        if(loginStr === null){
            loginStr = '0';
        }
        setLoginNo(JSON.parse(loginStr));
    }

    const testGetList = () => {
        const param:ITwitLoginInfo = {
            memberNo :loginNo,
            // keyword : "새해"
        }
        
        const getTwits = twitService.getTwitList(param);

        getTwits.sort(function(a,b){
            const dateA = a.registerDate;
            const dateB = b.registerDate;
            if(dateA && dateB) {
                if(dateA > dateB){
                    return -1;
                }
                if(dateA < dateB){
                    return 1;
                }
            }    
            return 0;
        })
        console.log(getTwits);
    }
    
    const testReplyTwit = () => {
        const params :IReply = {
            twitNo:370,
            memberNo : 3000,
            name: "3000",
            content: "string",
            image:"string"
        }
        
        const reply = twitService.replyTwit(params);
        console.log(reply);
    }

    const testDeleteReply = () => {
        const params : IDeleteReply = {
            memberNo: loginNo,
            replyNo : 42
        }

        twitService.deleteReply(params);
    }

    const testNestedReply = () => {
        const params : IReply = {
            twitNo: 370,
            replyNo: 1,
            memberNo : 2000,
            name: "2000",
            content: "string",
            image: "string"
        }
        twitService.nestedReplyTwit(params);
    }

    const testDeleteNestedReply = () => {
        const params : IDeleteNestedReply = {
            memberNo : loginNo,
            nestedReplyNo : 446
        }

        twitService.deleteNestedReply(params);
    }

    const testLike = () => {
        const params : ILike = {
            twitNo : 370,
            memberNo : loginNo
        }
        twitService.likeTwit(params);
    }

    const testFollow = () => {
        if(loginNo === undefined){
            return;
        }
        const params : IFollower = {
            followerNo : loginNo,//나 
            followNo : 6000               
        }
        
        const follow = twitService.followTwit(params);
        console.log(follow);
    }

    const testSaveRetwit = () => {
        const param = {
            memberNo : 3000,
            name :  "3000", // 회원명
            image : "string", // 이미지 또는 동영상
            content : "내용", // 내용
            retwitNo : 781,
        }
        
        twitService.saveRetwit(param);
    }

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
        // testKeyword();
    },[])

    return ( 
    <>
        <div>트위터 초기 화면</div>
        <div><Link to={"/TestJoin"}>회원가입</Link></div>
        <div><Link to={"/TestLogin"}>로그인</Link></div>
        <div><Link to={"/TestMyInfo"}>내 정보</Link></div>
        <div>트윗 전체 목록</div>
        <TestTwitList/>
    </>
    )
}

export default Test;
