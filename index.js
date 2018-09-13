var $gameZone = document.getElementById('gameZone');
var rowNum = 5 // 盒子行数
var boxHeight = 20 // 小格子高度
// var reduce = 4 // #gridA初始top值
var step = 1 // 调节速度
// 1. 生成交替的盒子id
var createGridId = (() => {
  var gid = 'a'
  return function () {
    if (gid == 'gridA') gid = 'gridB'
    else gid = 'gridA'
    return gid
  }
})()
// 2. 生成黑块数组
function createRandomIds() {
  var arr = []
  for (let i = 0; i < rowNum; i++) {
    arr.push(Math.floor(Math.random() * 4) + i * 4)
  }
  console.log(arr, '  --  createRandomIds');
  return arr
}
// 3. 根据黑块数组+盒子id => 生成数组dom，拼到body中
var idsArr = []

function createBoxDom(identify) {
  var tempArr = createRandomIds()

  var gidStr = createGridId()
  console.log(gidStr, '  --  createBoxDom');
  var $div = document.createElement('div')
  $div.id = gidStr

  if (identify) {
    // tempArr.pop()
  } else {
    $div.style.top = '4%'
    $div.style.transform = 'translate3d(0,' + (-100) + '%,0)' // 负的BoxDom高度加上隐藏高度
  }

  idsArr = tempArr.concat(idsArr)

  var domString = ''
  for (let i = 0; i < 4 * rowNum; i++) {
    let isBlackClass = ''
    if (tempArr.indexOf(i) > -1) {
      isBlackClass = 'isBlack'
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

function move() {
  // console.time()
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
    console.log(count, gridATop, gridBTop, 'zzzzzzzzzzz');
    return
  }
  // console.timeEnd()
  myReq = requestAnimationFrame(move)
}

// 5.格子点击事件
$gameZone.addEventListener('touchstart', function (event) {
  if (isDied) return

  var event = event || window.event;
  var target = event.target || event.srcElement;
  if (target.className.indexOf('smallGrid') === -1) {
    target = target.parentNode
  }

  // 当前点击的格子是最后一个黑格
  if (Number(target.id.replace('grid_', '')) === idsArr.pop()) {
    target.className = 'smallGrid isSelect'
    count++
    console.log(count, 'addEventListener');
    if (myReq) cancelAnimationFrame(myReq)
    move()
  } else {
    target.className = 'smallGrid error'
    isDied = true
    // todo: 游戏结束，弹出遮罩
    console.log('GG');
  }
})

window.onload = () => {
  createBoxDom('first')
  createBoxDom()
}