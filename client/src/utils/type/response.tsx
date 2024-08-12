// 约束响应参数的类型
import { UserModel, UserPages, UserTags } from "../../store/type/type"

export interface RGetData  {
       pageInfo: UserPages,
       dataInfo: UserModel[] 
   
}
export type RGetTags  = UserTags[]
