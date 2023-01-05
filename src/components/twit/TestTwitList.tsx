import React, { useEffect, useState } from 'react'
import { ILike, ITwitList, ITwitLoginInfo } from '../../intefaces/service/twit';
import { twitService } from '../../service/twit-service';
import { useNavigate } from 'react-router-dom';

export default function TestTwitList() {
    const [loginNo, setLoginNo] = useState();
    const [twitNumber, setTwitNumber] = useState<string>();
    const [heartChange,setHeartChange] = useState(false);
    const [twitList ,setTwitList] = useState<ITwitList[]>();
    const navigate = useNavigate();

    const testTwitDetail = (item : ITwitList) => {
        const twitNo = item.twitNo
        navigate(`/testTwitDetail?twitNo=${twitNo}`)
    }

    const init = () => {
        let loginStr = localStorage.getItem("loginInfo");
        if(loginStr === null){
            loginStr = '0';
        }
        const loginNo = JSON.parse(loginStr);
        setLoginNo(loginNo);
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
        setTwitList(getTwits);
    }
    
    const testLike = (item : ITwitList) => {
        if(!item.twitNo || !loginNo){
            return;
        }
        const params : ILike = {
            twitNo: item.twitNo,
            memberNo : loginNo
        }
        twitService.likeTwit(params);
    }

    useEffect(() => {
      init();
      
    }, [])
    
  return (
    <>
        {twitList && twitList.map(item => (
            <div key={item.twitNo} >
                <div onClick={()=>testTwitDetail(item)}>
                    <hr/>
                    <div>
                        <span><strong>{item.memberNo}</strong> </span>
                        <span>{item.name}</span>
                    </div>
                    <div>{item.content}</div>
                    <img src={item.image} alt={`${item.name}의 이미지`} style={{width:"300px"}}/>
                    <div>{item.registerDate}</div>
                </div>
                <div>
                    <button onClick={()=>{}}>리트윗</button> 
                    <span onClick={()=>{testLike(item); setHeartChange(!heartChange)}}>
                        {item.isLike ?
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
                </div>
            </div>
        ))}
    </>
  )
}
