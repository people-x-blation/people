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

export const insert = async (object, table) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `INSERT INTO ${table} VALUES (${object})`,
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
