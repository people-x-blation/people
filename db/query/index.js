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
      `SELECT nickname FROM member WHERE email='${where}'`,
    );
    return result;
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

export const update = async (object, ToBEObject, table, where = '') => {
  const instance = new Singleton();
  const result = await instance.query(
    `UPDATE ${table} SET ${object} = ${ToBEObject} ${where}`,
  );
  return result;
};
