/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 充电线 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 手机充电器 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
    children = [new 充电线];
}
class 充电宝 extends TreeNode {
    name = this.constructor.name;
    children = [new 充电线];
}
class 有线耳机 extends TreeNode {
    name = this.constructor.name;
}
class 蓝牙耳机 extends TreeNode {
    name = this.constructor.name;
}
class 卡针 extends TreeNode {
    name = this.constructor.name;
}
class 是否需要手机 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 手机充电器());
        this.children.push(new 充电宝());
        this.children.push(new 有线耳机());
        this.children.push(new 蓝牙耳机());
        this.children.push(new 卡针());
    }
}
export { 是否需要手机, 手机充电器, 充电宝, 有线耳机, 蓝牙耳机, 卡针 };
//# sourceMappingURL=%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E6%89%8B%E6%9C%BA.js.map