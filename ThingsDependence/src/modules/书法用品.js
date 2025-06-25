/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
class 毛笔 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 墨块 extends TreeNode {
    name = this.constructor.name;
    isNessesary = true;
}
class 宣纸 extends TreeNode {
    name = this.constructor.name;
}
class 砚台 extends TreeNode {
    name = this.constructor.name;
}
class 书法用品 extends TreeNode {
    name = this.constructor.name;
    children = [];
    isNessesary = true;
    constructor() {
        super();
        this.children.push(new 毛笔());
        this.children.push(new 墨块());
        this.children.push(new 宣纸());
        this.children.push(new 砚台());
    }
}
export { 书法用品, 毛笔, 墨块, 宣纸, 砚台 };
//# sourceMappingURL=%E4%B9%A6%E6%B3%95%E7%94%A8%E5%93%81.js.map