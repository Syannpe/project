/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 内裤 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 袜子 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 拖鞋 extends TreeNode {
    name = this.constructor.name;
}
class 换洗衣服 extends TreeNode {
    name = this.constructor.name;
}
class 是否需要衣服 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 内裤());
        this.children.push(new 袜子());
        this.children.push(new 拖鞋());
        this.children.push(new 换洗衣服());
    }
}
export { 是否需要衣服, 内裤, 袜子, 拖鞋, 换洗衣服 };
//# sourceMappingURL=%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E8%A1%A3%E6%9C%8D.js.map