const placeDetail = {
  data() {
    return {
      url_GetPlaceDetailFromGoogleVM: 'https://localhost:44392/api/planapi/GetPlaceDetailFromGoogleVM/?search=',
      url_UpdatePlaceNote: 'https://localhost:44392/api/planapi/UpdatePlaceNote',
      origin_note: '',
      selectTab: 'search',
      searchResult: '',
      PlaceName: '',
      CollectionPlace: {
        PlaceImage: '',
        PlaceName: '',
        PlaceTypeId: 7
      }
    }
  },
  template: `
    <section class="card">
      <div class="close-place-card" v-on:click="Close">
        <i class="fas fa-times"></i>
      </div>
      <div class="create-venu-tab" v-show="!selectPlace.searchBoxPlace">
        <div class="create-venu-tab-search" v-on:click="!updateSelectTab('search')"
      :style="{'borderBottom': selectTab == 'search' ? '4px solid #ee3c77 ' : 'none'}">
        <i class="fas fa-map-marker-alt" :style="{'color': selectTab == 'search' ? '#ee3c77' : '#666'}"></i>
        <span>搜尋</span>
      </div>
      <div class="create-venu-tab-collection" v-on:click="updateSelectTab('note')"
        :style="{'borderBottom': selectTab == 'note' ? '4px solid #ee3c77 ' : 'none'}">
        <i class="far fa-clipboard" :style="{'color': selectTab == 'note' ? '#ee3c77' : '#666'}"></i>
        <span>文字筆記</span>
      </div>
      </div>
        <div class="scroll-box mt-2">
          <h1 class="name" class="border-bottom" style= "box-shadow:none; padding: 10px;">{{PlaceName}}</h1>
          <div v-if="selectTab == 'search'">
            {{searchResult}}
            <div class="button-group">
              <button class="button ms-auto" id="button-collect" :disabled="this.selectPlace.collection" :style="{'background':this.selectPlace.collection ? '#ccc' : '#fff', 'color': this.selectPlace.collection ? '#fff' : '#ee3c77'}" v-on:click="AddToCollection">加入收藏</button>
              <button class="button ms-auto" id="button-addtrip" v-on:click="AddPlace">加入行程</button>
            </div>
          </div>
          <div v-else>
            <textarea name="" id="" cols="30" rows="10" style="height: 500px; width: 100%; border: none; padding: 20px 15px;" v-model="selectPlace.Place.Note"></textarea>
            <div class="button-group">
              <button class="button ms-auto" id="button-save" style="width: calc(100% - 8px);" v-on:click="SaveNote" :disabled="origin_note == selectPlace.Place.Note" :style="{'background': origin_note == selectPlace.Place.Note ? '#ccc' : '#ee3c77'}">儲存</button>
            </div>
          </div>
        </div>
    </section>`,
  props: ['selectPlace'],
  emits: ['close', 'updateNote', 'updateSearchResult', 'addPlace', 'addCollection'],
  methods: {
    Notification(message, type) {
      ElNotification({
        message: message,
        type: type,
        duration: 2000,
        position: 'bottom-right'
      })
    },
    updateSelectTab(select) {
      this.selectTab = select
    },
    // (origin_note == selectPlace.Place.Note) || ((origin_note == null) && (selectPlace.Place.Note == ""))
    Close() {
      this.$emit('close')
      this.selectTab = 'search'
      this.selectPlace = ''
      this.searchResult = ''
    },
    SaveNote() {
      axios.put(this.url_UpdatePlaceNote, {
        TripDetailsId: this.selectPlace.Place.TripDetailsId,
        Note: this.selectPlace.Place.Note
      }).then(res => {
        if (res.data.IsSuccessful) {
          // 如果資料庫更新成功，則傳回去父層更新
          this.Notification('Note更新成功', 'success')
          this.$emit('updateNote', this.selectPlace.Place)
        }
        else{
          this.Notification('Note更新失敗', 'error')
        }
      })
    },
    AddPlace() {
      let PlaceDetail = {
        PlaceName: PlaceName,
        PlaceCity: this.searchResult.plus_code.compound_code.split(' ')[1]
      }
      console.log(PlaceDetail);
      this.$emit('addPlace', PlaceDetail)
    },
    AddToCollection() {
      this.CollectionPlace.PlaceName = this.PlaceName
      // 將圖片轉成url後上傳至雲端
      this.CollectionPlace.PlaceImage = 'https://picsum.photos/id/145/600/400'
      this.$emit('addCollection', this.CollectionPlace)
    }
  },
  watch: {
    selectPlace: function () {
      this.PlaceName = this.selectPlace.Place.PlaceName
      console.log(this.selectPlace);

      if (!this.selectPlace.searchBoxPlace) {
        this.origin_note = this.selectPlace.Place.Note
      }
      console.log(this.origin_note);
      
      // let searchPlaceType = {
      //   searchBoxPlace: false,
      //   Place: Place
      // }
      console.log(this.selectPlace, 'inside');
      axios.get(`${this.url_GetPlaceDetailFromGoogleVM}${this.selectPlace.Place.PlaceName}`).then(res => {
        console.log(res);
        
        console.log('result', res.data.result);
        this.searchResult = res.data
        PlaceName = res.data.PlaceDetailModel.result.name // 景點完整的名字
        if (this.selectPlace.searchBoxPlace) {
          this.$emit('updateSearchResult', res.data.result.geometry.location)
        }
      })
    }
  }

}
const dayCell = {
  template: `
    <div class="day-cell" :class="{'HighlightDay': tripData.Date == selectDay.Date, 'edit-mode': edit}"  v-on:click="moveDay">
      <div class="drag-handler" v-if="edit"></div>
      <div class="day-cell-content">
        <span :style="{fontWeight: tripData.Date == selectDay.Date ? 900 : 400}"  class="pt-1">{{tripData.Date}}</span>
        <span class="day-number">第{{tripData.Day}}天</span>
        <div class="delete" v-on:click="deleteData" v-if="edit">
          <i class="fas fa-trash delete-tool"></i>
        </div>
      </div>
    </div>`,
  props: ['tripData', 'selectDay', 'edit'],
  emits: ['deleteData', 'moveDay'],
  methods: {
    deleteData() {
      this.$emit('deleteData', this.tripData)
    },
    moveDay(){
      this.$emit('moveDay', this.tripData.Day)
    }
  }
}
const day = {
  template: `
    <header class="trip-list-day-header">
      <div class="text-white weekday" :style="{background: (showDay.content !== tripContent) && showDay.show  ? '#888' : tripContent.Color}" style="cursor: pointer" v-on:click="selectDay" >
        <div class="d-inline-block eye" v-if="showDay.show">
          <i class="far fa-eye" v-if="showDay.content == tripContent"></i>
          <i class="far fa-eye-slash" v-else></i>
        </div>
        <span :id="'Day' + tripContent.Day">第{{tripContent.Day}}天：{{tripContent.Weekday}}</span>
      </div>
      <div class="trip-list-day-header-time">
        出發時間：
        <b class="edit-mode" data-bs-toggle="modal" data-bs-target="#Time" v-if="edit" v-on:click="selectTime">{{tripContent.StartTime}}</b>
        <b v-else >{{tripContent.StartTime}}</b>
      </div>
    </header>`,
  props: ['tripContent', 'showDay', 'edit'],
  emits: ['selectDay', 'selectTime'],
  methods: {
    selectDay() {
      this.$emit('selectDay', this.tripContent)
      console.log(this.tripContent);

    },
    selectTime() {
      this.$emit('selectTime', this.tripContent)
    }
  }
}
const placeGps = {
  template: `
    <div class="trip-list-venu-container" :class="{'edit': edit}">
      <div class="drag-handler" v-if="edit"></div>
      <div class="trip-list-day-venu-time" v-on:click="ShowPlace(tripContent.PlaceName)">
        <span class="trip-list-day-venu-time-from">{{tripContent.StartTime}}</span>
        <span class="fas fa-map-marker trip-list-day-venu-number-mark" :style="{color: tripContent.Color}">
          <span class="trip-list-day-venu-number">{{tripContent.Sequence}}</span>
        </span>
        <span class="trip-list-day-venu-time-to">{{tripContent.EndTime}}</span>
      </div>
      <div class="trip-list-day-venu-info" v-on:click="ShowPlace(tripContent)">
        <div class="trip-list-day-venu-info-detail" :style = "{width: edit? 'none' : '100%'}" >
          <div class="trip-list-day-venu-info-time" v-on:click=Show>
            <i class="fas fa-clock" style= "color: #888;" v-if="!edit"></i>
            <span class="edit-mode" data-bs-toggle="modal" data-bs-target="#StayTime" v-if="edit" v-on:click="selectStayTime">{{tripContent.StayTime}}</span>
            <span v-else class="ms-1">{{tripContent.StayTime}}</span>
          </div>
          <div class="trip-list-day-venu-info-name">{{tripContent.PlaceName}}</div>
          <div class="trip-list-day-venu-info-address" :style = "{width: edit? '190px' : '210px'}" >{{tripContent.Address}}</div>
        </div>
        <div class="trip-list-day-venu-info-edit">
          <div class="position-relative" v-if="edit">
            <i class="far fa-copy copy-tool" v-on:click="$emit('copyData', tripContent)"></i>
            <div class="trip-list-day-venu-info-edit-func" >複製</div>
          </div>
          <div class="position-relative" v-on:click="deletePlace" v-if="edit">
            <i class="fas fa-trash delete-tool"></i>
            <div class="trip-list-day-venu-info-edit-func">刪除</div>
          </div>
          <div v-on:click="ShowPlace(tripContent)">
            <i class="fas fa-file-alt" style="font-size: 20px; color: #666;" v-if="!edit"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="tripContent.Car">
      <div class="gps">
        <div class="gps-content">
          <div class="gps-mode-car">
            <img src="http://res.cloudinary.com/ditncduk1/image/upload/v1634025439/q86l4xeo3kwlr5pxyfcr.png" alt="" class="h-100">
          </div>
          <div class="gps-time">
            約
            <span>{{tripContent.Car}}</span>
          </div>
          <div class="gps-go ms-auto">
            <i class="fas fa-directions"></i>
          </div>
        </div>
      </div>
    </div>`,
  props: ['tripContent', 'edit'],
  emits: ['copyData', 'deletePlace', 'selectPlace', 'selectStayTime'],
  methods: {
    Show() { },
    deletePlace() {
      this.$emit('deletePlace', this.tripContent)
    },
    ShowPlace(PlaceContent) {
      if (!this.edit) {
        this.$emit('selectPlace', PlaceContent)
      }
    },
    selectStayTime() {
      this.$emit('selectStayTime', this.tripContent)
    }
  },
}

