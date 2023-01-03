export interface ITwitLoginInfo {
    memberNo? : number , // 로그인한 회원 번호
    keyword? : string
}

export interface ITwit {
    memberNo : number, // 회원 번호
    twitNo? : number, // 게시글 번호
    name :  string // 회원명
    image : string, // 이미지 또는 동영상
    content : string, // 내용
    registerDate? : string, // 게시일
}

export interface ISaveTwit {
    memberNo : number, // 회원 번호
    twitNo? : number, // 게시글 번호
    circleMemberNo? : number[],
    name :  string // 회원명
    image : string, // 이미지 또는 동영상
    content : string, // 내용
    registerDate? : string, // 게시일
    follow? : boolean // follow한 사람들만 댓글 가능도록 선택
}

export interface IDeleteTwit {
    memberNo? : number, // 로그인한 회원 번호
    twitNo : number // 삭제하려는 트윗 번호
}

export interface IReply {
    twitNo : number, // 게시글 번호
    nestedReplyNo? : number, // 대댓글 번호
    replyNo? : number, // 댓글 번호
    memberNo : number  // 댓글 작성한 회원 번호
    name : string, // 댓글 작성자
    content : string, // 댓글 내용
    registerDate? : string, // 댓글 작성일
    image? : string, // 댓글에서 올린 사진
}

export interface IDeleteReply {
    memberNo? : number, // 로그인한 회원 번호
    replyNo : number // 삭제하려는 트윗 번호
}

export interface ICircle {
    twitNo? : number, //트윗 번호
    memberNo : number[] // 회원 번호
}

export interface INestedReply {
    replyNo :  number, // 대댓글 달려는 부모 댓글 번호
    nestedReplyNo? : number, // 대댓글 번호
    content : string, // 대댓글 내용
    name : string, // 대댓글 작성자
    registerDate? :  string // 대댓글 작성일
    image? :  string // 대댓글 사진
}

export interface IDeleteNestedReply {
    memberNo? : number, // 댓글 번호
    nestedReplyNo : number // 대댓글 번호
}

export interface ILike {
    twitNo : number, // 트윗번호
    memberNo? : number, // 좋아요 버튼을 누른 로그인 회원
}

export interface IFollower {
    followNo : number, // 팔로우한 회원 번호
    followerNo :  number // 팔로워한 회원 번호
}

export interface ITwitList {
    memberNo : number, // 회원 번호
    twitNo? : number, // 게시글 번호
    name :  string // 회원명
    image : string, // 이미지 또는 동영상
    content : string, // 내용
    registerDate? : string, // 게시일
    isLike : boolean, // 좋아요
    retwitNo : number,
    retwit : ITwit 
}

export interface ITwitDetail {
    memberNo : number, // 회원 번호
    twitNo : number, // 게시글 번호
    name :  string // 회원명
    image? : string, // 이미지 또는 동영상
    content : string, // 내용
    registerDate : string, // 게시일
    reply : IReply[]
}

export interface IRetwit {
    memberNo : number, // 회원 번호
    twitNo? : number, // 게시글 번호
    name :  string // 회원명
    image? : string, // 이미지 또는 동영상
    content : string, // 내용
    registerDate? : string, // 게시일
    retwitNo : number //리트윗하려는 게시글의 번호
}

export interface ITrendKeyword {
    keyword : string
}