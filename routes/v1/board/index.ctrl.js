import passport from 'passport';
import {
  select,
  insert,
  update
} from '~/db/query';


// 지역 매핑용
let locationTable = {
  "1": "서울",
  "2": "부산",
  "3": "대구",
  "4": "인천",
  "5": "대전",
  "6": "광주",
  "7": "울산",
  "8": "세종",
  "9": "강원도",
  "10": "경기도",
  "11": "충청남도",
  "12": "전라북도",
  "13": "전라남도",
  "14": "경상북도",
  "15": "경상남도",
  "16": "제주도"
}


export const list = async (req, res) => {

  // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
  passport.deserializeUser((user, done) => {
    console.log('deserialize', user);
    done(null, user);
  });

  let userInfo = {};

  try {
    const list = await select('*', 'board', `locations = '${req.params.location}'`);
    for (let row in list.rows) {
      // 임시 변수
      let memberInfo = await select('usernum, nickname, blood, profile', 'member', `usernum = ${list.rows[row].author}`);
      memberInfo = memberInfo.rows[0];
      userInfo[list.rows[row].author] = {
        "nicknmemberInfoame": memberInfo.nickname,
        "blood": memberInfo.blood,
        "profile": memberInfo.profile,
      }
    }
    // console.log(list.rows);
    res.render('board/list', {
      list: list.rows,
      user: userInfo,
      location: locationTable[req.params.location],
    });
  } catch (err) {
    console.log(err);
  }
};

export const listAll = async (req, res) => {

  // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
  passport.deserializeUser((user, done) => {
    console.log("deserialize",user);
    done(null, user);
  });

  let userInfo = {};
  try {
    // console.log(typeof req.params.location);
    const list = await select('*', 'board', 'TRUE');
    for (let row in list.rows) {
      // 임시 변수
      let memberInfo = await select('usernum, nickname, blood, profile', 'member', `usernum = ${list.rows[row].author}`);
      memberInfo = memberInfo.rows[0];
      userInfo[list.rows[row].author] = {
        "nicknmemberInfoame": memberInfo.nickname,
        "blood": memberInfo.blood,
        "profile": memberInfo.profile,
      }
    }
    // console.log(list.rows);
    res.render('board/listAll', {
      list: list.rows,
      user: userInfo,
      location: locationTable
    });
  } catch (err) {
    console.log(err);
  }
};



export const read = (req, res) => {
  res.render('board/read');
};

export const search = (req, res) => {
  res.render('board/search');
};

export const write = (req, res) => {
  res.render('board/write');
};