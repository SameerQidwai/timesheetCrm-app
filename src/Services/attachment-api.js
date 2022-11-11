import axios  from "axios";
import { getApi } from "./constant";

export const addAttachment = (data, token) => {
    let Api = getApi()
    return axios
        .post(`${Api}/files`, data, {headers: {"content-type": "multipart/form-data", Authorization: token}})
        .then((res) => {
            const { status } = res;
            console.log("res-->", res.data)
            if (status === 200) {
                const { success, data } = res.data;
                const file = {
                    fileId: data[0].id,
                    uid: data[0]&&data[0].uniqueName,
                    name: data[0]&&data[0].originalName,
                    type: data[0]&&data[0].type,
                    uri: `${Api}/files/${data[0]&&data[0].uniqueName}`,
                }
                const setToken = (res.headers && res.headers.authorization)
                return { success, file, setToken };
            }
            return { success: false }
        })
        .catch((err) => {
            const {message, success} =  err?.response?.data ?? {}
            const {status} = err?.response
            return { status, success, message, };
        });
};