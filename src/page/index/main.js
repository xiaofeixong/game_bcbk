var audio = document.getElementById('bgMusic');

// *首页*

// 获取当前参与人数
toolAjaxGet('ucaction.fakedata.getcount', {
    url: uc_url,
    objId: 3,
    type: 3
}, function(res) {
    console.log(res, 'xxx');
    $('#userCount').text(res.data)
});
// 兼容ios :active
document.getElementById('gameStart').addEventListener('touchstart', function() {}, false);
$('#gameStart').click(function() {
    setTimeout(function() {
        $('.home__container').hide()
        $('.game__body').show()
    }, 500);
});
// 活动弹框
$('#home_activity').click(function() {
    $('#homeMark').show();
})
$('#homeMarkClose').click(function() {
    $('#homeMark').hide('show');
})

// *游戏界面*
$('#bgAudio').click(function() {
    event.stopPropagation(); //防止冒泡
    if (audio.paused) { //如果当前是暂停状态
        $('#bgAudio').removeClass('paused')
        audio.play(); //播放
    } else { //当前是播放状态
        $('#bgAudio').addClass('paused')
        audio.pause(); //暂停
    }
});


// TODO: 设置用户头像
$('#userAvatar').attr('src', userInfo.headimgurl)

$('#playAgain').click(function(e) {
    $('#popupScore').hide()
    init()
});

// 领奖台 -- submit
$('#award').click(function(e) {
    $('#popupAward').show()
    $('#popupScore').hide()
});
$('#submit').click(function() {
    var name = $('#awardName').val()
    var phone = $('#awardPhone').val()
    if (!name.length) {
        toolDialog('姓名不能为空！')
        return
    } else if (name.length > 12) {
        toolDialog('姓名在12个字以内！')
        return
    }
    if (!/^1\d{10}$/.test(phone.replace(/\s+/g, ''))) {
        toolDialog('请输入正确的手机号！')
        return
    }
    // TODO: 提交表单
    toolAjaxGet('servicecenterapi.order.addorder', {
        gid: '5b9f696539b54e466c43cad6',
        userName: name,
        phone: phone,
        userid: '5b9f696539b54e466c43cad6',
        orderUrl: 'no',
    }, function(res) {
        console.log(res);
        toolDialog('提交成功！', function() {
            $('#popupAward').hide()
            $('#popupScore').hide()
            init()
        })
    })
});
$('#awardMarkClose').click(function() {
    $('#popupAward').hide()
    $('#popupScore').show()
});

function audioAutoPlay(id) {
    const audio = document.getElementById(id);
    const play = function() {
        audio.play();
        document.removeEventListener('touchstart', play, false);
    };
    audio.play();
    document.addEventListener('WeixinJSBridgeReady', function() { // 微信
        play();
    }, false);
    document.addEventListener('YixinJSBridgeReady', function() { // 易信
        play();
    }, false);
    document.addEventListener('touchstart', play, false);
}
audioAutoPlay('bgMusic');