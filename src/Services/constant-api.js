import axios from "axios";
import { Api, checkToken, headers, sorting } from "./constant";

export const getUserProjects = (userId, mod, phase, token) => {
    return axios
        .get(`${Api}/helpers/projects?userId=${userId}&mod=${mod}&phase=${phase}`, { headers: headers(token) })
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            return { success, data: sorting(data, 'label'), setToken };
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};

export const userMilestonesApi = (userId, phase, token) => {
    return axios
        .get(`${Api}/helpers/milestones?userId=${userId}&phase=${phase}`, { headers: headers(token) })
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            return { success, data: sorting(data, 'label'), setToken };
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};