import { Singleton } from '~/db';

export const select = async (object, table, where, add = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT ${object} FROM ${table} WHERE ${where} ${add}`,
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const findOne = async (where) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT email FROM member WHERE email='${where}'`,
    );
    if (result.rows.length > 0) return true;
    else return false;
  } catch (err) {
    console.log(err);
  }
};

// 유저번호 기반 닉네임 찾기 자동화
export const findName = async (usernum) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT nickname FROM member WHERE usernum='${usernum}'`,
    );
    console.log(result.rows[0]);
    if (result.rows.length > 0) return result.rows[0].nickname;
    else return false;
  } catch (err) {
    console.log(err);
  }
};

export const insert = async (object, table) => {
  const instance = new Singleton();
  const result = await instance.query(
    `INSERT INTO ${table} VALUES (${object})`,
  );

  console.log(result);

  return result;
};

export const update = async (object, ToBEObject, table) => {
  const instance = new Singleton();
  const result = await instance.query(
    `UPDATE ${table} SET ${object} = ${ToBEObject} }`,
  );
  return result;
};
