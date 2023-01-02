import { IDeleteNestedReply, IDeleteReply, IDeleteTwit, ITwitList, IFollower, ILike, IReply, IRetwit, ISaveTwit, ITwitLoginInfo, ITwitDetail, ITrendKeyword } from "../intefaces/service/twit";

/**
 * 트윗 목록 조회 
 */
// 1. 로컬스토리지에 키값이 twit인 목록을 조회해 온다.
// 2. 스트링 타입으로 받아온 twit데이터를 json.parse를 통해서 객체 형태로 변환 시킨다.
// 3. 로그인이 되어있으면 param에 로그이 회원 번호가 들어온다. 회원 번호가 들어오면 트윗이 여러개 인 경우 모든 사람으로 선택된 트윗과
    // 서클로 선택 되어 있는 트윗 목록을 if문과 for문의 조건을 통해 getTwits에 push해준다.
// 4. 로그인을 하지 않은 경우 param에 회원 번호가 undefined로 들어오게 되고 트윗이 여러개 인 경우 모든 사람으로 선택된 트윗만을 
    // 보여질 수 있게끔 getTwits에 담아준다.
// 5. 트윗이 존재하지 않은 경우에는 alert를 통해서 조회 가능한 트윗이 존재하지 않는다는 메세지를 띄어준다.
const getTwitList = (param : ITwitLoginInfo) => {
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = '[]';
    }
    const twitList = JSON.parse(twitStr);

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
    for(var p = 0 ;p < circleGroup.length ; p ++){
        circleNumbers.push(circleGroup[p].twitNo);
    }
    // 트윗 조회를 여러명이서 하는 경우와 서클회원만 가능하게 한 경우를 확인하여 목록에 담는다.
    if(twitList.length > 0){ //트윗이 여러개인 경우
        for(var i =0;i < twitList.length ; i ++){
            const twits = twitList[i]
            for(var j = 0; j < circleGroup.length;j++){
                const circles = circleGroup[j]
                if(twits.twitNo === circles.twitNo){ // 서클에 트윗 번호가 있어서 서클을 선택한 사람
                    for(var k = 0 ; k < circles.memberNo.length ; k ++){
                        if(circles.memberNo[k] === param.no){// 서클에 선택된 회원과 로그인한 회원이 있을 때 
                            resTwitList.push(twits);
                        }
                    }
                }
            // 받아온 서클 번호에 트윗번호가 존재하지 않는것을 resTwitList에 넣어준다.
            }if(!circleNumbers.includes(twits.twitNo)){
                resTwitList.push(twits);
            }
        }
    } else {
        alert("조회 가능한 트윗이 존재하지 않습니다.");
    }

    
    // 좋아요가 존재하는 경우 isLike가 있는 데이터로 가공한다.
    for(var g = 0 ; g < likeList.length ; g ++){
        const likes = likeList[g];
        if(param.no === likes.memberNo){ // 로그인한 회원과 좋아요 리스트에있는 회원이 같을 떄
            for(var l = 0 ; l < resTwitList.length ; l ++ ){ // 담은 목록안의 트윗번호와 좋아요 리스트안의 트윗 번호를 비교하여 같으면 isLike에 값을 넣는다.
                const response = resTwitList[l]
                if(response.twitNo === likes.twitNo){
                    response.isLike = true;
                }
            }
        }
    }

    // twitList 안에 retwit이 있는 경우
    for(var o = 0 ; o < resTwitList.length ; o ++){
        for(var y = 0 ; y < twitList.length ; y ++){
            if(resTwitList[o].retwitNo && resTwitList[o].retwitNo === twitList[y].twitNo){
                resTwitList[o].retwit = twitList[y];
            }
        }       
    }
    
    
   
    return resTwitList;
}

/**
 * 트윗 저장
 */
