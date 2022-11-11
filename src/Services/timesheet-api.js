import axios from "axios";

import { checkToken, getApi, headers, sorting } from "./constant";

export const getTimesheetApi = (keys, token) => {
    let url = getApi(`/timesheets/`)
    return axios
        .get(url + `${keys.startDate}&${keys.endDate}&${keys.userId}`, {headers:headers(token)})
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            return { success, data, setToken }
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, data: [], setToken};
        });
};

export const reviewTimeSheet = (keys, stage, data, token) => {
    let url = getApi(`/timesheets/`)
    return axios
        .post(url + `${keys.startDate}&${keys.endDate}&${keys.userId}/milestoneEntries${stage}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            return {success, data, setToken};
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};

export const addTimeEntryApi = (keys, data, token) => {
    let url = getApi(`/timesheets/`)
    return axios
        .post(url +`${keys.startDate}&${keys.endDate}&${keys.userId}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            if (success) {
                data.actualHours = data.hours
            };
            return { success, data, setToken}
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};

export const editTimeEntryApi = (data, token) => {
    let url = getApi(`/timesheets/`)
    return axios
        .put(url +`entries/${data['entryId']}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            if (success) {
                data.actualHours = data.hours
                return {success, data, setToken}
            };
            return { success, setToken }
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};

export const deleteTimeEntryApi = (entryId, token) => {
    let url = getApi(`/timesheets/`)
    return axios
        .delete(url +`entries/${entryId}`, {headers:headers(token)})
        .then((res) => {
            const { success, data, message } = res.data;
            let setToken = checkToken(message, res?.headers)
            return {success, data, setToken};
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};

export const addTimesheetNote = (id, data, token) => {
    let url = getApi(`/timesheets/`)
    return axios
        .patch(`${url}/milestoneEntriesUpdate`, data, {headers:headers(token)})
        .then((res) => {
            const { success, message, data } = res.data;
            let setToken = checkToken(message, res?.headers)
            if (success) {
                let obj = {
                    notes: data.notes,
                    attachment: data.attachment
                }
            }
            return {success, data, setToken};
            
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            let setToken = checkToken(message, err?.response.headers)
            return { status, success, message, setToken};
        });
};