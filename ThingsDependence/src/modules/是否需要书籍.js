/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 哲学类书籍 extends TreeNode {
    name = this.constructor.name;
}
class 技术类 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 娱乐类 extends TreeNode {
    name = this.constructor.name;
}
class 工作类 extends TreeNode {
    name = this.constructor.name;
}
class 是否需要书籍 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 哲学类书籍());
        this.children.push(new 技术类());
        this.children.push(new 娱乐类());
        this.children.push(new 工作类());
    }
}
export { 是否需要书籍, 哲学类书籍, 技术类, 娱乐类, 工作类, };
//# sourceMappingURL=%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E4%B9%A6%E7%B1%8D.js.map