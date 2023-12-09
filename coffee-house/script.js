// Burger menu
const menuIcon = document.querySelector('.burger-menu');
if (menuIcon) {
    const menuNav = document.querySelector('.header-navigation');
    const navLink = document.querySelectorAll('.navigation-link');
    menuIcon.addEventListener('click', function (e) {
        document.body.classList.toggle('--lock');
        menuNav.classList.toggle('--active');
        menuIcon.classList.toggle('--active');
    });
    navLink.forEach(navLink => {
        navLink.addEventListener('click', function (e) {
            document.body.classList.remove('--lock');
            menuNav.classList.remove('--active');
            menuIcon.classList.remove('--active');
        });
    });
}