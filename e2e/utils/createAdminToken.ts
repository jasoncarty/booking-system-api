import { adminUser } from './../factories';
import { makeRequest } from './makeRequest';

export const createAdminToken = async (): Promise<string> => {
  const res = await makeRequest({
    method: 'POST',
    url: '/authentication/create',
    data: adminUser,
  });

  const {
    data: {
      data: { token },
    },
  } = res;
  return token;
};
