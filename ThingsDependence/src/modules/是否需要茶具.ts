/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";

class 茶叶 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 茶壶 extends TreeNode {
    name = this.constructor.name;
}

class 茶杯 extends TreeNode {
    name = this.constructor.name;
}

class 是否需要茶具 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 茶叶());
        this.children.push(new 茶壶());
        this.children.push(new 茶杯());
    }
}

export {
    是否需要茶具,
    茶叶,
    茶壶,
    茶杯
}
