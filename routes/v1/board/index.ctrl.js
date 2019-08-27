import { select, insert, update, findName } from '~/db/query';
import { board, comment } from '~/db/model';
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

export const boardlist = async (req, res) => {
  // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.

  try {
    const locations = req.params.location;
    let query = '';
    if (locations == undefined) query = 'TRUE';
    else query = `locations = '${locations}'`;
    const page = req.query.page == undefined ? 1 : req.query.page;
    const size = 10;
    const begin = (page - 1) * size; // 시작 글
    const list = await select(
      '*',
      'board',
      query,
      '',
      `order by boardnum desc limit ${size} offset ${begin}`,
    );

    const boardList = [];
    for (let item of list.rows) {
      let memberInfo = await select(
        'usernum, nickname, blood, profile',
        'member',
        `usernum = ${item.author}`,
      );

      let content = item.contents;

      if (item.contents.length > 25) {
        content = content.substring(0, 24) + '...';
      }

      memberInfo = memberInfo.rows[0];
      const board_object = Object.create(board);
      board_object.boardnum = item.boardnum;
      board_object.title = item.title;
      board_object.like_count = item.like_count;
      board_object.created_at = item.created_at;
      board_object.location = item.locations;
      board_object.hospital = item.hospital;
      board_object.content = content;
      board_object.nickname = memberInfo.nickname;
      board_object.blood = memberInfo.blood;
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
      });
    } else {
      res.json(boardList);
    }
  } catch (err) {
    console.log(err);
  }
};

export const read = async (req, res) => {
  const boardnum = req.params.boardnum;
  console.log(boardnum);
  try {
    const article = await select(
      'b.boardnum, b.title, b.like_count, b.create_at, b.show_flag, b.locations, b.hospital, b.contents, u.nickname, r.commentnum,q.nickname,r.contents',
      'board as b',
      `b.boardnum = ${boardnum}`,
      'join member as u on b.author = u.usernum left join comment as r using(boardnum) left join member as q on r.usernum= q.usernum',
    );
    console.log(article);
    const detail = article.rows[0];
    const board_object = Object.create(board);
    board_object.boardnum = detail.boardnum;
    board_object.title = detail.title;
    board_object.like_count = detail.like_count;
    board_object.created_at = detail.created_at;
    board_object.location = detail.locations;
    board_object.hospital = detail.hospital;
    board_object.content = detail.content;
    board_object.nickname = detail.nickname;
    board_object.blood = detail.blood;
    const comments = [];

    for (let item of article.rows) {
      const repl = Object.create(comment);
      repl.comment_num = item.commentnum;
      repl.conetnt = item.contents;
      comments.push(repl);
    }
    const articleTable = {
      board: board_object,
      reply: comments,
    };
    console.log(articleTable);
    res.render('board/read', articleTable);
  } catch (e) {
    console.log(e);
  }
};

export const search = (req, res) => {
  res.render('board/search');
};

export const write = (req, res) => {
  res.render('board/write');
};
