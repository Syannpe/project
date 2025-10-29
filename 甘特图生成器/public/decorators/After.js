/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Decorator from "./Decorator.js";
export default class After extends Decorator {
    task;
    constructor(task) {
        super();
        this.task = task;
    }
    handle() {
        return { after: this.task };
    }
}
//# sourceMappingURL=After.js.map