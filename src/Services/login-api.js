import axios from 'axios';
import { Api } from './constant';

const url = `${Api}/auth`;

export const loginApi = (data) => {
  return axios
    .post(`${Api}/login`, data)
    .then((res) => {
      const { success, data, message } = res.data;
        if (success) {
            // let permissions = { DASHBOARD: {READ: {ANY: true } } }
            let permissions = {};
            let role = data.role;
            // data.role = role.roleId
            role.permissions.map((el) => {
            if (!permissions[el.resource]) {
                permissions[el.resource] = {};
            }
            if (!permissions[el.resource][el.action]) {
                permissions[el.resource][el.action] = {};
            }
            permissions[el.resource][el.action][el.grant] = true;
            });
            // data.permissions = JSON.stringify(permissions);
            // delete data.role.permissions;
            // data.role = JSON.stringify(data.role);
            // const keys = Object.keys(data);
            // let len = keys.length - 1;
            // for (len; len >= 0; len--) {
            //   const key = keys[len];
            //   localStorage.setItem(key, data[key]);
            // }
        }
        return { success, data };
    })
    .catch((err) => {
      return {
        error: 'Please login again!',
        status: false,
        message: err.message,
      };
    });
};
