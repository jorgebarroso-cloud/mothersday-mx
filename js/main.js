/**
 * Mother's Day UK - Main JS
 * Uses Glide.js for carousels; cookie consent (GDPR/CCPA) and GA4 only after accept.
 */
(function () {
  'use strict';

  var CONSENT_COOKIE = 'cookie_consent';

  /** Easter Sunday (Gregorian) for given year. */
  function getEasterSunday(year) {
    var a = year % 19;
    var b = Math.floor(year / 100);
    var c = year % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  /** Mother's Day UK = Mothering Sunday = 4th Sunday of Lent = 21 days before Easter. */
  function getMothersDayUK(year) {
    var easter = getEasterSunday(year);
    var d = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate());
    d.setDate(d.getDate() - 21);
    return d;
  }

  /** Target date: start of Mother's Day UK (this or next year). */
  function getMothersDayTarget() {
    var now = new Date();
    var md = getMothersDayUK(now.getFullYear());
    if (isNaN(md.getTime())) return null;
    md.setHours(0, 0, 0, 0);
    if (md <= now) md = getMothersDayUK(now.getFullYear() + 1);
    if (md && !isNaN(md.getTime())) md.setHours(0, 0, 0, 0);
    return md && !isNaN(md.getTime()) ? md : null;
  }

  /** Time left until Mother's Day: { days, hours, minutes, seconds } or null. */
  function getTimeUntilMothersDay() {
    var target = getMothersDayTarget();
    if (!target) return null;
    var now = new Date();
    var ms = Math.max(0, target - now);
    var s = Math.floor(ms / 1000) % 60;
    var m = Math.floor(ms / (60 * 1000)) % 60;
    var h = Math.floor(ms / (60 * 60 * 1000)) % 24;
    var d = Math.floor(ms / (24 * 60 * 60 * 1000));
    return { days: d, hours: h, minutes: m, seconds: s };
  }

  /** Fallback text when countdown date is unknown (next Mother's Day, e.g. "March 15, 2026"). */
  function getCountdownFallback() {
    var md = getMothersDayTarget();
    if (md && !isNaN(md.getTime())) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return months[md.getMonth()] + ' ' + md.getDate() + ', ' + md.getFullYear();
    }
    return 'March 15, 2026';
  }

  function formatCountdown(t) {
    if (!t || (isNaN(t.days) && isNaN(t.hours))) return getCountdownFallback();
    if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
      return "today!";
    }
    var parts = [];
    if (t.days > 0) parts.push(t.days + " day" + (t.days !== 1 ? "s" : ""));
    parts.push(String(t.hours).padStart(2, "0") + "h " + String(t.minutes).padStart(2, "0") + "m " + String(t.seconds).padStart(2, "0") + "s");
    return parts.join(", ");
  }

  function initCountdownBar() {
    var el = document.getElementById('countdown-live') || document.getElementById('countdown-days');
    if (!el) return;
    var fallback = getCountdownFallback();
    function tick() {
      try {
        var timeLeft = getTimeUntilMothersDay();
        el.textContent = formatCountdown(timeLeft);
      } catch (err) {
        el.textContent = fallback;
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  var CITIES = [
    { slug: 'london', name: 'London' },
    { slug: 'manchester', name: 'Manchester' },
    { slug: 'birmingham', name: 'Birmingham' },
    { slug: 'liverpool', name: 'Liverpool' },
    { slug: 'leeds', name: 'Leeds' },
    { slug: 'bristol', name: 'Bristol' },
    { slug: 'brighton', name: 'Brighton' },
    { slug: 'edinburgh', name: 'Edinburgh' }
  ];

  function initCitySearch() {
    var input = document.getElementById('city-search');
    var resultsEl = document.getElementById('city-search-results');
    if (!input || !resultsEl) return;
    var maxResults = 8;
    function showResults(matches) {
      if (!matches.length) {
        resultsEl.hidden = true;
        resultsEl.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      resultsEl.innerHTML = matches.slice(0, maxResults).map(function (city) {
        var safeName = String(city.name).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        return '<a href="/' + city.slug + '/" class="city-search-results__item" role="option" id="city-opt-' + city.slug + '">' + safeName + '</a>';
      }).join('');
      resultsEl.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function hideResults() {
      resultsEl.hidden = true;
      resultsEl.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
    }
    function filterCities(q) {
      var qn = (q || '').trim().toLowerCase();
      if (!qn) return [];
      return CITIES.filter(function (c) {
        return c.name.toLowerCase().indexOf(qn) !== -1 || c.slug.toLowerCase().indexOf(qn) !== -1;
      });
    }
    input.addEventListener('input', function () {
      showResults(filterCities(input.value));
    });
    input.addEventListener('focus', function () {
      if (input.value.trim()) showResults(filterCities(input.value));
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideResults();
        input.blur();
      }
    });
    document.addEventListener('click', function (e) {
      if (resultsEl.hidden) return;
      if (e.target !== input && !resultsEl.contains(e.target)) hideResults();
    });
    var searchBtn = document.getElementById('hero-city-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        var firstLink = resultsEl.querySelector('a[href]');
        if (firstLink && input.value.trim()) {
          firstLink.click();
        } else {
          var target = document.getElementById('city-quick-links');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  function initCitySearchSection() {
    var input = document.getElementById('city-search-section');
    var resultsEl = document.getElementById('city-search-section-results');
    if (!input || !resultsEl) return;
    var maxResults = 8;
    function showResults(matches) {
      if (!matches.length) {
        resultsEl.hidden = true;
        resultsEl.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      resultsEl.innerHTML = matches.slice(0, maxResults).map(function (city) {
        var safeName = String(city.name).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        return '<a href="/' + city.slug + '/" class="city-search-results__item" role="option">' + safeName + '</a>';
      }).join('');
      resultsEl.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function hideResults() {
      resultsEl.hidden = true;
      resultsEl.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
    }
    function filterCities(q) {
      var qn = (q || '').trim().toLowerCase();
      if (!qn) return [];
      return CITIES.filter(function (c) {
        return c.name.toLowerCase().indexOf(qn) !== -1 || c.slug.toLowerCase().indexOf(qn) !== -1;
      });
    }
    input.addEventListener('input', function () { showResults(filterCities(input.value)); });
    input.addEventListener('focus', function () {
      if (input.value.trim()) showResults(filterCities(input.value));
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hideResults(); input.blur(); }
    });
    document.addEventListener('click', function (e) {
      if (resultsEl.hidden) return;
      if (e.target !== input && !resultsEl.contains(e.target)) hideResults();
    });
    var btn = document.getElementById('city-search-section-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var first = resultsEl.querySelector('a[href]');
        if (first && input.value.trim()) first.click();
        else input.focus();
      });
    }
  }

  var CONSENT_MAX_AGE = 365 * 24 * 60 * 60;
  var GA_MEASUREMENT_ID = 'G-VSEHV8SSVZ';

  function getConsent() {
    if (typeof document === 'undefined' || !document.cookie) return null;
    var match = document.cookie.match(new RegExp('(?:^|; )' + CONSENT_COOKIE + '=([^;]*)'));
    var value = match ? decodeURIComponent(match[1]) : null;
    if (value === 'accept' || value === 'reject') return value;
    return null;
  }

  function setConsent(value) {
    if (typeof document === 'undefined') return;
    var secure = (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:') ? ';Secure' : '';
    document.cookie = CONSENT_COOKIE + '=' + encodeURIComponent(value) + ';path=/;max-age=' + CONSENT_MAX_AGE + ';SameSite=Lax' + secure;
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: value }));
    }
  }

  function loadGA4() {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
  }

  function initCookieBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;
    var consent = getConsent();
    if (consent === null) {
      banner.classList.remove('cookie-banner--hidden');
      if (document.body) document.body.classList.add('cookie-banner-visible');
    } else if (consent === 'accept') {
      loadGA4();
    }
    var acceptBtn = banner.querySelector('.cookie-banner__btn--accept');
    var rejectBtn = banner.querySelector('.cookie-banner__btn--reject');
    function hideBanner() {
      banner.classList.add('cookie-banner--hidden');
      if (document.body) document.body.classList.remove('cookie-banner-visible');
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent('accept');
        hideBanner();
        loadGA4();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setConsent('reject');
        hideBanner();
      });
    }
  }

  function initNavigation() {
    var nav = document.querySelector('.site-header__nav');
    if (!nav) return;
    var links = nav.querySelectorAll('a');
    links.forEach(function (link) {
      link.setAttribute('rel', link.getAttribute('href') && link.getAttribute('href').indexOf('http') === 0 ? 'noopener noreferrer' : '');
    });
  }

  function createGlide(selector, options) {
    if (typeof window.Glide === 'undefined') return;
    var el = document.querySelector(selector);
    if (!el) return;
    var defaultOptions = {
      type: 'carousel',
      animationDuration: 400,
      hoverpause: true,
      perTouch: false,
      swipeThreshold: 40,
      dragThreshold: 60,
      breakpoints: {
        1023: { perView: 2, gap: 20 },
        639: { perView: 1, gap: 20 }
      },
      pagination: {
        clickable: false,
        renderBullet: function (index, className) {
          return '<span class="' + className + '" role="presentation"></span>';
        }
      }
    };
    var merged = Object.assign({}, defaultOptions, options || {});
    new window.Glide(selector, merged).mount();
  }

  function initGlides() {
    var carousels = document.querySelectorAll('.glide');
    if (carousels.length === 0) return;
    if (typeof window.Glide === 'undefined') return;
    carousels.forEach(function (el, i) {
      var id = el.id || ('glide-' + i);
      if (!el.id) el.id = id;
      createGlide('#' + id, { perView: 3, gap: 30 });
    });
  }

  function initVideoCarousel() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initGlides, { timeout: 2000 });
    } else {
      setTimeout(initGlides, 100);
    }
  }

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var hero = document.querySelector('.hero');
    var threshold = hero ? hero.offsetHeight : 0;
    function updateHeader() {
      if (!hero) {
        header.classList.add('is-scrolled');
        return;
      }
      if (window.scrollY > threshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  function initHeaderCityDropdown() {
    var dropdown = document.getElementById('header-city-dropdown');
    var btn = document.getElementById('header-city-btn');
    var menu = document.getElementById('header-city-menu');
    if (!dropdown || !btn || !menu) return;
    function open() {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('is-open');
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('is-open');
    }
    function toggle() {
      if (menu.hidden) open(); else close();
    }
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCookieBanner();
    initCountdownBar();
    initCitySearch();
    initCitySearchSection();
    initHeaderCityDropdown();
    initNavigation();
    initHeaderScroll();
    initGlides();
    initVideoCarousel();
  });
})();
