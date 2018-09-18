$(function() {
    var $gameZone = document.getElementById('gameZone');
    var rowNum = 5 // 盒子行数
    var reduce = '8%' // #gridA初始top值6
    var step = 1.3 // 调节速度
    var boxHeight = 1 / rowNum * 100 // 小格子高度
        // 1. 生成交替的盒子id
    var createGridId = (function() {
            var gid = 'a'
            return function() {
                if (gid == 'gridA') gid = 'gridB'
                else gid = 'gridA'
                return gid
            }
        })()
        // 2. 生成黑块数组
    function createRandomIds() {
        var arr = []
        for (var i = 0; i < rowNum; i++) {
            arr.push(Math.floor(Math.random() * 4) + i * 4)
        }
        console.log(arr, '  --  createRandomIds');
        return arr
    }

    function createWhiteGrid() {
        var whiteArr = []
        for (var i = 0; i < rowNum; i++) {
            var whiteNum = Math.floor(Math.random() * 4)
            for (var j = 0; j <= whiteNum; j++) {
                whiteArr.push(Math.floor(Math.random() * 4) + i * 4)
            }
        }
        return whiteArr
    }
    // 3. 根据黑块数组+盒子id => 生成数组dom，拼到body中
    var idsArr = []

    function createBoxDom(identify) {
        var tempArr = createRandomIds() // 黑块ids
        var whiteArr = createWhiteGrid() // 白块ids

        var gidStr = createGridId()
        console.log(gidStr, '  --  createBoxDom');
        var $div = document.createElement('div')
        $div.id = gidStr

        if (identify) {
            tempArr.pop()
            $div.style.transform = 'translate3d(0,0%,0)'
        } else {
            $div.style.top = reduce
            $div.style.transform = 'translate3d(0,' + (-100) + '%,0)' // 负的BoxDom高度加上隐藏高度
        }

        idsArr = tempArr.concat(idsArr)

        var domString = ''
        for (var i = 0; i < 4 * rowNum; i++) {
            var isBlackClass = ''
            if (tempArr.indexOf(i) > -1) {
                isBlackClass = 'isBlack'
            } else if (whiteArr.indexOf(i) > -1) {
                isBlackClass = 'isWhite'
            }
            domString += '<div class="smallGrid ' + isBlackClass + '" id="grid_' + i + '"><div class="box"></div></div>'
        }
        $div.innerHTML = domString
        $gameZone.appendChild($div);
    }
    // 4. 盒子移动动画函数
    var distance = 0 // 总移动距离
    var count = 0 // 总得分，即点击黑块次数
    var isDied = false
    var myReq
    $('#gameCount').text(count);

    function move() {
        distance += step
            // transform: translate3d(0,30%,0);

        var $gridA = document.getElementById('gridA')
        var gridATop = $gridA.style.transform === '' ? 0 : Number($gridA.style.transform.split(',')[1].replace('%', ''))
        gridATop += step
        $gridA.style.transform = 'translate3d(0,' + gridATop + '%,0)'
        if (gridATop >= boxHeight * rowNum) { // BoxDom初始显示高度
            $gameZone.removeChild($gridA)
            createBoxDom()
        }

        var $gridB = document.getElementById('gridB')
        var gridBTop = Number($gridB.style.transform.split(',')[1].replace('%', ''))
        gridBTop += step
        $gridB.style.transform = 'translate3d(0,' + gridBTop + '%,0)'
        if (gridBTop >= boxHeight * rowNum) {
            $gameZone.removeChild($gridB)
            createBoxDom()
        }
        if (distance >= count * boxHeight || isDied) {
            // console.log(count, gridATop, gridBTop, 'zzzzzzzzzzz');
            return
        }
        myReq = requestAnimationFrame(move)
    }

    // 5.格子点击事件
    $('#gameZone').on('touchstart', function(event) {
        if (isDied) return

        var event = event || window.event;
        var target = event.target || event.srcElement;
        if (target.className.indexOf('smallGrid') === -1) {
            target = target.parentNode
        }
        if (target.className.indexOf('smallGrid') === -1) return

        // 当前点击的格子是最后一个黑格
        if (Number(target.id.replace('grid_', '')) === idsArr.pop()) {
            target.style.opacity = 0.5
            count++
            if (count % 15 === 0) {
                step += .05
                console.log('加速了---', step);
            }
            if (count === 1) {
                run('10:00')
            }
            $(target).removeClass('clickme')
            if (count <= 3) {
                clickme()
            }
            $('#gameCount').text(count)
                // console.log(count, 'addEventListener');
            if (myReq) cancelAnimationFrame(myReq)
            move()
        } else {
            target.className = 'smallGrid error'
            stop()
            console.log('GG');
        }
    })

    // 6.倒计时
    var countDownTimer

    function run(startTime) { //定义时间函数，让秒表每100ms变化一次
        function onTimer() {
            //如果倒计时结束清除时间函数
            if (startTime == '00:00') {
                stop()
                startTime = "00:01"; //(清除时间函数后还是会执行一次 所以多给一个10ms再动态赋值)
            }

            var hms = new String(startTime).split(":"); //以:作为分隔符号取字符串内的数据
            var ms = new Number(hms[1]); //给每个数据定义对象
            var s = new Number(hms[0]);

            ms -= 1; //每次执行ms减10

            //判断时间并进行变化
            if (ms < 0) {
                ms = 99;
                s -= 1;
            }
            var ms = ms < 10 ? ("0" + ms) : ms; //如果出现个位数给个位数前面添加0
            var ss = s < 10 ? ("0" + s) : s;
            startTime = ss + ":" + ms;
            $('#gameTime').text(startTime)
        }
        countDownTimer = setInterval(onTimer, 10); //100ms的定时器
    }

    // 7.游戏结束，弹出弹框
    var currentRanking = ''

    function stop() {
        isDied = true
        clearInterval(countDownTimer);
        setTimeout(function() {
            $('#gamePopupAvatar').attr('src', userInfo.headimgurl)
            $('#popupScore').show()
            toolAjaxGet('activeweb.restful.addIntegralRecord', {
                url: house_url + '/activeweb.restful.addIntegralRecord',
                openid: userInfo.openid,
                nickname: userInfo.nickname,
                headimgurl: userInfo.headimgurl,
                integral: count
            }, function(res) {
                console.log(res, '新增用户');
                $('#userScore').text(count);
                // TODO: 排名
                currentRanking = res.ranking
                $('#userRanking').text(res.ranking);
            })
        }, 500)
    }

    // 8.找到最近一个格子
    function clickme() {
        $('#grid_' + idsArr[idsArr.length - 1]).addClass('clickme')
    }

    window.init = function() {
        $('#gameZone').children().remove()
        idsArr = []
        count = 0
        startTime = '10:00'
        distance = 0 // 总移动距离
        isDied = false
        myReq = ''
        $('#gameCount').text(count)
        $('#gameTime').text(startTime)
        setTimeout(function() {
            createBoxDom('first')
            createBoxDom()
            clickme()
        }, 100);
    }

    // 排行榜

    $('#ranking').click(function() {
        $('#rankingTable').children().remove()
        toolAjaxGet('activeweb.restful.getRanking', {
            url: house_url + '/activeweb.restful.getRanking'
        }, function(res) {
            console.log(res.data, '排行榜数据');
            $('#currentRanking').text(currentRanking);

            // TODO: 获取排行榜数据，渲染
            var domString = '<ul class="game__ranking-title"><li>排名</li><li>头像</li><li>昵称</li><li>积分</li></ul>'
            res.data.forEach(function(el, index) {
                domString += '<ul class="game__ranking-item"><li>No.' + (index +
                        1) +
                    '</li><li><img src=" ' + el.headimgurl +
                    '" class="game__ranking-avatar"></li><li>' + el.nickname +
                    '</li><li>' +
                    el.integral +
                    '</li></ul>'
            });
            $('#rankingTable').append(domString);
            $('#popupRanking').show();
        })
    });
    $('#rankingMarkClose').click(function() {
        $('#popupRanking').hide()
    });

    init()
})