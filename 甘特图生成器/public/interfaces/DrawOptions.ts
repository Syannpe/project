/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Task from "../models/Task";

export default interface DrawOptions {
    important: boolean;     // 是否高亮
    after: Task;            // 关联的后置任务
    finished: boolean;      // 是否已完成
    optional: boolean;      // 是否是可选任务
}