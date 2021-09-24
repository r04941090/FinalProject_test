let changeCover = document.querySelector('.changeCover');
let coverFile = document.querySelector('.cover-file');
let journalEditTitle, journalEditDesc, journalEditBanner
let journalDayMore
let coverImage;
let reader;
let linkA = document.querySelector('#list_1-1');
let linkB = document.querySelector('#list_1-2');
let journalDatas;
let journal;
let attractionLists;

window.onload = function () {
  reader = new FileReader();
  // FileReader用法
  // https://www.twblogs.net/a/5c9fb23bbd9eee5b1a068359
  journalEditTitle = document.querySelector('#journal-edit-title');
  journalEditDesc = document.querySelector('#journal-edit-desc');
  journalEditBanner = document.querySelector('#journal-edit-banner');
  journalDayMore = document.querySelector('.journal-day-more');
  journalDayMoreText = document.querySelector('.journal-day-more-text');
  journalTimeMore = document.querySelector('.journal-time-more');
  journalTimeMoreText = document.querySelector('.journal-time-more-text');
  journal = document.querySelector('#journal');
  dayContent = document.querySelector('.day-content');

  getData()

  reader.addEventListener('load', function (e) {
    journalEditBanner.style.backgroundImage = `url(${this.result})`;
    console.log(this.result);
  })

  reader.addEventListener('error', function (e) {
    alert('image error')
  })

  changeCover.addEventListener('click', function () {
    coverFile.click();
  })

  coverFile.addEventListener('change', function (e) {
    console.log(e.target.velue);
    
    // 將文件讀取爲 DataURL
    console.log(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0])
  })

  window.addEventListener('click', function (e) {
    // 設定當點擊window後會執行的動作，例如將東西隱藏
    if (e.target.classList[0] === "journal-time-more") {
      document.querySelectorAll('.journal-time-more-text').forEach(item => {
        item.style.display = 'none'
      })
      e.target.style.display = 'none'
      e.target.parentNode.querySelector('.journal-time-more-text').style.display = 'block'
    }
    else if (e.target.classList[0] === "journal-time-more-text"){
      // alert('haha')
      let placeCard = e.target.parentNode.parentNode
      let a = document.getElementsByTagName
      if (Object.values(placeCard.children[1].classList).includes('d-none')){
        e.target.innerText = '隱藏此景點'
        console.log(e.target.parentNode.querySelector('.journal-time-more'));
        placeCard.children[0].parentNode.querySelector('.journal-time-more').style.color = '#000'
        placeCard.children[0].style.color = '#000'
        placeCard.children[0].parentNode.parentNode.querySelector('.location-icon').style.color = '#000'
        placeCard.children[1].classList.add('d-block')
        placeCard.children[2].classList.add('d-block')
        placeCard.children[1].classList.remove('d-none')
        placeCard.children[2].classList.remove('d-none')
      }
      else{
        e.target.innerText = '顯示此景點'
        e.target.style.color = '#000'
        placeCard.children[0].style.color = '#bbb'
        console.log(e.target.parentNode.querySelector('.journal-time-more'));
        e.target.parentNode.querySelector('.journal-time-more').style.color = '#bbb'
        placeCard.children[0].parentNode.parentNode.querySelector('.location-icon').style.color = '#bbb'
        placeCard.children[1].classList.add('d-none')
        placeCard.children[2].classList.add('d-none')
        placeCard.children[1].classList.remove('d-block')
        placeCard.children[2].classList.remove('d-block')

      }
    }
    else if (e.target.classList[0] === "journal-day-more") {
      // alert('asd')
      document.querySelectorAll('.journal-day-more-text').forEach(item => {
        item.style.display = 'none'
      })
      e.target.style.display = 'none'
      e.target.parentNode.querySelector('.journal-day-more-text').style.display = 'block'
    }
    else if (e.target.classList[0] === "journal-day-more-text"){
      let placeCard = e.target.parentNode
      console.log(e.target.innerText);
      
      if (e.target.innerText == '顯示此天'){
        e.target.innerText = '隱藏此天'
        e.target.style.color = 'red'
        console.log(e.target.parentNode.querySelector('.journal-day-more'));
        placeCard.children[0].parentNode.querySelector('.journal-day-more').style.color = '#000'
        placeCard.children[0].style.color = '#000'
        console.log(e.target.parentNode.querySelector('.journal-day-more'));
        e.target.parentNode.querySelector('.journal-day-more').style.color = '#000'
        console.log(e.target.parentNode.querySelector('.journal-day-more').style.color);
        
        console.log(placeCard);
        console.dir(placeCard.parentNode.children);
        let groups = [];
        Object.values(placeCard.parentNode.children).forEach(item => {
          if(item.dataset.day == e.target.parentNode.querySelector('.journal-day').dataset.day){
            groups.push(item)
            console.log(item);
          }
        })
        console.log(groups);
        groups.forEach(group => {
          console.log(group.getElementsByTagName('div')[0]);
          let placeCard = group.getElementsByTagName('div')[0]
          if (Object.values(placeCard.children[1].classList).includes('d-none')){
            console.log('test');
            
            placeCard.children[0].parentNode.querySelector('.journal-time-more-text').innerText = '隱藏此景點'

            let location = placeCard.parentNode.querySelector('.location-icon')
            console.log(placeCard.children[0]);
            
            placeCard.children[0].style.color = '#000'
            location.parentNode.querySelector('.journal-time-more').style.color = '#000'
            placeCard.children[0].style.color = '#000'
            placeCard.children[0].parentNode.parentNode.querySelector('.location-icon').style.color = '#000'
            placeCard.children[1].classList.add('d-block')
            placeCard.children[2].classList.add('d-block')
            placeCard.children[1].classList.remove('d-none')
            placeCard.children[2].classList.remove('d-none')
          }
          else{
            placeCard.children[0].parentNode.querySelector('.journal-time-more-text').innerText = '顯示此景點'
            let location = placeCard.parentNode.querySelector('.location-icon')
            placeCard.children[0].style.color = '#bbb'
            location.parentNode.querySelector('.journal-time-more').style.color = '#bbb'
            location.style.color = '#bbb'
            placeCard.children[1].classList.add('d-none')
            placeCard.children[2].classList.add('d-none')
            placeCard.children[1].classList.remove('d-block')
            placeCard.children[2].classList.remove('d-block')
          }
        })
      }
      else{
        e.target.innerText = '顯示此天'
        e.target.style.color = '#000'
        placeCard.children[0].style.color = '#bbb'
        console.log(e.target.parentNode.querySelector('.journal-day-more'));
        e.target.parentNode.querySelector('.journal-day-more').style.color = '#bbb'
        // console.log(placeCard);
        // console.dir(placeCard.parentNode.children);
        let groups = [];
        Object.values(placeCard.parentNode.children).forEach(item => {
          if(item.dataset.day == e.target.parentNode.querySelector('.journal-day').dataset.day){
            groups.push(item)
            // console.log(item);
          }
        })
        console.log(groups);
        groups.forEach(group => {
          console.log(group.getElementsByTagName('div')[0]);
          let placeCard = group.getElementsByTagName('div')[0]
          if (Object.values(placeCard.children[1].classList).includes('d-none')){
            console.log('test');
            
            placeCard.children[0].parentNode.querySelector('.journal-time-more-text').innerText = '隱藏此景點'

            let location = placeCard.parentNode.querySelector('.location-icon')
            console.log(placeCard.children[0]);
            
            placeCard.children[0].style.color = '#000'
            location.parentNode.querySelector('.journal-time-more').style.color = '#000'

            placeCard.children[0].style.color = '#000'
            placeCard.children[0].parentNode.parentNode.querySelector('.location-icon').style.color = '#000'
            placeCard.children[1].classList.add('d-block')
            placeCard.children[2].classList.add('d-block')
            placeCard.children[1].classList.remove('d-none')
            placeCard.children[2].classList.remove('d-none')
          }
          else{
            placeCard.children[0].parentNode.querySelector('.journal-time-more-text').innerText = '顯示此景點'
            
            let location = placeCard.parentNode.querySelector('.location-icon')
            placeCard.children[0].style.color = '#bbb'
            location.parentNode.querySelector('.journal-time-more').style.color = '#bbb'
            location.style.color = '#bbb'
            placeCard.children[1].classList.add('d-none')
            placeCard.children[2].classList.add('d-none')
            placeCard.children[1].classList.remove('d-block')
            placeCard.children[2].classList.remove('d-block')
    
          }
        })
        // 目前取得需要隱藏的部分！！！！！！！！！！！！！！！！！！！！
      }
    }
    else {
      document.querySelectorAll('.journal-time-more').forEach(item => {
        item.style.display = 'block'
      })
      document.querySelectorAll('.journal-time-more-text').forEach(item => {
        item.style.display = 'none'
      })
      document.querySelectorAll('.journal-day-more').forEach(item => {
        item.style.display = 'block'
      })
      document.querySelectorAll('.journal-day-more-text').forEach(item => {
        item.style.display = 'none'
      })
    }
  })
  console.log(attractionLists);
}

