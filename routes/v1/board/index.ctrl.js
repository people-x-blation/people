import { select, insert, update } from '~/db/query';
export const list = async (req, res) => {
  try {
    const result = await select('*', 'board', 'TRUE');
    console.log(result.rows);
    res.render('board/list', result.rows);
  } catch (err) {
    console.log(err);
  }
};

export const read = (req, res) => {
  res.render('board/read');
};

export const search = (req, res) => {
  res.render('board/search');
};

export const write = (req, res) => {
  res.render('board/write');
};
