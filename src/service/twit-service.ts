import { IDeleteNestedReply, IDeleteReply, IDeleteTwit, ITwitList, IFollower, ILike, IReply, IRetwit, ISaveTwit, ITwitLoginInfo, ITwitDetail, ITrendKeyword, ITwitDetailReq } from "../intefaces/service/twit";

/**
 * 트윗 목록 조회 
 */
// 1. 로컬스토리지의 키값이 twit, circleGroup, like인 데이터를 각각 조회 해 온다. 
    // 조회 한 스트링타입이 null이라면 "[]"로 바꿔주고 JSON.parse로 데이터를 객체형태로 변환한다.
// 2. 요청에 사용자 아이디와 검색 키워드를 전달받는다. (검색 키워드는 존재 시에만)
    // 사용자의 아이디가 존재하지 않는다
        // circleGroup의 로직을 타지 않고 모두 조회 가능한 데이터로 넘어간다.
    // 사용자의 아이디가 존재한다
        // 사용자의 아이디가 존재하는 경우 circleGroup안의 데이터와 비교하여 맞는 데이터를 추출한다.
    // 검색 키워드가 존재한다
        // 들어온 아이디 정보와 함께 검색키워드가 존재하는 경우 twit안의 content와 비교하여 키워드가 있는 twit 정보를 추출한다.
        // 추출후 twitList를 빈 값으로 설정후 그 안에 데이터를 담아준다.
// 3. twitList안에 사용자가 조회 가능한 데이터가 얼마나 있는지 확인한다.
    // twitList에서 트윗이 여러개가 있다
        // 조회가능한 트윗을 circleGroup과 조인해서 같은 twitNo를 가지고 있는 데이터를 추출한다.
        // 추출한 데이터 중 circleGroup에 포한 되지 않은 데이터는 모든 사람조회로 보고 그대로 resTwitList에 push한다.
        // circleGroup안에 존재하는 twitNo중 사용자의 아이디가 들어간 데이터가 존재하는지를 확인후 resTwitList에 push한다.
    // twitList에 트윗이 존재하지 않는다
        // 데이터가 존재하지 않는다는 메시지를 보낸다.
// 4. 좋아요를 한 사용자가 있다.
    // like 목록안에 좋아요가 존재하는 경우 사용자 아이디와 비교하여 사용자이 좋아요한 글이 있다면
    // isLike를 true로 해서 데이터를 넣어준다.
// 6. retwit 한 사용자가 있다.
    // resTwitList에 retwitNo가 들어있다면 twitList안에 retwitNo와 같은 twitNo를 찾아서 retwit에 넣어준다.
const getTwitList = (param : ITwitLoginInfo) => {
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = '[]';
    }
    let twitList = JSON.parse(twitStr);

    let resTwitList = [] as ITwitList[];
    
    let circleStr = localStorage.getItem("circleGroup");
    if(circleStr === null){
        circleStr = '[]';
    }
    const circleGroup = JSON.parse(circleStr); 

    let likeStr = localStorage.getItem("like");
    if(likeStr === null){
        likeStr = "[]"
    }
    const likeList = JSON.parse(likeStr);

    // 서클에 저장되어 있는 번호만 받아오기
    let circleNumbers = [];
    for(let p = 0 ;p < circleGroup.length ; p ++){
        circleNumbers.push(circleGroup[p].twitNo);
    }
    let twits=[];
    let isKeyword = false;
    let keywordReq = param.keyword?.replace(/ /g,"");
    // 요청에 키워드가 존재한다
    if(param.keyword){
        for(let g = 0 ; g < twitList.length ; g++ ){
            const twitContent = twitList[g].content.replace(/ /g,"");
            // 트윗글에 요청한 키워드와 같은 키워드가 존재한다면
            if(twitContent.includes(keywordReq)){
                twits.push(twitList[g]);
                isKeyword =true;
            }
        }
    }
    if(isKeyword){
        twitList.length = 0;
        twitList = [...twits];
    }

    // 트윗 조회를 여러명이서 하는 경우와 서클회원만 가능하게 한 경우를 확인하여 목록에 담는다.
    if(twitList.length > 0){ //트윗이 여러개인 경우
        for(let i =0;i < twitList.length ; i ++){
            const twit = twitList[i]
            for(let j = 0; j < circleGroup.length;j++){
                const circle = circleGroup[j]
                if(twit.twitNo === circle.twitNo){ // 서클에 트윗 번호가 있어서 서클을 선택한 사람
                    for(let k = 0 ; k < circle.memberNo.length ; k ++){
                        if(circle.memberNo[k] === param.memberNo){// 서클에 선택된 회원과 로그인한 회원이 있을 때 
                            resTwitList.push(twit);
                        }
                    }
                }
            // 받아온 서클 번호에 트윗번호가 존재하지 않는것을 resTwitList에 넣어준다.
            }if(!circleNumbers.includes(twit.twitNo)){
                resTwitList.push(twit);
            }
        }
    } else {
        alert("조회 가능한 트윗이 존재하지 않습니다.");
    }

    
    // 좋아요가 존재하는 경우 isLike가 있는 데이터로 가공한다.
    for(let g = 0 ; g < likeList.length ; g ++){
        const like = likeList[g];
        if(param.memberNo === like.memberNo){ // 로그인한 회원과 좋아요 리스트에있는 회원이 같을 떄
            for(let l = 0 ; l < resTwitList.length ; l ++ ){ // 담은 목록안의 트윗번호와 좋아요 리스트안의 트윗 번호를 비교하여 같으면 isLike에 값을 넣는다.
                const response = resTwitList[l]
                if(response.twitNo === like.twitNo){
                    resTwitList[l].isLike = true;
                }
            }
        }
    }

    // twitList 안에 retwit이 있는 경우
    for(let o = 0 ; o < resTwitList.length ; o ++){
        const restwit = resTwitList[o]
        for(let y = 0 ; y < twitList.length ; y ++){
            const twit = twitList[y]
            if(restwit.retwitNo && restwit.retwitNo === twit.twitNo){
                resTwitList[o].retwit = twit;
            }
        }       
    }
    return resTwitList;
}

