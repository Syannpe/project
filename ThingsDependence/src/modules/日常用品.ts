/**
 * @version v1.0
 * @ClassNmae: 需要带证件的时候
 * @Description: desc
 * @Author: SYANNPE
 */
import TreeNode from "./TreeNode";
import {擦拭用品} from "./擦拭用品";
import {是否需要茶具} from "./是否需要茶具";

class 水壶 extends TreeNode {
    name = this.constructor.name;
}
class 梳子 extends TreeNode {
    name = this.constructor.name;
}

class 指甲刀 extends TreeNode {
    name = this.constructor.name;
}
class 雨伞 extends TreeNode {
    name = this.constructor.name;
}
class 碳素笔 extends TreeNode {
    name = this.constructor.name;
}

class 日常用品 extends TreeNode {
    name = this.constructor.name;
        children: TreeNode[] = [];
        isNessesary = true;

        constructor() {
            super();
            this.children.push(new 擦拭用品());
            this.children.push(new 是否需要茶具());
            this.children.push(new 水壶());
            this.children.push(new 梳子());
            this.children.push(new 指甲刀());
            this.children.push(new 雨伞());
            this.children.push(new 碳素笔());
    }
}

export {
    日常用品,
    水壶,
    梳子,
    雨伞,
    碳素笔,
    指甲刀
}
