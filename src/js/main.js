ymaps.ready(init);
function init() {
    const myMap = new ymaps.Map(
        "map", 
        {
        center: [55.764440, 37.612506],
        zoom: 13,
        controls: [],
        },
        {
        suppressMapOpenBlock: true,
        });

    const myPlacemark = new ymaps.Placemark(
        [55.770208,37.636814],
        {},
        {
          iconLayout: "default#image",
          iconImageHref: "../images/ellipse.png",
          iconImageSize: [12, 12],
        }
      );
    
      myMap.geoObjects.add(myPlacemark);
    

    setTimeout(() => {
        myMap.container.fitToViewport();
        }, 5000);
}

window.addEventListener('DOMContentLoaded', function() {
    /*contacts*/
    document.querySelector('.contacts__cross').addEventListener('click', function() {
        document.querySelector('.contacts__info').classList.add('no-active')
    })
    document.querySelector('.contacts__map').addEventListener('click', function () {
        document.querySelector('.contacts__info').classList.remove('no-active')
    })

    /*menu*/
    document.querySelector('.menu-open').addEventListener('click', function() {
        document.querySelector('.header__nav').classList.add('active')
    })
    document.querySelector('.menu-close').addEventListener('click', function() {
        document.querySelector('.header__nav').classList.remove('active')
    })

    /*search*/
    document.querySelector('.search').addEventListener('click', function() {
        document.querySelector('.form-search').classList.toggle('active')
    })
    document.querySelector('.search-close').addEventListener('click', function () {
        document.querySelector('.input-search').value = ""
    })
})