/**
 * 트윗 저장
 */
// 1. 사용자가 저장하고자하는 정보를 받아온다.
// 2. 로컬스토리지의 키값이 twit으로 되어있는 정보를 받아와서 스트링형태의 데이터를 객체 형태로 변환 시켜준다.
// 3. 받아온 데이터에서 circleMemberNo는 저장하지 않기 위해 saveTwitWithoutCircleNo 변수에 값을 가공한다.
// 4. 가공한 데이터는 twitList에 push해서 로컬스토리지에 다시 값을 저장한다.
// 5. circle 정보가 들어있다면 circle에 필요한 값 memberNo와 twitNo를 넣어서 circleGroup에 값을 저장한다.
const saveTwit = ( params : ISaveTwit ) => {
    //twit 정보 저장
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = '[]';
    }
    const twitList = JSON.parse(twitStr);
    let isSaveTwit = false;
    if(params){
        params.twitNo = new Date().getMilliseconds();
        const saveTwitWithoutCircleNo = {
            memberNo : params.memberNo,
            twitNo : params.twitNo,
            registerDate :  new Date(),
            name : params.name,
            image : params.image || undefined,
            content : params.content
        }
        twitList.push(saveTwitWithoutCircleNo);
        localStorage.setItem("twit",JSON.stringify(twitList));
        isSaveTwit = true;
    }
    //circle 정보 저장
    let circleStr = localStorage.getItem("circleGroup");
    if(circleStr === null){
        circleStr = '[]';
    }
    const circleGroup = JSON.parse(circleStr); 
    if(params.circleMemberNo){
        const circle = {
            memberNo : params.circleMemberNo,
            twitNo : params.twitNo
        }
        circleGroup.push(circle);
        localStorage.setItem("circleGroup",JSON.stringify(circleGroup));
    }

    return isSaveTwit;
}

/**
 * 트윗 회원 목록 조회
 */
// 1. 서클을 만들면서 트윗을 조회 할때 필요한 회원의 정보를 보여줘야한다.
// 2. 로컬스토리지의 키가 member인 데이터를 스트링으로 가져와 JSON.parse로 객체 형태로 변환한다.
// 3. 목록에서 회원을 선택할 수 있도록 회원 이름을 보여준다.
const getMemberList = () => { //목록조회는 트윗 시 서클 회원을 보고 넣기위해 필요한 부분이기 때문에 넣어둠 로그인이 되어있는지 체크할 필요는 없음
    let memberStr = localStorage.getItem("member");
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr);
    let memberNameList = [];
    if(memberList.length > 0){
        for(let i = 0; i < memberList.length; i++ ){
            memberNameList.push(memberList[i].name);
        }
    } 

    return memberNameList;
}

