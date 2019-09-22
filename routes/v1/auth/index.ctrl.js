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
    res.redirect('../user/mypage');
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (req, res) => {
  // req.logout();
  req.logout();
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};

export const leave = async (req, res) => {};
