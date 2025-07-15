/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Task from "../models/Task.js";
var TableCellStatus;
(function (TableCellStatus) {
    TableCellStatus[TableCellStatus["EMPTY"] = 0] = "EMPTY";
    TableCellStatus[TableCellStatus["HALF"] = 1] = "HALF";
    TableCellStatus[TableCellStatus["FULL"] = 2] = "FULL";
})(TableCellStatus || (TableCellStatus = {}));
class HTMLInterface {
    // 来自 DrawOptions
    important;
    after;
    finished;
    // 自定义绘制方法
    handleImportant() {
    }
    ;
    handleAfter() {
    }
    ;
    handleFinished() {
    }
    ;
    rowDate = [];
    drawRow(id, name, earlyStart, lateStart, earlyEnd, lateEnd, color, equation) {
        const monthList = this.remainingDaysByMonthList(this.startTime, this.endTime);
        const chartTableBody = document.querySelector("#chart-table>tbody");
        chartTableBody.innerHTML += `<tr>
        <td>${id}</td>
        <td title="${equation ? `(${equation})` : ""}">${name}</td>
        <td>${earlyStart.toLocaleDateString()}</td>
        <td>${earlyEnd.toLocaleDateString()}</td>
        <td>${lateStart.toLocaleDateString()}</td>
        <td>${lateEnd.toLocaleDateString()}</td>
        <td>${Math.floor((earlyEnd.getTime() - lateStart.getTime()) / 1000 / 60 / 60 / 24)}-${Math.floor((lateEnd.getTime() - earlyStart.getTime()) / 1000 / 60 / 60 / 24)}</td>
        <td>
            <table class="task">
                <tbody>
                <tr style="--background-color:${color};--cellNum:${monthList.reduce(function (lv, rv) {
            return lv + rv.daysRemaining.length;
        }, 0)}">
                    
                </tr>
                </tbody>
            </table>
        </td>
    </tr>`;
        // 生成一个和当前总天数相同的缓存空间用于记录描绘的单元格
        this.rowDate.push(Array.from({
            *[Symbol.iterator]() {
                for (let i = 0; i < monthList.length; i++) {
                    for (let j = 0; j < monthList[i].daysRemaining.length; j++) {
                        yield TableCellStatus.EMPTY;
                    }
                }
            }
        }));
        return this.rowDate.length - 1;
    }
    // 绘制“时间轴”用的重载方法
    drawDate(rowNum, earlyStart, lateStart, earlyEnd, lateEnd, proportion, options) {
        // 计算当前时间和初始时间差了多少天
        let toRelativeDate = (time) => {
            return Math.floor((time.getTime() - this.startTime.getTime()) / 1000 / 60 / 60 / 24);
        };
        let toAbsoluteDate = (days) => {
            return new Date(this.startTime.getTime() + days * 1000 * 60 * 60 * 24);
        };
        if (options && options.after && options.after.constructor === Task) {
            if (earlyStart < options.after.earlyEnd) {
                earlyStart = typeof options.after.earlyEnd === "number" ? toAbsoluteDate(options.after.earlyEnd) : options.after.earlyEnd;
            }
            if (lateStart < options.after.lateEnd) {
                lateStart = typeof options.after.lateEnd === "number" ? toAbsoluteDate(options.after.lateEnd) : options.after.lateEnd;
            }
        }
        const rEarlyStart = toRelativeDate(earlyStart);
        const rLateStart = toRelativeDate(lateStart);
        const rEarlyEnd = toRelativeDate(earlyEnd);
        const rLateEnd = toRelativeDate(lateEnd);
        //查看是否有重叠
        for (let i = rEarlyStart; i < rLateStart; i++) {
            if (this.rowDate[rowNum][i] !== TableCellStatus.EMPTY)
                console.warn(toAbsoluteDate(i).toLocaleDateString() + "的绘图数据已被覆盖");
            this.rowDate[rowNum][i] = TableCellStatus.HALF;
        }
        for (let i = rLateStart; i < rEarlyEnd; i++) {
            if (this.rowDate[rowNum][i] !== TableCellStatus.EMPTY)
                console.warn(toAbsoluteDate(i).toLocaleDateString() + "的绘图数据已被覆盖");
            this.rowDate[rowNum][i] = TableCellStatus.FULL;
        }
        for (let i = rEarlyEnd; i < rLateEnd; i++) {
            if (this.rowDate[rowNum][i] !== TableCellStatus.EMPTY)
                console.warn(toAbsoluteDate(i).toLocaleDateString() + "的绘图数据已被覆盖");
            this.rowDate[rowNum][i] = TableCellStatus.HALF;
        }
        this.drawCache(rowNum, proportion, options);
    }
    ;
    drawCache(rowNum, proportion = 1, options) {
        const tableRow = document.querySelector(`#chart-table>tbody>tr:nth-of-type(${rowNum + 1}) table.task tr`);
        tableRow.innerHTML = "";
        let currentStatus = null;
        let currentStatusCellNumber = 0;
        let proportionCounter = -1;
        for (let i = 0; i <= this.rowDate[rowNum].length; i++) {
            if (currentStatus === null)
                currentStatus = this.rowDate[rowNum][i];
            if (currentStatus !== this.rowDate[rowNum][i]) {
                const td = document.createElement("td");
                td.style.setProperty("--colspan", currentStatusCellNumber + "");
                switch (currentStatus) {
                    case TableCellStatus.HALF:
                        td.className = "half-colored";
                        options && options.important && options.important === true && td.classList.add("important");
                        options && options.finished && options.finished === true && td.classList.add("finished");
                        break;
                    case TableCellStatus.FULL:
                        td.className = "colored";
                        options && options.important && options.important === true && td.classList.add("important");
                        options && options.finished && options.finished === true && td.classList.add("finished");
                        if (typeof proportion === "number") {
                            if (Number.isNaN(proportion)) {
                                td.innerText = "?%";
                            }
                            else {
                                td.innerText = proportion * 100 + "%";
                            }
                        }
                        else {
                            if (proportionCounter + 1 === proportion.length) {
                                proportionCounter = -1;
                            }
                            td.innerText = proportion[++proportionCounter] * 100 + "%";
                        }
                        td.style.setProperty("--colspan", currentStatusCellNumber + "");
                        break;
                    case TableCellStatus.EMPTY:
                        td.className = "";
                        break;
                }
                tableRow.appendChild(td);
                currentStatusCellNumber = 0;
            }
            currentStatus = this.rowDate[rowNum][i];
            currentStatusCellNumber++;
        }
        /* const lastTd = document.createElement("td");
         lastTd.style.setProperty("--colspan", currentStatusCellNumber + "");

         switch (currentStatus) {
             case TableCellStatus.HALF:
                 lastTd.className = "half-colored";
                 break;
             case TableCellStatus.FULL:
                 lastTd.className = "colored";

                 if (typeof proportion === "number")
                     lastTd.innerText = proportion * 100 + "%";
                 else {
                     if (proportionCounter + 1 === proportion.length) {
                         proportionCounter = -1;
                     }
                     lastTd.innerText = proportion[++proportionCounter] * 100 + "%"
                 }
                 lastTd.style.setProperty("--colspan", currentStatusCellNumber + "");
                 break;
             case TableCellStatus.EMPTY:
                 lastTd.className = "";
                 break;
         }

         tableRow.appendChild(lastTd);*/
    }
    /**
     * 计算从 start 到 end 之间，每个月还剩哪些天（含首尾各自当天）。
     * @param {string|Date} start – 开始日期（如 "2025-07-30" 或 Date 实例）
     * @param {string|Date} end   – 结束日期（如 "2025-09-05" 或 Date 实例）
     * @returns {Array<{year: number, month: number, daysRemaining: number[]}>}
     */
    /*
    [
      { year:2025, month:7,  daysRemaining: [30, 31] },    // 7月还剩 30、31 两天
      { year:2025, month:8,  daysRemaining: [1,2,…,31] },   // 8月整月
      { year:2025, month:9,  daysRemaining: [1,2,3,4,5] }   // 9月 1–5
    ]
    */
    remainingDaysByMonthList(start, end) {
        const s = start instanceof Date ? start : new Date(start);
        const e = end instanceof Date ? end : new Date(end);
        if (s > e)
            throw new Error("开始日期必须早于或等于结束日期");
        // 工具：返回某年某月总天数（month 参数：1-12）
        function daysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        }
        const result = [];
        let year = s.getFullYear();
        let month = s.getMonth() + 1; // JS 0-11 -> 我们用 1-12
        // 如果首尾在同一个月，直接返回一项
        if (year === e.getFullYear() && month === e.getMonth() + 1) {
            const arr = [];
            for (let d = s.getDate(); d <= e.getDate(); d++) {
                arr.push(d);
            }
            return [{ year, month, daysRemaining: arr }];
        }
        // 否则按月遍历
        while (year < e.getFullYear() || (year === e.getFullYear() && month <= e.getMonth() + 1)) {
            const total = daysInMonth(year, month);
            let daysArr = [];
            if (year === s.getFullYear() && month === s.getMonth() + 1) {
                // 首月（非尾月）：从 start.getDate() 到月底
                for (let d = s.getDate(); d <= total; d++) {
                    daysArr.push(d);
                }
            }
            else if (year === e.getFullYear() && month === e.getMonth() + 1) {
                // 末月（非首月）：从 1 到 end.getDate()
                for (let d = 1; d <= e.getDate(); d++) {
                    daysArr.push(d);
                }
            }
            else {
                // 中间整月：1 到 total
                for (let d = 1; d <= total; d++) {
                    daysArr.push(d);
                }
            }
            result.push({ year, month, daysRemaining: daysArr });
            // 前进到下一个月
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }
        return result;
    }
    initCaption() {
        return `${this.startTime.getFullYear()}/${this.startTime.getMonth() + 1}/${this.startTime.getDate()}~${this.endTime.getFullYear()}/${this.endTime.getMonth() + 1}/${this.endTime.getDate()} Gantte Chart`;
    }
    initTimeTable() {
        const monthList = this.remainingDaysByMonthList(this.startTime, this.endTime);
        return `
        <table id="time-table">
                <colgroup>
                ${(() => {
            let res = "";
            for (let i = 0; i < monthList.length; i++) {
                for (let j = 0; j < monthList[i].daysRemaining.length; j++) {
                    res += `<col>`;
                }
            }
            return res;
        })()}
                    
                </colgroup>
                <thead>
                <tr>
        ${(() => {
            let res = "";
            for (let i = 0; i < monthList.length; i++) {
                if (monthList[i].daysRemaining.length > 4)
                    res += `<th colspan="${monthList[i].daysRemaining.length}">${monthList[i].year}年${monthList[i].month}月</th>`;
                else
                    res += `<th colspan="${monthList[i].daysRemaining.length}"></th>`;
            }
            return res;
        })()}
                </tr>
                </thead>
                <tbody>
                <tr>
        ${(() => {
            let res = "";
            for (let i = 0; i < monthList.length; i++) {
                for (let j = 0; j < monthList[i].daysRemaining.length; j++) {
                    res += `<td>${monthList[i].daysRemaining[j]}</td>`;
                }
            }
            return res;
        })()}
                </tr>
                </tbody>
            </table>
        `;
    }
    startTime;
    endTime;
    init(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        const chartTableCaption = document.querySelector("#chart-table caption");
        chartTableCaption.innerHTML = this.initCaption();
        const timeTableContainer = document.querySelector("#time-table-container");
        timeTableContainer.innerHTML = this.initTimeTable();
    }
    static instance;
    constructor() {
    }
    /** 获取单例 */
    static getInstance() {
        if (!HTMLInterface.instance) {
            HTMLInterface.instance = new HTMLInterface();
        }
        return HTMLInterface.instance;
    }
}
export { HTMLInterface, TableCellStatus };
//# sourceMappingURL=HTMLInterface.js.map