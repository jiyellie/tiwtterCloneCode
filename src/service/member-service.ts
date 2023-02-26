import { Member } from "../intefaces/model/member";
import { ILogin, IMember } from "../intefaces/service/member";

/**
 * 회원가입
 */
// 1. 회원 정보 입력을 받아서 정보를 가져와야 한다. (localstorage에 member라는 이름으로 회원정보를 저장한다.)
// 2. 아이디의 중복이 있는 지 체크 한다. 
// 3. 중복된 아이디가 없다면 데이터를 저장한다. 
const joinTwit = (param: IMember) => {
    let memberStr = localStorage.getItem("member");
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr);
    let isJoin = true;
    if(memberList.length > 0){
        memberList.map((item : any) => (
            item.no === param.no ? isJoin = false : item.no
        ) );
        // for(let i = 0; i < memberList.length; i++ ){
        //     const existingMember = memberList[i].no === param.no;
        //     if(existingMember){
        //         alert("이미 아이디를 사용중인 사용자가 있습니다.\n다시 입력 바랍니다.");
        //         isJoin = false;
        //         return;
        //     }
        // }
    }
    // else if(memberList.length === 0){
    //     isJoin = true;
    // }
    if(!isJoin){
        alert("이미 아이디를 사용중인 사용자가 있습니다.\n다시 입력 바랍니다.");
        return isJoin;
    }

    memberList.push(param);
    localStorage.setItem("member",JSON.stringify(memberList));
    return isJoin;
} 

/**
 * 회원 정보 조회
 */
// 1. 멤버 정보를 가져온다.
// 2. 회원번호에 맞는 조회 정보를 보여준다.
const getMember = (no : number): Member | undefined =>{
    let memberStr = localStorage.getItem("member") as string;
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr) as Member[];
    // let member = undefined;
    if(memberList.length < 0) {
        alert('요청하신 정보가 없습니다.')
        return;
    }
    // if(memberList.length > 0){
        const member = memberList.find((item)=> (item.no===no ? item : alert('조회 정보가 없습니다.')));
        // for(let i = 0; i < memberList.length; i++){
        //     if(memberList[i].no === no){
        //         member = memberList[0];
        //     }
        // }
    // }
    return member;
}

/**
 * 로그인
 */
// 1. 사용자가 로그인 입력란에 입력한 값을 받는다.
// 2. 회원 정보에 그에 맞는 아이디와 비밀번호가 존재하는지 확인한다.
    // 로컬스토리지에 키값이 member인 데이터를 가져와서 객체로 변환시켜준다.
    // 변환된 멤버 객체를 가지고 for문을 통해서 가져온 데이터에 값이 있는지 확인한다
    // 있으면 login이라는 키값을 가진 로컬스토리지에 저장 시킨다.
    // 없으면 존재하지 않는 아이디 비밀번호라는 alert창을 띄어준다.
const loginTwit = (loginData : ILogin) => { //로그아웃은 버튼 누르면 키값이 login인 곳에 해당 no를 삭제해 줄거임
    let memberStr = localStorage.getItem("member");
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr);

    let loginInfo;
    // 로그인의 성공여부를 체크해줌
    let isLogin = false;
    if(memberList.length > 0){ //회원 정보가 있을 경우 순회한다
        for(let i = 0; i < memberList.length; i++ ){
            const member = memberList[i]
            if( member.no === loginData.no){ // 회원번호가 일치하는 경우
                if(member.password === loginData.password){ // 비밀번호가 일치하는 경우 
                    loginInfo = member.no;
                    isLogin = true;
                }
            }
        }
    }
    if(isLogin){// 정보가 다 일치해서 로그인이 가능한 경우
        localStorage.setItem("loginInfo",JSON.stringify(loginInfo));
    }else{// isLogin이 false여서 로그인이 가능하지 않은 경우
        alert("회원정보가 일치하지 않습니다.");
    }
    return isLogin;
}

/**
 * 회원 정보 수정
 */
