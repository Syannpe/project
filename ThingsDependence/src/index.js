import { Dashboard } from "./modules/Dashboard";
import { 是否需要证件 } from "./modules/是否需要证件";
import { 是否需要衣服 } from "./modules/是否需要衣服";
import { 是否需要电脑 } from "./modules/是否需要电脑";
import { 是否需要手机 } from "./modules/是否需要手机";
import { 是否需要书籍 } from "./modules/是否需要书籍";
import { 是否需要小提琴 } from "./modules/是否需要小提琴";
import { 是否需要茶具 } from "./modules/是否需要茶具";
import { 出国用品 } from "./modules/出国用品";
import { 洗漱用品 } from "./modules/洗漱用品";
import { 擦拭用品 } from "./modules/擦拭用品";
import { 日常用品 } from "./modules/日常用品";
import { 夏日用品 } from "./modules/夏日用品";
import { 医药用品 } from "./modules/医药用品";
import { 书法用品 } from "./modules/书法用品";
import { 外地住宿用品 } from "./modules/外地住宿用品";
import { 坐飞机火车 } from "./modules/坐飞机火车";
export default class Index {
    elementToTreeNode = new Map();
    #dfs(node, level, cb) {
        // 递归终止条件
        if (!node) {
            return;
        }
        // 递归处理当前节点
        cb(node, level);
        // 递归处理子节点
        for (let i = 0; i < node.children.length; i++) {
            this.#dfs(node.children[i], level + 1, cb);
        }
    }
    getAllDependents(roots, cb) {
        //     深度优先遍历每一个根节点，之后对每一个节点执行回调
        //     同时需要记录当前迭代层级
        for (let i = 0; i < roots.length; i++) {
            this.#dfs(roots[i], 0, cb);
        }
    }
    static main() {
        const main = new Index();
        // 初始化
        const dash = new Dashboard({
            listSelector: '.item-list',
            resultSelector: '#resultBox',
            addBtn: '#addItemBtn',
            input: '#newItemInput'
        });
        // 示例：添加两个初始项目
        // 现在需要把类绑定至每一个html项上，之后灵活触发事件
        main.elementToTreeNode.set(dash.addItem(是否需要证件.name, false).id, new 是否需要证件());
        main.elementToTreeNode.set(dash.addItem(是否需要衣服.name, false).id, new 是否需要衣服());
        main.elementToTreeNode.set(dash.addItem(是否需要电脑.name, false).id, new 是否需要电脑());
        main.elementToTreeNode.set(dash.addItem(是否需要手机.name, false).id, new 是否需要手机());
        main.elementToTreeNode.set(dash.addItem(是否需要书籍.name, false).id, new 是否需要书籍());
        main.elementToTreeNode.set(dash.addItem(是否需要小提琴.name, false).id, new 是否需要小提琴());
        main.elementToTreeNode.set(dash.addItem(是否需要茶具.name, false).id, new 是否需要茶具());
        main.elementToTreeNode.set(dash.addItem(洗漱用品.name, false).id, new 洗漱用品());
        main.elementToTreeNode.set(dash.addItem(擦拭用品.name, false).id, new 擦拭用品());
        main.elementToTreeNode.set(dash.addItem(日常用品.name, false).id, new 日常用品());
        main.elementToTreeNode.set(dash.addItem(夏日用品.name, false).id, new 夏日用品());
        main.elementToTreeNode.set(dash.addItem(医药用品.name, false).id, new 医药用品());
        main.elementToTreeNode.set(dash.addItem(书法用品.name, false).id, new 书法用品());
        main.elementToTreeNode.set(dash.addItem(出国用品.name, false).id, new 出国用品());
        main.elementToTreeNode.set(dash.addItem(坐飞机火车.name, false).id, new 坐飞机火车());
        main.elementToTreeNode.set(dash.addItem(外地住宿用品.name, false).id, new 外地住宿用品());
        dash.addEventListener('update', () => {
            let res = "";
            let prevLevel = 0;
            main.getAllDependents(dash.checkedItems
                .map(item => main.elementToTreeNode.get(item.id))
                .filter((n) => !!n), (node, level) => {
                const label = node.isNessesary
                    ? node.name
                    : `${node.name}(非必要)`;
                // 1. 如果下降了层级，需要闭合多余的 </li></ul>
                if (level < prevLevel) {
                    res += "</li></ul>".repeat(prevLevel - level);
                }
                // 2. 如果同层或上升一层，先闭合上一个 <li>
                else if (level === prevLevel && prevLevel > 0) {
                    res += "</li>";
                }
                // 3. 如果上升了层级，打开新的 <ul>
                if (level > prevLevel) {
                    res += "<ul>".repeat(level - prevLevel);
                }
                // 4. 打开当前 <li> 并写入节点名称
                res += `<li>${label}`;
                // 如果没有子节点，立刻闭合当前 <li>
                if (node.children.length === 0) {
                    res += "</li>";
                }
                // 更新 prevLevel
                prevLevel = level;
            });
            // 循环结束后，闭合最后残留的 </li></ul>
            if (prevLevel >= 0) {
                res += "</li></ul>".repeat(prevLevel + 1);
            }
            dash.setResult(res);
        });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    Index.main();
});
import "./style.css";
//# sourceMappingURL=index.js.map