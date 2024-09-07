document.addEventListener('DOMContentLoaded', () => {

    function toggleMenu() {
        var menu = document.querySelector('.js-menu');
        var body = document.body; 
        var overlay = document.querySelector('.js-overlay');
        menu.classList.toggle('-translate-x-full');
        menu.classList.toggle('opacity-0');
        overlay.classList.toggle('hidden');
        body.classList.toggle('overflow-hidden');
    }

    document.querySelector('.js-menu-toggle').addEventListener('click', toggleMenu);
    document.querySelector('.js-menu-toggle-close').addEventListener('click', toggleMenu);
    document.querySelector('.js-overlay').addEventListener('click', toggleMenu);

});
