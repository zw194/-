// 约束请求参数的类型
import { UserParams } from "../../store/type/type"
export interface PGetData extends UserParams{}

export interface PEditData {
    id: string;
    name: string;
    description: string;
    tags: string[];
}
export interface PDelData {
    id: string;
}
export interface PAddData extends PEditData{}

export interface PEditTags {
    id: string;
    name: string;
}

export interface PDelTags {
    id: string[]
}

export interface PSetLang {
    lang: string;
}
export interface PAddTags extends PEditTags{}
