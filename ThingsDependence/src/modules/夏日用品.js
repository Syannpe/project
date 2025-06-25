/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 防晒霜 extends TreeNode {
    name = this.constructor.name;
}
class 扇子 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 电风扇 extends TreeNode {
    name = this.constructor.name;
}
class 墨镜 extends TreeNode {
    name = this.constructor.name;
}
class 风油精 extends TreeNode {
    name = this.constructor.name;
}
class 夏日用品 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 防晒霜());
        this.children.push(new 扇子());
        this.children.push(new 电风扇());
        this.children.push(new 墨镜());
        this.children.push(new 风油精());
    }
}
export { 夏日用品, 防晒霜, 扇子, 电风扇, 墨镜, 风油精 };
//# sourceMappingURL=%E5%A4%8F%E6%97%A5%E7%94%A8%E5%93%81.js.map