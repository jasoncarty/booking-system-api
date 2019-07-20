import { makeRequest, createAdminToken } from './utils';

describe('Admin', () => {
  let token: string;

  beforeAll(async () => {
    token = await createAdminToken();
  });

  it('/GET /admin/users', async () => {
    const res = await makeRequest({
      method: 'GET',
      url: '/admin/users',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data: result } = res;
    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.token).toBeDefined();
  });

  it('/GET /admin/user/:id', async () => {
    const res = await makeRequest({
      method: 'GET',
      url: '/admin/users/1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data: result } = res;
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.token).toBeDefined();
  });

  it('/POST /admin/users/create', async () => {
    const res = await makeRequest({
      method: 'POST',
      url: '/admin/users/create',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: 'Roger Dodger',
        email: 'roger@dogder.com',
      },
    });

    const { data: result } = res;
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.name).toEqual('Roger Dodger');
    expect(result.token).toBeDefined();
  });
});
