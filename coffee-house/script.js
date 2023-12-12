// Burger menu
function interactionWithBurderMenu() {
    const menuIcon = document.querySelector('.burger-menu');
    const menuNav = document.querySelector('.header-navigation');
    const navLink = document.querySelectorAll('.navigation-link');
    const menuLink = document.querySelector('.coffee-menu');
    function openBurger() {
        if (menuIcon) {
            menuIcon.addEventListener('click', function (e) {
                document.body.classList.toggle('--lock');
                menuNav.classList.toggle('--active');
                menuIcon.classList.toggle('--active');
            });
        }
    }
    openBurger();
    
    function closeBurger() {
        if (menuIcon) {
            navLink.forEach(navLink => {
                navLink.addEventListener('click', function (e) {
                    document.body.classList.remove('--lock');
                    menuNav.classList.remove('--active');
                    menuIcon.classList.remove('--active');
                });
            });
            menuLink.addEventListener('click', function (e) {
                document.body.classList.remove('--lock');
                menuNav.classList.remove('--active');
                menuIcon.classList.remove('--active');
            });
        }
    }
    closeBurger();
}
interactionWithBurderMenu();

// Carousel on the home page
function functionalityOfCarousel() {
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');
    const slider = document.querySelector('.slider');
    const allSlides = document.querySelector('.slider-slides');
    const slide = document.querySelectorAll('.slide-content');
    const control = document.querySelectorAll('.control');
    
    let slideWidth = parseInt(getComputedStyle(slider).width) + 40;
    let left = 0;
    let cardCount = 0;
    let autoInterval;
    let isPaused = false;

    allSlides.style.left = left + 'px';
    
    function slideTo(direction) {
        if (direction === 'right') {
            left -= slideWidth;
            cardCount++;
        }
        if (direction === 'left') {
            left += slideWidth;
            cardCount--;
        }
        if (left > 0) {
            left = -2 * slideWidth;
            cardCount = slide.length - 1;
        }
        if (left < (-2 * slideWidth)) {
            left = 0;
            cardCount = 0;
        }
        allSlides.style.left = left + 'px';
        
        inactiveControl();
        thisActiveControl(cardCount);
    }
    
    function autoSlider() {
        autoInterval = setInterval(() => {
            if (!isPaused) {
                thisActiveControl(cardCount);
                slideTo('right');
            }
        }, 3000);
    }
    
    function nextSlide() {
        clearInterval(autoInterval);
        slideTo('right');
        autoSlider();
    }
    
    function prevSlide() {
        clearInterval(autoInterval);
        slideTo('left');
        autoSlider();
    }

    function thisActiveControl(index) {
        control[index].classList.add('--fill');
    }

    function inactiveControl() {
        control.forEach(control => {
            control.classList.remove('--fill');
        });
    }
    
    arrowLeft.addEventListener("click", () => {
        prevSlide();
    });
    
    arrowRight.addEventListener("click", () => {
        nextSlide();
    });
    
    setTimeout(() => {
        thisActiveControl(0);
        autoSlider(); 
    }, 500);
    
    // toggle the slider by swiping
    const swipeDetect = (el) => {
        let surface = el;
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
    
        let startTime = 0;
        let elapsedTime = 0;
    
        let threshold = 150;
        let restraint = 100;
        let allowedTime = 800;
    
        surface.addEventListener('mousedown', function(e) {
            startX = e.pageX;
            startY = e.pageY;
            startTime = new Date().getTime();
            e.preventDefault();
        });
    
        surface.addEventListener('mouseup', function(e) {
            distX = e.pageX - startX;
            distY = e.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;
            
            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    if (distX > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                }
            }
            e.preventDefault();
        });
    
        surface.addEventListener('touchstart', function(e) {
            let touchObj = e.changedTouches[0];
            startX = touchObj.pageX;
            startY = touchObj.pageY;
            startTime = new Date().getTime();
            e.preventDefault();

            isPaused = true;
            control[cardCount].classList.add('--paused');
        });
    
        surface.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
    
        surface.addEventListener('touchend', function(e) {
            let touchObj = e.changedTouches[0];
            distX = touchObj.pageX - startX;
            distY = touchObj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;
            
            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    if (distX > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                }
            }
            e.preventDefault();

            isPaused = false;
            control.forEach(control => {
            control.classList.remove('--paused');
        });
        });
    }   
    swipeDetect(allSlides);

    // paused slider on hover
    allSlides.addEventListener('mouseover', function(e) {
        isPaused = true;
        control[cardCount].classList.add('--paused');
    });

    // continue
    allSlides.addEventListener('mouseout', function(e) {
        isPaused = false;
        control.forEach(control => {
            control.classList.remove('--paused');
        });
    });
}
functionalityOfCarousel();