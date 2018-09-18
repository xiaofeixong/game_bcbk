$(function() {
    // 分享
    var shareConfig = {
        title: document.title,
        link: window.location.href,
        desc: document.querySelector('meta[name="description"]').content,
        imgUrl: 'http://static.fdc.com.cn/zhuanti/share.jpg'
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