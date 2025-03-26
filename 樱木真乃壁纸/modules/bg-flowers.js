document.addEventListener("DOMContentLoaded", function () {
    const flowersContainer = this.createElement("div");
    flowersContainer.style.position = "fixed";
    flowersContainer.style.top = "0";
    flowersContainer.style.left = "0";
    flowersContainer.style.height = "100%";
    flowersContainer.style.width = "100%";
    flowersContainer.style.zIndex = "1";
    document.body.appendChild(flowersContainer);

    let globalTimer = 0;

    let startPageFlowerPartical = class {
        omiga = 0;      //角速度
        v = 0;          //直线速度
        theta = 0;      //直线速度的角度
        beginPoint = 0; //当前花瓣的初始位置
        backgroundImage = "";//当前花瓣所采用的背景图片
        axis = [];          //角速度的夹角

        initOmiga(min, max) {
            this.omiga = Math.random() * (max - min) + min;
        };

        initV(min, max) {
            this.v = Math.random() * (max - min) + min;
        }

        initBeginPoint() {
            this.beginPoint = Math.random() * (document.documentElement.clientWidth);
        }

        initBackgroundImage() {
            this.backgroundImage = "./images/flowers/flower" + Math.ceil(Math.random() * 5) + ".png";
        }

        initTheta() {
            let degree = Math.floor(Math.random() * 90) - 45;
            this.theta = Math.PI / 180 * degree;
        }

        constructor() {
            this.initOmiga(1, 2);
            this.initV(0.08, 0.2);
            this.initBeginPoint();
            this.initBackgroundImage();
            this.initTheta();
            this.axis = [Math.random() * 2, Math.random() * 2, Math.random() * 2];
        }
    }
    let startPageFlowerAnime = class extends startPageFlowerPartical {
        t = 0;          // 物理时间
        flowerContainer = null;         //花瓣的容器
        maxHeight = document.documentElement.clientHeight;      //当前窗口的宽高
        maxWidth = document.documentElement.clientWidth;
        interval = null;            //当前requestAnimationFrame()方法返回值
        status = "ready";       //表示当前花瓣状态，仅仅作为标识符使用

        checkOutofScreen() {
            if (Number.parseInt(this.flowerContainer.style.top) > this.maxHeight) {
                // console.log("outofscreen",this)
                this.destroy()
                return true;
            }
            return false;
        };

        checkAtCenter() {
            if ((Number.parseInt(this.flowerContainer.style.top) > this.maxHeight / 4) &&
                (Number.parseInt(this.flowerContainer.style.left) > this.maxWidth / 3) &&
                (Number.parseInt(this.flowerContainer.style.left) < this.maxWidth * 2 / 3)
            ) {
                this.fadeOut();

            }
        }

        play() {
            this.checkOutofScreen();
            this.checkAtCenter()
            //this.flowerContainer.style.border = "red solid 1px";
            this.status = "running";

            this.flowerContainer.style.left = this.beginPoint - this.t * this.v * Math.sin(this.theta) + "px";
            this.flowerContainer.style.top = (this.t * this.v * Math.cos(this.theta)) - 70 + "px";
            this.flowerContainer.style.transform = `rotate3d(${this.axis[0]},${this.axis[1]},${this.axis[2]},${this.omiga * this.t}deg)`;
            let that = this;
            this.interval = window.requestAnimationFrame(function (time) {
                //对当前时间轴的更新
                that.t += globalTimer / (1000 / fps);
                that.play.call(that, []);
            });
        }

        destroy() {
            window.cancelAnimationFrame(this.interval);
            this.status = "finished";

        }

        reset() {
            this.t = 0;
            this.flowerContainer.style.opacity = "1";
        }

        fadeOut() {
            this.flowerContainer.style.opacity = parseFloat(this.flowerContainer.style.opacity) - 0.05;
            if (parseFloat(this.flowerContainer.style.opacity) <= 0) {
                this.destroy();
                return true;
            }
        }

        constructor() {
            super();
            this.flowerContainer = document.createElement("div");
            this.flowerContainer.style.width = 14 - 10 * Math.sin(this.beginPoint * Math.PI / this.maxWidth) + "px";
            this.flowerContainer.style.height = 14 - 10 * Math.sin(this.beginPoint * Math.PI / this.maxWidth) + "px";
            this.flowerContainer.style.opacity = "1";
            this.flowerContainer.style.backgroundImage = `url("${this.backgroundImage}")`;
            this.flowerContainer.style.backgroundRepeat = `no-repeat`;
            this.flowerContainer.style.backgroundSize = "100% 100%";
            this.flowerContainer.style.position = "fixed";
            this.flowerContainer.style.top = "-100px";
            flowersContainer.appendChild(this.flowerContainer);
        }
    };


    // 此函数用于储存创建的花瓣对象
    const flowers = [];
    // 此函数用于一次性创建所有花瓣，之后循环复用
    let limitFlowersNumber = function (n) {
        for (let i = 0; i < n; i++) {
            flowers.push(new startPageFlowerAnime());
        }
    };
    limitFlowersNumber(200);

    //这个对象是当前花瓣的指针，用于当指定下一个出现的花瓣，也就是需要销毁的花瓣
    let flowersPointer = {
        pointer: 0,
        get next() {
            // this.pointer++;
            if (this.pointer + 1 >= flowers.length) {
                return 0;
            }
            return this.pointer + 1;
        }
    }

    let createRandomAnime = function () {
        // 重置已被销毁的花瓣的状态，当作新创建的花瓣使用
        flowers[flowersPointer.pointer].reset();
        //开始运行动画
        flowers[flowersPointer.pointer].play();
        let currPointer = flowersPointer.pointer;

        for (let i = 0; i < flowers.length / 7; i++) {
            flowersPointer.pointer = flowersPointer.next;
            try {
                flowers[flowersPointer.pointer].fadeOut();
            } catch (e) {
                console.log(`第${flowersPointer.pointer}位指针出现错误，flowers[flowersPointer.pointer]=${flowers[flowersPointer.pointer]}`)
            }
        }
        flowersPointer.pointer = currPointer;
        flowersPointer.pointer = flowersPointer.next;

        //指定下一波花瓣的创建时间
        let nextStage = Math.floor(Math.random() * 100);
        setTimeout(createRandomAnime, nextStage);
    };


    //理想fps
    let fps = 144;
    //理想fps的时间间隔
    let fpsInterval = 1000 / fps;
    //上一次执行动画的时间
    let oldTime = 0;
    //fps显示器
    const fpsCalculator = this.querySelector("#fps-calculator");
    //fps计数器
    let fpsCounter = 0;
    // fps上一次读秒的时间，因为fps是按照每秒进行计算的，所以需要记录上一次读秒的时间
    let fpsLTime = 0;
    let globalTiming = function (time) {
        // 两帧之间的差值
        let elapsed = time - oldTime;
        requestAnimationFrame(globalTiming);

        if (elapsed > fpsInterval) {

            globalTimer = elapsed;
            oldTime = time;

            // 计算fps
            fpsCounter++;
            if (time - fpsLTime >= 1000) {
                fpsCalculator.innerHTML = "" + fpsCounter + "fps";
                fpsCounter = 0;
                fpsLTime = parseInt(time / 1000) * 1000;
            }
        }
    };
    globalTiming(oldTime);

    createRandomAnime();
});
