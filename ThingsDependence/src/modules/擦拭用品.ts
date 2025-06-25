import TreeNode from "./TreeNode";

/**
 * @version v1.0
 * @ClassNmae: 擦拭用品
 * @Description: desc
 * @Author: SYANNPE
 */

class 厕纸 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}

class 湿巾 extends TreeNode {
    name = this.constructor.name;
}

class 眼镜布 extends TreeNode {
    name = this.constructor.name;
}
class 卫生纸 extends TreeNode {
    name = this.constructor.name;
}
class 擦拭用品 extends TreeNode{
    name = this.constructor.name;
    children: TreeNode[] = [];
    isNessesary = true;

    constructor() {
        super();
        this.children.push(new 厕纸());
        this.children.push(new 湿巾());
        this.children.push(new 眼镜布());
        this.children.push(new 卫生纸());
    }
}

export {
    擦拭用品,
    厕纸,
    湿巾,
    眼镜布,
    卫生纸,
}