// 1. 사용자가 저장하고자 하는 정보를 받아온다.
// 2. 로컬스토리지의 키가 twit인 데이터를 스트링으로 가져와서 JSON.parse로 객체 형태로 변환시켜준다.
// 3. registerDate의 등록 날짜에 date 넣어주고 트윗번호는 milliseconds로 유니크한 값을 넣어준 후 twitList에 push해준다.
// 4. twitList를 twit이라는 키값을 가진 로컬스토리지에 스트링으로 셋해준다.
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
        const saveTwit = {
            no : params.no,
            twitNo : params.twitNo,
            registerDate :  new Date(),
            name : params.name,
            image : params.image || undefined,
            content : params.content
        }
        twitList.push(saveTwit);
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
const getMemberList = () => { //목록조회는 트윗 시 필요한 부분이기 때문에 나눈거임 로그인이 되어있는지 체크할 필요는 없음
    let memberStr = localStorage.getItem("member");
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr);
    let memberNameList = [];
    if(memberList.length > 0){
        for(var i = 0; i < memberList.length; i++ ){
            memberNameList.push(memberList[i].name);
        }
    } 

    return memberNameList;
}

/**
 * 트윗 삭제하기 
 */
// 1. 로컬스토리지에 키값이 twit인 트윗 정보를 스트링으로 가져온다.
// 2. 가져온 스트링타입을 JSON.parse를 통해 객체 형태로 만들어준다.
// 3. 사용자가 삭제하려는 트윗번호를 받아와서 for문을 통해 삭제하려는 트윗번호와 같은 twitList를 찾는다.
// 4. 찾은 트윗 번호를 splice를 통해서 해당 인덱스에서 한 개만 삭제하게 한 뒤 로컬스토리지로 덮어쓰기 할 수 있도록 isTwit값을 true로 설정해 준다.
// 5. 다시 로컬스토리지에 스트링 타입의 키값은 twit으로 덮어쓰기를 해준다.
const deleteTwit = (params : IDeleteTwit) => {
    //트윗 삭제
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = "[]"
    }
    const twitList = JSON.parse(twitStr);

    // 관련 서클 삭제
    let circleStr = localStorage.getItem("circleGroup");
    if(circleStr === null){
        circleStr = '[]';
    }
    const circleGroup = JSON.parse(circleStr);

    // 관련 댓글 삭제
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);

    let isTwit = false;
    for(var i = 0 ; i < twitList.length ; i ++){
        if(twitList[i].no === params.no){
            if(twitList[i].twitNo === params.twitNo){
                twitList.splice(i,1);
                isTwit = true;
            }
        }else {
            alert("트윗 작성자가 아닙니다.");
            return false;
        }    
    }
    let isCircle = false;
    if(circleGroup){
        for(var j = 0 ; j < circleGroup.length ; j ++){
            if(circleGroup[j].twitNo === params.twitNo){
                circleGroup.splice(j,1);
                isCircle = true;
            }
        }
    }
    let isReply = false;
    if(replyGroup.length > 0){
        // 배열안에서 여러 요소 제거시 정for문을 사용하면 원본 데이터를 이용하여 for문을 돌기 때문에 중간에 건너뛰는 방식으로 될수 있다
        // 역for문을 이용하여 배열안에 여러 요소들을 제거하자
        for(var k = replyGroup.length-1 ; k >= 0 ; k --){
            if(replyGroup[k].twitNo === params.twitNo){
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
// 1. 로컬스토리지에 키값이 twit인 트윗정보를 스트링으로 가져온 뒤 JSON.parse를 통해 객체 형태로 변환해준다.
// 2. 받아온 twitNo를 for문을 통해 twitList안에 있는 목록들과 비교한 뒤 두 번호가 같은 twit을 보내준다.
// 3. 상세보기 할 때 보여줄 댓글그룹을 가져와서 관련 트윗번호가 있다면 트윗번호에 해당하는 댓글들을 같이 보내준다.
// 4. twitDetail이라는 곳에 트윗과 reply가 각각 담기게 된다 (가져온 twitList에 푸쉬해서 같이 가져오고 싶지만 그러면 너무 타고타고 들어가야함)
const getTiwtDetail = (twitNo : number) => { // follow가 true가 되어있으면 댓글창을 follow한 사람들만 볼 수있게 해준다.
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

    for(var i = 0 ; i < twitList.length ; i ++){
        if(twitList[i].twitNo === twitNo){
            twitDetail = {
                ...twitList[i],
                reply : []    
            };
        }
    }

    for(var k = 0 ; k < replyGroup.length ; k ++){
        if(replyGroup[k].twitNo === twitNo){
            twitDetail.reply.push(replyGroup[k]);
        }
        
    }
    
    return twitDetail;
}

/**
 * 트윗 댓글 달기
 */
// 1. 댓글 다는 트윗의 트윗 번호와 작성된 댓글과 내용을 받아온다.
// 2. 로컬스토리지에 reply라는 키값으로 데이터를 받아온다.
// 3. 받아온 스트링타입의 데이터가 null 이라면 "[]"로 값을 넣어준 후 JSON.parse로 객체 형태로 만들어준다.
// 4. 새로 작성된 정보들을 트윗번호와 맞는지 확인 후 댓글 번호와 댓글 생성일자를 생성한다. 
// 5. twitList.reply안에 받아온 reply 정보를 넣고 reply라는 키값을 가진 로컬스토리지에 값을 넣어준다.
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

    for(var i = 0 ; i < twitList.length ; i ++){
        if(twitList[i].twitNo === params.twitNo){
            params.replyNo = new Date().getSeconds();
            params.registerDate = new Date();
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
// 1. reply라는 키값으로 저장되어있는 댓글들을 스트링 타입으로 가져온다음 null이면 "[]"로 초기화 해준다.
// 2. 스트링 형식으로 가져온 데이터를 JSON.parse를 통해 객체 형식으로 변환 시켜준다.
// 3. 삭제하기 위해 받아온 댓글 번호를 객체 형식으로 변환 시켜준 데이터의 댓글번호와 비교한 뒤 맞으면 splice함수를 통해 제거해준다.
// 4. 제거후 다시 스트링 타입으로 키값은 reply로 저장시킨다.  
const deleteReply = (params : IDeleteReply) => {
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);
    let isDelete = false;
    for(var i = replyGroup.length-1 ; i >= 0 ; i --){
        if(replyGroup[i].no === params.no){
            if(replyGroup[i].replyNo === params.replyNo){
                replyGroup.splice(i,1);
                isDelete = true;
            }
        }else {
            alert("댓글 작성자가 아닙니다.")
        }
    }
    if(isDelete){
        localStorage.setItem("reply",JSON.stringify(replyGroup));
    }
    return isDelete;
}
/**
 * 트윗 대댓글 달기
 */
// 1. 로컬스토리지에 twit이라는 키값을 가진 정보를 가져온다. 스트링형태의 정보를 JSON.parse로 객체형태로 변환 해준다.
// 2. 대댓글 단 정보를 가져온다. 트윗번호, 대댓글 단 댓글의 번호와 대댓글 정보들을 가져온다.
// 3. reply라는 키값으로 데이터를 가져와서 대댓글 정보로 받은 댓글 번호와 비교후 맞으면 댓글 안에 대댓글을 넣어준다.
// 4. 그후 다시 reply라는 키값으로 로컬스토리지에 정보를 셋해준다.
const nestedReplyTwit = (params : IReply) => {
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);
    let isNestedReply = false;
    for(var i = 0 ; i < replyGroup.length ; i ++){
        if(replyGroup[i].replyNo === params.replyNo){
            isNestedReply= true;
        }
    }
    if(isNestedReply){
        params.nestedReplyNo = new Date().getMilliseconds();
        params.registerDate = new Date();
        replyGroup.push(params);
        localStorage.setItem("reply",JSON.stringify(replyGroup));
    }
    return isNestedReply;
}

/**
 * 대댓글 삭제하기
 */
// 1. 삭제하려는 대댓글 번호를 받아옵니다.
// 2. 키값이 reply인 스트링타입의 데이터를 로컬 스토리지에서 받아와서 JSON.parse로 객체로 변환시켜줍니다.
// 3. 변환된 객체를 for문을 통해 받아온 대댓글 번호와 같은 데이터를 splice를 통해 삭제후 다시 로컬스토리지에 셋해줍니다.
const deleteNestedReply = (params : IDeleteNestedReply) => {
    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = "[]"
    }
    const replyGroup = JSON.parse(replyStr);
    let isNestedReply = false;
    for(var i = 0 ; i < replyGroup.length ; i ++){
        if(replyGroup[i].no === params.no){
            if(replyGroup[i].nestedReplyNo === params.nestedReplyNo){
                replyGroup.splice(i,1);
                isNestedReply = true;
            }else {
                alert("댓글 작성자가 아닙니다.");
            }
        }
    }
    if(isNestedReply){
        localStorage.setItem("reply",JSON.stringify(replyGroup))
    }
    return isNestedReply;
}

/**
 *  트윗 좋아요 기능
 */
// 1. 로그인한 회원이 좋아요 버튼을 눌렀을 때 twitNo no islike 가 들어온다.
// 2. 로컬스토리지의 키값이 like인 곳에 트윗 번호와 함께 좋아요를 누른 사람들을 저장한다.
const likeTwit = (params : ILike) => {// like가 true인 상태로 넘어옴
    let likeStr = localStorage.getItem("like");
    if(likeStr === null){
        likeStr = "[]"
    }
    const likeList = JSON.parse(likeStr);
    let isLike = false;
    // 1. 내가 좋아요 한 사람의 목록을 가져온다.
    for(var i = 0 ; i < likeList.length ; i ++){
        const likes = likeList[i];
        // 2. 내가 좋아요 한 정보가 들어있는지 확인한다.
        if(likes.twitNo === params.twitNo && likes.memberNo === params.memberNo){
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
// 1. 버튼을 누른 상대방의 정보를 받는다.
// 2. 팔로워 = 팔로우를 당하는 사람 / 팔로우 = 버튼을 누른 사람 으로 저장해서 
// 3. 댓글을 쓸때 팔로워하 사람들만 선택하면 글쓴리를 FOLLOW한 사람만 긁어서 정보를 주면 됨  
// @ params : followNo : '팔로우 할사람', followerNo : '나를 팔로우 한사람 , 현재 로그인한 사용자'  
const followTwit = (params : IFollower) => {
    let followStr = localStorage.getItem("follow");
    if(followStr === null){
        followStr = "[]"
    }
    const followers = JSON.parse(followStr);
    let isFollow = false;
    // 1. 내가 팔로우 한사람 목록 가져온다.
    for(let i = 0 ; i < followers.length ; i ++){
        const follower = followers[i];
        // 2. 내가 팔로우 할 사람이 존재하는지 확인.
        if(follower.followerNo === params.followerNo && follower.followNo === params.followNo){
            isFollow = true;
            // 3. 내가 팔로우 할 사람이 존재하면 팔로우 취소.
            followers.splice(i,1);
            break;
        }
    }
    // 4. 내가 팔로우 할 사람이 존재하지 않으면 팔로우.
    if ( !isFollow ) {
        followers.push(params);
    }
    localStorage.setItem("follow",JSON.stringify(followers));

    return isFollow;
}

/**
 * 리트윗
 */
// 1. 리트윗 시 내가 저장한 정보들도 저장이 되어야한다. 
// 2. 리트윗 번호와 내가 트윗하려는 번호와 내용도 새로 넣어서 저장한다
// 3. 목록조회 시 리트윗이 되어있으면 그 트윗안에 트윗이 있도록 해야한다.
// 4. 저장은 트윗에 저장시키되 retwitNo를 붙여서 어떤걸 리트윗 하려는지 번호를 넣어준다.
const saveRetwit = (params : IRetwit) => {
    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = "[]"
    }
    const twitList = JSON.parse(twitStr);
    params.twitNo = new Date().getMilliseconds();
    params.registerDate = new Date();
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
const trendKeyword = (param : ITrendKeyword) => {
    if(!param.keyword){
        return;
    }

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
    for(var i = 0 ; i < keywords.length ; i ++){
        for(var g = 0 ; g < twitList.length ; g ++) {
            const twitsContent = twitList[g].content.replace(/ /g,"");
            if(keyword === keywords[i].keyword && twitsContent.includes(keyword)){
                keywords[i].count += 1;
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
        for(var g = 0 ; g < twitList.length ; g ++) {
            const twitsContent = twitList[g].content.replace(/ /g,"");
            if(twitsContent.includes(keyword) && !keywords.includes(keywordNCount)){
                keywords.push(keywordNCount);
            }    
        }
    }
    keywords.sort(function(a : any,b : any) {
        return b.count - a.count || b.keyword.localeCompare(a.keyword);//localeCompare 문자열 비교
    })
    for(var k = 0 ; k < 5 ; k ++) {
        if(keywords[k] !== undefined){
        keywordList.push(keywords[k].keyword);
        console.log(keywordList);
        
        }
    }
    localStorage.setItem("trend",JSON.stringify(keywords));
    return keywordList;
}


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