import React,{ useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IMember } from "../../intefaces/service/member";
import { memberService } from "../../service/member-service";

export const TestMyInfo = () => {
    const [loginNo, setLoginNo] = useState();
    const navigate = useNavigate();
    const [myInfo, setmyInfo] = useState({
        no:"",
        name:"",
        birth:"",
        password:""
    })
    
    const getValue = (e : any) =>{
        const {name, value} = e.target;
        setmyInfo({
            ...myInfo,
            [name] : value
        });
    }


    const testUpdate = () => {
        if(!myInfo || !loginNo){
            alert("정보를 제대로 기입하지 않았습니다.");
            return;
        }
        const param:IMember = {
            no :loginNo,
            name : myInfo.name,
            birth : myInfo.birth,
            password : myInfo.password 
        }
            
        if(memberService.updateMember(param)) {
            alert("회원정보 변경이 완료되었습니다!");
            home();
        }
    }

    const home = () => {
        navigate("/");
    }

    const testLogout = () => {
        if(!loginNo){
            return;
        }
        if(memberService.logoutTwit(loginNo)) {
            alert("로그아웃 되었습니다.");
            home();
        }
    }

    const testDeleteMember = () => {
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
        let loginStr = localStorage.getItem("loginInfo");
        if(loginStr === null){
            loginStr = '0';
        }
        const loginNo = JSON.parse(loginStr);
        setLoginNo(loginNo);
        const getMember = memberService.getMember(loginNo);
        if(!getMember){
            return;
        }
        
        setmyInfo({
            ...getMember,
            no: String(getMember?.no) ,
            name: getMember?.name,
            birth: getMember?.birth,
            password: getMember?.password
        })
    }

    useEffect(()=> {
        init();
    },[])
   
    return (
        <>
            <nav>내 정보</nav>
            <table>
                <tbody>
                    <tr>
                        <td>회원 아이디</td>
                        <td><input disabled type="number" name="no" onChange={getValue} value={myInfo.no}/></td>
                    </tr>
                    <tr>
                        <td>회원 이름</td>
                        <td><input type="text" name="name" onChange={getValue} value={myInfo.name}/></td>
                    </tr>
                    <tr>
                        <td>비밀번호</td>
                        <td><input type="password" name="password" onChange={getValue} value={myInfo.password}/></td>
                    </tr>
                    <tr>
                        <td>생일</td>
                        <td><input type="text" name="birth"  onChange={getValue} value={myInfo.birth}/></td>
                        
                    </tr>
                    <tr>
                        <td><button type="button" onClick={home}>홈</button></td>
                        <td>
                            <button type="button" onClick={testLogout}>로그아웃</button> 
                            <button type="button" onClick={testUpdate}>수정</button>
                            <button type="button" onClick={testDeleteMember}>탈퇴</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}