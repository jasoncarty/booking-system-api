import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export const makeRequest = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const { url, method, headers, data, params } = config;
  return axios.request({
    url: `http://localhost:3000${url}`,
    method,
    headers,
    data,
    params,
  });
};
