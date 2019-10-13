import { select, insert, findOne, destroy } from '~/db/query';
import { Board, Comment, participants } from '~/db/model';
import axios from 'axios';
import crypto from 'crypto';
import htmlToText from 'html-to-text';
import { aes, deaes } from '~/util/crypto';

// 지역 매핑용
const locationTable = {
  '1': '서울',
  '2': '부산',
  '3': '대구',
  '4': '인천',
  '5': '대전',
  '6': '광주',
  '7': '울산',
  '8': '세종',
  '9': '강원도',
  '10': '경기도',
  '11': '충청남도',
  '12': '전라북도',
  '13': '전라남도',
  '14': '경상북도',
  '15': '경상남도',
  '16': '제주도',
};

// 혈액형 하이라이트 색상 매핑용
const bloodColorTable = {
  none: '#acada8',
  'RH+ A': '#e56662',
  'RH+A': '#e56662',
  'RH+ B': '#e0514e',
  'RH+B': '#e0514e',
  'RH+ O': '#da3d36',
  'RH+O': '#da3d36',
  'RH+ AB': '#ed6b68',
  'RH+AB': '#ed6b68',
  'RH- A': '#36bc9b',
  'RH-A': '#36bc9b',
  'RH- B': '#36bc9b',
  'RH-B': '#36bc9b',
  'RH- AB': '#36bc9b',
  'RH-AB': '#36bc9b',
  'RH- O': '#36bc9b',
  'RH-O': '#36bc9b',
};

const typeTable = ['전혈', '백혈구', '혈소판', '적혈구', '혈장'];

