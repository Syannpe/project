/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 电脑充电器 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 鼠标 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 键盘 extends TreeNode {
    name = this.constructor.name;
}
class 移动硬盘 extends TreeNode {
    name = this.constructor.name;
}
class 是否需要电脑 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 电脑充电器());
        this.children.push(new 鼠标());
        this.children.push(new 键盘());
        this.children.push(new 移动硬盘());
    }
}
export { 是否需要电脑, 电脑充电器, 鼠标, 键盘, 移动硬盘 };
//# sourceMappingURL=%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E7%94%B5%E8%84%91.js.map