/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";

class 牙刷 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 牙膏 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 毛巾 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 澡巾 extends TreeNode {
    name = this.constructor.name;
}

class 洗发香波 extends TreeNode {
    name = this.constructor.name;
}

class 沐浴露 extends TreeNode {
    name = this.constructor.name;
}

class 肥皂 extends TreeNode {
    name = this.constructor.name;
}

class 洗漱用品 extends TreeNode {
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 牙刷());
        this.children.push(new 牙膏());
        this.children.push(new 毛巾());
        this.children.push(new 澡巾());
        this.children.push(new 肥皂());
        this.children.push(new 沐浴露());
        this.children.push(new 洗发香波());
    }
}

export {
    洗漱用品,
    牙刷,
    牙膏,
    毛巾,
    澡巾,
    肥皂,
    沐浴露,
    洗发香波,
}
