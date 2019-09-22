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
  const kakao_info = JSON.parse(req.user._raw);
  const user_input = {
    email: req.body.email,
    nickname: req.body.nickname,
    phone: req.body.phone,
    blood: req.body.blood,
  };
  try {
    const update_member = await signupUpdate(user_input);
    res.redirect('../user/mypage');
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

  // 참여자
  const participants_db = await select(
    '*',
    'participants as p',
    `p.request_usernum = ${member_db.rows[0].usernum}`,
    'LEFT JOIN public.member as m ON p.part_usernum = m.usernum',
  );

  // 참여한 요청
  const participation_db = await select(
    'boardnum, title, author, locations, hospital, contents, show_flag',
    'participants as p',
    `p.part_usernum = ${member_db.rows[0].usernum} AND p.show_flag = '1'`,
    'LEFT JOIN public.member as m ON p.part_usernum = m.usernum NATURAL JOIN public.board as b',
  );

  // 참여자 수 카운트
  let participants_count = 0;
  for (let iter in participants_db.rows) {
    if (participants_db.rows[iter].show_flag == '1') participants_count++;
  }

  // 참여 한 게시물 수 카운트
  let participation_count = 0;
  for (let iter in participation_db.rows) {
    if (participation_db.rows[iter].show_flag == '1') participation_count++;
  }

  console.log('참여 DB', participation_db.rows);
  res.render('auth/mypage', {
    kakao_info: kakao_info,
    member_db: member_db.rows[0],
    board_db: board_db.rows,
    participants: participants_db.rows,
    participation: participation_db.rows,
    participants_count: participants_count,
    participation_count: participation_count,
    is_logedin: typeof req.session.passport === 'undefined' ? false : true,
  });
};

export const leave = async (req, res) => {};

export const request_off = async (req, res) => {
  const boardnum = req.body.request_off;
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

export const request_complete = async (req, res) => {
  const boardnum = req.body.request_complete;
  try {
    const showUpdate = await update(
      'show_flag',
      "'3'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (e) {
    console.log('상태변경 실패', e);
  }
  res.redirect('../auth/mypage');
};
