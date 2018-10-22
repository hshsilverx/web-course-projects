// 说明：
// 这里的图像切割采用了全图伪切割方式，即传入一张图就可以自动切割。图片得是450 px * 450 px的大小，这样才能完美匹配。不过已经免去了单独裁剪图片为9块那么麻烦了。

// 以下是正式内容
//为了更加直观，忽略了第0个元素，从1开始，第九个元素的0表示"空"
var d = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];

//为了更加直观，忽略了第0个元素，数组下标为当前格子编号，包含的数组表示位于该格子上的拼图块能移动的方向，即格子
var derection_able = [0, [2, 4], [1, 3, 5], [2, 6], [1, 5, 7], [2, 4, 6, 8], [3, 5, 9], [4, 8], [5, 7, 9], [6, 8]];

// 每一个格子的绝对位置
var gamepad_location = [0,
    ["0px", "0px"], ["150px", "0px"], ["300px", "0px"],
    ["0px", "150px"], ["150px", "150px"], ["300px", "150px"],
    ["0px", "300px"], ["150px", "300px"], ["300px", "300px"]];

//定义"暂停"的flag，时间计时器，步数计步器，时间"假线程"
var pause = true;
var time_counter = 0;
var step_counter = 0;
var time_setting;

//定义点击移动的函数
function move(id) {
    //判断是否为暂停状态，不是则继续进行操作
    let derection_able_now;
    let place_cut;
    if (!pause) {
        // 获取点击图块的位置，存储在定义好的place变量中。
        var place = Number;
        for (i = 1; i < 10; i++) {
            if (d[i] == id) {
                place = i;
                break;
            }
        }
        // derection_able_now存储了当前位置能够前往的方向或者说位置。
        derection_able_now = whereGo(place);

        //derection_able_now = 0表示没有可去的地方，可参考whereGo函数内容
        if (derection_able_now != 0) {
            // 获取前往位置的坐标信息place_cut，用于图像"伪"切割。
            place_cut = gamepad_location[derection_able_now];
            // 移动点击的图块
            document.getElementById("d" + id).style.left = place_cut[0];
            document.getElementById("d" + id).style.top = place_cut[1];
            //交换移动前后两块的编号
            d[place] = 0;
            d[derection_able_now] = id;

            // 计步器。如果是通过金手指完成的，则无论如何设置步数为正无穷大，否则步数正常+1
            if (step_counter == -1) {
                document.getElementById("step").innerHTML = "+∞ 步";
            } else {
                step_counter = step_counter + 1;
                document.getElementById("step").innerHTML = step_counter + " 步";
            }

        }
        //每走一步，检测是否完成拼图
        if (testWork()) {
            // 若已经走完，则让最后一块拼图淡化显示出来，并停止计数，弹出提示框。
            document.getElementById("last").style.opacity = "1";
            pauseGame();
            alert('恭喜你完成了拼图！');
        }
    }

}

//whereGo为核心函数，传入当前位置place，输出可以前往的格位置
function whereGo(place) {
    //局部变量direction_next存储当前位置可前往的方向或位置的数组
    let direction_next = derection_able[place];
    for (let i in direction_next) {
        // 如果为0，说明这个地方是空的，可以前往，返回这个位置编号，否则返回0。
        if (d[direction_next[i]] == 0) {
            return direction_next[i];
        }
    }
    return 0;
}


//初始化函数，主要作用是随机打乱图块位置，计时器和计步器归零。
function initial() {
    document.getElementById("last").style.opacity = "0";
    setTimeout("blank()",2000);
    time_counter = 0;
    step_counter = 0;

    document.getElementById("step").innerHTML = step_counter + " 步";
    startGame();
    var temp = Number;
    //循环十次，尽量打乱。
    //Q：为何+1？A：因为d数组第一个元素我们废弃了，这样做可以跳过他
    let number1;
    let number2;
    for (i = 0; i < 10; i++) {
        //得到1-9的随机整数两个，交换他们所代表的图块在d数组中的位置
        number1 = 1 + Math.random() * 9;
        number1 = Math.floor(number1);
        number2 = 1 + Math.random() * 9;
        number2 = Math.floor(number2);
        temp = d[number1];
        d[number1] = d[number2];
        d[number2] = temp;
    }
    //按照打乱过的d数组，从第1号元素开始重新归位。
    for (let i = 1; i < d.length; i++) {
        if (d[i] != 0) {
            document.getElementById("d" + d[i]).style.left = gamepad_location[i][0];
            document.getElementById("d" + d[i]).style.top = gamepad_location[i][1];
        }
    }
}

//testWork函数用来检测是否完成拼图
function testWork() {
    let i;
    //但凡有一个图块编码对不上在d中的位置编码，就终止循环。
    for (i = 0; i < d.length; i++) {
        if (d[i] != i) {
            break;
        }
    }
    //只有全部通过，才会有i==9，说明完成拼图了
    if (i == 9) {
        return true;
    } else {
        return false;
    }
}

//计时器
function timeCounter() {
    time_counter++;
    var minute = parseInt(time_counter / 60);
    var second = time_counter % 60;
    document.getElementById("time").innerHTML = minute + " 分 " + second + " 秒";
}

//暂停游戏
function pauseGame() {
    pause = true;
    //同时暂停计时
    clearInterval(time_setting);
}

//继续游戏
function startGame() {
    if (pause) {
        pause = false;
        //同时开始计时
        time_setting = setInterval("timeCounter()", 1000);
    }
}

function goldfinger() {
    d = new Array(0, 1, 2, 3, 4, 5, 6, 7, 0, 8);
    for (let i = 1; i < d.length; i++) {
        if (d[i] != 0) {
            document.getElementById("d" + d[i]).style.left = gamepad_location[i][0];
            document.getElementById("d" + d[i]).style.top = gamepad_location[i][1];
        }

    }
    //一旦使用金手指，步数将会被标记为-1，显示为正无穷大步，以示公正，嘿嘿。
    step_counter = -1;
    document.getElementById("step").innerHTML = "+∞ 步";
}

//这里是两个新窗口打开网页的按钮的函数web1和web2
function web1(){
    // window.location.href=https://www.zelda.com/;
    window.open("https://www.zelda.com/");
}

function web2(){
    window.open("http://www.hshsilver.com/index.php/%E5%85%B3%E4%BA%8E%E6%88%91/");
}

//每次进入网页后2s后自动重置，开始游戏
window.onload = function () {
    setTimeout("blank()",2000);
    setTimeout("initial()",4000);
};

// 让第九个图块渐变消失的单独事件，目的是在刚打开网页的时候有一个逐步的动画效果
function blank(){
    document.getElementById("last").style.opacity = "0";
}