$(function() {
    // 分享
    var shareConfig = {
        title: document.title,
        // title: '【惠聚亿房】购券，赢免费验房检测服务！',
        link: window.location.href,
        // desc: '报价审核、验房、装修监理、家居折扣券，总有一个你需要的！',
        desc: document.querySelector('meta[name="description"]').content,
        imgUrl: $('#top_banner img')[0].src
    }

    let curUrl = window.location.href.split('#')[0]
    let script = document.createElement('script')
    script.src = '//gw.fdc.com.cn/ucaction/ucaction.share.third.stringbody.info?currentUrl=' + encodeURIComponent(curUrl)
    script.onload = function() {
        window.wx.ready(function() {
            window.wx.onMenuShareTimeline(shareConfig)
            window.wx.onMenuShareAppMessage(shareConfig)
            wx.onMenuShareQQ(shareConfig)
            wx.onMenuShareQZone(shareConfig)

        })
    }
    document.body.appendChild(script)

})