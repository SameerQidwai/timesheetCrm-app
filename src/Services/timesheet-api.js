import axios from "axios";

import { Api, headers, sorting } from "./constant";

const url = `${Api}/timesheets/`;

export const getTimesheetApi = (keys, token) => {
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            return { success: success, data: data, setToken }
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

export const reviewTimeSheet = (keys, stage, data, token) => {
    return axios
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/milestoneEntries${stage}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            const setToken = (res.headers && res.headers.authorization)
            return {success, data, setToken};
        })
        .catch((err) => {
            console.log(err)
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const addTimeEntryApi = (keys ,data, token) => {
    return axios
        .post(url +`${keys.startDate}&${keys.endDate}&${keys.userId}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, data, message } = res.data;
            if (success) {
                data.actualHours = data.hours
                let setToken = (res.headers && res.headers.authorization)
                return {success, data, setToken}
            };
            return { success }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const editTimeEntryApi = (data, token) => {
    return axios
        .put(url +`entries/${data['entryId']}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            if (success) {
                data.actualHours = data.hours
                let setToken = (res.headers && res.headers.authorization)
                return {success, data, setToken}
            };
            return { success }
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const deleteTimeEntryApi = (entryId, token) => {
    return axios
        .delete(url +`entries/${entryId}`, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            return {success, data, setToken};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};

export const addTimesheetNote = (id, data, token) => {
    return axios
        .patch(`${url}/milestoneEntriesUpdate`, data, {headers:headers(token)})
        .then((res) => {
            console.log("res-->", res);
            const { success, message, data } = res.data;
            if (success) {
                let obj = {
                    notes: data.notes,
                    attachment: data.attachment
                }
                let setToken = (res.headers && res.headers.authorization)
                return {success, data, setToken};
            }
            return {success};
            
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                status: false,
                message: err.message,
            };
        });
};