/**
 * 트윗 삭제하기 
 */
// 1. 트윗을 삭제할시 함께 저장되고 남겨긴 데이터도 다 삭제를 해주어야한다. (twit, circleGroup, reply)
// 2. twit, circleGroup, reply의 키값으로 되어있는 데이터를 로컬스토리지에서 스트링형태로 가져온다. 
    // JSON.parse로 객체형태로 변환 시켜준다.
// 3. 트윗을 등록한 회원 번호와 삭제하려는 로그인한 회원 번호가 일치하는지를 확인하고 등록된 트윗 번호와 회원이 선택한 트윗 번호가 같은 것을 찾는다.
    // 찾으면 splice 함수를 이용해서 삭제후 break한다.
    // 위 조건에 일치하지 않는다면 트윗작성자가 아니라는 메시지를 보낸다.
// 4. 삭제하려는 트윗번호와 서클그룹에 저장되어있는 트윗번호가 일치하는게 있다면 그것또한 삭제해준다.
// 5. 트윗에 작성되어 저장된 댓글들이 있다면 그것또한 트윗번호와 일치하는지 확인후 삭제해준다.
// 6. 정상적으로 삭제가 되었다면 변경된 데이터들만 다시 로컬스토리지에 셋해준다. 
const deleteTwit = (params : IDeleteTwit) => {
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = "[]"
    }
    const twitList = JSON.parse(twitStr);

    let circleStr = localStorage.getItem("circleGroup");
    if(circleStr === null){
        circleStr = '[]';
    }
    const circleGroup = JSON.parse(circleStr);

    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);

    //트윗 삭제
    let isTwit = false;
    for(let i = 0 ; i < twitList.length ; i ++){
        const twit = twitList[i]
        if(twit.memberNo === params.memberNo && twit.twitNo === params.twitNo){
            twitList.splice(i,1);
            isTwit = true;
            break;
        }    
    }
    if(!isTwit){
        alert("트윗 작성자가 아닙니다.");
    }
    // 관련 서클 삭제
    let isCircle = false;
    if(circleGroup){
        for(let j = circleGroup.length-1 ; j >= 0 ; j --){
            const circle = circleGroup[j]
            if(circle.twitNo === params.twitNo){
                circleGroup.splice(j,1);
                isCircle = true;
            }
        }
    }
    // 관련 댓글 삭제
    let isReply = false;
    if(replyGroup.length > 0){
        for(let k = replyGroup.length-1 ; k >= 0 ; k --){
            const reply = replyGroup[k]
            if(reply.twitNo === params.twitNo){
                replyGroup.splice(k,1);
                isReply = true;
            }
        }
    }
    if(isTwit){
        localStorage.setItem("twit",JSON.stringify(twitList));
    }
    if(isCircle){
        localStorage.setItem("circleGroup",JSON.stringify(circleGroup));
    }
    if(isReply){
        localStorage.setItem("reply",JSON.stringify(replyGroup));
    }
    return isTwit;
}

/**
 * 트윗 상세보기 
 */
// 1. 트윗을 상세보기 하기 위해 필요한 정보를 로컬스토리지에서 가져와서 객체로 변환해준다. (twit, reply)
// 2. twitList안에 있는 twitNo와 상세보기 하려는 twitNo가 같으면 twitDetail에 데이터를 담아준다.
// 3. 또한 작성된 댓글이 있다면 댓글목록 안에 있는 twitNo와 상세보기 하려는 twitNo가 같으면 twitDetail.reply안에 값을 넣어준다.
const getTiwtDetail = (params : ITwitDetailReq) => { // follow가 true가 되어있으면 댓글창을 follow한 사람들만 볼 수있게 해준다.
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = "[]"
    }
    const twitList = JSON.parse(twitStr);

    let twitDetail = {} as ITwitDetail;

    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }

    const replyGroup = JSON.parse(replyStr);

    let likeStr = localStorage.getItem("like");
    if(likeStr === null){
        likeStr = "[]"
    }
    const likeList = JSON.parse(likeStr);

    for(let i = 0 ; i < twitList.length ; i ++){
        const twit = twitList[i]
        if(twit.twitNo === params.twitNo){
            twitDetail = {
                ...twit,
                reply : [],
                isLike : false
            };
        }
    }

    for(let k = 0 ; k < replyGroup.length ; k ++){
        const reply = replyGroup[k]
        if(reply.twitNo === params.twitNo){
            twitDetail.reply.push(reply);
        }
    }

    //좋아요가 존재하는 경우 isLike가 있는 데이터로 가공한다.
    for(let g = 0 ; g < likeList.length ; g ++){
        const like = likeList[g];
        if(params.twitNo === like.twitNo && params.memberNo === like.memberNo ){ // 로그인한 회원과 좋아요 리스트에있는 회원이 같을 떄
            twitDetail.isLike = true;
        }
    }
    
    return twitDetail;
}

