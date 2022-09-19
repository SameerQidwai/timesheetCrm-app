import axios from "axios";
import { Api, headers } from "./constant";

const url = `${Api}/leave-requests`

export const getLeavesApi = (token) => {
    return axios
        .get(url,{headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            return { success, data, setToken};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const addLeaveApi = (data, token) => {
    return axios
        .post(url, data, {headers:headers(token)})
        .then((res) => {
            const { success, message } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            return {success, setToken};
        })
        .catch((err) => {
            // err?.response.data
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const editLeaveApi = (id, data, token) => {
    return axios
    .patch(`${url}/${id}`, data, {headers:headers(token)})
        .then((res) => {
            const { success, message, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)

            return {success, data, setToken};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const deleteLeaveApi = (entryId, token) => {
    return axios
        .delete(`${url}/${entryId}`, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
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


export const getLeaveApi = (id, token) => {
    return axios
        .get(`${url}/${id}`,{headers:headers(token)})
        .then((res) => {
            const { success, message, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            if (success){
                let entriesHours = {} //to show Values in date fields 
                let entries = (data?.entries??[]).map(el=>{
                    el['key'] = el['date']
                    entriesHours[el['key']] = el['hours']
                    return el
                })
                let attachments = data?.attachments ?? []
                var fileIds = []
                var fileList = []
                attachments.map((el) => {
                    fileIds.push(el.id)
                    fileList.push({
                        id: el.id,
                        createdAt: el.createdAt,
                        fileId: el.fileId,
                        status: el.status,
                        targetId: el.targetId,
                        targetType: el.targetType,
                        uid: el.file.uniqueName,
                        name: el.file.originalName,
                        type: el.file.type === 'png'? 'image/png': el.file.type,
                        uri: `${Api}/files/${el.file.uniqueName}`,
                        // thumbUrl: thumbUrl(el.file.type)
                    })
                });
                data.attachments = fileList;
                return { success, data, entries, entriesHours, fileIds, fileList, setToken }
            }
            return {success, data }
        })
        .catch((err) => {
            const message = err?.response?.data?.message
            console.log("err->", err);
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};
export const getBalanceApi = (id, token) => {
    return axios
        .get(`${Api}/leave-request-balances?employeeId=${id}`,{headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            // setToken(res.headers && res.headers.authorization)
            return { success, data};
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};

export const getUserLeaveType = (token) => {
    return axios
        .get(`${Api}/leave-request-types/getOwn`, {headers:headers(token)})
        .then((res) => {
            const { success, data } = res.data;
            let setToken = (res.headers && res.headers.authorization)
            if (success){
                const {holidays, contractDetails, LeaveRequestTypes = []} = data
                let requestType = [{id: 0, name: 'Unpaid', include_off_days: true}]
                LeaveRequestTypes.forEach((el,index)=>{
                    const type= {}
                    Object.entries(el).forEach(([key, value]) => {
                        var camelToSnakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                        type[camelToSnakeKey]= value
                    })
                    requestType.push(type)
                })
                return { success, data, holidays, contractDetails, LeaveRequestTypes: requestType, setToken }
            };
            return {success, data}
        })
        .catch((err) => {
            return {
                error: "Please login again!",
                success: false,
                message: err.message,
            };
        });
};