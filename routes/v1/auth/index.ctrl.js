import { findOne } from '~/db/query';

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
  //nickname 설정 안되어있으면 회원가입폼
  if (data.nickname == '') {
    res.render('auth/signup', { email: email });
  } else {
    console.log('login callbakc');
    console.log(req.session.redirectUrl);
    res.redirect('/auth/kakao/success');
  }
};

export const logout = async (req, res) => {
  req.logout();
  console.log(req.session);
  res.redirect('/');
};
