import { Singleton } from '~/db';
console.log(Singleton);

export const select = async (object, table, where) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT ${object} FROM ${table} WHERE ${where}`,
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const insert = async (object, table) => {
  const instance = new Singleton();
  const result = await instance.query(
    `INSERT INTO ${table} VALUES (${object}) }`,
  );
  return result;
};

export const update = async (object, ToBEObject, table) => {
  const instance = new Singleton();
  const result = await instance.query(
    `UPDATE ${table} SET ${object} = ${ToBEObject} }`,
  );
  return result;
};
