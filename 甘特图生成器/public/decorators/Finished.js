/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Decorator from "./Decorator.js";
export default class Finished extends Decorator {
    constructor() {
        super();
    }
    handle() {
        // console.log("Important render", this.task);
        // TODO: 对重要任务高亮、加标记
        return { finished: true };
    }
}
//# sourceMappingURL=Finished.js.map