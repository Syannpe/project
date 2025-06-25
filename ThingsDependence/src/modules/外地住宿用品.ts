/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";

class 眼罩 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 耳塞 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 外地住宿用品 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 眼罩());
        this.children.push(new 耳塞());
    }
}

export {
    外地住宿用品,
    眼罩,
    耳塞,
}