const dayPlus = {
  data() {
    return {
      show: ''
    }
  },
  template: `
  <div class="add-venue" style="margin-top: 16px;" v-on:click="$emit('AddPlace')">
    <span>+ 新增景點</span>
  </div>
  <header class="trip-list-day-header">
    <div class="text-white weekday" style="cursor: pointer;" :style="{background: (showDay.content !== tripContent) && showDay.show ? '#888' : tripContent.Color}" v-on:click="selectDay">
      <div class="d-inline-block eye" v-if="showDay.show">
        <i class="far fa-eye" v-if="showDay.content == tripContent"></i>
        <i class="far fa-eye-slash" v-else></i>
      </div>
      <span :id="'Day' + tripContent.Day">第{{tripContent.Day}}天 : {{tripContent.Weekday}}</span>
    </div>
    <div class="trip-list-day-header-time">
      出發時間：
      <b class="edit-mode" data-bs-toggle="modal" data-bs-target="#Time" v-if="edit" v-on:click="selectTime">{{tripContent.StartTime}}</b>
      <b v-else>{{tripContent.StartTime}}</b>
    </div>
  </header>`,
  props: ['tripContent', 'showDay', 'edit'],
  emits: ['selectDay', 'selectTime', 'AddPlace'],
  methods: {
    selectDay() {
      this.$emit('selectDay', this.tripContent)
    },
    selectTime() {
      console.log(this.tripContent.StartTime);
      this.$emit('selectTime', this.tripContent)
    }
  }
}
const { ElNotification } = ElementPlus;
const App = {
  data() {
    return {
      urls: {
        // 需要修改傳入的TripId
        url_GetPlanDetails: 'https://localhost:44392/api/planapi/GetPlanDetail/44',
        url_GetAttractionCollection: 'https://localhost:44392/api/planapi/GetAttractionCollection/',
        url_UpdatePlaceStayTime: 'https://localhost:44392/api/planapi/UpdatePlaceStayTime',
        url_UpdateTrip: 'https://localhost:44392/api/planapi/UpdateTrip',
        url_UpdateDayStartTime: 'https://localhost:44392/api/planapi/UpdateDayStartTime',
        url_UpdatePlaceSequence: 'https://localhost:44392/api/planapi/UpdatePlaceSequence',
        url_UpdateDaySequence: 'https://localhost:44392/api/planapi/UpdateDaySequence',
        url_DeletePlace: 'https://localhost:44392/api/planapi/DeletePlace',
        url_DeleteDay: 'https://localhost:44392/api/planapi/DeleteDay',
        url_AddPlanDay: 'https://localhost:44392/api/planapi/AddPlanDay',
        url_AddPlaceToPlan: 'https://localhost:44392/api/planapi/AddPlaceToPlan',
        url_AddAttractionCollection: 'https://localhost:44392/api/planapi/AddAttractionCollection',
        url_addMessage: 'https://localhost:44392/api/planapi/AddMessage',
        url_readAllMessage: 'https://localhost:44392/api/planapi/ReadAllMessage/44'
      },
      userId: 5,
      chatData: [],
      selectMessage: '',
      menuShow: false,
      message: '',

      showChat: false,
      revealAllMarkers: false,
      coverImage: '',
      ShowPlaceDetail: false,
      searchBox: '',
      searchPlace: '',
      selectTab: '',
      page: 'TripList',
      initialLoading: false,
      Loading: false,
      hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
      types: ['上午', '下午'],
      stayMinute: Array.from(Array(60).keys()),
      stayHour: Array.from(Array(24).keys()),
      showSpecificRoute: {
        show: false,
        content: {}
      },
      originDayTime: {
        Type: '',
        DayId: '',
        hour: '',
        minute: ''
      },
      selectDayTime: {
        Type: '',
        DayId: '',
        hour: '',
        minute: ''
      },
      originPlaceStayTime: {
        DayId: '',
        TripDetailsId: '',
        hour: '',
        minute: '',
      },
      selectPlaceStayTime: {
        DayId: '',
        TripDetailsId: '',
        hour: '',
        minute: '',
      },
      StartDate: '',
      EndDate: '',
      StartDateDisplay: '',

      tripListHeight: '',
      edit: false,
      setReturn: false,
      showTripList: true,
      map: '',
      directionsService: '',
      directionsRenderersData: [],
      markersData: [],
      placeMarker: '',
      placeCard: '',

      dayContainer: '',
      dayItems: '',
      selectDay: '',
      dayCard: '',

      ScrollOption: {
        left: '',
        behavior: 'smooth'
      },
      x: 0,
      interval_x: '',
      clientX: 0,
      selectRight: 0,
      selectLeft: 0,

      tripItems: [],
      tripContainer: '',
      y: 0,
      interval_y: '', // 鼠標移動的距離
      clientY: 0, // 之前的滑鼠鼠標位置
      selectBottom: 0, // 選定區域的底部
      selectTop: 0, // 選定區域的頂部
      H: 0, // 判斷是否要移動的卡片高度，up (id - 1)；down (id + 1)

      ChangeData: {
        old: '',
        new: ''
      },
      clickTag: '',
      mouseMove: '',
      steps: [],
      mouseDirection: '',
      scrollDirection: '',
      totalD: '', // trip-list-day-container的高度
      selectD: '', // 選定漂浮區塊距離trip-list上方的高度
      selectL: '', // 選定區塊的高度 (translateY的距離)
      stopCardMove: '', // 漂浮區塊停止移動，卷軸開始移動
      stopScroll: '', // 停止Scroll bar移動
      timeId: 0, // TimeInterval Id
      scrollTarget: '', // scroll bar移動的目標終點
      scrollInterval: '', // scroll bar移動距離
      currentId: '', // 目前選定的ID
      clickId: '',
      rawDataOnlyDay: '',
      rawData: {},
      TripTitle: '',
      LastId: 0,
      DBData: {
        "UserId": 5,
        "TripId": 44,
        "UserImg": "https://pic1.zhimg.com/v2-c1126a4b41b34a65efd8f915a732b7e1_1440w.jpg?source=172ae18b",
        "UserName": "Sherry",
        "TripTitle": "六天五夜",
        "StartDate": "2021-09-29",
        "EndDate": "2021-10-4",
        "TotalDate": 6,
        "TripContent": []
      }
    }
  },
  methods: {
    // screenshot(){
    //     return new Promise(resolve => {
    //         html2canvas(this.$refs.tripListDayContainer).then(function(canvas) {
    //           this.coverImage = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    //           console.log(this.coverImage);

    //           var a = document.createElement('a');
    //           a.href = this.coverImage;
    //           a.download = 'image.jpg';
    //           a.click();
    //           resolve('Done')
    //       });
    //     })
    // },
    
    open1() {
      ElNotification({
        title: '',
        message: '刪除成功',
        type: 'success',
        duration: 1000,
        position: 'bottom-right'
      })
    },
    open2() {
      ElNotification({
        title: '',
        message: '刪除失敗',
        type: 'error',
        duration: 1000,
        position: 'bottom-right'
      })
    },
    showChatRoom(){
      this.showChat = true
      this.$nextTick(() => {
          // https://iter01.com/581627.html
          console.log(this.$refs.room.scrollTop, this.$refs.room.scrollHeight);
          this.$refs.room.scrollTop = this.$refs.room.scrollHeight
      });
    },
    to(toEL) {
      // https://juejin.cn/post/6868968417769029640
      // 點擊移動到特定位置
      let select = document.querySelector(`#Day${toEL}`);
      if (this.edit){
        this.$refs.tripListDayContainer.scrollTo({
          top: select.offsetTop - 233,
          behavior: 'smooth'
        })
      }
      else{
        this.$refs.tripListDayContainer.scrollTo({
          top: select.offsetTop - 183,
          behavior: 'smooth'
        })
      }
    },
    Notification(message, type) {
      ElNotification({
        message: message,
        type: type,
        duration: 2000,
        position: 'bottom-right'
      })
    },
    // --- 修改標題 ---
    changeTripTitle() {
      if (this.TripTitle !== this.rawData.TripTitle) {
        axios.put(this.urls.url_UpdateTrip, {
          TripId: this.rawData.TripId,
          TripTitle: this.rawData.TripTitle,
          StartDate: this.rawData.StartDate
        }).then(res => {
          if (res.data.IsSuccessful) {
            this.Notification('修改成功', 'success')
          }
          else{
            // 變回原樣
            this.rawData.TripTitle = this.TripTitle
            this.Notification('修改失敗', 'error')
          }
        })
      }
    },
    updateSelectTab(select) {
      this.selectTab = select;
    },
    // --- 切換分頁 ---
    changePage() {
      if (this.page == 'TripList') {
        this.page = 'CreateBox'
        this.selectTab = 'search'
      }
      else {
        this.page = 'TripList'
        if (this.ShowPlaceDetail) {
          this.ShowPlaceDetail = false
          this.revealRouteAndMarker(false)
        }
      }
    },
    // --- 取得Plan資料 ---
    getData() {
      let url = "https://raw.githubusercontent.com/r04941090/FileStorage/master/Trip"
      this.initialLoading = true
      axios.get(this.urls.url_GetPlanDetails).then(res => {
        console.log('RawData', res);
        this.rawData = res.data
        this.LastId = this.rawData.TripContent.length + 1;
        this.rawDataOnlyDay = this.rawData.TripContent.filter(x => x.Type == 'Day')
        let StartDateAry = this.rawData.StartDate.split('-')
        let EndDateAry = this.rawData.EndDate.split('-')
        this.StartDate = this.rawData.StartDate
        this.StartDateDisplay = `${StartDateAry[0]}年${StartDateAry[1]}月${StartDateAry[2]}日`
        this.EndDate = `${EndDateAry[0]}年${EndDateAry[1]}月${EndDateAry[2]}日`
        let result = JSON.parse(JSON.stringify(this.rawData.TripContent))
        this.calculateRoute(result)
      }).catch(error => {
        console.log(error);
        axios.get(url).then(res => {
          this.rawData = res.data
          this.rawDataOnlyDay = this.rawData.TripContent.filter(x => x.Type == 'Day')
          let StartDateAry = this.rawData.StartDate.split('-')
          let EndDateAry = this.rawData.EndDate.split('-')
          this.StartDate = this.rawData.StartDate
          this.StartDateDisplay = `${StartDateAry[0]}年${StartDateAry[1]}月${StartDateAry[2]}日`
          this.EndDate = `${EndDateAry[0]}年${EndDateAry[1]}月${EndDateAry[2]}日`
          this.calculateRoute(this.rawData.TripContent)
        })
      })
    },
    // --- 打開景點頁面 ---
    ShowPlacePage(Place) {
      console.log(Place);
      this.ShowPlaceDetail = true;
      let searchPlaceType = {
        searchBoxPlace: false,
        Place: Place
      }
      this.searchPlace = searchPlaceType
      console.log(this.searchPlace);
      console.log(this.markersData);
      this.revealRouteAndMarker(true);
      let selectMarker = this.markersData.filter(x => x.TripDetailsId == Place.TripDetailsId)[0].marker
      selectMarker.setVisible(true)
      this.map.setCenter(selectMarker.getPosition());
    },
    // --- 改變出發時間，並且重新計算時間 ---
    updateDayStartTime() {
      if ((this.originDayTime.hour !== this.selectDayTime.hour) || (this.originDayTime.minute !== this.selectDayTime.minute)) {
        if (this.selectDayTime.Type == '下午') {
          this.selectDayTime.hour = this.selectDayTime.hour + 12
        }
        axios.put(this.urls.url_UpdateDayStartTime, {
          DayId: this.selectDayTime.DayId,
          StartTime: `${this.selectDayTime.hour.toString().padStart(2, '0')}:${this.selectDayTime.minute.toString().padStart(2, '0')}:00`
        }).then(res => {
          if (res.data.IsSuccessful) {
            let selectIndex = this.rawData.TripContent.findIndex(x => x.DayId == this.selectDayTime.DayId && x.Type == 'Day')
            let origin_hour = parseInt(this.rawData.TripContent[selectIndex].StartTime.split(':')[0])
            let origin_minute = parseInt(this.rawData.TripContent[selectIndex].StartTime.split(':')[1])
            let diff = (this.selectDayTime.hour * 60 + parseInt(this.selectDayTime.minute)) - (origin_hour * 60 + origin_minute)
            this.rawData.TripContent.forEach(item => {
              if (item.DayId == this.selectDayTime.DayId) {
                let start_hour = parseInt(item.StartTime.split(':')[0])
                let start_minute = parseInt(item.StartTime.split(':')[1])
                let start_totalMinute = ((start_hour * 60) + start_minute) + diff
                item.StartTime = `${(Math.floor(start_totalMinute / 60)).toString().padStart(2, '0')}:${(start_totalMinute % 60).toString().padStart(2, '0')}`
                if (item.Type == 'Place') {
                  // 只有Type為Place才有EndTime
                  let end_hour = parseInt(item.EndTime.split(':')[0])
                  let end_minute = parseInt(item.EndTime.split(':')[1])
                  let end_totalMinute = ((end_hour * 60) + end_minute) + diff
                  item.EndTime = `${(Math.floor(end_totalMinute / 60)).toString().padStart(2, '0')}:${(end_totalMinute % 60).toString().padStart(2, '0')}`
                }
              }
            })
            this.Notification('修改成功', 'success')
          }
          else{
            this.Notification('修改失敗', 'error')
          }
        })
      }
    },
    // --- 改變景點停留時間，並且重新計算時間 ---
    updatePlaceStayTime() {
      if ((this.originPlaceStayTime.hour !== this.selectPlaceStayTime.hour) || (this.originPlaceStayTime.minute !== this.selectPlaceStayTime.minute)) {
        console.log(this.selectPlaceStayTime.TripDetailsId, `${this.selectPlaceStayTime.hour.toString().padStart(2, '0')}:${this.selectPlaceStayTime.minute.toString().padStart(2, '0')}:00`);
        let selectIndex = this.rawData.TripContent.findIndex(x => x.TripDetailsId == this.selectPlaceStayTime.TripDetailsId && x.Type == 'Place')
        let origin = this.parseStayTime(this.rawData.TripContent[selectIndex])
        let origin_hour = origin.stay_hour
        let origin_minute = origin.stay_minute
        let diff = (this.selectPlaceStayTime.hour * 60 + parseInt(this.selectPlaceStayTime.minute)) - (origin_hour * 60 + origin_minute)
        let start = false
        axios.put(this.urls.url_UpdatePlaceStayTime, {
          TripDetailsId: this.selectPlaceStayTime.TripDetailsId,
          PlaceStayTime: `${this.selectPlaceStayTime.hour.toString().padStart(2, '0')}:${this.selectPlaceStayTime.minute.toString().padStart(2, '0')}:00`
        }).then(res => {
          console.log(res);
          if (res.data.IsSuccessful) {
            let selectIndex = this.rawData.TripContent.findIndex(x => x.TripDetailsId == this.selectPlaceStayTime.TripDetailsId && x.Type == 'Place')
            let origin = this.parseStayTime(this.rawData.TripContent[selectIndex])
            let origin_hour = origin.stay_hour
            let origin_minute = origin.stay_minute
            let diff = (this.selectPlaceStayTime.hour * 60 + parseInt(this.selectPlaceStayTime.minute)) - (origin_hour * 60 + origin_minute)
            let start = false
            this.rawData.TripContent.forEach(item => {
              if (item.DayId == this.selectPlaceStayTime.DayId) {
                if (start) {
                  console.log(item);
                  let start_hour = parseInt(item.StartTime.split(':')[0])
                  let start_minute = parseInt(item.StartTime.split(':')[1])
                  let start_totalMinute = ((start_hour * 60) + start_minute) + diff
                  item.StartTime = `${(Math.floor(start_totalMinute / 60)).toString().padStart(2, '0')}:${(start_totalMinute % 60).toString().padStart(2, '0')}`
                  if (item.Type == 'Place') {
                    // 只有Type為Place才有EndTime
                    let end_hour = parseInt(item.EndTime.split(':')[0])
                    let end_minute = parseInt(item.EndTime.split(':')[1])
                    let end_totalMinute = ((end_hour * 60) + end_minute) + diff
                    item.EndTime = `${(Math.floor(end_totalMinute / 60)).toString().padStart(2, '0')}:${(end_totalMinute % 60).toString().padStart(2, '0')}`
                  }
                }
                if (item.TripDetailsId == this.selectPlaceStayTime.TripDetailsId) {
                  // 算到自己才開始，並且更新自己的StayTime
                  if (this.selectPlaceStayTime.hour == 0 && this.selectPlaceStayTime.minute == 0) {
                    item.StayTime = '0秒'
                  }
                  else if (this.selectPlaceStayTime.hour == 0) {
                    item.StayTime = `${this.selectPlaceStayTime.minute}分`
                  }
                  else if (this.selectPlaceStayTime.minute == 0) {
                    item.StayTime = `${this.selectPlaceStayTime.hour}小時`
                  }
                  else {
                    item.StayTime = `${this.selectPlaceStayTime.hour}小時 ${this.selectPlaceStayTime.minute}分`
                  }
                  let end_hour = parseInt(item.EndTime.split(':')[0])
                  let end_minute = parseInt(item.EndTime.split(':')[1])
                  let end_totalMinute = ((end_hour * 60) + end_minute) + diff
                  item.EndTime = `${(Math.floor(end_totalMinute / 60)).toString().padStart(2, '0')}:${(end_totalMinute % 60).toString().padStart(2, '0')}`
                  start = true
                }
              }
            })
            this.Notification('修改成功', 'success')
          }
          else {
            this.Notification('修改失敗', 'error')
          }
        })
      }
    },
    // 更改景點的停留時間
    selectStayTime(select) {

      let stayTimeResult = this.parseStayTime(select)
      this.selectPlaceStayTime.DayId = select.DayId
      this.selectPlaceStayTime.TripDetailsId = select.TripDetailsId
      this.selectPlaceStayTime.hour = stayTimeResult.stay_hour
      this.selectPlaceStayTime.minute = stayTimeResult.stay_minute
      // 複製一份，用於比較是否修改
      this.originPlaceStayTime = { ...this.selectPlaceStayTime }
    },
    // 更改出發時間
    selectTime(select) {
      console.log(select);
      console.log(select.StartTime);

      let selectTime = select.StartTime.split(':')
      let hour = selectTime[0]
      let minute = selectTime[1]
      if (parseInt(hour) - 12 < 0) {
        this.selectDayTime.Type = '上午'
        this.selectDayTime.hour = parseInt(hour)
      }
      else {
        this.selectDayTime.Type = '下午'
        this.selectDayTime.hour = parseInt(hour) - 12
      }
      this.selectDayTime.DayId = select.DayId
      this.selectDayTime.minute = minute.toString()
      // 複製一份，用於比較是否修改
      this.originDayTime = { ...this.selectDayTime }
    },
    // 判斷是否顯示路線
    selectDayMethod(select) {
      if (this.rawData.TripContent.find(x => x.Day == select.Day && x.Type == 'Place') !== undefined) {
        if (this.showSpecificRoute.content == '') {
          this.showSpecificRoute.content = select
          this.showSpecificRoute.show = true
        }
        else {
          if (this.showSpecificRoute.content == select) {
            this.showSpecificRoute.content = ''
            this.showSpecificRoute.show = false
          }
          else {
            this.showSpecificRoute.content = select
            this.showSpecificRoute.show = true
          }
        }
        this.ResetRoute(this.map);
      }
    },
    // --- 刪除景點 ---
    async DeletePlace(place) {
      console.log(place);
      axios.delete(`${this.urls.url_DeletePlace}/${place.TripDetailsId}`).then(res => {
        console.log(res);
        if (res.data.IsSuccessful) {
          this.Notification('刪除成功', 'success')
          this.getData();
        }
        else {
          this.Notification('刪除失敗', 'error')
        }
      })
    },
    // --- 刪除天 ---
    DeleteData(day) {
      console.log('Delete', day);
      axios.delete(`${this.urls.url_DeleteDay}/${day.DayId}`).then(res => {
        if (res.data.IsSuccessful) {
          this.Notification('刪除成功', 'success')
          this.getData();
        }
        else {
          this.Notification('刪除失敗', 'error')
        }
      })
    },
    updateNote(place) {
      this.rawData.TripContent.filter(x => x.TripDetailsId == place.TripDetailsId).Note = place.Note
    },
    DragMouseDown(e) {
      this.clickTag = e.target.parentNode.parentNode
      this.tripItems = document.querySelectorAll('.trip-item');
      document.querySelector('.trip-list-header-info');

      // console.dir(this.$refs.tripList)
      // console.dir(document.querySelector('.trip-list-header-info'));
      // console.dir(document.querySelector('.trip-list-header-day-container'));
      // console.dir(document.querySelector('.trip-list-day-container'));

      // 點到drag-handle才有用
      if (e.target.classList[0] == "drag-handler") {
        this.clickTag.style.visibility = 'hidden'
        this.clickTag.style.opacity = 0;

        let template = document.querySelector('#Card');
        cloneNode = template.content.cloneNode(true)
        this.placeCard = cloneNode.querySelector('.place-card')

        // https://emn178.pixnet.net/blog/post/95297028
        let top = this.clickTag.offsetTop + this.$refs.tripList.offsetTop - this.tripContainer.scrollTop + 'px';

        // 要加上目前scroll bar的高度
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        let left = this.clickTag.offsetLeft + this.$refs.tripList.offsetLeft + 'px'
        let width = this.clickTag.clientWidth + 2 + 'px'
        let dataID = this.clickTag.dataset.id
        // 將目前點選的元件資訊放入template中
        this.placeCard.style.top = top
        this.placeCard.style.left = left
        this.placeCard.style.width = width
        this.placeCard.dataset.id = dataID
        this.currentId = dataID
        this.placeCard.style['z-index'] = 99
        this.placeCard.innerHTML = this.clickTag.innerHTML

        // 初始化參數
        this.scrollTarget = this.tripContainer.scrollTop
        console.log(this.tripContainer.scrollTop);

        this.selectL = this.clickTag.clientHeight // 選定卡片的高度
        // offsetTop(為選定物件 "頂部" 到父層 "頂部" 的距離) + offsetHeight為選定物件到父層 "頂部" 的距離
        // SelectH = offsetTop - 上面兩塊的高度
        console.log(this.clickTag.offsetTop);

        this.selectD = this.clickTag.offsetTop - this.$refs.tripListHeaderDayContainer.clientHeight - this.$refs.tripListHeaderInfo.clientHeight + this.selectL - this.tripContainer.scrollTop
        console.log('選定物件底部到父層頂部的距離', this.selectD);

        this.totalD = this.tripContainer.offsetHeight; // trip-list-day-container的高度
        // this.H = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId) + 1}"]`).offsetHeight
        this.clickId = dataID
        this.selectTop = 0
        this.selectBottom = 0
        this.clientY = 0
        this.y = 0
        this.scrollInterval = 0;
        this.tripContainer.appendChild(cloneNode);

        this.tripItems.forEach(trip => {
          trip.style.transform = "translateY(0px)";
        })

        window.addEventListener('mousemove', this.updateMove)
        window.addEventListener('mouseup', this.updateCard)
      }
    },
    updateCard() {
      clearInterval(this.timeId)
      this.timeId = 0
      window.removeEventListener('mousemove', this.updateMove)
      window.removeEventListener('mouseup', this.updateCard)
      this.clickTag.style.visibility = 'visible'
      this.clickTag.style.opacity = 1;
      // https://www.gushiciku.cn/pl/p9ck/zh-tw
      if (this.steps.length !== 0) {
        // 開始載入
        this.initialLoading = true
        // 深層複製
        let result = JSON.parse(JSON.stringify(this.rawData.TripContent))
        console.log(result);
        // 只交換有動到的部分
        console.log(this.steps);
        this.steps.forEach(step => {
          let newIndex = result.findIndex(x => x.Id == step.new);
          let oldIndex = result.findIndex(x => x.Id == this.clickId)
          let tempData1 = result[oldIndex]
          let tempData2 = result[newIndex]
          result[newIndex] = tempData1
          result[oldIndex] = tempData2
        })
        // 更新Sequence
        let Day, DayId, Sequence, Color
        let PlaceSequenceDetail = [];
        let PlaceSequence = {
          TripDetailsId: 0,
          DayId: 0,
          Sequence: 0
        }

        result.forEach(item => {
          if (item.Type == "Day") {
            Day = item.Day
            DayId = item.DayId
            Sequence = 0
          }
          else {
            Sequence = Sequence + 1
            item.Day = Day
            item.DayId = DayId
            item.Sequence = Sequence
            let PlaceSequence = {
              TripDetailsId: item.TripDetailsId,
              DayId: DayId,
              Sequence: Sequence
            }
            PlaceSequenceDetail.push({ ...PlaceSequence })
          }
        })
        console.log(result);
        console.log(PlaceSequenceDetail);
        axios.put(this.urls.url_UpdatePlaceSequence, {
          PlaceSequenceDetail: PlaceSequenceDetail
        }).then(res => {
          if (res.data.IsSuccessful) {
            this.Notification('修改成功', 'success')
            console.log(res);
            this.getData();
          }
          else {
            this.Notification('修改失敗', 'error')
          }
        })
        this.tripItems.forEach(trip => {
          trip.style.transitionDuration = '10ms'
          trip.style.transform = "translateY(0px)"
          trip.style = ''
        })
        this.tripContainer.removeChild(this.placeCard)
        this.steps = []
      }
      else {
        // 沒動
        this.tripContainer.removeChild(this.placeCard)
        this.tripItems.forEach(trip => {
          trip.style = ''
        })
      }
    },
    // --- 決定是否隱藏路線、標記 ---
    revealRouteAndMarker(revealAllMarkers) {
      let map = this.map
      if (revealAllMarkers) {
        // 隱藏
        this.directionsRenderersData.forEach(directionsRendererData => {
          directionsRendererData.directionsRenderer.setMap(null)
        })
        this.markersData.forEach(markerData => {
          markerData.marker.setVisible(false)
        })
      }
      else {
        // 顯示
        if (this.placeMarker !== '') {
          this.placeMarker.setVisible(false);
        }
        this.placeMarker = ''
        this.directionsRenderersData.forEach(directionsRendererData => {
          this.directionsService = new google.maps.DirectionsService();
          this.directionsService.route({
            origin: {
              query: directionsRendererData.origin
            },
            destination: directionsRendererData.destination,
            waypoints: directionsRendererData.waypoint,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false
          }, function (res, status) {
            directionsRendererData.directionsRenderer.setOptions({
              map: map
            })
            directionsRendererData.directionsRenderer.setDirections(res);
          })
        })
        this.markersData.forEach(markerData => {
          markerData.marker.setVisible(true)
        })
        // 全部顯示代表頁面關掉
        this.ShowPlaceDetail = false
      }
    },
    // --- 顯示有點擊的路線 ---
    ResetRoute(map) {
      if (this.showSpecificRoute.content.Day == undefined) {
        if (this.markersData.length !== 0) {
          this.markersData.forEach(markerData => {
            markerData.marker.setVisible(true)
          })
        }
        if (this.directionsRenderersData.length !== 0) {
          this.directionsRenderersData.forEach(directionsRendererData => {
            directionsRendererData.directionsRenderer.setMap(null)
          })
          this.directionsRenderersData.forEach(directionsRendererData => {
            this.directionsService = new google.maps.DirectionsService();
            this.directionsService.route({
              origin: {
                query: directionsRendererData.origin
              },
              destination: directionsRendererData.destination,
              waypoints: directionsRendererData.waypoint,
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: false
            }, function (res, status) {
              directionsRendererData.directionsRenderer.setOptions({
                map: map
              })
              directionsRendererData.directionsRenderer.setDirections(res);
            })
          })
        }
      }
      else {
        if (this.markersData.length !== 0) {
          this.markersData.forEach(markersData => {
            if (markersData.DayId == this.showSpecificRoute.content.DayId) {
              markersData.marker.setVisible(true)
            }
            else {
              markersData.marker.setVisible(false)
            }
          })
        }
        if (this.directionsRenderersData.length !== 0) {
          this.directionsRenderersData.forEach(directionsRendererData => {
            directionsRendererData.directionsRenderer.setMap(null)
          })
          this.directionsRenderersData.forEach(directionsRendererData => {
            if (directionsRendererData.DayId == this.showSpecificRoute.content.DayId) {
              this.directionsService.route({
                origin: {
                  query: directionsRendererData.origin
                },
                destination: directionsRendererData.destination,
                waypoints: directionsRendererData.waypoint,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: false
              }, function (res, status) {
                directionsRendererData.directionsRenderer.setOptions({
                  map: map
                })
                directionsRendererData.directionsRenderer.setDirections(res);
              })
            }
            else {
              directionsRendererData.directionsRenderer.setMap(null)
            }
          })
        }
      }
    },
    // --- 用非同步的方式計算路線 ---
    async calculateRoute(result) {
      // 移除marker、direction
      if (this.markersData.length !== 0) {
        this.markersData.forEach(markersData => {
          // marker.setIcon(null)
          // marker.setLabel(null);
          // marker.setMap(null)
          markersData.marker.setVisible(false)
        })
        this.markersData = []
      }
      if (this.directionsRenderersData.length !== 0) {
        this.directionsRenderersData.forEach(directionsRendererData => {
          directionsRendererData.directionsRenderer.setMap(null)
        })
      }
      let SortPlaceData = []
      let PlaceData = {
        DayId: '',
        Places: [],
        Color: ''
      }
      result.forEach((item, index) => {
        if (item.Type == "Day") {
          if (PlaceData.DayId !== '') {
            SortPlaceData.push(PlaceData)
            PlaceData = {
              DayId: '',
              Places: [],
              Color: ''
            }
          }
          PlaceData.DayId = item.DayId
          PlaceData.Color = item.Color
        }
        else {
          PlaceData.Places.push(item.PlaceName)
          if (index == result.length - 1) {
            SortPlaceData.push(PlaceData)
          }
        }
      })
      for (let i = 0; i < SortPlaceData.length; i++) {
        if (SortPlaceData[i].Places.length > 1) {
          const res = await this.markRouteAndPlace(SortPlaceData[i], result, i)
          console.log(i, res);

        }
        else if (SortPlaceData[i].Places.length == 1) {
          const res = await this.markOnePlace(SortPlaceData[i], result, i)
          console.log(i, res);
        }
      }
      console.log('end');
      this.rawData.TripContent = JSON.parse(JSON.stringify(result))

      // 更新markersData裡的TripDetailsId
      let TotalTripDetailsId = this.rawData.TripContent.filter(x => x.TripDetailsId !== 0);
      console.log(TotalTripDetailsId);

      this.markersData.forEach((item, index) => {
        item.TripDetailsId = TotalTripDetailsId[index].TripDetailsId
      })
      console.log(this.markersData);
      this.initialLoading = false
      this.Loading = false


    },
    // --- 標記多個地點與路線 (Promise) ---
    markRouteAndPlace(item, result, i) {
      return new Promise((resolve) => {
        let loactions = {
          origin: item.Places.shift(), // 移除第一個
          destination: item.Places.pop() // 移除最後一個
        }
        let WayPoints = []
        item.Places.forEach(waypoint => {
          WayPoints.push({
            location: waypoint,
            stopover: true
          })
        })
        let CalulateResult = {
          DayId: '',
          Address: [],
          CarTime: []
        }
        this.calculateAndDisplayRoute(loactions, WayPoints, item.Color, this.map, this.pinSymbol, this.markLabel, item.DayId).then(res => {
          CalulateResult.DayId = item.DayId
          res.routes[0].legs.forEach((result, index) => {
            CalulateResult.Address.push(result.start_address.slice(3, -1))
            if (index == res.routes[0].legs.length - 1) {
              CalulateResult.Address.push(result.end_address.slice(3, -1))
            }
            CalulateResult.CarTime.push(result.duration.text)
          })
          let DayStartTime = 0
          result.filter(x => x.DayId == CalulateResult.DayId && x.Type == "Place").forEach((selected, index) => {
            selected.Address = CalulateResult.Address[index]

            if (index == 0) {
              DayStartTime = result.filter(x => x.DayId == CalulateResult.DayId && x.Type == "Day")[0].StartTime
            }
            let StartDateAry = this.rawData.StartDate.split('-')
            let datetime = new Date(StartDateAry[0], StartDateAry[1], StartDateAry[2], DayStartTime.split(':')[0], DayStartTime.split(':')[1])

            let stayTime = this.parseStayTime(selected)

            let EndTime = new Date(datetime.getTime() + (stayTime.stay_hour * 60 + stayTime.stay_minute) * 60000)
            selected.StartTime = this.changeDateFormat(datetime)
            selected.EndTime = this.changeDateFormat(EndTime)

            if (CalulateResult.CarTime.length == index) {
              // 最後一個景點
              selected.Car = ''
              // 日期替換
            }
            else {
              // 加入Car的時間
              selected.Car = CalulateResult.CarTime[index]
              // 日期替換
              let car_hour = 0;
              let car_minute = 0;
              if (CalulateResult.CarTime[index].split(' ').length == 2) {
                // 沒有小時
                car_hour = 0
                car_minute = parseInt(CalulateResult.CarTime[index].split(' ')[0])
              }
              else {
                car_hour = parseInt(CalulateResult.CarTime[index].split(' ')[0])
                car_minute = parseInt(CalulateResult.CarTime[index].split(' ')[2])
              }
              let AddCarTime = new Date(datetime.getTime() + ((car_hour + stayTime.stay_hour) * 60 + (car_minute + stayTime.stay_minute)) * 60000)
              DayStartTime = this.changeDateFormat(AddCarTime)
            }
          })
          console.log(i);
          resolve(i)
        })
      })
    },
    // --- 標記一個地點 (Promise) ---
    markOnePlace(item, result, i) {
      return new Promise(resolve => {
        let DayStartTime = result.filter(x => x.DayId == item.DayId && x.Type == "Day")[0].StartTime
        let StartDateAry = this.rawData.StartDate.split('-')
        let datetime = new Date(StartDateAry[0], StartDateAry[1], StartDateAry[2], DayStartTime.split(':')[0], DayStartTime.split(':')[1])
        let selected = result.filter(x => x.DayId == item.DayId && x.Type == "Place")[0]

        let stayTime = this.parseStayTime(selected)

        let EndTime = new Date(datetime.getTime() + ((stayTime.stay_hour) * 60 + stayTime.stay_minute) * 60000)
        selected.StartTime = this.changeDateFormat(datetime)
        selected.EndTime = this.changeDateFormat(EndTime)
        selected.Car = ''

        this.findPlace(item.DayId, item.Places[0], item.Color, this.markLabel, selected).then(res => {
          console.log(i);
          resolve(i)
        })
      })
    },
    // --- 解析停留時間成stay_hour/stay_minute ---
    parseStayTime(selected) {
      let stayTime = {
        stay_hour: 0,
        stay_minute: 0
      }
      if (selected.StayTime.split(' ').length == 2) {
        stayTime.stay_hour = parseInt(selected.StayTime.split(' ')[0].split('小時')[0])
        stayTime.stay_minute = parseInt(selected.StayTime.split(' ')[1].split('分')[0])
      }
      else {
        if (selected.StayTime.includes("小時")) {
          stayTime.stay_hour = parseInt(selected.StayTime.split('小時')[0])
        }
        else if (selected.StayTime.includes("分")) {
          stayTime.stay_minute = parseInt(selected.StayTime.split('分')[0])
        }
      }
      return stayTime
    },
    // --- 複製景點，複製到該天的最後一個 ---
    copyPlace(place) {
      console.log(place);
      let selectDayContent = this.rawData.TripContent.filter(x => x.DayId == place.DayId)
      this.updatePlaceToPlan(place, selectDayContent, place.DayId)
    },
    // --- 增加景點，增加在第一天的最後一個 ---
    addPlace(place) {
      let selectDayId = this.rawData.TripContent[0].DayId
      let selectDayContent = this.rawData.TripContent.filter(x => x.DayId == selectDayId)
      console.log(place, selectDayContent, selectDayId);

      this.updatePlaceToPlan(place, selectDayContent, selectDayId)
    },
    // --- 將景點增加至資料庫 ---
    updatePlaceToPlan(place, selectDayContent, selectDayId) {
      let request = {
        TripId: this.rawData.TripId,
        DayId: selectDayId,
        Sequence: selectDayContent[selectDayContent.length - 1].Sequence + 1,
        PlaceName: place.PlaceName,
        PlaceCity: place.PlaceCity,
        PlaceStayTime: '00:00:00',
        Note: ''
      }
      console.log(request);
      axios.post(this.urls.url_AddPlaceToPlan, request).then(res => {
        console.log(res);
        console.log(request);
        
        if (res.data.IsSuccessful) {
          this.page = 'TripList'
          this.initialLoading = true
          this.ShowPlaceDetail = false
          if (this.placeMarker !== '') {
            this.placeMarker.setVisible(false);
          }
          this.placeMarker = ''
          this.Notification('新增成功', 'success')
          this.getData();
        }
        else {
          this.Notification('新增失敗', 'error')
        }
      })
    },
    findPlace(DayId, Place, color, markLabel, selected) {
      return new Promise((resolve, reject) => {
        let request = {
          query: Place,
          fields: ['ALL']
        }
        let PlacesService = new google.maps.places.PlacesService(this.map);
        PlacesService.findPlaceFromQuery(request, function (results, status) {
          selected.Address = results[0].formatted_address.slice(3, -1)
          markLabel(DayId, results[0].geometry.location, color, "1", "900")
          resolve('success')
        })
      })

    },
    changeDateFormat(datetime) {
      let result = {
        hour: datetime.getHours().toString().padStart(2, 0),
        minute: datetime.getMinutes().toString().padStart(2, 0)
      }
      return `${result.hour}:${result.minute}`
    },

    calculateAndDisplayRoute(locations, waypoint, routeColor, map, pinSymbol, markLabel, DayId) {
      this.directionsService = new google.maps.DirectionsService();
      // A service for computing directions between two or more places.
      let directionsRenderer = new google.maps.DirectionsRenderer({
        // Renders directions obtained from the DirectionsService.
        map: map,
        suppressMarkers: true,
        // suppressPolylines: true,
        polylineOptions: {
          strokeColor: routeColor,
          strokeOpacity: 0.6,
          strokeWeight: 5
        },
      })
      // 將directionsRendererData資料存起來
      let directionsRendererData = {
        directionsRenderer: directionsRenderer,
        DayId: DayId,
        origin: locations.origin,
        destination: locations.destination,
        waypoint: waypoint,
        routeColor: routeColor,
      }
      this.directionsRenderersData.push(directionsRendererData)
      return new Promise((resolve, reject) => {
        this.directionsService.route({
          origin: {
            query: locations.origin
          },
          destination: locations.destination,
          waypoints: waypoint,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false
        }, function (res, status) {

          directionsRenderer.setDirections(res);
          // draw marker
          let my_route = res.routes[0]
          let Places = []
          my_route.legs.forEach(item => {
            Places.push(item.start_location)
          })
          Places.push(my_route.legs[my_route.legs.length - 1].end_location)
          let fontWeight = 'normal'
          for (var i = 0; i < Places.length; i++) {
            if (i == 0 || i == Places.length - 1) {
              fontWeight = '900'
            }
            else {
              fontWeight = '400'
            }
            markLabel(DayId, Places[i], routeColor, (i + 1).toString(), fontWeight)
          }
          resolve(res)
        })
      })
    },
    // https://www.letswrite.tw/google-map-api-marker-custom/#%e5%85%ad%e3%80%81info-windows 加上info
    markLabel(DayId, Place, color, labelText, fontWeight) {
      let map = this.map
      let icon = this.pinSymbol(color)
      let position = JSON.parse(JSON.stringify(Place))

      let label = {
        text: labelText,
        color: 'black',
        fontSize: '12px',
        fontWeight: fontWeight
      }
      let marker = new google.maps.Marker({
        position: position,
        label: label,
        map: map,
        optimized: true,
        icon: icon
      })
      let markerData = {
        marker: marker,
        DayId: DayId,
        TripDetailsId: ''
      }
      this.markersData.push(markerData)
    },
    pinSymbol(color) {
      return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 0.8,
        strokeColor: '#000',
        strokeWeight: 2,
        // border
        scale: 1,
        labelOrigin: new google.maps.Point(0, -29)
      };
    },
    updateMove(e) {
      this.checkMouseDirection(e)
      // 漂浮卡片移動
      this.placeCard.style.transform = `translateY(${this.y}px)`
      if (this.mouseDirection == 'down') {
        this.selectD = this.selectD + this.interval_y  // 有可能超出畫面

        // 如果滑鼠有移動，則需要修改
        // if (this.stopScroll){
        //   this.selectBottom = this.selectBottom + this.interval_y
        //   this.selectTop = this.selectTop - this.interval_y
        // }
        this.selectBottom = this.selectBottom + this.interval_y
        this.selectTop = this.selectTop - this.interval_y

        if (!this.checkTripScrollDirection()) {
          console.log('要移動的區塊 down', this.H);
          console.log('selectBottom', this.selectBottom, 'selectTop', this.selectTop);
          // 代表沒有滑動到底部
          if (!this.stopMove) {
            if (this.selectBottom > this.H / 2) {
              this.changeData(this.mouseDirection)
            }
          }
        }
      }
      else if (this.mouseDirection == 'up') {
        // 在底部，然後scroll bar往下移動，但鼠標是往上
        this.selectD = this.selectD - this.interval_y

        // 如果滑鼠有移動，則需要修改
        // if (this.stopScroll) {
        //   this.selectTop = this.selectTop + this.interval_y
        //   this.selectBottom = this.selectBottom - this.interval_y
        // }
        this.selectTop = this.selectTop + this.interval_y
        this.selectBottom = this.selectBottom - this.interval_y

        if (!this.checkTripScrollDirection()) {
          console.log('要移動的區塊 up', this.H);
          console.log('selectBottom', this.selectBottom, 'selectTop', this.selectTop);
          if (!this.stopMove) {
            if (this.selectTop > this.H / 2) {
              this.changeData(this.mouseDirection)
            }
          }
        }
      }
    },
    addSteps() {
      if (this.steps.length !== 0) {
        // 檢查是否移回原位
        if (this.steps[this.steps.length - 1].old == this.ChangeData.new &&
          this.steps[this.steps.length - 1].new == this.ChangeData.old) {
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
    changeData(direction) {
      if (direction == 'up') {
        let changeNode = this.tripContainer.querySelector(`[data-id="${this.currentId}"]`)
        if (changeNode.style.transform == 'translateY(0px)' ||
          changeNode.style.transform == `translateY(${this.selectL}px)`) {
          let moveNode = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId) - 1}"]`)
          moveNode.style.transform = `translateY(${this.selectL}px)`
          this.currentId = parseInt(this.currentId) - 1
        }
        else if (changeNode.style.transform == `translateY(${this.selectL * (-1)}px)`) {
          let moveNode = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId)}"]`)
          moveNode.style.transform = `translateY(0px)`
          this.currentId = parseInt(this.currentId) - 1
        }
        this.stopScroll = false
        console.log('this.H', this.H);


        // if (!this.stopMove) {
        //   this.selectBottom = this.H - this.selectTop
        //   this.selectTop = (this.H - this.selectTop) * (-1)
        // }
        this.selectBottom = this.H - this.selectTop
        this.selectTop = (this.H - this.selectTop) * (-1)
        console.log('new selectTop', this.selectTop, 'new selectBottom', this.selectBottom);
        this.ChangeData.old = parseInt(this.currentId) + 1
        this.ChangeData.new = parseInt(this.currentId)
        this.addSteps();
      }
      else if (direction == 'down') {
        let changeNode = this.tripContainer.querySelector(`[data-id="${this.currentId}"]`)
        console.log(changeNode.style.transform);

        if (changeNode.style.transform == 'translateY(0px)' ||
          changeNode.style.transform == `translateY(${this.selectL * (-1)}px)`) {
          let moveNode = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId) + 1}"]`)
          moveNode.style.transform = `translateY(${this.selectL * (-1)}px)`
          this.currentId = parseInt(this.currentId) + 1
        }
        else if (changeNode.style.transform == `translateY(${this.selectL}px)`) {
          let moveNode = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId)}"]`)
          moveNode.style.transform = `translateY(0px)`
          this.currentId = parseInt(this.currentId) + 1
        }
        this.stopScroll = false
        console.log('this.H', this.H);

        // if (!this.stopMove) {
        //   this.selectTop = this.H - this.selectBottom
        //   this.selectBottom = (this.H - this.selectBottom) * (-1)
        // }
        this.selectTop = this.H - this.selectBottom
        this.selectBottom = (this.H - this.selectBottom) * (-1)
        console.log('new selectTop', this.selectTop, 'new selectBottom', this.selectBottom);
        // alert('test')
        this.ChangeData.old = parseInt(this.currentId) - 1
        this.ChangeData.new = parseInt(this.currentId)
        this.addSteps();
      }
    },
    checkMouseDirection(e) {
      // 監測鼠標位置
      if (this.clientY !== 0) {
        let changeNode = this.tripContainer.querySelector(`[data-id="${this.currentId}"]`)
        if (this.clientY > e.clientY) {
          this.mouseDirection = 'up'
          this.updateNextH(this.mouseDirection)
          this.interval_y = this.clientY - e.clientY
          this.y = this.y - this.interval_y
        }
        else if (this.clientY < e.clientY) {
          this.mouseDirection = 'down'
          // 判斷接下來要確認的H、是否stopMove
          this.updateNextH(this.mouseDirection)
          this.interval_y = e.clientY - this.clientY
          this.y = this.y + this.interval_y
        }
        else {
          this.mouseDirection = 'same'
        }
      }
      // 記錄前一次數值用於下次比較
      this.clientY = e.clientY
    },
    updateNextH(direction) {
      let changeNode = this.tripContainer.querySelector(`[data-id="${this.currentId}"]`)
      if (direction == "down") {
        console.log();

        if (changeNode.style.transform == 'translateY(0px)' ||
          changeNode.style.transform == `translateY(${this.selectL * (-1)}px)`) {
          if (parseInt(this.currentId) + 1 == this.tripItems[this.tripItems.length - 1].dataset.id) {
            this.stopMove = true
          }
          else {
            this.stopMove = false
            console.log(parseInt(this.currentId) + 1);

            this.H = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId) + 1}"]`).offsetHeight
          }
        }
        else if (changeNode.style.transform == `translateY(${this.selectL}px)`) {
          this.H = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId)}"]`).offsetHeight
          this.stopMove = false
        }
      }
      else if (direction == "up") {
        if (changeNode.style.transform == 'translateY(0px)' ||
          changeNode.style.transform == `translateY(${this.selectL}px)`) {
          if (parseInt(this.currentId) - 1 == this.tripItems[0].dataset.id) {
            this.stopMove = true
          }
          else {
            this.stopMove = false
            this.H = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId) - 1}"]`).offsetHeight
          }
        }
        else if (changeNode.style.transform == `translateY(${this.selectL * (-1)}px)`) {
          this.H = this.tripContainer.querySelector(`[data-id="${parseInt(this.currentId)}"]`).offsetHeight
          this.stopMove = false
        }
      }
    },
    scrollMove() {
      console.log('ssssss', this.stopScroll);

      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
      // scroll information
      if (this.scrollDirection == 'down') {
        if (!this.stopScroll) {
          this.scrollInterval = this.scrollInterval + 1
          this.scrollTarget = this.scrollTarget + this.scrollInterval
          // let option = {
          //   top: this.scrollTarget,
          //   behavior: 'auto'
          // }
          // console.log(option);

          this.tripContainer.scroll(0, this.scrollTarget)

          if (this.tripContainer.scrollTop + this.tripContainer.clientHeight >= this.tripContainer.scrollHeight) {
            // 代表到底部
            this.stopScroll = true
            this.scrollTarget = this.tripContainer.scrollTop
            this.scrollInterval = 0
            // clearTimeInterval
            clearInterval(this.timeId)
            this.timeId = 0
          }
          else {
            this.stopScroll = false
            this.selectBottom = this.selectBottom + this.scrollInterval
            this.selectTop = this.selectTop - this.scrollInterval
            // 檢查下一個H
            this.updateNextH(this.scrollDirection)
            console.log(this.selectBottom, this.selectTop);

            if (!this.stopMove) {
              if (this.selectBottom > this.H / 2) {
                console.log(this.selectBottom, this.selectTop, this.H);
                this.scrollInterval = 0
                this.changeData(this.scrollDirection)
                // alert('AAAAAA')
              }
            }
          }
        }
      }
      else if (this.scrollDirection == 'up') {
        if (!this.stopScroll) {
          this.scrollInterval = this.scrollInterval + 1
          this.scrollTarget = this.scrollTarget - this.scrollInterval
          this.tripContainer.scroll(0, this.scrollTarget)
          if (this.tripContainer.scrollTop == 0) {
            // 代表到頂
            this.stopScroll = true
            this.scrollTarget = 0
            this.scrollInterval = 0
            // clearTimeInterval
            clearInterval(this.timeId)
            this.timeId = 0
          }
          else {
            this.stopScroll = false
            this.selectBottom = this.selectBottom - this.scrollInterval
            this.selectTop = this.selectTop + this.scrollInterval
            // 檢查下一個H
            this.updateNextH(this.scrollDirection)
            if (!this.stopMove) {
              if (this.selectTop > this.H / 2) {
                this.scrollInterval = 0
                this.changeData(this.scrollDirection)
              }
            }
          }
        }
      }
    },
    checkTripScrollDirection() {
      let result
      // console.log(this.selectD, this.totalD);
      // console.log(this.currentDirection, 'first');
      console.log(this.selectD, this.selectL, this.tripContainer.scrollTop);

      // 用非同步的方式觸發
      if (this.selectD > this.totalD) {
        // 到達trip-list底部，並且scroll bar開始滑動
        if (this.tripContainer.scrollTop + this.tripContainer.clientHeight >= this.tripContainer.scrollHeight) {
          // 到達底部後要把stopScroll改成true
          this.stopScroll = true
          this.scrollTarget = 0
          this.scrollInterval = 0
          // clearTimeInterval
          clearInterval(this.timeId)
          this.timeId = 0
          result = false
        }
        else {
          this.scrollDirection = 'down'
          this.stopScroll = false
          result = true
        }
      }
      else if (this.selectD < this.selectL) {
        // 到達trip-list頂部，並且scroll bar開始滑動
        if (this.tripContainer.scrollTop == 0) {
          // 到達頂部後要把stopScroll改成true
          this.stopScroll = true
          this.scrollTarget = 0
          this.scrollInterval = 0
          // clearTimeInterval
          clearInterval(this.timeId)
          this.timeId = 0
          result = false
        }
        else {
          this.scrollDirection = 'up'
          this.stopScroll = false
          result = true
        }
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
          this.timeId = setInterval(this.scrollMove, 10)
        }
      }
      return result
    },
    // --- 天數往左滑 ---
    previous() {
      // scroll： jsonplaceholder.typicode.com
      let scrollObj = this.$refs.tripListHeaderDayComponent
      this.ScrollOption.left = scrollObj.scrollLeft
      this.ScrollOption.left = this.ScrollOption.left - 70
      this.$refs.tripListHeaderDayComponent.scroll(this.ScrollOption)
    },
    // --- 天數往右滑 ---
    next() {
      // scroll： jsonplaceholder.typicode.com
      let scrollObj = this.$refs.tripListHeaderDayComponent
      this.ScrollOption.left = scrollObj.scrollLeft
      this.ScrollOption.left = this.ScrollOption.left + 70
      this.$refs.tripListHeaderDayComponent.scroll(this.ScrollOption)
    },
    // --- 增加一天 ---
    AddDay() {
      console.log(this.rawData);
      axios.post(this.urls.url_AddPlanDay, {
        TripId: this.rawData.TripId,
        Day: this.rawData.TotalDate + 1
      }).then(res => {
        console.log(res);
        if (res.data.IsSuccessful) {
          this.Notification('新增成功', 'success')
          this.getData();
        }
        else {
          this.Notification('新增失敗', 'error')
        }
      })
    },

    // --- Day Drag ---
    DayDragMouseDown(e) {
      this.clickTag = e.target.parentNode.parentNode
      this.dayContainer = this.$refs.tripListHeaderDayComponent
      this.dayItems = document.querySelectorAll('.day-item')
      // 點到drag-handle才有用
      if (e.target.classList[0] == "drag-handler") {
        this.clickTag.style.visibility = 'hidden'
        this.clickTag.style.opacity = 0;
        // console.dir(document.querySelector('.trip-list-header-info'))
        // console.dir(document.querySelector('.trip-list').offsetTop)
        // console.log(document.querySelector('.trip-list-header-info').offsetHeight);

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
    // --- 更新Day ---
    updateDayCard() {
      clearInterval(this.timeId)
      this.timeId = 0
      window.removeEventListener('mousemove', this.updateDayMove)
      window.removeEventListener('mouseup', this.updateDayCard)
      this.clickTag.style.visibility = 'visible'
      this.clickTag.style.opacity = 1;

      // https://www.gushiciku.cn/pl/p9ck/zh-tw
      if (this.steps.length !== 0) {
        console.log(this.steps);
        this.initialLoading = true
        // 深層複製
        let result = JSON.parse(JSON.stringify(this.rawData.TripContent))
        let LastIndex = this.steps[this.steps.length - 1].new - 1
        let select = this.rawDataOnlyDay.splice(this.clickId - 1, 1)[0]
        this.rawDataOnlyDay.splice(LastIndex, 0, select)
        console.log(this.rawDataOnlyDay);
        let DaySequenceDetail = []
        let day = 1
        this.rawDataOnlyDay.forEach(item => {
          let DaySequence = {
            DayId: item.DayId,
            Day: day
          }
          day = day + 1
          DaySequenceDetail.push({ ...DaySequence })
        })
        console.log(this.rawDataOnlyDay);
        console.log(DaySequenceDetail);
        axios.put(this.urls.url_UpdateDaySequence, {
          DaySequenceDetail: DaySequenceDetail
        }).then(res => {
          console.log(res);
          if (res.data.IsSuccessful) {
            this.Notification('修改成功', 'success')
            // 重新讀資料庫的資料
            this.getData();
          }
          else{
            this.Notification('修改失敗', 'error')
          }
        })
        this.dayItems.forEach(item => {
          item.style.transitionDuration = '10ms'
          item.style.transform = "translateY(0px)"
          item.style = ''
        })
        this.dayContainer.removeChild(this.dayCard)
      }
      else {
        // 沒動
        this.dayContainer.removeChild(this.dayCard)
        this.dayItems.forEach(item => {
          item.style = ''
        })
      }
      // this.initialLoading = true
      // this.getData();
    },
    updateDayMove(e) {
      this.checkDayDirection(e)
      console.log(this.selectL);

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
              this.changeDayData()
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
              this.changeDayData()
            }
          }
        }
      }
    },
    addDaySteps() {
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
    changeDayData() {
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
        this.addDaySteps()
      }
      else if (this.currentDirection == 'right') {
        if (changeNode.style.transform == 'translateX(0px)' || changeNode.style.transform == `translateX(${this.selectL * (-1)}px)`) {
          let moveNode = this.dayContainer.querySelector(`[data-id="${parseInt(this.currentId) + 1}"]`)
          console.log(parseInt(this.currentId) + 1);

          console.log(moveNode);

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
        this.addDaySteps()
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
                this.changeDayData()
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
                this.changeDayData()
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
    },
    InitMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        zoom: 16,
        center: { lat: 25.0336752, lng: 121.5648831 },
        mapTypeControl: false
        // streetViewControl: false
      })
    },
    TripListShow(e) {
      if (e.target.innerWidth >= 768) {
        this.showTripList = true
      }
    },
    calcTripContainerHeight(height) {
      let H = this.$refs.tripListHeaderInfo.scrollHeight
      console.log(this.$refs.tripListHeaderDayContainer.clientHeight);

      this.tripContainer.style.height = `calc(100% - (${this.$refs.tripListHeaderInfo.scrollHeight + height}px)`
      console.log(this.tripContainer.style.height);
    },
    // --- 在searchBox按下Enter ---
    updateSearchBox() {
      this.searchBox = new google.maps.places.SearchBox(this.$refs.searchBox);
      this.searchBox.addListener('places_changed', () => {
        console.log(this.$refs.searchBox.value);
        this.searchByBtn();
      })
    },
    // --- 按下搜尋按鈕 ---
    searchByBtn() {
      console.log(this.$refs.searchBox.value);
      this.ShowPlaceDetail = true
      let Place = {
        PlaceName: this.$refs.searchBox.value,
        Note: ''
      }
      let searchPlaceType = {
        searchBoxPlace: true,
        Place: Place,
        collection: false
      }
      this.searchPlace = searchPlaceType
    },
    searchByCollection(Place) {
      this.ShowPlaceDetail = true
      let searchPlaceType = {
        searchBoxPlace: true,
        Place: {
          PlaceName: Place,
          Note: ''
        },
        collection: true
      }
      this.searchPlace = searchPlaceType
    },
    addCollection(CollectionPlace) {
      console.log(CollectionPlace);
      let request = {
        UserId: this.rawData.UserId,
        PlaceName: CollectionPlace.PlaceName,
        PlaceImage: CollectionPlace.PlaceImage,
        PlaceTypeId: CollectionPlace.PlaceTypeId
      }
      axios.post(this.urls.url_AddAttractionCollection, request).then(res => {
        console.log(res);
        if (res.data.IsSuccessful) {
          this.Notification('新增成功', 'success')
          axios.get(`${this.urls.url_GetAttractionCollection}${this.rawData.UserId}`).then(res => {
            this.rawData.AttractionCollection = res.data
          })
        }
        else{
          this.Notification('新增失敗', 'error')
        }
      })
    },
    // --- 標記搜尋出來的地點 ---
    markSearchResult(loaction) {
      this.revealRouteAndMarker(true)
      if (this.placeMarker !== '') {
        this.placeMarker.setVisible(false);
      }
      this.placeMarker = new google.maps.Marker({
        position: loaction,
        map: this.map,
      })
      this.map.setCenter(loaction);
    },
    // init() {
    //     let source = this
    //     $.connection.hub.logging = true;
    //     var chatHub = $.connection.serviceHub;
    //     console.log(chatHub);
    //     // client function
    //     chatHub.client.newMessage = function (message) {
    //         console.log(message);
    //         console.log(source.focus);
    //         // 判斷是否focus，如果為是，則送put去修改已讀表格
    //         $('#ulChatMessages').append('<li>' + message + '</li>');
    //     }
    //     // client function
    //     chatHub.client.alert = function (message) {
    //         console.log(message);
    //     }
    //     // Add 1
    //     chatHub.client.updateMessageRead = function (MessageId) {
    //         console.log(MessageId);
    //     }
    //     // AddMessage
    //     chatHub.client.addMessage = function (tripChatRoom) {
    //         console.log(tripChatRoom);
    //     }
    //     // DeleteMessage
    //     chatHub.client.deleteMessage = function (MessageId) {
    //         console.log(MessageId);
    //     }

    //     $.connection.hub.start().done(function () {
    //         // 加入群組，TripId
    //         chatHub.server.joinAGroup('44');
    //     })
    // },
    addMessage() {
        let now = new Date();
        let request = {
            TripId: this.chatData.TripId,
            UserId: this.userId,
            Time: `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getDate()).toString().padStart(2, '0')} ${(now.getHours()).toString().padStart(2, '0')}:${(now.getMinutes()).toString().padStart(2, '0')}:${now.getSeconds()}.${now.getMilliseconds()}}`,
            Message: this.message
        }
        console.log(request);
        axios.post(this.urls.url_addMessage, request).then(res => {
            console.log(res);
        })
    },
    deleteSelectMessage() {
        console.log(this.selectMessage);
    },
    getChatData() {
        let url = 'https://raw.githubusercontent.com/r04941090/FileStorage/master/Chat_new5'
        axios.get(this.urls.url_readAllMessage).then(res => {
            console.log(res);
            this.chatData = res.data
            console.log(this.chatData);
            this.$refs.room.scrollTop = this.$refs.room.scrollHeight
            this.$nextTick(() => {
                // https://iter01.com/581627.html
                console.log(this.$refs.room.scrollTop, this.$refs.room.scrollHeight);
                this.$refs.room.scrollTop = this.$refs.room.scrollHeight
            });
        })
    },
    getSelectMessage(message, event) {
        this.menuShow = true
        let contextElement = this.$refs.contextMenu
        contextElement.style.top = event.y + "px";
        contextElement.style.left = event.x + "px";
        this.selectMessage = message
    },
    clearSelectMessage(e) {
        this.menuShow = false
    },
    groupBy(array, f) {
        // https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/157462/
        let groups = {};
        array.forEach(function (o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    }
  },
  computed: {
    MessageContent: function () {
        if (this.chatData.MessageContent !== undefined) {
            console.log(this.chatData.MessageContent);
            let sortData = []
            let sorted = this.groupBy(this.chatData.MessageContent, function (item) {
                return [item.Time.split(' ')[0]];
            });
            console.log(sorted);
            let UserId = 0
            sorted.forEach(sortByDay => {
                let element = {
                    PostDate: sortByDay[0].Time.split(' ')[0],
                    MessageBox: []
                }
                let sortByTime = this.groupBy(sortByDay, function (item) {
                    return [item.Time.split(' ')[1]];
                })

                sortByTime.forEach(item1 => {
                    let BeforeUserId = 0
                    item1.forEach((item2, index) => {
                        if (index == 0) {
                            item2.showArrow = true
                            UserId = item2.UserId
                        }
                        else {
                            if (UserId !== item2.UserId) {
                                item2.showArrow = true
                                UserId = item2.UserId

                            }
                            else {
                                item2.showArrow = false
                            }
                        }
                        if (index !== item1.length - 1) {
                            if (item1[index + 1].UserId !== item2.UserId) {
                                item2.showTime = true
                            }
                            else {
                                item2.showTime = false
                            }
                        }
                        else {
                            item2.showTime = true
                        }
                        let hour = item2.Time.split(' ')[1].split(':')[0]
                        let minute = item2.Time.split(' ')[1].split(':')[1]
                        item2.PostType = hour > 11 ? '下午' : '上午'
                        item2.PostTime = hour > 12 ? `${hour - 12}:${minute}` : `${hour}:${minute}`
                        element.MessageBox.push(item2)
                    })
                })
                sortData.push(JSON.parse(JSON.stringify(element)))
                console.log(sortByTime);
            })
            
            console.log(sortData);
            return sortData
        }
    }
  },
  watch: {
    rawData: {
      handler: function (newValue) {
        // console.log('watchRawData', newValue);
      },
      deep: true
    },
    edit: {
      handler: function () {
        this.showSpecificRoute = {
          show: false,
          content: {}
        }
        if (this.edit) {
          this.calcTripContainerHeight(99);
        }
        else {
          this.calcTripContainerHeight(49);
        }
        // this.StartDate = new Date(2021, 9, 1)

      }
    },
    StartDate: {
      handler: function (newValue, oldValue) {
        if (oldValue !== '') {
          axios.put(this.urls.url_UpdateTrip, {
            TripId: this.rawData.TripId,
            TripTitle: this.rawData.TripTitle,
            StartDate: newValue
          }).then(res => {
            let value
            if (res.data.IsSuccessful) {
              value = newValue
              this.Notification('修改成功', 'success')
            }
            else {
              value = oldValue
              this.Notification('修改失敗', 'error')
            }
            let StartDateAry = value.split('-')
            let newDate = new Date(StartDateAry[0], StartDateAry[1], StartDateAry[2])
            let calcDate = new Date(StartDateAry[0], StartDateAry[1], StartDateAry[2])
            if (oldValue !== '') {
              this.rawData.TripContent.filter(x => x.Type == 'Day').forEach((item, index) => {
                if (index == 0) {
                  calcEndDate = new Date(calcDate.setDate(calcDate.getDate()))
                  item.Date = `${calcEndDate.getMonth()}月${calcEndDate.getDate()}日`
                }
                else {
                  calcEndDate = new Date(calcDate.setDate(calcDate.getDate() + 1))
                  item.Date = `${calcEndDate.getMonth()}月${calcEndDate.getDate()}日`
                }
              })
              this.rawDataOnlyDay = this.rawData.TripContent.filter(x => x.Type == 'Day')
              let EndDate = new Date(newDate.setDate(newDate.getDate() + this.rawData.TotalDate - 1))
              this.StartDateDisplay = `${StartDateAry[0]}年${StartDateAry[1]}月${StartDateAry[2]}日`
              this.rawData.StartDate = `${StartDateAry[0]}-${StartDateAry[1]}-${StartDateAry[2]}`
              this.EndDate = `${EndDate.getFullYear()}年${EndDate.getMonth()}月${EndDate.getDate()}日`
            }
          })
        }
      }
    },
  },
  components: {
    day,
    placeGps,
    dayPlus,
    dayCell,
    placeDetail
  },

  mounted() {
    this.tripContainer = this.$refs.tripListDayContainer
    this.updateSearchBox()
    this.initialLoading = true
    this.getData();
    this.InitMap();
    window.addEventListener('resize', this.TripListShow)
    this.calcTripContainerHeight()

    this.getChatData()
    window.addEventListener('click', this.clearSelectMessage)

  },
  beforeDestroy() {
    window.removeEventListener("resize", this.TripListShow);
  }
}
Vue.createApp(App).use(ElementPlus).mount('#app');