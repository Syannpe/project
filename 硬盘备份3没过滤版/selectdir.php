<?php
include_once "./canOpenDir.php";


/*
 * $floor: 当前迭代层级
 * */
function selectdir($name, $dir, $floor, $isParent = false)
{
    global $canOpenDir;
    //需要关心的目录名称

    $res = [];
    $res['__belongTo'] = $name;
    //首先先读取文件夹
    $temp = scandir($dir);

    //遍历文件夹
    foreach ($temp as $v) {
        //获取文件绝对路径
        $a = $dir . '/' . $v;
        if ($v == '.' || $v == '..') {//判断是否为系统隐藏的文件.和..  如果是则跳过
            continue;
        }

        //如果是需要查找的目录的话则开始迭代，之后储存迭代结果
        if (is_dir($a) and $floor <= 4) {   //这里控制迭代层级，可以改
            $con = selectdir($name, $a, $floor + 1, true);
            $res = array_merge($res, $con);
        } elseif ($isParent) {

            //如果是关心的文件夹的子文件的话则插入到数组中，没有则创建
            if (!array_key_exists($dir, $res)) {
                $res[$dir] = [];
            }
            array_push($res[$dir], $v);
        }
    }

    return $res;

}