/**
 * 트윗 댓글 달기
 */
// 1. 사용자가 단 댓글의 데이터를 가져온다.
// 2. 댓글을 저장할 데이터를 로컬스토리지에서 가져온다.(twit, reply)
// 3. 트윗 목록안에 트윗번호와 댓글 다는 곳 트윗 번호가 같은지 유효성을 체크후 댓글번호와 댓글 생성일자를 넣어서 댓글그룹에 푸쉬해준다.
const replyTwit = (params : IReply) => {
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = "[]"
    }
    const twitList = JSON.parse(twitStr);

    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);

    let isReply = false;

    for(let i = 0 ; i < twitList.length ; i ++){
        const twit = twitList[i]
        if(twit.twitNo === params.twitNo){
            params.replyNo = new Date().getSeconds();
            params.registerDate = new Date().toString();
            replyGroup.push(params);
            isReply = true;
        }
    }

    if(isReply){
        localStorage.setItem('reply',JSON.stringify(replyGroup));
    }

    return replyGroup;
}

/**
 * 댓글 삭제하기
 */
// 1. 댓글을 삭제하려는 회원 번호와 댓글 번호를 받는다.
// 2. reply 키값으로 저장된 로컬스토리지 데이터를 받아서 객체형태로 변환시켜준다.
// 3. 댓글 그룹안의 회원 번호와 params안의 회원번호가 같은지를 확인하고 댓글 번호도 같다면 또는 댓글 번호는 같고 대댓글이 존재한다면 해당하는 댓글을 전체 삭제한다.
// 4. 댓글을 하나만 삭제하고 싶을 수도 있지만 관련 대댓글도 삭제가 되어야하기 때문에 break는 걸지 않는다.
const deleteReply = (params : IDeleteReply) => {
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);
    let isDelete = false;
    for(let i = replyGroup.length-1 ; i >= 0 ; i --){
        const reply = replyGroup[i]
        if((reply.replyNo === params.replyNo && reply.memberNo === params.memberNo) || (reply.replyNo === params.replyNo && reply.nestedReplyNo)){
            replyGroup.splice(i,1);
            isDelete = true;
        }
    }
    if(isDelete){
        localStorage.setItem("reply",JSON.stringify(replyGroup));
    }else {
        alert("댓글 작성자가 아닙니다.")
    }
    return isDelete;
}
/**
 * 트윗 대댓글 달기
 */
// 1. 로컬스토리지에 reply라는 키값을 가진 데이터를 가져온다.
    // 스트링형태의 데이터를 객체형태로 바꿔준다
// 2. replyGroup안에 있는 replyNo와 params로 받은 replyNo가 같다면 대댓글 번호와 등록일자를 생성해서 로컬 스토리지에 다시 저장한다.
const nestedReplyTwit = (params : IReply) => {
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);
    let isNestedReply = false;
    for(let i = 0 ; i < replyGroup.length ; i ++){
        const reply = replyGroup[i]
        if(reply.replyNo === params.replyNo){
            isNestedReply= true;
        }
    }
    if(isNestedReply){
        params.nestedReplyNo = new Date().getMilliseconds();
        params.registerDate = new Date().toString();
        replyGroup.push(params);
        localStorage.setItem("reply",JSON.stringify(replyGroup));
    }
    return isNestedReply;
}

/**
 * 대댓글 삭제하기
 */
