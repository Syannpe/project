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
    children: TreeNode[] = [new 充电线];
}

class 充电宝 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [new 充电线];
}

class 有线耳机 extends TreeNode {
    name = this.constructor.name;
}

class 蓝牙耳机 extends TreeNode {
    name = this.constructor.name;
}

class 是否需要手机 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 手机充电器());
        this.children.push(new 充电宝());
        this.children.push(new 有线耳机());
        this.children.push(new 蓝牙耳机());
    }
}

export {
    是否需要手机,
    手机充电器,
    充电宝,
    有线耳机,
    蓝牙耳机
}
