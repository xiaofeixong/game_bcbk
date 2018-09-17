// var scweb_router_url = 'http://test.scweb.fdc.com.cn/router/rest' // test
var scweb_router_url = 'http://gw.fdc.com.cn/router/rest' // line

function toolAjaxGet(method, params, callback) {
  var requrl = params.url
  var jsonpcb = params.jsonpcb
  var success = successStr(method)
  params.method = method
  delete params.url
  delete params.jsonpcb
  $.ajax({
    type: "get",
    url: requrl || scweb_router_url,
    data: params,
    dataType: "jsonp",
    jsonp: jsonpcb || "uccallback",
    success: function (res) {
      if (callback) {
        callback(res[success])
      }
    }
  })
}

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