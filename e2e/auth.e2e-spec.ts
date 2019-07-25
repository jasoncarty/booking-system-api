import { makeRequest } from './utils';

describe('auth', () => {
  it('/POST /authentication/create', async () => {
    const res = await makeRequest({
      method: 'POST',
      url: '/authentication/create',
      data: {
        email: 'some1@email.com',
        password: 'qwerty123',
      },
    });

    const { data: result } = res;
    expect(result).toBeDefined();
    expect(result.data.user).toBeDefined();
    expect(result.data.token).toBeDefined();
    expect(result.status).toBe(200);
  });
});
