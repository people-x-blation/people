import { select, update } from '~/db/query';

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
  res.render('user/mypage', {
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
      res.redirect('../user/mypage');
    } else {
      throw new Error('show_flag 게시중지 업데이트 실패, rowcount 0');
    }
  } catch (e) {
    console.log('상태변경 실패', e);
  }
  res.redirect('../user/mypage');
};
