/*
* AUTHOR: zheng
* DATETIME: 2026/1/26-13:46
* NAME: 连续重复出现次数最多的字符
* DESC: 2.	实现一个函数：输入是一个字符串，输出字符串中连续重复出现次数最多的字符和次数，假设只有一个字符出现的次数最多
*/

const foo = function (str: string): string {
    const status = {
        _ele: null,
        get ele(): null | string {
            return this._ele;
        },
        set ele(str: string) {
            if (str === this._ele) return;

            this._ele = str;
            this.count = 0;
        },
        count: 0,
        maxCount: 0,
        maxEle: null
    };


    for (let i = 0; i < str.length; i++) {
        status.ele = str[i];
        status.count++;

        if (status.count > status.maxCount) {
            status.maxEle = str[i];
            status.maxCount = status.count;
        }
    }

    return status.maxEle + status.maxCount;
};

console.log(foo("14444112442aa44442244311222222244445444243334444ccc4444"));
