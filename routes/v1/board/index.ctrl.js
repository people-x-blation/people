import passport from 'passport';
import { select, insert, update } from '~/db/query';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

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

export const list = async (req, res) => {
  // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.

  try {
    const locations = req.params.location;
    let query = '';
    if (locations == undefined) query = 'TRUE';
    else query = locations;
    const page = req.query.page == undefined ? 1 : req.query.page;
    const size = 10;
    const begin = (page - 1) * size; // 시작 글
    const list = await select(
      '*',
      'board',
      query,
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
      const board = {
        boardnum: item.boardnum,
        title: item.title,
        like_count: item.like_count,
        created_at: item.created_at,
        location: item.locations,
        hospital: item.hospital,
        content: content,
        nickname: memberInfo.nickname,
        blood: memberInfo.blood,
      };
      boardList.push(board);
    }

    if (page == 1) {
      res.render('board/list', {
        list: boardList,
        location: locationTable[req.params.location],
      });
    } else {
      res.json(boardList);
    }
  } catch (err) {
    console.log(err);
  }
};

export const read = (req, res) => {
  console.log(req.params);
  res.render('board/read');
};

export const search = (req, res) => {
  res.render('board/search');
};

export const write = (req, res) => {
  res.render('board/write');
};
