// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.turbolinks
//= require ckeditor/init
//= require turbolinks
//= require_tree .

$('document').ready(function(){
  if ($('body').hasClass('logged')) {
    $('.admin').show();
  };


  //Calling the layer slider
  $("#layerslider").layerSlider({
    autoStart               : true,
    responsive              : true,
    responsiveUnder         : 1170,
    sublayerContainer       : 1170,
    firstLayer              : 1,
    twoWaySlideshow         : true,
    randomSlideshow         : false,
    keybNav                 : true,
    touchNav                : true,
    imgPreload              : true,
    navPrevNext             : true,
    navStartStop            : false,
    navButtons              : false,
    thumbnailNavigation     : 'disable',
    tnWidth                 : 100,
    tnHeight                : 60,
    tnContainerWidth        : '60%',
    tnActiveOpacity         : 35,
    tnInactiveOpacity       : 100,
    hoverPrevNext           : true,
    hoverBottomNav          : false,
    skin                    : 'grove',
    skinsPath               : '/assets/skins/',
    pauseOnHover            : true,
    globalBGColor           : 'transparent',
    globalBGImage           : false,
    animateFirstLayer       : false,
    yourLogo                : false,
    yourLogoStyle           : 'position: absolute; z-index: 1001; left: 10px; top: 10px;',
    yourLogoLink            : false,
    yourLogoTarget          : '_blank',
    loops                   : 0,
    forceLoopNum            : true,
    autoPlayVideos          : true,
    autoPauseSlideshow      : 'auto',
    youtubePreview          : 'maxresdefault.jpg',
    showBarTimer        : false,
    showCircleTimer     : false,

    // you can change this settings separately by layers or sublayers with using html style attribute

    slideDirection          : 'right',
    slideDelay              : 4000,
    durationIn              : 1000,
    durationOut             : 1000,
    easingIn                : 'easeInOutQuint',
    easingOut               : 'easeInOutQuint',
    delayIn                 : 1,
    delayOut                : 1
  });
});