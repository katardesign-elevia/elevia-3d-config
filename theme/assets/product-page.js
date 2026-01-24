/**
 * Product Page Scripts
 * Handles age verification, quantity buttons, video scroll, swiper, FAQ, and tabs
 */

// Age Verification
function initAgeVerification() {
  $(document).ready(function() {
    var allowed = localStorage.getItem("allowed");
    if (allowed != 'true') {
      $('#age-parent').css('display', 'flex').hide().fadeIn(500);
      $('body').addClass('no-scroll');
    }
  });

  $("#over-age").click(function() {
    $('#age-parent').fadeOut(500, function() {
      localStorage.setItem("allowed", "true");
      $('body').removeClass('no-scroll');
    });
  });

  $("#under-age").click(function() {
    $('#error-box').fadeIn(500);
  });
}

// Quantity Buttons
function initQuantityButtons() {
  if (window.CodeCrumbs && window.CodeCrumbs.QuantityButtons) {
    window.CodeCrumbs.QuantityButtons({
      quantityGroupClass: 'q-group',
      quantityIncrementButtonClass: 'q-inc',
      quantityDecrementButtonClass: 'q-dec',
      quantityNumberFieldClass: 'q-num',
      disableDecrementAtOne: true,
    });
  }
}

// Video Scroll Playback
function initVideoScrollPlayback() {
  const videoElement = document.querySelector('video');
  if (!videoElement) return;

  function setVideoProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollPercentage = scrollTop / docHeight;

    if (videoElement.duration) {
      videoElement.currentTime = videoElement.duration * scrollPercentage;
    }
  }

  function initPlayback() {
    let isScrolling;
    window.addEventListener('scroll', function () {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(setVideoProgress, 100);
    });
    videoElement.play();
  }

  videoElement.addEventListener('canplaythrough', initPlayback);
  videoElement.addEventListener('loadedmetadata', setVideoProgress);
}

// Swiper Initialization
function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  var swiper = new Swiper('.swiper', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    navigation: {
      nextEl: ".next-sec",
      prevEl: ".prev-sec",
      disabledClass: "disabled"
    },
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
  });

  var swiper1 = new Swiper('.swiper1', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    navigation: {
      nextEl: ".next-sec1",
      prevEl: ".prev-sec1",
      disabledClass: "disabled"
    },
    pagination: {
      el: ".swiper-pagination1",
      type: "fraction",
    },
  });
}

// FAQ Numbers
function updateFAQNumbers() {
  document.querySelectorAll('.faq-wrapper').forEach((el, i) => {
    const number = i + 1;
    const numberEl = el.querySelector('.faq-number');
    if (numberEl) {
      numberEl.textContent = number < 10 ? '0' + number : number;
    }
  });
}

function initFAQNumbers() {
  updateFAQNumbers();
  const nextButton = document.querySelector('.w-pagination-next');
  if (nextButton) {
    nextButton.addEventListener('click', function () {
      setTimeout(updateFAQNumbers, 0);
    });
  }
}

// FAQ Show More/Less
function initFAQToggle() {
  document.addEventListener('DOMContentLoaded', function() {
    let itemsToShow = 5;
    const faqItems = document.querySelectorAll('.faq-wrapper');
    const showMoreButton = document.querySelector('.showmore');

    if (!showMoreButton) return;

    const faqIcon = showMoreButton.querySelector('.is-faq-icon');
    const buttonText = showMoreButton.querySelector('.button-text-faq');

    function toggleItems() {
      faqItems.forEach((item, index) => {
        if (index < itemsToShow) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    toggleItems();
    if (buttonText) {
      buttonText.textContent = 'Show More';
    }

    showMoreButton.addEventListener('click', function() {
      if (buttonText && buttonText.textContent.trim() === 'Show More') {
        itemsToShow = Math.min(faqItems.length, itemsToShow + 5);
        buttonText.textContent = 'Show Less';
        if (faqIcon) faqIcon.style.transform = 'rotate(270deg)';
      } else {
        itemsToShow = 5;
        if (buttonText) buttonText.textContent = 'Show More';
        if (faqIcon) faqIcon.style.transform = 'rotate(90deg)';
      }
      toggleItems();
    });
  });
}

// Tabs - Empty Tab Click Handler
function initTabsHandler() {
  document.addEventListener('click', function(event) {
    if (event.target.matches('.inside-icon-wrapper')) {
      if (event.target.classList.contains('w--current')) {
        const emptyTab = document.querySelector('.empty-tab');
        if (emptyTab) {
          emptyTab.click();
        }
      }
    }
  });
}

// Initialize all functions
function initProductPage() {
  initAgeVerification();
  initQuantityButtons();
  initVideoScrollPlayback();
  initSwipers();
  initFAQNumbers();
  initFAQToggle();
  initTabsHandler();
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductPage);
} else {
  initProductPage();
}
