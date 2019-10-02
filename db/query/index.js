import { Singleton } from '~/db';
import axios from 'axios';
export const select = async (object, table, where, add = '', add2 = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT ${object} FROM ${table} ${add} WHERE ${where} ${add2}`,
    );
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. select query',
      err,
      `SELECT ${object} FROM ${table} ${add} WHERE ${where} ${add2}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
  }
};

export const findOne = async (where) => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `SELECT * FROM member WHERE id='${where}'`,
    );
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. findone query',
      err,
      `SELECT * FROM member WHERE id='${where}'`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
  }
};

export const insert = async (object, table, add = '', order = '') => {
  try {
    const instance = new Singleton();
    console.log('쿼리', `INSERT INTO ${table}${order}  VALUES (${object})`);
    const result = await instance.query(
      `INSERT INTO ${table}${order} VALUES (${object}) ${add}`,
    );

    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. insert query',
      err,
      `INSERT INTO ${table}${order} VALUES (${object}) ${add}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
  }
};

export const update = async (object, ToBEObject, table, where = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(
      `UPDATE ${table} SET ${object} = ${ToBEObject} ${where}`,
    );

    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. update query',
      err,
      `UPDATE ${table} SET ${object} = ${ToBEObject} ${where}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
  }
};

export const signupUpdate = async (user_input) => {
  // 추후 리팩토링 필요
  try {
    const instance = new Singleton();
    const query = `UPDATE member SET nickname = '${user_input.nickname}', blood = '${user_input.blood}',phone = '${user_input.phone}', my_blood = '${user_input.my_blood}', email = '${user_input.email}' WHERE id = '${user_input.id}'`;
    const result = await instance.query(query);
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. signupUpdate query',
      err,
      `UPDATE member SET nickname = '${user_input.nickname}', blood = '${user_input.blood}', phone = '${user_input.phone}' WHERE id = '${user_input.id}'`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
  }
};

export const destroy = async (table, where = '') => {
  try {
    const instance = new Singleton();
    const result = await instance.query(`DELETE FROM ${table} WHERE ${where}`);
    return result;
  } catch (err) {
    const arr = [
      '에러가 발생하였습니다. destroy query',
      err,
      `DELETE FROM ${table} WHERE ${where}`,
    ];
    const response = await axios.post(process.env.SLACK_BOT_ERROR_URL, {
      text: arr.join('\n'),
    });
    console.log(err);
  }
};