// 1. 회원정보를 가져온다 가져온 정보가 null일 시 빈 배열 스트링 형태로 memberStr를 정의 해준다.
// 2. 스트링 정보를 json.parse를 통해서 객체 형태로 변화나 시킨다.
// 3. 받은 수정 데이터와 기존 데이터를 비교하여 같은 회원 번호를 가진 데이터에 수정 데이터의 값을 넣어준다.
// 4. 수정 데이터를 넣은 회원 정보를 다시 로컬스토리지에 덮어쓰기를 해준다.
const updateMember = (modifyData : IMember) => {
    let memberStr = localStorage.getItem("member");
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr);
    
    let isUpdate = false
    if(memberList.length > 0){
        for(let i = 0; i < memberList.length; i++ ){
            const member = memberList[i];
            if( member.no === modifyData.no){ // 회원번호가 일치하는 경우
                memberList[i] = modifyData;
                isUpdate = true;
            }
        }
    }
    if(isUpdate){
        localStorage.setItem("member",JSON.stringify(memberList));
    }
    return isUpdate;
}


/**
 * 회원 정보 삭제
 */
// 1. 삭제하려는 회원 번호를 받아온다
// 2. 회원 정보를 키가 member인 로컬 스토리지에서 가져온다. // null이면 빈배열의 스트링형태로 가져온다.
// 3. 스트링으로 가져온 데이터를 json.parse을 통해서 객체 형태로 만들어준다.
// 4. indexOf를 통해서 회원 번호에 해당하는 객체의 인덱스를 indexOfValue라는 변수에 저장한다.
// 5. 회원 정보에서 indexOfValue에 저장된 인덱스에서 하나만 splice함수를 통해서 지워준다.
// 6. 회원 정보가 지원진 memberList를 다시 member라는 키값을 가진 로컬스토리지에 셋해준다.
const deleteMember = (no : number) => {
    let memberStr = localStorage.getItem("member");
    if(memberStr === null){
        memberStr = '[]';
    }
    const memberList = JSON.parse(memberStr);

    let circleStr = localStorage.getItem("circleGroup");
    if(circleStr === null){
        circleStr = '[]';
    }
    const circleList = JSON.parse(circleStr);

    let twitStr = localStorage.getItem("twit");
    if(twitStr === null){
        twitStr = '[]';
    }
    const twitList = JSON.parse(twitStr);

    let replyStr = localStorage.getItem("reply");
    if(replyStr === null){
        replyStr = '[]';
    }
    const replyList = JSON.parse(replyStr);

    let isDeleteMember = false; 
    if(memberList.length > 0){
        for(let i = 0; i < memberList.length; i++ ){
            const member = memberList[i];
            if( member.no === no){ // 회원번호가 일치하는 경우
                memberList.splice(i, 1);
                isDeleteMember = logoutTwit(no);
                break;
            }
        }
    }
    let isDeleteTwit = false
    for(let k = circleList.length-1 ; k >= 0  ; k --) {
        const circle = circleList[k];
        if(circle.no === no){
            circleList.splice(k, 1);
            isDeleteTwit = true
        }
    }
    for(let g = replyList.length-1 ; g >= 0  ; g --){
        const reply = replyList[g]
        if(reply.no === no){
            replyList.splice(g, 1);
            isDeleteTwit = true
        }
    }
    for(let l = twitList.length-1 ; l >= 0  ; l --){
        const twit = twitList[l]
        if(twit.no === no){
            twitList.splice(l, 1);
            isDeleteTwit = true
        }
    }
    if(isDeleteMember){
        localStorage.setItem("member",JSON.stringify(memberList));
    }
    if(isDeleteTwit) {
        localStorage.setItem("circleGroup",JSON.stringify(circleList));
        localStorage.setItem("reply",JSON.stringify(replyList));
        localStorage.setItem("twit",JSON.stringify(twitList));
    }
    return isDeleteMember;
}

/**
 * 로그아웃
 */
// 1. 로그아웃을 하려는 회원 번호를 받아온다
// 2. 로컬스토리지에 loginInfo의 키값으로 저장되어있는 스트링을 가져온다.
// 3. 스트링을 JSON.parse로 객체형태로 변환 시켜준다.
// 4. 로그인 이력을 지우기 위해 indexOf로 loginMember에 no 값으로 저장된 데이터의 인덱스를 반환한다.
// 5. splice를 통해서 number의 index에서 하나를 지우고 다시 loginInfo라는 키값으로 스트링으로 변환하여 저장한다.
const logoutTwit = (no : number) => {
    let loginStr = localStorage.getItem("loginInfo");
    
    let isLogout = false;

    if(loginStr === no.toString()){
        localStorage.removeItem("loginInfo");
        isLogout = true
    }
    return isLogout

}

export const memberService = {
    joinTwit,
    getMember,
    loginTwit,
    updateMember,
    deleteMember,
    logoutTwit
}