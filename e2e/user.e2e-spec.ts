import { makeRequest } from './utils';

describe('User', () => {
  it('/POST /users/confirmation/request', async () => {
    const res = await makeRequest({
      method: 'POST',
      url: '/users/confirmation/request',
      data: {
        email: 'some1@email.com',
      },
    });
    expect(res.data).toBeDefined();
    expect(res.data.status).toBe(200);
  });
});
