import axios from 'axios';
import { Api } from './constant';

const url = `${Api}/auth`;

export const loginApi = (data) => {
  console.log(data)
  return axios
    .post(`${Api}/login`, data)
    .then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        let permissions = {};
        let role = data.role;
        role.permissions.map((el) => {
        if (!permissions[el.resource]) {
            permissions[el.resource] = {};
        }
        if (!permissions[el.resource][el.action]) {
            permissions[el.resource][el.action] = {};
        }
        permissions[el.resource][el.action][el.grant] = true;
        });
      }
        return { success, data };
    })
    .catch((err) => {
      const {message, success} =  err?.response?.data ?? {}
      const {status} = err?.response
      return { status, success, message, };
    });
};
