/* jshint esversion: 6 */

"use strict";


(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                  window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// document.addEventListener('click', function(e) {
//     e.preventDefault()
// })

function myScrollTo(to) {
  const start = window.scrollY || window.pageYOffset;
  const time = Date.now();
  const duration = 1000;//Math.abs(start - to);

  if(duration !== 0) {requestAnimationFrame(step);}

  function step() {
    var dx = Math.min(1, (Date.now() - time) / duration);
    var pos = start + (to - start) * easeInOutQuad(dx);
    window.scrollTo(0, pos);

    if (dx < 1) {
      requestAnimationFrame(step);
    }
  }
}
function easeInOutQuad(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }

document.querySelectorAll("a[href*='#']:not([href='#']):not([class*='carousel'])").forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    var hash = this.href.replace(/[^#]*(.*)/, '$1');
    var to = document.querySelector(hash).offsetTop; //getBoundingClientRect().top,
    myScrollTo(to);
  }, false);
});

function init() {
  let nav = JSON.parse('[{"title":"Who we are","href":"#about"},{"title":"Problem","href":"#problem"},{"title":"Solution","href":"#solution"},{"title":"Features","href":"#features"},{"title":"Contact us","href":"#contact"}]');
  nav.unshift({title: "Header", href: "#header"});
  nav.unshift({title: "Header", href: "#header"});
  nav.push({title: "Bottom", href: "#contact"});
  let waitingOnAnimRequest = false;
  let animationSelectors = [ 'section'];
  let nav_side = document.querySelector('nav#side');
  let arrow_up = document.querySelector('nav#side #up');
  let arrow_down = document.querySelector('nav#side #down');
  let header = document.querySelector('header');
  let hh = header.offsetTop + header.offsetHeight;
  // let slide0 = document.querySelector('#header');
  let dots = document.querySelectorAll('#menu .dots a');
  let bga = document.querySelector('#bg-animations');
  
  let login = document.querySelector('#login');
  let lo = document.querySelector('#login-o');
  let lc = document.querySelector('#login-c');

  lo.addEventListener('click', function(e){
    e.preventDefault();
    login.classList.remove('hidden');
  });
  lc.addEventListener('click', function(e){
    e.preventDefault();
    login.classList.add('hidden');
  });myScrollTo(0);;
  const animChecker = (target) => {
    // Loop over our selectors
    let currentScroll = hh - 1 + (document.documentElement.scrollTop || document.body.scrollTop); // Get Current Scroll Value
    // let bodyHeight = document.body.clientHeight;

      // if (currentScroll > slide0.offsetHeight) { header.classList.remove('scrolled-in');}
      // if (currentScroll < slide0.offsetHeight) { header.classList.add('scrolled-in');}
    let prev,next;
    animationSelectors.forEach(selector => {
      // Loop over all matching DOM elements for that selector
      // console.log("Found" + selector);
      prev=nav[0];
      next=false;
      // let count=0;
      document.querySelectorAll(selector).forEach(element => {
        const elementHeight = element.offsetHeight;
        const elementTop = element.offsetTop - elementHeight/4;
        const elementBottom = elementTop + elementHeight;
        if (elementTop > currentScroll) {
          element.classList.remove('scrolled-in');
          if(!next) {next = arrow_down.href = '#'+element.id;}
        }
        else if (elementTop < currentScroll && currentScroll < elementBottom) {
          bga.className = element.id;
          nav_side.className = element.id;
          header.className = element.id;
          element.classList.add('scrolled-in');
          //Set menu
          let act_count = 0;
          document.querySelectorAll('#menu .logo a,#menu .links a').forEach(item => {
            if (("#" + element.id).startsWith(item.hash)) {
              item.classList.add('active');
              dots[act_count].classList.add('active');
              // arrow_up.href = nav[act_count+1].href;
              // arrow_down.href = nav[act_count+3].href;
            } else {
              item.classList.remove('active');
              dots[act_count].classList.remove('active');
            }
            act_count++;
          });
        }
        else if (elementBottom <= currentScroll) {
          element.classList.remove('scrolled-in');
          prev = arrow_up.href = '#'+element.id;
        }
        // console.log (element.id, elementTop, elementBottom, currentScroll)

      });
    });
    // console.log(prev,next);
    if( currentScroll < header.offsetHeight ) {
      arrow_down.href = nav[2].href;
    }

  };
  animChecker(document);
  window.onscroll = ({target}) => {
      if (!waitingOnAnimRequest) {
          window.requestAnimationFrame(() => {
              animChecker(target);
              waitingOnAnimRequest = false;
          });
          waitingOnAnimRequest = true;
      }
  };
};

document.addEventListener('DOMContentLoaded', init);
