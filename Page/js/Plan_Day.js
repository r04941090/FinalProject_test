const dayCell = {
  props: ['tripData', 'selectDay', 'edit'],
  emits: ['deleteData'],
  template: `
    <div class="day-cell" :class="{'HighlightDay': tripData.Date == selectDay.Date, 'edit-mode': edit}">
      <div class="drag-handler" v-if="edit"></div>
      <div class="day-cell-content">
        <span :style="{fontWeight: tripData.Date == selectDay.Date ? 900 : 400}"  class="pt-1">{{tripData.Date}}</span>
        <span>DayId: {{tripData.DayId}}</span>
        <span class="day-number">第{{tripData.Day}}天</span>
        <div class="delete" @click="deleteData" v-if="edit">
          <i class="fas fa-trash delete-tool"></i>
        </div>
      </div>
    </div>`,
  methods: {
    deleteData() {
      this.$emit('deleteData', this.tripData)
    }
  }
}
const App = {
  data() {
    return {
      edit: false,
      dayContainer: '',
      dayItems: '',
      selectDay: '',
      dayCard: '',

      ScrollOption: {
        left: '',
        behavior: 'smooth'
      },
      x: 0,
      interval_x: '', // 鼠標移動的距離
      clientX: 0, // 之前的滑鼠鼠標位置
      selectRight: 0, // 選定區域的底部
      selectLeft: 0, // 選定區域的頂部

      // 共同的變數
      ChangeData: {
        old: '',
        new: ''
      },
      clickTag: '',
      steps: [],
      currentDirection: '',
      totalD: '', // trip-list-day-container的高度
      selectD: '', // 選定漂浮區塊距離trip-list上方的高度
      selectL: '', // 選定區塊的高度 (translateY的距離)
      stopCardMove: '', // 漂浮區塊停止移動，卷軸開始移動
      stopScroll: '', // 停止Scroll bar移動
      timeId: 0, // TimeInterval Id
      scrollTarget: '', // scroll bar移動的目標終點
      scrollInterval: 0, // scroll bar移動距離
      currentId: '', // 目前選定的ID
      clickId: '',
      rawData: {
        "UserId": 1,
        "TripId": 1,
        "TripTitle": "台北兩天一夜",
        "StartDate": "2021年9月10日",
        "TotalDate": 2,
        "TripContent": [
          {
            "Type": "Day",
            "Id": 1,
            "DayId": 1,
            "Color": "#ff4477",
            "Day": 1,
            "Date": "9月10日",
            "Weekday": "星期一",
            "Sequence": 0,
            "StartTime": "09:00"
          },
          {
            "Type": "Place",
            "Id": 2,
            "DayId": 1,
            "Color": "#ff4477",
            "Day": 1,
            "TripDetailsId": 1,
            "Sequence": 1,
            "PlaceName": "台北新光三越",
            "StayTime": "1 小時 30 分",
            "StartTime": "09:00",
          },
          {
            "Type": "Place",
            "Id": 3,
            "DayId": 1,
            "Color": "#ff4477",
            "Day": 1,
            "TripDetailsId": 2,
            "Sequence": 2,
            "PlaceName": "台中火車站",
            "StayTime": "30 分",
          },
          {
            "Type": "Day",
            "Id": 4,
            "DayId": 2,
            "Color": "#3b86ff",
            "Day": 2,
            "Date": "9月11日",
            "Weekday": "星期二",
            "Sequence": 0,
            "StartTime": "08:00"
          },
          {
            "Type": "Place",
            "Id": 5,
            "DayId": 2,
            "Color": "#3b86ff",
            "Day": 2,
            "TripDetailsId": 3,
            "Sequence": 1,
            "PlaceName": "Build School",
            "StayTime": "30 分",
            "StartTime": "08:00",
          },
          {
            "Type": "Place",
            "Id": 6,
            "DayId": 2,
            "Color": "#3b86ff",
            "Day": 2,
            "TripDetailsId": 4,
            "Sequence": 2,
            "PlaceName": "大稻埕碼頭廣場",
            "StayTime": "10 分",
            "StartTime": "09:20",
          },
          {
            "Type": "Place",
            "Id": 7,
            "DayId": 2,
            "Color": "#3b86ff",
            "Day": 2,
            "TripDetailsId": 5,
            "Sequence": 3,
            "PlaceName": "霞海城隍廟",
            "StayTime": "30 分",
            "StartTime": "10:20",
          },
          {
            "Type": "Day",
            "Id": 8,
            "DayId": 3,
            "Color": "#71b85f",
            "Day": 3,
            "Date": "9月12日",
            "Weekday": "星期三",
            "Sequence": 0,
            "StartTime": "10:00"
          },
          {
            "Type": "Day",
            "Id": 9,
            "DayId": 4,
            "Color": "#815fb7",
            "Day": 4,
            "Date": "9月13日",
            "Weekday": "星期四",
            "Sequence": 0,
            "StartTime": "06:00"
          },
          {
            "Type": "Day",
            "Id": 10,
            "DayId": 5,
            "Color": "#b6b75f",
            "Day": 5,
            "Date": "9月14日",
            "Weekday": "星期五",
            "Sequence": 0,
            "StartTime": "07:00"
          },
          {
            "Type": "Day",
            "Id": 11,
            "DayId": 6,
            "Color": "#f4a94e",
            "Day": 6,
            "Date": "9月15日",
            "Weekday": "星期六",
            "Sequence": 0,
            "StartTime": "12:00"
          },
          {
            "Type": "Day",
            "Id": 12,
            "DayId": 7,
            "Color": "#2fbcbc",
            "Day": 7,
            "Date": "9月16日",
            "Weekday": "星期日",
            "Sequence": 0,
            "StartTime": "09:00"
          }
        ]
      }
    }
  },
  computed: {
    selectDayToDisplay() {
      // https://book.vue.tw/CH1/1-6-conditions-and-flow-control.html
      // 用compute的方式預做篩選
      return this.rawData.TripContent.filter(x => x.Type == 'Day')
    }
  },
  methods: {
    getDeleteData(item) {
      // get delete data
      console.log('Delete', item);
    },
    previous() {
      // scroll： jsonplaceholder.typicode.com
      let scrollObj = this.$refs.tripListHeaderDayComponent
      this.ScrollOption.left = scrollObj.scrollLeft
      this.ScrollOption.left = this.ScrollOption.left - 50
      this.$refs.tripListHeaderDayComponent.scroll(this.ScrollOption)
    },
    next() {
      // scroll： jsonplaceholder.typicode.com
      let scrollObj = this.$refs.tripListHeaderDayComponent
      this.ScrollOption.left = scrollObj.scrollLeft
      this.ScrollOption.left = this.ScrollOption.left + 50
      this.$refs.tripListHeaderDayComponent.scroll(this.ScrollOption)
    },
    changeSelect(selectDay) {
      this.selectDay = selectDay
    },
    DayDragMouseDown(e) {
      this.clickTag = e.target.parentNode.parentNode
      this.dayContainer = this.$refs.tripListHeaderDayComponent
      this.dayItems = document.querySelectorAll('.day-item')
      // 點到drag-handle才有用
      if (e.target.classList[0] == "drag-handler") {
        this.clickTag.style.visibility = 'hidden'
        this.clickTag.style.opacity = 0;
        console.dir(document.querySelector('.trip-list-header-info'))
        console.dir(document.querySelector('.trip-list').offsetTop)
        console.log(document.querySelector('.trip-list-header-info').offsetHeight);
        
        // 建立漂浮卡片
        let template = document.querySelector('#dayCard');
        cloneNode = template.content.cloneNode(true)
        this.dayCard = cloneNode.querySelector('.day-card')

        // https://emn178.pixnet.net/blog/post/95297028

        // 將目前點選的元件資訊放入template中
        this.dayCard.style.top = this.clickTag.offsetTop + document.querySelector('.trip-list-header-info').offsetHeight + document.querySelector('.trip-list').offsetTop + 2 + this.dayContainer.scrollTop + 'px';
        this.dayCard.style.left = this.clickTag.offsetLeft + 24 + 16 - this.dayContainer.scrollLeft + 'px'
        this.dayCard.style.width = this.clickTag.clientWidth + 'px'
        this.dayCard.style.height = this.clickTag.clientHeight + 'px'
        this.dayCard.dataset.id = this.clickTag.dataset.id
        this.clickId = this.clickTag.dataset.id
        this.currentId = this.clickId

        this.dayCard.style['z-index'] = 99
        this.dayCard.innerHTML = this.clickTag.innerHTML

        // 初始化參數
        this.selectL = this.clickTag.clientWidth // 選定卡片的寬度

        // selectD為選取物件的"右側"到父層"左側"的距離
        // this.clickTag.offsetLeft 選定物件到父層最左邊的距離 (不看scrollbar)
        // this.dayContainer.scrollLeft 代表父層往右滑動多少距離
        this.scrollTarget = this.dayContainer.scrollLeft
        // this.dayContainer.scrollWidth 父層總寬度 (不看scrollbar，包含overflow的部分)
        this.totalD = this.dayContainer.offsetWidth;
        // this.dayContainer.offsetWidth 父層寬度 (可視寬度)
        this.selectD = this.clickTag.offsetLeft - this.dayContainer.scrollLeft + this.selectL

        console.dir(this.clickTag)
        console.dir(this.dayContainer);
        console.log(this.dayContainer.scrollLeft);
        console.log(this.dayContainer.scrollWidth); // 內容總寬度
        console.log(this.dayContainer.offsetWidth);
        console.log(this.clickTag.offsetLeft);

        this.selectLeft = 0
        this.selectRight = 0
        this.clientX = 0
        this.x = 0
        this.steps = []

        this.dayItems.forEach(dayItem => {
          dayItem.style.transform = "translateX(0px)";
        })

        this.dayContainer.appendChild(cloneNode);
        window.addEventListener('mousemove', this.updateDayMove)
        window.addEventListener('mouseup', this.updateDayCard)
      }
    },
    updateDayCard() {
      clearInterval(this.timeId)
      this.timeId = 0
      window.removeEventListener('mousemove', this.updateDayMove)
      window.removeEventListener('mouseup', this.updateDayCard)
      this.clickTag.style.visibility = 'visible'
      this.clickTag.style.opacity = 1;
      console.log(this.clickId);

      // https://www.gushiciku.cn/pl/p9ck/zh-tw
      if (this.steps.length !== 0) {
        let dayItem_sort = Object.values(this.dayItems).sort((a, b) => a.dataset.id - b.dataset.id)
        let addDay = document.querySelector('.add-day');

        // box.innerHTML = ''
        dayItem_sort.forEach(item => {
          this.$refs.tripListHeaderDayComponent.insertBefore(item, addDay)
          item.style = ''
          // 渲染畫面
        })
        // 深層複製
        let result = JSON.parse(JSON.stringify(this.rawData.TripContent))
        // 只交換有動到的部分
        this.steps.forEach(step => {
          let newDay = result.find(x => x.Day == step.new).Day
          let oldDay = result.find(x => x.Day == this.clickId).Day
          console.log(newDay, oldDay);

          let selectNew = result.filter(x => x.Day == step.new);
          result.forEach(item => {
            if (item.Day == newDay) {
              item.Day = oldDay
            }
            else if (item.Day == oldDay) {
              item.Day = newDay
            }
          })
          // 按照day的大小排序
          result.sort((a, b) => a.Day - b.Day)
        })

        // 更新Sequence
        let Day, DayId, Sequence, Color
        let Id = (document.querySelectorAll('.day-item')[0].dataset.id) * 20;
        let rawStartDate = this.rawData.StartDate
        let year = rawStartDate.split('年')[0]
        let month = rawStartDate.split('年')[1].split('月')[0]
        let day = rawStartDate.split('月')[1].split('日')[0]
        let StartDate = new Date(year, month, day)

        result.forEach(item => {
          if (item.Type == "Day") {
            Day = item.Day
            DayId = item.DayId
            Sequence = 0
            Color = item.Color
            item.Date = `${StartDate.getMonth()}月${StartDate.getDate()}日`
            StartDate = new Date(StartDate.setDate(StartDate.getDate() + 1))
          }
          else {
            item.Day = Day
            item.DayId = DayId
            Sequence = Sequence + 1
            item.Sequence = Sequence
            item.Color = Color
          }
          item.Id = Id
          Id = Id + 1
        })
        // return
        console.log(JSON.parse(JSON.stringify(result)));
        // return
        // 移除marker、direction
        // if (this.markers.length !== 0) {
        //   this.markers.forEach(marker => {
        //     // marker.setIcon(null)
        //     // marker.setLabel(null);
        //     // marker.setMap(null)
        //     marker.setVisible(false)
        //   })
        //   this.markers = []
        // }
        // if (this.directionsRenderer.length !== 0) {
        //   this.directionsRenderer.forEach(item => {
        //     item.setMap(null)
        //   })
        // }
        // this.calculateRoute(result);

        this.dayItems.forEach(item => {
          item.style.transitionDuration = '10ms'
          item.style.transform = "translateY(0px)"
          item.style = ''
        })
        this.dayContainer.removeChild(this.dayCard)
        this.rawData.TripContent = result
      }
      else {
        // 沒動
        this.dayContainer.removeChild(this.dayCard)
        this.dayItems.forEach(item => {
          item.style = ''
        })
      }

      // dayItem.forEach(item => {
      //   item.style = ''
      // })
      // this.$refs.box.removeChild(this.placeCard)
    },
    updateDayMove(e) {
      this.checkDayDirection(e)
      // 漂浮卡片移動
      this.dayCard.style.transform = `translateX(${this.x}px)`
      if (this.currentDirection == 'right') {
        // 往右為+
        this.selectD = this.selectD + this.interval_x
        this.stopCardMove = this.checkDayScrollDirection()
        if (!this.stopCardMove) {
          this.selectRight = this.selectRight + this.interval_x
          this.selectLeft = this.selectLeft - this.interval_x
          if (!this.stopMove) {
            if (this.selectRight > this.selectL / 2) {
              this.changeData()
            }
          }
        }
      }
      else if (this.currentDirection == 'left') {
        // 往左為-
        this.selectD = this.selectD - this.interval_x
        this.stopCardMove = this.checkDayScrollDirection()
        if (!this.stopCardMove) {
          this.selectLeft = this.selectLeft + this.interval_x
          this.selectRight = this.selectRight - this.interval_x
          if (!this.stopMove) {
            if (this.selectLeft > this.selectL / 2) {
              this.changeData()
            }
          }
        }
      }
    },
    addSteps() {
      if (this.steps.length !== 0) {
        // 檢查是否移回原位
        if (this.steps[this.steps.length - 1].old == this.ChangeData.new && this.steps[this.steps.length - 1].new == this.ChangeData.old) {
          // 移除最後一個
          this.steps.pop()
        }
        else {
          this.steps.push(JSON.parse(JSON.stringify(this.ChangeData)))
        }
      }
      else {
        this.steps.push(JSON.parse(JSON.stringify(this.ChangeData)))
      }
      console.log(this.steps);
    },
    changeData() {
      let changeNode = this.dayContainer.querySelector(`[data-id="${this.currentId}"]`)
      if (this.currentDirection == 'left') {
        if (changeNode.style.transform == 'translateX(0px)' || changeNode.style.transform == `translateX(${this.selectL}px)`) {
          let moveNode = this.dayContainer.querySelector(`[data-id="${parseInt(this.currentId) - 1}"]`)
          console.log(parseInt(this.currentId) - 1);

          console.log(moveNode);

          moveNode.style.transform = `translateX(${this.selectL}px)`
          this.currentId = parseInt(this.currentId) - 1
        }
        else if (changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
          let moveNode = this.dayContainer.querySelector(`[data-id="${parseInt(this.currentId)}"]`)
          moveNode.style.transform = `translateX(0px)`
          this.currentId = parseInt(this.currentId) - 1
        }
        this.stopScroll = false
        this.selectRight = this.selectL - this.selectLeft
        this.selectLeft = (this.selectL - this.selectLeft) * (-1)
        this.ChangeData.old = parseInt(this.currentId) + 1
        this.ChangeData.new = parseInt(this.currentId)
        this.addSteps()
      }
      else if (this.currentDirection == 'right') {
        if (changeNode.style.transform == 'translateX(0px)' || changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
          let moveNode = this.dayContainer.querySelector(`[data-id="${parseInt(this.currentId) + 1}"]`)
          moveNode.style.transform = `translateX(${this.selectL * (-1)}px)`
          this.currentId = parseInt(this.currentId) + 1
        }
        else if (changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
          let moveNode = this.dayContainer.querySelector(`[data-id="${parseInt(this.currentId)}"]`)
          moveNode.style.transform = `translateX(0px)`
          this.currentId = parseInt(this.currentId) + 1
        }
        this.stopScroll = false
        this.selectLeft = this.selectL - this.selectRight
        this.selectRight = (this.selectL - this.selectRight) * (-1)
        this.ChangeData.old = parseInt(this.currentId) - 1
        this.ChangeData.new = parseInt(this.currentId)
        this.addSteps()
      }
    },

    checkDayDirection(e) {
      // 監測鼠標位置
      if (this.clientX !== 0) {
        let changeNode = this.dayContainer.querySelector(`[data-id="${this.currentId}"]`)
        if (this.clientX > e.clientX) {
          this.currentDirection = 'left'
          if (changeNode.style.transform == 'translateX(0px)' ||
            changeNode.style.transform == `translateX(${this.selectL}px)`) {
            this.stopMove = false
          }
          else if (changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
            this.stopMove = false
          }
          this.interval_x = this.clientX - e.clientX
          this.x = this.x - this.interval_x
        }
        else if (this.clientX < e.clientX) {
          this.currentDirection = 'right'
          if (changeNode.style.transform == 'translateX(0px)' ||
            changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
            if (parseInt(this.currentId) + 1 > this.dayItems[this.dayItems.length - 1].dataset.id) {
              this.stopMove = true
            }
            else {
              this.stopMove = false
            }
          }
          else if (changeNode.style.transform == `translateX(${this.selectL}px)`) {
            this.stopMove = false
          }
          this.interval_x = e.clientX - this.clientX
          this.x = this.x + this.interval_x
        }
        else {
          this.currentDirection = 'same'
        }
      }
      // 記錄前一次數值用於下次比較
      this.clientX = e.clientX
    },
    scrollDayMove() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
      // scroll information
      if (this.currentDirection == 'right') {
        if (!this.stopScroll) {
          this.scrollInterval = this.scrollInterval + 1
          this.scrollTarget = this.scrollTarget + this.scrollInterval
          this.dayContainer.scroll(this.scrollTarget, 0)
          if (this.dayContainer.scrollLeft + this.dayContainer.clientWidth >= this.dayContainer.scrollWidth) {
            // 代表到右邊底
            this.stopScroll = true
            this.scrollTarget = this.dayContainer.scrollLeft
            this.scrollInterval = 0
            // clearTimeInterval
            clearInterval(this.timeId)
            this.timeId = 0
          }
          else {
            this.stopScroll = false
            this.selectRight = this.selectRight + this.scrollInterval
            this.selectLeft = this.selectLeft - this.scrollInterval
            let changeNode = this.dayContainer.querySelector(`[data-id="${this.currentId}"]`)
            if (changeNode.style.transform == 'translateX(0px)' || changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
              // 往右滑停止條件
              this.stopMove = parseInt(this.currentId) + 1 > parseInt(this.dayItems[this.dayItems.length - 1].dataset.id) ? true : false
            }
            else if (changeNode.style.transform == `translateX(${this.selectL}px)`) {
              this.stopMove = false
            }
            if (!this.stopMove) {
              if (this.selectRight > this.selectL / 2) {
                this.scrollInterval = 0
                this.changeData()
              }
            }
          }
        }
      }
      else if (this.currentDirection == 'left') {
        if (!this.stopScroll) {
          this.scrollInterval = this.scrollInterval + 1
          this.scrollTarget = this.scrollTarget - this.scrollInterval
          this.dayContainer.scroll(this.scrollTarget, 0)
          if (this.dayContainer.scrollLeft == 0) {
            // 代表到左邊底
            this.stopScroll = true
            this.scrollTarget = 0
            this.scrollInterval = 0
            // clearTimeInterval
            clearInterval(this.timeId)
            this.timeId = 0
          }
          else {
            this.stopScroll = false
            this.selectRight = this.selectRight - this.scrollInterval
            this.selectLeft = this.selectLeft + this.scrollInterval

            let changeNode = this.dayContainer.querySelector(`[data-id="${this.currentId}"]`)
            if (changeNode.style.transform == 'translateY(0px)' || changeNode.style.transform == `translateY(${this.selectL}px)`) {
              // 往左滑停止條件
              this.stopMove = parseInt(this.currentId) - 1 < 0 ? true : false
            }
            else if (changeNode.style.transform == `translateY(${this.selectL * (-1)}px)`) {
              this.stopMove = false
            }
            if (!this.stopMove) {
              if (this.selectLeft > this.selectL / 2) {
                this.scrollInterval = 0
                this.changeData()
              }
            }
          }
        }
      }
    },
    checkDayScrollDirection() {
      let result
      // 用非同步的方式觸發
      if (this.selectD > this.totalD) {
        // 到達最右側，並且scroll bar開始滑動
        this.currentDirection = 'right'
        this.stopScroll = false
        result = true
      }
      else if (this.selectD < this.selectL) {
        // 到達最左側，並且scroll bar開始滑動
        this.currentDirection = 'left'
        this.stopScroll = false
        result = true
      }
      else {
        // 停止滾動
        this.stopScroll = true
        result = false
        if (this.stopScroll) {
          if (this.timeId !== 0) {
            clearInterval(this.timeId)
            this.timeId = 0
            console.log(this.timeId);
          }
        }
      }
      if (result) {
        if (this.timeId == 0) {
          this.timeId = setInterval(this.scrollDayMove, 10)
        }
      }
      return result
    }
  },
  components: {
    dayCell
  },
}
Vue.createApp(App).mount('#app');