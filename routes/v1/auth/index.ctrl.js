import { findOne, update, signupUpdate, destroy } from '~/db/query';
import { Member, NoticeDB } from '~/db/model';
import axios from 'axios';
import crypto from 'crypto';
import { aes } from '~/util/crypto';
import { insert } from '../../../db/query';

export const login = async (req, res) => {
  const result = await findOne(req.user.id);
  const data = result.rows[0];
  
  if (
    data.length == 0 ||
    data.nickname === '' ||
    data.blood === '' ||
    data.phone === ''
  ) {
    res.render('auth/terms', { status: true });
  } else {
    res.send(
      '<script type="text/javascript"> \
      alert("정상적으로 로그인 되었습니다.");\
      location.href="/board"\
      </script>',
    );
  }
};

export const register = async (req, res, next) => {
  try {
    const user_input = new Member();
    for (let input in req.body) {
      let result = aes(req.body[input]);
      user_input[input] = result;
    }
    user_input.blood = user_input.blood === 'none' ? null : user_input.blood;
    user_input.id = req.user.id;
    const update_member = await signupUpdate(user_input);
    res.redirect('../user/mypage');
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth register', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
};

export const logout = async (req, res) => {
  req.logout();
  
  req.session.destroy(function(err) {
    res.send(
      '<script type="text/javascript"> \
      alert("정상적으로 로그아웃 되었습니다.");\
      location.href="/"\
      </script>',
    );
  });
};

export const leave = async (req, res, next) => {
  try {
    if (req.user) {
      const id = req.user.id;
      const result = await findOne(id);
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
    const arr = ['에러가 발생하였습니다. leave', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
};

export const request_off = async (req, res, next) => {
  const boardnum = req.body.request_off;
  try {
    const showUpdate = await update(
      'show_flag',
      "'0'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/request off', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
  res.redirect('../user/mypage');
};

export const request_complete = async (req, res, next) => {
  const boardnum = req.body.request_complete;
  try {
    const showUpdate = await update(
      'show_flag',
      "'3'::show_flag_t",
      'board',
      `WHERE boardnum = ${boardnum}`,
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. auth/request complete', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
  res.redirect('../user/mypage');
};

export const terms = async (req, res) => {
  res.render('auth/signup', { email: req.user._json.kaccount_email });
};

export const notice_write = async (req, res) => {
  const noticeTable = new NoticeDB();
  noticeTable.title = req.body.title;
  noticeTable.contents = req.body.contents;
  try{
    const write = await insert(
      `'${noticeTable.title}', '${noticeTable.contents}'`,
      'notice',
      'returning *',
      `(title, contents)`,
    );
  }catch(err){
    const arr = ['에러가 발생하였습니다. notice upload', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
  res.redirect('/notice');
}

export const notice_delete = async (req, res) => {
  try{
    const deleteUpdate = update(
      'show_flag',
      'false',
      'notice',
      `WHERE notinum = ${req.body.notinum}`
    );
  }catch(err){
    const arr = ['에러가 발생하였습니다. notice delete', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
  
  res.redirect('/notice');
}