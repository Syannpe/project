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
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 大垫子());
    }
}

export {
    坐飞机火车,
    大垫子
}
