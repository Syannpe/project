/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";

class 眼药 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 异维A extends TreeNode {
    name = this.constructor.name;
}

class 酒精 extends TreeNode {
    name = this.constructor.name;
}

class 止泻药 extends TreeNode {
    name = this.constructor.name;
}

class 医药用品 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 眼药());
        this.children.push(new 异维A());
        this.children.push(new 酒精());
        this.children.push(new 止泻药());
    }
}

export {
    医药用品,
    眼药,
    异维A,
    止泻药,
    酒精
}
