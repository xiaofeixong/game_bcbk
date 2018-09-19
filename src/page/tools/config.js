// test
// var gw_url = 'http://sandbox.gw.fdc.com.cn/router/rest'
// var house_url = 'http://house.m.pre.fdc.com.cn'
// var uc_url = 'http://test.uc.fdc.com.cn/router/rest'
// var order_gid = '5b9f696539b54e466c43cad6'

// line
var gw_url = 'http://gw.fdc.com.cn/router/rest'
var house_url = 'http://decwx.fdc.com.cn'
var uc_url = 'http://gw.fdc.com.cn/router/rest'
var order_gid = '5b9f65abbc20915d7d7fe69e'
var queryString = {
    stringify: function (params) {
        var search = []
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                search.push(key + '=' + params[key])
            }
        }
        return search.join('&')
    }
}

function toolAjaxGet(method, params, callback) {
    var requrl = params.url || gw_url
    var jsonpcb = params.jsonpcb
    var success = successStr(method)
    console.log(success, 'toolAjaxGet');
    params.method = method
    delete params.url
    delete params.jsonpcb
    requrl = requrl + '?' + queryString.stringify(params)
    $.get(requrl, function (res) {
        if (res) {
            res = JSON.parse(res)
            callback(res[success])
        }
    })
}
// function toolAjaxGet(method, params, callback) {
//     var requrl = params.url || gw_url
//     var jsonpcb = params.jsonpcb
//     var success = successStr(method)
//     console.log(success, 'toolAjaxGet');
//     params.method = method
//     delete params.url
//     delete params.jsonpcb
//     $.ajax({
//         type: "get",
//         url: requrl || scweb_router_url,
//         data: params,
//         dataType: "jsonp",
//         jsonp: jsonpcb || "uccallback",
//         success: function(res) {
//             if (callback) {
//                 callback(res[success])
//             }
//         },
//         error: function(res) {
//             console.log(res, params.method, 'ajax error');
//         }
//     })
// }

function successStr(method) {
    var arr = method.split('.')
    arr.splice(0, 1)
    arr.push('response')
    return arr.join('_')
}



// 弹框提示
function toolDialog(msg, callback) {
    $('#dialogTip').text(msg).show()
    setTimeout(function () {
        $("#dialogTip").animate({
                opacity: 0,
            }, 1000,
            'ease-out',
            function () {
                $('#dialogTip').hide().css('opacity', 1)
                callback()
            })
    }, 1000);
}

// 获取cookie
var docCookies = {
    getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        sPath = sPath || '/';
        sDomain = sDomain || '.fdc.com.cn';
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

var userInfo = {}
userInfo.openid = docCookies.getItem('openid')

if (!userInfo.openid) {
    // TODO: 用户授权：后台处理
    window.location.href = house_url + '/weixinServlet?sourceUrl=' + window.location.href
} else {
    userInfo.headimgurl = docCookies.getItem('headimgurl')
    userInfo.nickname = docCookies.getItem('nickname')
    toolAjaxGet('activeweb.restful.isUser', {
        url: house_url + '/activeweb.restful.isUser',
        openId: userInfo.openid
    }, function (res) {
        if (!res.data) {
            toolAjaxGet('ucaction.fakedata.plus', {
                url: uc_url,
                objId: 3,
                type: 3
            }, function (res) {
                if (res.data) {
                    $('#userCount').text(res.data)
                }
            })
        }
    })
}
console.log(JSON.stringify(userInfo), 'get in');