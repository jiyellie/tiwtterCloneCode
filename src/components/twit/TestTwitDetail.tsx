import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IDeleteNestedReply, IDeleteReply, ILike, INestedReply, IReply, ITwitDetail, ITwitDetailReq } from "../../intefaces/service/twit";
import { twitService } from "../../service/twit-service";

export const TestTwitDetail = () => {
    const [loginNo, setLoginNo] = useState();
    const [twitNo, setTwitNo] = useState<string>();
    const [saveNestedReply, setsaveNestedReply] = useState(false);
    const [heartChange,setHeartChange] = useState(false);
    const navigate = useNavigate();
    const [changeReply, setChangeReply] = useState<IReply>();
    const [twitDetail, setTwitDetail] = useState<ITwitDetail>()
    const [twitReply, setTwitReply] = useState({
        content : "",
        image:""
    })
    
    const getValue = (e : any) =>{
        const {name, value} = e.target;
        setTwitReply({
            ...twitReply,
            [name] : value
        });
    }

    const home = () => {
        navigate("/");
    }

    const nestedReply = (e : any,item : any) => {
        const replies = JSON.parse(e.view.localStorage.reply);
        for(let i = 0 ; i < replies.length ; i ++){
            if(replies[i].replyNo === item.replyNo){
                setsaveNestedReply(!saveNestedReply)
            }
        }
    }

    const testReplyTwit = () => {
        if(!twitNo || !loginNo){
            return;
        }
        const params :IReply = {
            twitNo: parseInt(twitNo),
            memberNo : loginNo,
            content: twitReply.content,
            image: twitReply.image || "",
        }
        
        const reply = twitService.replyTwit(params);
        console.log(reply);
    }

    const testNestedReply = (item : IReply) => {
        if(!twitNo || !loginNo){
            return;
        }
        const params = {
            twitNo: parseInt(twitNo),
            replyNo: item.replyNo,
            memberNo : loginNo,
            content: twitReply.content,
            image: twitReply.image || undefined
        }
        twitService.nestedReplyTwit(params);
    }

    const testDeleteReply = (item : IReply) => {
        setChangeReply(item);
        const params : IDeleteReply = {
            memberNo: loginNo,
            replyNo : item.replyNo
        }

        const deleteReply = twitService.deleteReply(params);
        console.log(deleteReply);
    }

    const testDeleteNestedReply = (item :IReply ) => {
        const params : IDeleteNestedReply = {
            memberNo : loginNo,
            nestedReplyNo : item.nestedReplyNo
        }

        const deleteNestedReply = twitService.deleteNestedReply(params);
        console.log(deleteNestedReply);
    }

    const testLike = () => {
        if(!twitNo || !loginNo){
            return;
        }
        const params : ILike = {
            twitNo: parseInt(twitNo),
            memberNo : loginNo
        }
        twitService.likeTwit(params);
    }

    // const testDeleteTwit = () => {
    //     if(!twitNo|| !loginNo){
    //         return;
    //     }
    //     const params = {
    //         twitNo : parseInt(twitNo),
    //         memberNo : loginNo
    //     }
    //     if(window.confirm("삭제하시겠습니까?")) {
    //         twitService.deleteTwit(params);
    //         alert("삭제되었습니다.");
    //         home();
    //     }
    // }

    const init = () => {
        const noAtLocation = window.location.search.slice(-3);
        setTwitNo(noAtLocation);
        const params : ITwitDetailReq = {
            twitNo : parseInt(noAtLocation),
            memberNo : loginNo
        }
        const getTwitDetail = twitService.getTiwtDetail(params);
        setTwitDetail({
            ...getTwitDetail,
            memberNo: getTwitDetail.memberNo ,
            name: getTwitDetail.name,
            content: getTwitDetail.content,
            image: getTwitDetail.image || "",
            registerDate: getTwitDetail.registerDate,
            reply : getTwitDetail.reply
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
   
   
    console.log(twitDetail);
    return (
        <>
            <div>
                <div>
                    <span><strong>{twitDetail?.memberNo}</strong> </span>
                    <span>{twitDetail?.name}</span>
                </div>
                <div>{twitDetail?.content}</div>
                <img src={twitDetail?.image} alt={`${twitDetail?.name}의 이미지`} style={{width:"300px"}}/>
                <div>{twitDetail?.registerDate}</div>
                <hr/>
                {twitDetail?.memberNo === loginNo ?
                    (<div>
                        <button>삭제하기</button> 
                        <button>홈</button>
                    </div>)
                    :
                    (<div>
                        <button onClick={()=>{}}>리트윗</button> 
                        <span onClick={()=>{testLike();setHeartChange(!heartChange)}}>
                            {heartChange || twitDetail.isLike ?
                                <i className="fa-solid fa-heart"></i>
                                :
                                <i className="fa-regular fa-heart"></i>
                            }
                        </span>
                        <button onClick={home}>홈</button>
                    </div>)
                }
                <hr/>
                <div>
                    <div>
                        <input type={"text"} name={"content"} onChange={getValue} placeholder="댓글을 입력해주세요."/>
                        <input type={"file"} name={"image"} onChange={getValue}/>
                        <button type={"button"} onClick={testReplyTwit}>등록</button>
                    </div>
                    <table>
                        {twitDetail?.reply && twitDetail?.reply.map( item =>
                            <tbody key={item.registerDate}>
                                {!item.nestedReplyNo &&
                                    <>
                                        <tr>
                                            <td><input type={"text"} name={"name"} value={item.memberNo} readOnly/></td>
                                            <td><input type={"text"} name={"content"} value={item.content} readOnly/></td>
                                            {item.image ?
                                                <td><img src={item.image} alt={`${item.name}의 이미지`} style={{width:"300px"}}/></td>
                                                :
                                                null
                                            }
                                            <td><button onClick={(e)=>{setsaveNestedReply(!saveNestedReply)}}>대댓글 보기</button></td>
                                            <td><button onClick={()=>testDeleteReply(item)}>삭제</button></td>
                                        </tr>
                                        <tr>
                                            <td><input type={"text"} name={"content"} onChange={getValue} placeholder="댓글을 입력해주세요."/></td>
                                            <td><input type={"file"} name={"image"}/></td>
                                            <td><button type={"button"} onClick={()=>testNestedReply(item)}>등록</button></td>
                                        </tr>
                                    </>
                                }
                                {saveNestedReply && item.nestedReplyNo &&
                                    <tr>
                                        <td><input type={"text"} name={"name"} value={item.memberNo} readOnly/></td>
                                        <td><input type={"text"} name={"content"} value={item.content} readOnly/></td>
                                        {item.image ?
                                            <td><img src={item.image} alt={`${item.name}의 이미지`} style={{width:"300px"}}/></td>
                                            :
                                            null
                                        }
                                        <td><button onClick={(e)=>{nestedReply(e,item)}}>대댓글달기</button></td>
                                        <td><button onClick={()=>testDeleteNestedReply(item)}>삭제</button></td>
                                    </tr>
                                }
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </>
    )
}