/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 身份证 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 签证 extends TreeNode {
    name = this.constructor.name;
}
class 护照 extends TreeNode {
    name = this.constructor.name;
}
class 学生证 extends TreeNode {
    name = this.constructor.name;
}
class 是否需要证件 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 身份证());
        this.children.push(new 护照());
        this.children.push(new 签证());
        this.children.push(new 学生证());
    }
}
export { 是否需要证件, 身份证, 签证, 学生证, 护照 };
//# sourceMappingURL=%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E8%AF%81%E4%BB%B6.js.map