// 1. 삭제하려는 대댓글 번호와 회원 번호를 params로 받는다.
// 2. 로컬스토리지의 키값이 reply이 데이터를 가져와서 스트링 형태의 데이터를 객체 형태로 변환시켜준다.
// 3. 댓글그룹에있는 회원 번호와 params로 받은 회원 번호가 같고 대댓글 번호도 같다면 댓글 그룹에서 삭제해준다.
// 4. 같지 않은 경우 댓글 작성자가 아니라는 알림창의 띄워준다.
// 5. 성공적으로 댓글 이 작성이 완료 되었다면 reply라는 키값을 로컬스토리지에 데이터를 다시 넣어준다.
const deleteNestedReply = (params : IDeleteNestedReply) => {
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);
    let isNestedReply = false;
    for(let i = 0 ; i < replyGroup.length ; i ++){
        const reply = replyGroup[i]
        if(reply.memberNo === params.memberNo && reply.nestedReplyNo === params.nestedReplyNo){
            replyGroup.splice(i,1);
            isNestedReply = true;
        }
    }
    if(isNestedReply){
        localStorage.setItem("reply",JSON.stringify(replyGroup))
    }else {
        alert("댓글 작성자가 아닙니다.");
    }
    return isNestedReply;
}

/**
 *  트윗 좋아요 기능
 */
// 1. 로그인한 회원이 좋아요를 눌렀을 때 회원 번호와 트윗 번호가 들어온다.
// 2. 좋아요 목록이 저장되어있는 like라는 키값을 가진 로컬스토리지에서 데이터를 가져와 객체로 변환시켜준다.
// 3. 사용자가 좋아요한 사람들의 목록을 가져와서 좋아요한 정보가 들어있는지 확인한다.
// 4. 사용자의 아이디와 twitNo가 같다면 좋아요가 되어있는 정보이기때문에 목록에서 제거해준다.
// 5. 존재하지 않거나 좋아요 목록에 아무것도 존재하지 않는다면 likeList에 들어온 정보를 push해준다.
// 6. like라는 키값을 가진 로컬스토리지에 데이터를 저장한다.
const likeTwit = (params : ILike) => {// memberNo가 들어오지 않았다면 return해주는 로직 만들기
    let likeStr = localStorage.getItem("like");
    if(likeStr === null){
        likeStr = "[]"
    }
    const likeList = JSON.parse(likeStr);
    let isLike = false;
    // 1. 내가 좋아요 한 사람의 목록을 가져온다.
    for(let i = 0 ; i < likeList.length ; i ++){
        const like = likeList[i];
        // 2. 내가 좋아요 한 정보가 들어있는지 확인한다.
        if(like.twitNo === params.twitNo && like.memberNo === params.memberNo){
            isLike = true;
            // 3. 존재한다면 목록에서 제거한다.
            likeList.splice(i,1);
            break
        }
    }
    // 4. 존재하지 않으면 like 목록에 추가한다.
    if(!isLike){
        likeList.push(params);
    }
    localStorage.setItem("like",JSON.stringify(likeList));
    return isLike;
}

/**
 * 팔로우 기능
 */
// 1. followNo와 followerNo를 받아온다 
// 2. 관련정보가 저장되어있는 키값이 follow인 로컬스토리지에서 정보를 가져와서 객체로 변환시켜준다.
// 3. 사용자가 팔로우 한 사람들이 목록을 가져와서 사용자가 팔로우 목록에 같은 팔로우 , 팔로워로 저장되어있다면 목록에서 제거해준다.
// 4. 목록이 존재하지 않고 사용자와 팔로우 할 사람이 목록에 존재하지 않는다면 목록에 추가해준다.
// 5. follow라는 키값을 가진 로컬스토리지에 다시 저장한다.
// @ params : followNo : '팔로우 할사람', followerNo : '나를 팔로우 한사람 , 현재 로그인한 사용자'  
const followTwit = (params : IFollower) => {
    let followStr = localStorage.getItem("follow");
    if(followStr === null){
        followStr = "[]"
    }
    const follows = JSON.parse(followStr);
    let isFollow = false;
    // 1. 내가 팔로우 한사람 목록 가져온다.
    for(let i = 0 ; i < follows.length ; i ++){
        const follower = follows[i];
        // 2. 내가 팔로우 할 사람이 존재하는지 확인.
        if(follower.followerNo === params.followerNo && follower.followNo === params.followNo){
            isFollow = true;
            // 3. 내가 팔로우 할 사람이 존재하면 팔로우 취소.
            follows.splice(i,1);
            break;
        }
    }
    // 4. 내가 팔로우 할 사람이 존재하지 않으면 팔로우.
    if ( !isFollow ) {
        follows.push(params);
    }
    localStorage.setItem("follow",JSON.stringify(follows));

    return isFollow;
}

/**
 * 리트윗
 */
