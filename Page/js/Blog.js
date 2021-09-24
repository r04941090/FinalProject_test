let blogContentList = document.querySelector('.blog-content-list');
    let blogContentIntro = document.querySelector('.blog-content-intro');
    let blogContentProduct = document.querySelector('.blog-content-product');
    let blogContentMemory = document.querySelector('.blog-content-memory');
    let blogContentTour = document.querySelector('.blog-content-tour');
    let blogContentPlace = document.querySelector('.blog-content-place');
    let blogContentLike = document.querySelector('.blog-content-like');
    let blogContentFans = document.querySelector('.blog-content-fans');
    let blogContentFollow = document.querySelector('.blog-content-follow');
    let blogCards = document.querySelectorAll('.blog-card');
    let listItem = [blogContentIntro, blogContentMemory, blogContentTour, blogContentPlace, blogContentLike, blogContentFans, blogContentFollow]
    let listName = ['簡介', '旅遊回憶', '行程', '景點收藏', '讚', '粉絲', '追蹤中']
    
    window.onload = function () {
      blogContentList.addEventListener('click', function (e) {
        console.log(e.target.tagName);
        e.preventDefault();
        let index, listLength, parent;
        if (e.target.tagName == 'LI' || e.target.parentNode.tagName == 'LI') {
          if (e.target.tagName == 'SPAN') {
            index = listName.indexOf(e.target.parentNode.querySelector('.blog-content-title').innerText)
            parent = e.target.parentNode.parentNode
            listLength = e.target.parentNode.parentNode.children.length
          }
          else {
            index = listName.indexOf(e.target.querySelector('.blog-content-title').innerText)
            parent = e.target.parentNode
            listLength = e.target.parentNode.children.length
          }
          listItem.forEach(item => {
            item.style.display = 'none'
          })
          listItem[index].style.display = 'block'
          // console.log(e.target.parentNode);
          console.log(listLength);
          for (let i = 0; i < listLength; i++) {
            parent.children[i].classList.remove('listChange')
          }
          parent.children[index].classList.add('listChange')
        }
      })
      blogCards.forEach(blogCard => {
        blogCard.addEventListener('click', function (e) {
          if (e.target.nodeName == 'I') {
            if (Object.values(e.target.classList).includes('far')) {
              e.target.classList.remove('far')
              e.target.classList.add('fas')
              e.target.style.color = 'red'
            }
            else {
              e.target.classList.remove('fas')
              e.target.classList.add('far')
              e.target.style.color = '#000'
            }
          }
        })
      })
    }