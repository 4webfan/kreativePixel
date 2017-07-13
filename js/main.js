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
    var geocoder = new google.maps.Geocoder();

    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
}

initMap();