// 1. 서클에 포함되어있는 트윗은 리트위시킬수 없다 // 조회가능 트윗에 서클이 포함되어있다면 프론트단에서 리트윗 버튼 없애기
// 2. 리트윗 시킬때는 댓글과 조회 제한은 걸수 없다
// 3. params에 저장시키는 트윗 + retwitNo를 받아온다. 
// 4. twit이라는 키값을 가진 데이터를 로컬스토리지에서 가져와서 객체로 변환시킨다.
// 5. 받아온 params에 twitNo와 등록일자를 생성하여 retwitNo와 함께 같이 twit에 저장한다.
const saveRetwit = (params : IRetwit) => {
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = "[]"
    }
    const twitList = JSON.parse(twitStr);

    params.twitNo = new Date().getMilliseconds();
    params.registerDate = new Date().toString();
    twitList.push(params);
    localStorage.setItem("twit",JSON.stringify(twitList));
}
/**
 * 트랜드 검색어 기능
 */
// 1. 검색된 내용의 단어를 받아서 trend라는 키값의 로컬스토리지에 담는다. 
    // 키값이 trend라는 데이터를 로컬 스토리지에서 가져온다.
    // 가져온 스트링형태의 데이터를 JSON.parse로 객체형태로 만들어준다.
    // 받아온 검색어를 객체형태의 trend에 담는다.
// 2. 로컬스토리지에 담을때 같은 단어가 존재하면 count를 하나씩 올려준다.
    // trend에 담을 때 같은 단어가 존재하면(trim사용) 단어에 count를 하나씩 올려준다. 
// 3. 검색된 내용의 단어중 가장 많이 검색이 되었던 단어 5개를 순서대로 목록으로 나타내준다.
    // count가 가장 큰 순서대로 5개만 변수에 담아 return한다. (검색어만)
    // 검색 키워드가 담긴 trend는 다시 로컬스토리지에 스트링형태로 저장시킨다.
// 검색한 단어들을 로컬스토리지에 저장한다 근데 twit 내용에 관련 단어가 존재하지 않는다면 return 시킨다.
const trendKeyword = (param : ITrendKeyword) => {// 프론트단에서 키워드가 안들어오면 return하는 부분을 만들어 준다.

    let keywordStr = localStorage.getItem("trend");
    if(keywordStr === null ) {
        keywordStr = "[]"
    } 
    const keywords = JSON.parse(keywordStr);
    
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null ) {
        twitStr = "[]"
    } 
    const twitList = JSON.parse(twitStr);
    
    let isKeyword = false;
    const keyword = param.keyword.replace(/ /g,"");// / /공백의 g모든 곳을 ""비게한다.
    const keywordList = [] as ITrendKeyword[];

    // 키워즈에 저장된 데이터가 여러개 일때
    for(let i = 0 ; i < keywords.length ; i ++){
        const word = keywords[i]
        for(let g = 0 ; g < twitList.length ; g ++) {
            const twitsContent = twitList[g].content.replace(/ /g,"");
            if(keyword === word.keyword && twitsContent.includes(keyword)){
                word.count += 1;
                isKeyword = true;
                break;
            }
        }
    }
    // 키워즈에 저장 데이터가 존재하지 않을 때
    if(!isKeyword){
        const keywordNCount = {
            keyword : keyword,
            count : 1
        }
        for(let g = 0 ; g < twitList.length ; g ++) {
            const twitsContent = twitList[g].content.replace(/ /g,"");
            if(twitsContent.includes(keyword) && !keywords.includes(keywordNCount)){
                keywords.push(keywordNCount);
            }    
        }
    }
    keywords.sort(function(a : any,b : any) {
        return b.count - a.count || b.keyword.localeCompare(a.keyword);//localeCompare 문자열 비교
    })
    for(let k = 0 ; k < 5 ; k ++) {
        const word = keywords[k]
        if(word !== undefined){
        keywordList.push(word.keyword);
        }
    }
    localStorage.setItem("trend",JSON.stringify(keywords));
    return keywordList;
}

/**
 * 공유하기 web share api 활용 또는 카카오
 */

export const twitService = {
    getTwitList,
    getMemberList,
    saveTwit,
    deleteTwit,
    getTiwtDetail,
    replyTwit,
    deleteReply,
    nestedReplyTwit,
    likeTwit,
    deleteNestedReply,
    followTwit,
    saveRetwit,
    trendKeyword
}