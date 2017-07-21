/*$(function () {
    Main.init();



});*/
/*Main = {
    init: function(){
        
    }
   
}*/

///////////////////////////

document.querySelector('.burger').addEventListener('click', function(e){
    this.classList.toggle('burger_active');
    document.querySelector('.main-nav').classList.toggle('main-nav_active');
}, false);
//////////////////////////

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 55.45, lng: 37.36}
    });
    //var geocoder = new google.maps.Geocoder();

    /*document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });*/
}

//initMap();

/////////////////////////
// Класс animated означает, что элемент будет анимирован
// Атрибут data-animated определяет, каким образом он будет анимирован


/*
 По мере скролла страницы будет добавлять класс inFocus элементам,
 которые попали в область видимости
 Каскадом от inFocus определяется css анимация для элементов внутри секции.
*/
/*var WillBeAnimate = {
    elements: null,
    init: function(){
        // Селекторы, для которых проверяется положение
        this.elements = document.querySelectorAll('.section_features, .section_works, .section_blog');
        document.addEventListener('scroll', this.scrollHandler.bind(this));
        document.addEventListener('DOMContentLoaded', this.scrollHandler.bind(this));
    },
    scrollHandler: function(){
        var self = this;
        if( self.elements.length ){
            self.elements.forEach(function(item){
                if( !item.classList.contains('inFocus')) {
                    if (self.inFocus(item)) {
                        item.classList.add('inFocus');
                    }
                }
            });
        }
    },
    inFocus: function( elem ){
        var delta = Math.ceil(elem.getBoundingClientRect().top - 2*document.documentElement.clientHeight/3);
        return ( delta <= 0 );
    }



}*/

var WillBeAnimate = {
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
            var item = self.elements[i]

            if( !item.classList.contains('inFocus')) {
                delay = parseFloat(item.getAttribute('data-animation-delay'));          // Задержка анимации
                duration = parseFloat(item.getAttribute('data-animation-duration'));    // Длительность анимации
                animationType = item.getAttribute('data-animation-type');               // Тип анимации

                if (self.inFocus(item)) {
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
        var coords = elem.getBoundingClientRect();
        var st = window.pageYOffset;
        var deltaH = document.documentElement.clientHeight/3;
        var delta = Math.ceil(coords.top + st - deltaH);
        var delta2 = Math.ceil(coords.bottom + st - deltaH );

        if( delta < 0 && delta2 < 0 ){
            return true;
        }else{
            return (st >= delta && st <= delta2);
        }

    }
};

WillBeAnimate.init();

/////////////////////////////////////
// soft scroll
var softScroll = {
    init: function(){
        var $items = document.querySelectorAll('.main-nav__link');

        for(var i = 0; i<$items.length; i++){
            $items[i].addEventListener('click', this.clickHandler, false);
        }

    },
    clickHandler: function(e){
        e.preventDefault();
        console.log('==============================================');
        var href = this.getAttribute('href');
        var id = href.substring(1, href.length); // Убираем решетку
        var el,
            top,
            targetTop,
            step = 0,
            docHeight = document.documentElement.scrollHeight - window.innerHeight, // Высота документа
            duration = 400;

        // Отмена анимации, если она ещё идёт
        window.cancelAnimationFrame(window.animationId);
        window.animationId = 0;

        if( id ){
            el = document.getElementById(id);
            targetTop = el.getBoundingClientRect().top;
            top = targetTop + window.pageYOffset; // Расстояние, которое надо пройти
            step = Math.ceil(16*top/duration);    // 16 - Среднее значение длительности итерации анимации requestAnimationFrame
            //console.log('targetTop = ', targetTop);
            console.log('top = ', top);
            console.log('step = ', step);

            console.time('time1');

            window.animationId = requestAnimationFrame(function smoothScroll(){

                var st = window.pageYOffset;                 // Текущий scrollTop
                var maxStep = Math.abs(st - Math.abs(top));  // Оставшееся расстояние до цели
                console.log('st = ', st);
                console.log('maxStep= ',maxStep);
                if( maxStep < step  ){
                    step = maxStep;
                }
                if(targetTop > 0)
                    st+=step;
                else if(targetTop < 0)
                    st-=step;
                else if(maxStep == 0 || targetTop == 0 ){
                    window.cancelAnimationFrame(window.animationId);
                    return false;
                }
                window.scrollTo(0,st);
                // Если скролл не достиг цели и не дошел до конца страницы (своего максимального значения)
                if( maxStep > 0 && st < docHeight ){
                    window.animationId = requestAnimationFrame( smoothScroll );
                }else{
                    window.cancelAnimationFrame(window.animationId);
                    console.timeEnd('time1');
                }

            });


        }
    }
};
softScroll.init();

