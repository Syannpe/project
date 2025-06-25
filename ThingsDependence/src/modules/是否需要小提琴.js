/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 小提琴 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 琴弓 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 琴托 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 擦琴布 extends TreeNode {
    name = this.constructor.name;
}
class 是否需要小提琴 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 小提琴());
        this.children.push(new 琴弓());
        this.children.push(new 琴托());
        this.children.push(new 擦琴布());
    }
}
export { 是否需要小提琴, 小提琴, 琴弓, 琴托, 擦琴布, };
//# sourceMappingURL=%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E5%B0%8F%E6%8F%90%E7%90%B4.js.map