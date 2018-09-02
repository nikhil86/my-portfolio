const easings = {
  linear(t) {
    return t;
  },
  easeInQuad(t) {
    return t * t;
  },
  easeOutQuad(t) {
    return t * (2 - t);
  },
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic(t) {
    return (--t) * t * t + 1;
  },
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
  },
  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint(t) {
    return 1 + (--t) * t * t * t * t;
  },
  easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
};

function scrollIt(destination, sectionNumber, duration = 200, easing = 'easeInOutQuint', clickedItem) {
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  let destinationOffsetToScroll = (sectionNumber - 1) * windowHeight;
  const headerClassNames = header.className;
  const hasClassNameSticky =  headerClassNames.indexOf('sticky') > -1 || window.scrollY >= windowHeight;
  if ((hasClassNameSticky && destinationOffsetToScroll != windowHeight) || destinationOffsetToScroll > windowHeight) {
    destinationOffsetToScroll = destinationOffsetToScroll - header.offsetHeight;
  }

  scrollToY(destinationOffsetToScroll, duration, easing, clickedItem);
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

function scrollToY(scrollTargetY = 0, duration, easing, clickedItem) {
  const scrollY = window.scrollY;
  const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  function tick() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const p = Math.min(1, ((now - currentTime) / duration));
    const t = easings[easing](p);
    if (p < 1) {
      requestAnimFrame(tick);
      window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
    } else {
      console.log('scroll done');
      window.scrollTo(0, scrollTargetY);
    }
  }

  tick();
}

const toggleActiveClass = function (target) {
  const currentActiveElement = document.querySelector('.active');
  currentActiveElement.classList.remove('active');
  currentActiveElement.classList.add('fade');
  target.classList.remove('fade');
  target.classList.add('active');
}

const onItemClick = function (e) {
  const target = e.currentTarget;
  const section = target.getAttribute('data-section');
  const sectionNumber = target.getAttribute('data-section-number');
  toggleActiveClass(target);
  scrollIt(document.querySelector(`.${section}`), sectionNumber, 900, 'easeInOutQuint', target);
};

const elements = document.querySelectorAll('.item');
for(let i = 0; i < elements.length; i++) {
  const element = elements[i];
  element.onclick = onItemClick;
}

const header = document.getElementById('myHeader');
const sticky = header.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}
window.onscroll = function() {myFunction()};