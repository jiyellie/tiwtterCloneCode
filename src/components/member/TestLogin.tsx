import React,{ useState } from "react";
import { ILogin } from "../../intefaces/service/member";
import { memberService } from "../../service/member-service";
import { useNavigate } from 'react-router-dom';

export const TestLogin = () => {
    
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        no:"",
        password:""
    })
    
    const getValue = (e : any) =>{
        const {name, value} = e.target;
        setLoginInfo({
            ...loginInfo,
            [name] : value
        });
    }

    const testLogin = () => {
        const param:ILogin = {
            no : parseInt(loginInfo.no),
            password :loginInfo.password
        }
        
        if(memberService.loginTwit(param)) {
            alert(`${loginInfo.no}님 어서오세요`);
            home();
        }
    }

    const home = () => {
        navigate("/");
    }
   
    return (
        <>
            <nav>로그인 화면</nav>
            <table>
                <tbody>
                    <tr>
                        <td>회원 아이디</td>
                        <td><input type="text" name="no" onChange={getValue} placeholder="아이디를 입력하세요"/></td>
                    </tr>
                    <tr>
                        <td>비밀번호</td>
                        <td><input type="password" name="password" onChange={getValue} placeholder="비밀번호를 입력해주세요."/></td>
                    </tr>
                    <tr>
                        <td><button type="button" onClick={home}>홈</button></td>
                        <td><button type="button" onClick={testLogin}>로그인</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}