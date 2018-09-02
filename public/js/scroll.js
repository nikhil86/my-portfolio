function scrollIt(destination, duration = 200, easing = 'linear', callback) {

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

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback(destinationOffsetToScroll);
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

let lastScrollTop = window.scrollY;
const sections = ['.intro-section', '.skills-section', '.another-section', '.one-more-section'];

function getNextSection() {
  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const currentYScroll = window.scrollY;
  const numberOfSections = documentHeight / windowHeight;
  const currentSection  = Math.floor(currentYScroll / windowHeight);
  if (currentSection < numberOfSections) {
    return sections[currentSection + 1];
  }
  return undefined

}

function getPrevSection() {
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const currentYScroll = window.scrollY;
  const currentSection  = Math.floor(currentYScroll / windowHeight) + 1;
  if (currentSection > 0) {
    return sections[currentSection - 1];
  }
  return sections[0];
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function disableScroll() {
  if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
  if (window.removeEventListener)
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

const callBack = function (top) {
  window.scrollTo({
    top: top,
    behavior: 'smooth'
  })
  setTimeout(() => {
    window.addEventListener("scroll", scrollListener, false);
    enableScroll();
    lastScrollTop = window.pageYOffset;
  }, 500);
}

const scrollListener = function(e){
  e.preventDefault();
  disableScroll();
  window.removeEventListener("scroll", scrollListener, false);
  var st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop){
    const nextSection = getNextSection();
    if (nextSection) {
      scrollIt(document.querySelector(nextSection), 900, 'easeInOutQuint', callBack);
    } else {
      //setTimeout(() => window.addEventListener("scroll", scrollListener, false), 500);
    }
  } else {
    const prevSection = getPrevSection();
    if (prevSection) {
      scrollIt(document.querySelector(prevSection), 900, 'easeInOutQuint', callBack);
    } else {
      //setTimeout(() => window.addEventListener("scroll", scrollListener, false), 500);
    }
  }
  lastScrollTop = st <= 0 ? 0 : st;
};

window.addEventListener("scroll", scrollListener, false);