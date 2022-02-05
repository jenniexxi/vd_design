(function () {
    gsap.registerPlugin(ScrollTrigger);
    
    const __vdKv = '.vd-qled-kv';
    const __vdSmart = '.vd-qled-smart';
    const __vdQuality = '.vd-qled-quality';
    const __vdSound = '.vd-qled-sound';
    const __vdDesign = '.vd-qled-design';
    const __vdAcc = '.vd-qled-acc';
    const __vdOutro = '.vd-qled-outro';
    const __rtl = document.getElementsByTagName('html')[0].className.indexOf('rtl') > -1 ? true : false;
    const __ie = /MSIE \d|Trident.*rv:/.test(navigator.userAgent);
    const __isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i);
    let __isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let __timing = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    let __delay = 300;
    let __timer = null;
    let __low = false;

    //vd common function
    const VD_COMMON = {
        ELEM: {
            __LOAD: false,
            __DELAY: 500,
            __TIMER: null,
            __SCROLL_STOP_TIMER: null,
            __EXCEPTION_TIMER: null,
            __LOAD_SCROLL_TOP: window.scrollY || window.pageYOffset,
            __LOAD_CHECK: false,
            __LAST_KNOWN_SCROLL_POSITION: 0,
            __TICKING: false,
            __WINDOW_WIDTH: window.innerWidth,
            __WINDOW_HEIGHT: window.innerHeight,
            __AFTER_RESIZE_TYPE: window.innerWidth > 767 ? 2 : 1,
            __BEFORE_RESIZE_TYPE: null,
            __FLOATING_NAV: document.querySelector('.floating-navigation'),
            __BEFORE_TIME_STAMP: 0,
            __AFTER_TIME_STAMP: 0
        },
        SET: {
            VH: function () {
                document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
            },
            ON_SCROLL: function (__scrollTop = window.scrollY || window.pageYOffset) {
                const __floatingNav = VD_COMMON.ELEM.__FLOATING_NAV;
                const __floatingNavHeight = __floatingNav.className.indexOf('--fixed') > 0 ? __floatingNav.offsetHeight : 0;
                const __compareTop = document.querySelector('.vd-qled-compare').offsetTop;
                if (__floatingNavHeight > 0) document.querySelector('.vd-qled-kv').classList.add('kv-sticky-top');
                if (__floatingNavHeight === 0) document.querySelector('.vd-qled-kv').classList.remove('kv-sticky-top');

                if ((__scrollTop + VD_COMMON.ELEM.__WINDOW_HEIGHT) >= __compareTop) {
                    document.getElementsByClassName(`vd-info-scroll`)[0].style.opacity = 0;
                    return;
                }

                if (VD_COMMON.ELEM.__SCROLL_STOP_TIMER !== null) {
                    clearTimeout(VD_COMMON.ELEM.__SCROLL_STOP_TIMER);
                    document.getElementsByClassName(`vd-info-scroll`)[0].style.opacity = 0;
                }

                VD_COMMON.ELEM.__SCROLL_STOP_TIMER = setTimeout(function () {
                    console.log
                    document.getElementsByClassName(`vd-info-scroll`)[0].style.opacity = 1;
                }, 150);
            },
            LOW: function (__time) {
                if (__time > 15) {
                    document.getElementsByTagName('html')[0].classList.add('vd-low');
                    __low = true;
                }
            }
        },
        VIDEO: {
            PLAY: function (__el, __target, __time) {
                const __videoAllEl = __el.querySelectorAll(`${__target}`);
                [].forEach.call(__videoAllEl, (__video) => {
                    if (__video.paused || __video.ended) {
                        __video.currentTime = __time;
                        __video.play();
                    }

                    [].forEach.call(__el.querySelectorAll('.vd-btn-control'), (__videoBtn) => {
                        if (__video.getAttribute('id') === null) return;
                        if (__video.getAttribute('id').indexOf(__videoBtn.getAttribute('data-role-video')) > -1) {
                            __videoBtn.classList.remove('vd-btn-play');
                            __videoBtn.classList.add('vd-btn-pause');
                            __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Play' ,'Pause');

                            VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'play');
                        }
                    });
                });
            },
            PAUSE: function (__el, __target, __time) {
                const __videoAllEl = __el.querySelectorAll(`${__target}`);
                [].forEach.call(__videoAllEl, (__video) => {
                    if (!__video.paused && __video.readyState === 4) {
                        __video.pause();
                        __video.currentTime = __time;
                    }

                    [].forEach.call(__el.querySelectorAll('.vd-btn-control'), (__videoBtn) => {
                        if (__video.getAttribute('id') === null) return;
                        if (__video.getAttribute('id').indexOf(__videoBtn.getAttribute('data-role-video')) > -1) {
                            __videoBtn.classList.remove('vd-btn-pause');
                            __videoBtn.classList.add('vd-btn-play');
                            __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Pause' ,'Play');
                            
                            VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'stop');
                        }
                    });
                });
            },
            EVENT: function () {
                const __vdVideoPlayBtn = document.querySelectorAll('.vd-btn-control');

                [].forEach.call(__vdVideoPlayBtn, (__btnEl) => {
                    __btnEl.addEventListener('click', function (e) {
                        const __mode = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? 'pc' : 'mo';
                        const __el = e.target;
                        const __role = __el.getAttribute('data-role-video');
                        const __target = document.getElementById((`${__role}-${__mode}`));

                        if (__el.className.indexOf('vd-btn-pause') > -1) {
                            __el.classList.remove('vd-btn-pause');
                            __el.classList.add('vd-btn-play');
                            __el.children[0].innerText = __el.children[0].innerText.replace('Pause' ,'Play');
                            __target.pause();

                            VD_COMMON.TAGGING.EVENT.PLAY_PAUSE_BTN(__el, 'stop');
                        } else {
                            __el.classList.remove('vd-btn-play');
                            __el.classList.add('vd-btn-pause');
                            __el.children[0].innerText = __el.children[0].innerText.replace('Play' ,'Pause');
                            //__target.currentTime = 0;
                            __target.play();

                            VD_COMMON.TAGGING.EVENT.PLAY_PAUSE_BTN(__el, 'play');

                            if (__btnEl.getAttribute('data-role-video').indexOf('vd-kv-video') > -1 && document.querySelector(`${__vdKv}.vd-replay-ready`)) {
                                document.querySelector(`${__vdKv}`).classList.remove('vd-play');
                                document.querySelector(`${__vdKv}`).classList.remove('vd-replay-ready');

                                setTimeout(() => {
                                    document.querySelector(`${__vdKv}`).classList.add('vd-play');
                                }, 0);
                            }
                        }
                    });
                });
            }
        },
        ROUND_TWO: function (__num) {
            return +(Math.round(__num + "e+2") + "e-2");
        },
        TAGGING: {
            VIDEO: {
                PLAY_PAUSE_BTN: function (__videoBtn, __type) {
                    let __tagging = __videoBtn.getAttribute('an-la');
                    
                    __type == 'stop' ? __tagging = __tagging.replace('stop', 'play') : __tagging = __tagging.replace('play', 'stop');
                    __videoBtn.setAttribute('an-la', __tagging);
                },
            },
            EVENT: {
                PLAY_PAUSE_BTN: function (__videoBtn, __type) {
                    
                    let __tagging = __videoBtn.getAttribute('an-la');
                    __type == 'stop' ? __tagging = __tagging.replace('stop', 'play') : __tagging = __tagging.replace('play', 'stop');
                    __videoBtn.setAttribute('an-la', __tagging);
                },
            }
        },
        AUTOCHANGE: {
            HEIGHT: function () {
                let __stickyIn = document.querySelectorAll('.vd-sticky-copy .vd-sticky-in');

                [].forEach.call(__stickyIn, (__el) => {
                    let __stickyEnd = __el.querySelectorAll(`[class$="end"]`);
                    [].forEach.call(__stickyEnd, (__elEnd) => {
                        __el.style.height = `${__elEnd.offsetHeight}px`;
                    });
                });
            },
            COMPARE_HEIGHT: function (__type = 'init') {
                const __vdCompareCategoryItem = document.getElementsByClassName('vd-compare-category-item');
                const __vdCompareSpecItem = document.querySelectorAll('.vd-wrap .compare-spec-item');
                const __vdCompareProductItem = document.querySelectorAll('.vd-wrap .compare-product-item');
                let __vdCategoryItemArray = [];
                let __vdProductHeightArray = [];
                let __vdHeightArray = [];

                if (__type === 'resize') {
                    //category height reset
                    [].forEach.call(__vdCompareCategoryItem, (__categoryEl, __i) => {
                        __categoryEl.style.height = '';
                    });

                    //spec item height reset
                    [].forEach.call(__vdCompareSpecItem, (__specEl, __i) => {
                        __specEl.style.height = '';
                    });
                }

                [].forEach.call(__vdCompareCategoryItem, (__categoryEl, __i) => {
                    __vdCategoryItemArray.push(__categoryEl.offsetHeight);
                });

                [].forEach.call(__vdCompareProductItem, (__productEl, __i) => {
                    if (typeof __vdProductHeightArray[__i] === 'undefined') __vdProductHeightArray[__i] = [];

                    const __vdCompareSpecItem = __productEl.querySelectorAll('.compare-spec-item');
                    [].forEach.call(__vdCompareSpecItem, (__specEl, __specIndex) => {
                        __vdProductHeightArray[__i].push(__specEl.offsetHeight);
                    });
                });

                __vdProductHeightArray.push(__vdCategoryItemArray);
                __vdProductHeightArray.forEach((__array, __i) => {
                    __array.forEach((__h, __n) => {
                        if (typeof __vdHeightArray[__n] === 'undefined') {
                            __vdHeightArray[__n] = __h;
                        } else {
                            if (__vdHeightArray[__n] <= __h) __vdHeightArray[__n] = __h;
                        }
                    });
                });

                //category height
                [].forEach.call(__vdCompareCategoryItem, (__categoryEl, __i) => {
                    __categoryEl.style.height = `${__vdHeightArray[__i]}px`;
                });

                //spec item height
                [].forEach.call(__vdCompareSpecItem, (__specEl, __i) => {
                    const __heightIndex = __i % 10;
                    __specEl.style.height = `${__vdHeightArray[__heightIndex]}px`;
                });
            }
        },
        COMPARE_BTN: function () {
            const __compareBtn = document.querySelectorAll('.vd-btn-compare a');

            [].forEach.call(__compareBtn, (__btn) => {
                __btn.addEventListener('click', function (e) {
                    $('#vd-compare-wrap').blur();
                    setTimeout(() => {
                        document.querySelector('#vd-compare-wrap').focus();
                        window.scrollTo(0, document.querySelector('.vd-qled-compare').offsetTop);
                    }, 0);
                });
            });
        },
        TOOLTIP: function () {
            const __tooltipBtn = document.getElementsByClassName('vd-compare-tooltip-btn');
            const __tooltipCloseBtn = document.getElementsByClassName('vd-compare-tooltip-close');

            [].forEach.call(__tooltipBtn, (__btn) => {
                __btn.addEventListener('click', function () {
                    if (__btn.className.indexOf('tooltip-click') === -1) {
                        __btn.classList.add('tooltip-click');
                        
                        __btn.nextElementSibling.setAttribute('aria-hidden', false);
                        __btn.nextElementSibling.hidden = false;
                    } else {
                        __btn.classList.remove('tooltip-click');
                        
                        __btn.nextElementSibling.setAttribute('aria-hidden', true);
                        __btn.nextElementSibling.hidden = true;
                    }
                });
            });

            [].forEach.call(__tooltipCloseBtn, (__closeBtn) => {
                __closeBtn.addEventListener('click', function (e) {
                    const __tooltipBtn = e.target.parentNode.previousElementSibling;
                    
                    __closeBtn.focus();
                    __tooltipBtn.setAttribute('tabindex', 0);
                    setTimeout(() => {
                        __tooltipBtn.classList.remove('tooltip-click');
                        e.target.parentNode.setAttribute('aria-hidden', true);
                        e.target.parentNode.hidden = true;
                        __tooltipBtn.focus();
                    }, 100);
                });

                __closeBtn.addEventListener('keydown', function (e) {
                    const __keyCode = e.key.toLowerCase();

                    if (e.shiftKey && __keyCode === 'tab') {
                    } else if (__keyCode === 'tab') {
                        const __tooltipBtn = e.target.parentNode.previousElementSibling;
                        __tooltipBtn.classList.remove('tooltip-click');
                        
                        e.target.parentNode.setAttribute('aria-hidden', true);
                        e.target.parentNode.hidden = true;
                    }
                });
            });
        }
    };

    const VD_KV = {
        VIDEO: {
            PLAYED: function () {
                const __videoBtn = document.querySelector(`${__vdKv} .vd-btn-control`);
                const __vdVideoBox = document.querySelectorAll(`${__vdKv} .vd-video-box`);
                const __width = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? 'mo' : 'pc';
                setTimeout(() => {
                    [].forEach.call(__vdVideoBox, (__el) => {
                        if (__el.className.indexOf(__width) > -1) {
                            if (!__el.querySelector('video').paused && !__el.querySelector('video').ended) {
                                __videoBtn.classList.remove('vd-btn-play');
                                __videoBtn.classList.add('vd-btn-pause');
                                __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Play' ,'Pause');
                                VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'play');
                            }
                        }
                    });
                }, 0);

            },
            END: function () {
                const __videoBtn = document.querySelector(`${__vdKv} .vd-btn-control`);
                const __vdVideoBox = document.querySelectorAll(`${__vdKv} .vd-video-box`);

                [].forEach.call(__vdVideoBox, (__el) => {
                    __el.querySelector('video').addEventListener('ended', function () {
                        __videoBtn.classList.remove('vd-btn-pause');
                        __videoBtn.classList.add('vd-btn-play');
                        __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Pause' ,'Play');

                        VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'stop');

                        document.querySelector(`${__vdKv}`).classList.add('vd-replay-ready');
                    });
                });
            }
        }
    };

    //vd smart function
    const VD_SMART = {
        ELEM: {
            __WRAP: document.querySelector('.vd-qled-smart')
        },
        ACCESSIBILITY: function () {
            const __endStory = VD_SMART.ELEM.__WRAP.querySelector('.vd-qled-smart-story-end');
            const __endStoryBtn = __endStory.querySelector('.vd-btn-link a');

            __endStoryBtn.addEventListener('focusin', function (e) {
                const __vdQualityWrap = document.querySelector('.vd-qled-quality');
                window.scrollTo(0, __vdQualityWrap.offsetTop - VD_COMMON.ELEM.__WINDOW_HEIGHT);
            });
        }
    };

    //vd quality function
    const VD_QUALITY = {
        ELEM: {
            __WRAP: document.querySelector('.vd-qled-quality'),
            __AFTER: document.querySelector('.vd-qled-quality .vd-qled-quality-story02 .vd-quality-chip-after'),
            __FRAME_CLIP: null,
            __FRAME_CLIP_ARRAY: [],
            __DIRECTION: 1
        },
        VIDEO: {
            PLAY: function (__el, __currentTime) {
                const __vdQualityWrap = document.querySelector(__vdQuality);
                VD_COMMON.VIDEO.PLAY(__vdQualityWrap, __el, __currentTime);
            },
            PAUSE: function (__el, __currentTime) {
                const __vdQualityWrap = document.querySelector(__vdQuality);
                VD_COMMON.VIDEO.PAUSE(__vdQualityWrap, __el, __currentTime);
            },
            END: function () {
                const __videoBtn = document.querySelector(`${__vdQuality} .vd-btn-control`);
                const __vdVideoBox = document.querySelectorAll(`${__vdQuality} .vd-video-box`);

                [].forEach.call(__vdVideoBox, (__el) => {
                    __el.querySelector('video').addEventListener('ended', function () {
                        __videoBtn.classList.remove('vd-btn-pause');
                        __videoBtn.classList.add('vd-btn-play');
                        __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Pause' ,'Play');

                        VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'stop');
                    });
                });
            }
        }
    };

    const VD_SOUND = {
        ELEM: {
            __WRAP: document.querySelector('.vd-qled-sound')
        },
        VIDEO: {
            END: function () {
                const __videoBtn = document.querySelector(`${__vdSound} .vd-btn-control`);
                const __vdVideoBox = document.querySelectorAll(`${__vdSound} .vd-video-box`);

                [].forEach.call(__vdVideoBox, (__el) => {
                    __el.querySelector('video').addEventListener('ended', function () {
                        __videoBtn.classList.remove('vd-btn-pause');
                        __videoBtn.classList.add('vd-btn-play');
                        __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Pause' ,'Play');

                        VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'stop');
                    });
                });
            }
        },
        REMOVE: function () {
            document.querySelector(`${__vdSound} .vd-qled-sound-end-img`).removeAttribute('style');
        }
    };

    //vd design function - 파악해야할 부분
    const VD_DESIGN = {
        ELEM: {
            __WRAP: document.querySelector('.vd-qled-design'),
            __STORY_WRAP: document.querySelector('.vd-qled-design .vd-qled-design-story01'),
            __SCROLL_WRAP: document.querySelector('.vd-qled-design .vd-design-scroll-wrap'),
            __OUTER: document.querySelector('.vd-qled-design .vd-design-scroll-outer'),
            __INNER: document.querySelector('.vd-qled-design .vd-design-scroll-inner'),
            __DESIGN_SCREEN: document.querySelector('.vd-qled-design .vd-design-screen'),
            __BEFORE: document.querySelector('.vd-qled-design .vd-cont-screen .vd-design-before'),
            __AFTER: document.querySelector('.vd-qled-design .vd-cont-screen .vd-design-after'),
            __ITEM_LIST: document.querySelector('.vd-qled-design .vd-design-item-list'),
            __DIRECTION: 1,
            __FRAME_CLIP: null,
            __FRAME_CLIP_ARRAY: [],
            __BEFORE_TOP: 0,
            __RATING_ARRAY: []
        },
        CALC: {
            INNER_X: function (__this, __type) {
                const __vdDesignItemAllEl = VD_DESIGN.ELEM.__ITEM_LIST.querySelectorAll('[class*="vd-design-item0"]');
                let __vdDesignInnerWidth = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? VD_DESIGN.ELEM.__INNER.offsetWidth / 2 : VD_COMMON.ELEM.__WINDOW_WIDTH / 2;
                let __vdDesignInnerMarginLeft = VD_DESIGN.ELEM.__ITEM_LIST.currentStyle || window.getComputedStyle(VD_DESIGN.ELEM.__ITEM_LIST);
                let __vdDesignXstyle = null;
                let __vdDesignX = 0;
                let __index = 0;

                //rating reset
                VD_DESIGN.ELEM.__RATING_ARRAY = [];

                if (__this !== 'set') {
                    __vdDesignXstyle = VD_DESIGN.ELEM.__ITEM_LIST.getAttribute('style').match(/\(.*\)/gi)[0].split(',');
                    __vdDesignXstyle.forEach((__value, __i) => {
                        if (__i === 0) __vdDesignX = Number(__value.replace(/[^0-9^.]/g, ''));
                    });
                }

                [].forEach.call(__vdDesignItemAllEl, (__el, __i) => {
                    let __elLeft = __el.offsetLeft;
                    let __elImgSize = __el.querySelector('img').offsetWidth / 2;

                    VD_DESIGN.ELEM.__RATING_ARRAY.push(
                        __i === 0 ? 0 : (__elLeft - __vdDesignInnerWidth) + __elImgSize
                    )
                    // console.log(VD_DESIGN.ELEM.__RATING_ARRAY);
                    // console.log(__el);
                    // console.log(__elLeft);
                    // console.log(__elImgSize);

                    if (__type === 'leave') __el.querySelector('.item-inner').classList.add('vd-scale');
                    if (__type === 'leaveBack') __el.querySelector('.item-inner').classList.remove('vd-scale');
                });

                __vdDesignInnerMarginLeft = parseInt(__vdDesignInnerMarginLeft.getPropertyValue('margin-left'));
                // console.log(__vdDesignInnerMarginLeft); //0

                VD_DESIGN.ELEM.__RATING_ARRAY.forEach((__rating, __i) => {
                    console.log(__rating)
                    if (__rating - 100 <= __vdDesignX && __rating + 100 >= __vdDesignX) {
                        __index = __i;
                    }
                    console.log(__vdDesignX);
                });

                if (__type === 'update') {
                    if (VD_DESIGN.ELEM.__DIRECTION === 1) __vdDesignItemAllEl[__index].querySelector('.item-inner').classList.add('vd-scale');
                    if (VD_DESIGN.ELEM.__DIRECTION === -1) __vdDesignItemAllEl[__index].querySelector('.item-inner').classList.remove('vd-scale');
                }

                if (__type === 'enter') {
                    VD_DESIGN.ELEM.__RATING_ARRAY.forEach((__rating, __i) => {
                        if (__rating <= -(__vdDesignX)) {
                            __vdDesignItemAllEl[__i].querySelector('.item-inner').classList.add('vd-scale');
                        } else {
                            __vdDesignItemAllEl[__i].querySelector('.item-inner').classList.remove('vd-scale');
                        }
                    });
                }
            },
            X: function () {
                let __vdDesignX = 0;

                //rating array setting
                VD_DESIGN.CALC.INNER_X('set');
                
                // 바꿔야 하는 부분
                //rating last value
                const __itemList = document.querySelectorAll(`${__vdDesign} .vd-design-item-list li`);
                const __marginDirection = __rtl === false ? 'margin-right' : 'margin-left';
                let __value = 0;

                [].forEach.call(__itemList, (__el, __i) => {
                    let __marginRight = Math.round(window.getComputedStyle(__el).getPropertyValue(__marginDirection).replace(/[^0-9^.]/g, ''));
                    __value += __el.offsetWidth + __marginRight;
                    if (__itemList.length - 1 === __i) __value = __value - __el.offsetWidth;
                });

                __value += Math.round(window.getComputedStyle(VD_DESIGN.ELEM.__OUTER).getPropertyValue('margin-left').replace(/[^0-9^.]/g, ''));

                if (VD_COMMON.ELEM.__WINDOW_WIDTH > 767) {
                    if (!__rtl) __value -= document.querySelector('.vd-qled-design .vd-txt-wrap.vd-txt-type01').offsetLeft;
                    if (__rtl) {
                        const __vdEndInner = document.querySelector('.vd-qled-design .vd-qled-design-end .vd-cont-inner');
                        const __marginRight = Math.round(window.getComputedStyle(__vdEndInner).getPropertyValue('margin-right').replace(/[^0-9^.]/g, ''));
                        const __paddingRight = Math.round(window.getComputedStyle(__vdEndInner).getPropertyValue('padding-right').replace(/[^0-9^.]/g, ''));

                        __value -= (__marginRight + __paddingRight);
                    }

                    __vdDesignX = __rtl !== true ? -(__value) : __value;
                } else {
                    if (!__rtl) __value += Math.round(window.getComputedStyle(VD_DESIGN.ELEM.__OUTER).getPropertyValue('padding-left').replace(/[^0-9^.]/g, ''));
                    if (__rtl) __value += Math.round(window.getComputedStyle(VD_DESIGN.ELEM.__OUTER).getPropertyValue('padding-right').replace(/[^0-9^.]/g, '')) + 1;
                    
                    if (!__rtl) {
                        __vdDesignX = __isMobile ? -(__value) : -(__value);
                    } else {
                        __vdDesignX = __isMobile ? (__value) : (__value);
                    }
                }
                // 바꿔야 하는 부분 e

                return __vdDesignX;
            },
        },
        VIDEO: {
            END: function () {
                const __videoBtn = document.querySelector(`${__vdDesign} .vd-btn-control`);
                const __vdVideoBox = document.querySelectorAll(`${__vdDesign} .vd-video-box`);

                [].forEach.call(__vdVideoBox, (__el) => {
                    __el.querySelector('video').addEventListener('ended', function () {
                        __videoBtn.classList.remove('vd-btn-pause');
                        __videoBtn.classList.add('vd-btn-play');
                        __videoBtn.children[0].innerText = __videoBtn.children[0].innerText.replace('Pause' ,'Play');
                        VD_COMMON.TAGGING.VIDEO.PLAY_PAUSE_BTN(__videoBtn, 'stop');
                    });
                });
            }
        }
    };
    //vd design function - 파악해야할 부분 e

    //vd acc function
    const VD_ACC = {
        ELEM: {
            __FRONT_LARGE: document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .large-img`),
            __FRONT_AFTER: document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .original-img`),
            __STORY01_REMOTE: document.querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-box`),
            __ACC_SCROLL_WRAP: document.querySelector(`${__vdAcc} .vd-acc-scroll`),
            __ACC_SCROLL_ITEM_LIST: document.querySelector(`${__vdAcc} .vd-acc-scroll .vd-acc-item-list`)
        },
        REMOTE: {
            LARGE_IMG_SIZE: () => {
                return VD_ACC.ELEM.__FRONT_LARGE.offsetWidth;
            },
            SIZE: () => {
                const __size = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? VD_ACC.ELEM.__FRONT_AFTER.naturalWidth : 105;

                return __size;
            },
            START_TOP: (__n) => {
                const __screenHeight = (VD_COMMON.ELEM.__WINDOW_HEIGHT - VD_COMMON.ELEM.__FLOATING_NAV.offsetHeight) / 2;
                const __remoteHeight = VD_ACC.ELEM.__FRONT_AFTER.naturalHeight / 2;
                const __resultTop = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? VD_COMMON.ROUND_TWO(__screenHeight - __remoteHeight) + __n : VD_ACC.ELEM.__STORY01_REMOTE.getBoundingClientRect().top - VD_COMMON.ELEM.__FLOATING_NAV.offsetHeight;

                return __resultTop;
            },
            STORY01_BOTTOM: () => {
                const __bottom = parseInt(window.getComputedStyle(VD_ACC.ELEM.__STORY01_REMOTE).getPropertyValue('bottom'));
                const __n = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? 75 : 25;

                return __bottom + __n;
            },
            LEAVE: () => {
                if (document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).className.indexOf('vd-action') === -1) {
                    document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`).classList.remove('vd-hide');
                    document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).removeAttribute('style');
                    document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).classList.remove('vd-hide');
                    document.querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-box`).classList.remove('vd-show');
                }
            },
            SCREEN_CHANGE: () => {
                document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).style.zIndex = 5;
                document.querySelector(`${__vdAcc} .vd-qled-acc-story02`).removeAttribute('style');
                document.querySelector(`${__vdAcc} .vd-qled-acc-story02 .vd-acc-remote-wrap`).classList.remove('vd-acc-play');
            }
        },
        INNER_X: () => {
            const __itemAll = VD_ACC.ELEM.__ACC_SCROLL_ITEM_LIST.querySelectorAll('[class*="vd-acc-item0"]');
            let __x = 0;

            [].forEach.call(__itemAll, (__el, __i) => {
                if (__i === __itemAll.length - 1) __x = __el.offsetLeft;
            });

            return -(__x);
        }
    };

    const VD_SCROLL_TRIGGER = {
        VD_SMART_SCROLL: {
            CIRCLE: function () {
                gsap.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-circle`, {
                    scrollTrigger: {
                        trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-circle`,
                        //markers: true,
                        start: `-${VD_COMMON.ELEM.__FLOATING_NAV.offsetHeight}px top`,
                        end: "bottom 100%",
                        scrub: 0.5,
                        invalidateOnRefresh: true,
                        onEnter: (__this) => {
                            VD_COMMON.VIDEO.PLAY(__this.trigger, `${__vdSmart} .vd-video-box .vd-video-cont`, 0);
                        },
                        onEnterBack: (__this) => {
                            VD_COMMON.VIDEO.PLAY(__this.trigger, `${__vdSmart} .vd-video-box .vd-video-cont`, 0);
                        },
                        onLeave: () => {
                            // VD_COMMON.VIDEO.P(__this.trigger, `${__vdSmart} .vd-video-box .vd-video-cont`, 0);
                        },
                        onLeaveBack: (__this) => {
                            
                        }
                    },
                });
            },
            SCENE1: function () {
                gsap.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart01 .vd-qled-smart-story01`, {
                    scrollTrigger: {
                        trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-smart02`,
                        //markers: true,
                        start: "-25% top",
                        end: "top top",
                        scrub: true,
                        // invalidateOnRefresh: true
                    },
                    y: -150
                });

                gsap.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart02 .vd-qled-smart-story02`, {
                    scrollTrigger: {
                        trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-smart03`,
                        //markers: true,
                        start: "-25% top",
                        end: "top top",
                        scrub: true,
                        // invalidateOnRefresh: true
                    },
                    y: -150
                });

                gsap.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart03 .vd-qled-smart-story03`, {
                    scrollTrigger: {
                        trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04`,
                        //markers: true,
                        start: "-19% top",
                        end: "top top",
                        scrub: true,
                        // invalidateOnRefresh: true
                    },
                    y: -150
                });
            },
            SCENE2: function () {
                const __scene4Timeline = gsap.timeline({
                    paused: true,
                    scrollTrigger: {
                        trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04`,
                        //markers: true,
                        start: "top top",
                        end: "bottom 200%",
                        scrub: 0.5,
                        invalidateOnRefresh: true
                    },
                });

                __scene4Timeline.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04 .vd-qled-smart-story-end`, {
                    duration: 0.5,
                    opacity: 1
                }, '+=2').fromTo(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04 .vd-qled-smart-story-end .vd-txt-wrap`,
                    {
                        y: 60,
                        opacity: 0
                    },
                    {
                        duration: 1.5,
                        y: 0,
                        opacity: 1
                    }, '-=2'
                );

                ScrollTrigger.matchMedia({
                    "(min-width: 768px)": function () {
                        gsap.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04 .story-inner > .vd-txt-wrap`, {
                            scrollTrigger: {
                                trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04`,
                                //markers: true,
                                start: '45% top',
                                end: '60% center',
                                scrub: 0.5,
                                // invalidateOnRefresh: true
                            },
                            autoAlpha: 0
                        });
                    },
                    "(max-width: 767px)": function () {
                        gsap.to(`${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04 .story-inner > .vd-txt-wrap`, {
                            scrollTrigger: {
                                trigger: `${__vdSmart} .vd-sticky-wrap.vd-sticky-smart04`,
                                //markers: true,
                                start: '45% top',
                                end: '60% center',
                                scrub: 0.5,
                                // invalidateOnRefresh: true
                            },
                            autoAlpha: 0
                        });
                    }
                });
            },
            init: function () {
                if (!__ie && !__low) {
                    this.CIRCLE();
                    this.SCENE1();
                    this.SCENE2();
                }
            }
        },
        VD_QUALITY_SCROLL: function () {
            if (!document.querySelector(__vdQuality)) return;

            gsap.to(`${__vdQuality} .vd-sticky-wrap.first`, {
                scrollTrigger: {
                    trigger: `${__vdQuality} .vd-sticky-wrap.first`,
                    //markers: true,
                    start: `-${VD_COMMON.ELEM.__FLOATING_NAV.offsetHeight}px top`,
                    end: "bottom 100%",
                    scrub: 0.5,
                    immediateRender: false,
                    onEnter: (__this) => {
                        VD_QUALITY.VIDEO.PLAY(`${__vdQuality} .vd-qled-quality-start .vd-video-box .vd-video-cont`, 0);
                    },
                    onEnterBack: (__this) => {
                        VD_QUALITY.VIDEO.PLAY(`${__vdQuality} .vd-qled-quality-start .vd-video-box .vd-video-cont`, 0);
                    },
                    onLeaveBack: (__this) => {
                        __this.trigger.querySelector('.vd-txt-wrap.vd-header').removeAttribute('style');
                    }
                },
            });

            if (!__ie && !__low) {
                gsap.to(`${__vdQuality} .vd-qled-quality-end .vd-desc span`, {
                    scrollTrigger: {
                        trigger: `${__vdQuality} .vd-sticky-wrap.vd-sticky-copy`,
                        //markers: true,
                        start: '-24% top',
                        end: 'center bottom',
                        scrub: 0.5,
                    },
                    autoAlpha: 1
                });
            }
        },
        VD_SOUND_SCROLL: function () {
            if (!document.querySelector(__vdSound)) return;

            gsap.to(`${__vdSound} .vd-sticky-wrap.first`, {
                scrollTrigger: {
                    trigger: `${__vdSound} .vd-sticky-wrap.first`,
                    //markers: true,
                    start: `-${VD_COMMON.ELEM.__FLOATING_NAV.offsetHeight}px top`,
                    end: "bottom 100%",
                    scrub: 0.5,
                    immediateRender: false,
                    onEnter: (__this) => {
                        VD_COMMON.VIDEO.PLAY(__this.trigger, `${__vdSound} .vd-qled-sound-video01 .vd-video-box .vd-video-cont`, 0);
                    },
                    onEnterBack: (__this) => {
                        VD_COMMON.VIDEO.PLAY(__this.trigger, `${__vdSound} .vd-qled-sound-video01 .vd-video-box .vd-video-cont`, 0);
                    },
                    onLeaveBack: (__this) => {
                        __this.trigger.querySelector('.vd-txt-wrap.vd-header').removeAttribute('style');
                    }
                },
            });

            if (!__ie && !__low) {
                gsap.to(`${__vdSound} .vd-qled-sound-end span`, {
                    scrollTrigger: {
                        trigger: `${__vdSound} .vd-sticky-wrap.vd-sticky-copy`,
                        //markers: true,
                        start: '-24% top',
                        end: 'center center',
                        scrub: 0.5,
                    },
                    autoAlpha: 1
                });
            }
        },
        VD_DESIGN_SCROLL: function () {
            if (!document.querySelector(__vdDesign)) return;
            let __videoCheck = false;
            let __target = __ie === false && __low === false ? `${__vdDesign} .vd-sticky-wrap.first` : `${__vdDesign} .vd-qled-design-video`;
            let __endValue = __ie === false && __low === false ? '10% center' : 'bottom 100%';
            
            gsap.to(__target, {
                scrollTrigger: {
                    id: 'qled-design',
                    trigger: __target,
                    //markers: true,
                    start: `-${VD_COMMON.ELEM.__FLOATING_NAV.offsetHeight}px top`,
                    end: __endValue,
                    ease: 'Power0.easeNone',
                    scrub: true,
                    // invalidateOnRefresh: true,
                    onEnter: (__this) => {
                        //samsung browser
                        if (__isSamsungBrowser) __this.trigger.querySelector('.vd-txt-wrap.vd-header').classList.remove('vd-design-x-scroll');

                        VD_COMMON.VIDEO.PLAY(__this.trigger, `${__vdDesign} .vd-qled-design-video .vd-video-box .vd-video-cont`, 0);
                    },
                    onEnterBack: (__this) => {
                        //samsung browser
                        if (__isSamsungBrowser) __this.trigger.querySelector('.vd-txt-wrap.vd-header').classList.remove('vd-design-x-scroll');
                        
                        document.querySelector(`${__vdDesign} .vd-qled-design-video`).removeAttribute('style');
                        VD_COMMON.VIDEO.PLAY(__this.trigger, `${__vdDesign} .vd-qled-design-video .vd-video-box .vd-video-cont`, 0);
                    },
                    onLeave: (__this) => {
                        VD_COMMON.VIDEO.PAUSE(__this.trigger, `${__vdDesign} .vd-qled-design-video .vd-video-box .vd-video-cont`, 4);
                    }
                }
            });

            if (!__ie && !__low) {
                gsap.fromTo(`${__vdDesign} .vd-qled-design-story01 .vd-design-scroll-inner`,
                    {
                        autoAlpha: 1,
                        x: 0
                    },
                    {
                        scrollTrigger: {
                            id: 'qled-design',
                            trigger: `${__vdDesign} .vd-sticky-wrap.first`,
                            //markers: true,
                            start: "10% top",
                            end: "bottom 300%",
                            ease: 'Power0.easeNone',
                            scrub: true,
                            // invalidateOnRefresh: true,
                            onEnter: (__this) => {
                                //samsung browser
                                if (__isSamsungBrowser) __this.trigger.querySelector('.vd-txt-wrap.vd-header').classList.add('vd-design-x-scroll');

                                document.querySelector(`${__vdDesign} .vd-qled-design-video`).style.zIndex = -1;
                                document.querySelector(`${__vdDesign} .vd-qled-design-video`).style.opacity = 0;

                                VD_COMMON.VIDEO.PAUSE(__this.trigger, `${__vdDesign} .vd-qled-design-video .vd-video-box .vd-video-cont`, 4);
                            },
                            onLeave: () => {
                                __videoCheck = false;
                            }
                        },
                        duration: 35,
                        autoAlpha: 1,
                        x: VD_DESIGN.CALC.X()
                    }, '+=2'
                );
            }
            
        },
        VD_DESIGN_SCROLL_TEXT: function () {
            gsap.to(`${__vdDesign} .vd-qled-design-end .vd-desc span`, {
                scrollTrigger: {
                    trigger: `${__vdDesign} .vd-sticky-wrap.vd-sticky-copy`,
                    //markers: true,
                    start: "-24% top",
                    end: "center bottom",
                    scrub: 0.5,
                    // invalidateOnRefresh: true,
                },
                autoAlpha: 1
            });
        },
        VD_ACC_SCROLL: {
            STORY: function () {
                gsap.to(`${__vdAcc} .vd-qled-acc-start .vd-txt-wrap.vd-header`, {
                    scrollTrigger: {
                        trigger: __vdAcc,
                        //markers: true,
                        start: '12% top',
                        end: '15% center',
                        scrub: 0.5,
                    },
                    delay: 1,
                    autoAlpha: 0
                });

                let __vdAccTimeline = gsap.timeline({
                    paused: true,
                    scrollTrigger: {
                        id: 'vd-acc-remote',
                        trigger: `${__vdAcc} .vd-remote`,
                        //markers: true,
                        start: "12% top",
                        end: "bottom 125%",
                        scrub: 0.5,
                        // invalidateOnRefresh: true,
                    }
                });

                __vdAccTimeline.to(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`, {
                    delay: 1,
                    duration: 2,
                    top: 0
                }).to(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .vd-remote-img`, {
                    id: 'remote-box1',
                    onUpdate: () => {
                        const __el = document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .vd-remote-img`);
                        const __r = __vdAccTimeline.getById('remote-box1').ratio;
                        const __top = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? VD_ACC.REMOTE.START_TOP(75) : VD_ACC.REMOTE.START_TOP(0);

                        __el.style.top = `${__top * __r}px`;
                    },
                    duration: 2,
                    width: VD_ACC.REMOTE.SIZE()
                }, '-=2').to([`${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box`, `${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box img`], {
                    id: 'remote-change',
                    onStart: () => {
                        document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .original-back-img`).style.zIndex = 5
                        document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .original-back-img`).classList.remove('vd-hide');
                    },
                    onComplete: function () {
                        document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`).classList.remove('vd-show');
                        document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`).classList.add('vd-hide');
                        document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).style.zIndex = 5;
                        document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).classList.add('vd-action');
                        // document.querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-box`).classList.add('vd-show');
                        document.querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`).classList.add('vd-hide');
                    },
                    onUpdate: function (__update) {
                        const __imgBoxHeight = document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box`).offsetHeight;
                        let __r = __vdAccTimeline.getById('remote-change').ratio == 0 ? 0.001 : __vdAccTimeline.getById('remote-change').ratio;
                        let __result = __imgBoxHeight * __r;
                        __result = __imgBoxHeight / __result;

                        document.querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box img`).style.transform = `scaleY(${__result})`;
                    },
                    duration: 2,
                    scaleY: (__i, __el, __a, t) => {
                        if (__el.className.indexOf('remote-back-box') > -1) {
                            return 1 - __i;
                        }
                    }
                }).call(
                    VD_ACC.REMOTE.LEAVE
                ).to(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`, {
                        onStart: () => {
                            document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).classList.remove('vd-action');
                            document.querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`).classList.remove('vd-hide');
                        },
                        duration: 1.2,
                        autoAlpha: 1
                    }, '-=0').to(`${__vdAcc} .vd-remote-charge .vd-charge11`, {
                        autoAlpha: 1
                    }, '-=1').to(`${__vdAcc} .vd-remote-charge .vd-charge10`, {
                        autoAlpha: 1
                    }, '-=0.9').to(`${__vdAcc} .vd-remote-charge .vd-charge09`, {
                        autoAlpha: 1
                    }, '-=0.8').to(`${__vdAcc} .vd-remote-charge .vd-charge08`, {
                        autoAlpha: 1
                    }, '-=0.7').to(`${__vdAcc} .vd-remote-charge .vd-charge07`, {
                        autoAlpha: 1
                    }, '-=0.6').to(`${__vdAcc} .vd-remote-charge .vd-charge06`, {
                        autoAlpha: 1
                    }, '-=0.5').to(`${__vdAcc} .vd-remote-charge .vd-charge05`, {
                        autoAlpha: 1,
                    }, '-=0.4').to(`${__vdAcc} .vd-remote-charge .vd-charge04`, {
                        autoAlpha: 1,
                    }, '-=0.3').to(`${__vdAcc} .vd-remote-charge .vd-charge03`, {
                        autoAlpha: 1,
                    }, '-=0.2').to(`${__vdAcc} .vd-remote-charge .vd-charge02`, {
                        autoAlpha: 1,
                    }, '-=0.1').to(`${__vdAcc} .vd-remote-charge .vd-charge01`, {
                        autoAlpha: 1,
                    }, '-=0');
            },
            END: function () {
                ScrollTrigger.matchMedia({
                    "(min-width: 768px)": function () {
                        gsap.to(`${__vdAcc} .vd-qled-acc-end .vd-desc span`, {
                            scrollTrigger: {
                                trigger: `${__vdAcc} .vd-acc-scroll`,
                                //markers: true,
                                start: "-20% top",
                                end: "center bottom",
                                scrub: 0.5,
                                // invalidateOnRefresh: true,
                            },
                            autoAlpha: 1
                        });
                    },
                    "(max-width: 767px)": function () {
                        gsap.set(`${__vdAcc} .vd-acc-item-list`, { force3D: true, z: 0.1 });
                        gsap.to(`${__vdAcc} .vd-acc-item-list`, {
                            scrollTrigger: {
                                id: 'vd-qled-acc-end',
                                trigger: `${__vdAcc} .vd-acc-scroll`,
                                //markers: true,
                                start: "100px top",
                                end: "bottom 250%",
                                scrub: 0.5,
                                // invalidateOnRefresh: true,
                            },
                            duration: 10,
                            x: VD_ACC.INNER_X(),
                        });

                        gsap.to(`${__vdAcc} .vd-qled-acc-end .vd-desc span`, {
                            scrollTrigger: {
                                trigger: `${__vdAcc} .vd-acc-scroll`,
                                //markers: true,
                                start: "top top",
                                end: "bottom 250%",
                                scrub: 0.5,
                                // invalidateOnRefresh: true,
                            },
                            autoAlpha: 1
                        });
                    },
                });
            },
            init: function () {
                if (!document.querySelector(__vdAcc)) return;

                this.STORY();
                this.END();
            }
        },
        VD_OUTRO_SCROLL: function () {
            if (!document.querySelector(__vdOutro)) return;

            gsap.to(`${__vdOutro} .vd-header-big span`, {
                scrollTrigger: {
                    trigger: __vdOutro,
                    //markers: true,
                    start: '10% top',
                    end: '70% center',
                    scrub: 0.5,
                },
                delay: 1,
                x: 0
            });
        },
        init: function (__type = 'init') {
            this.VD_SMART_SCROLL.init();
            this.VD_QUALITY_SCROLL();
            this.VD_SOUND_SCROLL();
            if (__type === 'init') this.VD_DESIGN_SCROLL();
            if (!__ie && !__low) this.VD_DESIGN_SCROLL_TEXT();
            if (!__ie && !__low) this.VD_ACC_SCROLL.init();
            if (!__ie && !__low) this.VD_OUTRO_SCROLL();
        }
    };

    //compare slide
    const VD_SLIDE = {
        ELEM: {
            __SWIPER: null,
            __COMPARE_WRAP: document.querySelector('.vd-wrap .vd-compare-wrap'),
            __COMPARE_SWIPER: document.querySelector('.vd-wrap .vd-compare-product .compare-product-inner'),
            __COMPARE_ARROW_PREV: document.querySelector('.vd-wrap .vd-compare-product .vd-compare-button .vd-compare-button-prev'),
            __COMPARE_ARROW_NEXT: document.querySelector('.vd-wrap .vd-compare-product .vd-compare-button .vd-compare-button-next'),
            __COMPARE_SWIPER_OPTION: {
                pc: {
                    slidesPerView: 3,
                    watchSlidesVisibility: true,
                    navigation: {
                        nextEl: '.vd-compare-button-next.swiper-button-next',
                        prevEl: '.vd-compare-button-prev.swiper-button-prev',
                    },
                    a11y: {
                        enabled: true,
                        prevSlideMessage: 'Prev Slide',
                        nextSlideMessage: 'Next Slide'
                    },
                    on: {
                        init: function (__swiper) {
                            VD_SLIDE.ACCESSIBILITY.CONTENT();
                        }
                    }
                },
                mobile: {
                    slidesPerView: 2,
                    watchSlidesVisibility: true,
                    freeMode: false,
                    mousewheel: true,
                    navigation: {
                        nextEl: '.vd-compare-button-next.swiper-button-next',
                        prevEl: '.vd-compare-button-prev.swiper-button-prev',
                    },
                    a11y: {
                        enabled: true,
                        prevSlideMessage: 'Prev Slide',
                        nextSlideMessage: 'Next Slide'
                    },
                    on: {
                        init: function (__swiper) {
                            VD_SLIDE.ACCESSIBILITY.CONTENT();
                        }
                    }
                }
            }
        },
        init: function () {
            this.RESET();
            this.SLIDE();
            this.EVENT();
        },
        RESET: function () {
            VD_SLIDE.ELEM.__COMPARE_WRAP.classList.remove('prev-item');
            VD_SLIDE.ELEM.__COMPARE_WRAP.classList.add('next-item');
        },
        SLIDE: function () {
            const __mode = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? 'pc' : 'mobile';

            if (__rtl) VD_SLIDE.ELEM.__COMPARE_SWIPER.setAttribute('dir', 'rtl');
            if (VD_SLIDE.ELEM.__SWIPER != null) VD_SLIDE.ELEM.__SWIPER.destroy();
            VD_SLIDE.ELEM.__SWIPER = null;

            if (VD_SLIDE.ELEM.__SWIPER === null) VD_SLIDE.ELEM.__SWIPER = new Swiper(VD_SLIDE.ELEM.__COMPARE_SWIPER, this.ELEM.__COMPARE_SWIPER_OPTION[__mode]);
        },
        EVENT: function () {
            VD_SLIDE.ELEM.__SWIPER.on('transitionEnd', function () {
                VD_SLIDE.ELEM.__COMPARE_ARROW_PREV.className.indexOf('disabled') > -1 ? VD_SLIDE.ELEM.__COMPARE_WRAP.classList.remove('prev-item') : VD_SLIDE.ELEM.__COMPARE_WRAP.classList.add('prev-item');
                if (VD_SLIDE.ELEM.__COMPARE_ARROW_PREV.className.indexOf('disabled') > -1) {
                    VD_SLIDE.ELEM.__COMPARE_ARROW_NEXT.focus();
                    // setVoiceOverFocus(VD_SLIDE.ELEM.__COMPARE_ARROW_NEXT);
                }

                VD_SLIDE.ELEM.__COMPARE_ARROW_NEXT.className.indexOf('disabled') > -1 ? VD_SLIDE.ELEM.__COMPARE_WRAP.classList.remove('next-item') : VD_SLIDE.ELEM.__COMPARE_WRAP.classList.add('next-item');
                if (VD_SLIDE.ELEM.__COMPARE_ARROW_NEXT.className.indexOf('disabled') > -1) {
                    VD_SLIDE.ELEM.__COMPARE_ARROW_PREV.focus();
                    // setVoiceOverFocus(VD_SLIDE.ELEM.__COMPARE_ARROW_PREV);
                }

                VD_SLIDE.ACCESSIBILITY.CONTENT();
            });

            VD_SLIDE.ACCESSIBILITY.KEYBOARD();
        },
        ACCESSIBILITY: {
            CONTENT: function () {
                const __vdCompareSwiper = VD_SLIDE.ELEM.__COMPARE_SWIPER;
                const __vdCompareItem = __vdCompareSwiper.querySelectorAll('.compare-product-item');

                [].forEach.call(__vdCompareItem, (__itemEl) => {
                    if (__itemEl.className.indexOf('swiper-slide-visible') === -1) {
                        __itemEl.setAttribute('tabindex', -1);
                        __itemEl.setAttribute('aria-hidden', true);
                    } else {
                        __itemEl.removeAttribute('tabindex');
                        __itemEl.removeAttribute('aria-hidden');
                    }
                });
            },
            VISIBLE_ITEM: function () {
                const __vdCompareSwiper = VD_SLIDE.ELEM.__COMPARE_SWIPER;
                const __vdCompareItem = __vdCompareSwiper.querySelectorAll('.compare-product-item');
                let __visibleItemArray = [];

                [].forEach.call(__vdCompareItem, (__itemEl) => {
                    if (__itemEl.className.indexOf('swiper-slide-visible') > -1) __visibleItemArray.push(__itemEl);
                });

                return __visibleItemArray;
            },
            //key accessibility
            KEYBOARD: function () {
                const __vdCompareWrap = VD_SLIDE.ELEM.__COMPARE_WRAP;
                const __vdCompareSwiper = VD_SLIDE.ELEM.__COMPARE_SWIPER;
                const __vdCompareTooltip = __vdCompareWrap.querySelectorAll('.vd-compare-tooltip-btn');
                const __vdCompareItem = __vdCompareSwiper.querySelectorAll('.compare-product-item .compare-product-link');
                const __vdCompareMore = __vdCompareSwiper.querySelectorAll('.compare-product-item .vd-compare-btn');
                const __prevBtn = __vdCompareWrap.querySelector('.vd-compare-button-prev');
                const __nextBtn = __vdCompareWrap.querySelector('.vd-compare-button-next');

                [].forEach.call(__vdCompareItem, (__itemEl) => {
                    __itemEl.addEventListener('keydown', function (e) {
                        const __keyCode = e.key.toLowerCase();
                        const __ePath = e.target.parentNode.parentNode;
                        
                        if (e.shiftKey && __keyCode === 'tab') {
                            if (__ePath.previousElementSibling !== null) {
                                if (__ePath.previousElementSibling.className.indexOf('swiper-slide-visible') === -1 && __prevBtn.className.indexOf('disabled') === -1) {
                                    e.preventDefault();
                                    __prevBtn.focus();
                                }
                            }
                            
                        } else if (__keyCode === 'tab') {
                        }
                    });
                });
                
                [].forEach.call(__vdCompareMore, (__itemEl) => {
                    __itemEl.addEventListener('keydown', function (e) {
                        const __keyCode = e.key.toLowerCase();
                        const __ePath = e.target.parentNode.parentNode;
                        
                        if (e.shiftKey && __keyCode === 'tab') {
                        } else if (__keyCode === 'tab') {
                            if (__ePath.nextElementSibling.className.indexOf('swiper-slide-visible') === -1 && __nextBtn.className.indexOf('disabled') === -1) {
                                e.preventDefault();
                                __nextBtn.focus();
                            }
                        }
                    });
                });

                //tooltip => prev focus
                [].forEach.call(__vdCompareTooltip, (__tooltipEl, __i) => {
                    if (__vdCompareTooltip.length - 1 === __i) {
                        __tooltipEl.addEventListener('keydown', function (e) {
                            const __keyCode = e.key.toLowerCase();

                            if (e.shiftKey && __keyCode === 'tab') {
                            } else if (__keyCode === 'tab' && __prevBtn.className.indexOf('disabled') === -1) {
                                e.preventDefault();
                                __prevBtn.focus();
                            }
                        });
                    }
                });

                //prev keyboard accessbility
                __prevBtn.addEventListener('keydown', function (e) {
                    const __keyCode = e.key.toLowerCase();
                    const __visibleItemFirst = VD_SLIDE.ACCESSIBILITY.VISIBLE_ITEM()[0];

                    if (e.shiftKey && __keyCode === 'tab') {
                        e.preventDefault();
                        [].forEach.call(__vdCompareTooltip, (__tooltipEl, __i) => {
                            if (__vdCompareTooltip.length - 1 === __i) {
                                __tooltipEl.focus();
                            }
                        });
                    } else if (__keyCode === 'tab') {
                        e.preventDefault();
                        __visibleItemFirst.querySelector('.compare-product-link').focus();
                    }
                });

                //next keyboard accessbility
                __nextBtn.addEventListener('keydown', function (e) {
                    const __keyCode = e.key.toLowerCase();
                    const __visibleItemLast = VD_SLIDE.ACCESSIBILITY.VISIBLE_ITEM()[VD_SLIDE.ACCESSIBILITY.VISIBLE_ITEM().length - 1];

                    if (e.shiftKey && __keyCode === 'tab') {
                        e.preventDefault();
                        __visibleItemLast.querySelector('.vd-compare-btn').focus();
                    }
                });
            }
        }
    };
    
    //scroll event
    window.addEventListener('scroll', function (e) {
        VD_COMMON.ELEM.__LAST_KNOWN_SCROLL_POSITION = window.scrollY || window.pageYOffset;
        if (!VD_COMMON.ELEM.__TICKING) {
            window.requestAnimationFrame(function () {
                VD_COMMON.SET.ON_SCROLL(VD_COMMON.ELEM.__LAST_KNOWN_SCROLL_POSITION);
                VD_COMMON.ELEM.__TICKING = false;
            });

            VD_COMMON.ELEM.__TICKING = true;
        }

        if (__ie && __low) return false;
        
        VD_COMMON.ELEM.__BEFORE_TIME_STAMP = e.timeStamp;
        if (VD_COMMON.ELEM.__BEFORE_TIME_STAMP !== VD_COMMON.ELEM.__AFTER_TIME_STAMP) {
            // console.log('VD_COMMON.ELEM.__LAST_KNOWN_SCROLL_POSITION  : ', VD_COMMON.ELEM.__LAST_KNOWN_SCROLL_POSITION);
            if (VD_COMMON.ELEM.__LAST_KNOWN_SCROLL_POSITION === 0 && (VD_COMMON.ELEM.__BEFORE_TIME_STAMP - VD_COMMON.ELEM.__AFTER_TIME_STAMP) < 20) {
                clearTimeout(VD_COMMON.ELEM.__TIMER);
                VD_COMMON.ELEM.__TIMER = setTimeout(() => {
                    let __allTigger = ScrollTrigger.getAll();
                    for (var i = 0; i < __allTigger.length; i++) {
                        if (__allTigger[i].vars.id === 'qled-design') {
                            __allTigger[i].refresh();
                        } else {
                            __allTigger[i].kill();
                        }
                    }
                    __allTigger = null;
                    VD_COMMON.VIDEO.PAUSE(document.querySelector('.vd-wrap'), '.vd-video-cont:not([id*="vd-kv-video"])', 0);
                    VD_SCROLL_TRIGGER.init('scroll');
                }, VD_COMMON.ELEM.__DELAY);
            }

            VD_COMMON.ELEM.__AFTER_TIME_STAMP = VD_COMMON.ELEM.__BEFORE_TIME_STAMP;
        }
    }, false);

    //resize event
    window.addEventListener("resize", function (e) {
        VD_COMMON.ELEM.__WINDOW_WIDTH = window.innerWidth;
        VD_COMMON.ELEM.__WINDOW_HEIGHT = window.innerHeight;
        VD_COMMON.ELEM.__BEFORE_RESIZE_TYPE = VD_COMMON.ELEM.__WINDOW_WIDTH > 767 ? 2 : 1;

        __timing = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;

        clearTimeout(__timer);
        __timer = setTimeout(function () {
            if (__timing > 0) {
                //set Vh
                VD_COMMON.SET.VH();

                //height change
                VD_COMMON.AUTOCHANGE.HEIGHT();
                VD_COMMON.AUTOCHANGE.COMPARE_HEIGHT('resize');
            }
        }, __delay);

        //resize event refresh
        if (VD_COMMON.ELEM.__AFTER_RESIZE_TYPE !== VD_COMMON.ELEM.__BEFORE_RESIZE_TYPE) {
            VD_COMMON.ELEM.__AFTER_RESIZE_TYPE = VD_COMMON.ELEM.__BEFORE_RESIZE_TYPE;
            //console.log('resize!!!');
            clearTimeout(VD_COMMON.ELEM.__TIMER);
            VD_COMMON.ELEM.__TIMER = setTimeout(() => {
                let __allTigger = ScrollTrigger.getAll();
                for (var i = 0; i < __allTigger.length; i++) {
                    __allTigger[i].kill();
                }
                __allTigger = null;
                VD_SCROLL_TRIGGER.init();
            }, VD_COMMON.ELEM.__DELAY);

            //vd - kv video
            VD_KV.VIDEO.PLAYED();

            //compare slider
            VD_SLIDE.init();
        } else {
            if (!__isMobile && VD_COMMON.ELEM.__LOAD) {
                clearTimeout(VD_COMMON.ELEM.__EXCEPTION_TIMER);
                VD_COMMON.ELEM.__EXCEPTION_TIMER = setTimeout(() => {
                    let __designScroll = ScrollTrigger.getById('qled-design');
                    let __accEnd = ScrollTrigger.getById('vd-qled-acc-end');

                    if (typeof __designScroll !== 'undefined') __designScroll.kill();
                    if (typeof __accEnd !== 'undefined') __accEnd.kill();

                    VD_SCROLL_TRIGGER.VD_DESIGN_SCROLL();
                    VD_SCROLL_TRIGGER.VD_ACC_SCROLL.END();
                }, VD_COMMON.ELEM.__DELAY);
            }
        }
    });

    //window load
    window.addEventListener('load', function () {

        //init 실행
        [].forEach.call(document.querySelectorAll('.vd-wrap'), (__vdEl, __i) => {
            __vdEl.style.opacity = 1;
        });

        //samsung browser
        if (__isSamsungBrowser) document.getElementsByTagName('html')[0].classList.add('samsung-browser');

        //low mode check
        VD_COMMON.SET.LOW(((Date.now() - __date) / 1000) % 60);

        //ie or low mode event
        if (__ie || __low) {
            if (__ie) {
                document.getElementsByTagName('html')[0].classList.add('ie');
                if (window.confirm("This content is optimized for Google Chrome, Safari and Microsoft Edge. Certain functions may not work properly on Internet Explorer.")) {
                    window.location = 'microsoft-edge:' + window.location;
                }
            }

            //ie & low - video default
            VD_COMMON.VIDEO.EVENT();

            //kv video play
            VD_COMMON.VIDEO.PLAY(document.querySelector(`${__vdKv}`), `${__vdKv} .vd-video-box .vd-video-cont`, 0);

            //video event
            VD_KV.VIDEO.END();
            VD_QUALITY.VIDEO.END();
            VD_SOUND.VIDEO.END();

            //scroll trigger
            VD_SCROLL_TRIGGER.init();

            //compare slide
            VD_SLIDE.init();
            VD_COMMON.AUTOCHANGE.COMPARE_HEIGHT();

            //compare tooltip
            VD_COMMON.COMPARE_BTN();
            VD_COMMON.TOOLTIP();

            return false;
        }

        //kv video play
        VD_COMMON.VIDEO.PLAY(document.querySelector(`${__vdKv}`), `${__vdKv} .vd-video-box .vd-video-cont`, 0);

        //set Vh
        VD_COMMON.SET.VH();

        //default init
        VD_COMMON.VIDEO.EVENT();
        VD_KV.VIDEO.END();
        VD_SCROLL_TRIGGER.init();
        VD_SMART.ACCESSIBILITY();
        VD_QUALITY.VIDEO.END();
        VD_SOUND.VIDEO.END();
        VD_SLIDE.init();

        //text height change
        VD_COMMON.AUTOCHANGE.HEIGHT();
        VD_COMMON.AUTOCHANGE.COMPARE_HEIGHT();

        //compare tooltip
        VD_COMMON.COMPARE_BTN();
        VD_COMMON.TOOLTIP();

        VD_COMMON.ELEM.__LOAD_CHECK = true; //timeline 전용
        VD_COMMON.ELEM.__LOAD = true; //resize event 전용
    });

})();