/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 大垫子 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 坐飞机火车 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 大垫子());
    }
}
export { 坐飞机火车, 大垫子 };
//# sourceMappingURL=%E5%9D%90%E9%A3%9E%E6%9C%BA%E7%81%AB%E8%BD%A6.js.map