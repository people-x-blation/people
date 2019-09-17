import { Singleton } from '~/db';

export const select = async (object, table, where, add = '', add2 = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT ${object} FROM ${table} ${add} WHERE ${where} ${add2}`,
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
      `SELECT * FROM member WHERE email='${where}'`,
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const insert = async (object, table, add = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `INSERT INTO ${table} VALUES (${object}) ${add}`,
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};

export const update = async (object, ToBEObject, table, where = '') => {
  const instance = new Singleton();
  const result = await instance.query(
    `UPDATE ${table} SET ${object} = ${ToBEObject} ${where}`,
  );
  return result;
};

export const signupUpdate = async (user_input) => {
  // 추후 리팩토링 필요
  const instance = new Singleton();
  const query = `UPDATE member SET nickname = '${user_input.nickname}', blood = '${user_input.blood}', phone = '${user_input.phone}' WHERE email = '${user_input.email}'`;
  const result = await instance.query(query);
  return result;
};
