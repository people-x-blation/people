import { findOne } from '~/db/query';
import { select, update, signupUpdate } from '../../../db/query';

export const successLogin = async (req, res) => {
  console.log('success');
  const rurl = req.query.redirectUrl || req.session.redirectUrl;
  console.log('rurl', rurl);
  res.redirect(rurl || '/');
};

export const login = async (req, res) => {
  console.log('login', req.url);
  const email = req.user._json.kaccount_email;
  const result = await findOne(email);
  const data = result.rows[0];
  console.log(data);
  //nickname 설정 안되어있으면 회원가입폼
  if (data.nickname == '') {
    res.render('auth/signup', { status: true, email: email });
  } else {
    console.log('login callback');
    console.log(req.session.redirectUrl);
    res.redirect('/auth/kakao/success');
  }
};

export const register = async (req, res) => {
  const user_input = {
    email: req.body.email,
    nickname: req.body.nickname,
    phone: req.body.phone,
    blood: req.body.blood,
  };
  try {
    const update_member = await signupUpdate(user_input);
    res.redirect('../auth/mypage');
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (req, res) => {
  req.logout();
  console.log(req.session);
  res.redirect('/');
};

export const mypage = async (req, res) => {
  const kakao_info = JSON.parse(req.session.passport.user._raw);
  const member_db = await select(
    'usernum, id, nickname, blood, phone, email',
    'member',
    `email = '${kakao_info.kaccount_email}'`,
  );
  const board_db = await select(
    'boardnum, title, like_count, create_at, show_flag, locations, hospital, contents',
    'board',
    `author = ${member_db.rows[0].usernum}`,
  );

  res.render('auth/mypage', {
    kakao_info: kakao_info,
    member_db: member_db.rows[0],
    board_db: board_db.rows,
  });
};

// {
//   "kaccount_email":"dawnst1128@naver.com",
// "kaccount_email_verified":true,
// "id":1143821603,
// "properties":{
//   "profile_image":"http://k.kakaocdn.net/dn/WqW2l/btqxmk8BEOl/BBJKEovXp6OdIKKCsyTbk1/profile_640x640s.jpg",
//   "nickname":"○",
//   "thumbnail_image":"http://k.kakaocdn.net/dn/WqW2l/btqxmk8BEOl/BBJKEovXp6OdIKKCsyTbk1/profile_110x110c.jpg"
// }
// }

export const leave = async (req, res) => {};

export const request_off = async (req, res) => {
  const boardnum = req.body.request_off;
  console.log(req.body);
  try {
    const showUpdate = await update(
      'show_flag',
      "'0'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (e) {
    console.log('상태변경 실패', e);
  }
  res.redirect('../auth/mypage');
};