function getData() {
  let url = 'https://raw.githubusercontent.com/r04941090/FileStorage/master/JournalEdit'
  axios.get(url).then(res => {
    console.log(res.data);
    journalDatas = res.data
    journalEditTitle.innerText = journalDatas.journal_title
    journalEditDesc.innerText = journalDatas.journal_description
    if (journalDatas.journal_coverImage) {
      journalEditBanner.style['background-image'] = `url("${journalDatas.journalEditBanner}")`
    }
    initialize()
    CreateDropZone()
  })
}

function initialize() {
  let journalCard = document.querySelector('#cardJournal');
  let journalCardPlace = document.querySelector('#cardJournalPlace');
  let dayCard = document.querySelector('#cardDay');

  let journalFrag = document.createDocumentFragment();
  let dayFrag = document.createDocumentFragment();

  // 動態新增行程
  journalDatas.journal_content.forEach(journalData => {
    let cloneContent = journalCard.content.cloneNode(true);
    let cloneContent_day = dayCard.content.cloneNode(true)
    cloneContent.querySelector('.journal-day').innerText = `第${journalData.Date}天`
    cloneContent.querySelector('.journal-day').dataset.day = journalData.Date
    cloneContent_day.querySelector('.day-nth').innerText = `第${journalData.Date}天`
    
    journalData.Tour.forEach(place => {
      let cloneContent_place = journalCardPlace.content.cloneNode(true);
      cloneContent_place.querySelector('.journal-card').id = `content_${journalData.Date}-${place.id}`
      cloneContent_place.querySelector('.journal-card').dataset.day = journalData.Date
      cloneContent_place.querySelector('.journal-time').innerText = place.staytime
      cloneContent_place.querySelector('.journal-location').innerText = place.name
      
      cloneContent_place.querySelector('.journal-description').value = ''
      console.log(cloneContent_place.querySelector('.dropzone'));
      cloneContent_place.querySelector('.dropzone').id = `updateImg_${journalData.Date}-${place.id}`
      cloneContent.appendChild(cloneContent_place)


      let place_day = document.createElement('div')
      place_day.id = `list_${journalData.Date}-${place.id}`
      place_day.innerText = place.name
      cloneContent_day.querySelector('.attraction-list').appendChild(place_day)
    })
    journalFrag.appendChild(cloneContent);
    console.log(journalFrag);
    
    dayFrag.appendChild(cloneContent_day);
  })

  journal.appendChild(journalFrag)
  dayContent.appendChild(dayFrag);
  
  attractionLists = document.querySelectorAll('.attraction-list');
  attractionLists.forEach(attractionList => {
    console.log(attractionList);
    attractionList.addEventListener('click', function (e) {
      if (e.target.id.includes('list')) {
        console.log(`content_${e.target.id.split('_')[1]}`);
        console.log(document.querySelector(`#content_${e.target.id.split('_')[1]}`));
        to(document.querySelector(`#content_${e.target.id.split('_')[1]}`))
      }
    })
  })

  // 隱藏行程
  document.querySelectorAll('.journal-card').forEach(item => {
    item.addEventListener('click', function (e) {
      if (e.target.classList[0] === "journal-time-more") {
        e.target.style.display = 'none'
        e.target.parentNode.querySelector('.journal-time-more-text').style.display = 'block'
      }
      if (e.target.classList[0] === "journal-time-more-text") {
        e.target.style.display = 'none'
        e.target.parentNode.querySelector('.journal-time-more').style.display = 'block'
      }
      if (e.target.classList[0] === "journal-day-more") {
        console.log('asdasd');
        
        e.target.style.display = 'none'
        e.target.parentNode.querySelector('.journal-day-more-text').style.display = 'block'
      }
      if (e.target.classList[0] === "journal-day-more-text") {
        e.target.style.display = 'none'
        e.target.parentNode.querySelector('.journal-day-more').style.display = 'block'
      }
    });
  })

  // 隱藏天數
  document.querySelectorAll('.day-card').forEach(item => {
    item.addEventListener('click', function (e) {
      // e.stopPropagation()
      if (e.target.classList[0] === "journal-day-more") {
        e.target.style.display = 'none'
        e.target.parentNode.querySelector('.journal-day-more-text').style.display = 'block'
      }
      if (e.target.classList[0] === "journal-day-more-text") {
        e.target.style.display = 'none'
        e.target.parentNode.querySelector('.journal-day-more').style.display = 'block'
      }
    });
  })


  window.addEventListener('scroll', function () {
    // https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E8%AA%8D%E8%AD%98-intersection-observer-api-%E5%AF%A6%E4%BD%9C-lazy-loading-%E5%92%8C-infinite-scroll-c8d434ad218c
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id').split('_')[1]
        console.log(entry.intersectionRatio);

        if (entry.intersectionRatio > 0.8) {
          document.querySelector(`.attraction-list #list_${id}`).style.color = 'red'
        }
        else {
          document.querySelector(`.attraction-list #list_${id}`).style.color = ''
        }
      })
    })
    document.querySelectorAll('.journal-card').forEach(item => {
      observer.observe(item)
    });
  })
}
function to(toEL) {
  // https://juejin.cn/post/6868968417769029640
  // 右邊點擊，移動到特定位置
  window.scrollTo({
    top: toEL.offsetTop - 10,
    behavior: 'smooth'
  })
}
function CreateDropZone() {
  Dropzone.autoDiscover = false; // key point
  let dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(dropzoneaa => {
    var dropzone = new Dropzone(`#${dropzoneaa.id}`, {
      previewTemplate: document.querySelector('#preview-template').innerHTML,
      parallelUploads: 2,
      thumbnailHeight: 135,
      thumbnailWidth: 135,
      maxFilesize: 3,
      filesizeBase: 1000,
      maxFiles: 10,
      thumbnail: function (file, dataUrl) {
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          for (var i = 0; i < images.length; i++) {
            let test = document.querySelector('.test');
            var thumbnailElement = images[i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
            // dataUrl為圖片的資料
          }
          setTimeout(function () { file.previewElement.classList.add("dz-image-preview"); }, 1);
        }
      },
      init: function(){
        this.on('maxfilesexceeded', function(){
          this.removeFile(this.files[10]);
          alert('上傳圖片已超過10張')
        })
      }
    });
    // Now fake the file upload, since GitHub does not handle file uploads
    // and returns a 404

    var minSteps = 6,
      maxSteps = 60,
      timeBetweenSteps = 100,
      bytesPerStep = 100000;

    dropzone.uploadFiles = function (files) {
      var self = this;

      for (var i = 0; i < files.length; i++) {

        var file = files[i];
        console.log(file);

        totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

        for (var step = 0; step < totalSteps; step++) {
          var duration = timeBetweenSteps * (step + 1);
          setTimeout(function (file, totalSteps, step) {
            return function () {
              file.upload = {
                progress: 100 * (step + 1) / totalSteps,
                total: file.size,
                bytesSent: (step + 1) * file.size / totalSteps
              };

              self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
              if (file.upload.progress == 100) {
                file.status = Dropzone.SUCCESS;
                self.emit("success", file, 'success', null);
                self.emit("complete", file);
                self.processQueue();
              }
            };
          }(file, totalSteps, step), duration);
        }
      }
    }
  })
}