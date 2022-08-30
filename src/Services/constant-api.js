import axios from "axios";
import { Api, headers, sorting } from "./constant";

export const getUserProjects = (userId, mod, phase, token) => {
    return axios
        .get(`${Api}/helpers/projects?userId=${userId}&mod=${mod}&phase=${phase}`, { headers: headers(token) })
        .then((res) => {
            const { success, data } = res.data;
                let setToken = (res.headers && res.headers.authorization)
            return { success, data: sorting(data, 'label'), setToken };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const userMilestonesApi = (userId, phase, token) => {
    return axios
        .get(`${Api}/helpers/milestones?userId=${userId}&phase=${phase}`, { headers: headers(token) })
        .then((res) => {
            const { success, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            return { success, data: sorting(data, 'label'), setToken };
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};