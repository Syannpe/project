/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";

class 转换头 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 出国用品 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 转换头());
    }
}

export {
    出国用品,
    转换头
}