export const boardlist = async (req, res, next) => {
  try {
    const locations = req.params.location;
    let query = '';
    if (locations == undefined) query = 'TRUE';
    else query = `locations = '${locations}'`;
    const page = req.query.page == undefined ? 1 : req.query.page;
    const size = 10;
    const begin = (page - 1) * size; // 시작 글

    let where;
    const keyword = req.query.keyword;
    if (!keyword) {
      where = `${query} and (show_flag='1' or show_flag = '3')`;
    } else {
      where = `${query} and (show_flag='1' or show_flag = '3') and strpos(title, '${keyword}') > 0 `;
    }

    const list = await select(
      '*',
      'board',
      where,
      '',
      `order by show_flag,boardnum desc limit ${size} offset ${begin}`,
    );

    const boardList = [];
    for (let item of list.rows) {
      let memberInfo = await select(
        'usernum, nickname, blood, profile',
        'member',
        `usernum = ${item.author}`,
      );

      let partInfo = await select(
        'b.boardnum, request_usernum, part_usernum',
        'public.board as b',
        `b.boardnum = ${item.boardnum}`,
        'INNER JOIN public.participants as p ON b.boardnum = p.boardnum',
      );

      let content = item.contents;

      if (item.contents.length > 25) {
        content = content.substring(0, 24) + '...';
      }

      memberInfo = memberInfo.rows[0];
      //복호화

      const board_object = new Board();
      board_object.boardnum = item.boardnum;
      board_object.title = item.title;
      board_object.like_count = item.like_count;
      board_object.created_at = item.created_at;
      board_object.location = item.locations;
      board_object.hospital = item.hospital;
      board_object.content = content;
      board_object.nickname = deaes(memberInfo.nickname);
      board_object.blood = deaes(memberInfo.blood);
      board_object.num_part = partInfo.rows.length;
      board_object.show_flag = item.show_flag;
      board_object.type = item.type;

      boardList.push(board_object);
    }

    if (page == 1) {
      res.render('board/list', {
        list: boardList,
        location:
          typeof locationTable[req.params.location] === 'undefined'
            ? 0
            : locationTable[req.params.location],
        locationTable: locationTable,
        bloodColorTable: bloodColorTable,
        typeTable: typeTable,
      });
    } else {
      res.json(boardList);
    }
  } catch (err) {
    const arr = ['에러가 발생하였습니다. board list', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    next(err);
  }
};

export const read = async (req, res, next) => {
  const boardnum = req.params.boardnum;
  try {
    const article = await select(
      'b.boardnum, b.title, b.like_count, b.create_at, b.show_flag, b.locations, b.hospital, b.contents, b.create_at, b.type, u.nickname as author, r.commentnum,q.nickname as replier,r.contents as comment, u.blood, u.my_blood, b.author, u.nickname, r.usernum',
      'board as b',
      `b.boardnum = ${boardnum} `,
      'join member as u on b.author = u.usernum left join comment as r using(boardnum) left join member as q on r.usernum= q.usernum',
      'order by r.commentnum desc',
    );

    let partInfo = await select(
      'part_usernum',
      'public.board as b',
      `b.boardnum = ${boardnum}`,
      'INNER JOIN public.participants as p ON b.boardnum = p.boardnum',
    );

    const detail = article.rows[0];

    const board_object = new Board();
    board_object.boardnum = detail.boardnum;
    board_object.title = detail.title;
    board_object.like_count = detail.like_count;
    board_object.created_at = detail.create_at.toLocaleString();
    board_object.location = locationTable[detail.locations];
    board_object.hospital = detail.hospital;
    board_object.contents = detail.contents;
    board_object.nickname = deaes(detail.nickname);
    board_object.blood = deaes(detail.blood);
    board_object.my_blood = deaes(detail.my_blood);
    board_object.usernum = detail.author;
    board_object.num_part = partInfo.rows.length;
    board_object.type = detail.type;

    // 댓글
    const comments = [];

    for (let item of article.rows) {
      const repl = new Comment();
      repl.usernum = item.usernum;
      repl.comment_num = item.commentnum;
      repl.content = item.comment;
      repl.replier =
        item.replier == null || item.replier == '' ? null : deaes(item.replier);
      comments.push(repl);
    }
    const articleTable = {
      board: board_object,
      reply: comments,
    };

    if (typeof req.session.passport !== 'undefined') {
      const kakao_info = JSON.parse(req.user._raw);
      const uid = req.user.id;
      const whoAmI = await findOne(uid);

      let alreay_part = false;
      for (let item in partInfo.rows) {
        if (partInfo.rows[item].part_usernum == whoAmI.rows[0].usernum) {
          alreay_part = true;
        }
      }

      // 참가 의사자
      const participants_usernum = await select(
        'usernum',
        'member',
        `id = '${kakao_info.id}'`,
      );
      const participantsTable = Object.create(participants);
      participantsTable.boardnum = detail.boardnum;
      participantsTable.request_usernum = detail.author;
      participantsTable.part_usernum = participants_usernum.rows[0].usernum;

      res.render('board/read', {
        articleTable: articleTable,
        typeTable: typeTable,
        kakao_info: kakao_info,
        whoAmI: whoAmI.rows[0].usernum,
        participants: participantsTable,
        alreay_part: alreay_part,
      });
    } else {
      res.render('board/read', {
        articleTable: articleTable,
        typeTable: typeTable,
        whoAmI: null,
        alreay_part: false,
      });
    }
  } catch (err) {
    const arr = ['에러가 발생하였습니다. board read', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    next(err);
  }
};

export const search = async (req, res) => {
  res.render('board/search');
};

export const write = async (req, res) => {
  res.render('board/write');
};

export const upload = async (req, res, next) => {
  try {
    const user = await findOne(req.user.id);
    const new_board = new Board();
    new_board.title = req.body.title;
    new_board.author = user.rows[0].usernum;
    new_board.like_count = 0;
    new_board.create_at = 'now()';
    new_board.locations = req.body.locations;
    new_board.hospital = req.body.hospital;
    new_board.contents = req.body.contents;
    new_board.show_flag = '2';
    new_board.donation_type = req.body.type == '' ? '-1' : req.body.type;

    //object 순서보장 x
    const result = await insert(
      `'${Object.values(new_board).join(`', '`)}'`,
      'board',
      'returning *',
      `(${Object.keys(new_board).join(',')})`,
    );

    const text = htmlToText.fromString(new_board.contents, {
      wordwrap: 130,
    });

    if (result.rowCount > 0) {
      const arr = [
        new_board.title,
        text,
        `게시글번호 : ${result.rows[0].boardnum}`,
        `비노출로 변경 : /pc ${result.rows[0].boardnum} 0`,
        `노출로 변경 : /pc ${result.rows[0].boardnum} 1`,
        `대기로 변경 : /pc ${result.rows[0].boardnum} 2`,
        `모집완료로 변경 : /pc ${result.rows[0].boardnum} 3`,
      ];
      //slack webhook
      try {
        const response = await axios.post(process.env.SLACK_BOT_UPLOAD, {
          text: arr.join('\n'),
        });
      } catch (err) {
        throw new Error('axios 문제');
      }
      res.redirect('/board');
    } else {
      throw new Error('board insert 실패, rowcount ==0');
    }
  } catch (err) {
    const arr = ['에러가 발생하였습니다. board upload', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    next(err);
  }
};

export const comment_destroy = async (req, res, next) => {
  try {
    const comment_num = req.body.comment_num;
    const comment_d = await destroy('comment', `commentnum = ${comment_num}`);
    res.redirect('back');
  } catch (err) {
    const arr = ['에러가 발생하였습니다. comment_destroy ', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
  }
};

export const comment_upload = async (req, res, next) => {
  const commentTable = new Comment();
  commentTable.boardnum = req.body.boardnum;
  commentTable.content = req.body.contents;
  commentTable.replier = req.body.usernum;

  try {
    const isSignup = await findOne(req.user.id);
    if (isSignup.rows[0].nickname == '') {
      res.json({ status: 'error' });
    } else {
      const uploading = await insert(
        `DEFAULT,'${commentTable.boardnum}', '${commentTable.replier}', '${commentTable.content}'`,
        'comment',
        'returning *',
      );
      res.json({
        status: 'ok',
        replier: deaes(isSignup.rows[0].nickname),
        comment: uploading.rows[0],
      });
    }
  } catch (err) {
    const arr = ['에러가 발생하였습니다. comment upload', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
    next(err);
  }
};

export const participate = async (req, res, next) => {
  const participantsTable = Object.create(participants);
  participantsTable.boardnum = req.body.boardnum;
  participantsTable.request_usernum = req.body.request_usernum;
  participantsTable.part_usernum = req.body.part_usernum;

  try {
    const parti_q = await insert(
      `${participantsTable.boardnum}, ${participantsTable.request_usernum}, ${participantsTable.part_usernum}`,
      'participants(boardnum, request_usernum, part_usernum)',
    );
  } catch (err) {
    const arr = ['에러가 발생하였습니다. participate', err.stack];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    next(err);
    console.log(err);
  }

  res.redirect('back');
};
