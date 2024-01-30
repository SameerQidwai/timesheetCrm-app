import axios from 'axios';
import { getApi } from './constant';

export const loginApi = (data) => {
  let Api = getApi()
  return axios
    .post(`${Api}/login`, data)
    .then((res) => {
      console.log(res)
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
      console.log(err)
      const {message, success} =  err?.response?.data ?? {}
      const {status} = err?.response
      return { status, success, message, };
    });
};
