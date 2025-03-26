document.addEventListener("DOMContentLoaded", function () {
    const div = this.querySelector("#fps-calculator");
    let counter = 0;
    let lTime = 0;
    let renderer = function (nTime) {        //执行函数的时间
        counter++;
        if (nTime - lTime >= 1000) {
            div.innerHTML = "" + counter + "fps";
            counter = 0;
            lTime = parseInt(nTime / 1000) * 1000;
        }
        requestAnimationFrame(renderer);
    }
    renderer(lTime);
})