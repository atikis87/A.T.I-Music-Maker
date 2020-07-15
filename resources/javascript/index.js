var $ = require( 'jquery' );
const {ipcRenderer} = require( 'electron' );
$(document).ready(function()
{
      sendClearUser();
      pageLoader();
      flyingLetters();
      delayEffect();
      animeTimeLine();
      formShowHide();
      formShowHide();
});

// ----First step peace.js Automatic page load progress bar----
function pageLoader()
{
      Pace.on('done', function() 
      {
            var welcomeSection = $('.welcome-section');

            setTimeout(function()
            {
                  welcomeSection.removeClass('content-hidden');
            },2);
            $('.fly-in-text').delay(1500).animate({top: '30%', opacity: '0'}, 0,); // the text disappears here.
            $('.welcome-section.content-hidden').delay(1500).animate({top: '-100%'}, 2000,); // So the curtain effect opens!
      }); // pace.on end
}; // pageLoader end

// ---- SECOND STEP Animation for header from tweenmax ----
function delayEffect()
{
      TweenMax.from(".letters", 3, 
      {
            delay: 5,
            opacity: 0,
            y: 20,
            ease: Expo.easeInOut
      });

      TweenMax.from(".p1", 3, 
      {
            delay: 9,
            opacity: 0,
            y: 20,
            ease: Expo.easeInOut
      });
      
      TweenMax.from(".p2", 3, 
      {
            delay: 9.2,
            opacity: 0,
            y: 20,
            ease: Expo.easeInOut
      });
      
      TweenMax.from("#one", 3, 
      {
            delay: 9.4,
            opacity: 0,
            y: 20,
            ease: Expo.easeInOut
      });
      
      TweenMax.from("#two", 3, 
      {
            delay: 9.7,
            opacity: 0,
            y: 20,
            ease: Expo.easeInOut
      });
}; // Delay effect end-------------------------------------------------------------------------------------------------------

// Von Stack Overflow copy! ------------------------------------------------------------------------------------------------
function flyingLetters()
{
      var textWrapper = document.querySelector('.ml7 .letters');
      textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w|\.)/g, "<span class='letter'>$&</span>");
}; //-------------------------------------------------------------------------------------------------------------------------

// Animation time from anime.js --------------------------------------------------------------------------------------------
function animeTimeLine()
{
      anime.timeline({loop: false})
  .add(
{
    targets: '.ml7 .letter',
    translateY: ["1.1em", 0],
    translateX: ["0.55em", 0],
    translateZ: 0,
    rotateZ: [180, 0],
    duration: 750,
    easing: "easeOutExpo",
    delay: function(el, i) 
    {
      return 9000 + 50 * i;
    }
  });
}

// LOGIN_FIELD ---------------------------------------

function formShowHide()
{
      $("#form").hide();
      $("#one").on("click", function()
      {
          $("#form").show();
          $(".register-form").show();
          $(".login-form").hide();
      });

      $("#two").on("click", function()
      {
          $("#form").show();
          $(".login-form").show();
          $(".register-form").hide();
          
      });
      
      $('.message a').on('click',function(){
            $('.register-form').animate(
            {height:"toggle",
                   opacity:"toggle"
            },"slow");
      
            $('.login-form').animate(
            {     height:"toggle",
                  opacity:"toggle"
            },"slow");
      });
};

function sendClearUser()
{
      ipcRenderer.send( 'ClearUser' );
      console.log("Clear user");
}