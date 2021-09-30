let timeList = document.querySelector('#timeList');

        let timeShow = document.querySelector('#timeShow').addEventListener('click', function () {
            if (this.classList == 'fas fa-sort-down') {
                timeList.style.display = 'block';
                this.classList = 'fas fa-sort-up';
            }
            else {
                timeList.style.display = 'none';
                this.classList = 'fas fa-sort-down';
            }
        });
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});
var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});

