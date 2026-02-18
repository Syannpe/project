/*
* AUTHOR: zheng
* DATETIME: 2026/1/26-13:31
* NAME: 回文字符串
* DESC: 递归判断回文字符串
*/

const bar = function (str: string, pos: number, len: number) {
    if (pos + 1 > Math.ceil(len / 2)) return true;

    return bar(str, pos + 1, len) && str[pos] === str[str.length - 1 - pos];

}
const foo = function (str: string): boolean {

    return bar(str, 0, str.length);
};

console.log(foo("level1"))

