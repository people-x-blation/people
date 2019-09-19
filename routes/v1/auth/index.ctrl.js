import { findOne } from '~/db/query';
import { select, update, signupUpdate } from '~/db/query';

export const successLogin = async (req, res) => {
  const rurl = req.query.redirectUrl || req.session.redirectUrl;
  res.redirect(rurl || '/');
};

export const login = async (req, res) => {
  const email = req.user._json.kaccount_email;
  const result = await findOne(email);
  const data = result.rows[0];
  //nickname 설정 안되어있으면 회원가입폼
  if (data.nickname == '') {
    res.render('auth/signup', { status: true, email: email });
  } else {
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
  // req.logout();
  req.session.destroy(function(err) {
    res.redirect('/');
  });
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

  const participants_db = await select(
    '*',
    'participants as p',
    `p.request_usernum = ${member_db.rows[0].usernum}`,
    'LEFT JOIN public.member as m ON p.part_usernum = m.usernum',
  );

  let participants_count = 0;
  for (let iter in participants_db.rows) {
    if (participants_db.rows[iter].show_flag) participants_count++;
  }

  console.log(participants_db.rows);

  res.render('auth/mypage', {
    kakao_info: kakao_info,
    member_db: member_db.rows[0],
    board_db: board_db.rows,
    participants: participants_db.rows,
    participants_count: participants_count,
  });
};


export const leave = async (req, res) => {};

export const request_off = async (req, res) => {
  const boardnum = req.body.request_off;
  console.log(req.body);
  try {
    const showUpdate = await update(
      'show_flag',
      "'0'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum} returning *`,
    );

    if (showUpdate.rowCount > 0) {
      res.redirect('../auth/mypage');
    } else {
      throw new Error('show_flag 게시중지 업데이트 실패, rowcount 0');
    }
  } catch (e) {
    console.log('상태변경 실패', e);
  }
  res.redirect('../auth/mypage');
};
