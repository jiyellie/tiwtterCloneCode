import React, { useEffect, useState } from 'react'
import { ITwitList, ITwitLoginInfo } from '../../intefaces/service/twit';
import { twitService } from '../../service/twit-service';
import { useNavigate } from 'react-router-dom';

export default function TestTwitList() {
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

        const param:ITwitLoginInfo = {
            memberNo :loginNo,
            keyword : "새해"
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

    useEffect(() => {
      init();
    }, [])
    
  return (
    <>
        {twitList && twitList.map(item => (
            <div key={item.twitNo} onClick={()=>testTwitDetail(item)}>
                <hr/>
                <div>
                    <span><strong>{item.memberNo}</strong> </span>
                    <span>{item.name}</span>
                </div>
                <div>{item.content}</div>
                <img src={item.image} alt={`${item.name}의 이미지`}/>
                <div>{item.registerDate}</div>
                <hr/>
            </div>
        ))}
    </>
  )
}
