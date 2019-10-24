import request from 'supertest';
import app from '~/app';
describe('test start!', () => {
  test('GET /board', async () => {
    const res = await request(app).get('/board');
    //expect
    expect(res.body).toStrictEqual({
      data: '일치했으면 하는 데이터',
    });
  });
});
