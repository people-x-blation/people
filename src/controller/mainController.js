import { aes, deaes } from '~/util/crypto';
import crypto from 'crypto';
import { select } from '~/db/query';

export const index = async (req, res) => {
  const article = await select(
    '*',
    'notice',
    'show_flag = true',
    '',
    'ORDER BY notinum desc LIMIT 1',
  );
  res.render('index', {
    noticeTop: article.rows[0],
  });
};

export const notice = async (req, res) => {
  let admin = false;

  const article = await select('*', 'notice', 'show_flag = true');

  // console.log(article.rows.reverse());

  if (typeof req.user !== 'undefined') {
    const is_admin = await select(
      'is_admin',
      'member',
      `id = $1::character varying`,
      '',
      '',
      [req.user.id],
    );
    admin = is_admin.rows[0].is_admin;
  }

  res.render('notice', {
    article: article.rows.reverse(),
    admin: admin,
  });
};
