import React,{ useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { memberService } from "../../service/member-service";
import { twitService } from "../../service/twit-service";

export const TestTwitDetail = () => {
    const [loginNo, setLoginNo] = useState();
    const navigate = useNavigate();
    const [twitDetail, setTwitDetail] = useState({
        memberNo: "" ,
        name: "",
        content: "",
        image: "",
        registerDate: ""
    })
    
    const getValue = (e : any) =>{
        const {name, value} = e.target;
        setTwitDetail({
            ...twitDetail,
            [name] : value
        });
    }

    const home = () => {
        navigate("/");
    }

    const testDeleteTwit = () => {
        if(!loginNo){
            return;
        }
        if(window.confirm("정말 탈퇴하시겠습니까?")) {
            memberService.deleteMember(loginNo);
            alert("탈퇴되셨습니다.");
            home();
        }
    }

    const init = () => {
        const twitNo = window.location.search.slice(-3);
        const getTwitDetail = twitService.getTiwtDetail(parseInt(twitNo));
        setTwitDetail({
            ...getTwitDetail,
            memberNo: String(getTwitDetail.memberNo) ,
            name: getTwitDetail.name,
            content: getTwitDetail.content,
            image: getTwitDetail.image || "",
            registerDate: getTwitDetail.registerDate
        })
    }

    const login = () => {
        let loginStr = localStorage.getItem("loginInfo");
        if(loginStr === null){
            loginStr = '0';
        }
        const loginNo = JSON.parse(loginStr);
        setLoginNo(loginNo);
    }

    useEffect(()=> {
        init();
        login();
    },[])
   
    return (
        <>
            <div>
                <div>
                    <span><strong>{twitDetail.memberNo}</strong> </span>
                    <span>{twitDetail.name}</span>
                </div>
                <div>{twitDetail.content}</div>
                <img src={twitDetail.image} alt={`${twitDetail.name}의 이미지`}/>
                <div>{twitDetail.registerDate}</div>
                {parseInt(twitDetail.memberNo) === loginNo &&
                    <div>
                        <button>삭제하기</button> 
                        <button>홈</button>
                    </div>
                }
            </div>
        </>
    )
}