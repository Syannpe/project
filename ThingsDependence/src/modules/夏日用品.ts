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

class 蚊香 extends TreeNode {
    name = this.constructor.name;
}

class 夏日用品 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 防晒霜());
        this.children.push(new 扇子());
        this.children.push(new 电风扇());
        this.children.push(new 墨镜());
        this.children.push(new 风油精());
        this.children.push(new 蚊香());
    }
}

export {
    夏日用品,
    防晒霜,
    扇子,
    电风扇,
    墨镜,
    蚊香,
    风油精
}
