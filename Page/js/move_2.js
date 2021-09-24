// 判斷鼠標往上往下才能決定currentDirection
// 用e.clientY、clientY
let currentDirection
let y = 0
let clientY = 0
let bottom = 0
let top = 0
let H; // 空白區塊下方的卡片高度，(translateY的距離)
let currentH // 選定區域的高度
let totalH // trip-list距離trip-list最上方的高度(scrollbar開始滑動的高度)
let selectD // 選定漂浮區塊距離trip-list上方的高度
let selectH // 選定區塊的高度
let stopCardMove // 漂浮區塊停止移動，卷軸開始移動
let timeId // TimeInterval Id
let scrollDirection // scroll移動方向

tripListDayContainer = document.querySelector('.trip-list-day-container');

function checkDirection() {
  if (clientY !== 0) {
    if (clientY > e.clientY) {
      currentDirection = 'up'
      y = y - (clientY - e.clientY)
    }
    else if (clientY < e.clientY) {
      currentDirection = 'down'
      y = y + (e.clientY - clientY)
    }
    else {
      currentDirection = 'same'
    }
  }
  // 記錄前一次數值用於下次比較
  clientY = e.clientY
}
function asyncMove(){
  timeId = setInterval(() => {
    target = target + 1
    tripListDayContainer.scroll(0, target)
    if(target > H / 2){
      if(scrollDirection == 'up'){
        // 1. 代表上面區塊要往下移
        // 2. 空白區塊要與上面的區塊交換資料
        changeData()
        // 3. 初始化參數
        initialParameter()
      }
      else if(scrollDirection == 'down'){
        // 1. 代表下面區塊要往上移
        // 2. 空白區塊要與下面的區塊交換資料
        changeData()
        // 3. 初始化參數
        initialParameter()
      }
    }
  }, 50);
}

// 放在mousemove的事件中，代表要有移動才觸發，scroll bar作為非同步線程
function updateMove() {
  // clear timeId，先清除timeId後重新判斷
  window.clearInterval(timeId)
  if (currentDirection == 'down') {
    // 漂浮卡片移動(往下)
    selectD = selectD + y  // 有可能超出畫面
    stopCardMove = scrollMove()
    // 檢查是否scroll bar需要滾動
    if (stopCardMove) {
      if (timeId) { return }
      else {
        // 非同步線程，scroll bar滑動
        asyncMove()
      }
    }
    else {
      // 代表沒有滑動到底部
      bottom = bottom + y
      target = bottom
      if (target > H / 2) {
        // 1. 代表下面區塊要往上移
        // 2. 空白區塊要與下面的區塊交換資料
        changeData()
        // 3. 初始化參數
        top = currentH - bottom
        bottom = (currentH - bottom) * (-1)
      }
    }
  }
  else if (currentDirection == 'up') {
    // 在底部，然後scroll bar往下移動，但鼠標是往上
    selectD = selectD - y
    stopCardMove = scrollMove()
    // 檢查是否scroll bar需要滾動
    if (stopCardMove) {
      if (timeId) { return }
      else {
        // 非同步線程，scroll bar滑動
        asyncMove()
      }
    }
    else {
      top = top + y
      target = top
      if (top > H / 2) {
        // 1. 代表上面區塊要往下移
        // 2. 空白區塊要與上面的區塊交換資料
        changeData()
        // 3. 初始化參數
        bottom = currentH - top
        top = (currentH - top) * (-1)
      }
    }
  }
}

function scrollMove() {
  // 用非同步的方式觸發
  // 停止條件，scrollbar碰到頂部或底部
  if (selectD > totalH) {
    // 到達trip-list底部，並且scroll bar開始滑動
    scrollDirection = 'down'
    return true
  }
  if (selectD < H) {
    // 到達trip-list頂部，並且scroll bar開始滑動
    scrollDirection = 'up'
    return true
  }
  scrollDirection = ''
  return false
}
function changeData() {
  // 空白的區塊與上面/下面交換資料
}