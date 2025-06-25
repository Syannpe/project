/**
 * @version v1.0
 * @ClassNmae: Dashboard
 * @Description: desc
 * @Author: SYANNPE
 */
class Dashboard extends EventTarget {
    opts;
    counter = 0;
    updateEvent = new Event('update');
    checkedItems = [];
    listEl;
    resultEl;
    inputEl;
    addBtnEl;
    constructor(opts) {
        super();
        this.opts = opts;
        this.listEl = document.querySelector(opts.listSelector);
        this.resultEl = document.querySelector(opts.resultSelector);
        this.inputEl = document.querySelector(opts.input);
        this.addBtnEl = document.querySelector(opts.addBtn);
        this.addBtnEl?.addEventListener('click', () => {
            const text = this.inputEl.value.trim();
            if (text) {
                this.addItem(text, false);
                this.inputEl.value = '';
            }
        });
        const that = this;
        this.addEventListener('update', () => {
            that.checkedItems = Array.from(this.listEl.querySelectorAll('li:has( .checkbox.checked)'));
        });
    }
    /** 添加一个项目，checked 初始是否选中 */
    addItem(text, checked) {
        const li = document.createElement('li');
        li.id = "dashboard-item" + (this.counter++).toString();
        const cb = document.createElement('div');
        cb.className = 'checkbox' + (checked ? ' checked' : '');
        cb.addEventListener('click', () => {
            cb.classList.toggle('checked');
            // this.updateResult();
            this.dispatchEvent(this.updateEvent);
        });
        const span = document.createElement('span');
        span.textContent = text;
        li.appendChild(cb);
        li.appendChild(span);
        this.listEl.appendChild(li);
        // this.updateResult();
        this.dispatchEvent(this.updateEvent);
        return li;
    }
    /** 切换某项选中状态 */
    toggleItem(index, checked) {
        const items = this.listEl.querySelectorAll('.checkbox');
        if (items[index]) {
            items[index].classList.toggle('checked', checked);
            // this.updateResult();
            this.dispatchEvent(this.updateEvent);
        }
    }
    /** 更新某项文字 */
    updateItemText(index, text) {
        const items = this.listEl.querySelectorAll('li span');
        if (items[index]) {
            items[index].textContent = text;
        }
    }
    /** 删除某项 */
    removeItem(index) {
        const items = this.listEl.querySelectorAll('li');
        if (items[index]) {
            this.listEl.removeChild(items[index]);
            // this.updateResult();
            this.dispatchEvent(this.updateEvent);
        }
    }
    /** 根据当前选中项更新结果区 */
    /*private updateResult() {
        const checked = Array.from(
            this.listEl.querySelectorAll('.checkbox.checked + span')
        ).map(span => span.textContent);
        this.resultEl.textContent =
            checked.length > 0
                ? '选中项：' + checked.join(', ')
                : '计算结果';
    }*/
    /** 手动设置结果区内容 */
    setResult(text) {
        this.resultEl.innerHTML = text;
    }
}
export { Dashboard };
//# sourceMappingURL=Dashboard.js.map