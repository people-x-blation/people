import { findOne, findMe, update, signupUpdate, destroy } from '~/db/query';

export const successLogin = async (req, res) => {
  const rurl = req.query.redirectUrl || req.session.redirectUrl;
  res.redirect(rurl || '/');
};

export const login = async (req, res) => {
  const email = req.user._json.kaccount_email;
  const result = await findOne(email);
  const data = result.rows[0];
  //nickname 설정 안되어있으면 회원가입폼
  console.log('데이터', data);
  if (typeof data === 'undefined') {
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
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth register', err];
    const response = await axios.post(
      'https://hooks.slack.com/services/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',
      { text: arr.join('\n') },
    );
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

export const leave = async (req, res) => {
  try {
    if (req.user) {
      const email = req.user._json.kaccount_email;
      const result = await findMe(email);
      const usernum = result.rows[0].usernum;
      if (usernum) {
        await destroy('member', `usernum=${usernum}`);
        req.logout();
        req.session.destroy(function(err) {
          res.json({ status: 'ok' });
        });
      } else {
        res.json({ status: 'no usernum' });
      }
    } else {
      res.json({ status: 'no user session' });
    }
  } catch (err) {
    const arr = ['에러가 발생하였습니다. leave', err];
    const response = await axios.post(
      'https://hooks.slack.com/services/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',
      { text: arr.join('\n') },
    );
  }
};

export const request_off = async (req, res) => {
  const boardnum = req.body.request_off;
  try {
    const showUpdate = await update(
      'show_flag',
      "'0'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/request off', err];
    const response = await axios.post(
      'https://hooks.slack.com/services/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',
      { text: arr.join('\n') },
    );
    console.log('상태변경 실패', e);
  }
  res.redirect('../user/mypage');
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
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/request complete', err];
    const response = await axios.post(
      'https://hooks.slack.com/services/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',
      { text: arr.join('\n') },
    );
    console.log('상태변경 실패', e);
  }
  res.redirect('../user/mypage');
};

export const terms = async (req, res) => {
  res.render('auth/terms');
};
