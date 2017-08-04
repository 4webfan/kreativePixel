Main = {
    init: function(){
        this.WillBeAnimate.init();
        this.SoftScroll.init();
        this.StyckyHeader.init();
        this.ActiveMenuItem.init();
        this.MobileMenu.init();
        this.Popup.init();
        this.TurnContacts();
        this.Map();
    },
    WillBeAnimate: {
        elements: null,
        init: function(){
            // Селекторы, для которых проверяется положение
            this.elements = document.querySelectorAll('.animation');
            document.addEventListener('scroll', this.scrollHandler.bind(this));
            document.addEventListener('DOMContentLoaded', this.scrollHandler.bind(this));
        },
        scrollHandler: function(){
            var self = this;
            var delay, duration, animationType;

            for(var i = 0; i<self.elements.length; i++){
                var item = self.elements[i];

                if( !item.classList.contains('inFocus')) {
                    delay = parseFloat(item.getAttribute('data-animation-delay'));          // Задержка анимации
                    duration = parseFloat(item.getAttribute('data-animation-duration'));    // Длительность анимации
                    animationType = item.getAttribute('data-animation-type');               // Тип анимации
                    var focus = this.inFocus(item);

                    if(focus.fullInWindow || focus.percHWindow > 60){
                        item.classList.add('inFocus');

                        if(animationType) {
                            item.classList.add(animationType);
                        }
                        if(delay) {
                            item.style = "animation-delay:" + delay + "s";
                        }
                        if(duration){
                            item.style = "animation-duration:" + duration + "s";
                        }
                    }
                }
            }
        },
        inFocus: function( elem ){

            // Функция возвращает объект, содержащий информацию, о положении элемента относительно экрана
            // Решаемые задачи с помощью функции
            // Анимация элементов внутри секции при скролле
            // Непосредственная анимация элементов
            // Активация пунктов меню при достижении секцией фокуса

            var coords = elem.getBoundingClientRect();
            var top = coords.top;						    		// Расстояние от верхней границы элемента до края окна браузера
            var bottom = coords.bottom;								// Расстояние от нижней границы элемента до края окна браузера
            var h = document.documentElement.clientHeight;  		// высота окна браузера

            var isFocus = {
                // true, если проверяемый элемент полностью в окне
                fullInWindow: false,
                // true, если лемент частично в окне браузера
                partiallyInWindow: false,
                // true, если элемент полностью за пределами окна
                outsideWindow: false,
                // Отношение высоты элемента к высоте экрана. Если > 1, то элемент никогда не будет на 100% в экране
                heightRatio: +(Math.abs(top - bottom)/h).toFixed(3),
                // Определяет процент от высоты элемента, на который элемент находится в окне браузера
                percInWindow: 0,
                // Определяет сколько процентов высоты окна браузера занимает элемент на текущий момент
                percHWindow: 0
            };

            // Элемент полностью за пределами окна
            if(top < 0 && bottom < 0 || top > h && bottom > h){
                isFocus.fullInWindow = false;
                isFocus.partiallyInWindow = false;
            }

            // Элеменит полностью в окне. Возможно только при isFocus.heightRatio < 1
            else if( top >= 0 && top <= h && bottom >= 0 && bottom <= h){
                isFocus.fullInWindow = true;
                isFocus.partiallyInWindow = false;
                isFocus.percInWindow = 100;
                isFocus.percHWindow = +(isFocus.percInWindow*isFocus.heightRatio).toFixed(3);
            }

            // Элемент частично в окне (нижняя его часть видима)
            else if( top <= 0 && bottom >= 0 && bottom < h  ){
                isFocus.partiallyInWindow = true;
                isFocus.percInWindow = +((Math.abs(top - bottom) - Math.abs(top))/Math.abs(top - bottom)*100).toFixed(3);
                isFocus.percHWindow = +(isFocus.percInWindow*isFocus.heightRatio).toFixed(3);
            }

            // Элемент частично в окне (верхняя его часть видима)
            else if(top >= 0 && top < h && bottom > h){
                isFocus.partiallyInWindow = true;
                isFocus.percInWindow = +(( h - Math.abs(top))/Math.abs(top - bottom)*100).toFixed(3);
                isFocus.percHWindow = +(isFocus.percInWindow*isFocus.heightRatio).toFixed(3);
            }

            // Высота элемента больше высоты окна и элемент занимает все окно
            else if( isFocus.heightRatio > 1 && top <= 0 && bottom > h){
                isFocus.partiallyInWindow = true;
                isFocus.percInWindow = +(100/isFocus.heightRatio).toFixed(3);
                isFocus.percHWindow = 100;
            }

            isFocus.outsideWindow = !isFocus.partiallyInWindow && !isFocus.percInWindow;

            return isFocus;

        }
    },
    SoftScroll: {
        init: function(){

            var $items = document.querySelectorAll('.main-nav__link');
            var $footerLink = document.querySelectorAll('.footer-nav__link');

            // main nav links
            for(var i = 0; i < $items.length; i++){
                $items[i].addEventListener('click', this.clickHandler, false);
            }

            //footer links
            for(var j = 0; j < $footerLink.length; j++){
                $footerLink[j].addEventListener('click', this.clickHandler, false);
            }

            // view projects link
            document.getElementById('viewProjects').addEventListener('click', this.clickHandler, false);

        },
        clickHandler: function(e){

            e.preventDefault();

            var href = this.getAttribute('href');
            var id = href.substring(1, href.length); // Убираем решетку
            var el;

            if(id){
                el = document.getElementById(id);
                Main.SmoothScroll(el, 0, -75);
            }
        }
    },
    SmoothScroll: function( el, duration, delta ){
        if( !el )
            return;

        if( !duration )
            duration = 400;

        if(!delta)
            delta = 0;

        var top,
            step = 0,
            direction,
            docHeight = document.documentElement.scrollHeight - window.innerHeight; // Высота документа

        // Отмена анимации, если она ещё идёт
        if( window.animationId ){
            window.cancelAnimationFrame(window.animationId);
            window.animationId = 0;
        }

        // Положение элемента относительно окна
        top = el.getBoundingClientRect().top + delta;
        // Направление скролла к элементу, true - вниз, false - вверх
        direction = (top > 0);
        step = Math.round(17*Math.abs(top)/duration);    // 17 - Среднее значение длительности итерации анимации requestAnimationFrame

        if( top == 0 ) {
            return false;
        }
        document.addEventListener('touchstart', function(){
            return false;
        });

        window.animationId = requestAnimationFrame(function smoothScrollAnimate(){
            // Текущий scrollTop
            var st = window.pageYOffset;
            // Оставшееся расстояние до цели
            var distance = Math.abs(el.getBoundingClientRect().top + delta);

            // Завершение анимации, если расстояние до объекта = 0
            if( distance === 0 ){
                window.cancelAnimationFrame(window.animationId);
                return false;
            }

            // Если оставшееся расстояние меньше шага анимации
            if( distance < step  ){
                step = distance;
            }

            // Пересчет нового значения scrollTop, с учетом направления
            (direction) ? st+=step : st-=step;

            if(st < 0)
                st = 0;

            // Перемещаем страницу к цели на шаг
            window.scrollTo(0, st);

            // Если скролл не достиг цели и не дошел до конца страницы (своего максимального значения)
            if( distance > 0 && st < docHeight && st > 0 ){
                window.animationId = requestAnimationFrame( smoothScrollAnimate );
            }else{
                window.cancelAnimationFrame(window.animationId);
            }
        });

    },
    TurnContacts: function(){
        document.querySelector('.contacts__close').addEventListener('click', function(e){
            e.preventDefault();

            var contacts = this.closest('.contacts');
            if(  !contacts.classList.contains('contacts_turn') ){
                contacts.style.height = window.getComputedStyle(contacts).height;
                setTimeout(function(){
                    contacts.classList.add('contacts_turn');
                }, 0);
            }else{
                contacts.classList.remove('contacts_turn');
                setTimeout(function(){
                    Main.SmoothScroll(contacts, 400, -75);
                }, 300);

            }

        }, false);
    },
    StyckyHeader: {
        init: function(){
            document.addEventListener('scroll', this.stickyHandler);
            this.stickyHandler();

        },
        stickyHandler: function(){
            var header = document.querySelector('.header');
            var st = window.pageYOffset;

            if( window.innerWidth > 1400){
                ( st >= 60 ) ? header.classList.add('header_fixed') : header.classList.remove('header_fixed');
            }else{
                header.classList.remove('header_fixed');
            }
        }
    },
    ActiveMenuItem: {
        init: function(){
            document.addEventListener('scroll', this.activeMenuItemHandler);
            this.activeMenuItemHandler();

        },
        activeMenuItemHandler: function(){
            var sections = document.querySelectorAll('.section');
            var links = document.querySelectorAll('.main-nav__link');

            for(var i = 0; i < sections.length; i++){
                var self = sections[i];
                var focus = Main.WillBeAnimate.inFocus(self);
                var id, href;

                if( focus.fullInWindow || focus.percHWindow > 60){
                    id = self.getAttribute('id');

                    if( id ){
                        for( var j = 0; j < links.length; j++){
                            href = links[j].getAttribute('href');

                            if( href.substring(1, href.length) != id ){
                                links[j].classList.remove('main-nav__link_active');
                            }else{
                                links[j].classList.add('main-nav__link_active');
                            }
                        }
                    }
                }
            }
        }

    },
    MobileMenu: {
        init: function(){
            document.querySelector('.burger').addEventListener('click', this.clickHandler.bind(this), false);
        },
        clickHandler: function mobileMenu( e ){
            e.stopPropagation();
            var burger = document.querySelector('.burger');

            if(burger.classList.contains('burger_active')){
                burger.classList.remove('burger_active');
                document.removeEventListener('click', this.docMenuCloseHandler);
            }else{
                burger.classList.add('burger_active');
                document.addEventListener('click', this.docMenuCloseHandler, false);
            }
            document.querySelector('.main-nav').classList.toggle('main-nav_active');
        },
        docMenuCloseHandler: function(e){
            if(!e.target.closest('.main-nav') && !e.target.classList.contains('main-nav') ){
                document.querySelector('.burger').click();
            }
            return false;
        }
    },
    Popup: {
        init: function(){
            var button = document.querySelectorAll('.more-info__link_zoom');

            for(var i = 0; i < button.length; i++){
                button[i].addEventListener('click', this.buttonClickHandler, false);
            }

            document.querySelector('.popup__close').addEventListener('click', this.close, false);
        },
        buttonClickHandler: function(e){
            e.preventDefault();

            // insert markup
            var path = this.getAttribute('data-zoom');

            if(path){
                document.querySelector('.popup__content').innerHTML = "<img src='"+path+"' class='popup__img'/>";
            }
            // open popup
            document.querySelector('.popup').classList.add('popup_visible');
            document.documentElement.classList.add('body_hidden');

        },
        open: function(){
            document.documentElement.classList.add('body_hidden');

        },
        close: function(e){
            e.preventDefault();
            document.querySelector('.popup').classList.remove('popup_visible');
            document.documentElement.classList.remove('body_hidden');
        }
    },
    Map: function(){
        new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 55.45, lng: 37.36}
        });
        /*var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 55.45, lng: 37.36}
        });*/
        //var geocoder = new google.maps.Geocoder();

        /*document.getElementById('submit').addEventListener('click', function() {
         geocodeAddress(geocoder, map);
         });*/
    }
   
};

Main.init();

