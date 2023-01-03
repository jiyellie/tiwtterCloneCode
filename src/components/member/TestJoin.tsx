import React,{ useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IMember } from "../../intefaces/service/member";
import { memberService } from "../../service/member-service";

export const TestJoin = () => {
    
    const navigate = useNavigate();
    const [joinInfo, setjoinInfo] = useState({
        no:"",
        name:"",
        birth:"",
        password:""
    })
    
    const getValue = (e : any) =>{
        const {name, value} = e.target;
        setjoinInfo({
            ...joinInfo,
            [name] : value
        });
    }

    const testJoinTwit = () => {
        if(!joinInfo){
            alert("정보를 제대로 기입하지 않았습니다.");
            return;
        }
        console.log(joinInfo.no);
        const param:IMember = {
            no : parseInt(joinInfo.no),
            name : joinInfo.name,
            birth : joinInfo.birth,
            password : joinInfo.password
        }

        if(memberService.joinTwit(param)) {
            alert("트위터의 회원이 되신걸 축하합니다!");
            home();
        }
    }

    const home = () => {
        navigate("/");
    }
   
    return (
        <>
            <nav>회원가입 화면</nav>
            <table>
                <tbody>
                    <tr>
                        <td>회원 아이디</td>
                        <td><input type="number" name="no" onChange={getValue} placeholder="숫자로만 입력해주세요!"/></td>
                    </tr>
                    <tr>
                        <td>회원 이름</td>
                        <td><input type="text" name="name" onChange={getValue} placeholder="이름을 입력해주세요."/></td>
                    </tr>
                    <tr>
                        <td>비밀번호</td>
                        <td><input type="password" name="password" onChange={getValue} placeholder="비밀번호를 입력해주세요."/></td>
                    </tr>
                    <tr>
                        <td>생일</td>
                        <td><input type="text" name="birth"  onChange={getValue} placeholder="예시) 2023-01-01"/></td>
                        
                    </tr>
                    <tr>
                        <td><button type="button" onClick={home}>홈</button></td>
                        <td><button type="button" onClick={testJoinTwit}>회원가입 완료</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}