import axios from "axios";

import { Api, headers } from "./constant";

const url = `${Api}/timesheets/`;

export const getTimesheetApi = (keys, token) => {
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            
            return { success: success, data: data }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
                data: [],
            };
        });
};
