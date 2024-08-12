import {get, del, put, post} from './http'
import { PGetData, PEditData, PDelData, PAddData, PEditTags, PAddTags, PDelTags, PSetLang } from "./type/params"
import { RGetData, RGetTags } from "./type/response"
const API = {
    getData: (params: PGetData) => get<RGetData>('/api/data', params),
    delData: (params:PDelData) => del('/api/data', params),
    editData: (data: PEditData) => put('/api/data', data),
    addData: (data: PAddData) => post('/api/data', data),



    getTags: () => get<RGetTags>('/api/tags'),
    editTag: (data: PEditTags) => put('/api/tags', data),
    addTag: (data: PAddTags) => post('/api/tags', data),
    delTag: (params: PDelTags) => del('/api/tags', params),

    getLang: () => get<string>('/api/lang'),
    setLang: (data: PSetLang) => post('/api/lang', data)
}

export default API