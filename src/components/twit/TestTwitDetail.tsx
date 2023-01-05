import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IDeleteNestedReply, IDeleteReply, ILike, INestedReply, IReply, ITwitDetail, ITwitDetailReq } from "../../intefaces/service/twit";
import { twitService } from "../../service/twit-service";

export const TestTwitDetail = () => {
    const [loginNo, setLoginNo] = useState();
    const [twitNo, setTwitNo] = useState<string>();
    const [heartChange,setHeartChange] = useState(false);
    const navigate = useNavigate();
    const [nestedReplies, setNestedReplies] = useState<IReply>();
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

    const nestedReply = (item : any) => {
        if(!twitDetail?.reply){
            return;
        }
        for(let i = 0 ; i < twitDetail?.reply.length ; i ++){
            if(twitDetail?.reply[i].replyNo === item.replyNo){
                setNestedReplies(twitDetail?.reply[i]);
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

        let loginStr = localStorage.getItem("loginInfo");
        if(loginStr === null){
            loginStr = '0';
        }
        const loginNo = JSON.parse(loginStr);
        setLoginNo(loginNo);
        
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

    useEffect(()=> {
        init();
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
                                <svg height="20px" width="30px"  viewBox="0 0 512 512" >
                                <path style={{fill:"#FF6647"}} d="M474.655,74.503C449.169,45.72,413.943,29.87,375.467,29.87c-30.225,0-58.5,12.299-81.767,35.566
                                    c-15.522,15.523-28.33,35.26-37.699,57.931c-9.371-22.671-22.177-42.407-37.699-57.931c-23.267-23.267-51.542-35.566-81.767-35.566
                                    c-38.477,0-73.702,15.851-99.188,44.634C13.612,101.305,0,137.911,0,174.936c0,44.458,13.452,88.335,39.981,130.418
                                    c21.009,33.324,50.227,65.585,86.845,95.889c62.046,51.348,123.114,78.995,125.683,80.146c2.203,0.988,4.779,0.988,6.981,0
                                    c2.57-1.151,63.637-28.798,125.683-80.146c36.618-30.304,65.836-62.565,86.845-95.889C498.548,263.271,512,219.394,512,174.936
                                    C512,137.911,498.388,101.305,474.655,74.503z"/>
                                </svg>
                                :
                                <svg fill="#000000" height="20px" width="30px" viewBox="0 0 471 471" >
                                    <g>
                                        <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
                                            c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
                                            l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
                                            C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
                                            s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
                                            c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
                                            C444.801,187.101,434.001,213.101,414.401,232.701z"/>
                                    </g>
                                </svg>
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
                                            <td><button onClick={()=>{nestedReply(item)}}>대댓글</button></td>
                                            <td><button onClick={()=>testDeleteReply(item)}>삭제</button></td>
                                        </tr>
                                        <tr>
                                            <td><input type={"text"} name={"content"} onChange={getValue} placeholder="댓글을 입력해주세요."/></td>
                                            <td><input type={"file"} name={"image"}/></td>
                                            <td><button type={"button"} onClick={()=>testNestedReply(item)}>등록</button></td>
                                        </tr>
                                    </>
                                }
                               {nestedReplies?.replyNo === item.replyNo && item.nestedReplyNo && 
                                    <tr>
                                        <td><input type={"text"} name={"name"} value={item.memberNo} readOnly/></td>
                                        <td><input type={"text"} name={"content"} value={item.content} readOnly/></td>
                                        {item.image ?
                                            <td><img src={item.image} alt={`${item.name}의 이미지`} style={{width:"300px"}}/></td>
                                            :
                                            null
                                        }
                                        <td><button onClick={()=>{nestedReply(item)}}>대댓글</button></td>
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