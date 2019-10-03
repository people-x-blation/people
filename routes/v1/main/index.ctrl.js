import { aes, deaes } from '~/util/crypto';
import crypto from 'crypto';
import { search, insert, update } from '~/db/query';
import { select } from '../../../db/query';

export const index = async (req, res) => {
  const article = await select(
    '*',
    'notice',
    'show_flag = true',
    '',
    'LIMIT 1'
  );
  res.render('index', {
    noticeTop: article.rows[0]
  });
};

export const notice = async(req,res) => {

  let admin = false;

  const article = await select(
    '*',
    'notice',
    'show_flag = true',
  );

  if(typeof req.user !== 'undefined') {
    const is_admin = await select(
      'is_admin',
      'member',
      `id = '${req.user.id}'::character varying`
    );
    admin = is_admin.rows[0].is_admin;
  }

  res.render('notice', {
    article: article.rows.reverse(),
    admin: admin,
  });
}