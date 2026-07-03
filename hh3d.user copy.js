// ==UserScript==
// @name          HH3D Auto - v2.18
// @namespace     hh3d-tool
// @version       v2.18
// @updateURL     https://raw.githubusercontent.com/Enormit/tool-automation/main/hh3d.user.js
// @downloadURL   https://raw.githubusercontent.com/Enormit/tool-automation/main/hh3d.user.js
// @description   Auto  HH3D
// @author        Cre: [Unknown] - v2.18
// @include       *://hoathinh3d.co*/*
// @exclude       *://hoathinh3d.co/khoang-mach*
// @exclude       *://hoathinh3d.co/luyen-dan-duong*
// @exclude       *://hoathinh3d.co/tu-bao-cac-hh3d*
// @exclude       *://hoathinh3d.co/me-cung*
// @require       https://cdn.jsdelivr.net/npm/sweetalert2@11.26.12/dist/sweetalert2.all.min.js
// @run-at        document-start
// @grant         unsafeWindow
// @connect       raw.githubusercontent.com
// @icon          ðŸ˜‚

// ==/UserScript==
(async function () {
    'use strict';

    const currentPath = window.location.pathname.replace(/\/$/, '');
    const excludes = [
        '/luyen-dan-duong',
        '/tu-bao-cac-hh3d',
        '/me-cung'
    ];
    if (excludes.some(p => currentPath === p || currentPath.startsWith(p + '/'))) {
        console.log('[HH3D Script] Excluded URL, script will not run.');
        return;
    }

    // ===============================================
    // ANTI-BOT FETCH WRAPPER
    // ===============================================
    const originalFetch = window.fetch;
    let lastRequestTime = 0;
    const minRequestGap = 1000; // Ãt nháº¥t 1s giá»¯a cÃ¡c request tá»« script nÃ y

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function antiBotFetch(url, options = {}, retryCount = 0) {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 3000;

        // Äáº£m báº£o khoáº£ng cÃ¡ch tá»‘i thiá»ƒu giá»¯a cÃ¡c request
        const now = Date.now();
        const elapsed = now - lastRequestTime;
        if (elapsed < minRequestGap) {
            const delay = minRequestGap - elapsed + Math.floor(Math.random() * 1000);
            await sleep(delay);
        }
        lastRequestTime = Date.now();

        // ThÃªm trá»… ngáº«u nhiÃªn trÆ°á»›c má»—i request (500ms - 1500ms) Ä‘á»ƒ trÃ¡nh bot detection
        await sleep(500 + Math.floor(Math.random() * 1000));

        try {
            const res = await originalFetch(url, options);

            // Tá»± Ä‘á»™ng retry náº¿u gáº·p lá»—i 429 hoáº·c 503
            if ((res.status === 429 || res.status === 503) && retryCount < MAX_RETRIES) {
                const backoff = RETRY_DELAY * (retryCount + 1) + Math.floor(Math.random() * 2000);
                console.warn(`[Anti-Bot] Gáº·p lá»—i ${res.status}. Thá»­ láº¡i láº§n ${retryCount + 1}/${MAX_RETRIES} sau ${backoff}ms...`);
                await sleep(backoff);
                return antiBotFetch(url, options, retryCount + 1);
            }

            return res;
        } catch (err) {
            if (retryCount < MAX_RETRIES && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
                const backoff = RETRY_DELAY * (retryCount + 1) + Math.floor(Math.random() * 2000);
                console.warn(`[Anti-Bot] Lá»—i máº¡ng. Thá»­ láº¡i láº§n ${retryCount + 1}/${MAX_RETRIES} sau ${backoff}ms...`);
                await sleep(backoff);
                return antiBotFetch(url, options, retryCount + 1);
            }
            throw err;
        }
    }

    const fetch = antiBotFetch;

    console.log('%c[HH3D Script] Táº£i thÃ nh cÃ´ng. Äang khá»Ÿi táº¡o UI tÃ¹y chá»‰nh.',
        'background: #222; color: #bada55; padding: 2px 5px; border-radius: 3px;');

    // ===============================================
    // HÃ€M TIá»†N ÃCH CHUNG
    // ===============================================
    const weburl = window.location.origin.replace(/\/+$/, '') + '/';
    const baseUrl = "https://raw.githubusercontent.com";
    const repoPath = "/shinylee1205/Anonymous";
    const branch = "/refs/heads/main";
    //const WebUrlfileName = "/WebURL.json";
    //const Weblink = baseUrl + repoPath + branch + WebUrlfileName;
    // const Webresponse = await fetch(Weblink);
    // const weburl = (await Webresponse.text()).trim();

    // láº¥y chuá»—i vÃ  bá» khoáº£ng tráº¯ng thá»«a

    const ajaxUrl = weburl + 'wp-content/themes/halimmovies-child/hh3d-ajax.php';
    let accountId = '';
    let questionDataCache = null;
    let isCssInjected = false;
    let userBetCount = 0;
    let userBetStones = [];
    //   loggedIn: '1',
    //   userId: '',
    //   securityToken: '...',
    //   tokenType: 'normal',
    //   pageId: '622123',
    //   adminAjax: 'https://hoathinh3d.co/wp-admin/admin-ajax.php',
    //   themeAjax: 'https://hoathinh3d.co/wp-content/themes/halimmovies-child/hh3d-ajax.php',
    //   restAction: 'https://hoathinh3d.co/wp-json/hh3d/v1/action',
    //   restBase: 'https://hoathinh3d.co/wp-json',
    //   restNonce: 'b756294d06',
    //   act: {
    //   tltmOpen: '1354a8a1',
    //   tltmTimer: '2a2e1a5a',
    //   plOpen: '9e73a16b',
    //   plTimer: '5bb9c745',
    //   plClaim: 'a278453e',
    //   kmList: '64eaa497',
    //   kmEnter: '5d6cbc77',
    //   kmUsers: '0763c2d5',
    //   kmClaim: '7a445af6',
    //   kmBuy: '241d4835',
    //   kmReward: '787974c8',
    //   kmCheck: '7e4560ce',
    //   kmNotif: '165d5ce3',
    //   kmOwner: 'fafb8844',
    //   kmAttack: '660d10f0',
    //   kmLeave: '54608a24',
    //   kmRefresh: '7ea284d4',
    //   bossCheckElem: '72ced4dc',
    //   bossTimer: '75b04751',
    //   bossHistory: 'e1594bb2',
    //   bossBoard: 'aa509745',
    //   bossAttack: '6af45008',
    //   bossGet: '2ad28e41',
    //   bossBalance: '13ecac72',
    //   bossBuy: '9cfa093a',
    //   bossInventory: 'ce5635a7',
    //   bossOpenChest: '61ffdf1a',
    //   bossActivate: '1c31f726',
    //   dtExchange: 'a06553ee',
    //   dtLoad: 'e3e86547',
    //   dtBet: '9edf2e7e',
    //   dtClaim: '5e269d3c',
    //   dtNewbie: 'b8427634',
    //   vdLoad: 'a265eca2',
    //   vdSave: 'ba4ef77c',
    //   lotterySpin: '815b016f',
    //   lotteryHistory: '7b227116'
    //   hdnReward: 'b82f4d91'
    // }
    let cachedSecurityToken = null;
    const fetchedUrlsCache = new Set();
    fetchedUrlsCache.add(window.location.href);
    fetchedUrlsCache.add(window.location.origin + window.location.pathname);
    let hData = null; // Biáº¿n toÃ n cá»¥c lÆ°u trá»¯ hh3dData Ä‘Ã£ Ä‘Æ°á»£c parse vÃ  decode       
    /**
     * Parse vÃ  decode hh3dData tá»« HTML
     * @param {string} html - HTML chá»©a hh3dData máº·c Ä‘á»‹nh
     * @param {string} k - Key Ä‘á»ƒ decode (optional, láº¥y tá»« HTML náº¿u khÃ´ng truyá»n)
     * @param {string} d - Encrypted data (optional, láº¥y tá»« HTML náº¿u khÃ´ng truyá»n)
     * @returns {object} hh3dData hoÃ n chá»‰nh vá»›i thuá»™c tÃ­nh act Ä‘Ã£ Ä‘Æ°á»£c decode
     */
    function parseHh3dData(html, k = null, d = null) {
        try {
            let hh3dData = {};

            // â­ BÆ¯á»šC 1: Láº¥y hh3dData máº·c Ä‘á»‹nh tá»« HTML
            const hh3dMatch = html.match(/var\s+hh3dData\s*=\s*({[^}]+})/);
            if (hh3dMatch) {
                try {
                    hh3dData = JSON.parse(hh3dMatch[1]);
                    //console.log('âœ… ÄÃ£ parse hh3dData máº·c Ä‘á»‹nh:', Object.keys(hh3dData));
                } catch (e) {
                    console.log('âš ï¸ KhÃ´ng thá»ƒ parse hh3dData tá»« HTML:', e.message);
                }
            } else {
                console.log('âš ï¸ KhÃ´ng tÃ¬m tháº¥y hh3dData trong HTML');
            }

            // â­ BÆ¯á»šC 2: Láº¥y k vÃ  d tá»« HTML náº¿u khÃ´ng Ä‘Æ°á»£c truyá»n vÃ o
            if (!k || !d) {
                // TÃ¬m script chá»©a k vÃ  d
                // Pattern: var k="...",d="...";
                const scriptMatch = html.match(/var\s+k\s*=\s*"([^"]+)"\s*,\s*d\s*=\s*"([^"]+)"/);
                if (scriptMatch) {
                    k = k || scriptMatch[1];
                    d = d || scriptMatch[2];
                    // console.log('âœ… ÄÃ£ láº¥y k vÃ  d tá»« HTML');
                } else {
                    // console.log('âš ï¸ KhÃ´ng tÃ¬m tháº¥y k vÃ  d trong HTML');
                    return hh3dData; // Tráº£ vá» hh3dData máº·c Ä‘á»‹nh
                }
            }

            // â­ BÆ¯á»šC 3: Decode encrypted data
            if (k && d) {
                try {
                    // Base64 decode (normalize URL-safe base64 â†’ standard base64, then add padding)
                    const b64 = d.replace(/\\/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
                    const b64Padded = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '=');
                    // Debug: log invalid chars
                    const invalidChars = b64Padded.replace(/[A-Za-z0-9+/=]/g, '');
                    // if (invalidChars.length > 0) {
                    //   console.log('âš ï¸ d cÃ³ kÃ½ tá»± khÃ´ng há»£p lá»‡ (charCode):', [...invalidChars].map(c => c.charCodeAt(0)));
                    // }
                    // console.log('ðŸ” d (first 80):', d.substring(0, 80), '| len:', d.length);
                    const decodedBytes = atob(b64Padded).split('').map(c => c.charCodeAt(0));

                    // XOR vá»›i key
                    let result = '';
                    for (let i = 0; i < decodedBytes.length; i++) {
                        result += String.fromCharCode(
                            decodedBytes[i] ^ k.charCodeAt(i % k.length)
                        );
                    }

                    // Parse JSON
                    const actData = JSON.parse(result);
                    hh3dData.act = actData;

                    // console.log('âœ… ÄÃ£ decode vÃ  gÃ¡n hh3dData.act thÃ nh cÃ´ng');
                } catch (e) {
                    console.log('âŒ Lá»—i khi decode data:', e.message);
                }
            }
            const m = html.match(/var\s+boss_attack_token\s*=\s*['"]([a-f0-9]+)['"]/i);
            hh3dData.attackToken = m ? m[1] : null; // dÃ nh cho hoang vá»±c

            return hh3dData;

        } catch (error) {
            console.log('âŒ Lá»—i trong parseHh3dData:', error.message);
            return {};
        }
    }


    // Chá»‰ override khi Ä‘ang á»Ÿ trang KhoÃ¡ng Máº¡ch
    if (location.pathname.includes('khoang-mach') || location.href.includes('khoang-mach')) {
        const fastAttack = localStorage.getItem('khoangmach_fast_attack') === 'true';
        if (fastAttack) {
            const NEW_DELAY = 50;
            const originalSetInterval = window.setInterval;
            window.setInterval = function (callback, delay, ...args) {
                let actualDelay = delay;
                if (typeof callback === 'function' && callback.toString().includes('countdown--') &&
                    callback.toString().includes('clearInterval(countdownInterval)') &&
                    callback.toString().includes('executeAttack')) {
                    actualDelay = NEW_DELAY
                    showNotification('KhÃ´ng Ä‘Æ°á»£c Ä‘Ã¡nh Ä‘áº¿n khi háº¿t thÃ´ng bÃ¡o nÃ y', 'error', 5500);
                }
                return originalSetInterval(callback, actualDelay, ...args);
            };
        }
    }
    // Cáº¥u trÃºc menu
    // âš ï¸ CHÃš Ã: Táº¥t cáº£ cÃ¡c task buttons Ä‘Ã£ Ä‘Æ°á»£c chuyá»ƒn sang Quest List
    // Chá»‰ giá»¯ láº¡i Autorun controls trong menu nÃ y
    const LINK_GROUPS = []; // Autorun Ä‘Ã£ Ä‘Æ°á»£c chuyá»ƒn lÃªn xu-info

    function addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // ===== KhoÃ¡ng Máº¡ch-only UI addons =====
    addStyle(`
       .km-punch-btn{
         background:#e74c3c;color:#fff;border:none;
         width:28px;height:28px;border-radius:6px;
         cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
         font-weight:700;
       }
       .km-punch-btn:hover{filter:brightness(1.05);}
     `);


    async function speak(textVN, textEN) {
        console.log("[TTS] Báº¯t Ä‘áº§u khá»Ÿi táº¡o speak()");
        await new Promise(r => setTimeout(r, 300)); // Ä‘á»£i há»‡ thá»‘ng load voice
        let voices = speechSynthesis.getVoices();
        if (!voices.length) {
            console.log("[TTS] ChÆ°a cÃ³ voice, chá» event voiceschanged...");
            await new Promise(res => {
                const onChange = () => {
                    voices = speechSynthesis.getVoices();
                    if (voices.length) {
                        speechSynthesis.removeEventListener("voiceschanged", onChange);
                        res();
                    }
                };
                speechSynthesis.addEventListener("voiceschanged", onChange);
            });
        }

        voices = speechSynthesis.getVoices();
        console.log(`[TTS] Tá»•ng sá»‘ voice: ${voices.length}`);
        voices.forEach(v => console.log(`[VOICE] ${v.name} | ${v.lang}`));

        let voice = voices.find(v => /vi[-_]?VN/i.test(v.lang));
        let lang = "vi-VN";
        let text = textVN;

        if (!voice) {
            console.log("[TTS] KhÃ´ng cÃ³ voice tiáº¿ng Viá»‡t, dÃ¹ng tiáº¿ng Anh");
            voice = voices.find(v => /en[-_]?US/i.test(v.lang)) || voices[0];
            lang = "en-US";
            text = textEN;
        }

        if (!voice) return console.error("[TTS] âŒ KhÃ´ng tÃ¬m tháº¥y voice kháº£ dá»¥ng");

        const u = new SpeechSynthesisUtterance(text);
        u.voice = voice;
        u.lang = lang;
        u.rate = 0.8; // tá»‘c Ä‘á»™ nÃ³i
        u.onstart = () => console.log(`[TTS] â–¶ï¸ Báº¯t Ä‘áº§u Ä‘á»c (${lang}): ${text}`);
        u.onend = () => console.log("[TTS] âœ… HoÃ n táº¥t Ä‘á»c");
        u.onerror = e => console.error("[TTS] âŒ Lá»—i:", e.error);

        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    }

    /**
    * Láº¥y securityToken báº±ng cÃ¡ch fetch má»™t URL (náº¿u cÃ³)
    * hoáº·c quÃ©t HTML cá»§a trang hiá»‡n táº¡i (náº¿u khÃ´ng cÃ³ URL).
    *
    * @param {string} [url] - (TÃ¹y chá»n) URL Ä‘á»ƒ fetch.
    * @returns {Promise<string|null>} - Má»™t Promise sáº½ resolve vá»›i token, hoáº·c null náº¿u tháº¥t báº¡i.
    */

    async function getSecurityToken(url) {
        const logPrefix = "[SecurityTokenFetcher]";
        const targetUrl = url ? url.trim() : null;

        if (cachedSecurityToken && (!targetUrl || fetchedUrlsCache.has(targetUrl))) {
            console.log(`${logPrefix} âš¡ Sá»­ dá»¥ng Security Token Ä‘Ã£ cache: ${cachedSecurityToken.substring(0, 8)}... (URL: ${targetUrl || 'trang hiá»‡n táº¡i'})`);
            return cachedSecurityToken;
        }

        console.log(`${logPrefix} â–¶ï¸ Báº¯t Ä‘áº§u láº¥y security token tá»« ${targetUrl || 'trang hiá»‡n táº¡i'}...`);
        let htmlContent = null;

        try {
            // 1. Láº¥y ná»™i dung HTML (Fetch hoáº·c quÃ©t trang hiá»‡n táº¡i)
            if (targetUrl) {
                const response = await fetch(targetUrl);
                if (!response.ok) {
                    console.warn(`${logPrefix} âš ï¸ Fetch bá»‹ cháº·n (${response.status}) cho URL: ${targetUrl}. Thá»­ dÃ¹ng token tá»« cache/hData...`);
                    // Fallback 1: dÃ¹ng cachedSecurityToken náº¿u cÃ³
                    if (cachedSecurityToken) {
                        console.log(`${logPrefix} â™»ï¸ DÃ¹ng cachedSecurityToken: ${cachedSecurityToken.substring(0, 8)}...`);
                        return cachedSecurityToken;
                    }
                    // Fallback 2: dÃ¹ng token tá»« hData (Ä‘Ã£ parse tá»« láº§n load trang trÆ°á»›c)
                    if (hData && hData.securityToken) {
                        console.log(`${logPrefix} â™»ï¸ DÃ¹ng hData.securityToken: ${hData.securityToken.substring(0, 8)}...`);
                        cachedSecurityToken = hData.securityToken;
                        return hData.securityToken;
                    }
                    // Fallback 3: scan trang hiá»‡n táº¡i
                    const currentHtml = document.documentElement.outerHTML;
                    const fallbackMatch = currentHtml.match(/"securityToken"\s*:\s*"([^"]+)"/);
                    if (fallbackMatch && fallbackMatch[1]) {
                        console.log(`${logPrefix} â™»ï¸ Láº¥y token tá»« trang hiá»‡n táº¡i: ${fallbackMatch[1].substring(0, 8)}...`);
                        cachedSecurityToken = fallbackMatch[1];
                        return fallbackMatch[1];
                    }
                    return null;
                }
                htmlContent = await response.text();
            } else {
                htmlContent = document.documentElement.outerHTML;
            }
            hData = parseHh3dData(htmlContent); // Cáº­p nháº­t hh3dData tá»« html má»›i láº¥y Ä‘Æ°á»£c            

            // 2. QuÃ©t Regex láº¥y Token má»›i
            const regex = /"securityToken"\s*:\s*"([^"]+)"/;
            const match = htmlContent.match(regex);

            if (match && match[1]) {
                const token = match[1];
                cachedSecurityToken = token;
                if (targetUrl) {
                    fetchedUrlsCache.add(targetUrl);
                }

                // ðŸ”¥ LOGIC Má»šI: Kiá»ƒm tra xem URL yÃªu cáº§u cÃ³ pháº£i lÃ  trang hiá»‡n táº¡i khÃ´ng
                // Náº¿u khÃ´ng truyá»n URL (!url) -> Máº·c Ä‘á»‹nh lÃ  trang hiá»‡n táº¡i
                // Náº¿u cÃ³ URL -> Pháº£i trÃ¹ng khá»›p tuyá»‡t Ä‘á»‘i vá»›i window.location.href
                const isCurrentPage = !targetUrl || (targetUrl === window.location.href);

                if (isCurrentPage) {
                    console.log(`${logPrefix} ðŸŽ¯ URL trÃ¹ng khá»›p trang hiá»‡n táº¡i. Tiáº¿n hÃ nh cáº­p nháº­t Global State...`);

                    // ============================================================
                    // ðŸ”¥ Sá»¬A Lá»–I: Cáº¬P NHáº¬T XUYÃŠN SANDBOX
                    // ============================================================

                    // CÃ¡ch 1: DÃ¹ng unsafeWindow (CÃ¡ch chuáº©n cá»§a Tampermonkey)
                    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.hh3dData) {
                        unsafeWindow.hh3dData.securityToken = token;
                        console.log(`${logPrefix} ðŸ”“ ÄÃ£ cáº­p nháº­t hh3dData thÃ´ng qua unsafeWindow.`);
                    }
                    // CÃ¡ch 2: Fallback náº¿u khÃ´ng cÃ³ unsafeWindow
                    else if (typeof window.hh3dData !== 'undefined') {
                        window.hh3dData.securityToken = token;
                        console.log(`${logPrefix} âš ï¸ ÄÃ£ cáº­p nháº­t hh3dData qua window thÆ°á»ng.`);
                    }

                    // CÃ¡ch 3: "TiÃªm thuá»‘c" trá»±c tiáº¿p
                    try {
                        const script = document.createElement('script');
                        script.textContent = `
                            try {
                                if (typeof hh3dData !== 'undefined') {
                                     hh3dData.securityToken = "${token}";
                                     console.log('âœ… [Inject] Token Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t tá»« bÃªn trong trang web.');
                                }
                            } catch(e) {}
                        `;
                        (document.head || document.body || document.documentElement).appendChild(script);
                        script.remove();
                    } catch (injectErr) {
                        console.warn(`${logPrefix} Lá»—i tiÃªm script:`, injectErr);
                    }
                    // ============================================================
                } else {
                    //  - Token chá»‰ Ä‘Æ°á»£c tráº£ vá» cho hÃ m gá»i, khÃ´ng áº£nh hÆ°á»Ÿng trang hiá»‡n táº¡i
                    console.log(`${logPrefix} ðŸ›‘ Token láº¥y tá»« URL khÃ¡c (${targetUrl}).`);
                }

                return token;
            }
            return null;

        } catch (e) {
            console.error(`${logPrefix} âŒ Lá»—i:`, e);
            return null;
        }
    }

    //Láº¥y Nonce
    async function getNonce() {
        if (typeof restNonce !== 'undefined' && restNonce) {
            return restNonce;
        }

        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            let match = script.innerHTML.match(/"restNonce"\s*:\s*"([a-f0-9]+)"/);
            if (match) {
                return match[1];
            } else {
                match = script.innerHTML.match(/"nonce"\s*:\s*"([a-f0-9]+)"/);
                if (match) {
                    return match[1];
                }
            }
        }

        try {
            const nonce = await getSecurityNonce(weburl + '?t', "restNonce");
            if (nonce) {
                return nonce;
            }
        } catch (error) {
            console.error("Failed to get security nonce", error);
        }

        return null;
    }


    /**
    * Láº¥y security nonce má»™t cÃ¡ch chung chung tá»« má»™t URL.
    *
    * @param {string} url - URL cá»§a trang web cáº§n láº¥y nonce.
    * @param {RegExp} regex - Biá»ƒu thá»©c chÃ­nh quy (regex) Ä‘á»ƒ tÃ¬m vÃ  trÃ­ch xuáº¥t nonce.
    * @returns {Promise<string|null>} Tráº£ vá» security nonce náº¿u tÃ¬m tháº¥y, ngÆ°á»£c láº¡i tráº£ vá» null.
    */


    async function getSecurityNonce(url, actionName, maxRetries = 3, retryCount = 0) {
        // Sá»­ dá»¥ng má»™t tiá»n tá»‘ log cá»‘ Ä‘á»‹nh cho Ä‘Æ¡n giáº£n
        const logPrefix = '[HH3D Auto]';

        console.log(`${logPrefix} â–¶ï¸ Äang táº£i trang tá»« ${url} Ä‘á»ƒ láº¥y security cho action: ${actionName}...`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Kiá»ƒm tra lá»—i 503 (Service Unavailable) hoáº·c 429 (Too Many Requests)
                if ((response.status === 503 || response.status === 429) && retryCount < maxRetries) {
                    const waitTime = 2000 + (retryCount * 1000); // 2s, 3s, 4s...
                    console.warn(`${logPrefix} âš ï¸ Lá»—i ${response.status}, Ä‘ang thá»­ láº¡i sau ${waitTime / 1000}s... (láº§n ${retryCount + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return getSecurityNonce(url, actionName, maxRetries, retryCount + 1);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();

            hData = parseHh3dData(html); // Cáº­p nháº­t hh3dData tá»« html 

            // ðŸ”¥ Cáº¬P NHáº¬T: TrÃ­ch xuáº¥t vÃ  cáº­p nháº­t securityToken náº¿u cÃ³ trong HTML
            const tokenRegex = /"securityToken"\s*:\s*"([^"]+)"/;
            const tokenMatch = html.match(tokenRegex);
            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];
                console.log(`${logPrefix} ðŸ”‘ PhÃ¡t hiá»‡n securityToken má»›i trong HTML, Ä‘ang cáº­p nháº­t...`);
                cachedSecurityToken = token;

                // Kiá»ƒm tra URL cÃ³ pháº£i trang hiá»‡n táº¡i khÃ´ng
                const isCurrentPage = window.location.href.includes(url);

                if (isCurrentPage) {
                    // Cáº­p nháº­t xuyÃªn sandbox giá»‘ng getSecurityToken
                    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.hh3dData) {
                        unsafeWindow.hh3dData.securityToken = token;
                        console.log(`${logPrefix} ðŸ”“ ÄÃ£ cáº­p nháº­t hh3dData.securityToken thÃ´ng qua unsafeWindow.`);
                    } else if (typeof window.hh3dData !== 'undefined') {
                        window.hh3dData.securityToken = token;
                        console.log(`${logPrefix} âš ï¸ ÄÃ£ cáº­p nháº­t hh3dData.securityToken qua window thÆ°á»ng.`);
                    } else {
                        // TiÃªm script trá»±c tiáº¿p
                        try {
                            const script = document.createElement('script');
                            script.textContent = `
                                try {
                                    if (typeof hh3dData !== 'undefined') {
                                        hh3dData.securityToken = "${token}";
                                        console.log('âœ… [Inject] Token Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t tá»« getSecurityNonce.');
                                    }
                                } catch(e) {}
                            `;
                            (document.head || document.body || document.documentElement).appendChild(script);
                            script.remove();
                        } catch (injectErr) {
                            console.warn(`${logPrefix} Lá»—i tiÃªm script:`, injectErr);
                        }
                    }
                }
            }

            // ðŸ†• Sá»­ dá»¥ng extractActionTokens Ä‘á»ƒ láº¥y táº¥t cáº£ action/security pairs
            console.log(`${logPrefix} ðŸ” Báº¯t Ä‘áº§u tÃ¬m kiáº¿m security cho action "${actionName}"...`);
            const actionTokens = extractActionTokens(html);
            // console.log(`${logPrefix} ðŸ“‹ ÄÃ£ extract Ä‘Æ°á»£c ${Object.keys(actionTokens).length} actions`);

            // TÃ¬m security cho action Ä‘Æ°á»£c yÃªu cáº§u
            let nonce = actionTokens[actionName];
            if (url.includes('linh-thach')) {
                nonce = extractRedeemNonce(html);
            }
            if (nonce) {
                console.log(`${logPrefix} âœ… Láº¥y Ä‘Æ°á»£c security cho action "${actionName}": ${nonce}`);
                return nonce;
            } else {
                console.error(`${logPrefix} âŒ KhÃ´ng tÃ¬m tháº¥y security cho action: ${actionName}`);
                console.log(`${logPrefix} ðŸ“‹ CÃ¡c action cÃ³ sáºµn:`, Object.keys(actionTokens).join(', '));
                return null;
            }
        } catch (e) {
            // Kiá»ƒm tra náº¿u lÃ  lá»—i HTTP 503/429 vÃ  cÃ²n lÆ°á»£t retry
            if (e.message && (e.message.includes('503') || e.message.includes('429')) && retryCount < maxRetries) {
                const waitTime = 2000 + (retryCount * 1000);
                console.warn(`${logPrefix} âš ï¸ ${e.message}, Ä‘ang thá»­ láº¡i sau ${waitTime / 1000}s... (láº§n ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return getSecurityNonce(url, actionName, maxRetries, retryCount + 1);
            }

            console.error(`${logPrefix} âŒ Lá»—i khi táº£i trang hoáº·c trÃ­ch xuáº¥t nonce:`, e);
            return null;
        }
    }

    // Láº¥y ID tÃ i khoáº£n
    async function getAccountId() {

        const html = document.documentElement.innerHTML;
        const regexList = [
            /"user_id"\s*:\s*"(\d+)"/,       // "user_id":"123"
            /current_user_id\s*:\s*'(\d+)'/  // current_user_id: '123'
        ];

        // --- Thá»­ láº¥y trá»±c tiáº¿p tá»« DOM ---
        for (const regex of regexList) {
            const match = html.match(regex);
            if (match) {
                console.log('Láº¥y account ID trá»±c tiáº¿p tá»« html');
                localStorage.setItem('hh3d_account_id', match[1]);
                return match[1];
            }
        }

        // --- Fallback: thá»­ fetch trang chÃ­nh vá»›i tá»«ng regex ---
        for (const regex of regexList) {
            const id = await getSecurityNonce(weburl + '?t', regex);
            if (id) {
                console.log('Láº¥y account ID qua fetch fallback');
                localStorage.setItem('hh3d_account_id', id);
                return id;
            }
        }

        return null;
    }


    // LÆ°u trá»¯ tráº¡ng thÃ¡i cÃ¡c hoáº¡t Ä‘á»™ng Ä‘Ã£ thá»±c hiá»‡n
    class TaskTracker {
        constructor(storageKey = 'dailyTasks') {
            this.storageKey = storageKey;
            this.data = this.loadData();
            this.dothachTimeoutId = null;
        }
        // Táº£i dá»¯ liá»‡u tá»« localStorage
        loadData() {
            const storedData = localStorage.getItem(this.storageKey);
            return storedData ? JSON.parse(storedData) : {};
        }
        // LÆ°u dá»¯ liá»‡u vÃ o localStorage
        saveData() {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        }
        /** Láº¥y thÃ´ng tin cá»§a má»™t tÃ i khoáº£n cá»¥ thá»ƒ vÃ  tá»± Ä‘á»™ng cáº­p nháº­t náº¿u sang ngÃ y má»›i
                * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
                * @return {object} Tráº£ vá» dá»¯ liá»‡u tÃ i khoáº£n, bao gá»“m cÃ¡c nhiá»‡m vá»¥ vÃ  tráº¡ng thÃ¡i.
                * Náº¿u tÃ i khoáº£n chÆ°a cÃ³ dá»¯ liá»‡u, nÃ³ sáº½ tá»± Ä‘á»™ng táº¡o má»›i vÃ  lÆ°u vÃ o localStorage.
                * Náº¿u ngÃ y hÃ´m nay Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t, nÃ³ sáº½ reset cÃ¡c nhiá»‡m vá»¥ cho ngÃ y má»›i.
                * Náº¿u Ä‘Ã£ Ä‘áº¿n giá» chuyá»ƒn sang lÆ°á»£t 2 cá»§a Äá»• Tháº¡ch, nÃ³ sáº½ tá»± Ä‘á»™ng chuyá»ƒn tráº¡ng thÃ¡i.
            */
        getAccountData(accountId) {
            if (!this.data[accountId]) {
                this.data[accountId] = {};
                this.saveData();
            }

            const accountData = this.data[accountId];
            const today = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

            // Danh sÃ¡ch táº¥t cáº£ nhiá»‡m vá»¥ máº·c Ä‘á»‹nh
            const defaultTasks = {
                diemdanh: { done: false },
                thiluyen: { done: false, nextTime: null },
                bicanh: { done: false, nextTime: null },
                phucloi: { done: false, nextTime: null },

                hoangvuc: { done: false, nextTime: null },
                dothach: { betplaced: false, reward_claimed: false, turn: 1 },
                // luanvo: { battle_joined: false, auto_accept: false, done: false },
                khoangmach: { done: false, nextTime: null },
                tienduyen: { last_check: null, done: false },
                hoatdongngay: { done: false },
                luyenDan: { done: false, nextTime: null }
            };

            if (accountData.lastUpdatedDate !== today) {
                console.log(`[TaskTracker] Cáº­p nháº­t dá»¯ liá»‡u ngÃ y má»›i cho tÃ i khoáº£n: ${accountId}`);
                accountData.lastUpdatedDate = today;
                // Reset toÃ n bá»™ nhiá»‡m vá»¥
                Object.assign(accountData, defaultTasks);
                this.saveData();
            } else {
                // NgÃ y chÆ°a Ä‘á»•i â†’ merge cÃ¡c nhiá»‡m vá»¥ má»›i
                let updated = false;
                for (const taskName in defaultTasks) {
                    if (!accountData[taskName]) {
                        accountData[taskName] = defaultTasks[taskName];
                        updated = true;
                    }
                }
                if (updated) this.saveData();
            }
            // Xá»­ lÃ½ Äá»• Tháº¡ch lÆ°á»£t 2
            const now = new Date();
            const hourInVN = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour: 'numeric', hour12: false }), 10);
            if (accountData.dothach.turn === 1 && hourInVN >= 16) {
                accountData.dothach = {
                    betplaced: false,
                    reward_claimed: false,
                    turn: 2,
                };
                this.saveData();
            }
            // LÃªn lá»‹ch tá»± Ä‘á»™ng reset vÃ o 16h hÃ ng ngÃ y náº¿u chÆ°a cÃ³ timer
            if (!this.dothachTimeoutId) {
                const now = new Date();

                // Táº¡o danh sÃ¡ch má»‘c reset theo thá»© tá»±
                const resetTimes = [
                    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 1, 0, 0), // 16h hÃ´m nay
                    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0, 0) // 01h sÃ¡ng mai
                ];

                // TÃ¬m má»‘c reset gáº§n nháº¥t so vá»›i hiá»‡n táº¡i
                let nextResetTime = resetTimes.find(t => t > now);
                if (!nextResetTime) {
                    // Náº¿u Ä‘Ã£ qua táº¥t cáº£ má»‘c â†’ chá»n 16h ngÃ y mai
                    nextResetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0, 0, 0);
                }

                const timeToWait = nextResetTime - now;

                console.log(`[TaskTracker] Reset sau ${Math.floor(timeToWait / 1000 / 60)} phÃºt.`);

                this.dothachTimeoutId = setTimeout(() => { this.getAccountData(accountId); }, timeToWait);
            }

            return accountData;
        }
        /**
        * Cáº­p nháº­t má»™t thuá»™c tÃ­nh cá»¥ thá»ƒ cá»§a má»™t nhiá»‡m vá»¥.
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @param {string} taskName - TÃªn nhiá»‡m vá»¥ (vÃ­ dá»¥: 'dothach').
        * @param {string} key - TÃªn thuá»™c tÃ­nh cáº§n cáº­p nháº­t (vÃ­ dá»¥: 'betplaced').
        * @param {*} value - GiÃ¡ trá»‹ má»›i cho thuá»™c tÃ­nh.
        */
        updateTask(accountId, taskName, key, value) {
            const accountData = this.getAccountData(accountId);
            if (accountData[taskName]) {
                accountData[taskName][key] = value;
                this.saveData();
            } else {
                console.error(`[TaskTracker] Nhiá»‡m vá»¥ "${taskName}" khÃ´ng tá»“n táº¡i cho tÃ i khoáº£n "${accountId}"`);
            }
        }
        /** Láº¥y thÃ´ng tin task
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @param {string} taskName - TÃªn nhiá»‡m vá»¥: 'diemdanh', 'thiluyen', 'bicanh', 'phucloi', 'hoangvuc'.
        * @return {object|null} Tráº£ vá» Ä‘á»‘i tÆ°á»£ng nhiá»‡m vá»¥ hoáº·c null náº¿u khÃ´ng tá»“n táº¡i.
        * VÃ­ dá»¥:  getTaskStatus('123', 'luanvo').battle_joined => 'true'
        */
        getTaskStatus(accountId, taskName) {
            const accountData = this.getAccountData(accountId);
            return accountData[taskName] || null;
        }
        /**
        * Kiá»ƒm tra xem má»™t nhiá»‡m vá»¥ Ä‘Ã£ hoÃ n thÃ nh hay chÆ°a
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @param {string} taskName - TÃªn nhiá»‡m vá»¥: 'diemdanh', 'thiluyen', 'bicanh', 'phucloi', 'hoangvuc'.
        * @return {boolean} Tráº£ vá» `true` náº¿u nhiá»‡m vá»¥ Ä‘Ã£ hoÃ n thÃ nh, ngÆ°á»£c láº¡i lÃ  `false`.
        */
        isTaskDone(accountId, taskName) {
            const accountData = this.getAccountData(accountId);
            return accountData[taskName] && accountData[taskName].done;
        }
        /**
        * ÄÃ¡nh dáº¥u má»™t nhiá»‡m vá»¥ lÃ  Ä‘Ã£ hoÃ n thÃ nh
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @param {string} taskName - TÃªn nhiá»‡m vá»¥: 'diemdanh', 'thiluyen', 'bicanh', 'phucloi', 'hoangvuc'.
        * @return {void}
        */
        markTaskDone(accountId, taskName) {
            const accountData = this.getAccountData(accountId);
            if (accountData[taskName]) {
                accountData[taskName].done = true;
                this.saveData();
            } else {
                console.error(`[TaskTracker] Nhiá»‡m vá»¥ "${taskName}" khÃ´ng tá»“n táº¡i cho tÃ i khoáº£n "${accountId}"`);
            }
        }
        /**
        * Bá» Ä‘Ã¡nh dáº¥u má»™t nhiá»‡m vá»¥ Ä‘Ã£ hoÃ n thÃ nh
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @param {string} taskName - TÃªn nhiá»‡m vá»¥.
        * @return {void}
        */
        unmarkTaskDone(accountId, taskName) {
            const accountData = this.getAccountData(accountId);
            if (accountData[taskName]) {
                accountData[taskName].done = false;
                this.saveData();
            } else {
                console.error(`[TaskTracker] Nhiá»‡m vá»¥ "${taskName}" khÃ´ng tá»“n táº¡i cho tÃ i khoáº£n "${accountId}"`);
            }
        }
        /**
        * Reset táº¥t cáº£ tráº¡ng thÃ¡i hoÃ n thÃ nh cá»§a cÃ¡c nhiá»‡m vá»¥
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @return {void}
        */
        resetAllTasks(accountId) {
            const accountData = this.getAccountData(accountId);
            const taskNames = ['diemdanh', 'thiluyen', 'bicanh', 'phucloi', 'hoangvuc', 'khoangmach', 'hoatdongngay', 'tienduyen', 'luyenDan'];
            let resetCount = 0;
            taskNames.forEach(taskName => {
                if (accountData[taskName] && accountData[taskName].done) {
                    accountData[taskName].done = false;
                    resetCount++;
                }
            });
            // Reset Ä‘á»• tháº¡ch vá» tráº¡ng thÃ¡i ban Ä‘áº§u
            if (accountData.dothach) {
                accountData.dothach.betplaced = false;
                accountData.dothach.reward_claimed = false;
            }
            this.saveData();
            console.log(`[TaskTracker] ÄÃ£ reset ${resetCount} nhiá»‡m vá»¥ cho tÃ i khoáº£n ${accountId}`);
            return resetCount;
        }
        /**
        * Äiá»u chá»‰nh thá»i gian cá»§a má»™t nhiá»‡m vá»¥
        * @param {string} accountId - ID cá»§a tÃ i khoáº£n.
        * @param {string} taskName - TÃªn nhiá»‡m vá»¥: 'thiluyen', 'bicanh', 'phucloi', 'hoangvuc'.
        * @param {string} newTime - Thá»i gian má»›i theo Ä‘á»‹nh dáº¡ng timestamp.
        * @return {void}
        */
        adjustTaskTime(accountId, taskName, newTime) {
            //console.log(`[TaskTracker] adjustTaskTime called for ${taskName}, newTime=`, newTime, "stack=", new Error().stack);
            const accountData = this.getAccountData(accountId);
            if (accountData[taskName]) {
                accountData[taskName].nextTime = newTime;
                this.saveData();
            } else {
                console.error(`[TaskTracker] Nhiá»‡m vá»¥ "${taskName}" khÃ´ng tá»“n táº¡i cho tÃ i khoáº£n "${accountId}"`);
            }
        }

        getNextTime(accountId, taskName) {
            const accountData = this.getAccountData(accountId);
            const ts = accountData[taskName]?.nextTime;
            if (!ts || ts === "null") {
                return null; // chÆ°a cÃ³ thá»i gian
            }
            const date = new Date(Number(ts));
            return isNaN(date.getTime()) ? null : date;
        }
        /** Return dáº¡ng Date */
        getLastCheckTienDuyen(accountId) {
            const accountData = this.getTaskStatus(accountId, 'tienduyen');
            const timestamp = Number(accountData.last_check); // Chuyá»ƒn chuá»—i miligiÃ¢y thÃ nh sá»‘
            return new Date(timestamp); // Táº¡o Ä‘á»‘i tÆ°á»£ng Date
        }
        /** Láº¥y cáº£ timstamp dáº¡ng string hay Date Ä‘á»u Ä‘Æ°á»£c */
        setLastCheckTienDuyen(accountId, timestamp) {
            let finalTimestamp = timestamp; // Khá»Ÿi táº¡o biáº¿n lÆ°u giÃ¡ trá»‹ cuá»‘i cÃ¹ng
            // Kiá»ƒm tra náº¿u timestamp lÃ  má»™t Ä‘á»‘i tÆ°á»£ng Date
            if (timestamp instanceof Date) {
                finalTimestamp = timestamp.getTime(); // Láº¥y giÃ¡ trá»‹ timestamp dáº¡ng sá»‘
            } else if (typeof timestamp === 'string') {
                finalTimestamp = Number(timestamp); // Chuyá»ƒn chuá»—i thÃ nh sá»‘
            }
            this.updateTask(accountId, 'tienduyen', 'last_check', finalTimestamp);
        }
    }
    /**
            * Cá»™ng thÃªm phÃºt vÃ  giÃ¢y vÃ o thá»i Ä‘iá»ƒm hiá»‡n táº¡i vÃ  tráº£ vá» má»™t Ä‘á»‘i tÆ°á»£ng Date má»›i.
            * @param {string} timeString - Chuá»—i thá»i gian Ä‘á»‹nh dáº¡ng "mm:ss" (phÃºt:giÃ¢y).
            * @returns {Date} - String dáº¡ng timestamp cho thá»i gian Ä‘Æ°á»£c cá»™ng thÃªm
            */

    function timePlus(timeString) {
        const now = new Date();
        const [minutes, seconds] = timeString.split(':').map(Number);
        const millisecondsToAdd = (minutes * 60 + seconds) * 1000;
        return now.getTime() + millisecondsToAdd;
    }

    // ===============================================
    // Äá»ŠNH NGHÄ¨A CÃC NHIá»†M Vá»¤ / QUEST CONFIGURATION
    // ===============================================
    const QUEST_CONFIG = [
        {
            taskId: 'diemdanh',
            taskName: 'Äiá»ƒm Danh, Táº¿ Lá»…, Váº¥n ÄÃ¡p',
            taskIcon: '<i class="fas fa-calendar-check"></i>',
            autorunEnabled: true,
            autorunKey: 'autoDiemDanh',
            hasButton: true,
            buttonText: 'Thá»±c hiá»‡n',
            async action() {
                const nonce = await getNonce();
                if (!nonce) {
                    showNotification("KhÃ´ng tÃ¬m tháº¥y nonce! Vui lÃ²ng táº£i láº¡i trang.", "error");
                    return;
                }
                await doDailyCheckin(nonce);
                await doClanDailyCheckin(nonce);
                await vandap.doVanDap(nonce);
                console.log("[HH3D Script] âœ… Äiá»ƒm danh, táº¿ lá»…, váº¥n Ä‘Ã¡p Ä‘Ã£ hoÃ n thÃ nh.");
            }
        },
        {
            taskId: 'thiluyen',
            taskName: 'ThÃ­ Luyá»‡n TÃ´ng MÃ´n',
            taskIcon: '<i class="fas fa-fire-alt"></i>',
            autorunEnabled: true,
            autorunKey: 'autoThiLuyen',
            hasButton: true,
            buttonText: 'Thá»±c hiá»‡n',
            async action() {
                await doThiLuyenTongMon();
                console.log("[HH3D Script] âœ… ThÃ­ Luyá»‡n TÃ´ng MÃ´n Ä‘Ã£ hoÃ n thÃ nh.");
            }
        },
        {
            taskId: 'phucloi',
            taskName: 'PhÃºc Lá»£i ÄÆ°á»ng',
            taskIcon: '<i class="fas fa-gift"></i>',
            autorunEnabled: true,
            autorunKey: 'autoPhucLoi',
            hasButton: true,
            buttonText: 'Nháº­n',
            hasExtraButton: true,
            extraButtonText: 'ðŸŽ',
            extraButtonTitle: 'Nháº­n Bonus',
            async action() {
                await doPhucLoiDuong();
                console.log("[HH3D Script] âœ… PhÃºc Lá»£i Ä‘Ã£ hoÃ n thÃ nh.");
            },
            async extraAction() {
                await phucloiclaimbonus();
                console.log("[HH3D Script] âœ… Nháº­n thÆ°á»Ÿng Bonus PhÃºc Lá»£i Ä‘Ã£ cháº¡y.");
            }
        },
        {
            taskId: 'hoangvuc',
            taskName: 'Hoang Vá»±c',
            taskIcon: '<i class="fas fa-dragon"></i>',
            autorunEnabled: true,
            autorunKey: 'autoHoangVuc',
            hasButton: true,
            buttonText: 'ÄÃ¡nh',
            hasExtraButton: true,
            extraButtonText: 'ðŸ“¦',
            extraButtonTitle: 'Mua 5 RÆ°Æ¡ng Linh Báº£o',
            hasSettings: true,
            hasDamageToggle: true,
            async action() {
                await hoangvuc.doHoangVuc();
            },
            async extraAction() {
                await hvmuaruong.muaRuongLinhBao(5);
            }
        },
        {
            taskId: 'mecung',
            taskName: 'MÃª Cung',
            taskIcon: '<i class="fas fa-dungeon"></i>',
            hasButton: true,
            buttonText: 'VÃ o',
            async action() {
                window.location.href = '/me-cung';
            }
        },
        {
            taskId: 'khoangmach',
            taskName: 'KhoÃ¡ng Máº¡ch',
            taskIcon: '<i class="fas fa-gem"></i>',
            autorunEnabled: true,
            autorunKey: 'autoKhoangMach',
            hasButton: true,
            buttonText: 'ÄÃ o',
            hasSettings: true,
            hasExtraButton: true,
            extraButtonText: 'VÃ o',
            extraButtonTitle: 'VÃ o KhoÃ¡ng Máº¡ch',
            async extraAction() {
                window.location.href = '/khoang-mach';
            },
            async action() {
                await khoangmach.doKhoangMach();
            }
        },

        {
            taskId: 'dothach',
            taskName: 'Äá»• Tháº¡ch',
            taskIcon: '<i class="fas fa-dice"></i>',
            autorunEnabled: true,
            autorunKey: 'autoDoThach',
            hasButton: true,
            buttonText: 'CÆ°á»£c',
            hasSelect: true,
            selectOptions: [
                { value: 'tai', label: 'TÃ i' },
                { value: 'xiu', label: 'Xá»‰u' }
            ],
            async action() {
                const choice = localStorage.getItem('dice-roll-choice') || 'tai';
                await dothach.run(choice);
            }
        },
        {
            taskId: 'bicanh',
            taskName: 'BÃ­ Cáº£nh',
            taskIcon: '<i class="fas fa-skull-crossbones"></i>',
            autorunEnabled: true,
            autorunKey: 'autoBiCanh',
            hasButton: true,
            buttonText: 'ÄÃ¡nh',
            hasInput: true,
            inputType: 'number',
            inputMin: 0,
            inputMax: 5,
            inputTitle: 'Sá»‘ lÆ°á»£t giá»¯ láº¡i',
            hasToggle: true,
            toggleTitle: 'Theo dÃµi boss qua socket',
            async action() {
                await bicanh.doBiCanh();
            }
        },

        {
            taskId: 'tienduyen',
            taskName: 'TiÃªn DuyÃªn',
            taskIcon: '<i class="fas fa-heart"></i>',
            autorunEnabled: true,
            autorunKey: 'autoTienDuyen',
            hasButton: true,
            buttonText: 'Thá»±c hiá»‡n',
            hasExtraButton: true,
            extraButtonText: 'ðŸ™',
            extraButtonTitle: 'Cáº§u Nguyá»‡n Äáº¡o Lá»¯',
            hasExtra2Button: true,
            extra2ButtonText: 'ðŸŒº',
            extra2ButtonTitle: 'Táº·ng Hoa',
            hasSelect: true,
            selectOptions: [
                { value: '1', label: 'táº·ng 1ng' },
                { value: '2', label: 'táº·ng 2ng' },
                { value: '3', label: 'táº·ng 3ng' },
                { value: '4', label: 'táº·ng 4ng' },
                { value: '5', label: 'táº·ng 5ng' }
            ],
            async action() {
                await tienduyen.doTienDuyen(true);
            },
            async extraAction() {
                const accountId = await getAccountId();
                await docaunguyen(accountId);
            },
            async extra2Action() {
                const quantity = parseInt(localStorage.getItem('tienduyen-choice') || '5', 10);
                if (!tanghoa.initialized) await tanghoa.init();
                await tanghoa.run(quantity);
            }
        },

        {
            taskId: 'hoatdongngay',
            taskName: 'Hoáº¡t Äá»™ng NgÃ y - VÃ²ng Quay',
            taskIcon: '<i class="fas fa-calendar-day"></i>',
            hasButton: true,
            buttonText: 'Má»Ÿ',
            hasExtraButton: true,
            extraButtonText: 'VÃ o',
            extraButtonTitle: 'VÃ o Hoáº¡t Äá»™ng NgÃ y',
            hasExtra2Button: true,
            extra2ButtonText: 'âœ¨',
            extra2ButtonTitle: 'Nháº­n lÆ°á»£t Kháº¯c Tráº­n VÄƒn',
            async action() {
                await hoatdongngay.doHoatDongNgay();
            },
            async extraAction() {
                window.location.href = '/nhiem-vu-hang-ngay';
            },
            async extra2Action() {
                await hoatdongngay.claimDailyTurns();
            }
        },
        {
            taskId: 'luyenDan',
            taskName: 'Luyá»‡n Äan',
            taskIcon: '<i class="fas fa-mortar-pestle"></i>',
            autorunEnabled: true,
            autorunKey: 'autoLuyenDan',
            hasButton: true,
            buttonText: 'Luyá»‡n',
            hasSettings: true,
            async action() {
                await luyendan.doLuyenDan(true);
            }
        }
    ];

    // ===============================================
    // Táº O SKELETON UI CHO DANH SÃCH NHIá»†M Vá»¤
    // ===============================================
    function createQuestSkeletonUI() {
        const questsHTML = QUEST_CONFIG.map(quest => {
            const extraControls = [];

            // ThÃªm select náº¿u cÃ³
            if (quest.hasSelect) {
                const savedValue = localStorage.getItem(`${quest.taskId}-choice`) || quest.selectOptions[quest.selectOptions.length - 1].value;
                const optionsHTML = quest.selectOptions.map(opt =>
                    `<option value="${opt.value}" ${opt.value === savedValue ? 'selected' : ''}>${opt.label}</option>`
                ).join('');
                extraControls.push(`<select class="quest-select" data-task="${quest.taskId}">${optionsHTML}</select>`);
            }

            // ThÃªm input náº¿u cÃ³  
            if (quest.hasInput) {
                const savedValue = localStorage.getItem(`reserve${quest.taskId.charAt(0).toUpperCase() + quest.taskId.slice(1)}Attacks`) || '0';
                extraControls.push(`<input type="${quest.inputType}" class="quest-input" data-task="${quest.taskId}" 
                    min="${quest.inputMin}" max="${quest.inputMax}" value="${savedValue}" 
                    title="${quest.inputTitle}" />`);
            }

            // ThÃªm toggle náº¿u cÃ³
            if (quest.hasToggle) {
                const savedState = localStorage.getItem(`${quest.taskId}SocketEnabled`);
                const isEnabled = savedState === '1';
                extraControls.push(`<button class="quest-toggle" data-task="${quest.taskId}" 
                    title="${quest.toggleTitle}">${isEnabled ? 'ðŸ””' : 'ðŸ”•'}</button>`);
                // Apply socket changes immediately
                if (isEnabled) {
                    if (typeof bicanhhiente !== 'undefined' && bicanhhiente.startBossSocketListener) {
                        bicanhhiente.startBossSocketListener();
                    }
                } else {
                    if (typeof bicanhhiente !== 'undefined' && bicanhhiente.stopBossSocketListener) {
                        bicanhhiente.stopBossSocketListener();
                    }
                }
            }

            // ThÃªm settings button náº¿u cÃ³
            if (quest.hasSettings) {
                extraControls.push(`<button class="quest-settings-btn" data-task="${quest.taskId}" title="CÃ i Ä‘áº·t">âš™ï¸</button>`);
            }

            // ThÃªm toggle tá»‘i Æ°u hÃ³a sÃ¡t thÆ°Æ¡ng (Hoang Vá»±c)
            if (quest.hasDamageToggle) {
                const dmgOn = localStorage.getItem('hoangvucMaximizeDamage') === 'true';
                extraControls.push(`<button class="quest-toggle hoangvuc-damage-toggle" title="Tá»‘i Æ°u hÃ³a sÃ¡t thÆ°Æ¡ng" style="background:${dmgOn ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.05)'};color:${dmgOn ? '#22c55e' : '#9ca3af'};font-size:10px;font-weight:700;min-width:34px">${dmgOn ? '+15%' : '0%'}</button>`);
            }

            // Táº¡o nÃºt chÃ­nh
            let buttonHTML = '';
            if (quest.hasButton) {
                buttonHTML = `<button class="quest-action-btn" data-task="${quest.taskId}">${quest.buttonText}</button>`;
            }

            // Custom controls: Luáº­n VÃµ inline mode + target ID
            // if (quest.hasCustomControls && quest.taskId === 'luanvo') {
            //     const lvMode = localStorage.getItem('luanVoChallengeMode') || 'auto';
            //     const lvTargetId = localStorage.getItem(`luanVoTargetUserId_${accountId}`) || '';
            //     buttonHTML = `
            //         <select class="quest-select luanvo-mode-select" title="Cháº¿ Ä‘á»™ thÃ¡ch Ä‘áº¥u">
            //             <option value="auto" ${lvMode !== 'manual' ? 'selected' : ''}>Tá»± Ä‘á»™ng</option>
            //             <option value="manual" ${lvMode === 'manual' ? 'selected' : ''}>Nháº­p ID</option>
            //         </select>
            //         <input type="text" class="quest-input luanvo-target-input" placeholder="ID Ä‘á»‘i thá»§"
            //                value="${lvTargetId}"
            //                style="display:${lvMode === 'manual' ? 'inline-block' : 'none'};width:70px">
            //     ` + buttonHTML;
            // }



            // Táº¡o nÃºt extra náº¿u cÃ³
            if (quest.hasExtraButton) {
                buttonHTML += `<button class="quest-extra-btn" data-task="${quest.taskId}" title="${quest.extraButtonTitle}">${quest.extraButtonText}</button>`;
            }

            // Táº¡o nÃºt extra2 náº¿u cÃ³
            if (quest.hasExtra2Button) {
                buttonHTML += `<button class="quest-extra-btn quest-extra2-btn" data-task="${quest.taskId}" title="${quest.extra2ButtonTitle}">${quest.extra2ButtonText}</button>`;
            }

            // ThÃªm indicator dot náº¿u quest cÃ³ thá»ƒ autorun
            let indicatorHTML = '';
            if (quest.autorunEnabled) {
                const isEnabled = localStorage.getItem(quest.autorunKey) !== '0';
                indicatorHTML = `<span class="quest-autorun-indicator ${isEnabled ? 'enabled' : 'disabled'}" data-task="${quest.taskId}"></span>`;
            }

            let progressText = '';
            if (quest.taskId === 'luyenDan') {
                const savedProgress = localStorage.getItem(`luyenDanLastProgress_${accountId}`);
                if (savedProgress) {
                    progressText = ` (${savedProgress})`;
                }
            }

            return `
                <div class="nv-quest-item" data-task-id="${quest.taskId}">
                    ${indicatorHTML}
                    <span class="nv-quest-icon" data-task="${quest.taskId}" style="cursor: ${quest.autorunEnabled ? 'pointer' : 'default'};" title="${quest.autorunEnabled ? 'Báº¥m Ä‘á»ƒ báº­t/táº¯t cháº¡y tá»± Ä‘á»™ng' : ''}">${quest.taskIcon}</span>
                    <span class="nv-quest-name">${quest.taskName}<span class="quest-progress" style="color:#9ca3af;font-size:10px;">${progressText}</span></span>
                    <div class="quest-controls">
                        ${extraControls.join('')}
                        ${buttonHTML}
                    </div>
                    <div class="quest-next-time" data-task="${quest.taskId}"></div>
                </div>
            `;
        }).join('');

        return `
            <div class="nv-overview">
                <div class="nv-ov-header">
                    <h3>Nhiá»‡m Vá»¥</h3>
                    <span class="quest-next-time" data-task="restart" style="font-size:10px;color:#9ca3af;flex-shrink:0;margin-right:5px"></span>
                    <span class="percent">0%</span>
                </div>
                <div class="nv-progress-bar">
                    <div class="nv-progress-fill" style="width: 0%"></div>
                </div>
                <p class="nv-ov-summary">0/5 nhiá»‡m vá»¥</p>
                <div class="nv-chips"></div>
                <button class="progress-toggle-btn" onclick="
                    const details = document.querySelector('.nv-quest-details');
                    if(details) {
                        details.classList.toggle('show');
                        this.textContent = details.classList.contains('show') ? 'â–² áº¨n chi tiáº¿t' : 'â–¼ Xem chi tiáº¿t';
                    }
                ">â–¼ Xem chi tiáº¿t</button>
            </div>
            <div class="nv-quest-details ">${questsHTML}</div>
        `;
    }

    /* ===== Update Profile Info ===== */
    async function loadHH3DProfile() {
        // Xu
        try {
            const res = await fetch("/vip-hh3d", { credentials: "include" });
            const html = await res.text();
            //console.log("HTML /vip-hh3d:", html); // log toÃ n bá»™ HTML tráº£ vá»

            const xuMatch = html.match(/id="current-coins">([\d.,]+)/); // báº¯t cáº£ sá»‘ cÃ³ dáº¥u . hoáº·c ,
            const xukhoaMatch = html.match(/id="current-coins-locked">([\d.,]+)/);

            //console.log("xuMatch:", xuMatch);
            //console.log("xukhoaMatch:", xukhoaMatch);

            const xu = xuMatch ? xuMatch[1] : "?";
            const xukhoa = xukhoaMatch ? xukhoaMatch[1] : "?";

            //console.log("Parsed Xu:", xu);
            //console.log("Parsed Xu KhÃ³a:", xukhoa);

            document.getElementById("xu-info").innerHTML = `        
            <div class="xu-display">
                <span class="xu-left">ðŸª™ Xu: <strong>${xu}</strong> ðŸ”’ <strong>${xukhoa}</strong></span>
                <span class="xu-right">
                    <span class="autorun-indicator-dot"></span>
                    <span class="autorun-icon" title="Báº¥m Ä‘á»ƒ báº­t/táº¯t tá»± Ä‘á»™ng cháº¡y khi táº£i trang"><i class="fas fa-robot"></i></span>           
                    <button id="autorun-main-btn" class="autorun-main-btn">Báº¯t Äáº§u</button>
                    <button id="profile-refresh-btn" title="LÃ m má»›i thÃ´ng tin">ðŸ”„</button>
                </span>
            </div>        
            <div id="promo-form" class="promo-form">
                <input type="text" id="promo-code-input" placeholder="Nháº­p CODE" value="" />
                <button id="promo-code-submit">ðŸ’Ž Háº¥p Thá»¥</button>
                <button id="settings-btn" class="settings-btn" title="CÃ i Ä‘áº·t chung">âš™ï¸</button>
                <button id="guide-btn" class="settings-btn" title="HÆ°á»›ng dáº«n sá»­ dá»¥ng">â“</button>
            </div>
        `;
            const refreshBtn = document.getElementById('profile-refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', async () => {
                    refreshBtn.textContent = 'âŸ³';
                    refreshBtn.disabled = true;
                    await loadHH3DProfile();
                    refreshBtn.textContent = 'ðŸ”„';
                    refreshBtn.disabled = false;
                    showNotification('ÄÃ£ lÃ m má»›i thÃ´ng tin nhiá»‡m vá»¥ hÃ ng ngÃ y.', 'success', 2000);
                });
            }
            // Bind autorun button in xu-info
            const autorunBtn = document.getElementById('autorun-main-btn');
            if (autorunBtn) {
                autorunBtn.addEventListener('click', async () => {
                    // let enabled = localStorage.getItem('isRunning') !== '0';                
                    if (!window.isRunning) {
                        autorunBtn.classList.add('running');
                        autorunBtn.textContent = 'Dá»«ng Láº¡i';
                        if (window.hh3dAutomatic) {
                            await window.hh3dAutomatic.start();
                        }
                        window.isRunning = true;
                        showNotification('Báº¯t Ä‘áº§u cháº¡y tá»± Ä‘á»™ng', 'info');
                    } else {
                        autorunBtn.classList.remove('running');
                        autorunBtn.textContent = 'Báº¯t Äáº§u';
                        if (window.hh3dAutomatic) {
                            await window.hh3dAutomatic.stop();
                        }
                        window.isRunning = false;
                        showNotification('ÄÃ£ dá»«ng cháº¡y tá»± Ä‘á»™ng', 'info');
                    }
                });
            }

            // Gáº¯n sá»± kiá»‡n
            setTimeout(() => {
                const promoSubmit = document.getElementById('promo-code-submit');
                const promoInput = document.getElementById('promo-code-input');

                // Submit code
                if (promoSubmit && promoInput) {
                    promoSubmit.addEventListener('click', async () => {
                        const code = promoInput.value.trim();
                        if (!code) {
                            showNotification('âš ï¸ Vui lÃ²ng nháº­p mÃ£ CODE', 'warning');
                            return;
                        }
                        localStorage.setItem('hh3d_promo_code', code);
                        await submitPromoCode(code);
                    });

                    // Nháº¥n Enter cÅ©ng submit
                    promoInput.addEventListener('keypress', async (e) => {
                        if (e.key === 'Enter') {
                            const code = promoInput.value.trim();
                            if (code) {
                                localStorage.setItem('hh3d_promo_code', code);
                                await submitPromoCode(code);
                            }
                        }
                    });
                }

                // Autorun icon toggle
                const autorunIcon = document.querySelector('.autorun-icon');
                const autorunDot = document.querySelector('.autorun-indicator-dot');
                if (autorunIcon && autorunDot) {
                    // Initialize state
                    let autorunEnabled = localStorage.getItem('autorunEnabled') !== '0';
                    autorunDot.classList.toggle('enabled', autorunEnabled);
                    autorunDot.classList.toggle('disabled', !autorunEnabled);

                    autorunIcon.addEventListener('click', () => {
                        autorunEnabled = !autorunEnabled;
                        localStorage.setItem('autorunEnabled', autorunEnabled ? '1' : '0');
                        autorunDot.classList.toggle('enabled', autorunEnabled);
                        autorunDot.classList.toggle('disabled', !autorunEnabled);
                        autorunIcon.classList.toggle('enabled', autorunEnabled);
                        autorunIcon.classList.toggle('disabled', !autorunEnabled);

                        const message = autorunEnabled ? 'Tá»± Ä‘á»™ng cháº¡y khi táº£i trang Ä‘Ã£ Ä‘Æ°á»£c báº­t' : 'Tá»± Ä‘á»™ng cháº¡y khi táº£i trang Ä‘Ã£ Ä‘Æ°á»£c táº¯t';
                        showNotification(message, 'info');
                    });
                    // Robot icon reflects autorunEnabled (auto-start on page load)
                    autorunIcon.classList.toggle('enabled', autorunEnabled);
                    autorunIcon.classList.toggle('disabled', !autorunEnabled);
                    // Button reflects actual running state (window.isRunning)
                    if (window.isRunning) {
                        autorunBtn.classList.add('running');
                        autorunBtn.textContent = 'Dá»«ng Láº¡i';
                    } else {
                        autorunBtn.classList.remove('running');
                        autorunBtn.textContent = 'Báº¯t Äáº§u';
                    }
                }
                const settingsBtn = document.getElementById('settings-btn');
                if (settingsBtn) {
                    settingsBtn.addEventListener('click', () => {
                        showQuestSettings();
                    });
                }
                const guideBtn = document.getElementById('guide-btn');
                if (guideBtn) {
                    guideBtn.addEventListener('click', () => {
                        showGuideModal();
                    });
                }
            }, 100);
        } catch (e) {
            console.error("Error fetching Xu:", e);
        }

        // Tiáº¿n Ä‘á»™ - Cáº­p nháº­t dá»¯ liá»‡u vÃ o skeleton UI
        try {
            const html = await (await fetch("/nhiem-vu-hang-ngay?t=" + Date.now(), { credentials: "include" })).text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            // Parse tiáº¿n Ä‘á»™
            const ringLabel = doc.querySelector(".nv-ring-label");
            const percent = ringLabel ? ringLabel.textContent.trim() : "0%";
            const percentValue = parseInt(percent) || 0;

            // Parse thÃ´ng tin nhiá»‡m vá»¥
            const heading = doc.querySelector(".nv-ov-right h3");
            const summary = doc.querySelector(".nv-ov-right p");
            const headingText = heading ? heading.textContent.trim() : "Nhiá»‡m Vá»¥";
            const summaryText = summary ? summary.textContent.trim() : "0/5 nhiá»‡m vá»¥";

            // Parse danh sÃ¡ch nhiá»‡m vá»¥ tá»« chips
            const chips = [...doc.querySelectorAll(".nv-chip")];
            const chipsHTML = chips.map(chip => {
                const isDone = chip.classList.contains("chip-done");
                const text = chip.textContent.trim();
                return `<span class="nv-chip ${isDone ? 'chip-done' : 'chip-pend'}">${text}</span>`;
            }).join('');

            const isFull = percentValue >= 100;

            // Cáº­p nháº­t UI Overview (khÃ´ng táº¡o má»›i)
            const progressWrap = document.getElementById("reward-progress-wrap");
            if (progressWrap) {
                // Cáº­p nháº­t cÃ¡c pháº§n tá»­ Ä‘Ã£ cÃ³
                const percentElem = progressWrap.querySelector('.percent');
                const progressFill = progressWrap.querySelector('.nv-progress-fill');
                const summaryElem = progressWrap.querySelector('.nv-ov-summary');
                const chipsContainer = progressWrap.querySelector('.nv-chips');
                const headingElem = progressWrap.querySelector('.nv-ov-header h3');

                if (percentElem) {
                    percentElem.textContent = percent;
                    percentElem.className = `percent ${isFull ? 'full' : ''}`;
                }
                if (progressFill) {
                    progressFill.style.width = percent;
                    progressFill.className = `nv-progress-fill ${isFull ? 'full' : ''}`;
                }
                if (summaryElem) summaryElem.textContent = summaryText;
                if (chipsContainer) chipsContainer.innerHTML = chipsHTML;
                if (headingElem) headingElem.textContent = headingText;
            }

            // Parse danh sÃ¡ch nhiá»‡m vá»¥ chi tiáº¿t tá»« server vÃ  cáº­p nháº­t tráº¡ng thÃ¡i
            const quests = [...doc.querySelectorAll(".nv-quest")];

            // Mapping tÃªn UI -> tÃªn server (nhiem-vu-hang-ngay) khi khÃ¡c nhau
            const questNameAliases = {
                'TiÃªn DuyÃªn': ['Há»· Sá»± ÄÆ°á»ng'],
            };

            // Gom progress theo tá»«ng quest item trong UI
            const questItems = document.querySelectorAll('.nv-quest-item');
            questItems.forEach(item => {
                if (item.getAttribute('data-task-id') === 'luyenDan') {
                    return;
                }
                const nameEl = item.querySelector('.nv-quest-name');
                const progressContent = item.querySelector('.quest-progress')?.textContent || '';
                const itemName = ((nameEl?.textContent || '').replace(progressContent, '')).trim();
                const itemParts = itemName.split(',').map(s => s.trim());
                const aliases = questNameAliases[itemName] || [];
                const progressParts = [];
                let allDone = true;
                let anyMatch = false;

                quests.forEach(quest => {
                    const isDone = quest.classList.contains("done");
                    const name = quest.querySelector(".nv-qb h4")?.textContent.trim() || "";
                    const progress = quest.querySelector(".nv-prog-txt")?.textContent.trim() || "";

                    if (itemName.includes(name) || name.includes(itemName.split('<')[0].trim()) || itemParts.some(part => name.includes(part)) || aliases.some(alias => name.includes(alias) || alias.includes(name))) {
                        anyMatch = true;
                        if (!isDone) allDone = false;
                        if (progress) progressParts.push(progress);
                    }
                });

                if (anyMatch) {
                    if (allDone) {
                        item.classList.add('done');
                    } else {
                        item.classList.remove('done');
                    }
                    const progressSpan = item.querySelector('.quest-progress');
                    if (progressSpan && progressParts.length > 0) {
                        let progressText = '';
                        if (progressParts.length > 1) {
                            let curSum = 0, maxSum = 0;
                            progressParts.forEach(p => {
                                const m = p.match(/(\d+)\s*\/\s*(\d+)/);
                                if (m) { curSum += parseInt(m[1]); maxSum += parseInt(m[2]); }
                            });
                            progressText = maxSum > 0 ? ` ${curSum}/${maxSum}` : ` ${progressParts.join(' | ')}`;
                        } else {
                            progressText = ` ${progressParts[0]}`;
                        }
                        // Náº¿u lÃ  BÃ­ Cáº£nh vÃ  cÃ³ window.bicanhBossHp thÃ¬ append pháº§n trÄƒm mÃ¡u boss
                        if (item.dataset.taskId === 'bicanh' && typeof window.bicanhBossHp === 'number') {
                            progressText += ` (${window.bicanhBossHp.toFixed(2)}% HP)`;
                        }
                        progressSpan.textContent = progressText;
                    }
                }
            });

            // Cáº­p nháº­t tráº¡ng thÃ¡i nÃºt dá»±a trÃªn taskTracker
            await updateAllQuestButtons();

        } catch (e) {
            console.error("Error loading progress:", e);
            const progressWrap = document.getElementById("reward-progress-wrap");
            if (progressWrap && !progressWrap.querySelector('.nv-quest-details')) {
                // Chá»‰ hiá»ƒn thá»‹ lá»—i náº¿u chÆ°a cÃ³ skeleton
                progressWrap.innerHTML = `
            <div style="font-size:12px;color:#999;">
                âš ï¸ KhÃ´ng thá»ƒ táº£i tiáº¿n Ä‘á»™
            </div>
            `;
            }
        }
    }

    // ===============================================
    // Cáº¬P NHáº¬T TRáº NG THÃI Táº¤T Cáº¢ CÃC NÃšT NHIá»†M Vá»¤
    // ===============================================
    async function updateAllQuestButtons() {
        const accountId = await getAccountId();
        if (!accountId) return;

        QUEST_CONFIG.forEach(async (quest) => {
            const button = document.querySelector(`.quest-action-btn[data-task="${quest.taskId}"]`);
            if (!button) return;

            const questItem = document.querySelector(`.nv-quest-item[data-task-id="${quest.taskId}"]`);

            // Xá»­ lÃ½ tá»«ng loáº¡i task
            switch (quest.taskId) {
                case 'diemdanh':
                case 'thiluyen':
                case 'phucloi':
                case 'hoangvuc':
                case 'khoangmach':
                case 'tienduyen':
                case 'hoatdongngay':
                    if (taskTracker.isTaskDone(accountId, quest.taskId)) {
                        // button.disabled = true;
                        button.textContent = 'âœ“ Xong';
                        countdownTimer.remove(quest.taskId);
                        if (questItem) questItem.classList.add('done');
                    } else {
                        // button.disabled = false;
                        button.textContent = quest.buttonText;
                        if (questItem) questItem.classList.remove('done');
                    }
                    break;

                case 'luyenDan':
                    if (taskTracker.isTaskDone(accountId, quest.taskId)) {
                        // button.disabled = true;
                        button.textContent = 'âœ“ Xong';
                        // Chá»‰ remove timer khi KHÃ”NG Ä‘ang xá»­ lÃ½ Ä‘á»ƒ trÃ¡nh xÃ³a span progress giá»¯a chá»«ng
                        if (!luyendan || !luyendan.isProcessing) {
                            countdownTimer.remove('luyenDan');
                            countdownTimer.remove('luyenDanCheck');
                        }
                        if (questItem) questItem.classList.add('done');
                    } else {
                        // button.disabled = false;
                        button.textContent = quest.buttonText;
                        if (questItem) questItem.classList.remove('done');
                    }
                    break;

                case 'dothach':
                    const currentHour = parseInt(new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        hour: 'numeric',
                        hour12: false
                    }), 10);
                    const isBetTime = (currentHour >= 6 && currentHour < 13) || (currentHour >= 16 && currentHour < 21);
                    const status = taskTracker.getTaskStatus(accountId, 'dothach');
                    if ((status.betplaced && isBetTime) || (status.reward_claimed && !isBetTime)) {
                        // button.disabled = true;
                        button.textContent = 'âœ“ Xong';
                    } else {
                        // button.disabled = false;
                        button.textContent = quest.buttonText;
                    }
                    break;

                case 'bicanh':
                    const isDailyLimit = await bicanh.isDailyLimit();
                    if (isDailyLimit) {
                        // button.disabled = true;
                        button.textContent = 'âœ“ Xong';
                        countdownTimer.remove('bicanh');
                        if (questItem) questItem.classList.add('done');
                    } else {
                        // button.disabled = false;
                        button.textContent = quest.buttonText;
                        if (questItem) questItem.classList.remove('done');
                    }
                    break;
            }
        });
    }

    // ===============================================
    // Gáº®N Sá»° KIá»†N CHO CÃC NÃšT VÃ€ CONTROLS TRONG QUEST
    // ===============================================
    function attachQuestButtonHandlers() {
        // Gáº¯n sá»± kiá»‡n cho táº¥t cáº£ cÃ¡c nÃºt action
        document.querySelectorAll('.quest-action-btn').forEach(button => {
            const taskId = button.getAttribute('data-task');
            const questConfig = QUEST_CONFIG.find(q => q.taskId === taskId);

            if (!questConfig || !questConfig.action) return;

            button.addEventListener('click', async () => {
                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = 'Äang xá»­ lÃ½...';

                try {
                    await questConfig.action();
                    // Vá»›i luyenDan: khÃ´ng gá»i loadHH3DProfile() vÃ¬ nÃ³ sáº½ kÃ­ch hoáº¡t
                    // updateAllQuestButtons â†’ countdownTimer.remove â†’ xÃ³a span progress
                    if (taskId !== 'luyenDan') {
                        await loadHH3DProfile();
                    } else {
                        await updateAllQuestButtons();
                    }
                } catch (error) {
                    console.error(`[Quest ${taskId}] Error:`, error);
                    showNotification(`Lá»—i khi thá»±c hiá»‡n ${questConfig.taskName}`, 'error');
                } finally {
                    button.textContent = originalText;
                    button.disabled = false;
                }
            });
        });

        // Gáº¯n sá»± kiá»‡n cho cÃ¡c nÃºt extra (nhÆ° bonus)
        document.querySelectorAll('.quest-extra-btn:not(.quest-extra2-btn)').forEach(button => {
            const taskId = button.getAttribute('data-task');
            const questConfig = QUEST_CONFIG.find(q => q.taskId === taskId);

            if (!questConfig || !questConfig.extraAction) return;

            button.addEventListener('click', async () => {
                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = 'â³';

                try {
                    await questConfig.extraAction();
                    showNotification(`${questConfig.taskName} - Extra hoÃ n thÃ nh`, 'success');
                } catch (error) {
                    console.error(`[Quest ${taskId} Extra] Error:`, error);
                    showNotification(`Lá»—i khi thá»±c hiá»‡n extra ${questConfig.taskName}`, 'error');
                } finally {
                    button.textContent = originalText;
                    button.disabled = false;
                }
            });
        });

        // Gáº¯n sá»± kiá»‡n cho cÃ¡c nÃºt extra2
        document.querySelectorAll('.quest-extra2-btn').forEach(button => {
            const taskId = button.getAttribute('data-task');
            const questConfig = QUEST_CONFIG.find(q => q.taskId === taskId);

            if (!questConfig || !questConfig.extra2Action) return;

            button.addEventListener('click', async () => {
                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = 'â³';

                try {
                    await questConfig.extra2Action();
                    showNotification(`${questConfig.taskName} - ${questConfig.extra2ButtonTitle} hoÃ n thÃ nh`, 'success');
                } catch (error) {
                    console.error(`[Quest ${taskId} Extra2] Error:`, error);
                    showNotification(`Lá»—i khi thá»±c hiá»‡n ${questConfig.extra2ButtonTitle}`, 'error');
                } finally {
                    button.textContent = originalText;
                    button.disabled = false;
                }
            });
        });

        // Gáº¯n sá»± kiá»‡n cho cÃ¡c select
        document.querySelectorAll('.quest-select').forEach(select => {
            const taskId = select.getAttribute('data-task');
            select.addEventListener('change', () => {
                localStorage.setItem(`${taskId}-choice`, select.value);
                console.log(`[Quest ${taskId}] ÄÃ£ lÆ°u lá»±a chá»n: ${select.value}`);
            });
        });

        // Gáº¯n sá»± kiá»‡n cho cÃ¡c input
        document.querySelectorAll('.quest-input').forEach(input => {
            const taskId = input.getAttribute('data-task');
            input.addEventListener('input', () => {
                let value = parseInt(input.value, 10);
                if (isNaN(value)) value = 0;
                if (value < input.min) value = input.min;
                if (value > input.max) value = input.max;
                input.value = value;
                const storageKey = `reserve${taskId.charAt(0).toUpperCase() + taskId.slice(1)}Attacks`;
                localStorage.setItem(storageKey, value.toString());
                console.log(`[Quest ${taskId}] ÄÃ£ lÆ°u giÃ¡ trá»‹ reserve: ${value}`);
            });
        });

        // Gáº¯n sá»± kiá»‡n cho cÃ¡c toggle button
        document.querySelectorAll('.quest-toggle').forEach(button => {
            const taskId = button.getAttribute('data-task');
            button.addEventListener('click', () => {
                const isEnabled = button.textContent === 'ðŸ””';
                const newState = !isEnabled;
                button.textContent = newState ? 'ðŸ””' : 'ðŸ”•';
                localStorage.setItem(`${taskId}SocketEnabled`, newState ? '1' : '0');
                console.log(`[Quest ${taskId}] Socket tracking: ${newState ? 'Enabled' : 'Disabled'}`);

                // Xá»­ lÃ½ logic Ä‘áº·c biá»‡t cho BÃ­ Cáº£nh
                if (taskId === 'bicanh') {
                    if (newState) {
                        if (typeof bicanhhiente !== 'undefined' && bicanhhiente.startBossSocketListener) {
                            bicanhhiente.startBossSocketListener();
                        }
                    } else {
                        if (typeof bicanhhiente !== 'undefined' && bicanhhiente.stopBossSocketListener) {
                            bicanhhiente.stopBossSocketListener();
                        }
                    }
                }
            });
        });

        // Gáº¯n sá»± kiá»‡n cho cÃ¡c settings button
        document.querySelectorAll('.quest-settings-btn').forEach(button => {
            const taskId = button.getAttribute('data-task');
            button.addEventListener('click', () => {
                showQuestSettings(taskId);
            });
        });

        // Gáº¯n sá»± kiá»‡n toggle tá»‘i Æ°u hÃ³a sÃ¡t thÆ°Æ¡ng Hoang Vá»±c
        const damageToggleBtn = document.querySelector('.hoangvuc-damage-toggle');
        if (damageToggleBtn) {
            damageToggleBtn.addEventListener('click', () => {
                const current = localStorage.getItem('hoangvucMaximizeDamage') === 'true';
                const next = !current;
                localStorage.setItem('hoangvucMaximizeDamage', String(next));
                damageToggleBtn.style.background = next ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.05)';
                damageToggleBtn.style.color = next ? '#22c55e' : '#9ca3af';
                damageToggleBtn.textContent = next ? '+15%' : '0%';
                showNotification(`Tá»‘i Æ°u hÃ³a sÃ¡t thÆ°Æ¡ng: ${next ? '+15%' : '0%'}`, 'info', 1500);
            });
        }



        // Gáº¯n sá»± kiá»‡n Luáº­n VÃµ inline controls
        const luanvoModeSel = document.querySelector('.luanvo-mode-select');
        const luanvoTargetInput = document.querySelector('.luanvo-target-input');

        if (luanvoModeSel) {
            luanvoModeSel.addEventListener('change', () => {
                const isManual = luanvoModeSel.value === 'manual';
                if (luanvoTargetInput) luanvoTargetInput.style.display = isManual ? 'inline-block' : 'none';
                localStorage.setItem('luanVoChallengeMode', luanvoModeSel.value);
            });
        }

        if (luanvoTargetInput) {
            luanvoTargetInput.addEventListener('input', () => {
                localStorage.setItem(`luanVoTargetUserId_${accountId}`, luanvoTargetInput.value);
            });
        }



        // Gáº¯n sá»± kiá»‡n click vÃ o icon Ä‘á»ƒ toggle autorun
        document.querySelectorAll('.nv-quest-icon[data-task]').forEach(icon => {
            const taskId = icon.getAttribute('data-task');
            const questConfig = QUEST_CONFIG.find(q => q.taskId === taskId);

            if (!questConfig || !questConfig.autorunEnabled) return;

            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleQuestAutorun(taskId, questConfig.autorunKey);
            });
        });
    }

    // ===============================================
    // TOGGLE AUTORUN CHO QUEST
    // ===============================================
    function toggleQuestAutorun(taskId, autorunKey) {
        const indicator = document.querySelector(`.quest-autorun-indicator[data-task="${taskId}"]`);
        if (!indicator) return;

        // Láº¥y tráº¡ng thÃ¡i hiá»‡n táº¡i
        const currentState = localStorage.getItem(autorunKey) !== '0';
        const newState = !currentState;

        // LÆ°u vÃ o localStorage
        localStorage.setItem(autorunKey, newState ? '1' : '0');

        // Cáº­p nháº­t UI
        if (newState) {
            indicator.classList.remove('disabled');
            indicator.classList.add('enabled');
        } else {
            indicator.classList.remove('enabled');
            indicator.classList.add('disabled');
        }

        // Hiá»ƒn thá»‹ thÃ´ng bÃ¡o
        const questConfig = QUEST_CONFIG.find(q => q.taskId === taskId);
        const statusText = newState ? 'báº­t' : 'táº¯t';
        showNotification(`${questConfig.taskName}: ÄÃ£ ${statusText} cháº¡y tá»± Ä‘á»™ng`, newState ? 'success' : 'info', 2000);

        console.log(`[Quest Autorun] ${taskId}: ${newState ? 'Enabled' : 'Disabled'}`);

        // Dá»«ng hoáº·c báº¯t Ä‘áº§u tÃ¡c vá»¥ ngay láº­p tá»©c mÃ  khÃ´ng cáº§n táº£i láº¡i trang
        if (!newState) {
            if (typeof automatic !== 'undefined' && automatic) {
                // Dá»«ng timeout cá»§a task nÃ y (bao gá»“m cáº£ luyenDan)
                if (automatic.timeoutIds && automatic.timeoutIds[taskId]) {
                    clearTimeout(automatic.timeoutIds[taskId]);
                    automatic.timeoutIds[taskId] = null;
                }
                if (taskId === 'tienduyen' && automatic.tienduyenTimeout) {
                    clearTimeout(automatic.tienduyenTimeout);
                    automatic.tienduyenTimeout = null;
                }
                if (taskId === 'dothach' && automatic.dothachTimeout) {
                    clearTimeout(automatic.dothachTimeout);
                    automatic.dothachTimeout = null;
                }
            }
            // XÃ³a countdown timer (ká»ƒ cáº£ luyenDan vÃ  luyenDanCheck)
            countdownTimer.remove(taskId);
            if (taskId === 'luyenDan') {
                countdownTimer.remove('luyenDanCheck');
                luyendan.updateProgress(''); // xÃ³a text progress
            }
        } else {
            if (typeof automatic !== 'undefined' && automatic && automatic.isRunning) {
                if (taskId === 'luyenDan') {
                    automatic.scheduleTask('luyenDan', () => luyendan.doLuyenDan(), automatic.INTERVAL_LUYEN_DAN);
                } else if (taskId === 'hoangvuc') {
                    automatic.scheduleTask('hoangvuc', () => hoangvuc.doHoangVuc(), automatic.INTERVAL_HOANG_VUC);
                } else if (taskId === 'thiluyen') {
                    automatic.scheduleTask('thiluyen', () => doThiLuyenTongMon(), automatic.INTERVAL_THI_LUYEN);
                } else if (taskId === 'phucloi') {
                    automatic.scheduleTask('phucloi', () => doPhucLoiDuong(), automatic.INTERVAL_PHUC_LOI);
                } else if (taskId === 'khoangmach') {
                    automatic.scheduleTask('khoangmach', () => khoangmach.doKhoangMach(), automatic.INTERVAL_KHOANG_MACH);
                } else if (taskId === 'bicanh') {
                    automatic.scheduleTask('bicanh', async () => {
                        await bicanh.doBiCanh();
                    }, automatic.INTERVAL_BI_CANH);
                } else if (taskId === 'tienduyen') {
                    automatic.scheduleTienDuyenCheck();
                } else if (taskId === 'dothach') {
                    automatic.scheduleDoThach();
                }
            }
        }
    }

    // ===============================================
    // HIá»‚N THá»Š UNIFIED SETTINGS MODAL
    // ===============================================
    function showQuestSettings(taskId) {
        // Táº¡o modal náº¿u chÆ°a tá»“n táº¡i
        let modal = document.getElementById('unified-settings-modal');
        if (!modal) {
            modal = createUnifiedSettingsModal();
            document.body.appendChild(modal);
        }

        // Chuyá»ƒn Ä‘áº¿n tab tÆ°Æ¡ng á»©ng (máº·c Ä‘á»‹nh tab Chung)
        switchSettingsTab(taskId || 'general');

        // Hiá»ƒn thá»‹ modal
        modal.style.display = 'flex';
    }

    // ===============================================
    // HIá»‚N THá»Š HÆ¯á»šNG DáºªN Sá»¬ Dá»¤NG
    // ===============================================
    function showGuideModal() {
        let modal = document.getElementById('guide-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'guide-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:100000;';
            modal.innerHTML = `
            <div style="background:#1a1b2e;border-radius:12px;padding:20px 24px;max-width:520px;width:90%;max-height:80vh;overflow-y:auto;color:#c0caf5;font-size:13px;line-height:1.7;box-shadow:0 8px 32px rgba(0,0,0,0.5);border:1px solid #33467C;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h3 style="margin:0;color:#7aa2f7;font-size:16px;">ðŸ“– HÆ°á»›ng Dáº«n Sá»­ Dá»¥ng</h3>
                    <button id="guide-close-btn" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:0 4px;">&times;</button>
                </div>
                <div style="border-top:1px solid #33467C;padding-top:12px;">
                    <p><strong style="color:#bb9af7;">Báº¯t Äáº§u / Dá»«ng Láº¡i:</strong> Cháº¡y tá»± Ä‘á»™ng táº¥t cáº£ nhiá»‡m vá»¥.</p>
                    <p><strong style="color:#bb9af7;">ðŸ¤–:</strong> Báº­t/táº¯t cháº¿ Ä‘á»™ tá»± Ä‘á»™ng cháº¡y khi load trang.</p>
                    <p><strong style="color:#bb9af7;">ðŸ”„ NÃºt lÃ m má»›i:</strong> Táº£i láº¡i thÃ´ng tin xu vÃ  tiáº¿n Ä‘á»™ nhiá»‡m vá»¥.</p>
                    <p><strong style="color:#bb9af7;">âš™ï¸ CÃ i Ä‘áº·t:</strong> Cáº¥u hÃ¬nh chi tiáº¿t cho tá»«ng nhiá»‡m vá»¥.</p>
                    <p><strong style="color:#bb9af7;">ðŸ’Ž Háº¥p Thá»¥:</strong> Nháº­p mÃ£ CODE Ä‘á»ƒ nháº­n thÆ°á»Ÿng.</p>
                    <hr style="border-color:#33467C;margin:10px 0;">
                    <p><strong style="color:#9ece6a;">ðŸ“‹ Danh sÃ¡ch nhiá»‡m vá»¥:</strong></p>
                    <ul style="padding-left:18px;margin:4px 0;">
                        <li>Nháº¥n nÃºt hÃ nh Ä‘á»™ng (ÄÃ¡nh, Nháº­n, Kháº¯c,...) Ä‘á»ƒ cháº¡y thá»§ cÃ´ng.</li>
                        <li>CÃ¡c nÃºt phá»¥ (ðŸ“¦ðŸ™ðŸŒºðŸ‘‘ðŸŽ) thá»±c hiá»‡n hÃ nh Ä‘á»™ng bá»• sung.</li>
                        <li>Báº¥m vÃ o icon trÃªn má»—i task Ä‘á»ƒ báº­t/táº¯t tá»± Ä‘á»™ng cháº¡y má»—i task.</li>
                        <li>â³ Thá»i gian Ä‘áº¿m ngÆ°á»£c hiá»ƒn thá»‹ khi task Ä‘ang chá» lÆ°á»£t tiáº¿p.</li>
                    </ul>
                    <hr style="border-color:#33467C;margin:10px 0;">
                    <p><strong style="color:#f7768e;">âš ï¸ LÆ°u Ã½:</strong> Äáº£m báº£o Ä‘Ã£ Ä‘Äƒng nháº­p trÆ°á»›c khi sá»­ dá»¥ng.</p>
                </div>
            </div>
        `;
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.id === 'guide-close-btn') modal.style.display = 'none';
            });
            document.body.appendChild(modal);
        } else {
            modal.style.display = 'flex';
        }
    }

    // ===============================================
    // Táº O UNIFIED SETTINGS MODAL
    // ===============================================
    function createUnifiedSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'unified-settings-modal';
        modal.className = 'settings-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'settings-modal-content';

        // Header
        const header = document.createElement('div');
        header.className = 'settings-modal-header';
        header.innerHTML = `
        <h2>âš™ï¸ CÃ i Ä‘áº·t nhiá»‡m vá»¥</h2>
        <button class="settings-close-btn" onclick="document.getElementById('unified-settings-modal').style.display='none'">&times;</button>
    `;

        // Tabs container (horizontal scrolling)
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'settings-tabs-container';

        // Tab Chung (General) Ä‘áº§u tiÃªn
        const generalTab = document.createElement('button');
        generalTab.className = 'settings-tab';
        generalTab.setAttribute('data-task', 'general');
        generalTab.innerHTML = '<i class="fas fa-sliders-h"></i> Chung';
        generalTab.onclick = () => switchSettingsTab('general');
        tabsContainer.appendChild(generalTab);

        // Láº¥y cÃ¡c quest cÃ³ settings
        const questsWithSettings = QUEST_CONFIG.filter(q => q.hasSettings);

        questsWithSettings.forEach(quest => {
            const tab = document.createElement('button');
            tab.className = 'settings-tab';
            tab.setAttribute('data-task', quest.taskId);
            tab.innerHTML = `${quest.taskIcon} ${quest.taskName}`;
            tab.onclick = () => switchSettingsTab(quest.taskId);
            tabsContainer.appendChild(tab);
        });

        // Tab Log (luÃ´n á»Ÿ cuá»‘i)
        const logTab = document.createElement('button');
        logTab.className = 'settings-tab';
        logTab.setAttribute('data-task', 'log');
        logTab.innerHTML = '<i class="fas fa-list-alt"></i> Log';
        logTab.onclick = () => switchSettingsTab('log');
        tabsContainer.appendChild(logTab);

        // Content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'settings-content-container';
        contentContainer.id = 'settings-content';

        // Footer vá»›i nÃºt Save
        const footer = document.createElement('div');
        footer.className = 'settings-modal-footer';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'settings-save-btn';
        saveBtn.textContent = 'ðŸ’¾ LÆ°u cÃ i Ä‘áº·t';
        saveBtn.addEventListener('click', saveAllSettings);
        footer.appendChild(saveBtn);

        modalContent.appendChild(header);
        modalContent.appendChild(tabsContainer);
        modalContent.appendChild(contentContainer);
        modalContent.appendChild(footer);
        modal.appendChild(modalContent);

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };

        return modal;
    }

    // ===============================================
    // CHUYá»‚N TAB SETTINGS
    // ===============================================
    function switchSettingsTab(taskId) {
        // Update active tab
        document.querySelectorAll('.settings-tab').forEach(tab => {
            if (tab.getAttribute('data-task') === taskId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Load content for this task
        const contentContainer = document.getElementById('settings-content');
        if (contentContainer) {
            contentContainer.innerHTML = getSettingsContentForTask(taskId);

            // Bind events after content loaded
            setTimeout(() => bindSettingsEventsForTask(taskId), 50);
        }
    }

    // ===============================================
    // Láº¤Y Ná»˜I DUNG CÃ€I Äáº¶T CHO TASK
    // ===============================================
    function getSettingsContentForTask(taskId) {
        const accountId = localStorage.getItem('hh3d_account_id') || '';
        switch (taskId) {
            case 'general':
                return `
                <div class="settings-section">
                    <h3>Chung</h3>

                    <div class="settings-option">
                        <label>Giá» tá»± khá»Ÿi Ä‘á»™ng láº¡i hÃ ng ngÃ y:</label>
                        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
                            <input type="number" id="general-restart-hour" min="0" max="23" value="${parseInt(localStorage.getItem('selfSchedule_h') ?? '0', 10) || 0}"
                                style="width:55px;padding:4px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.07);color:#d0d8f0;text-align:center">
                            <span>giá»</span>
                            <input type="number" id="general-restart-minute" min="0" max="59" value="${parseInt(localStorage.getItem('selfSchedule_m') ?? '30', 10)}"
                                style="width:55px;padding:4px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.07);color:#d0d8f0;text-align:center">
                            <span>phÃºt</span>
                        </div>
                        <p class="settings-description">Tá»± Ä‘á»™ng dá»«ng vÃ  cháº¡y láº¡i script vÃ o giá» Ä‘Ã£ Ä‘áº·t (máº·c Ä‘á»‹nh 00:30)<br>Báº¥m lÆ°u láº¡i Ä‘á»ƒ Ã¡p dá»¥ng thay Ä‘á»•i</p>
                    </div>

                    <div class="settings-option">
                        <label>Nhiá»‡m vá»¥:</label>
                        <button id="general-reset-tasks-btn" class="settings-save-btn" style="background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid rgba(239,68,68,0.3);margin-top:6px;width:100%">
                            ðŸ”„ Reset tráº¡ng thÃ¡i hoÃ n thÃ nh
                        </button>
                    </div>

                    <div class="settings-option" style="margin-top:12px">
                        <label class="settings-checkbox-label" style="display:flex;align-items:center;gap:6px;cursor:pointer">
                            <input type="checkbox" id="general-vip-mode" ${localStorage.getItem('generalVipMode') === 'true' ? 'checked' : ''} style="cursor:pointer">
                            <span style="color:#f59e0b;font-weight:bold">ðŸ‘‘ Cháº¿ Ä‘á»™ VIP</span>
                        </label>
                        <p class="settings-description">Khi báº­t VIP:<br>â€¢ Hoang Vá»±c: thá»i gian há»“i lÆ°á»£t Ä‘á»•i thÃ nh 7.55 phÃºt.<br>â€¢ PhÃºc Lá»£i: giÃ£n cÃ¡ch check rÆ°Æ¡ng tiáº¿p theo Ä‘á»•i thÃ nh 7.55 phÃºt.</p>
                    </div>

                    <div class="settings-option" style="margin-top:10px">
                        <label>Truy cáº­p nhanh:</label>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;margin-top:6px">
                            <span style="font-size:11px;color:#9ca3af">Má»Ÿ:</span>
                            <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:#e0e0e0;cursor:pointer">
                                <input type="radio" name="link-open-mode" id="link-mode-new" value="new" style="cursor:pointer"> Tab má»›i
                            </label>
                            <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:#e0e0e0;cursor:pointer">
                                <input type="radio" name="link-open-mode" id="link-mode-current" value="current" style="cursor:pointer"> Tab hiá»‡n táº¡i
                            </label>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:5px">
                            <button class="general-link-btn" data-path="/cai-dat-tai-khoan">âš™ï¸ TÃ i khoáº£n</button>
                            <button class="general-link-btn" data-path="/bang-xep-hang-truyen-thua">ðŸ† BXH Truyá»n Thá»«a</button>
                            <button class="general-link-btn" data-path="/bang-xep-hang">ðŸ“Š BXH Tu Vi</button>
                            <button class="general-link-btn" data-path="/bang-phu-hao-tinh-thach">ðŸ’Ž BXH PhÃº HÃ o</button>
                            <button class="general-link-btn" data-path="/bang-xep-hang-tong-mon">âš”ï¸ BXH TÃ´ng MÃ´n</button>
                            <button class="general-link-btn" data-path="/bxh-tien-duyen">ðŸ’ž BXH TiÃªn DuyÃªn</button>
                            <button class="general-link-btn" data-path="/tu-bao-cac">ðŸ§„ Tá»¥ Báº£o CÃ¡c</button>
                            <button class="general-link-btn" data-path="/vip-hh3d">ðŸ’° Xu HH3D</button>
                            <button class="general-link-btn" data-path="/mini-games-hh3d">ðŸŽ® Mini Game</button>
                            <button class="general-link-btn" data-path="/thien-dao-ban-thuong">ðŸŽ ThiÃªn Äáº¡o</button>
                            <button class="general-link-btn" data-path="/cap-nhat-he-thong-tu-luyen">ðŸ”§ Äá»•i Há»‡ Thá»‘ng</button>
                            <button class="general-link-btn" data-path="/danh-sach-thanh-vien-tong-mon">ðŸ‘¥ ThÃ nh ViÃªn TM</button>
                            <button class="general-link-btn" data-path="/do-kiep-dai">âš¡ Äá»™ Kiáº¿p ÄÃ i</button>
                            <button class="general-link-btn" data-path="/thong-bao-tu-chu-phu">ðŸ“¢ ThÃ´ng BÃ¡o</button>
                        </div>
                    </div>
                </div>
            `;

            case 'hoangvuc':
                return `
                <div class="settings-section">
                    <h3>CÃ i Ä‘áº·t Hoang Vá»±c</h3>
                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="hoangvuc-maximize-damage" 
                                   ${localStorage.getItem('hoangvucMaximizeDamage') === 'true' ? 'checked' : ''}>
                            <span>Tá»‘i Ä‘a hÃ³a sÃ¡t thÆ°Æ¡ng (buff ngÅ© hÃ nh)</span>
                        </label>
                        <p class="settings-description">Tá»± Ä‘á»™ng chá»n ngÅ© hÃ nh Ä‘á»ƒ tÄƒng 15% sÃ¡t thÆ°Æ¡ng</p>
                    </div>
                </div>
            `;

            case 'khoangmach': {
                const _savedRewardMode = localStorage.getItem('khoangmach_reward_mode') || 'any';
                const _savedRewardTime = localStorage.getItem('khoangmach_reward_time') || 'max';
                return `
                <div class="settings-section">
                    <h3>CÃ i Ä‘áº·t KhoÃ¡ng Máº¡ch</h3>

                    <div class="settings-option" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                        <label for="khoangmach-mine-select" style="white-space:nowrap">Chá»n KhoÃ¡ng Máº¡ch:</label>
                        <select id="khoangmach-mine-select" class="settings-select" style="flex:1;min-width:120px">
                            <option value="">â³ Äang táº£i danh sÃ¡ch má»...</option>
                        </select>
                        <button id="khoangmach-reload-mines-btn" title="Táº£i láº¡i danh sÃ¡ch má»" style="padding:3px 8px;font-size:11px;border-radius:4px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:#d0d8f0;cursor:pointer;white-space:nowrap">ðŸ”„ Load</button>
                    </div>

                    <div class="settings-option">
                        <label for="khoangmach-reward-mode">Cháº¿ Ä‘á»™ Nháº­n ThÆ°á»Ÿng:</label>
                        <select id="khoangmach-reward-mode" class="settings-select">
                            <option value="110" ${_savedRewardMode === '110' ? 'selected' : ''}>110%</option>
                            <option value="100" ${_savedRewardMode === '100' ? 'selected' : ''}>100%</option>
                            <option value="20" ${_savedRewardMode === '20' ? 'selected' : ''}>20%</option>
                            <option value="any" ${_savedRewardMode === 'any' ? 'selected' : ''}>Báº¥t ká»³</option>
                        </select>
                    </div>

                    <div class="settings-option">
                        <label for="khoangmach-reward-time">Nháº­n thÆ°á»Ÿng khi thá»i gian Ä‘áº¡t:</label>
                        <select id="khoangmach-reward-time" class="settings-select">
                            <option value="max" ${_savedRewardTime === 'max' ? 'selected' : ''}>Äáº¡t tá»‘i Ä‘a</option>
                            <option value="20" ${_savedRewardTime === '20' ? 'selected' : ''}>20 phÃºt</option>
                            <option value="10" ${_savedRewardTime === '10' ? 'selected' : ''}>10 phÃºt</option>
                            <option value="4" ${_savedRewardTime === '4' ? 'selected' : ''}>4 phÃºt</option>
                            <option value="2" ${_savedRewardTime === '2' ? 'selected' : ''}>2 phÃºt</option>
                        </select>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="khoangmach-auto-takeover"
                                   ${localStorage.getItem('khoangmach_auto_takeover') === 'true' ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng Ä‘oáº¡t má» khi chÆ°a buff</span>
                        </label>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="khoangmach-auto-takeover-rotation"
                                   ${localStorage.getItem('khoangmach_auto_takeover_rotation') === 'true' ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng Ä‘oáº¡t má» khi cÃ³ thá»ƒ (Ä‘áº£o key)</span>
                        </label>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="khoangmach-leave-mine"
                                   ${localStorage.getItem('khoangmach_leave_mine_to_claim_reward_' + accountId) === 'true' ? 'checked' : ''}>
                            <span>Rá»i má» Ä‘á»ƒ nháº­n thÆ°á»Ÿng (cao táº§ng Ä‘áº£o key)</span>
                        </label>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="khoangmach-use-buff"
                                   ${localStorage.getItem('khoangmach_use_buff') === 'true' ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng mua Linh Quang PhÃ¹</span>
                        </label>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="khoangmach-outer-notification"
                                   ${localStorage.getItem('khoangmach_outer_notification') === 'true' ? 'checked' : ''}>
                            <span>ThÃ´ng bÃ¡o ngoáº¡i tÃ´ng vÃ o khoÃ¡ng</span>
                        </label>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="khoangmach-fast-attack"
                                   ${localStorage.getItem('khoangmach_fast_attack') === 'true' ? 'checked' : ''}>
                            <span>Bá» qua thá»i gian chá» khi táº¥n cÃ´ng</span>
                        </label>
                    </div>

                    <div class="settings-option">
                        <label for="khoangmach-check-interval" title="Khoáº£ng thá»i gian (phÃºt) Ä‘á»ƒ kiá»ƒm tra vÃ  thá»±c hiá»‡n cÃ¡c hÃ nh Ä‘á»™ng liÃªn quan Ä‘áº¿n KhoÃ¡ng Máº¡ch.">Thá»i gian kiá»ƒm tra khoÃ¡ng (phÃºt):</label>
                        <input type="number" id="khoangmach-check-interval" class="settings-input-number"
                               value="${localStorage.getItem('khoangmach_check_interval') || '5'}" min="1" max="60" style="width:60px">
                    </div>
                </div>
            `;
            }



            case 'luyenDan': {
                const minStars = localStorage.getItem('luyenDanMinStars') || '4';
                const autoDecompose = localStorage.getItem('luyenDanAutoDecompose') === 'true';
                const autoTune = localStorage.getItem('luyenDanAutoTune') === 'true';
                const autoUse = localStorage.getItem('luyenDanAutoUse') === 'true';
                const autoStart = localStorage.getItem('luyenDanAutoStart') === 'true';

                // Cáº¥u hÃ¬nh Äan Äá»“ng
                const autoInvite = localStorage.getItem('luyenDanAutoInvite') === 'true';
                const waitSeconds = localStorage.getItem('luyenDanWaitInviteSeconds') || '60';
                const autoAccept = localStorage.getItem('luyenDanAutoAcceptInvite') === 'true';
                const acceptAll = localStorage.getItem('luyenDanAcceptAllInvites') === 'true';
                const autoLeave = localStorage.getItem('luyenDanAutoLeave') === 'true';
                // Äan Chá»§ cÅ©ng tá»± tune khi cÃ³ Äan Äá»“ng (cháº¿ Ä‘á»™ cáº£ 2 cÃ¹ng lo)
                const chuTuneWithDong = localStorage.getItem('luyenDanChuTuneWithDong') === 'true';

                return `
                <div class="settings-section">
                    <h3>CÃ i Ä‘áº·t Luyá»‡n Äan</h3>

                    <div class="settings-option">
                        <label for="luyendan-min-stars">Má»©c sao tá»‘i thiá»ƒu Ä‘á»ƒ giá»¯/sá»­ dá»¥ng (Sao):</label>
                        <select id="luyendan-min-stars" class="settings-select" style="width: 100%; margin-top: 6px;">
                            <option value="1" ${minStars === '1' ? 'selected' : ''}>â­ 1 Sao trá»Ÿ lÃªn</option>
                            <option value="2" ${minStars === '2' ? 'selected' : ''}>â­â­ 2 Sao trá»Ÿ lÃªn</option>
                            <option value="3" ${minStars === '3' ? 'selected' : ''}>â­â­â­ 3 Sao trá»Ÿ lÃªn</option>
                            <option value="4" ${minStars === '4' ? 'selected' : ''}>â­â­â­â­ 4 Sao trá»Ÿ lÃªn (Máº·c Ä‘á»‹nh)</option>
                            <option value="5" ${minStars === '5' ? 'selected' : ''}>â­â­â­â­â­ 5 Sao trá»Ÿ lÃªn (PhÃ¢n giáº£i cáº£ 4â˜…)</option>
                        </select>
                        <p class="settings-description">Má»©c sao lÃ m má»‘c Ä‘á»ƒ phÃ¢n biá»‡t Ä‘an dÆ°á»£c pháº©m cháº¥t tá»‘t hay kÃ©m.</p>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-start" ${autoStart ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng Khai lÃ² khi lÃ² trá»‘ng</span>
                        </label>
                        <p class="settings-description">Náº¿u táº¯t, tool sáº½ khÃ´ng tá»± dÃ¹ng nguyÃªn liá»‡u Ä‘á»ƒ khai lÃ² má»›i (thuáº­n tiá»‡n cho viá»‡c Ä‘i lÃ m Äan Äá»“ng).</p>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-use" ${autoUse ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng sá»­ dá»¥ng Ä‘an pháº©m cháº¥t cao</span>
                        </label>
                        <p class="settings-description">Náº¿u báº­t, Ä‘an Ä‘áº¡t má»©c sao á»Ÿ trÃªn trá»Ÿ lÃªn sáº½ tá»± Ä‘á»™ng Ä‘Æ°á»£c sá»­ dá»¥ng.</p>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-decompose" ${autoDecompose ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng phÃ¢n giáº£i Ä‘an pháº©m cháº¥t kÃ©m</span>
                        </label>
                        <p class="settings-description">Náº¿u báº­t, Ä‘an cÃ³ sá»‘ sao tháº¥p hÆ¡n má»©c sao á»Ÿ trÃªn sáº½ tá»± Ä‘á»™ng bá»‹ phÃ¢n giáº£i Ä‘á»ƒ thu nguyÃªn liá»‡u.</p>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-tune" ${autoTune ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng Ä‘iá»u hoÃ  (giá»¯ Ä‘á»™ á»•n Ä‘á»‹nh)</span>
                        </label>
                        <p class="settings-description">Tá»± Ä‘á»™ng báº¥m "Äiá»u Hoáº£" Ä‘á»ƒ giá»¯ á»•n Ä‘á»‹nh cho lÃ² Ä‘an khi Ä‘á»™ á»•n Ä‘á»‹nh xuá»‘ng tháº¥p (<= 68%). Ãp dá»¥ng khi báº¡n lÃ  Äan Chá»§ (lÃ² cá»§a báº¡n).</p>
                    </div>
                </div>

                <div class="settings-section" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px; margin-top: 15px;">
                    <h3>Cháº¿ Äá»™ Äiá»u Hoáº£ Khi LÃ m <span style="color:#f59e0b;">Äan Äá»“ng</span></h3>

                    <div class="settings-option">
                        <p class="settings-description" style="margin-bottom:8px;">Khi báº¡n Ä‘ang há»— trá»£ lÃ² cá»§a Äan Chá»§ (vai Äan Äá»“ng), chá»n cÃ¡ch tool xá»­ lÃ½ Ä‘iá»u hoáº£:</p>
                        <div style="display:flex; gap:0; border:1px solid rgba(255,255,255,0.2); border-radius:8px; overflow:hidden;">
                            <label id="dong-tune-auto-label" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:9px 12px; cursor:pointer; font-size:12px; font-weight:600; transition:all 0.2s;">
                                <input type="radio" name="dong-tune-mode" id="dong-tune-mode-auto" value="auto" ${(localStorage.getItem('luyenDanDongTuneMode') || 'auto') === 'auto' ? 'checked' : ''} style="display:none;">
                                ðŸ”¥ Tá»± Ä‘iá»u hoáº£
                            </label>
                            <label id="dong-tune-wait-label" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:9px 12px; cursor:pointer; font-size:12px; font-weight:600; transition:all 0.2s; border-left:1px solid rgba(255,255,255,0.15);">
                                <input type="radio" name="dong-tune-mode" id="dong-tune-mode-wait" value="both" ${(localStorage.getItem('luyenDanDongTuneMode') || 'auto') === 'both' ? 'checked' : ''} style="display:none;">
                                ðŸ¤ Cáº£ 2 cÃ¹ng lo
                            </label>
                        </div>
                        <p class="settings-description" style="margin-top:8px;">
                            <b>ðŸ”¥ Tá»± Ä‘iá»u hoáº£:</b> Chá»‰ Äan Äá»“ng lo Ä‘iá»u hoáº£. Äan Chá»§ sáº½ nhÆ°á»ng (khÃ´ng báº¥m tune) khi cÃ³ Äan Äá»“ng trong lÃ².<br>
                            <b>ðŸ¤ Cáº£ 2 cÃ¹ng lo:</b> Äan Äá»“ng váº«n Ä‘iá»u hoáº£ nhÆ° thÆ°á»ng. Äan Chá»§ cÅ©ng tá»± Ä‘iá»u hoáº£ song song â€” phÃ¹ há»£p khi cáº£ 2 Ä‘á»u online.
                        </p>
                    </div>
                </div>

                <div class="settings-section" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px; margin-top: 15px;">
                    <h3>CÃ i Ä‘áº·t Äan Äá»“ng (Há»— trá»£ Luyá»‡n Äan)</h3>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-invite" ${autoInvite ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng má»i Äan Äá»“ng khi lÃ² trá»‘ng</span>
                        </label>
                        <p class="settings-description">Tá»± Ä‘á»™ng gá»­i lá»i má»i tá»›i báº¡n bÃ¨ Ä‘Æ°á»£c chá»n trÆ°á»›c khi tiáº¿n hÃ nh Khai lÃ².</p>
                    </div>

                    <div class="settings-option" id="luyendan-wait-time-option" style="display: ${autoInvite ? 'block' : 'none'};">
                        <label for="luyendan-wait-seconds">Thá»i gian tá»‘i Ä‘a chá» Äan Äá»“ng vÃ o phÃ²ng (giÃ¢y):</label>
                        <input type="number" id="luyendan-wait-seconds" class="settings-input-number"
                               value="${waitSeconds}" min="10" max="300" style="width:70px; margin-top:4px;">
                        <p class="settings-description">QuÃ¡ thá»i gian nÃ y mÃ  Äan Äá»“ng chÆ°a vÃ o Ä‘á»§, tool sáº½ tá»± Ä‘á»™ng Khai lÃ² Ä‘an.</p>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-accept" ${autoAccept ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng nháº­n lÃ m Äan Äá»“ng</span>
                        </label>
                        <p class="settings-description">Tá»± Ä‘á»™ng cháº¥p nháº­n khi cÃ³ Äan Chá»§ gá»­i lá»i má»i há»— trá»£ luyá»‡n Ä‘an.</p>
                    </div>

                    <div class="settings-option" id="luyendan-accept-all-option" style="display: ${autoAccept ? 'block' : 'none'};">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-accept-all" ${acceptAll ? 'checked' : ''}>
                            <span>Nháº­n lá»i má»i tá»« báº¥t ká»³ ai</span>
                        </label>
                        <p class="settings-description">Náº¿u táº¯t, chá»‰ tá»± Ä‘á»™ng nháº­n lá»i má»i tá»« nhá»¯ng ngÆ°á»i Ä‘Æ°á»£c tÃ­ch chá»n trong danh sÃ¡ch báº¡n bÃ¨ phÃ­a dÆ°á»›i.</p>
                    </div>

                    <div class="settings-option">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-auto-leave" ${autoLeave ? 'checked' : ''}>
                            <span>Tá»± Ä‘á»™ng rá»i Äan Äá»“ng sau 5 phÃºt</span>
                        </label>
                        <p class="settings-description">Sau khi há»— trá»£ Äiá»u Há»a xong (háº¿t 5 phÃºt Ä‘áº§u) hoáº·c khi lÃ² ná»•, tool sáº½ tá»± rá»i vá»‹ trÃ­ Äan Äá»“ng.</p>
                    </div>

                    <div class="settings-option" style="border-top:1px solid rgba(255,255,255,0.06); padding-top:10px; margin-top:4px;">
                        <label class="settings-checkbox-label">
                            <input type="checkbox" id="luyendan-chu-tune-with-dong" ${chuTuneWithDong ? 'checked' : ''}>
                            <span style="color:#f0b429;">âš¡ [Äan Chá»§] CÅ©ng tá»± Ä‘iá»u hoáº£ khi cÃ³ Äan Äá»“ng trong lÃ²</span>
                        </label>
                        <p class="settings-description">Báº­t khi báº¡n lÃ  <b>Äan Chá»§</b> vÃ  muá»‘n script cá»§a báº¡n tá»± Ä‘iá»u hoáº£ song song vá»›i Äan Äá»“ng (cháº¿ Ä‘á»™ "Cáº£ 2 cÃ¹ng lo"). Máº·c Ä‘á»‹nh táº¯t â†’ Äan Chá»§ nhÆ°á»ng Äan Äá»“ng Ä‘iá»u hoáº£.</p>
                    </div>

                    <div class="settings-option" id="luyendan-friends-list-section" style="margin-top:12px; display: ${(autoInvite || autoAccept) ? 'block' : 'none'};">
                        <label style="font-weight:bold; color:#d0d8f0;">Chá»n báº¡n bÃ¨ há»— trá»£ (Má»i / Nháº­n lá»i má»i):</label>
                        <div style="margin-top:6px; display:flex; gap:6px;">
                            <input type="text" id="luyendan-friend-search" class="settings-input" placeholder="TÃ¬m tÃªn báº¡n bÃ¨..." style="flex:1; padding:4px 8px; font-size:11px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:4px; color:#fff;">
                        </div>
                        <div id="luyendan-friends-container" style="max-height:160px; overflow-y:auto; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.08); border-radius:4px; margin-top:6px; padding:6px; display:flex; flex-direction:column; gap:4px;">
                            <p style="font-size:11px; color:#888; text-align:center; padding:10px 0; margin:0;">â³ Äang táº£i danh sÃ¡ch báº¡n bÃ¨...</p>
                        </div>
                    </div>
                </div>
            `;
            }

            default:
                return `<div class="settings-section"><p>KhÃ´ng cÃ³ cÃ i Ä‘áº·t cho nhiá»‡m vá»¥ nÃ y</p></div>`;

            case 'log':
                return `
                <div class="settings-section" style="padding:8px">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                        <h3 style="margin:0">ðŸ“‹ Lá»‹ch Sá»­ Log</h3>
                        <div style="display:flex;gap:6px">
                            <select id="hh3d-log-filter" style="font-size:11px;padding:2px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.07);color:#d0d8f0">
                                <option value="all">Táº¥t cáº£</option>
                                <option value="success">âœ… Success</option>
                                <option value="warn">âš ï¸ Warn</option>
                                <option value="error">âŒ Error</option>
                                <option value="info">â„¹ï¸ Info</option>
                                <option value="debug">ðŸ” Debug</option>
                            </select>
                            <button id="hh3d-log-clear" style="font-size:11px;padding:2px 8px;border-radius:4px;border:1px solid rgba(239,68,68,0.4);background:rgba(239,68,68,0.1);color:#f87171;cursor:pointer">ðŸ—‘ XÃ³a</button>
                        </div>
                    </div>
                    <div id="hh3d-log-list" style="height:380px;overflow-y:auto;background:rgba(0,0,0,0.3);border-radius:4px;border:1px solid rgba(255,255,255,0.08)"></div>
                </div>
            `;
        }
    }

    // ===============================================
    // BIND EVENTS CHO SETTINGS
    // ===============================================
    function bindSettingsEventsForTask(taskId) {
        switch (taskId) {
            case 'general': {
                const resetBtn = document.getElementById('general-reset-tasks-btn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        const accId = localStorage.getItem('hh3d_account_id') || accountId;
                        const count = taskTracker.resetAllTasks(accId);
                        showNotification(`âœ… ÄÃ£ reset ${count} nhiá»‡m vá»¥`, 'success', 2000);
                        updateAllQuestButtons();
                    });
                }
                // Restore saved open-mode preference
                const _linkModeKey = 'general_link_open_mode';
                const _savedMode = localStorage.getItem(_linkModeKey) || 'new';
                const _modeNewRadio = document.getElementById('link-mode-new');
                const _modeCurrentRadio = document.getElementById('link-mode-current');
                if (_modeNewRadio) _modeNewRadio.checked = _savedMode === 'new';
                if (_modeCurrentRadio) _modeCurrentRadio.checked = _savedMode === 'current';
                document.querySelectorAll('input[name="link-open-mode"]').forEach(radio => {
                    radio.addEventListener('change', () => localStorage.setItem(_linkModeKey, radio.value));
                });

                document.querySelectorAll('.general-link-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const path = btn.getAttribute('data-path');
                        if (!path) return;
                        const url = weburl.replace(/\/$/, '') + path;
                        const mode = localStorage.getItem(_linkModeKey) || 'new';
                        if (mode === 'current') window.location.href = url;
                        else window.open(url, '_blank');
                    });
                });
                break;
            }

            case 'hoangvuc':
                // No special events needed, just checkbox
                break;

            case 'khoangmach': {
                // Async load danh sÃ¡ch má»
                const km_sel = document.getElementById('khoangmach-mine-select');
                const km_reloadBtn = document.getElementById('khoangmach-reload-mines-btn');
                const km_accountId = localStorage.getItem('hh3d_account_id') || '';

                const km_populateMines = (force = false) => {
                    if (km_sel) km_sel.innerHTML = '<option value="">â³ Äang táº£i...</option>';
                    if (km_reloadBtn) { km_reloadBtn.disabled = true; km_reloadBtn.textContent = 'â³'; }
                    khoangmach.getAllMines(force).then(({ optionsHtml, minesData }) => {
                        const savedMineSetting = localStorage.getItem(`khoangmach_selected_mine_${km_accountId}`);
                        let savedMineId = '';
                        try { savedMineId = savedMineSetting ? JSON.parse(savedMineSetting).id : ''; } catch (e) { }
                        km_sel.innerHTML = `<option value="">-- Chá»n má» --</option>` + optionsHtml;
                        if (savedMineId) {
                            const opt = km_sel.querySelector(`option[value="${savedMineId}"]`);
                            if (opt) opt.selected = true;
                        }
                        minesData.forEach(mine => {
                            const opt = km_sel.querySelector(`option[value="${mine.id}"]`);
                            if (opt) opt.dataset.mine = JSON.stringify({ id: mine.id, type: mine.type });
                        });
                        if (force) showNotification(`âœ… ÄÃ£ táº£i ${minesData.length} má»`, 'success', 1500);
                    }).catch(() => {
                        km_sel.innerHTML = '<option value="">âš ï¸ KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch má»</option>';
                    }).finally(() => {
                        if (km_reloadBtn) { km_reloadBtn.disabled = false; km_reloadBtn.textContent = 'ðŸ”„ Load'; }
                    });
                };

                km_populateMines(false);

                if (km_reloadBtn) {
                    km_reloadBtn.addEventListener('click', () => km_populateMines(true));
                }
                break;
            }



            case 'luyenDan': {
                const autoInviteCheck = document.getElementById('luyendan-auto-invite');
                const autoAcceptCheck = document.getElementById('luyendan-auto-accept');
                const waitOption = document.getElementById('luyendan-wait-time-option');
                const acceptAllOption = document.getElementById('luyendan-accept-all-option');
                const friendsListSection = document.getElementById('luyendan-friends-list-section');

                const updateFriendsVisibility = () => {
                    const inviteVal = autoInviteCheck?.checked || false;
                    const acceptVal = autoAcceptCheck?.checked || false;

                    if (waitOption) waitOption.style.display = inviteVal ? 'block' : 'none';
                    if (acceptAllOption) acceptAllOption.style.display = acceptVal ? 'block' : 'none';
                    if (friendsListSection) friendsListSection.style.display = (inviteVal || acceptVal) ? 'block' : 'none';
                };

                if (autoInviteCheck) autoInviteCheck.addEventListener('change', updateFriendsVisibility);
                if (autoAcceptCheck) autoAcceptCheck.addEventListener('change', updateFriendsVisibility);

                // Táº£i danh sÃ¡ch báº¡n bÃ¨ báº¥t Ä‘á»“ng bá»™
                const friendsContainer = document.getElementById('luyendan-friends-container');
                const searchInput = document.getElementById('luyendan-friend-search');

                if (friendsContainer) {
                    luyendan.sendLdRequest("/friends", "GET").then(friendsRes => {
                        const friends = friendsRes?.data?.friends || [];
                        if (!friends.length) {
                            friendsContainer.innerHTML = '<p style="font-size:11px; color:#888; text-align:center; padding:10px 0; margin:0;">ðŸ“­ KhÃ´ng tÃ¬m tháº¥y Ä‘áº¡o há»¯u nÃ o</p>';
                            return;
                        }

                        const savedIds = (localStorage.getItem('luyenDanSelectedFriendIds') || '').split(',').filter(Boolean);

                        const renderFriends = (filterText = '') => {
                            const normalizedFilter = filterText.toLowerCase().trim();
                            const filtered = friends.filter(f => !normalizedFilter || (f.name || '').toLowerCase().includes(normalizedFilter));

                            if (!filtered.length) {
                                friendsContainer.innerHTML = '<p style="font-size:11px; color:#888; text-align:center; padding:10px 0; margin:0;">ðŸ” KhÃ´ng khá»›p tÃªn báº¡n bÃ¨</p>';
                                return;
                            }

                            friendsContainer.innerHTML = filtered.map(f => {
                                const uid = String(f.userId != null ? f.userId : f.id);
                                const isChecked = savedIds.includes(uid);
                                const lvlName = f.rank_level_name || (f.rank_level ? `Báº­c ${f.rank_level}` : '');
                                return `
                                    <label style="display:flex; align-items:center; gap:6px; font-size:11px; padding:2px 4px; cursor:pointer;">
                                        <input type="checkbox" class="luyendan-friend-checkbox" value="${uid}" ${isChecked ? 'checked' : ''} style="margin:0;">
                                        <span style="color:#d0d8f0;">${f.name || `Äáº¡o há»¯u #${uid}`}</span>
                                        ${lvlName ? `<span style="color:#10b981; font-size:9px;">(${lvlName})</span>` : ''}
                                    </label>
                                `;
                            }).join('');
                        };

                        renderFriends();

                        if (searchInput) {
                            searchInput.addEventListener('input', (e) => {
                                renderFriends(e.target.value);
                            });
                        }
                    }).catch(err => {
                        console.error('Error fetching friends list:', err);
                        friendsContainer.innerHTML = '<p style="font-size:11px; color:#ef4444; text-align:center; padding:10px 0; margin:0;">âš ï¸ Lá»—i táº£i danh sÃ¡ch báº¡n bÃ¨</p>';
                    });
                }

                // Bind radio buttons cháº¿ Ä‘á»™ Ä‘iá»u hoáº£ Äan Äá»“ng (visual highlight)
                const updateDongTuneUI = () => {
                    const autoLabel = document.getElementById('dong-tune-auto-label');
                    const waitLabel = document.getElementById('dong-tune-wait-label');
                    const isAuto = document.getElementById('dong-tune-mode-auto')?.checked;
                    if (autoLabel) {
                        autoLabel.style.background = isAuto ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.04)';
                        autoLabel.style.color = isAuto ? '#f59e0b' : '#9ca3af';
                    }
                    if (waitLabel) {
                        waitLabel.style.background = !isAuto ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)';
                        waitLabel.style.color = !isAuto ? '#818cf8' : '#9ca3af';
                    }
                };
                // Khá»Ÿi táº¡o tráº¡ng thÃ¡i hiá»ƒn thá»‹ ban Ä‘áº§u
                updateDongTuneUI();
                // Gáº¯n sá»± kiá»‡n click cho cáº£ label Ä‘á»ƒ báº¯t khi click vÃ o label (radio áº©n)
                const autoLabel = document.getElementById('dong-tune-auto-label');
                const waitLabel = document.getElementById('dong-tune-wait-label');
                if (autoLabel) autoLabel.addEventListener('click', () => setTimeout(updateDongTuneUI, 10));
                if (waitLabel) waitLabel.addEventListener('click', () => setTimeout(updateDongTuneUI, 10));
                break;
            }

            case 'bicanh':
            case 'general':
                // No special events
                break;

            case 'log': {
                const logList = document.getElementById('hh3d-log-list');
                const logFilter = document.getElementById('hh3d-log-filter');
                const logClear = document.getElementById('hh3d-log-clear');

                const renderLogs = (filter = 'all') => {
                    if (!logList) return;
                    logList.innerHTML = '';
                    const entries = (window.hh3dLogBuffer || []).filter(e => filter === 'all' || e.type === filter);
                    // Oldest first â†’ newest at bottom
                    for (let i = 0; i < entries.length; i++) {
                        _hh3dRenderLogLine(logList, entries[i], false);
                    }
                    logList.scrollTop = logList.scrollHeight;
                };

                renderLogs('all');

                if (logFilter) logFilter.addEventListener('change', () => renderLogs(logFilter.value));
                if (logClear) logClear.addEventListener('click', () => {
                    window.hh3dLogBuffer = [];
                    renderLogs('all');
                });
                break;
            }

            default:
                break;
        }
    }

    // ===============================================
    // LÆ¯U Táº¤T Cáº¢ CÃ€I Äáº¶T
    // ===============================================
    function saveAllSettings() {
        // XÃ¡c Ä‘á»‹nh tab hiá»‡n táº¡i
        const activeTab = document.querySelector('.settings-tab.active');
        if (!activeTab) return;

        const taskId = activeTab.getAttribute('data-task');
        const accountId = localStorage.getItem('hh3d_account_id') || '';
        let saved = false;

        try {
            switch (taskId) {
                case 'general': {
                    const h = parseInt(document.getElementById('general-restart-hour')?.value ?? '0', 10) || 0;
                    const m = parseInt(document.getElementById('general-restart-minute')?.value ?? '30', 10);
                    const vipMode = document.getElementById('general-vip-mode')?.checked || false;
                    localStorage.setItem('selfSchedule_h', String(h));
                    localStorage.setItem('selfSchedule_m', String(m));
                    localStorage.setItem('generalVipMode', String(vipMode));
                    saved = true;
                    break;
                }

                case 'hoangvuc':
                    const maximizeDamage = document.getElementById('hoangvuc-maximize-damage')?.checked || false;
                    localStorage.setItem('hoangvucMaximizeDamage', maximizeDamage.toString());
                    saved = true;
                    break;

                case 'khoangmach': {
                    const km_useBuff = document.getElementById('khoangmach-use-buff')?.checked || false;
                    const km_fastAttack = document.getElementById('khoangmach-fast-attack')?.checked || false;
                    const km_autoTakeover = document.getElementById('khoangmach-auto-takeover')?.checked || false;
                    const km_autoTakeoverRotation = document.getElementById('khoangmach-auto-takeover-rotation')?.checked || false;
                    const km_outerNotification = document.getElementById('khoangmach-outer-notification')?.checked || false;
                    const km_leaveMine = document.getElementById('khoangmach-leave-mine')?.checked || false;
                    const km_rewardMode = document.getElementById('khoangmach-reward-mode')?.value || 'any';
                    const km_rewardTime = document.getElementById('khoangmach-reward-time')?.value || 'max';
                    const km_checkInterval = parseInt(document.getElementById('khoangmach-check-interval')?.value || '5', 10);

                    // LÆ°u má» Ä‘Ã£ chá»n (data-mine chá»©a JSON {id, type})
                    const km_mineSelect = document.getElementById('khoangmach-mine-select');
                    if (km_mineSelect && km_mineSelect.value) {
                        const mineData = km_mineSelect.options[km_mineSelect.selectedIndex]?.dataset?.mine;
                        if (mineData) localStorage.setItem(`khoangmach_selected_mine_${accountId}`, mineData);
                    }

                    localStorage.setItem('khoangmach_use_buff', String(km_useBuff));
                    localStorage.setItem('khoangmach_fast_attack', String(km_fastAttack));
                    localStorage.setItem('khoangmach_auto_takeover', String(km_autoTakeover));
                    localStorage.setItem('khoangmach_auto_takeover_rotation', String(km_autoTakeoverRotation));
                    localStorage.setItem('khoangmach_outer_notification', String(km_outerNotification));
                    localStorage.setItem(`khoangmach_leave_mine_to_claim_reward_${accountId}`, String(km_leaveMine));
                    localStorage.setItem('khoangmach_reward_mode', km_rewardMode);
                    localStorage.setItem('khoangmach_reward_time', km_rewardTime);
                    localStorage.setItem('khoangmach_check_interval', isNaN(km_checkInterval) || km_checkInterval < 1 ? '5' : String(km_checkInterval));
                    saved = true;
                    break;
                }



                case 'bicanh':
                    const reserveAttacks = parseInt(document.getElementById('bicanh-reserve-attacks')?.value || '0', 10);
                    const socketEnabled = document.getElementById('bicanh-socket-enabled')?.checked || false;

                    localStorage.setItem('reservebicanhAttacks', Math.max(0, Math.min(5, reserveAttacks)).toString());
                    localStorage.setItem('bicanhSocketEnabled', socketEnabled ? '1' : '0');

                    // Apply socket changes immediately
                    if (socketEnabled) {
                        if (typeof bicanhhiente !== 'undefined' && bicanhhiente.startBossSocketListener) {
                            bicanhhiente.startBossSocketListener();
                        }
                    } else {
                        if (typeof bicanhhiente !== 'undefined' && bicanhhiente.stopBossSocketListener) {
                            bicanhhiente.stopBossSocketListener();
                        }
                    }
                    saved = true;
                    break;

                case 'luyenDan': {
                    const minStars = document.getElementById('luyendan-min-stars')?.value || '4';
                    const autoUse = document.getElementById('luyendan-auto-use')?.checked ?? true;
                    const autoStart = document.getElementById('luyendan-auto-start')?.checked ?? true;
                    const autoDecompose = document.getElementById('luyendan-auto-decompose')?.checked ?? true;
                    const autoTune = document.getElementById('luyendan-auto-tune')?.checked ?? true;

                    const autoInvite = document.getElementById('luyendan-auto-invite')?.checked ?? false;
                    const waitSeconds = document.getElementById('luyendan-wait-seconds')?.value || '60';
                    const autoAccept = document.getElementById('luyendan-auto-accept')?.checked ?? false;
                    const acceptAll = document.getElementById('luyendan-accept-all')?.checked ?? true;
                    const autoLeave = document.getElementById('luyendan-auto-leave')?.checked ?? false;
                    const chuTuneWithDong = document.getElementById('luyendan-chu-tune-with-dong')?.checked ?? false;

                    // Cháº¿ Ä‘á»™ Ä‘iá»u hoáº£ khi lÃ m Äan Äá»“ng
                    const dongTuneModeEl = document.querySelector('input[name="dong-tune-mode"]:checked');
                    const dongTuneMode = dongTuneModeEl ? dongTuneModeEl.value : 'auto';

                    const checkedCheckboxes = document.querySelectorAll('.luyendan-friend-checkbox:checked');
                    const selectedIds = Array.from(checkedCheckboxes).map(cb => cb.value).join(',');

                    localStorage.setItem('luyenDanMinStars', minStars);
                    localStorage.setItem('luyenDanAutoStart', String(autoStart));
                    localStorage.setItem('luyenDanAutoUse', String(autoUse));
                    localStorage.setItem('luyenDanAutoDecompose', String(autoDecompose));
                    localStorage.setItem('luyenDanAutoTune', String(autoTune));

                    localStorage.setItem('luyenDanAutoInvite', String(autoInvite));
                    localStorage.setItem('luyenDanWaitInviteSeconds', waitSeconds);
                    localStorage.setItem('luyenDanAutoAcceptInvite', String(autoAccept));
                    localStorage.setItem('luyenDanAcceptAllInvites', String(acceptAll));
                    localStorage.setItem('luyenDanAutoLeave', String(autoLeave));
                    localStorage.setItem('luyenDanChuTuneWithDong', String(chuTuneWithDong));
                    localStorage.setItem('luyenDanSelectedFriendIds', selectedIds);
                    localStorage.setItem('luyenDanDongTuneMode', dongTuneMode);

                    saved = true;
                    break;
                }
            }

            if (saved) {
                showNotification('âœ… ÄÃ£ lÆ°u cÃ i Ä‘áº·t!', 'success', 2000);
                // Close modal after short delay
                setTimeout(() => {
                    document.getElementById('unified-settings-modal').style.display = 'none';
                }, 500);
            }
        } catch (error) {
            console.error('[Settings] Error saving:', error);
            showNotification('âŒ Lá»—i khi lÆ°u cÃ i Ä‘áº·t', 'error');
        }
    }

    // ===============================================
    // NHáº¬P MÃƒ THÆ¯á»žNG (PROMO CODE)
    // ===============================================

    async function submitPromoCode(promoCode) {
        const logPrefix = '[Nháº­p mÃ£]';

        if (!promoCode || promoCode.trim() === '') {
            showNotification(`${logPrefix} âš ï¸ MÃ£ CODE khÃ´ng há»£p lá»‡`, 'warning');
            return;
        }

        try {
            // Láº¥y nonce tá»« trang linh tháº¡ch
            const nonce = await getSecurityNonce(weburl + "linh-thach?t", "redeem_linh_thach");

            if (!nonce) {
                showNotification(`${logPrefix} âŒ KhÃ´ng thá»ƒ láº¥y nonce`, 'error');
                return;
            }

            showNotification(`${logPrefix} ðŸ“¤ Äang nháº­p mÃ£: ${promoCode}...`, 'info');

            const response = await fetch(ajaxUrl, {
                credentials: "include",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
                    "Accept": "*/*",
                    "Accept-Language": "vi,en-US;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    Priority: "u=0"
                },
                body: `action=redeem_linh_thach&code=${encodeURIComponent(promoCode)}&nonce=${nonce}&lt_token=${securityToken}&hold_timestamp=${Math.floor(
                    Date.now() / 1000
                )}`,
                method: "POST",
                mode: "cors"
            });

            const data = await response.json();

            if (data.success) {
                showNotification(`${logPrefix} âœ… ${data.data.message}`, 'success');
                // LÆ°u mÃ£ Ä‘Ã£ nháº­p vÃ o localStorage
                localStorage.setItem(`promo_code_${accountId}`, promoCode);
                // XÃ³a input
                const input = document.getElementById('promo-code-input');
                if (input) input.value = '';
            } else if (data.data?.message === "âš ï¸ Äáº¡o há»¯u Ä‘Ã£ háº¥p thá»¥ linh tháº¡ch nÃ y rá»“i!") {
                showNotification(`${logPrefix} ${data.data.message || JSON.stringify(data)}`, 'warn');
                localStorage.setItem(`promo_code_${accountId}`, promoCode);
            } else {
                showNotification(`${logPrefix} âŒ ${data.data?.message || data.message || "KhÃ´ng xÃ¡c Ä‘á»‹nh"}`, 'error');
            }
        } catch (error) {
            console.error(`${logPrefix} Lá»—i:`, error);
            showNotification(`${logPrefix} âŒ Lá»—i: ${error.message}`, 'error');
        }
    }

    // ===============================================
    // Váº¤N ÄÃP
    // ===============================================

    class VanDap {
        constructor(nonce) {
            this.nonce = nonce;
            this.ajaxUrl = ajaxUrl;
            this.QUESTION_DATA_URL = "https://raw.githubusercontent.com/Enormit/tool-automation/refs/heads/main/VanDap.json";
            this.taskTracker = taskTracker;
            this.questionDataCache = null;
        }

        // ðŸ”§ normalizeText riÃªng
        normalizeText(str) {
            return str
                .normalize("NFC")   // chuáº©n hÃ³a Unicode
                .toLowerCase()
                .trim()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\s]/g, '');
        }


        tokenize(str) {
            if (typeof str !== "string") return [];
            return str
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
                .trim()
                .split(/\s+/)
                .filter(x => x);
        }

        /**
         * Táº£i dá»¯ liá»‡u Ä‘Ã¡p Ã¡n vÃ  lÆ°u vÃ o cache.
         */
        async loadAnswersFromHub() {
            const cacheKey = "hh3d_vandap_cache";
            const cacheTimeKey = "hh3d_vandap_cache_time";
            const ONE_HOUR = 60 * 60 * 1000; // 1 hour in ms

            try {
                const cachedData = localStorage.getItem(cacheKey);
                const cachedTime = localStorage.getItem(cacheTimeKey);
                const now = Date.now();

                if (cachedData && cachedTime && (now - parseInt(cachedTime, 10) < ONE_HOUR)) {
                    try {
                        this.questionDataCache = JSON.parse(cachedData);
                        console.log("[Váº¥n ÄÃ¡p] âš¡ ÄÃ£ táº£i dá»¯ liá»‡u Ä‘Ã¡p Ã¡n tá»« LocalStorage Cache.");
                        return;
                    } catch (err) {
                        console.warn("[Váº¥n ÄÃ¡p] Lá»—i parse JSON tá»« cache LocalStorage, tiáº¿n hÃ nh táº£i má»›i:", err);
                    }
                }

                // Ã©p táº£i má»›i báº±ng cÃ¡ch thÃªm timestamp
                const urlWithBypass = this.QUESTION_DATA_URL + "?t=" + now;
                const response = await fetch(urlWithBypass, { cache: "no-store" });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                this.questionDataCache = data;

                // LÆ°u láº¡i cache
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    localStorage.setItem(cacheTimeKey, now.toString());
                } catch (storageErr) {
                    console.warn("[Váº¥n ÄÃ¡p] KhÃ´ng thá»ƒ lÆ°u cache vÃ o LocalStorage:", storageErr);
                }

                console.log("[Váº¥n ÄÃ¡p] âœ… ÄÃ£ táº£i dá»¯ liá»‡u má»›i tá»« hub vÃ  lÆ°u vÃ o cache:", urlWithBypass);
            } catch (e) {
                showNotification('Lá»—i khi táº£i Ä‘Ã¡p Ã¡n. Vui lÃ²ng thá»­ láº¡i.', 'error');
                throw e;
            }
        }

        /**
         * Kiá»ƒm tra cÃ¢u há»i trong cache vÃ  gá»­i Ä‘Ã¡p Ã¡n lÃªn server.
        */
        /**
    * TÃ¬m cÃ¢u tráº£ lá»i Ä‘Ãºng cho má»™t cÃ¢u há»i vÃ  gá»­i nÃ³ Ä‘i.
    * @param {object} question Äá»‘i tÆ°á»£ng cÃ¢u há»i tá»« mÃ¡y chá»§.
    * @param {object} headers Headers cá»§a yÃªu cáº§u Ä‘á»ƒ gá»­i Ä‘i.
    * @returns {Promise<boolean>} True náº¿u cÃ¢u tráº£ lá»i Ä‘Æ°á»£c gá»­i thÃ nh cÃ´ng, ngÆ°á»£c láº¡i lÃ  false.
    */
        async checkAnswerAndSubmit(question, headers) {

            const normalizedIncomingQuestion = this.normalizeText(question.question);// system question

            //check log cÃ¢u há»i tá»« há»‡ thá»‘ng vÃ  cÃ¢u há»i tá»« hub
            console.log("Incoming Question (gá»‘c):", question.question);
            console.log("Incoming Question (normalized):", normalizedIncomingQuestion);
            // console.log("Stored keys(normalized):", Object.keys(this.questionDataCache.questions).map(k => this.normalizeText(k)));

            let foundAnswer = null;
            let matchedQuestionKey = null;

            for (const storedQuestionKey in this.questionDataCache.questions) {
                const normalizedStoredQuestionKey = this.normalizeText(storedQuestionKey);
                if (normalizedStoredQuestionKey === normalizedIncomingQuestion) {
                    matchedQuestionKey = storedQuestionKey;
                    foundAnswer = this.questionDataCache.questions[storedQuestionKey];
                    break;
                }
            }


            if (!foundAnswer) {
                console.warn("[Váº¥n ÄÃ¡p] âŒ KhÃ´ng tÃ¬m tháº¥y cÃ¢u há»i trong cache:", question.question, "Normalized Question:", normalizedIncomingQuestion);
                showNotification(`<b>Váº¥n ÄÃ¡p:</b> KhÃ´ng tÃ¬m tháº¥y Ä‘Ã¡p Ã¡n cho cÃ¢u há»i: <i>${question.question}</i>`, 'error');
                return false;
            }

            // TÃ¬m chá»‰ má»¥c (Index) trong options
            // Æ¯u tiÃªn 1: TÃ¬m chÃ­nh xÃ¡c (Exact Match)
            let answerIndex = question.options.findIndex(option =>
                this.normalizeText(option) === this.normalizeText(foundAnswer));
            //  console.log("Answer index:", answerIndex, "Option chosen:", question.options[answerIndex]);

            // Æ¯u tiÃªn 2: Náº¿u khÃ´ng tháº¥y, tÃ¬m theo Ä‘iá»ƒm trÃ¹ng tá»« (Similarity Score)
            if (answerIndex === -1) {

                let maxScore = -1;
                let bestIdx = -1;
                const targetTokens = this.tokenize(foundAnswer);
                question.options.forEach((option, idx) => {
                    const optTokens = this.tokenize(option);
                    const intersection = optTokens.filter(token => targetTokens.includes(token));
                    const score = intersection.length;

                    if (score > maxScore) {
                        maxScore = score;
                        bestIdx = idx;
                    }
                });

                if (bestIdx > -1 && maxScore > 0) {
                    answerIndex = bestIdx;
                    console.log(`[Váº¥n ÄÃ¡p] ðŸŽ¯ Chá»n option theo Ä‘iá»ƒm cao nháº¥t (${maxScore}): ${question.options[bestIdx]}`);
                }
            }
            // Náº¿u váº«n khÃ´ng tÃ¬m tháº¥y
            if (answerIndex === -1) {
                console.warn("[Váº¥n ÄÃ¡p] âŒ KhÃ´ng khá»›p option nÃ o.");
                console.warn("Options (gá»‘c):", question.options);
                console.warn("Options (normalized):", question.options.map(opt => this.normalizeText(opt)));
                console.warn("ÄÃ¡p Ã¡n tá»« GitHub:", foundAnswer);
                console.log("ÄÃ¡p Ã¡n tá»« GitHub (normalized):", this.normalizeText(foundAnswer));
                //console.log("Unicode tá»«ng kÃ½ tá»± Ä‘Ã¡p Ã¡n:", [...foundAnswer].map(c => c.charCodeAt(0).toString(16)));
                showNotification(`Váº¥n ÄÃ¡p: CÃ¢u há»i: <i>${question.question}</i> khÃ´ng cÃ³ Ä‘Ã¡p Ã¡n Ä‘Ãºng trong server.`, 'error');
                return false;
            }

            const payloadSubmitAnswer = new URLSearchParams();
            payloadSubmitAnswer.append('action', 'save_quiz_result');
            payloadSubmitAnswer.append('question_id', question.id);
            payloadSubmitAnswer.append('answer', answerIndex);
            payloadSubmitAnswer.append('security_token', securityToken);

            //console.log("Submit payload:", { question_id: question.id, answer: answerIndex, security_token: securityToken });

            try {
                const responseSubmit = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    headers: headers,
                    body: payloadSubmitAnswer,
                    credentials: 'include'
                });

                const dataSubmit = await responseSubmit.json();

                //console.log("Server response:", dataSubmit);

                if (dataSubmit.success) {
                    return { success: true };
                } else {
                    const msg = dataSubmit?.data?.message || dataSubmit?.message || "Server khÃ´ng tráº£ vá» thÃ´ng Ä‘iá»‡p lá»—i";
                    return { success: false, reason: "server_error", message: msg };
                }
            } catch (error) {
                const msg = error?.message || JSON.stringify(error) || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh";
                return { success: false, reason: "exception", message: msg };
            }
        }


        /**
         * Thá»±c hiá»‡n toÃ n bá»™ quy trÃ¬nh váº¥n Ä‘Ã¡p.
         */
        async doVanDap(nonce) {
            const securityToken = await getSecurityToken(weburl + 'van-dap-tong-mon?t');
            try {
                await this.loadAnswersFromHub();

                console.log('[HH3D Váº¥n ÄÃ¡p] â–¶ï¸ Báº¯t Ä‘áº§u Váº¥n ÄÃ¡p');
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Wp-Nonce': nonce,
                };

                let correctCount = 0;
                let answeredThisSession = 0;
                const maxAttempts = 10;
                let currentAttempt = 0;
                let totalQuestions = 0;

                while (correctCount < 5 && currentAttempt < maxAttempts) {
                    currentAttempt++;
                    const payloadLoadQuiz = new URLSearchParams();
                    payloadLoadQuiz.append('action', 'load_quiz_data');
                    payloadLoadQuiz.append('security_token', securityToken);

                    const responseQuiz = await fetch(this.ajaxUrl, {
                        method: 'POST',
                        headers: headers,
                        body: payloadLoadQuiz,
                        credentials: 'include'
                    });

                    const dataQuiz = await responseQuiz.json();

                    if (!dataQuiz.success || !dataQuiz.data) {
                        showNotification(`Váº¥n ÄÃ¡p: ${dataQuiz.data || 'Lá»—i khi láº¥y cÃ¢u há»i'}`, 'warn');
                        return;
                    }

                    if (dataQuiz.data.completed) {
                        showNotification('ÄÃ£ hoÃ n thÃ nh váº¥n Ä‘Ã¡p hÃ´m nay.', 'success');
                        taskTracker.markTaskDone(accountId, 'diemdanh');
                        return;
                    }

                    if (!dataQuiz.data.questions) {
                        showNotification(`Váº¥n ÄÃ¡p: KhÃ´ng cÃ³ cÃ¢u há»i nÃ o Ä‘Æ°á»£c táº£i.`, 'warn');
                        return;
                    }

                    const questions = dataQuiz.data.questions;
                    totalQuestions = questions.length;
                    correctCount = dataQuiz.data.correct_answers || 0;

                    // Bá»™ lá»c cÃ¢u há»i bao hÃ m cáº£ 2 trÆ°á»ng há»£p
                    const questionsToAnswer = questions.filter(q => {
                        if ('is_correct' in q) {
                            return String(q.is_correct) === "0"; // chá»‰ láº¥y cÃ¢u chÆ°a Ä‘Ãºng
                        }
                        return true; // náº¿u chÆ°a cÃ³ is_correct thÃ¬ láº¥y táº¥t cáº£
                    });

                    if (questionsToAnswer.length === 0) {
                        break;
                    }

                    let newAnswersFound = false;

                    for (const question of questionsToAnswer) {
                        //console.log(`Äang xá»­ lÃ½ cÃ¢u há»i #${question.id}: ${question.question}`);
                        const result = await this.checkAnswerAndSubmit(question, headers, securityToken);

                        if (result.success) {
                            answeredThisSession++;
                            // correctCount++;
                            newAnswersFound = true;
                            //showNotification(`âœ… Tráº£ lá»i Ä‘Ãºng cÃ¢u há»i #${question.id}`, 'success'); // ðŸ”§ thÃªm noti
                        } else {
                            if (result.reason === "not_in_cache") {
                                console.warn(`KhÃ´ng tÃ¬m tháº¥y Ä‘Ã¡p Ã¡n trong cache cho cÃ¢u há»i #${question.id}`);
                                showNotification(`âŒ KhÃ´ng tÃ¬m tháº¥y Ä‘Ã¡p Ã¡n trong cache cho cÃ¢u há»i #${question.id}`, 'error'); // ðŸ”§ thÃªm noti
                            } else if (result.reason === "not_in_options") {
                                console.warn(`ÄÃ¡p Ã¡n cÃ³ trong cache nhÆ°ng khÃ´ng khá»›p option server cho cÃ¢u há»i #${question.id}`);
                                showNotification(`âŒ ÄÃ¡p Ã¡n khÃ´ng khá»›p option server cho cÃ¢u há»i #${question.id}`, 'error'); // ðŸ”§ thÃªm noti
                            } else if (result.reason === "server_error") {
                                console.error(`Server tá»« chá»‘i cÃ¢u há»i #${question.id}: ${result.message}`);
                                showNotification(`âš ï¸ Server tá»« chá»‘i cÃ¢u há»i #${question.id}: ${result.message}`, 'warn'); // ðŸ”§ thÃªm noti
                            } else if (result.reason === "exception") {
                                console.error(`Lá»—i khi gá»­i cÃ¢u há»i #${question.id}: ${result.message}`);
                                showNotification(`âš ï¸ Lá»—i khi gá»­i cÃ¢u há»i #${question.id}: ${result.message}`, 'warn'); // ðŸ”§ thÃªm noti
                            }
                        }
                    }

                    if (!newAnswersFound) {
                        showNotification(`Váº¥n ÄÃ¡p: KhÃ´ng tÃ¬m tháº¥y cÃ¢u tráº£ lá»i má»›i, dá»«ng láº¡i.`, 'warn');
                        break;
                    }

                    if (correctCount < 5) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // TÃ¬m náº¡p tráº¡ng thÃ¡i cuá»‘i cÃ¹ng Ä‘á»ƒ bÃ¡o cÃ¡o chÃ­nh xÃ¡c
                const finalPayload = new URLSearchParams();
                finalPayload.append('action', 'load_quiz_data');
                finalPayload.append('security_token', securityToken);

                const finalResponse = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    headers: headers,
                    body: finalPayload,
                    credentials: 'include'
                });
                const finalData = await finalResponse.json();
                if (finalData.success && finalData.data) {
                    correctCount = finalData.data.correct_answers || correctCount;
                    totalQuestions = finalData.data.questions.length || totalQuestions;
                }

                showNotification(
                    `HoÃ n thÃ nh Váº¥n ÄÃ¡p. ÄÃ£ tráº£ lá»i thÃªm ${answeredThisSession} cÃ¢u. Tá»•ng sá»‘ cÃ¢u Ä‘Ãºng: ${correctCount}/${totalQuestions}`,
                    'success'
                );

            } catch (e) {
                console.error(`[HH3D Váº¥n ÄÃ¡p] âŒ Lá»—i xáº£y ra:`, e);
                showNotification(`Lá»—i khi thá»±c hiá»‡n Váº¥n ÄÃ¡p: ${e.message}`, 'error');
            }
        }
    }

    // ===============================================
    // ÄIá»‚M DANH
    // ===============================================
    async function doDailyCheckin(nonce) {
        try {
            console.log('[HH3D Daily Check-in] â–¶ï¸ Báº¯t Ä‘áº§u Daily Check-in');
            const url = weburl + 'wp-json/hh3d/v1/action';
            const headers = {
                'Content-Type': 'application/json',
                'X-Wp-Nonce': nonce,
                'X-Requested-With': 'XMLHttpRequest'
            };

            const bodyPayload = {
                action: 'daily_check_in'
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(bodyPayload),
                credentials: 'include',
                referrer: weburl + 'diem-danh',
                mode: 'cors'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showNotification(`Äiá»ƒm danh: ${data.message} (${data.streak} ngÃ y)`, 'success');
            } else {
                showNotification(`Äiá»ƒm danh: ${data.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh'}`, 'warn');
            }
        } catch (e) {
            console.error(`[HH3D Daily Check-in] âŒ Lá»—i xáº£y ra:`, e);
            showNotification(`Lá»—i khi thá»±c hiá»‡n Daily Check-in: ${e.message}`, 'error');
        }
    }

    // ===============================================
    // Táº¾ Lá»„ TÃ”NG MÃ”N
    // ===============================================
    async function doClanDailyCheckin(nonce) {
        const securityToken = await getSecurityToken(weburl + 'danh-sach-thanh-vien-tong-mon?t');
        try {
            console.log('[HH3D Clan Check-in] â–¶ï¸ Báº¯t Ä‘áº§u Clan Check-in');

            // Giáº£ Ä‘á»‹nh 'weburl' Ä‘Æ°á»£c Ä‘á»‹nh nghÄ©a á»Ÿ scope bÃªn ngoÃ i
            const url = weburl + "wp-json/tong-mon/v1/te-le-tong-mon";

            // --- 1. Cáº¬P NHáº¬T HEADERS ---
            const headers = {
                "Content-Type": "application/json",
                "X-WP-Nonce": nonce,
                "security_token": securityToken
            };

            // --- 2. Cáº¬P NHáº¬T BODY ---
            const bodyPayload = {
                action: "te_le_tong_mon",
                security_token: securityToken
            };

            const response = await fetch(url, {
                "credentials": "include",
                "headers": headers, // (ÄÃ£ cáº­p nháº­t)
                "referrer": weburl + "danh-sach-thanh-vien-tong-mon",
                "body": JSON.stringify(bodyPayload), // <-- THAY Äá»”I Tá»ª "{}"
                "method": "POST",
                "mode": "cors"
            });

            // Logic xá»­ lÃ½ response giá»¯ nguyÃªn
            const data = await response.json();
            if (response.ok && data.success) {
                showNotification(`Táº¿ lá»…: ${data.message} (${data.cong_hien_points})`, 'success');
            } else {
                showNotification(`Táº¿ lá»…: ${data.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh'}`, 'warn');
            }
        } catch (e) {
            console.error(`[HH3D Clan Check-in] âŒ Lá»—i xáº£y ra:`, e);
            showNotification(`Lá»—i khi thá»±c hiá»‡n Clan Check-in: ${e.message}`, 'error');
        }
    }

    // ===============================================
    // HÃ€M Äá»” THáº CH
    // ===============================================

    /**
    * Lá»›p quáº£n lÃ½ tÃ­nh nÄƒng Äá»• Tháº¡ch (Dice Roll).
    *
    * HÆ°á»›ng dáº«n sá»­ dá»¥ng:
    * 1. Táº¡o má»™t thá»±c thá»ƒ cá»§a lá»›p, cung cáº¥p cÃ¡c phá»¥ thuá»™c cáº§n thiáº¿t.
    *    const doThachManager = new DoThach();
    *
    * 2. Gá»i phÆ°Æ¡ng thá»©c run vá»›i chiáº¿n lÆ°á»£c mong muá»‘n ('tÃ i' hoáº·c 'xá»‰u').
    *    await doThachManager.run('tÃ i');
    */
    class DoThach {
        constructor() {
            this.ajaxUrl = ajaxUrl;
            this.webUrl = weburl;
            this.getSecurityNonce = getSecurityNonce;
            this.doThachUrl = this.webUrl + 'do-thach-hh3d?t';
        }

        // --- CÃ¡c phÆ°Æ¡ng thá»©c private Ä‘á»ƒ gá»i API vÃ  láº¥y nonce ---

        // async #getLoadDataNonce() {
        //     return this.getSecurityNonce(this.doThachUrl, /action: 'load_do_thach_data',[\s\S]*?security: '([a-f0-9]+)'/);
        // }

        // async #getPlaceBetNonce() {
        //     return this.getSecurityNonce(this.doThachUrl, /action: 'place_do_thach_bet',[\s\S]*?security: '([a-f0-9]+)'/);
        // }

        // async #getClaimRewardNonce() {
        //     return this.getSecurityNonce(this.doThachUrl, /action: 'claim_do_thach_reward',[\s\S]*?security: '([a-f0-9]+)'/);
        // }



        /**
        * Láº¥y thÃ´ng tin phiÃªn Ä‘á»• tháº¡ch hiá»‡n táº¡i.
        * @param {string} securityNonce - Nonce cho yÃªu cáº§u.
        * @returns {Promise<object|null>} Dá»¯ liá»‡u phiÃªn hoáº·c null náº¿u cÃ³ lá»—i.
        */
        async #getDiceRollInfo() {
            console.log('[HH3D Äá»• Tháº¡ch] â–¶ï¸ Äang láº¥y thÃ´ng tin phiÃªn...');
            const securityToken = await getSecurityToken(this.doThachUrl);
            //const payload = new URLSearchParams({ action: 'load_do_thach_data', security_token: securityToken, security: securityNonce });
            const payload = new URLSearchParams({ action: 'load_do_thach_data', security_token: securityToken });
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            };

            try {
                const response = await fetch(this.ajaxUrl, { method: 'POST', headers, body: payload });
                const data = await response.json();
                if (data.success) {
                    console.log('[HH3D Äá»• Tháº¡ch] âœ… Táº£i thÃ´ng tin phiÃªn thÃ nh cÃ´ng.');
                    return data.data;
                }
                console.error('[HH3D Äá»• Tháº¡ch] âŒ Lá»—i tá»« API:', data.data || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh');
                return null;
            } catch (e) {
                console.error('[HH3D Äá»• Tháº¡ch] âŒ Lá»—i máº¡ng:', e);
                return null;
            }
        }

        /**
        * Äáº·t cÆ°á»£c vÃ o má»™t viÃªn Ä‘Ã¡ cá»¥ thá»ƒ.
        * @param {object} stone - Äá»‘i tÆ°á»£ng Ä‘Ã¡ Ä‘á»ƒ Ä‘áº·t cÆ°á»£c.
        * @param {number} betAmount - Sá»‘ tiá»n cÆ°á»£c.
        * @param {string} placeBetSecurity - Nonce Ä‘á»ƒ Ä‘áº·t cÆ°á»£c.
        * @returns {Promise<boolean>} True náº¿u Ä‘áº·t cÆ°á»£c thÃ nh cÃ´ng.
        */
        async #placeBet(stone, betAmount) {
            console.log(`[HH3D Äáº·t CÆ°á»£c] ðŸª™ Äang cÆ°á»£c ${betAmount} TiÃªn Ngá»c vÃ o ${stone.name}...`);
            const securityToken = await getSecurityToken(this.doThachUrl);
            const payload = new URLSearchParams({
                action: 'place_do_thach_bet',
                security_token: securityToken,
                //security: placeBetSecurity, bá» security nonce
                stone_id: stone.stone_id,
                bet_amount: betAmount
            });
            const headers = {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            };

            try {
                const response = await fetch(this.ajaxUrl, { method: 'POST', headers, body: payload });
                const data = await response.json();

                if (data.success) {
                    showNotification(`âœ… CÆ°á»£c thÃ nh cÃ´ng vÃ o ${stone.name}!<br>Tá»· lá»‡ <b>x${stone.reward_multiplier}</b>`, 'success');
                    this._alreadyClaimedReward = false; // reset flag
                    return true;
                }
                else if (data.data === 'Vui lÃ²ng nháº­n thÆ°á»Ÿng ká»³ trÆ°á»›c rá»“i má»›i tiáº¿p tá»¥c Ä‘áº·t cÆ°á»£c.') {
                    if (!this._alreadyClaimedReward) {
                        if (await this.#claimReward()) {
                            this._alreadyClaimedReward = true;
                            //return await this.#placeBet(stone, betAmount, placeBetSecurity);
                            return await this.#placeBet(stone, betAmount);
                        } else {
                            showNotification(`âŒ KhÃ´ng thá»ƒ nháº­n thÆ°á»Ÿng ká»³ trÆ°á»›c, vui lÃ²ng thá»­ láº¡i.`, 'error');
                        }
                    } else {
                        showNotification(`âŒ ÄÃ£ thá»­ nháº­n thÆ°á»Ÿng nhÆ°ng váº«n khÃ´ng cÆ°á»£c Ä‘Æ°á»£c.`, 'error');
                    }
                    this._alreadyClaimedReward = false; // reset flag
                    return false;
                }

                const errorMessage = data.data || data.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh.';
                showNotification(`âŒ Lá»—i cÆ°á»£c: ${errorMessage}`, 'error');
                this._alreadyClaimedReward = false;
                return false;
            } catch (e) {
                showNotification(`âŒ Lá»—i máº¡ng khi cÆ°á»£c: ${e.message}`, 'error');
                this._alreadyClaimedReward = false;
                return false;
            }
        }

        /**
        * Nháº­n thÆ°á»Ÿng cho má»™t láº§n cÆ°á»£c tháº¯ng.
        * @returns {Promise<boolean>} True náº¿u nháº­n thÆ°á»Ÿng thÃ nh cÃ´ng.
        */
        async #claimReward() {
            console.log('[HH3D Nháº­n ThÆ°á»Ÿng] ðŸŽ Äang nháº­n thÆ°á»Ÿng...');
            const securityToken = await getSecurityToken(this.doThachUrl);
            const payload = new URLSearchParams({ action: 'claim_do_thach_reward', security_token: securityToken });
            const headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            };

            try {
                const response = await fetch(this.ajaxUrl, { method: 'POST', headers, body: payload });
                const data = await response.json();
                if (data.success) {
                    const rewardMessage = data.data?.message || `Nháº­n thÆ°á»Ÿng thÃ nh cÃ´ng!`;
                    showNotification(rewardMessage, 'success');
                    return true;
                }
                const errorMessage = data.data?.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi nháº­n thÆ°á»Ÿng.';
                showNotification(errorMessage, 'error');
                return false;
            } catch (e) {
                console.error(e);
                showNotification(`âŒ Lá»—i máº¡ng khi nháº­n thÆ°á»Ÿng: ${e.message}`, 'error');
                return false;
            }
        }

        // --- PhÆ°Æ¡ng thá»©c public Ä‘á»ƒ cháº¡y toÃ n bá»™ quy trÃ¬nh ---

        /**
        * Cháº¡y toÃ n bá»™ quy trÃ¬nh Ä‘á»• tháº¡ch dá»±a trÃªn chiáº¿n lÆ°á»£c Ä‘Ã£ chá»n.
        * @param {string} stoneType - Chiáº¿n lÆ°á»£c Ä‘áº·t cÆ°á»£c ('tÃ i' hoáº·c 'xá»‰u').
        */
        async run(stoneType) {
            console.log(`[HH3D Äá»• Tháº¡ch] ðŸ§  Báº¯t Ä‘áº§u quy trÃ¬nh vá»›i chiáº¿n lÆ°á»£c: ${stoneType}...`);

            const sessionData = await this.#getDiceRollInfo();

            if (!sessionData) {
                console.error('[HH3D Äá»• Tháº¡ch] âŒ KhÃ´ng thá»ƒ láº¥y dá»¯ liá»‡u phiÃªn, dá»«ng láº¡i.');
                return;
            }

            const userBetStones = sessionData.stones.filter(stone => stone.bet_placed);

            // BÆ°á»›c 2: Kiá»ƒm tra tráº¡ng thÃ¡i phiÃªn vÃ  hÃ nh Ä‘á»™ng (nháº­n thÆ°á»Ÿng hoáº·c Ä‘áº·t cÆ°á»£c)
            if (sessionData.winning_stone_id) {
                console.log('[HH3D Äá»• Tháº¡ch] ðŸŽ ÄÃ£ cÃ³ káº¿t quáº£. Kiá»ƒm tra nháº­n thÆ°á»Ÿng...');
                const claimableWin = userBetStones.find(s => s.stone_id === sessionData.winning_stone_id && !s.reward_claimed);
                const alreadyClaimed = userBetStones.find(s => s.stone_id === sessionData.winning_stone_id && s.reward_claimed);

                if (claimableWin) {
                    console.log(`[HH3D Äá»• Tháº¡ch] ðŸŽ‰ TrÃºng rá»“i! ÄÃ¡ cÆ°á»£c: ${claimableWin.name}. Äang nháº­n thÆ°á»Ÿng...`);
                    await this.#claimReward();
                } else if (alreadyClaimed) {
                    console.log(`[HH3D Äá»• Tháº¡ch] âœ… ÄÃ£ nháº­n thÆ°á»Ÿng cho phiÃªn nÃ y.`);
                } else if (userBetStones.length > 0) {
                    showNotification('[Äá»• Tháº¡ch] ðŸ¥² Ráº¥t tiáº¿c, báº¡n khÃ´ng trÃºng phiÃªn nÃ y.', 'info');
                } else {
                    showNotification('[Äá»• Tháº¡ch] ðŸ˜¶ Báº¡n khÃ´ng tham gia phiÃªn nÃ y.', 'info');
                }
                taskTracker.updateTask(accountId, 'dothach', 'reward_claimed', 'true')
                return;
            }

            // BÆ°á»›c 3: Náº¿u Ä‘ang trong giá» cÆ°á»£c, tiáº¿n hÃ nh Ä‘áº·t cÆ°á»£c
            console.log('[HH3D Äá»• Tháº¡ch] ðŸ’° Äang trong thá»i gian Ä‘áº·t cÆ°á»£c.');
            const userBetCount = userBetStones.length;

            if (userBetCount >= 2) {
                showNotification('[Äá»• Tháº¡ch] âš ï¸ ÄÃ£ cÆ°á»£c Ä‘á»§ 2 láº§n. Chá» phiÃªn sau.', 'warn');
                taskTracker.updateTask(accountId, 'dothach', 'betplaced', true);

                return;
            }

            const sortedStones = [...sessionData.stones].sort((a, b) => b.reward_multiplier - a.reward_multiplier);
            const availableStones = sortedStones.filter(stone => !stone.bet_placed);

            if (availableStones.length === 0) {
                showNotification('[Äá»• Tháº¡ch] âš ï¸ KhÃ´ng cÃ²n Ä‘Ã¡ nÃ o Ä‘á»ƒ cÆ°á»£c!', 'warn');
                return;
            }

            const betAmount = 20;
            const stonesToBet = [];
            const normalizedStoneType = stoneType.toLowerCase();
            const betsRemaining = 2 - userBetCount;

            if (normalizedStoneType === 'tÃ i' || normalizedStoneType === 'tai') {
                stonesToBet.push(...availableStones.slice(0, betsRemaining));
            } else if (normalizedStoneType === 'xá»‰u' || normalizedStoneType === 'xiu') {
                const xiuStones = availableStones.slice(2, 4);
                stonesToBet.push(...xiuStones.slice(0, betsRemaining));
            } else {
                console.log('[HH3D Äá»• Tháº¡ch] âŒ Chiáº¿n lÆ°á»£c khÃ´ng há»£p lá»‡. Vui lÃ²ng chá»n "tÃ i" hoáº·c "xá»‰u".');
                return;
            }

            if (stonesToBet.length === 0) {
                console.log('[HH3D Äá»• Tháº¡ch] âš ï¸ KhÃ´ng cÃ³ Ä‘Ã¡ nÃ o phÃ¹ há»£p chiáº¿n lÆ°á»£c hoáº·c Ä‘Ã£ cÆ°á»£c Ä‘á»§.');
                return;
            }

            let successfulBets = 0;
            for (const stone of stonesToBet) {
                //const success = await this.#placeBet(stone, betAmount, placeBetSecurity);
                const success = await this.#placeBet(stone, betAmount);
                if (success) {
                    successfulBets++;
                }
            }

            // Kiá»ƒm tra vÃ  cáº­p nháº­t tráº¡ng thÃ¡i ngay sau khi cÆ°á»£c
            if (userBetCount + successfulBets >= 2) {
                taskTracker.updateTask(accountId, 'dothach', 'betplaced', true);
                //console.log(taskTracker.getTaskStatus(accountId, 'dothach'));

            }
        }
    }

    //===================================
    // TIÃŠN DUYÃŠN
    //===================================
    class TienDuyen {
        nonce;

        constructor() {
            this.apiUrl = weburl + "wp-json/hh3d/v1/action";
        }

        async init() {
            console.log("Cháº¡y init tiÃªn duyÃªn");
            this.nonce = await getNonce();
            //console.log("getNonce type:", typeof getNonce);
            //console.log("getNonce source:", getNonce.toString());
            console.log("TiÃªn DuyÃªn Nonce (init):", this.nonce);

            this.securityToken = await getSecurityToken(weburl + "tien-duyen?t");
            console.log("TiÃªn DuyÃªn SecurityToken (init):", this.securityToken);
        }

        async #post(action, body = {}) {
            const res = await fetch(this.apiUrl, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "X-WP-Nonce": this.nonce
                },
                body: JSON.stringify({ action, ...body })
            });
            return res.json();
        }

        // ðŸ“‹ Láº¥y danh sÃ¡ch phÃ²ng cÆ°á»›i
        async getWeddingRooms() {
            console.log("TiÃªn DuyÃªn SecurityToken (GetWedding Rooms):", this.securityToken);
            return await this.#post("show_all_wedding", {
                security_token: this.securityToken
            });
        }

        // ðŸŽ‰ ChÃºc phÃºc
        async addBlessing(weddingRoomId, message = "ChÃºc phÃºc trÄƒm nÄƒm háº¡nh phÃºc ðŸŽ‰") {
            return await this.#post("hh3d_add_blessing", {
                wedding_room_id: weddingRoomId,
                message
            });
        }

        // ðŸ’• ChÃºc phÃºc Há»“ng Nhan (endpoint riÃªng)
        async addHongNhanBlessing(weddingRoomId, message = "ðŸŒ  Má»™t Ä‘oáº¡n há»“ng duyÃªn, váº¡n pháº§n cÆ¡ ngá»™! ChÃºc má»«ng cÆ¡ duyÃªn Ä‘áº¹p giá»¯a chá»‘n há»“ng tráº§n. âœ¨") {
            const res = await fetch(weburl + "wp-json/hh3d/v1/hong-nhan/bless", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "X-WP-Nonce": this.nonce
                },
                body: JSON.stringify({ wedding_room_id: weddingRoomId, message })
            });
            return res.json();
        }

        // ðŸ§§ Nháº­n lÃ¬ xÃ¬
        async receiveLiXi(weddingRoomId) {
            return await this.#post("hh3d_receive_li_xi", {
                wedding_room_id: weddingRoomId
            });
        }

        // ðŸ’ž DuyÃªn: chÃºc phÃºc + nháº­n lÃ¬ xÃ¬
        async doTienDuyen(isManual = false) {
            if (!this.nonce || !this.securityToken) {
                console.log("â–¶ ChÆ°a init, Ä‘ang cháº¡y init trong doTienDuyen...");
                await this.init();
            }

            const lastCheck = taskTracker.getLastCheckTienDuyen(accountId);
            const now = new Date();
            if (!isManual && lastCheck && (now - lastCheck < 1800000)) return;

            const list = await this.getWeddingRooms();
            if (!list?.data) {
                showNotification("KhÃ´ng cÃ³ danh sÃ¡ch phÃ²ng cÆ°á»›i", "warn");
                return;
            }

            let processedCount = 0;
            for (const room of list.data) {
                taskTracker.setLastCheckTienDuyen(accountId, now);
                const isHongNhan = room.room_type === 'hong_nhan';

                // Server tráº£ has_blessed sai cho phÃ²ng Há»“ng Nhan â†’ chá»‰ skip náº¿u lÃ  Äáº¡o Lá»¯ Ä‘Ã£ chÃºc & khÃ´ng cÃ³ lÃ¬ xÃ¬
                if (!isHongNhan && room.has_blessed === true && room.has_li_xi === false) {
                    continue;
                }

                processedCount++;
                console.log(`ðŸ‘‰ Kiá»ƒm tra phÃ²ng ${room.wedding_room_id} [${room.room_type}]`);

                // Äáº¡o Lá»¯: chá»‰ chÃºc khi chÆ°a chÃºc; Há»“ng Nhan: luÃ´n thá»­ (server tá»± bÃ¡o lá»—i náº¿u Ä‘Ã£ chÃºc)
                if (isHongNhan || room.has_blessed === false) {
                    const name1 = isHongNhan ? (room.nguyen_chu_name || room.user1_name) : room.user1_name;
                    const name2 = isHongNhan ? (room.hong_nhan_name || room.user2_name) : room.user2_name;
                    const bless = isHongNhan
                        ? await this.addHongNhanBlessing(room.wedding_room_id)
                        : await this.addBlessing(room.wedding_room_id);
                    if (bless && bless.success === true) {
                        const label = isHongNhan ? 'ðŸ’• Há»“ng Nhan' : 'ðŸ’ž Äáº¡o Lá»¯';
                        showNotification(
                            `Báº¡n Ä‘Ã£ gá»­i lá»i chÃºc phÃºc [${label}] cho cáº·p Ä‘Ã´i <br><b>${name1} ðŸ’ž ${name2}</b>`,
                            "success"
                        );
                    }
                }

                if (room.has_li_xi === true) {
                    const liXi = await this.receiveLiXi(room.wedding_room_id);
                    if (liXi && liXi.success === true) {
                        showNotification(
                            `Nháº­n lÃ¬ xÃ¬ phÃ²ng cÆ°á»›i ${room.wedding_room_id} Ä‘Æ°á»£c <b>${liXi.data.amount} ${liXi.data.name}</b>!`,
                            "success"
                        );
                    }
                }

                // â³ Chá» 1 giÃ¢y trÃ¡nh spam
                await new Promise(r => setTimeout(r, 1000));
            }

            if (isManual && processedCount === 0) {
                showNotification("KhÃ´ng cÃ³ phÃ²ng cÆ°á»›i má»›i hoáº·c lÃ¬ xÃ¬ chÆ°a nháº­n!", "info");
            }
        }
    }

    // ===============================================
    // TIÃŠN DUYÃŠN - Táº¶NG HOA
    // ===============================================

    class TangHoa {
        nonce;
        initialized = false;

        constructor() {
            this.apiUrl = weburl + "wp-json/hh3d/v1/action";
            this.accountId = accountId;
        }

        async init() {
            // console.log("cháº¡y táº·ng hoa");
            this.nonce = await getNonce();
            // console.log("getNonce type:", typeof getNonce);
            // console.log("getNonce source:", getNonce.toString());
            this.securityToken = await getSecurityToken(weburl + 'tien-duyen?t');
            this.initialized = true;
        }

        async #post(action, body = {}) {
            const res = await fetch(this.apiUrl,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json",
                        "X-WP-Nonce": this.nonce
                    },
                    body: JSON.stringify({
                        action, ...body
                    })
                });
            return res.json();
        }
        // Láº¥y danh sÃ¡ch báº¡n bÃ¨
        async getFriends() {
            return await this.#post("get_friends_td");
        }
        // Kiá»ƒm tra giá»›i háº¡n quÃ  táº·ng
        async checkGiftLimit(friendId, costType = "tien_ngoc") {
            return await this.#post("check_daily_gift_limit",
                {
                    user_id: this.accountId,
                    friend_id: friendId, // user_id cá»§a báº¡n bÃ¨
                    cost_type: costType
                });
        }
        // Táº·ng quÃ 
        async giftToFriend(friendId, giftType = "hoa_hong", costType = "tien_ngoc") {
            return await this.#post("gift_to_friend",
                {
                    user_id: this.accountId,
                    friend_id: friendId, // user_id cá»§a báº¡n bÃ¨
                    gift_type: giftType,
                    cost_type: costType
                });
        }
        // HÃ m chÃ­nh: táº·ng hoa cho Ä‘Ãºng sá»‘ ngÆ°á»i Ä‘Ã£ chá»n
        async run(selectedCount) {
            try {
                if (!this.initialized) {
                    await this.init();
                }

                const count = parseInt(selectedCount,
                    10);
                if (Number.isNaN(count) || count <= 0) {
                    showNotification(`âš ï¸ Sá»‘ lÆ°á»£ng chá»n khÃ´ng há»£p lá»‡: ${selectedCount
                        }`, 'warn');
                    return;
                }

                const friendsRes = await this.getFriends();
                const list = Array.isArray(friendsRes?.data)
                    ? friendsRes.data
                    : (Array.isArray(friendsRes) ? friendsRes : []);

                if (!Array.isArray(list) || list.length === 0) {
                    showNotification("âŒ KhÃ´ng cÃ³ danh sÃ¡ch báº¡n bÃ¨", 'error');
                    return;
                }
                // Láº¥y Ä‘Ãºng sá»‘ ngÆ°á»i Ä‘Ã£ chá»n trÃªn menu
                const targetFriends = list.slice(0, count);
                //showNotification(`ðŸŽ¯ Sáº½ táº·ng cho ${targetFriends.length} ngÆ°á»i.`, 'info');

                let processed = 0;

                for (const friend of targetFriends) {
                    const friendId = friend?.user_id;
                    if (!friendId) {
                        showNotification("âš ï¸ Thiáº¿u user_id trong item", 'warn');
                        continue;
                    }

                    processed++;
                    showNotification(`ðŸ‘¤ Báº¯t Ä‘áº§u táº·ng cho ID ${friendId
                        } (${processed
                        }/${targetFriends.length
                        })`, 'info');

                    let giftsForThisFriend = 0;
                    const maxGiftsPerFriend = 3;

                    while (giftsForThisFriend < maxGiftsPerFriend) {
                        const check = await this.checkGiftLimit(friendId);
                        const remaining = Number(check?.remaining_free_gifts ?? 0);

                        if (remaining <= 0) {
                            showNotification(`â›” Háº¿t lÆ°á»£t táº·ng cho ID ${friendId
                                }, dá»«ng táº·ng ngÆ°á»i nÃ y.`, 'warn');
                            break;
                        }

                        const gift = await this.giftToFriend(friendId);
                        if (gift?.success === true) {
                            giftsForThisFriend++;
                            //const remainingAfter = gift?.remaining_free_gifts ?? 'N/A';
                            showNotification(`ðŸŽ Táº·ng láº§n ${giftsForThisFriend
                                }/${maxGiftsPerFriend
                                }`, 'success');
                        } else {
                            showNotification(`âš ï¸ Táº·ng quÃ  tháº¥t báº¡i cho ID ${friendId
                                }`, 'error');
                            break;
                        }

                        await new Promise(r => setTimeout(r,
                            2000));
                    }

                    await new Promise(r => setTimeout(r,
                        1000));
                }

                showNotification(`ðŸŽ‰ Káº¿t thÃºc: Ä‘Ã£ xá»­ lÃ½ ${processed
                    }/${targetFriends.length
                    } ngÆ°á»i`, 'success');
            } catch (err) {
                showNotification(`ðŸ’¥ Lá»—i trong run(): ${err?.message ?? err
                    }`, 'error');
            }
        }
    }

    // ===============================================
    // TIÃŠN DUYÃŠN - Cáº¦U NGUYá»†N
    // ===============================================

    async function docaunguyen(accountId) {
        const logPrefix = "[Cáº§u Nguyá»‡n tiÃªn duyÃªn]";
        try {

            console.log(logPrefix, "â–¶ï¸ Äang thá»±c hiá»‡n...");

            const nonce = await getNonce();
            if (!nonce) {
                showNotification("KhÃ´ng láº¥y Ä‘Æ°á»£c nonce", "error");
                return false;
            }

            const url = weburl + "wp-json/hh3d/v1/action";
            const bodyPayload = { action: "make_wish_tree" };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Wp-Nonce": nonce,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(bodyPayload),
                credentials: "include"
            });

            const data = await response.json();

            if (
                data.success ||
                (data.message && data.message.includes("ChÆ°a cÃ³ Ä‘áº¡o lá»¯ Ä‘á»ƒ Æ°á»›c nguyá»‡n TiÃªn DuyÃªn Thá»¥"))
            ) {
                showNotification(`${logPrefix} âœ¨ ${data.message}`, "info");
                taskTracker.markTaskDone(accountId, "tienduyen");
                return true;
            } else {
                showNotification(`${logPrefix}âš ï¸ ${data.message || "Tháº¥t báº¡i"}`, "warn");
                return false;
            }
        } catch (e) {
            console.error(e);
            showNotification(`${logPrefix}: ${e.message}`, "error");
            return false;
        }
    }


    // ===============================================
    // THÃ LUYá»†N TÃ”NG MÃ”N
    // ===============================================

    async function doThiLuyenTongMon() {
        console.log('[HH3D ThÃ­ Luyá»‡n TÃ´ng MÃ´n] â–¶ï¸ Báº¯t Ä‘áº§u ThÃ­ Luyá»‡n TÃ´ng MÃ´n');

        // BÆ°á»›c 1: Láº¥y security token
        const securityToken = await getSecurityToken(weburl + 'thi-luyen-tong-mon-hh3d?t');
        if (!securityToken) {
            showNotification('Lá»—i khi láº¥y security token cho ThÃ­ Luyá»‡n TÃ´ng MÃ´n.', 'error');
            throw new Error('Lá»—i khi láº¥y security token cho ThÃ­ Luyá»‡n TÃ´ng MÃ´n.');
        }

        const url = ajaxUrl;
        const payload = new URLSearchParams();
        payload.append('action', 'open_chest_tltm');
        payload.append('security_token', securityToken);

        console.log([...payload.entries()]);

        const headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: payload,
                credentials: 'include' // Quan trá»ng Ä‘á»ƒ gá»­i cookies
            });

            // Äá»c body má»™t láº§n
            const text = await response.text();
            console.log(text);
            // Parse JSON tá»« text
            const data = JSON.parse(text);

            if (data.success) {
                // TrÆ°á»ng há»£p thÃ nh cÃ´ng
                const message = data.data && data.data.message ? data.data.message : 'Má»Ÿ rÆ°Æ¡ng thÃ nh cÃ´ng!';
                showNotification(message, 'success');
            } else {
                // TrÆ°á»ng há»£p tháº¥t báº¡i
                const errorMessage = data.data && data.data.message ? data.data.message : 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi má»Ÿ rÆ°Æ¡ng.';
                if (errorMessage.includes("ÄÃ£ hoÃ n thÃ nh ThÃ­ Luyá»‡n TÃ´ng MÃ´n hÃ´m nay")) {
                    showNotification(errorMessage, 'info');
                    taskTracker.markTaskDone(accountId, 'thiluyen');
                } else {
                    showNotification(errorMessage, 'error');
                }
            }


        } catch (e) {
            showNotification(`Lá»—i máº¡ng khi thá»±c hiá»‡n ThÃ­ Luyá»‡n: ${e.message}`, 'error');
        }
    }

    // ===============================================
    // PHÃšC Lá»¢I
    // ===============================================


    async function doPhucLoiDuong() {
        const logPrefix = '[HH3D PhÃºc Lá»£i ÄÆ°á»ng]';
        console.log(`${logPrefix} â–¶ï¸ Báº¯t Ä‘áº§u nhiá»‡m vá»¥ PhÃºc Lá»£i ÄÆ°á»ng.`);
        // BÆ°á»›c 1: Láº¥y security nonce tá»« trang hoáº·c fallback sang AJAX
        let securityNonce = null;
        try {
            const resp = await fetch(weburl + 'phuc-loi-duong?t');
            const jsonConfigMatch = await resp.text();
            const match = jsonConfigMatch.match(/"securityToken"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
                securityNonce = match[1];
                console.log('[HH3D PhÃºc Lá»£i ÄÆ°á»ng] âœ… Nonce tá»« HTML:', securityNonce);
            }
        } catch (err) {
            console.warn('[HH3D PhÃºc Lá»£i ÄÆ°á»ng] âš ï¸ Lá»—i khi parse HTML:', err);
        }

        if (!securityNonce) {
            try {
                const resAjax = await fetch(weburl + 'wp-content/themes/halimmovies-child/hh3d-ajax.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: 'action=get_next_time_pl',
                    credentials: 'include'
                });
                const dataAjax = await resAjax.json();
                if (dataAjax && dataAjax.security_token) {
                    securityNonce = dataAjax.security_token;
                    console.log('[HH3D PhÃºc Lá»£i ÄÆ°á»ng] âœ… Nonce tá»« AJAX:', securityNonce);
                }
            } catch (err) {
                console.error('[HH3D PhÃºc Lá»£i ÄÆ°á»ng] âŒ Lá»—i khi gá»i AJAX:', err);
            }
        }

        if (!securityNonce) {
            showNotification('Lá»—i khi láº¥y security nonce cho PhÃºc Lá»£i ÄÆ°á»ng.', 'error');
            return;
        }

        const url = ajaxUrl;
        const headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        };

        // BÆ°á»›c 2: Láº¥y thÃ´ng tin thá»i gian cÃ²n láº¡i vÃ  cáº¥p Ä‘á»™ rÆ°Æ¡ng
        console.log('[HH3D PhÃºc Lá»£i ÄÆ°á»ng] â²ï¸ Äang kiá»ƒm tra thá»i gian má»Ÿ rÆ°Æ¡ng...');
        const securityToken = await getSecurityToken(weburl + 'phuc-loi-duong?t');
        const payloadTime = new URLSearchParams();
        payloadTime.append('action', 'get_next_time_pl');
        payloadTime.append('security_token', securityToken);
        payloadTime.append('security', securityNonce);

        try {
            const responseTime = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: payloadTime,
                credentials: 'include'
            });
            const dataTime = await responseTime.json();

            if (dataTime.success) {
                const { time, chest_level: chest_level_string } = dataTime.data;
                const chest_level = parseInt(chest_level_string, 10);

                if (chest_level >= 4) {
                    showNotification('PhÃºc Lá»£i ÄÆ°á»ng Ä‘Ã£ hoÃ n táº¥t hÃ´m nay!', 'success');
                    taskTracker.markTaskDone(accountId, 'phucloi');
                    return;
                }

                if (time === '00:00') {
                    console.log(`[HH3D PhÃºc Lá»£i ÄÆ°á»ng] ðŸŽ Äang má»Ÿ rÆ°Æ¡ng cáº¥p ${chest_level + 1}...`);
                    const payloadOpen = new URLSearchParams();
                    payloadOpen.append('action', 'open_chest_pl');
                    payloadOpen.append('security_token', securityToken);
                    payloadOpen.append('security', securityNonce);
                    payloadOpen.append('chest_id', chest_level + 1);

                    const responseOpen = await fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: payloadOpen,
                        credentials: 'include'
                    });
                    const dataOpen = await responseOpen.json();

                    if (dataOpen.success) {
                        const message = dataOpen.data && dataOpen.data.message ? dataOpen.data.message : 'Má»Ÿ rÆ°Æ¡ng thÃ nh cÃ´ng!';
                        showNotification(message, 'success');
                        if (message.includes('Ä‘Ã£ hoÃ n thÃ nh PhÃºc Lá»£i ngÃ y hÃ´m nay')) {
                            taskTracker.markTaskDone(accountId, 'phucloi');
                        } else {
                            const isVip = localStorage.getItem('generalVipMode') === 'true';
                            const nextDelay = isVip ? '07:33' : '30:00';
                            taskTracker.adjustTaskTime(accountId, 'phucloi', timePlus(nextDelay));
                        }
                    } else {
                        const errorMessage = dataOpen.data && dataOpen.data.message ? dataOpen.data.message : 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi má»Ÿ rÆ°Æ¡ng.';
                        showNotification(errorMessage, 'error');
                    }
                } else {
                    showNotification(`Vui lÃ²ng Ä‘á»£i ${time} Ä‘á»ƒ má»Ÿ rÆ°Æ¡ng tiáº¿p theo.`, 'warn');
                    const isVip = localStorage.getItem('generalVipMode') === 'true';
                    if (isVip) {
                        const parts = time.split(':').map(Number);
                        const serverWaitMs = parts.length === 2 ? (parts[0] * 60 + parts[1]) * 1000 : 0;
                        const vipWaitMs = 7 * 60 * 1000 + 33 * 1000; // 7.55 minutes
                        const waitMs = (serverWaitMs > 0 && serverWaitMs < vipWaitMs) ? serverWaitMs : vipWaitMs;
                        taskTracker.adjustTaskTime(accountId, 'phucloi', Date.now() + waitMs);
                    } else {
                        taskTracker.adjustTaskTime(accountId, 'phucloi', timePlus(time));
                    }
                }
            } else {
                const errorMessage = dataTime.data && dataTime.data.message ? dataTime.data.message : 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi láº¥y thá»i gian.';
                showNotification(errorMessage, 'error');
            }
        } catch (e) {
            showNotification(`Lá»—i máº¡ng khi thá»±c hiá»‡n PhÃºc Lá»£i ÄÆ°á»ng: ${e.message}`, 'error');
        }
    }

    async function phucloiclaimbonus() {
        const logPrefix = "[HH3D PhÃºc Lá»£i Claim Bonus]";
        const ajaxUrl = weburl + "wp-content/themes/halimmovies-child/hh3d-ajax.php";

        // BÆ°á»›c 1: Láº¥y security token tá»« trang hoáº·c fallback sang AJAX
        let securityToken = null;
        try {
            const resp = await fetch(weburl + "phuc-loi-duong?t", { credentials: "include" });
            const html = await resp.text();
            const match = html.match(/"securityToken"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
                securityToken = match[1];
                console.log(`${logPrefix} âœ… Security token tá»« HTML:`, securityToken);
            }
        } catch (err) {
            console.warn(`${logPrefix} âš ï¸ Lá»—i khi parse HTML:`, err);
        }

        if (!securityToken) {
            try {
                const resAjax = await fetch(ajaxUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                    body: "action=get_next_time_pl",
                    credentials: "include"
                });
                const dataAjax = await resAjax.json();
                if (dataAjax && dataAjax.security_token) {
                    securityToken = dataAjax.security_token;
                    console.log(`${logPrefix} âœ… Security token tá»« AJAX:`, securityToken);
                }
            } catch (err) {
                console.error(`${logPrefix} âŒ Lá»—i khi gá»i AJAX:`, err);
            }
        }

        if (!securityToken) {
            console.error(`${logPrefix} âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c security token.`);
            return;
        }

        // BÆ°á»›c 2: Thá»­ chest_id tá»« 1 Ä‘áº¿n 4
        for (let chestId = 1; chestId <= 4; chestId++) {
            const payload = new URLSearchParams();
            payload.append("action", "claim_bonus_reward");
            payload.append("security_token", securityToken);
            payload.append("chest_id", chestId);

            try {
                const response = await fetch(ajaxUrl, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: payload,
                    credentials: "include"
                });

                const data = await response.json();
                // console.log(`${logPrefix} Chest ${chestId}:`, data);

                if (data.success) {
                    showNotification(`${logPrefix} âœ… Chest ${chestId}: ${data.data?.message}`, "success");
                } else {
                    showNotification(`${logPrefix} âš ï¸ Chest ${chestId}: ${data.data?.message}`, "warn");
                }
            } catch (err) {
                showNotification(`${logPrefix} âŒ Lá»—i khi gá»i chest ${chestId}: ${err}`, "error");
            }
        }
    }

    // ===============================================
    // BÃ Cáº¢NH
    // ===============================================
    class BiCanh {
        constructor() {
            this.weburl = weburl;
            this.logPrefix = '[HH3D BÃ­ Cáº£nh]';
        }

        async doBiCanh() {
            console.log(`${this.logPrefix} â–¶ï¸ Báº¯t Ä‘áº§u nhiá»‡m vá»¥ BÃ­ Cáº£nh TÃ´ng MÃ´n.`);

            // 1. Láº¥y nonce
            const nonce = await this.getNonce();
            if (!nonce) {
                showNotification('Lá»—i: KhÃ´ng thá»ƒ láº¥y nonce cho BÃ­ Cáº£nh TÃ´ng MÃ´n.', 'error');
                throw new Error('Lá»—i nonce bÃ­ cáº£nh');
            }

            // 2. Láº¥y boss status
            let statusResp = await this.getBossStatus(nonce);
            console.log("[DEBUG láº¥y boss status]", statusResp);

            // Cáº­p nháº­t % HP boss lÃªn UI quest item BÃ­ Cáº£nh
            if (statusResp?.boss?.hp_percentage != null) {
                window.bicanhBossHp = Number(statusResp.boss.hp_percentage);
                const bicanhProgressSpan = document.querySelector('.nv-quest-item[data-task-id="bicanh"] .quest-progress');
                if (bicanhProgressSpan) {
                    const baseText = bicanhProgressSpan.textContent.replace(/\s*\([^)]*%\s*HP\)/g, '').trimEnd();
                    bicanhProgressSpan.textContent = baseText + ` (${window.bicanhBossHp.toFixed(2)}% HP)`;
                }
            }

            // 3. Náº¿u cÃ³ thÆ°á»Ÿng pending thÃ¬ nháº­n
            if (statusResp?.has_pending_reward) {
                console.log(`${this.logPrefix} ðŸŽ CÃ³ thÆ°á»Ÿng chÆ°a nháº­n, tiáº¿n hÃ nh nháº­n...`);
                const rewardResponse = await this.sendApiRequest('wp-json/tong-mon/v1/claim-boss-reward', 'POST', nonce, {});
                console.log("[DEBUG ClaimReward response]", rewardResponse)
                if (rewardResponse?.success) {
                    showNotification(rewardResponse.message, 'success');
                }
                // Sau khi nháº­n thÆ°á»Ÿng, láº¥y láº¡i boss status sáº¡ch
                statusResp = await this.getBossStatus(nonce);
                console.log("[DEBUG BossStatus sau khi nháº­n thÆ°á»Ÿng]", statusResp);

            }

            // 4. Kiá»ƒm tra cooldown
            await this.sleep(500);
            console.log("[DEBUG TrÆ°á»›c khi check cooldown, statusResp]", statusResp);
            const canAttack = await this.checkAttackCooldown(nonce, statusResp);
            console.log("[DEBUG Káº¿t quáº£ checkAttackCooldown]: canattack", canAttack);
            if (!canAttack) return;

            // 5. Táº¥n cÃ´ng boss
            await this.sleep(500);
            await this.attackBoss(nonce);
        }

        async getNonce() {
            const nonce = await getSecurityNonce(weburl + 'bi-canh-tong-mon?t', "nonce");
            return nonce || null;
        }

        async getBossStatus(nonce) {
            console.log(`${this.logPrefix} ðŸ“¡ Gá»i API getBossStatus...`);
            const resp = await this.sendApiRequest('wp-json/tong-mon/v1/get-boss-status', 'POST', nonce, {});
            console.log("[DEBUG getBossStatus response]", resp);
            return resp;
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async isReserveHold() {
            const nonce = await this.getNonce();
            if (!nonce) return false;

            // Láº¥y thÃ´ng tin boss status
            const statusResp = await this.sendApiRequest('wp-json/tong-mon/v1/get-boss-status', 'POST', nonce, {});
            //console.log(`${this.logPrefix} Debug boss status:`, statusResp);

            const remaining = Number(statusResp?.attack_info?.remaining ?? 0);
            const reserve = Number(localStorage.getItem('reserveBiCanhAttacks') || '0');
            console.log("[DEBUG isReserveHold] reserveBiCanhAttacks:", reserve);
            console.log("[DEBUG isReserveHold] remaining:", remaining);

            // Náº¿u cÃ³ cáº¥u hÃ¬nh giá»¯ lÆ°á»£t vÃ  sá»‘ lÆ°á»£t cÃ²n láº¡i <= sá»‘ lÆ°á»£t giá»¯ â†’ coi nhÆ° Ä‘ang giá»¯
            return reserve > 0 && remaining <= reserve;
        }

        async checkAttackCooldown(nonce, statusResp) {

            console.log(`${this.logPrefix} â²ï¸ Äang kiá»ƒm tra thá»i gian há»“i chiÃªu...`);
            const endpoint = 'wp-json/tong-mon/v1/check-attack-cooldown';

            try {
                const response = await this.sendApiRequest(endpoint, 'POST', nonce, {});
                console.log("[DEBUG checkAttackCooldown response]", response);
                // const statusResp = await this.getBossStatus(nonce);
                // console.log("[DEBUG BossStatus]", statusResp);

                // Náº¿u cÃ³ thá»ƒ táº¥n cÃ´ng
                if (response?.success && response.can_attack) {
                    // Kiá»ƒm tra giá»¯ lÆ°á»£t
                    if (await this.isReserveHold()) {
                        const msg = `Äang giá»¯ lÆ°á»£t, khÃ´ng táº¥n cÃ´ng.`;
                        console.log(`${this.logPrefix} ðŸ›‘ ${msg}`);
                        showNotification(msg, 'info');
                        // âŒ KhÃ´ng hiá»ƒn thá»‹ countdown trong trÆ°á»ng há»£p giá»¯ lÆ°á»£t
                        //taskTracker.adjustTaskTime(accountId, 'bicanh', null);
                        return false;
                    }
                    const statusResp = await this.sendApiRequest('wp-json/tong-mon/v1/get-boss-status', 'POST', nonce, {});
                    const remaining = Number(statusResp?.attack_info?.remaining ?? 0);
                    console.log(`${this.logPrefix} âœ… CÃ³ thá»ƒ táº¥n cÃ´ng. CÃ²n ${remaining} lÆ°á»£t.`);
                    return true;
                }

                // Boss cháº¿t
                if (response?.success && response.message === 'KhÃ´ng cÃ³ boss Ä‘á»ƒ táº¥n cÃ´ng') {
                    await this.sleep(1000);
                    const rewardResponse = await this.sendApiRequest('wp-json/tong-mon/v1/claim-boss-reward', 'POST', nonce, {});
                    if (rewardResponse?.success) showNotification(rewardResponse.message, 'success');

                    const contributionResponse = await this.sendApiRequest('wp-json/tong-mon/v1/contribute-boss', 'POST', nonce, {});
                    if (contributionResponse) {
                        showNotification(contributionResponse.message, contributionResponse.success ? 'success' : 'warn');
                    }

                    taskTracker.adjustTaskTime(accountId, 'bicanh', null);
                    return false;
                }

                // Countdown hiá»ƒn thá»‹ khi cÃ³ cooldown_remaining (trá»« trÆ°á»ng há»£p giá»¯ lÆ°á»£t)
                if (Number.isFinite(response?.cooldown_remaining)) {
                    console.log("[DEBUG Cooldown_remaining]", response.cooldown_remaining);
                    taskTracker.adjustTaskTime(accountId, 'bicanh', Date.now() + response.cooldown_remaining * 1000);
                } else {
                    console.log("[DEBUG KhÃ´ng cÃ³ cooldown_remaining, reset taskTime]");
                    taskTracker.adjustTaskTime(accountId, 'bicanh', null);
                }

                const message = response?.message || 'KhÃ´ng thá»ƒ táº¥n cÃ´ng vÃ o lÃºc nÃ y.';
                showNotification(`â³ ${message}`, 'info');
                return false;

            } catch (e) {
                showNotification(`${this.logPrefix} âŒ Lá»—i kiá»ƒm tra cooldown: ${e.message}`, 'error');
                return false;
            }
        }

        async attackBoss(nonce) {
            console.log(`${this.logPrefix} ðŸ”¥ Äang khiÃªu chiáº¿n boss...`);
            const endpoint = 'wp-json/tong-mon/v1/attack-boss';

            try {
                const response = await this.sendApiRequest(endpoint, 'POST', nonce, {});
                if (response && response.success) {
                    console.log("[DEBUG attackBoss response]", response);
                    const message = response.message || `GÃ¢y ${response.damage} sÃ¡t thÆ°Æ¡ng.`;
                    showNotification(message, 'success');
                    taskTracker.adjustTaskTime(accountId, 'bicanh', timePlus('07:00'));
                } else {
                    const errorMessage = response?.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi táº¥n cÃ´ng.';
                    console.log("[DEBUG attackBoss errorMessage]", errorMessage);
                    showNotification(errorMessage, 'error');
                }
            } catch (e) {
                showNotification(`Lá»—i máº¡ng khi táº¥n cÃ´ng boss BÃ­ Cáº£nh: ${e.message}`, 'error');
            }
        }

        async isDailyLimit() {
            const endpoint = 'wp-json/tong-mon/v1/check-attack-cooldown';
            const nonce = await this.getNonce();
            if (!nonce) return false;

            try {
                const response = await this.sendApiRequest(endpoint, 'POST', nonce, {});
                return response && response.success && response.cooldown_type === 'daily_limit';
            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i kiá»ƒm tra cooldown:`, e);
                return false;
            }
        }

        async sendApiRequest(endpoint, method, nonce, body = {}) {
            try {
                const url = `${this.weburl}${endpoint}`;
                const headers = {
                    "Content-Type": "application/json",
                    "X-WP-Nonce": nonce,
                    "Accept": "*/*",
                    "Accept-Language": "vi,en-US;q=0.5",
                    "X-Requested-With": "XMLHttpRequest",
                };
                const response = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(body),
                    credentials: 'include'
                });
                return await response.json();
            } catch (error) {
                console.error(`${this.logPrefix} âŒ Lá»—i khi gá»­i yÃªu cáº§u tá»›i ${endpoint}:`, error);
                throw error;
            }
        }
    }


    // ===============================================
    // BÃ Cáº¢NH HIáº¾N Táº¾
    // ===============================================
    class BiCanhHienTe {
        constructor() {
            this.weburl = weburl;
            this.logPrefix = "[HH3D BÃ­ Cáº£nh Socket]";
            this.biCanhSocketActive = false;
            this.biCanhSocketWaiter = null;
            this.handledBossIds = new Set();
            this.currentDay = this.getTodayKey();
            this.currentBossId = null;
        }

        getTodayKey() {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        }

        resetIfNewDay() {
            const today = this.getTodayKey();
            if (today !== this.currentDay) {
                this.currentDay = today;
                this.handledBossIds.clear();
                console.log(`${this.logPrefix} ðŸ”„ Reset handledBossIds vÃ¬ sang ngÃ y má»›i`);
                showNotification(`${this.logPrefix} ðŸ”„ Reset handledBossIds vÃ¬ sang ngÃ y má»›i`, 'info');
            }
        }

        async sendApiRequest(endpoint, method, nonce, body = {}) {
            try {
                const url = `${this.weburl}${endpoint}`;
                const headers = {
                    "Content-Type": "application/json",
                    "X-WP-Nonce": nonce,
                    "Accept": "*/*",
                    "Accept-Language": "vi,en-US;q=0.5",
                    "X-Requested-With": "XMLHttpRequest",
                };
                const response = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(body),
                    credentials: 'include'
                });
                return await response.json();
            } catch (error) {
                console.error(`${this.logPrefix} âŒ Lá»—i khi gá»­i yÃªu cáº§u tá»›i ${endpoint}:`, error);
                showNotification(`${this.logPrefix} âŒ Lá»—i khi gá»­i yÃªu cáº§u tá»›i ${endpoint}:`, error);
                throw error;
            }
        }

        async updateCurrentBossId() {
            const nonce = await getNonce();
            if (!nonce) {
                console.error(`${this.logPrefix} âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c nonce`);
                showNotification(`${this.logPrefix} âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c nonce`, 'info)');
                return null;
            }
            const res = await this.sendApiRequest("wp-json/tong-mon/v1/get-boss-status", "POST", nonce, {});
            //console.log(`${this.logPrefix} ðŸ“¦ Response get-boss-status:`, res);
            //showNotification(`${this.logPrefix} ðŸ“¦ Response get-boss-status:`, res,'info');

            if (res?.boss?.id) {
                this.currentBossId = res.boss.id;
                // console.log(`${this.logPrefix} ðŸŽ¯ Current boss id set to ${this.currentBossId}`);
                // showNotification(`${this.logPrefix} ðŸŽ¯ Current boss id set to ${this.currentBossId}`);
            } else {
                console.warn(`${this.logPrefix} âš ï¸ KhÃ´ng tÃ¬m tháº¥y boss id trong response`);
                showNotification(`${this.logPrefix} âš ï¸ KhÃ´ng tÃ¬m tháº¥y boss id trong response`, 'info');
            }
            return this.currentBossId;
        }


        async handleBossDefeated(bossId) {
            this.resetIfNewDay();
            if (this.handledBossIds.has(bossId)) return;
            this.handledBossIds.add(bossId);

            showNotification(`ðŸ’€ Boss ${bossId} cháº¿t! Chuáº©n bá»‹ hiáº¿n táº¿...`, "warn");

            // Delay ngáº«u nhiÃªn trÆ°á»›c khi báº¯t Ä‘áº§u
            const initialDelay = Math.floor(Math.random() * 1000) + 2000;
            await new Promise(resolve => setTimeout(resolve, initialDelay));

            const nonce = await getNonce();
            if (!nonce) {
                console.error(`${this.logPrefix} âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c nonce`);
                showNotification(`${this.logPrefix} âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c nonce`, 'info');
                return;
            }

            // HÃ m gá»i API vá»›i retry/backoff - retry tá»‘i Ä‘a 3 láº§n
            const safeApiCall = async (endpoint, body = {}, retries = 3) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        return await this.sendApiRequest(endpoint, "POST", nonce, body);
                    } catch (err) {
                        if (i < retries - 1) {
                            const backoff = (i + 1) * 1000; // tÄƒng dáº§n: 1s, 2s, 3s
                            console.warn(`${this.logPrefix} âš ï¸ Lá»—i khi gá»i ${endpoint}, thá»­ láº¡i sau ${backoff}ms`);
                            showNotification(`${this.logPrefix} âš ï¸ Lá»—i khi gá»i ${endpoint}, thá»­ láº¡i sau ${backoff}ms`, 'info');

                            await new Promise(r => setTimeout(r, backoff));
                        } else {
                            console.error(`${this.logPrefix} âŒ Gá»i ${endpoint} tháº¥t báº¡i sau ${retries} láº§n`);
                            throw err;
                        }
                    }
                }
            };

            // Nháº­n thÆ°á»Ÿng
            const reward = await safeApiCall("wp-json/tong-mon/v1/claim-boss-reward");
            if (reward?.success) showNotification(reward.message, "success");

            // Delay trÆ°á»›c khi hiáº¿n táº¿
            const contribDelay = Math.floor(Math.random() * 1000) + 2000;
            await new Promise(resolve => setTimeout(resolve, contribDelay));

            // Hiáº¿n táº¿
            const contrib = await safeApiCall("wp-json/tong-mon/v1/contribute-boss");
            if (contrib?.success) showNotification(contrib.message, "success");
        }



        // Check event
        async processBossEvent(event, data) {
            if (!this.biCanhSocketActive || !data) return;
            const bossId = data.boss_id;

            if (bossId !== this.currentBossId) return;
            console.log(`[BiCanh] ${event} cho boss ${bossId}:`, data);
            if (event === "boss_tm_hp_update") {

                // Hiá»ƒn thá»‹ rÃµ thÃ´ng tin HP boss
                const { current_hp, max_hp, hp_percentage } = data;
                showNotification(`[BiCanh] Boss ${bossId}: HP ${current_hp}/${max_hp} (${Number(hp_percentage).toFixed(2)}%)`, 'info');

                // Cáº­p nháº­t trá»±c tiáº¿p vÃ o UI quest item BÃ­ Cáº£nh
                window.bicanhBossHp = Number(hp_percentage);
                const bicanhProgressSpan = document.querySelector('.nv-quest-item[data-task-id="bicanh"] .quest-progress');
                if (bicanhProgressSpan) {
                    // Giá»¯ nguyÃªn text tiáº¿n Ä‘á»™ gá»‘c (vÃ­ dá»¥: " 5/5"), chá»‰ thay pháº§n HP
                    const baseText = bicanhProgressSpan.textContent.replace(/\s*\([^)]*%\s*HP\)/g, '').trimEnd();
                    bicanhProgressSpan.textContent = baseText + ` (${Number(hp_percentage).toFixed(2)}% HP)`;
                }

                if (Number(current_hp) === 0) {
                    await this.handleBossDefeated(bossId);
                }
            } else if (event === "boss_tm_defeated") {
                showNotification(`[BiCanh] Boss ${bossId} Ä‘Ã£ bá»‹ Ä‘Ã¡nh báº¡i!`, 'warn');
                await this.handleBossDefeated(bossId);
            } else {
                // CÃ¡c event khÃ¡c giá»¯ nguyÃªn
                showNotification(`[BiCanh] ${event} cho boss ${bossId}:`, data);
            }
        }

        async startBossSocketListener() {
            if (this.biCanhSocketActive) return;
            this.biCanhSocketActive = true;
            // console.log(`${this.logPrefix} â–¶ï¸ Báº¯t Ä‘áº§u startBossSocketListener`);
            // showNotification(`${this.logPrefix} â–¶ï¸ Báº¯t Ä‘áº§u startBossSocketListener`);
            if (this.biCanhSocketWaiter) clearInterval(this.biCanhSocketWaiter);
            this.biCanhSocketWaiter = setInterval(async () => {
                if (typeof socket !== "undefined" && typeof socket.on === "function") {
                    clearInterval(this.biCanhSocketWaiter);
                    this.biCanhSocketWaiter = null;

                    // console.log(`${this.logPrefix} âœ… Socket sáºµn sÃ ng, gá»i updateCurrentBossId...`);
                    // showNotification(`${this.logPrefix} âœ… Socket sáºµn sÃ ng, gá»i updateCurrentBossId...`, "info");
                    await this.updateCurrentBossId();
                    //showNotification(`${this.logPrefix} theo dÃµi bossId=${this.currentBossId})`, "info");
                    if (typeof socket.off === "function") {
                        socket.off("boss_tm_hp_update");
                        socket.off("boss_tm_defeated");
                    }

                    socket.on("boss_tm_hp_update", (data) => this.processBossEvent("boss_tm_hp_update", data));
                    socket.on("boss_tm_defeated", (data) => this.processBossEvent("boss_tm_defeated", data));

                    showNotification(`ÄÃ£ káº¿t ná»‘i socket BÃ­ Cáº£nh (theo dÃµi bossId=${this.currentBossId})`, "info");
                }
            }, 200);
        }


        stopBossSocketListener() {
            //showNotification(`${this.logPrefix} (bossId=${this.currentBossId}) trÆ°á»›c khi clear`,'info');
            this.biCanhSocketActive = false;
            this.handledBossIds.clear();
            // console.log(`${this.logPrefix} â¹ï¸ Reset handledBossIds khi stop listener (bossId=${this.currentBossId})`);
            //  showNotification(`${this.logPrefix} â¹ï¸ Reset handledBossIds khi stop listener (bossId=${this.currentBossId})`,'info');
            if (this.biCanhSocketWaiter) {
                clearInterval(this.biCanhSocketWaiter);
                this.biCanhSocketWaiter = null;
            }

            if (typeof socket !== "undefined" && typeof socket.off === "function") {
                socket.off("boss_tm_hp_update");
                socket.off("boss_tm_defeated");
            }

            showNotification(`â¹ï¸ Socket listener BÃ­ Cáº£nh Ä‘Ã£ táº¯t (bossId=${this.currentBossId})`, "warn");
        }
    }
    // ===============================================
    // HOANG Vá»°C
    // ===============================================
    class HoangVuc {
        constructor() {
            this.ajaxUrl = `${weburl}wp-content/themes/halimmovies-child/hh3d-ajax.php`;
            this.adminAjaxUrl = `${weburl}wp-admin/admin-ajax.php`;
            this.logPrefix = "[HH3D Hoang Vá»±c]";
            this.headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "referer": weburl + 'hoang-vuc?t=' + Math.random().toString(36).substring(2, 8),
            };
            // this.attackToken = null;
        }
        /**
        * Láº¥y nguyÃªn tá»‘ cá»§a ngÆ°á»i dÃ¹ng tá»« trang Hoang Vá»±c.
        */
        extractAttackToken(html) {
            const m = html.match(/var\s+boss_attack_token\s*=\s*['"]([a-f0-9]+)['"]/i);
            return m ? m[1] : null;
        }
        async getMyElement() {
            const url = weburl + 'hoang-vuc?t=' + Math.random().toString(36).substring(2, 8);
            const response = await fetch(url);
            const text = await response.text();

            const m = text.match(/var\s+boss_attack_token\s*=\s*['"]([a-f0-9]+)['"]/i);
            this.attackToken = m ? m[1] : null;
            console.log(`${this.logPrefix} ðŸ”‘ Láº¥y attack token: ${this.attackToken}`);
            // const regex = /<img id="user-nguhanh-image".*?src=".*?ngu-hanh-(.*?)\.gif"/;
            const regex = /(?:class="user-element"[^>]*>.*?|id="user-nguhanh-image"[^>]*data-src=")[^"']*ngu-hanh-(moc|thuy|hoa|tho|kim)\.gif/i;
            const match = text.match(regex);
            if (match && match[1]) {
                const element = match[1];
                console.log(`${this.logPrefix} âœ… ÄÃ£ láº¥y Ä‘Æ°á»£c nguyÃªn tá»‘ cá»§a báº¡n: ${element}`);
                return { element, attackToken: this.attackToken };
            } else {
                console.error(`${this.logPrefix} âŒ KhÃ´ng tÃ¬m tháº¥y nguyÃªn tá»‘ cá»§a ngÆ°á»i dÃ¹ng.`);
                return { element: null, attackToken: this.attackToken };
            }
        }

        /**
        * XÃ¡c Ä‘á»‹nh nguyÃªn tá»‘ tá»‘i Æ°u dá»±a trÃªn boss vÃ  chiáº¿n lÆ°á»£c.
        * @param {string} bossElement - NguyÃªn tá»‘ cá»§a boss.
        * @param {boolean} maximizeDamage - true: tá»‘i Ä‘a hÃ³a sÃ¡t thÆ°Æ¡ng; false: trÃ¡nh giáº£m sÃ¡t thÆ°Æ¡ng.
        * @returns {Array<string>} Máº£ng chá»©a cÃ¡c nguyÃªn tá»‘ phÃ¹ há»£p.
        */
        getTargetElement(bossElement, maximizeDamage) {
            const rules = {
                'kim': { khac: 'moc', bi_khac: 'hoa' },
                'moc': { khac: 'tho', bi_khac: 'kim' },
                'thuy': { khac: 'hoa', bi_khac: 'tho' },
                'hoa': { khac: 'kim', bi_khac: 'thuy' },
                'tho': { khac: 'thuy', bi_khac: 'moc' },
            };

            const suitableElements = [];

            if (maximizeDamage) {
                // Tá»‘i Ä‘a hÃ³a sÃ¡t thÆ°Æ¡ng: tÃ¬m nguyÃªn tá»‘ kháº¯c boss
                for (const myElement in rules) {
                    if (rules[myElement].khac === bossElement) {
                        suitableElements.push(myElement);
                        break; // Chá»‰ cáº§n má»™t nguyÃªn tá»‘ kháº¯c lÃ  Ä‘á»§
                    }
                }
            } else {
                // KhÃ´ng bá»‹ giáº£m sÃ¡t thÆ°Æ¡ng: tÃ¬m táº¥t cáº£ cÃ¡c nguyÃªn tá»‘ khÃ´ng bá»‹ boss kháº¯c
                for (const myElement in rules) {
                    if (rules[myElement].bi_khac !== bossElement) {
                        suitableElements.push(myElement);
                    }
                }
            }
            return suitableElements;
        }

        /**
        * Nháº­n thÆ°á»Ÿng Hoang Vuc.
        */
        async claimHoangVucRewards(nonce) {
            const payload = new URLSearchParams();
            payload.append('action', 'claim_chest');
            payload.append('nonce', nonce);

            console.log(`${this.logPrefix} ðŸŽ Äang nháº­n thÆ°á»Ÿng...`);
            const response = await fetch(this.adminAjaxUrl, {
                method: 'POST',
                headers: this.headers,
                body: payload,
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                const rewards = data.total_rewards;
                const message = `âœ… Nháº­n thÆ°á»Ÿng thÃ nh cÃ´ng: +${rewards.tinh_thach} Tinh Tháº¡ch, +${rewards.tu_vi} Tu Vi.`;
                console.log(message);
                showNotification(message, 'success');
            } else {
                console.error(`${this.logPrefix} âŒ Lá»—i khi nháº­n thÆ°á»Ÿng:`, data.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh.');
                showNotification(data.message || 'Lá»—i khi nháº­n thÆ°á»Ÿng.', 'error');
            }
        }

        /**
        * Táº¥n cÃ´ng boss Hoang Vá»±c.
        * @param {string} bossId - ID cá»§a boss cáº§n táº¥n cÃ´ng.
        * @param {string} nonce - Nonce báº£o máº­t.
        * @returns {Promise<boolean>} `True` náº¿u táº¥n cÃ´ng thÃ nh cÃ´ng, ngÆ°á»£c láº¡i lÃ  `false`.
        */
        async attackHoangVucBoss(bossId, nonce) {
            const currentTime = Date.now();
            const securityToken = await getSecurityToken(weburl + 'hoang-vuc?t=' + Math.random().toString(36).substring(2, 8));
            const requestId = `req_${Math.random().toString(36).substring(2, 8)}_${currentTime}`;
            const payload = new URLSearchParams();
            payload.append('action', `${(typeof hData !== 'undefined' && hData.act) ? hData.act.bossAttack : 'attack_boss'}`);
            payload.append('boss_id', bossId);
            payload.append('security_token', securityToken);
            payload.append('nonce', nonce);
            payload.append('attack_token', hData.attackToken || '');
            payload.append('request_id', `req_${Math.random().toString(36).substring(2, 8)}${currentTime}`);
            console.log(`${this.logPrefix} ðŸ›¡ï¸ Chuáº©n bá»‹ táº¥n cÃ´ng boss ${bossId} vá»›i payload:`, Object.fromEntries(payload.entries()));

            const response = await fetch(this.ajaxUrl, {
                method: 'POST',
                headers: this.headers,
                body: payload,
                credentials: 'include'
            });
            const data = await response.json();
            console.log(`${this.logPrefix} ðŸ“¦ Response attackHoangVucBoss:`, data);
            if (data.success) {
                const message = data.data.message || data.message || JSON.stringify(data) || 'Táº¥n cÃ´ng thÃ nh cÃ´ng!';
                console.log(`${this.logPrefix} âœ… ${message}`);
                showNotification(`âœ… ${message}`, 'success');
                return true
            } else if (data.data.error === 'Äáº¡o há»¯u Ä‘Ã£ háº¿t lÆ°á»£t táº¥n cÃ´ng trong ngÃ y.') {
                taskTracker.markTaskDone(accountId, 'hoangvuc');
                showNotification('Äáº¡o há»¯u Ä‘Ã£ háº¿t lÆ°á»£t táº¥n cÃ´ng trong ngÃ y.', 'info');
                return true;
            }
            else {
                const errorMessage = data.data.error || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi táº¥n cÃ´ng.';
                showNotification(errorMessage, 'error');
                return false;
            }
        }

        /**
        * Láº·p láº¡i viá»‡c Ä‘á»•i nguyÃªn tá»‘ cho Ä‘áº¿n khi Ä‘áº¡t Ä‘Æ°á»£c nguyÃªn tá»‘ phÃ¹ há»£p hoáº·c khÃ´ng thá»ƒ Ä‘á»•i tiáº¿p.
        * @param {string} currentElement - NguyÃªn tá»‘ hiá»‡n táº¡i cá»§a ngÆ°á»i dÃ¹ng.
        * @param {string} bossElement - NguyÃªn tá»‘ cá»§a boss.
        * @param {boolean} maximizeDamage - Chiáº¿n lÆ°á»£c tá»‘i Ä‘a hÃ³a sÃ¡t thÆ°Æ¡ng hay khÃ´ng.
        * @param {string} nonce - Nonce báº£o máº­t.
        * @returns {Promise<string|null>} NguyÃªn tá»‘ má»›i náº¿u Ä‘á»•i thÃ nh cÃ´ng, ngÆ°á»£c láº¡i lÃ  null.
        */
        async changeElementUntilSuitable(currentElement, bossElement, maximizeDamage, nonce) {
            let myElement = currentElement;
            let changeAttempts = 0;
            const MAX_ATTEMPTS = 5;

            const rules = {
                'kim': { khac: 'moc', bi_khac: 'hoa' },
                'moc': { khac: 'tho', bi_khac: 'kim' },
                'thuy': { khac: 'hoa', bi_khac: 'tho' },
                'hoa': { khac: 'kim', bi_khac: 'thuy' },
                'tho': { khac: 'thuy', bi_khac: 'moc' },
            };

            function isOptimal(el) {
                return rules[el].khac === bossElement;
            }
            function isNeutral(el) {
                return rules[el].bi_khac !== bossElement;
            }

            while (changeAttempts < MAX_ATTEMPTS) {
                changeAttempts++;

                const currentlyOptimal = isOptimal(myElement);
                const currentlyNeutral = isNeutral(myElement);

                // ðŸ”Ž Kiá»ƒm tra trÆ°á»›c khi Ä‘á»•i
                if (!currentlyNeutral) {
                    console.log(`${this.logPrefix} âŒ Äang bá»‹ boss kháº¯c cháº¿ -> pháº£i Ä‘á»•i.`);
                } else {
                    if (maximizeDamage && currentlyOptimal) {
                        console.log(`${this.logPrefix} ðŸŒŸ Äang á»Ÿ tráº¡ng thÃ¡i tá»‘i Æ°u. Dá»«ng Ä‘á»•i.`);
                        return myElement;
                    }
                    if (!maximizeDamage && currentlyNeutral) {
                        console.log(`${this.logPrefix} âœ… Äang á»Ÿ tráº¡ng thÃ¡i hÃ²a (khÃ´ng bá»‹ giáº£m). Dá»«ng Ä‘á»•i.`);
                        return myElement;
                    }
                }

                // ðŸ”„ Tiáº¿n hÃ nh Ä‘á»•i element
                const payloadChange = new URLSearchParams({ action: 'change_user_element', nonce });
                const changeData = await (await fetch(this.ajaxUrl, {
                    method: 'POST',
                    headers: this.headers,
                    body: payloadChange,
                    credentials: 'include'
                })).json();

                if (changeData.success) {
                    myElement = changeData.data.new_element;
                    console.log(`${this.logPrefix} ðŸ”„ Äá»•i láº§n ${changeAttempts} -> ${myElement}`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    console.error(`${this.logPrefix} âŒ Lá»—i khi Ä‘á»•i:`, changeData.message || 'KhÃ´ng xÃ¡c Ä‘á»‹nh.');
                    return myElement;
                }
            }

            // â³ Háº¿t lÆ°á»£t Ä‘á»•i nhÆ°ng váº«n chÆ°a Ä‘áº¡t chiáº¿n lÆ°á»£c
            console.log(`${this.logPrefix} âš ï¸ ÄÃ£ háº¿t MAX_ATTEMPTS (${MAX_ATTEMPTS}). Cháº¥p nháº­n nguyÃªn tá»‘ cuá»‘i cÃ¹ng: ${myElement}`);
            return myElement;
        };

        async getNonceAndRemainingAttacks(url) {
            const logPrefix = '[Hoang Vá»±c]';
            console.log(`${logPrefix} â–¶ï¸ Äang táº£i trang tá»« ${url}...`);
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();

                hData = parseHh3dData(html);

                // Regex 1: láº¥y sá»‘ lÆ°á»£t Ä‘Ã¡nh
                const attacksMatch = html.match(/<div class="remaining-attacks">LÆ°á»£t Ä‘Ã¡nh cÃ²n láº¡i:\s*(\d+)<\/div>/);
                const remainingAttacks = attacksMatch ? parseInt(attacksMatch[1], 10) : null;

                // Regex 2: láº¥y nonce
                const nonceMatch = html.match(/var ajax_boss_nonce = '([a-f0-9]+)'/);
                const nonce = nonceMatch ? nonceMatch[1] : null;

                return { remainingAttacks, nonce };

            } catch (e) {
                console.error(`${logPrefix} âŒ Lá»—i khi táº£i trang hoáº·c trÃ­ch xuáº¥t dá»¯ liá»‡u:`, e);
                return { attackToken: null, remainingAttacks: null, nonce: null };
            }
        }


        /**
        * HÃ m chÃ­nh Ä‘á»ƒ tá»± Ä‘á»™ng hÃ³a Hoang Vá»±c.
        */
        async doHoangVuc() {
            const maximizeDamage = localStorage.getItem('hoangvucMaximizeDamage') === 'true';
            console.log(`${this.logPrefix} â–¶ï¸ Báº¯t Ä‘áº§u nhiá»‡m vá»¥ vá»›i chiáº¿n lÆ°á»£c: ${maximizeDamage ? 'Tá»‘i Ä‘a hÃ³a SÃ¡t thÆ°Æ¡ng' : 'KhÃ´ng giáº£m SÃ¡t thÆ°Æ¡ng'}.`);
            const hoangVucUrl = `${weburl}hoang-vuc?t`;
            const { remainingAttacks, nonce } = await this.getNonceAndRemainingAttacks(hoangVucUrl);

            if (!nonce) {
                showNotification('Lá»—i: KhÃ´ng thá»ƒ láº¥y nonce cho Hoang Vá»±c.', 'error');
                throw new Error("KhÃ´ng láº¥y Ä‘Æ°á»£c nonce");
            }

            const payloadBossInfo = new URLSearchParams();
            payloadBossInfo.append('action', 'get_boss');
            payloadBossInfo.append('nonce', nonce);

            try {
                const bossInfoResponse = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    headers: this.headers,
                    body: payloadBossInfo,
                    credentials: 'include'
                });
                const bossInfoData = await bossInfoResponse.json();

                if (bossInfoData.success) {
                    const boss = bossInfoData.data;

                    if (boss.has_pending_rewards) {
                        await this.claimHoangVucRewards(nonce);
                        return this.doHoangVuc();
                    } else if (boss.created_date === new Date().toISOString().slice(0, 10) && boss.health === boss.max_health) {
                        taskTracker.markTaskDone(accountId, 'hoangvuc');
                        return true;
                    }

                    let { element: myElement, attackToken } = await this.getMyElement();
                    const bossElement = boss.element;

                    // Láº¥y danh sÃ¡ch cÃ¡c nguyÃªn tá»‘ phÃ¹ há»£p
                    const suitableElements = this.getTargetElement(bossElement, maximizeDamage);

                    if (!suitableElements.includes(myElement)) {
                        console.log(`${this.logPrefix} ðŸ”„ NguyÃªn tá»‘ hiá»‡n táº¡i (${myElement}) khÃ´ng phÃ¹ há»£p. Äang thá»±c hiá»‡n Ä‘á»•i.`);
                        const newElement = await this.changeElementUntilSuitable(myElement, bossElement, maximizeDamage, nonce);

                        if (newElement && suitableElements.includes(newElement)) {
                            myElement = newElement;
                            console.log(`${this.logPrefix} âœ… ÄÃ£ cÃ³ Ä‘Æ°á»£c nguyÃªn tá»‘ phÃ¹ há»£p: ${myElement}.`);
                        } else {
                            console.log(`${this.logPrefix} âš ï¸ KhÃ´ng thá»ƒ cÃ³ Ä‘Æ°á»£c nguyÃªn tá»‘ phÃ¹ há»£p sau khi Ä‘á»•i. Tiáº¿p tá»¥c vá»›i nguyÃªn tá»‘ hiá»‡n táº¡i.`);
                        }
                    } else {
                        console.log(`${this.logPrefix} âœ… NguyÃªn tá»‘ hiá»‡n táº¡i (${myElement}) Ä‘Ã£ phÃ¹ há»£p. KhÃ´ng cáº§n Ä‘á»•i.`);
                    }
                    // Cáº­p nháº­t sá»‘ lÆ°á»£t Ä‘Ã¡nh cÃ²n láº¡i
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const timePayload = new URLSearchParams();
                    timePayload.append('action', 'get_next_attack_time');
                    const timeResponse = await fetch(this.ajaxUrl, {
                        method: 'POST',
                        headers: this.headers,
                        body: timePayload,
                        credentials: 'include'
                    });
                    const nextAttackTime = await timeResponse.json();

                    if (nextAttackTime.success && Date.now() >= nextAttackTime.data) {
                        // Thá»±c hiá»‡n táº¥n cÃ´ng boss Hoang Vá»±c, náº¿u thÃ nh cÃ´ng vÃ  cÃ²n 1 lÆ°á»£t táº¥n cÃ´ng thÃ¬ Ä‘Ã¡nh dáº¥u nhiá»‡m vá»¥ hoÃ n thÃ nh
                        await new Promise(resolve => setTimeout(resolve, 500));
                        if (await this.attackHoangVucBoss(boss.id, nonce)) {
                            const isVip = localStorage.getItem('generalVipMode') === 'true';
                            const nextAttackDelay = isVip ? '07:33' : '15:02';
                            taskTracker.adjustTaskTime(accountId, 'hoangvuc', timePlus(nextAttackDelay));   //--------- 15 phÃºt (VIP: 7.55 phÃºt) cho láº§n sau -----------//
                            if (remainingAttacks <= 1) {
                                taskTracker.markTaskDone(accountId, 'hoangvuc');
                            };
                        };
                    } else {
                        const remainingTime = nextAttackTime.data - Date.now();
                        const remainingSeconds = Math.floor(remainingTime / 1000);
                        const minutes = Math.floor(remainingSeconds / 60);
                        const seconds = remainingSeconds % 60;
                        const message = `â³ Cáº§n chá» <b>${minutes} phÃºt ${seconds} giÃ¢y</b> Ä‘á»ƒ táº¥n cÃ´ng tiáº¿p.`; ///////////////////
                        showNotification(message, 'info');
                        taskTracker.adjustTaskTime(accountId, 'hoangvuc', nextAttackTime.data);
                    }
                } else {
                    const errorMessage = bossInfoData.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi láº¥y thÃ´ng tin boss.';
                    showNotification(errorMessage, 'error');
                }
            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng:`, e);
                showNotification(e.message, 'error');
                throw e;
            }
        }
    }


    // ===============================================
    // HOANG Vá»°C SHOP
    // ===============================================


    class HoangVucShop {
        constructor() {
            this.ajaxUrl = `${weburl}wp-content/themes/halimmovies-child/hh3d-ajax.php`;
            this.logPrefix = "[HH3D Hoang Vuc Shop]";
            this.dailyLimit = 5;
        }

        async getHoangVucNonce() {
            const url = `${weburl}hoang-vuc?t`;
            try {
                const response = await fetch(url, { credentials: 'include' });
                if (!response.ok) return null;
                const html = await response.text();
                const nonceMatch = html.match(/var ajax_boss_nonce = '([a-f0-9]+)'/);
                return nonceMatch ? nonceMatch[1] : null;
            } catch (err) {
                console.error(`${this.logPrefix} âŒ Lá»—i khi láº¥y nonce:`, err);
                return null;
            }
        }

        getTodayKey() {
            return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
        }

        resetPurchase() {
            const todayKey = this.getTodayKey();
            localStorage.setItem('hoangvuc-purchase', JSON.stringify({
                date: todayKey,
                count: 0,
                lastPurchaseTime: null
            }));
        }

        getPurchasedToday() {
            const saved = JSON.parse(localStorage.getItem('hoangvuc-purchase') || '{}');
            const todayKey = this.getTodayKey();

            if (!saved.date || saved.date !== todayKey) {
                this.resetPurchase();
                return 0;
            }
            return saved.count || 0;
        }

        setPurchasedToday(count) {
            const todayKey = this.getTodayKey();
            const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
            localStorage.setItem('hoangvuc-purchase', JSON.stringify({
                date: todayKey,
                count,
                lastPurchaseTime: now
            }));
        }

        isDailyLimit() {
            return this.getPurchasedToday() >= this.dailyLimit;
        }

        async muaRuongLinhBao(quantity) {
            const nonce = await this.getHoangVucNonce();
            if (!nonce) {
                showNotification("âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c nonce, vui lÃ²ng Ä‘Äƒng nháº­p láº¡i", "error");
                return null;
            }

            let purchased = this.getPurchasedToday();
            if (purchased >= this.dailyLimit) {
                showNotification("âš ï¸ Báº¡n Ä‘Ã£ mua Ä‘á»§ 5 rÆ°Æ¡ng hÃ´m nay", "warn");
                return null;
            }

            let allowedQuantity = quantity;
            if (purchased + quantity > this.dailyLimit) {
                allowedQuantity = this.dailyLimit - purchased;
                showNotification(`âš ï¸ Chá»‰ cÃ³ thá»ƒ mua thÃªm ${allowedQuantity} rÆ°Æ¡ng Ä‘á»ƒ Ä‘áº¡t tá»‘i Ä‘a 5/ngÃ y`, "warn");
            }

            try {
                const body = new URLSearchParams({
                    action: "purchase_item_shop_boss",
                    item_id: "ruong_linh_bao",
                    item_type: "tinh_thach",
                    quantity: allowedQuantity,
                    nonce: nonce
                });

                const response = await fetch(this.ajaxUrl, {
                    method: "POST",
                    body,
                    credentials: "include"
                });

                const res = await response.json();
                console.log(`${this.logPrefix} ðŸ“¦ Response:`, res);

                if (res.success) {
                    purchased += allowedQuantity;
                    this.setPurchasedToday(purchased);
                    showNotification(`âœ… ${res.data.message}`, "success");
                } else {
                    showNotification(`âš ï¸ ${res.data}`, "warn");
                }
                return res;
            } catch (err) {
                console.error(`${this.logPrefix} âŒ Lá»—i khi mua rÆ°Æ¡ng:`, err);
                showNotification("âŒ Lá»—i khi gá»­i yÃªu cáº§u mua rÆ°Æ¡ng", "error");
                return null;
            }
        }
    }



    // ===============================================
    // LUYá»†N ÄAN ÄÆ¯á»œNG
    // ===============================================
    class LuyenDan {
        constructor() {
            this.weburl = weburl;
            this.logPrefix = '[HH3D Luyá»‡n Äan]';
            this.luyenDanToken = null;
            this.luyenDanTokenExpires = 0;
            this.inviteSentTime = null;
        }

        updateProgress(text) {
            try {
                const accountId = localStorage.getItem('hh3d_account_id') || '';
                const localStorageKey = `luyenDanLastProgress_${accountId}`;
                if (text) {
                    localStorage.setItem(localStorageKey, text);
                } else {
                    localStorage.removeItem(localStorageKey);
                }
                const span = document.querySelector('.nv-quest-item[data-task-id="luyenDan"] .quest-progress');
                if (span) {
                    span.textContent = text ? ` (${text})` : '';
                }
            } catch (e) {
                console.error(`${this.logPrefix} Lá»—i khi cáº­p nháº­t UI progress:`, e);
            }
        }

        masterLevelCurve(m) {
            m = m || {};
            const maxLevel = Math.max(1, m.max_level | 0 || 10);
            const perLevel = {};
            const steps = m.level_xp && typeof m.level_xp === 'object';
            let l;
            if (steps) {
                for (l = 1; l < maxLevel; l++) {
                    const sk = String(l);
                    const need = m.level_xp[sk] != null ? m.level_xp[sk] : m.level_xp[l];
                    perLevel[l] = Math.max(1, need | 0);
                }
            } else {
                const flat = Math.max(1, m.xp_per_level | 0 || 1000);
                for (l = 1; l < maxLevel; l++) perLevel[l] = flat;
            }
            const floors = { 1: 0 };
            let acc = 0;
            for (l = 1; l < maxLevel; l++) {
                acc += perLevel[l] || 1000;
                floors[l + 1] = acc;
            }
            return { max_level: maxLevel, per_level: perLevel, floors: floors };
        }

        computeDanRank(pts, m) {
            const curve = this.masterLevelCurve(m);
            const maxLevel = curve.max_level;
            const floors = curve.floors;
            const perLevel = curve.per_level;
            const xp = Math.max(0, pts | 0);
            let level = 1;
            for (let lv = maxLevel; lv >= 1; lv--) {
                if (xp >= (floors[lv] | 0)) {
                    level = lv;
                    break;
                }
            }
            const isMax = level >= maxLevel;
            const floor = floors[level] | 0;
            let xpIn, per, pct, xpToNext;
            if (isMax) {
                per = Math.max(1, perLevel[maxLevel - 1] | 0 || 1);
                xpIn = Math.max(0, xp - floor);
                pct = 100;
                xpToNext = 0;
            } else {
                const next = floors[level + 1] | 0;
                per = Math.max(1, next - floor);
                xpIn = xp - floor;
                pct = Math.min(100, Math.max(0, (xpIn / per) * 100));
                xpToNext = Math.max(0, next - xp);
            }

            let levelName = 'Luyá»‡n Äan SÆ° Â· Báº­c ' + level;
            if (m && m.level_names && m.level_names[String(level)]) {
                levelName = String(m.level_names[String(level)]).trim();
            } else if (m && m.level_meta && m.level_meta[String(level)] && m.level_meta[String(level)].display) {
                levelName = String(m.level_meta[String(level)].display).trim();
            }

            return {
                level: level,
                xp_total: xp,
                xp_in_level: xpIn,
                xp_per_level: per,
                xp_to_next: xpToNext,
                pct: pct,
                level_name: levelName,
                is_max: isMax
            };
        }

        updateAlchemistUI(rankXp, danMaster) {
            try {
                const questItem = document.querySelector('.nv-quest-item[data-task-id="luyenDan"]');
                if (questItem) {
                    const infoDiv = questItem.querySelector('.quest-alchemist-info');
                    if (infoDiv) infoDiv.remove();
                }
            } catch (e) { }
        }

        async getNonce() {
            const nonce = await getNonce();
            return nonce || null;
        }

        async ensureLuyenDanToken() {
            const now = Math.floor(Date.now() / 1000);
            if (this.luyenDanToken && this.luyenDanTokenExpires > now + 30) {
                return this.luyenDanToken;
            }

            const wpNonce = await this.getNonce();
            if (!wpNonce) {
                console.error(`${this.logPrefix} âŒ KhÃ´ng cÃ³ WP rest nonce`);
                return null;
            }

            try {
                const url = `${this.weburl}wp-json/hh3d/v1/luyen-dan/session-token`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "X-WP-Nonce": wpNonce
                    },
                    credentials: "include"
                });
                const res = await response.json();
                if (res?.data?.security_token) {
                    this.luyenDanToken = res.data.security_token;
                    this.luyenDanTokenExpires = res.data.expires_at || (now + 1800);
                    return this.luyenDanToken;
                } else {
                    console.error(`${this.logPrefix} âŒ KhÃ´ng thá»ƒ láº¥y session token`);
                    return null;
                }
            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i láº¥y session token:`, e);
                return null;
            }
        }

        async sendLdRequest(path, method = "GET", body = null) {
            const token = await this.ensureLuyenDanToken();
            if (!token) {
                throw new Error("KhÃ´ng cÃ³ Luyá»‡n Äan session token");
            }
            const wpNonce = await this.getNonce();
            const url = `${this.weburl}wp-json/hh3d/v1/luyen-dan${path}`;
            const headers = {
                "X-WP-Nonce": wpNonce,
                "X-LD-Token": token,
                "Accept": "application/json"
            };
            if (body) {
                headers["Content-Type"] = "application/json";
            }
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                credentials: "include"
            });

            let res;
            try {
                res = await response.json();
            } catch (err) {
                res = { code: "parse_error", message: "Pháº£n há»“i khÃ´ng pháº£i JSON" };
            }
            if (!response.ok || res.code) {
                return { error: true, code: res.code || "http_error", message: res.message || `Lá»—i HTTP ${response.status}` };
            }
            return res;
        }

        async doLuyenDan(isManual = false) {
            // Mutex guard: trÃ¡nh 2 luá»“ng cháº¡y Ä‘á»“ng thá»i (click thá»§ cÃ´ng + scheduleTask cÃ¹ng lÃºc)
            if (this.isProcessing) {
                console.warn(`${this.logPrefix} Äang xá»­ lÃ½, bá» qua láº§n gá»i trÃ¹ng láº·p.`);
                return 10000;
            }
            this.isProcessing = true;
            try {
                // DÃ¹ng accountId toÃ n cá»¥c
                const autoLuyenDan = localStorage.getItem('autoLuyenDan') !== '0';
                const stateRes = await this.sendLdRequest("/state?fresh=1", "GET");
                if (!stateRes || !stateRes.data) {
                    countdownTimer.remove('luyenDan');
                    showNotification("âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c tráº¡ng thÃ¡i LÃ² Äan", "warning");
                    this.updateProgress("Lá»—i káº¿t ná»‘i");
                    return 15000;
                }

                const data = stateRes.data;

                // Cáº­p nháº­t thÃ´ng tin cáº¥p báº­c Äan SÆ° lÃªn UI
                this.updateAlchemistUI(data.rank_xp, data.dan_master || data.danMaster);

                // 1. Tá»± Ä‘á»™ng nháº­n lá»i má»i lÃ m Äan Äá»“ng (Auto-Accept)
                const autoAccept = localStorage.getItem('luyenDanAutoAcceptInvite') === 'true';
                if (autoAccept && data.dong_invites_in && data.dong_invites_in.length > 0) {
                    const acceptAll = localStorage.getItem('luyenDanAcceptAllInvites') === 'true';
                    const selectedIds = (localStorage.getItem('luyenDanSelectedFriendIds') || '').split(',').filter(Boolean);

                    for (const inv of data.dong_invites_in) {
                        const oid = String(inv.owner_id);
                        if (acceptAll || selectedIds.includes(oid)) {
                            console.log(`${this.logPrefix} Tá»± Ä‘á»™ng cháº¥p nháº­n lá»i má»i Äan Äá»“ng tá»« Äan Chá»§ ${inv.owner_name || oid}...`);
                            this.updateProgress(`Nháº­n Äan Äá»“ng ${inv.owner_name || oid}`);
                            try {
                                const res = await this.sendLdRequest("/dong/respond", "POST", { owner_id: inv.owner_id, accept: true });
                                if (res && !res.error) {
                                    showNotification(`ðŸ§ª âœ… ÄÃ£ tá»± Ä‘á»™ng nháº­n lÃ m Äan Äá»“ng cho Äan Chá»§: ${inv.owner_name || oid}`, "success");
                                    return 3000;
                                }
                            } catch (err) {
                                console.error(`${this.logPrefix} Lá»—i khi cháº¥p nháº­n lá»i má»i Äan Äá»“ng:`, err);
                            }
                        }
                    }
                }

                // 2. Tá»± Ä‘á»™ng rá»i Äan Äá»“ng sau 5 phÃºt (Auto-Leave)
                const autoLeave = localStorage.getItem('luyenDanAutoLeave') === 'true';
                const furnaceState = data.furnace || 'idle';
                if ((autoLeave || isManual) && data.dong_serving) {
                    const serving = data.dong_serving;
                    const oid = serving.owner_id | 0;
                    const unstableLeftSec = data.craft ? (data.craft.unstable_left_sec | 0) : 0;

                    let canLeave = false;
                    if (furnaceState === 'exploded') {
                        canLeave = true;
                    } else if (unstableLeftSec <= 0) {
                        const dongOwnersForMe = data.dong_owners_for_me || [];
                        const row = dongOwnersForMe.find(o => (o.owner_id | 0) === oid);
                        if (row) {
                            canLeave = !!row.can_leave;
                        } else {
                            canLeave = furnaceState === 'crafting' || furnaceState === 'ready' || furnaceState === 'idle';
                        }
                    }

                    if (canLeave) {
                        console.log(`${this.logPrefix} Tá»± Ä‘á»™ng rá»i vai Äan Äá»“ng cá»§a Äan Chá»§ ${serving.owner_name || oid}...`);
                        this.updateProgress(`Rá»i Äan Äá»“ng ${serving.owner_name || oid}`);
                        try {
                            const res = await this.sendLdRequest("/dong/leave", "POST", { owner_id: oid });
                            if (res && !res.error) {
                                showNotification(`ðŸ§ª ðŸšª ÄÃ£ tá»± Ä‘á»™ng rá»i vai Äan Äá»“ng cá»§a Äan Chá»§ ${serving.owner_name || oid}`, "success");
                                return 3000;
                            }
                        } catch (err) {
                            console.error(`${this.logPrefix} Lá»—i khi rá»i vai Äan Äá»“ng:`, err);
                        }
                    } else if (isManual) {
                        if (unstableLeftSec > 0) {
                            showNotification(`ðŸ§ª â³ ChÆ°a thá»ƒ rá»i vai Äan Äá»“ng. Giai Ä‘oáº¡n nháº¡y cáº£m cÃ²n láº¡i: ${unstableLeftSec} giÃ¢y.`, "warning");
                        } else {
                            showNotification(`ðŸ§ª â³ ChÆ°a thá»ƒ rá»i vai Äan Äá»“ng (chá» mÃ¡y chá»§ cáº­p nháº­t tráº¡ng thÃ¡i).`, "warning");
                        }
                    }
                }

                // Tá»± Ä‘á»™ng quÃ©t vÃ  phÃ¢n giáº£i Ä‘an dÆ°á»£c pháº©m cháº¥t kÃ©m trong tÃºi
                const autoDecompose = localStorage.getItem('luyenDanAutoDecompose') === 'true';
                const minStars = parseInt(localStorage.getItem('luyenDanMinStars') || '4', 10);
                if (autoLuyenDan && autoDecompose) {
                    let stacks = [];
                    if (data.pill_stacks && data.pill_stacks.length > 0) {
                        stacks = data.pill_stacks.map(s => ({
                            tier: s.tier,
                            stars: parseInt(s.stars || 0, 10),
                            count: parseInt(s.count || 0, 10),
                            stack_id: s.stack_id || `${s.tier}:${s.stars}`
                        }));
                    } else if (data.pills && data.pills.length > 0) {
                        const map = {};
                        data.pills.forEach(p => {
                            const stars = parseInt(p.stars || p.star || 0, 10);
                            const sid = p.id || `${p.tier}:${stars}`;
                            const key = `${p.tier}-${stars}`;
                            if (!map[key]) {
                                map[key] = { tier: p.tier, stars, count: 0, stack_id: sid };
                            }
                            map[key].count++;
                        });
                        stacks = Object.keys(map).map(k => map[k]);
                    }

                    // QuÃ©t DOM fallback náº¿u dá»¯ liá»‡u API trá»‘ng
                    if (stacks.length === 0 && typeof document !== 'undefined') {
                        const pillCells = document.querySelectorAll('.ld-cell--pill');
                        if (pillCells.length > 0) {
                            console.log(`${this.logPrefix} QuÃ©t Ä‘an dÆ°á»£c tá»« giao diá»‡n hiá»ƒn thá»‹ (DOM fallback)...`);
                            pillCells.forEach(cell => {
                                const tier = cell.dataset.tier;
                                const stars = parseInt(cell.dataset.stars || 0, 10);
                                const qtyEl = cell.querySelector('.ld-qty');
                                const count = qtyEl ? parseInt(qtyEl.textContent || 1, 10) : 1;
                                if (tier && stars < minStars) {
                                    stacks.push({
                                        tier,
                                        stars,
                                        count,
                                        stack_id: `${tier}:${stars}`,
                                        isDomFallback: true,
                                        cell: cell
                                    });
                                }
                            });
                        }
                    }

                    const lowStarStacks = stacks.filter(s => s.stars < minStars && s.count > 0);
                    if (lowStarStacks.length > 0) {
                        console.log(`${this.logPrefix} PhÃ¡t hiá»‡n Ä‘an dÆ°á»£c pháº©m cháº¥t kÃ©m trong tÃºi:`, lowStarStacks);
                        for (const stack of lowStarStacks) {
                            for (let i = 0; i < stack.count; i++) {
                                const pid = stack.stack_id;
                                showNotification(`ðŸ§ª â™»ï¸ Tá»± Ä‘á»™ng phÃ¢n giáº£i Ä‘an trong tÃºi: ${stack.tier.toUpperCase()} ${stack.stars}â˜… (Cáº§n >= ${minStars}â˜…)`, "info");
                                this.updateProgress(`PhÃ¢n giáº£i ${stack.stars}â˜…...`);
                                try {
                                    const decompRes = await this.sendLdRequest("/decompose", "POST", { pill_id: String(pid) });
                                    if (decompRes && !decompRes.error) {
                                        showNotification(`ðŸ§ª â™»ï¸ ÄÃ£ phÃ¢n giáº£i thÃ nh cÃ´ng Ä‘an ${stack.stars}â˜…`, "success");

                                        // Cáº­p nháº­t DOM ngay láº­p tá»©c Ä‘á»ƒ Ä‘á»“ng bá»™ vÃ  trÃ¡nh láº·p láº¡i quÃ©t
                                        if (stack.isDomFallback && stack.cell) {
                                            const qtyEl = stack.cell.querySelector('.ld-qty');
                                            const currentQty = qtyEl ? parseInt(qtyEl.textContent || 1, 10) : 1;
                                            if (currentQty <= 1) {
                                                stack.cell.remove();
                                            } else {
                                                qtyEl.textContent = String(currentQty - 1);
                                            }
                                        }
                                    } else {
                                        showNotification(`ðŸ§ª âš ï¸ Lá»—i phÃ¢n giáº£i: ${decompRes?.message || 'khÃ´ng thÃ nh cÃ´ng'}`, "warning");
                                    }
                                } catch (err) {
                                    console.error(`${this.logPrefix} Lá»—i khi phÃ¢n giáº£i Ä‘an ${pid}:`, err);
                                }
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                        return 10000; // Quay láº¡i chu ká»³ sau 10s Ä‘á»ƒ náº¡p tráº¡ng thÃ¡i má»›i sáº¡ch sáº½ vÃ  trÃ¡nh nháº¥p nhÃ¡y UI
                    }
                }

                const furnace = data.furnace || "idle";
                const craft = data.craft || null;
                const materials = data.materials || {};
                const recipes = data.recipes || {};

                if (data.dong_serving) {
                    countdownTimer.remove('luyenDan');
                    const tuneCount = craft ? (craft.tune_count | 0) : 0;
                    const stability = craft ? (craft.stability_pct != null ? parseFloat(craft.stability_pct) : 100) : 100;
                    const unstableLeftSec = craft ? (craft.unstable_left_sec | 0) : 0;

                    // Äá»c cháº¿ Ä‘á»™ Ä‘iá»u hoáº£ Äan Äá»“ng: 'auto' = chá»‰ mÃ¬nh tá»± lo, 'both' = cáº£ 2 cÃ¹ng lo
                    const dongTuneMode = localStorage.getItem('luyenDanDongTuneMode') || 'auto';

                    // Cáº­p nháº­t tiáº¿n trÃ¬nh hiá»ƒn thá»‹ kÃ¨m Ä‘á»™ á»•n Ä‘á»‹nh vÃ  cháº¿ Ä‘á»™
                    if (unstableLeftSec > 0) {
                        const modeTag = dongTuneMode === 'both' ? ' ðŸ¤' : '';
                        this.updateProgress(`Äan Ä‘á»“ng (${tuneCount}/3) - ${stability.toFixed(0)}%${modeTag}`);
                    } else {
                        this.updateProgress(`Äan Ä‘á»“ng (${tuneCount}/3)`);
                    }

                    // Cáº£ 2 cháº¿ Ä‘á»™ (auto & both) Ä‘á»u tá»± Ä‘iá»u hoáº£ khi stability tháº¥p
                    const autoTune = localStorage.getItem('luyenDanAutoTune') === 'true';
                    if (autoTune && stability <= 68) {
                        const modeLabel = dongTuneMode === 'both' ? '[Cáº£ 2 cÃ¹ng lo]' : '[Tá»± Ä‘iá»u hoáº£]';
                        console.log(`${this.logPrefix} ${modeLabel} Äan Äá»“ng Ä‘iá»u há»a há»™ Äan Chá»§ (Äá»™ á»•n Ä‘á»‹nh: ${stability.toFixed(1)}%)...`);
                        try {
                            const tuneRes = await this.sendLdRequest("/tune", "POST", {});
                            if (tuneRes && !tuneRes.error) {
                                const msg = dongTuneMode === 'both'
                                    ? `ðŸ§ª ðŸ¤ Äan Äá»“ng Ä‘Ã£ Äiá»u Há»a! (Cáº£ 2 cÃ¹ng lo - Äan Chá»§ cÅ©ng Ä‘ang lo)`
                                    : `ðŸ§ª ðŸ”¥ Äan Äá»“ng Ä‘Ã£ tá»± Ä‘á»™ng Äiá»u Há»a há»™ Äan Chá»§!`;
                                showNotification(msg, "success");
                                return 10000;
                            }
                        } catch (err) {
                            console.error(`${this.logPrefix} Lá»—i khi Äan Äá»“ng Ä‘iá»u há»a:`, err);
                        }
                    }
                    return 15000;
                }

                console.log(`${this.logPrefix} Tráº¡ng thÃ¡i LÃ² Äan: ${furnace.toUpperCase()}`);

                if (furnace === "exploded") {
                    countdownTimer.remove('luyenDan');
                    this.updateProgress("ðŸ’¥ Bá»‹ ná»• lÃ²");
                    if (!autoLuyenDan) {
                        return 15000;
                    }
                    showNotification("ðŸ§ª ðŸ’¥ Äan LÃ´ bá»‹ ná»•! Äang dá»n dáº¹p lÃ²...", "warning");
                    const jobId = craft?.id || data.craftJobId;
                    if (jobId) {
                        const ackRes = await this.sendLdRequest("/ack-explosion", "POST", { job_id: jobId });
                        if (ackRes && !ackRes.error) {
                            showNotification("ðŸ§ª âœ… ÄÃ£ dá»n dáº¹p lÃ² Ä‘an bá»‹ ná»•", "success");
                        } else {
                            showNotification("ðŸ§ª âŒ Lá»—i khi dá»n dáº¹p lÃ² Ä‘an ná»•", "error");
                        }
                    } else {
                        console.warn(`${this.logPrefix} KhÃ´ng tÃ¬m tháº¥y job_id cá»§a lÃ² ná»•`);
                    }
                    return 10000;
                }

                if (furnace === "ready") {
                    countdownTimer.remove('luyenDan');
                    this.updateProgress("Chá» thu hoáº¡ch");
                    if (!autoLuyenDan) {
                        return 15000;
                    }
                    showNotification("ðŸ§ª ðŸŽ‰ Luyá»‡n Ä‘an hoÃ n táº¥t! Thu hoáº¡ch...", "info");
                    const jobId = craft?.id || data.craftJobId;
                    if (jobId) {
                        const collectRes = await this.sendLdRequest("/collect", "POST", { job_id: jobId });
                        // API tráº£ vá» { ok: true, data: {...} } khi thÃ nh cÃ´ng
                        if (collectRes && !collectRes.error && (collectRes.ok || collectRes.data)) {
                            const collectData = collectRes.data || collectRes;
                            const pillName = collectData.pill_name || collectData.tier_label || "Äan dÆ°á»£c";
                            const stars = parseInt(collectData.stars || collectData.star || 1, 10);
                            showNotification(`ðŸ§ª ðŸ† Thu hoáº¡ch thÃ nh cÃ´ng: ${pillName} ${"â˜…".repeat(stars)}`, "success");

                            const minStars = parseInt(localStorage.getItem('luyenDanMinStars') || '4', 10);
                            const autoUse = localStorage.getItem('luyenDanAutoUse') === 'true';
                            const autoDecompose = localStorage.getItem('luyenDanAutoDecompose') === 'true';

                            // [v2.17.1-local] Láº¥y láº¡i state má»›i Ä‘á»ƒ tÃ¬m pill_id thá»±c táº¿ trong pill_stacks
                            let pillId = null;
                            try {
                                const freshState = await this.sendLdRequest("/state?fresh=1", "GET");
                                const freshData = freshState?.data || freshState;
                                const stacks = freshData?.pill_stacks || [];
                                // TÃ¬m stack khá»›p tier vÃ  stars vá»«a thu hoáº¡ch
                                const craftedTier = collectData.tier || craft?.ui_tier || data.tier;
                                const matchStack = stacks.find(s =>
                                    s.tier === craftedTier && parseInt(s.stars || 0, 10) === stars
                                ) || stacks.find(s => parseInt(s.stars || 0, 10) === stars)
                                  || stacks[stacks.length - 1]; // fallback láº¥y Ä‘an cuá»‘i cÃ¹ng trong tÃºi
                                if (matchStack) {
                                    pillId = String(matchStack.stack_id || `${matchStack.tier}:${matchStack.stars}`);
                                    console.log(`${this.logPrefix} TÃ¬m tháº¥y pill trong tÃºi: ${pillId} (${matchStack.tier} ${matchStack.stars}â˜… x${matchStack.count})`);
                                } else {
                                    console.warn(`${this.logPrefix} KhÃ´ng tÃ¬m tháº¥y Ä‘an trong tÃºi sau thu hoáº¡ch. pill_stacks:`, stacks);
                                }
                            } catch (err) {
                                console.error(`${this.logPrefix} Lá»—i khi láº¥y state má»›i:`, err);
                            }

                            if (pillId) {
                                if (stars >= minStars) {
                                    if (autoUse) {
                                        console.log(`${this.logPrefix} Tá»± Ä‘á»™ng sá»­ dá»¥ng Ä‘an cháº¥t cao (${stars}â˜…)...`);
                                        this.updateProgress(`Sá»­ dá»¥ng Ä‘an ${stars}â˜…`);
                                        const useRes = await this.sendLdRequest("/use-pill", "POST", { pill_id: String(pillId) });
                                        if (useRes && !useRes.error && (useRes.ok || useRes.data)) {
                                            const useData = useRes.data || useRes;
                                            showNotification(`ðŸ§ª âœ… ÄÃ£ sá»­ dá»¥ng Ä‘an. Tu Vi nháº­n: ${useData?.tu_vi_granted || useData?.tu_vi || "thÃ nh cÃ´ng"}`, "success");
                                        } else {
                                            showNotification(`ðŸ§ª âš ï¸ Lá»—i sá»­ dá»¥ng Ä‘an: ${useRes?.message || 'khÃ´ng thÃ nh cÃ´ng'}`, "warning");
                                        }
                                    } else {
                                        showNotification(`ðŸ§ª ðŸ“¦ Nháº­n Ä‘an (${stars}â˜…). Giá»¯ láº¡i trong tÃºi Ä‘á»“.`, "info");
                                        this.updateProgress(`Giá»¯ Ä‘an ${stars}â˜…`);
                                    }
                                } else if (autoDecompose) {
                                    console.log(`${this.logPrefix} Tá»± Ä‘á»™ng phÃ¢n giáº£i Ä‘an cháº¥t kÃ©m (${stars}â˜… < ${minStars}â˜…)...`);
                                    this.updateProgress(`PhÃ¢n giáº£i Ä‘an ${stars}â˜…`);
                                    const decompRes = await this.sendLdRequest("/decompose", "POST", { pill_id: String(pillId) });
                                    if (decompRes && !decompRes.error && (decompRes.ok || decompRes.data)) {
                                        showNotification(`ðŸ§ª â™»ï¸ ÄÃ£ phÃ¢n giáº£i Ä‘an pháº©m cháº¥t kÃ©m (${stars}â˜…)`, "success");
                                    } else {
                                        showNotification(`ðŸ§ª âš ï¸ Lá»—i phÃ¢n giáº£i Ä‘an: ${decompRes?.message || 'khÃ´ng thÃ nh cÃ´ng'}`, "warning");
                                    }
                                } else {
                                    showNotification(`ðŸ§ª ðŸ“¦ Nháº­n Ä‘an (${stars}â˜…). Giá»¯ láº¡i trong tÃºi Ä‘á»“.`, "info");
                                    this.updateProgress(`Giá»¯ Ä‘an ${stars}â˜…`);
                                }
                            } else {
                                showNotification(`ðŸ§ª ðŸ“¦ Thu Ä‘an thÃ nh cÃ´ng (${stars}â˜…) nhÆ°ng khÃ´ng xÃ¡c Ä‘á»‹nh Ä‘Æ°á»£c ID Ä‘an trong tÃºi.`, "info");
                            }
                        } else {
                            showNotification("ðŸ§ª âŒ Thu Ä‘an tháº¥t báº¡i", "error");
                        }
                    } else {
                        console.warn(`${this.logPrefix} KhÃ´ng tÃ¬m tháº¥y job_id Ä‘á»ƒ thu Ä‘an`);
                    }
                    return 10000;
                }


                if (furnace === "crafting") {
                    const unstableLeftSec = craft ? (craft.unstable_left_sec | 0) : 0;
                    const timerLeftSec = craft ? (craft.timer_left_sec | 0) : 0;
                    const stability = craft ? (craft.stability_pct != null ? parseFloat(craft.stability_pct) : 100) : 100;
                    const tuneCount = craft ? (craft.tune_count | 0) : 0;
                    const tuneSurvivalMin = (data.danMaster && data.danMaster.rng && data.danMaster.rng.tuneSurvivalMin) ? (data.danMaster.rng.tuneSurvivalMin | 0) : 3;
                    const isSurvival = tuneCount >= tuneSurvivalMin;
                    const isSafe = unstableLeftSec <= 0 || isSurvival;

                    console.log(`${this.logPrefix} Äang luyá»‡n. CÃ²n: ${timerLeftSec}s. Giai Ä‘oáº¡n nháº¡y cáº£m: ${unstableLeftSec}s. Äá»™ á»•n Ä‘á»‹nh: ${stability.toFixed(1)}%. Giá»¯ lá»­a: ${tuneCount}/${tuneSurvivalMin}`);
                    localStorage.setItem(`luyenDanStability_${accountId}`, String(stability.toFixed(0)));
                    localStorage.setItem(`luyenDanTuneCount_${accountId}`, String(tuneCount));
                    localStorage.setItem(`luyenDanTuneSurvivalMin_${accountId}`, String(tuneSurvivalMin));
                    localStorage.setItem(`luyenDanIsSafe_${accountId}`, isSafe ? 'true' : 'false');
                    countdownTimer.set('luyenDan', timerLeftSec * 1000);

                    // Cáº­p nháº­t tiáº¿n trÃ¬nh hiá»ƒn thá»‹ trÃªn UI kÃ¨m sá»‘ láº§n Äiá»u Há»a
                    this.updateProgress(`Äang luyá»‡n (${stability.toFixed(0)}% - ${tuneCount}/${tuneSurvivalMin})`);

                    // Náº¿u giai Ä‘oáº¡n nháº¡y cáº£m Ä‘Ã£ qua hoáº·c Ä‘Ã£ Ä‘á»§ sá»‘ láº§n giá»¯ lá»­a (Ä‘Ã£ an toÃ n)
                    if (isSafe) {
                        console.log(`${this.logPrefix} LÃ² Ä‘an Ä‘Ã£ an toÃ n tuyá»‡t Ä‘á»‘i. Chá» hoÃ n thÃ nh sau ${timerLeftSec}s...`);
                        const m = Math.floor(timerLeftSec / 60);
                        const s = timerLeftSec % 60;
                        const timeStr = `${m}:${String(s).padStart(2, '0')}`;
                        this.updateProgress(`Ä‘Ã£ Ä‘iá»u hoáº£ ${tuneCount} láº§n thá»i gian ${timeStr}`);
                        countdownTimer.set('luyenDan', timerLeftSec * 1000);
                        return timerLeftSec * 1000 + 3000;
                    }

                    // Náº¿u váº«n á»Ÿ giai Ä‘oáº¡n nháº¡y cáº£m vÃ  chÆ°a Ä‘á»§ sá»‘ láº§n giá»¯ lá»­a
                    if (!autoLuyenDan) {
                        return 10000;
                    }
                    const autoTune = localStorage.getItem('luyenDanAutoTune') === 'true';
                    const slots = data.dong_slots || [];
                    const hasCompanion = slots.some(s => s != null);

                    if (autoTune && stability <= 68) {
                        // Kiá»ƒm tra cháº¿ Ä‘á»™: náº¿u Äan Chá»§ khÃ´ng báº­t "cÃ¹ng lo" thÃ¬ nhÆ°á»ng Äan Äá»“ng
                        const chuTuneWithDong = localStorage.getItem('luyenDanChuTuneWithDong') === 'true';
                        if (hasCompanion && !chuTuneWithDong) {
                            console.log(`${this.logPrefix} CÃ³ Äan Äá»“ng há»— trá»£ trong lÃ², Äan Chá»§ nhÆ°á»ng Äan Äá»“ng Ä‘iá»u há»a (báº­t "Cáº£ 2 cÃ¹ng lo" náº¿u muá»‘n cÃ¹ng Ä‘iá»u hoáº£).`);
                            return 10000;
                        }
                        if (hasCompanion && chuTuneWithDong) {
                            console.log(`${this.logPrefix} [Cáº£ 2 cÃ¹ng lo] Äan Chá»§ cÅ©ng tá»± Ä‘iá»u hoáº£ song song vá»›i Äan Äá»“ng (stability: ${stability.toFixed(1)}%)...`);
                        }
                        let successCount = 0;
                        for (let i = 0; i < 3; i++) {
                            showNotification(`ðŸ§ª ðŸ”¥ Äiá»u Há»a láº§n ${i + 1}/3...`, "warning");
                            this.updateProgress(`Äiá»u Há»a ${i + 1}/3`);
                            try {
                                const tuneRes = await this.sendLdRequest("/tune", "POST", {});
                                if (tuneRes && !tuneRes.error) {
                                    successCount++;
                                    console.log(`${this.logPrefix} Äiá»u Há»a láº§n ${i + 1} thÃ nh cÃ´ng.`);
                                    const updatedTuneCount = tuneRes.data?.craft?.tune_count || tuneRes.data?.tune_count;
                                    if (updatedTuneCount != null && updatedTuneCount >= tuneSurvivalMin) {
                                        console.log(`${this.logPrefix} ÄÃ£ Ä‘áº¡t Ä‘á»§ sá»‘ láº§n giá»¯ lá»­a sau láº§n tune ${i + 1}.`);
                                        break;
                                    }
                                } else {
                                    console.log(`${this.logPrefix} Äiá»u Há»a láº§n ${i + 1} tháº¥t báº¡i: ${tuneRes?.message || 'lá»—i Rest'}`);
                                }
                            } catch (err) {
                                console.error(`${this.logPrefix} Lá»—i khi gá»i Äiá»u Há»a láº§n ${i + 1}:`, err);
                            }
                            if (i < 2) {
                                const tuneDelay = 10000 + Math.floor(Math.random() * 2000);
                                await new Promise(resolve => setTimeout(resolve, tuneDelay));
                            }
                        }
                        showNotification(`ðŸ§ª ðŸ”¥ HoÃ n táº¥t Äiá»u Há»a! ThÃ nh cÃ´ng: ${successCount}`, "success");
                        return 10000;
                    }

                    return 10000; // Äá»‹nh ká»³ 10s/láº§n
                }

                if (furnace === "idle") {
                    countdownTimer.remove('luyenDan');
                    this.updateProgress("LÃ² trá»‘ng");
                    if (!autoLuyenDan) {
                        return 15000;
                    }
                    const autoStart = localStorage.getItem('luyenDanAutoStart') === 'true';
                    if (!autoStart) {
                        console.log(`${this.logPrefix} Tá»± Ä‘á»™ng khai lÃ² Ä‘Ã£ táº¯t, giá»¯ lÃ² trá»‘ng.`);
                        return 15000;
                    }
                    const TiersOrder = ["cuc", "thuong", "trung", "ha"];
                    let selectedTier = null;

                    for (const tier of TiersOrder) {
                        const rec = recipes[tier];
                        const isUnlocked = rec ? !!rec.craft_unlocked : false;
                        if (isUnlocked) {
                            const vec = rec.vector || {};
                            let hasEnoughMats = true;
                            // [v2.17.1-local] Kiá»ƒm tra Táº¤T Cáº¢ nguyÃªn liá»‡u (ká»ƒ cáº£ linh_phong_thao, huyen_van_thao...)
                            for (const el of Object.keys(vec)) {
                                const need = vec[el] || 0;
                                if ((materials[el] || 0) < need) {
                                    console.log(`${this.logPrefix} Thiáº¿u [${el}] cho pháº©m [${tier}]: cáº§n ${need}, cÃ³ ${materials[el] || 0}`);
                                    hasEnoughMats = false;
                                    break;
                                }
                            }
                            if (hasEnoughMats) {
                                selectedTier = tier;
                                break;
                            }
                        }
                    }

                    if (selectedTier) {
                        // Tá»± Ä‘á»™ng má»i Äan Äá»“ng vÃ  chá» há» tham gia
                        const autoInvite = localStorage.getItem('luyenDanAutoInvite') === 'true';
                        if (autoInvite) {
                            const slots = data.dong_slots || [];
                            const filledSlots = slots.filter(s => s != null);
                            const isAllFilled = filledSlots.length >= 2;
                            const waitSeconds = parseInt(localStorage.getItem('luyenDanWaitInviteSeconds') || '60', 10);

                            if (!isAllFilled) {
                                const selectedIds = (localStorage.getItem('luyenDanSelectedFriendIds') || '').split(',').filter(Boolean);

                                if (!this.inviteSentTime) {
                                    console.log(`${this.logPrefix} Báº¯t Ä‘áº§u má»i Äan Äá»“ng...`);
                                    this.updateProgress("Gá»­i lá»i má»i Äan Äá»“ng");
                                    for (const buddyId of selectedIds) {
                                        showNotification(`ðŸ§ª âœ‰ï¸ Äang gá»­i lá»i má»i tá»›i Äan Äá»“ng ID: ${buddyId}`, "info");
                                        try {
                                            await this.sendLdRequest("/dong/invite", "POST", { buddy_id: parseInt(buddyId, 10) });
                                        } catch (err) {
                                            console.error(`${this.logPrefix} Lá»—i khi má»i Äan Äá»“ng ${buddyId}:`, err);
                                        }
                                    }
                                    this.inviteSentTime = Date.now();
                                    return 10000; // Quay láº¡i check sau 10s
                                } else {
                                    const elapsed = Math.floor((Date.now() - this.inviteSentTime) / 1000);
                                    if (elapsed < waitSeconds) {
                                        const remaining = waitSeconds - elapsed;
                                        console.log(`${this.logPrefix} Äang chá» Äan Äá»“ng tham gia. ÄÃ£ chá»: ${elapsed}s, cÃ²n láº¡i: ${remaining}s.`);
                                        this.updateProgress(`Chá» Äan Äá»“ng ${filledSlots.length}/2 (${remaining}s)`);
                                        return 10000; // Quay láº¡i check sau 10s
                                    } else {
                                        console.log(`${this.logPrefix} QuÃ¡ thá»i gian chá» Äan Äá»“ng (${waitSeconds}s), tiáº¿n hÃ nh Khai lÃ²...`);
                                    }
                                }
                            } else {
                                console.log(`${this.logPrefix} Äan Äá»“ng Ä‘Ã£ tham gia Ä‘áº§y Ä‘á»§, tiáº¿n hÃ nh Khai lÃ²...`);
                            }
                        }

                        // Reset má»‘c thá»i gian chá»
                        this.inviteSentTime = null;

                        showNotification(`ðŸ§ª Khai lÃ² luyá»‡n Ä‘an pháº©m: ${selectedTier.toUpperCase()}...`, "info");
                        this.updateProgress(`Khai lÃ² pháº©m ${selectedTier.toUpperCase()}`);
                        const startRes = await this.sendLdRequest("/start", "POST", { tier: selectedTier });
                        if (startRes && !startRes.error) {
                            showNotification(`ðŸ§ª ðŸ”¥ Khai lÃ² Luyá»‡n Äan pháº©m ${selectedTier.toUpperCase()} thÃ nh cÃ´ng!`, "success");
                            return 10000;
                        } else {
                            showNotification(`ðŸ§ª âŒ Khai lÃ² tháº¥t báº¡i: ${startRes?.message || 'lá»—i'}`, "error");
                            return 10000;
                        }
                    } else {
                        console.log(`${this.logPrefix} KhÃ´ng Ä‘á»§ nguyÃªn liá»‡u ngÅ© hÃ nh. TÃ¬m gÃ³i linh dÆ°á»£c...`);
                        const matBundles = data.mat_bundles || [];
                        if (matBundles.length > 0) {
                            const bundle = matBundles[0];
                            const bundleKey = bundle.bundle_key;
                            showNotification(`ðŸ§ª ðŸ“¦ PhÃ¡t hiá»‡n gÃ³i linh dÆ°á»£c ${bundle.name || bundleKey}. Äang tá»± Ä‘á»™ng má»Ÿ...`, "info");
                            this.updateProgress("Má»Ÿ gÃ³i linh dÆ°á»£c");
                            const openRes = await this.sendLdRequest("/open-mat-bundle", "POST", { job_id: String(bundleKey), bundle_key: String(bundleKey) });
                            if (openRes && !openRes.error) {
                                showNotification(`ðŸ§ª âœ… Má»Ÿ gÃ³i linh dÆ°á»£c thÃ nh cÃ´ng!`, "success");
                                return 3000;
                            } else {
                                showNotification(`ðŸ§ª âŒ Má»Ÿ gÃ³i linh dÆ°á»£c tháº¥t báº¡i: ${openRes?.message || 'lá»—i'}`, "error");
                                return 10000;
                            }
                        } else {
                            countdownTimer.remove('luyenDan');
                            showNotification("ðŸ§ª âŒ Háº¿t nguyÃªn liá»‡u vÃ  gÃ³i linh dÆ°á»£c. Dá»«ng Luyá»‡n Äan.", "warning");
                            this.updateProgress("Háº¿t nguyÃªn liá»‡u");
                            const accountId = await getAccountId();
                            if (accountId) {
                                taskTracker.markTaskDone(accountId, 'luyenDan');
                                updateAllQuestButtons().catch(() => { });
                            }
                            return null;
                        }
                    }
                }
            } catch (e) {
                countdownTimer.remove('luyenDan');
                console.error(`${this.logPrefix} Lá»—i trong doLuyenDan:`, e);
                this.updateProgress("Lá»—i");
                showNotification(`ðŸ§ª âŒ Lá»—i Luyá»‡n Äan: ${e.message}`, "error");
                return 15000;
            } finally {
                this.isProcessing = false;
            }
        }
    }

    //================== PhÃ¡p TÆ°á»›ng/ kHáº®C TRáº¬N VÄ‚N=====================//




    // ===============================================
    // LUáº¬N VÃ•
    // ===============================================

    class LuanVo {
        constructor() {
            this.weburl = weburl;
            this.accountId = accountId;
            this.logPrefix = '[Luáº­n VÃµ]';
            this.config = null;
            this.currentTarget = null;
            this.targetLeft = 0;
            this.sent = 0;
            this.maxBattles = 5;
        }

        async setupConfig() {
            const nonce = await getNonce();
            const securityToken = await getSecurityToken(this.weburl + 'luan-vo-duong?t');
            this.config = { nonce, token: securityToken };
        }

        async sendApiRequest(endpoint, method, body = {}) {
            try {
                const url = `${this.weburl}${endpoint}`;
                const headers = {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-WP-Nonce": this.config.nonce,
                    "x-lv-token": this.config.token
                };

                const response = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(body),
                    credentials: 'include'
                });

                const contentType = response.headers.get("content-type");
                let data = null;
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                if (!response.ok) {
                    console.warn(`${this.logPrefix} âš ï¸ API lá»—i ${response.status}:`, data);
                    return data;
                }
                return data;
            } catch (error) {
                console.error(`${this.logPrefix} âŒ Lá»—i khi gá»­i yÃªu cáº§u tá»›i ${endpoint}:`, error);
                return null;
            }
        }
        /**
        * HÃ m há»— trá»£: Äá»£i má»™t khoáº£ng thá»i gian.
        */
        async delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }


        /**
        *
        láº¥y thÃ´ng tin lÆ°á»£t gá»­i/nháº­n
        */
        async fetchLvPageInfo() {
            try {
                const url = "/luan-vo-duong?t=" + Date.now();
                const resp = await fetch(url, {
                    credentials: "include",
                    cache: "no-store"
                });
                if (!resp.ok) {
                    throw new Error("KhÃ´ng load Ä‘Æ°á»£c trang Luáº­n VÃµ");
                }

                const html = await resp.text();
                const doc = new DOMParser().parseFromString(html, "text/html");

                // ===== PARSE ÄÃƒ Gá»¬I / ÄÃƒ NHáº¬N =====
                let sent = 0;
                let received = 0;

                doc.querySelectorAll("p").forEach(p => {
                    const t = p.innerText || "";
                    if (t.includes("ÄÃ£ gá»­i")) {
                        const m = t.match(/(\d+)\s*\/\s*5/);
                        if (m) {
                            sent = Number(m[1]);
                        }
                    }
                    if (t.includes("ÄÃ£ nháº­n")) {
                        const m = t.match(/(\d+)\s*\/\s*5/);
                        if (m) {
                            received = Number(m[1]);
                        }
                    }
                });


                this.sent = sent;
                this.received = received;
                console.log(`${this.logPrefix} ðŸŽ¯ÄÃ£ gá»­i: ${this.sent}, ÄÃ£ nháº­n: ${this.received}`);

                return { sent, received };
            } catch (error) {
                console.error("âŒ Lá»—i khi láº¥y thÃ´ng tin Luáº­n VÃµ:", error);
                return { sent: 0, received: 0 };
            }
        }



        /**
        * Äáº£m báº£o tÃ­nh nÄƒng tá»± Ä‘á»™ng cháº¥p nháº­n khiÃªu chiáº¿n Ä‘Æ°á»£c báº­t.
        */
        async ensureAutoAccept() {
            const toggleEndpoint = 'wp-json/luan-vo/v1/toggle-auto-accept';
            const result = await this.sendApiRequest(toggleEndpoint, 'POST', {});
            //console.log(`Check Status Auto Accept: ${result.message}`);



            if (result && result.success && result.message.includes('ÄÃ£ báº­t')) {
                taskTracker.updateTask(this.accountId, 'luanvo', 'auto_accept', true);
                return true;
            }
            await this.sendApiRequest(toggleEndpoint, 'POST', {}); //báº­t láº¡i náº¿u cÃ³ manual táº¯t autoaccept
            //console.log("ÄÃ£ báº­t láº¡i tá»± Ä‘á»™ng cháº¥p nháº­n");
            taskTracker.updateTask(this.accountId, 'luanvo', 'auto_accept', true);
            return false;

        }

        /**
    * Láº¥y danh sÃ¡ch táº¥t cáº£ user Ä‘ang theo dÃµi
    * Gá»“m cÃ¡c pháº§n: id, name, avatar, points, auto_accept, can_receive_count, profile_link, role, role_color, description, challenges_remaining, challenge_exists, challenge_id, is_following, is_joined_today, can_send_count, max_batch_count
    */

        async getFollowingUsers() {
            console.log(`${this.logPrefix} ðŸ•µï¸ Äang láº¥y danh sÃ¡ch ngÆ°á»i theo dÃµi...`);
            const endpoint = 'wp-json/luan-vo/v1/get-following-users';
            const body = { page: 1 };
            const data = await this.sendApiRequest(endpoint, 'POST', body);

            if (data && data.success) {
                const users = data.data.users;
                console.log(`${this.logPrefix} âœ… TÃ¬m tháº¥y ${users.length} ngÆ°á»i dÃ¹ng.`);
                return users;
            } else {
                console.error(`${this.logPrefix} âŒ Lá»—i khi láº¥y Online Users: ${data?.message || data?.data}`);
                return [];
            }
        }


        async getOnlineUsers() {
            console.log("ðŸŸ¢ Äang láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng online...");
            const endpoint = 'wp-json/luan-vo/v1/online-users';
            const body = { page: 1 };
            const data = await this.sendApiRequest(endpoint, 'POST', body);

            if (data && data.success) {
                const users = data.data.users;
                console.log(`âœ… TÃ¬m tháº¥y ${users.length} ngÆ°á»i online.`);
                return users;
            } else {
                console.error(`${this.logPrefix} âŒ Lá»—i khi láº¥y Online Users: ${data?.message || data?.data}`);
                return [];
            }
        }



        async sendChallenge(userId, nonce, token) {
            console.log(`${this.logPrefix} ðŸŽ¯ Äang gá»­i khiÃªu chiáº¿n Ä‘áº¿n ngÆ°á»i chÆ¡i ID: ${userId}...`);
            const challengeMode = localStorage.getItem('luanVoChallengeMode') || 'auto';

            const sendEndpoint = 'wp-json/luan-vo/v1/send-challenge';
            const sendBody = { target_user_id: userId };
            const sendResult = await this.sendApiRequest(sendEndpoint, 'POST', nonce, token, sendBody);

            if (sendResult && sendResult.success) {
                console.log(`${this.logPrefix} ðŸŽ‰ Gá»­i khiÃªu chiáº¿n thÃ nh cÃ´ng! Challenge ID: ${sendResult.data.challenge_id}`);

                // BÆ°á»›c má»›i: Kiá»ƒm tra náº¿u Ä‘á»‘i thá»§ báº­t auto_accept
                if (sendResult.data.auto_accept || challengeMode === 'manual') {
                    console.log(`${this.logPrefix} âœ¨ Äá»‘i thá»§ tá»± Ä‘á»™ng cháº¥p nháº­n, Ä‘ang hoÃ n táº¥t tráº­n Ä‘áº¥u...`);

                    const approveEndpoint = 'wp-json/luan-vo/v1/auto-approve-challenge';
                    const approveBody = {
                        challenge_id: sendResult.data.challenge_id,
                        target_user_id: userId
                    };

                    const approveResult = await this.sendApiRequest(approveEndpoint, 'POST', nonce, token, approveBody);

                    if (approveResult && approveResult.success) {
                        showNotification(`[Luáº­n vÃµ] ${approveResult.data.message}!`, 'success');
                        return true;
                    } else {
                        const message = approveResult?.data?.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi hoÃ n táº¥t tráº­n Ä‘áº¥u.';
                        showNotification(`âŒ Lá»—i hoÃ n táº¥t tráº­n Ä‘áº¥u: ${message}`, 'error');
                        return false;
                    }
                } else {
                    showNotification(`âœ… ÄÃ£ gá»­i khiÃªu chiáº¿n Ä‘áº¿n ${userId}! Äang chá» Ä‘á»‘i thá»§ cháº¥p nháº­n.`, 'success');
                    return true;
                }
            } else {
                const message = sendResult?.data?.message || JSON.stringify(sendResult) || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh.';
                showNotification(`âŒ Gá»­i khiÃªu chiáº¿n tháº¥t báº¡i: ${message}`, 'error');
                return false;
            }
        }

        async attackCurrentTarget() {
            if (!this.currentTarget) return;

            // âœ… náº¿u mÃ¬nh Ä‘Ã£ Ä‘á»§ 5 lÆ°á»£t â†’ STOP
            if (this.sent >= this.maxBattles) {
                console.log("ðŸ ÄÃ£ Ä‘á»§ 5 lÆ°á»£t Ä‘áº¥m â€” dá»«ng auto", "success");
                return;
            }

            // âŒ target háº¿t lÆ°á»£t
            if (this.targetLeft <= 0) {
                showNotification("ðŸ”„ Target háº¿t lÆ°á»£t â€” chuyá»ƒn Ä‘á»‘i tÆ°á»£ng", "warn");
                this.currentTarget = null;
                return this.huntFromOnline();
            }
            const nonce = this.config.nonce;
            const token = this.config.token;
            const success = await this.sendChallenge(this.currentTarget.id, nonce, token);
            if (success) {
                this.sent++;        // tÄƒng sá»‘ lÆ°á»£t mÃ¬nh Ä‘Ã£ gá»­i
                this.targetLeft--;  // giáº£m sá»‘ lÆ°á»£t cÃ²n láº¡i cá»§a target
                await this.delay(4400);
            }
            return this.attackCurrentTarget();
        }


        async huntLuanVoTargets() {
            // Kiá»ƒm tra cháº¿ Ä‘á»™
            const challengeMode = localStorage.getItem('luanVoChallengeMode') || 'auto';

            if (challengeMode === 'manual') {
                // Cháº¿ Ä‘á»™ Theo ID
                const targetUserId = localStorage.getItem(`luanVoTargetUserId_${this.accountId}`) || '';
                if (!targetUserId) {
                    showNotification("âŒ ChÆ°a cáº¥u hÃ¬nh ID ngÆ°á»i chÆ¡i!", "error");
                    return;
                }

                return this.huntSpecificUser(targetUserId);
            }

            // Cháº¿ Ä‘á»™ Tá»± Ä‘á»™ng (giá»¯ logic cÅ©)
            const users = await this.getFollowingUsers();
            if (!Array.isArray(users) || users.length === 0) {
                showNotification("âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c danh sÃ¡ch follow", "error");
                return this.huntFromOnline();
            }

            const target = users.find(u => Number(u.can_receive_count) > 0);
            if (!target) {
                showNotification("âš ï¸ Follow full â€” chuyá»ƒn ONLINE", "warn");
                return this.huntFromOnline();
            }

            this.currentTarget = target;
            const myRemaining = this.maxBattles - this.sent;
            this.targetLeft = Math.min(target.can_receive_count, myRemaining);

            console.log(`ðŸŽ¯ Chá»n ${target.name} cÃ²n(${this.targetLeft} lÆ°á»£t)`);
            return this.attackCurrentTarget();
        }

        async huntSpecificUser(userId) {
            console.log(`ðŸŽ¯ Äang Ä‘Ã¡nh theo ID: ${userId}`);

            // Äáº·t target vá»›i ID Ä‘Ã£ nháº­p
            this.currentTarget = {
                id: userId,
                user_id: userId,
                name: `User ${userId}`
            };

            // Gá»­i táº¥t cáº£ 5 lÆ°á»£t cho user nÃ y
            while (this.sent < this.maxBattles) {
                console.log(`${this.logPrefix} âš”ï¸ Gá»­i lÆ°á»£t ${this.sent + 1}/${this.maxBattles} cho ID: ${userId}`);

                const nonce = this.config.nonce;
                const token = this.config.token;
                const success = await this.sendChallenge(userId, nonce, token);
                if (success) {
                    this.sent++;
                    await this.delay(1000);
                } else {
                    // Náº¿u tháº¥t báº¡i, thá»­ láº¡i sau 2 giÃ¢y
                    console.warn(`${this.logPrefix} âš ï¸ Gá»­i tháº¥t báº¡i, thá»­ láº¡i sau 2s...`);
                    await this.delay(2000);
                }
            }

            console.log(`${this.logPrefix} âœ… HoÃ n thÃ nh ${this.sent} lÆ°á»£t cho ID: ${userId}`);
        }


        async huntFromOnline() {
            const users = await this.getOnlineUsers();
            if (!Array.isArray(users) || users.length === 0) {
                showNotification("ðŸ˜´ Online full â€” nghá»‰ 60s", "info");
                return setTimeout(() => this.huntLuanVoTargets(), 60000);
            }

            const target = users.find(u => Number(u.challenges_remaining) > 0);
            if (!target) {
                showNotification("âš ï¸ KhÃ´ng cÃ³ online kháº£ dá»¥ng", "warn");
                return;

            }

            this.currentTarget = target;
            const myRemaining = this.maxBattles - this.sent;
            this.targetLeft = Math.min(target.challenges_remaining, myRemaining);
            //showNotification(`âš”ï¸ Online: ${target.name} cÃ²n(${this.targetLeft} lÆ°á»£t)`, "info");
            return this.attackCurrentTarget();
        }



        async receiveReward() {
            console.log(`${this.logPrefix} ðŸŽ Äang gá»­i yÃªu cáº§u nháº­n thÆ°á»Ÿng...`);

            const endpoint = 'wp-json/luan-vo/v1/receive-reward';
            const body = {};

            try {
                const response = await this.sendApiRequest(endpoint, 'POST', {});
                if (!response) {
                    return;
                }
                if (response.success === true) {
                    showNotification(`ðŸŽ‰ Luáº­n vÃµ: ${response.message}`, 'success');
                    taskTracker.markTaskDone(accountId, 'luanvo');
                    return;
                } else if (response.message === "Äáº¡o há»¯u Ä‘Ã£ nháº­n thÆ°á»Ÿng trong ngÃ y hÃ´m nay.") {
                    showNotification('ðŸŽ Báº¡n Ä‘Ã£ nháº­n thÆ°á»Ÿng Luáº­n VÃµ hÃ´m nay rá»“i!', 'info')
                    taskTracker.markTaskDone(accountId, 'luanvo');
                    return;
                } else {

                    // const errorMessage = response.message || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh khi nháº­n thÆ°á»Ÿng.';
                    //console.error(`${this.logPrefix} âŒ Lá»—i khi nháº­n thÆ°á»Ÿng: ${response?.message || response?.data}`);
                    showNotification(`âŒ ${response?.message || response?.data}`, 'error');

                }
            } catch (error) {
                showNotification(`âŒ Lá»—i máº¡ng khi gá»­i yÃªu cáº§u nháº­n thÆ°á»Ÿng. ${error}`, 'error');
            }
        }


        async startLuanVo() {
            if (!this.config) {
                await this.setupConfig();
            }

            // láº¥y sá»‘ lÆ°á»£t Ä‘Ã£ gá»­i/nháº­n tá»« server
            await this.fetchLvPageInfo();

            // BÆ°á»›c 2: Tham gia tráº­n Ä‘áº¥u
            if (!taskTracker.getTaskStatus(accountId, 'luanvo').battle_joined) {
                const joinResult = await this.sendApiRequest(
                    'wp-json/luan-vo/v1/join-battle', 'POST', { action: 'join_battle', security_token: this.config.token }
                );
                console.log(`Check tham gia tráº­n Ä‘áº¥u ${joinResult}`);

                if (joinResult && joinResult.success === true) {
                    console.log(`âœ… ${joinResult.message || 'Tham gia luáº­n vÃµ thÃ nh cÃ´ng.'}`);
                    taskTracker.updateTask(accountId, 'luanvo', 'battle_joined', true);
                } else if (joinResult.message === 'Báº¡n Ä‘Ã£ tham gia Luáº­n VÃµ ÄÆ°á»ng hÃ´m nay rá»“i!') {
                    console.log(`â„¹ï¸ ${joinResult.message}`);
                    taskTracker.updateTask(accountId, 'luanvo', 'battle_joined', true);
                } else {
                    console.error(`${this.logPrefix} âŒ ${joinResult?.message}`);
                    showNotification(joinResult?.message, 'error');
                }
            } else {

                console.log(`${this.logPrefix} â„¹ï¸ ÄÃ£ tham gia luáº­n vÃµ trÆ°á»›c Ä‘Ã³`);
            }

            // BÆ°á»›c 3: Äáº£m báº£o tá»± Ä‘á»™ng cháº¥p nháº­n khiÃªu chiáº¿n
            // if (!taskTracker.getTaskStatus(accountId, 'luanvo').auto_accept) {
            const autoAcceptSuccess = await this.ensureAutoAccept();
            console.log(`${autoAcceptSuccess}`);
            if (autoAcceptSuccess) {
                console.log(`${this.logPrefix} âœ… Tá»± Ä‘á»™ng cháº¥p nháº­n Ä‘Ã£ Ä‘Æ°á»£c báº­t.`);
            } else {
                console.log('âš ï¸ ÄÃ£ báº­t tá»± Ä‘á»™ng cháº¥p nháº­n trÆ°á»›c Ä‘Ã³ hoáº·c ÄÃ£ báº­t láº¡i tá»± Ä‘á»™ng láº§n ná»¯a');
            }

            // }

        }


        async doLuanVo(autoChallenge = true) {
            await this.startLuanVo();
            // if (!autoChallenge) {
            //     return this.goToLuanVoPage();
            // }
            console.log("ðŸ” Báº¯t Ä‘áº§u auto Luáº­n VÃµ...");
            await this.huntLuanVoTargets();
            await this.receiveReward();
        }


        /**ThuÃª TiÃªu ViÃªm Ä‘á»ƒ hoÃ n thÃ nh khiÃªu chiáº¿n */
        async thueTieuViem(securityToken) {
            const nonce = await getNonce();
            if (!nonce) {
                showNotification('âŒ Lá»—i: KhÃ´ng thá»ƒ láº¥y nonce cho Luáº­n VÃµ.', 'error');
                return;
            }

            try {
                while (true) {
                    const res = await fetch(weburl + "wp-json/luan-vo/v1/send-bot-challenge", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "X-WP-Nonce": nonce,
                            "X-LV-Token": securityToken
                        },
                        body: JSON.stringify({ bot_id: -1 })
                    });

                    if (!res.ok) {
                        console.error("âŒ Request tháº¥t báº¡i:", res.status);
                        break;
                    }

                    const data = await res.json();
                    if (data.success) {
                        showNotification(data.message, 'success');
                    } else if (data.message === "Äáº¡o há»¯u Ä‘Ã£ Ä‘áº¡t tá»‘i Ä‘a nháº­n khiÃªu chiáº¿n trong ngÃ y.") {
                        showNotification('[Luáº­n vÃµ] HoÃ n thÃ nh khiÃªu chiáº¿n ViÃªm Tráº©u', 'info');
                        break;
                    }
                    // chá» 1-2 giÃ¢y Ä‘á»ƒ trÃ¡nh spam quÃ¡ nhanh
                    await new Promise(r => setTimeout(r, 1500));
                }
            } catch (error) {
                console.error("âŒ Lá»—i:", error);
            }
        }


        goToLuanVoPage() {
            const luanVoUrl = `${this.weburl}/luan-vo-duong?t`;
            if (confirm("Báº¡n cÃ³ muá»‘n chuyá»ƒn Ä‘áº¿n trang Luáº­n VÃµ ÄÆ°á»ng khÃ´ng?")) {
                window.location.href = luanVoUrl;
            }
        }
    }
    /// ====================================================
    function extractActionTokens(html) {
        const map = {};

        // â­ BÆ¯á»šC 1: TÃ¬m táº¥t cáº£ cÃ¡c object cÃ³ chá»©a 'action:' (báº¥t ká»ƒ giÃ¡ trá»‹)
        const actionPosRegex = /['"]?action['"]?\s*[:=]/gi;
        let m;

        while ((m = actionPosRegex.exec(html)) !== null) {
            const actionIdx = m.index;

            // TÃ¬m vá»‹ trÃ­ '{' gáº§n nháº¥t trÆ°á»›c action
            let openPos = -1;
            for (let i = actionIdx; i >= 0 && i > actionIdx - 1000; i--) {
                if (html[i] === '{') { openPos = i; break; }
                if (html[i] === ';') break;
            }

            if (openPos === -1) continue;

            // Parse toÃ n bá»™ object tá»« '{' Ä‘áº¿n '}'
            let i = openPos;
            let depth = 0;
            let inStr = null;
            let escaped = false;
            let inLineComment = false;
            let inBlockComment = false;

            for (; i < html.length; i++) {
                const ch = html[i];
                if (inLineComment) {
                    if (ch === '\n') inLineComment = false;
                    continue;
                }
                if (inBlockComment) {
                    if (ch === '*' && html[i + 1] === '/') { inBlockComment = false; i++; continue; }
                    continue;
                }
                if (inStr) {
                    if (escaped) { escaped = false; continue; }
                    if (ch === '\\') { escaped = true; continue; }
                    if (ch === inStr) { inStr = null; continue; }
                    continue;
                }
                if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
                if (ch === '/' && html[i + 1] === '/') { inLineComment = true; i++; continue; }
                if (ch === '/' && html[i + 1] === '*') { inBlockComment = true; i++; continue; }
                if (ch === '{') depth++;
                else if (ch === '}') {
                    depth--;
                    if (depth === 0) { i++; break; }
                }
            }

            const objSlice = html.slice(openPos, i);

            // â­ BÆ¯á»šC 2: Extract security tá»« object (báº¥t ká»ƒ vá»‹ trÃ­)
            const securityMatch = /['"]?security['"]?\s*[:=]\s*['"]([^'"]+)['"]/i.exec(objSlice);
            if (!securityMatch) continue; // KhÃ´ng cÃ³ security trong object nÃ y

            const securityToken = securityMatch[1];

            // â­ BÆ¯á»šC 3: Extract action names (cáº£ static, dynamic vÃ  ternary)
            const actionNames = new Set(); // DÃ¹ng Set Ä‘á»ƒ trÃ¡nh trÃ¹ng láº·p

            // 3.1: TÃ¬m action line trong object
            const actionLineMatch = /['"]?action['"]?\s*[:=]\s*([^,}]+)/i.exec(objSlice);
            if (actionLineMatch) {
                const actionValue = actionLineMatch[1].trim();

                // 3.1a: Static string: action: "enter_mine" hoáº·c action: 'enter_mine'
                const staticMatch = /^['"]([^'"]+)['"]/.exec(actionValue);
                if (staticMatch) {
                    actionNames.add(staticMatch[1]);
                }

                // 3.1b: Dynamic hh3dData.act.xxx
                const dynamicMatches = actionValue.matchAll(/hh3dData\.act\.([a-zA-Z0-9_]+)/gi);
                for (const dm of dynamicMatches) {
                    actionNames.add(dm[1]); // kmBuy, kmEnter, kmReward, etc.
                }

                // 3.1c: Ternary fallback: ... ? xxx : 'fallback_string'
                const ternaryMatch = /:\s*['"]([^'"]+)['"]/.exec(actionValue);
                if (ternaryMatch) {
                    actionNames.add(ternaryMatch[1]); // buy_item_khoang, enter_mine, etc.
                }
            }

            // â­ BÆ¯á»šC 4: Map táº¥t cáº£ action names vá»›i security token
            for (const actionName of actionNames) {
                if (actionName && actionName.trim()) {
                    const trimmedName = actionName.trim();
                    // Chá»‰ map náº¿u chÆ°a cÃ³ hoáº·c update vá»›i token má»›i hÆ¡n
                    if (!map[trimmedName] || map[trimmedName] !== securityToken) {
                        map[trimmedName] = securityToken;
                    }
                }
            }
        }

        // â­ BÆ¯á»šC 5: TÃ¬m cÃ¡c action Ä‘Æ¡n láº» khÃ´ng náº±m trong object (legacy support)
        const legacyActionRegex = /['"]?action['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi;
        let lm;
        while ((lm = legacyActionRegex.exec(html)) !== null) {
            const actionName = lm[1];
            if (map[actionName]) continue; // ÄÃ£ cÃ³ rá»“i, skip

            // TÃ¬m security gáº§n Ä‘Ã³
            const slice = html.slice(lm.index, lm.index + 1000);
            const nm = /(?:['"]?(?:security|nonce)['"]?\s*[:=]\s*['"]([^'"]+)['"])/i.exec(slice);
            if (nm) map[actionName] = nm[1];
        }

        // â­ BÆ¯á»šC 6: ThÃªm cÃ¡c nguá»“n khÃ¡c (input hidden, meta, biáº¿n global)
        let mm;
        const inputRegex = /<input[^>]+name=["'](?:security|nonce|_wpnonce)["'][^>]*value=["']([^"']+)["']/gi;
        while ((mm = inputRegex.exec(html)) !== null) map._global = map._global || mm[1];

        const meta = /<meta[^>]+name=["'](?:wpnonce|security|nonce)["'][^>]*content=["']([^"']+)["']/i.exec(html);
        if (meta) map._meta = map._meta || meta[1];

        const varRegex = /(?:var|let|const)\s+([a-zA-Z0-9_$]*nonce[a-zA-Z0-9_$]*)\s*=\s*['"]([^'"]+)['"]/gi;
        while ((mm = varRegex.exec(html)) !== null) map[mm[1]] = mm[2];

        // â­ BÆ¯á»šC 7: Xá»­ lÃ½ Ä‘áº·c biá»‡t cho "nonce" vÃ  "restNonce"
        // Náº¿u action name lÃ  "nonce" hoáº·c "restNonce", láº¥y giÃ¡ trá»‹ tá»« JSON pattern
        if (!map['nonce']) {
            const nonceMatch = html.match(/"nonce"\s*:\s*"([a-f0-9]+)"/i);
            if (nonceMatch) map['nonce'] = nonceMatch[1];
        }

        if (!map['restNonce']) {
            const restNonceMatch = html.match(/"restNonce"\s*:\s*"([a-f0-9]+)"/i);
            if (restNonceMatch) map['restNonce'] = restNonceMatch[1];
        }

        return map;
    }

    function extractWpRestNonce(html) {
        const m = html.match(/"restNonce"\s*:\s*"([a-f0-9]+)"/i);
        return m ? m[1] : null;
    }
    function extractWpNonce(html) {
        const m = html.match(/"nonce"\s*:\s*"([a-f0-9]+)"/i);
        return m ? m[1] : null;
    }
    function extractRedeemNonce(html) {
        // Match: const redeemNonce = '0e14dbd03c'; hoáº·c "redeemNonce":"abc"
        const m = html.match(/(?:var|let|const)\s+redeemNonce\s*=\s*['"]([a-f0-9]+)['"]/)
            || html.match(/"redeemNonce"\s*[=:]\s*['"]([a-f0-9]+)['"]/i);
        return m ? m[1] : null;
    }

    ///====================== KHOÃNG Máº CH ===================

    class KhoangMach {
        constructor() {
            this.ajaxUrl = ajaxUrl;
            this.khoangMachUrl = weburl + 'khoang-mach?t';
            this.logPrefix = '[KhoÃ¡ng Máº¡ch]';
            this.headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            };
            this.getUsersInMineNonce = null;
            this.securityToken = null;
            this.buffBought = false;
            this.lastOuterUserIds = '';
            this.lastOuterNotificationTime = 0;
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async #getNonce(actionName) {
            return getSecurityNonce(this.khoangMachUrl, actionName);
        }


        async loadMines(mineType) {
            const nonce = await getSecurityNonce(this.khoangMachUrl, 'load_mines_by_type');
            if (!nonce) { showNotification('Lá»—i nonce (load_mines).', 'error'); return null; }
            const payload = new URLSearchParams({ action: hData && hData.act ? hData.act.kmList : 'load_mines_by_type', mine_type: mineType, security: nonce });
            try {
                const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                const d = await r.json();
                return d.success ? d.data : (showNotification(d.message || 'Lá»—i táº£i má».', 'error'), null);
            } catch (e) { console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (táº£i má»):`, e); return null; }
        };

        async getAllMines(forceRefresh = false) {
            const mineTypes = ['gold', 'silver', 'copper'];
            const cacheKey = "HH3D_allMines";
            const cacheRaw = localStorage.getItem(cacheKey);

            // Kiá»ƒm tra cache (khÃ´ng cÃ³ thá»i háº¡n â€” chá»‰ xÃ³a khi báº¥m load láº¡i)
            if (!forceRefresh && cacheRaw && cacheRaw.length > 0) {
                try {
                    const cache = JSON.parse(cacheRaw);
                    const cacheTypes = new Set((cache?.data || []).map(m => String(m?.type || '')));
                    const cacheHasAllTypes = mineTypes.every(t => cacheTypes.has(t));

                    if (cache.data && cache.data.length > 0 && cacheHasAllTypes) {
                        console.log("[HH3D] ðŸ—„ï¸ DÃ¹ng dá»¯ liá»‡u má» tá»« cache");
                        showNotification("ðŸ—„ï¸ Dá»¯ liá»‡u má» Ä‘Ã£ Ä‘Æ°á»£c táº£i tá»« cache.", "info");
                        return {
                            optionsHtml: cache.optionsHtml,
                            minesData: cache.data
                        };
                    } else {
                        localStorage.removeItem(cacheKey);
                    }
                } catch (e) {
                    console.warn("[HH3D] Lá»—i Ä‘á»c cache:", e);
                }
            }

            // --- Náº¿u chÆ°a cÃ³ cache hoáº·c Ä‘Ã£ háº¿t háº¡n, táº£i má»›i ---
            const nonce = await getSecurityNonce(this.khoangMachUrl, 'load_mines_by_type');
            if (!nonce) {
                showNotification('Lá»—i nonce (getAllMines).', 'error');
                return { optionsHtml: '', minesData: [] };
            }

            // --- Load tá»«ng loáº¡i + kiá»ƒm tra Ä‘á»§ 3 loáº¡i ---
            const minesByType = new Map();
            const missingTypes = new Set(mineTypes);

            const fetchMinesByType = async (type) => {
                const payload = new URLSearchParams({
                    action: hData && hData.act ? hData.act.kmList : 'load_mines_by_type',
                    mine_type: type,
                    security: nonce
                });

                try {
                    const r = await fetch(this.ajaxUrl, {
                        method: 'POST',
                        headers: this.headers,
                        body: payload,
                        credentials: 'include'
                    });
                    const d = await r.json();

                    if (d && d.success && Array.isArray(d.data)) {
                        const typed = d.data.map(mine => ({ ...mine, type }));
                        minesByType.set(type, typed);
                        missingTypes.delete(type);
                        return true;
                    }

                    showNotification((d && (d.message || d?.data?.message)) || `Lá»—i táº£i má» loáº¡i ${type}.`, 'error');
                    return false;
                } catch (e) {
                    console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (táº£i má» ${type}):`, e);
                    return false;
                }
            };

            const loadTypes = async (typesToLoad) => {
                await Promise.all((typesToLoad || []).map(t => fetchMinesByType(t)));
            };

            // 1) Load láº§n Ä‘áº§u
            await loadTypes(mineTypes);

            // 2) Retry loáº¡i bá»‹ thiáº¿u (tá»‘i Ä‘a 2 láº§n)
            for (let attempt = 1; attempt <= 2 && missingTypes.size > 0; attempt++) {
                const retryTypes = Array.from(missingTypes);
                console.warn(`${this.logPrefix} âš ï¸ getAllMines thiáº¿u loáº¡i: ${retryTypes.join(', ')}. Retry láº§n ${attempt}/2...`);
                await this.delay(500 * attempt);
                await loadTypes(retryTypes);
            }

            const allMines = [];
            mineTypes.forEach(t => {
                const arr = minesByType.get(t);
                if (arr && arr.length) allMines.push(...arr);
            });

            if (missingTypes.size > 0) {
                const missing = Array.from(missingTypes);
                showNotification(`ChÆ°a táº£i Ä‘á»§ 3 loáº¡i má». Thiáº¿u: ${missing.join(', ')}. (KhÃ´ng cache dá»¯ liá»‡u thiáº¿u)`, 'error');
            }

            // --- Sáº¯p xáº¿p ---
            allMines.sort((a, b) => {
                const typeOrder = { 'gold': 1, 'silver': 2, 'copper': 3 };
                const typeComparison = typeOrder[a.type] - typeOrder[b.type];
                if (typeComparison === 0) {
                    return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
                }
                return typeComparison;
            });

            // --- Sinh HTML ---
            const mineOptionsHtml = allMines.map(mine => {
                let typePrefix = '';
                if (mine.type === 'gold') typePrefix = '[ThÆ°á»£ng] ';
                else if (mine.type === 'silver') typePrefix = '[Trung] ';
                else if (mine.type === 'copper') typePrefix = '[Háº¡] ';
                return `<option value="${mine.id}">${typePrefix}${mine.name} (${mine.id})</option>`;
            }).join('');

            // --- LÆ°u cache (khÃ´ng cÃ³ thá»i háº¡n) ---
            if (missingTypes.size === 0) {
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: allMines,
                    optionsHtml: mineOptionsHtml
                }));
            }

            return {
                optionsHtml: mineOptionsHtml,
                minesData: allMines
            };
        }

        async enterMine(mineId) {
            // Láº¥y nonce
            const nonce = await this.#getNonce('enter_mine');
            if (!nonce) {
                showNotification('Lá»—i nonce (enter_mine).', 'error');
                return false;
            }

            if (!nonce) {
                showNotification('Lá»—i nonce (enter_mine).', 'error');
                return false;
            }

            // HÃ m gá»­i request
            const post = async (payload) => {
                const r = await fetch(this.ajaxUrl, {
                    method: 'POST',
                    headers: this.headers,
                    body: new URLSearchParams(payload),
                    credentials: 'include'
                });
                return r.json();
            };
            this.securityToken = await getSecurityToken(this.khoangMachUrl);
            try {
                const d = await post({ action: hData && hData.act ? hData.act.kmEnter : 'enter_mine', mine_id: mineId, security_token: this.securityToken, security: nonce });

                if (d.success) {
                    showNotification(d.data.message, 'success');
                    return true;
                }
                console.log(`${this.logPrefix} âŒ VÃ o má» tháº¥t báº¡i:`, JSON.stringify(d));
                const msg = d.data.message || 'Lá»—i vÃ o má».';

                if (msg.includes('Ä‘áº¡t Ä‘á»§ thÆ°á»Ÿng ngÃ y')) {
                    taskTracker.markTaskDone(accountId, 'khoangmach');
                    showNotification(msg, 'error');
                }
                else if (msg.includes('CÃ³ pháº§n thÆ°á»Ÿng chÆ°a nháº­n')) {
                    // Náº¿u bá»‹ sÃ¡t háº¡i táº¡i khoÃ¡ng máº¡ch â†’ nháº­n thÆ°á»Ÿng trÆ°á»›c
                    const nonce = await this.#getNonce('claim_reward_km');
                    if (!nonce) {
                        showNotification('Lá»—i nonce (claim_reward_km).', 'error');
                        return false;
                    }
                    this.securityToken = hData.securityToken || await getSecurityToken(this.khoangMachUrl);
                    const reward = await post({ action: hData && hData.act ? hData.act.kmReward : 'claim_reward_km', security_token: this.securityToken, security: nonce });
                    if (reward.success) {
                        showNotification(`Nháº­n thÆ°á»Ÿng <b>${reward.data.total_tuvi} tu vi vÃ  ${reward.data.total_tinh_thach} tinh tháº¡ch</b> táº¡i khoÃ¡ng máº¡ch ${reward.data.mine_name}`, 'info');
                        return this.enterMine(mineId); // gá»i láº¡i Ä‘á»ƒ vÃ o má»
                    } else {
                        showNotification('Lá»—i nháº­n thÆ°á»Ÿng khi bá»‹ Ä‘Ã¡nh ra khá»i má» khoÃ¡ng', 'warn');
                    }
                } else {
                    showNotification(msg, 'error');
                    console.log(`${this.logPrefix} âŒ ${msg}`);
                }
                // Kiá»ƒm tra thÃ´ng tin má» vÃ  kiá»ƒm tra ngoáº¡i tÃ´ng
                let mineInfo = await this.getUsersInMine(mineId);
                if (!mineInfo) throw new Error('Lá»—i láº¥y thÃ´ng tin chi tiáº¿t trong má»');
                const users = mineInfo.users || [];
                if (users.length === 0) {
                    console.log(`[KhoÃ¡ng máº¡ch] Má» ${mineId} trá»‘ng.`);
                    showNotification('Má» trá»‘ng trÆ¡n???', 'warn');
                    throw new Error('Má» trá»‘ng trÆ¡n???');
                }

                // Kiá»ƒm tra ngoáº¡i tÃ´ng
                const outerUsers = users.filter(u => !u.lien_minh && !u.dong_mon);
                this.checkAndNotifyOuterEnemies(outerUsers, mineId);
                return false;

            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (vÃ o má»):`, e);
                return false;
            }
        }

        async decodeAvatar(encoded, viewerId) {
            try {
                // â­ Validate input
                if (!encoded || typeof encoded !== 'string') {
                    return null;
                }

                const key = (viewerId % 251) + 1;
                // â­ Browser khÃ´ng cÃ³ Buffer, dÃ¹ng atob() Ä‘á»ƒ decode Base64
                const raw = atob(encoded);
                let result = '';
                for (let i = 0; i < raw.length; i++) {
                    result += String.fromCharCode(raw.charCodeAt(i) ^ (key ^ (i % 7)));
                }
                return result;
            } catch (e) {
                console.error('decodeAvatar error:', e, 'Input:', encoded);
                return null;
            }
        }
        getIdfromAvatar(avatarUrl) {
            // â­ Validate input
            if (!avatarUrl || typeof avatarUrl !== 'string') {
                return null;
            }

            // TÃ¡ch user ID tá»« avatar URL: /ultimatemember/{ID}/
            const idFromAvatar = (avatarUrl.match(/\/ultimatemember\/(\d+)\//i) || [])[1];
            if (idFromAvatar) return parseInt(idFromAvatar);
            return null;
        }

        async getUsersInMine(mineId) {

            // --- 1. Láº¥y 'security' nonce (giá»¯ logic cache cá»§a báº¡n) ---
            let nonce = '';
            if (this.getUsersInMineNonce) {
                nonce = this.getUsersInMineNonce;
                console.log(`${this.logPrefix} ðŸ—„ï¸ DÃ¹ng 'security' nonce tá»« cache.`);
            } else {
                console.log(`${this.logPrefix} â–¶ï¸ Cache nonce khÃ´ng cÃ³, táº£i má»›i...`);
                // Giáº£ Ä‘á»‹nh this.#getNonce lÃ  hÃ m private cá»§a class báº¡n
                nonce = await this.#getNonce('get_users_in_mine');

                if (nonce) {
                    this.getUsersInMineNonce = nonce; // lÆ°u láº¡i Ä‘á»ƒ dÃ¹ng láº§n sau
                }
            }

            //Náº¿u page hiá»‡n táº¡i lÃ  khoÃ¡ng máº¡ch thÃ¬ láº¥y tháº³ng token tá»« Ä‘Ã³
            // this.securityToken = await getSecurityToken(this.khoangMachUrl);
            this.securityToken = hData && hData.securityToken ? hData.securityToken : await getSecurityToken(this.khoangMachUrl);
            // --- 3. Kiá»ƒm tra cáº£ hai token ---
            if (!nonce || !this.securityToken) {
                let errorMsg = 'Lá»—i (get_users):';
                if (!nonce) errorMsg += " KhÃ´ng tÃ¬m tháº¥y 'security' nonce.";
                if (!this.securityToken) errorMsg += " KhÃ´ng tÃ¬m tháº¥y 'security_token' (hh3dData).";

                showNotification(errorMsg, 'error');
                this.getUsersInMineNonce = null; // XÃ³a cache nonce há»ng náº¿u cÃ³
                return null;
            }

            // --- 4. Táº¡o payload (ÄÃ£ thÃªm security_token) ---
            const payload = new URLSearchParams({
                action: hData && hData.act ? hData.act.kmUsers : 'get_users_in_mine',
                mine_id: mineId,
                security_token: this.securityToken, // <-- THÃŠM DÃ’NG NÃ€Y
                security: nonce
            });

            // --- 5. Gá»­i fetch ---
            try {
                const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                const d = await r.json();
                console.log(`${this.logPrefix} ðŸ§‘â€ðŸ¤â€ðŸ§‘ NgÆ°á»i trong má»:`, d);
                // Logic tráº£ vá» cá»§a báº¡n (hoáº¡t Ä‘á»™ng tá»‘t)
                return d.success ? d.data : (showNotification(d.data.message || 'Lá»—i láº¥y thÃ´ng tin ngÆ°á»i chÆ¡i.', 'error'), null);

            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (láº¥y user):`, e);
                return null;
            }
        }

        async takeOverMine(mineId) {
            const nonce = await this.#getNonce('change_mine_owner');
            if (!nonce) { showNotification('Lá»—i nonce (take_over).', 'error'); return false; }
            this.securityToken = await getSecurityToken(this.khoangMachUrl);
            const payload = new URLSearchParams({ action: hData && hData.act ? hData.act.kmOwner : 'change_mine_owner', mine_id: mineId, security_token: this.securityToken, security: nonce });
            try {
                const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                const d = await r.json();
                if (d.success) {
                    showNotification(d.data.message, 'success');
                    return true;
                } else {
                    showNotification(d.message || 'Lá»—i Ä‘oáº¡t má».', 'error');
                    return false;
                }
            } catch (e) { console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (Ä‘oáº¡t má»):`, e); return false; }
        }

        async buyBuffItem() {
            const nonce = await this.#getNonce('buy_item_khoang');
            if (!nonce) { showNotification('Lá»—i nonce (buy_item).', 'error'); return false; }
            const payload = new URLSearchParams({ action: hData && hData.act ? hData.act.kmBuy : 'buy_item_khoang', security: nonce, item_id: 4 });
            try {
                const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                const d = await r.json();
                if (d.success) {
                    showNotification(d.data.message || 'ÄÃ£ mua Linh Quang PhÃ¹', 'success');
                    this.buffBought = true;
                    return true;
                } else {
                    showNotification(d.data.message || 'Lá»—i mua Linh Quang PhÃ¹', 'error');
                    return false;
                }
            } catch (e) { console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (mua buff):`, e); return false; }
        }

        async claimReward(mineId) {
            const leaveMineToClaimReward = localStorage.getItem(`khoangmach_leave_mine_to_claim_reward_${accountId}`) === 'true';
            if (leaveMineToClaimReward) {
                const left = await this.leaveMine(mineId);
                if (!left) {
                    showNotification('KhÃ´ng thá»ƒ rá»i má» Ä‘á»ƒ nháº­n thÆ°á»Ÿng.', 'error');
                    return false;
                } else {
                    await this.delay(500); // Ä‘á»£i 1s cho cháº¯c
                    const entered = await this.enterMine(mineId);
                    if (!entered) {
                        showNotification('KhÃ´ng thá»ƒ vÃ o láº¡i má» sau khi nháº­n thÆ°á»Ÿng.', 'error');
                        return false;
                    } else {
                        taskTracker.adjustTaskTime(accountId, 'khoangmach', timePlus('30:00'));
                        return true;
                    }
                }
            } else {
                const nonce = await this.#getNonce('claim_mycred_reward');
                if (!nonce) { showNotification('Lá»—i nonce (claim_reward).', 'error'); return false; }
                this.securityToken = hData.securityToken || await getSecurityToken(this.khoangMachUrl);
                const payload = new URLSearchParams({ action: hData && hData.act ? hData.act.kmClaim : 'claim_mycred_reward', mine_id: mineId, security_token: this.securityToken, security: nonce });
                try {
                    const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                    const d = await r.json();
                    if (d.success) {
                        showNotification(d.data.message, 'success');
                        taskTracker.adjustTaskTime(accountId, 'khoangmach', timePlus('30:00'));
                        return true;
                    } else {
                        showNotification(d.data.message || 'Lá»—i nháº­n thÆ°á»Ÿng.', 'error');
                        return false;
                    }
                } catch (e) { console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (nháº­n thÆ°á»Ÿng):`, e); return false; }
            }
        }

        async attackUser(attackToken, mineId) {
            // âœ… Kiá»ƒm tra cooldown: khÃ´ng cho táº¥n cÃ´ng cÃ¡ch nhau dÆ°á»›i 5500ms
            const now = Date.now();
            if (this._lastAttackTime && (now - this._lastAttackTime) < 5500) {
                const remaining = Math.ceil((5500 - (now - this._lastAttackTime)) / 1000);
                showNotification(`Vui lÃ²ng chá» ${remaining}s trÆ°á»›c khi táº¥n cÃ´ng tiáº¿p.`, 'warn');
                return false;
            }

            const security = await this.#getNonce('attack_user_in_mine');
            const securityToken = await getSecurityToken(this.khoangMachUrl);
            if (!security) {
                showNotification('Lá»—i nonce (attack_user_in_mine).', 'error');
                return false;
            }
            console.log(`${this.logPrefix} Äang táº¥n cÃ´ng ngÆ°á»i chÆ¡i trong má» ${mineId} vá»›i attackToken: ${attackToken}`);
            const payload = new URLSearchParams({ action: hData?.act?.kmAttack || 'attack_user_in_mine', attack_token: attackToken, mine_id: mineId, security_token: securityToken, security: security });
            try {
                const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                const d = await r.json();
                if (d.success) {
                    this._lastAttackTime = Date.now(); // âœ… Ghi láº¡i thá»i Ä‘iá»ƒm táº¥n cÃ´ng thÃ nh cÃ´ng
                    showNotification(d.data.message || JSON.stringify(d) || 'ÄÃ£ táº¥n cÃ´ng ngÆ°á»i chÆ¡i.', 'success');
                    return true;
                } else {
                    showNotification(d.data.message || JSON.stringify(d) || 'Lá»—i táº¥n cÃ´ng ngÆ°á»i chÆ¡i.', 'error');
                    return false;
                }
            } catch (e) { console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (táº¥n cÃ´ng user):`, e); return false; }
        }

        async leaveMine(mineId) {
            const nonce = await this.#getNonce('leave_mine');
            if (!nonce) { showNotification('Lá»—i nonce (leave_mine).', 'error'); return false; }
            this.securityToken = await getSecurityToken(this.khoangMachUrl);
            const payload = new URLSearchParams({ action: hData && hData.act ? hData.act.kmLeave : 'leave_mine', mine_id: mineId, security_token: this.securityToken, security: nonce });
            try {
                const r = await fetch(this.ajaxUrl, { method: 'POST', headers: this.headers, body: payload, credentials: 'include' });
                const d = await r.json();
                if (d.success) {
                    showNotification(d.data.message, 'success');
                    return true;
                } else {
                    showNotification(d.message || 'Lá»—i rá»i má».', 'error');
                    return false;
                }
            } catch (e) { console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (rá»i má»):`, e); return false; }
        }

        async doKhoangMach() {
            const selectedMineSetting = localStorage.getItem(`khoangmach_selected_mine_${accountId}`);
            if (!selectedMineSetting) {
                showNotification('Vui lÃ²ng chá»n má»™t má» trong cÃ i Ä‘áº·t.', 'error');
                throw new Error('Báº¡n chÆ°a chá»n má»');
            }

            const selectedMineInfo = JSON.parse(selectedMineSetting);
            if (!selectedMineInfo || !selectedMineInfo.id || !selectedMineInfo.type) {
                showNotification('CÃ i Ä‘áº·t má» khÃ´ng há»£p lá»‡.', 'error');
                throw new Error('CÃ i Ä‘áº·t má» khÃ´ng há»£p lá»‡.');
            }

            const useBuff = localStorage.getItem('khoangmach_use_buff') === 'true';
            const autoTakeover = localStorage.getItem('khoangmach_auto_takeover') === 'true';
            const autoTakeoverRotation = localStorage.getItem('khoangmach_auto_takeover_rotation') === 'true';
            const rewardMode = localStorage.getItem('khoangmach_reward_mode') || 'any';
            const rewardTimeSelected = localStorage.getItem('khoangmach_reward_time') || 'max'; // máº·c Ä‘á»‹nh chá» tá»‘i Ä‘a náº¿u chÆ°a cÃ i
            const outerNotification = localStorage.getItem('khoangmach_outer_notification') === 'true';

            // Æ¯u tiÃªn dÃ¹ng hData token (cÃ³ sáºµn tá»« page load) Ä‘á»ƒ trÃ¡nh bá»‹ Cloudflare cháº·n
            this.securityToken = (hData && hData.securityToken) || await getSecurityToken(this.khoangMachUrl);
            if (!this.securityToken) {
                showNotification('Lá»—i: KhÃ´ng láº¥y Ä‘Æ°á»£c security_token cho khoÃ¡ng máº¡ch. HÃ£y vÃ o trang /khoang-mach thá»§ cÃ´ng 1 láº§n Ä‘á»ƒ vÆ°á»£t Cloudflare.', 'error');
                throw new Error('KhÃ´ng láº¥y Ä‘Æ°á»£c security_token cho khoÃ¡ng máº¡ch.');
            }
            console.log(`${this.logPrefix} Báº¯t Ä‘áº§u quy trÃ¬nh cho má» ID: ${selectedMineInfo.id}.`);
            const mines = await this.loadMines(selectedMineInfo.type);
            if (!mines) throw new Error('KhÃ´ng táº£i danh sÃ¡ch khoÃ¡ng máº¡ch Ä‘Æ°á»£c');

            const targetMine = mines.find(m => m.id === selectedMineInfo.id);
            if (!targetMine) {
                showNotification('KhÃ´ng tÃ¬m tháº¥y má» Ä‘Ã£ chá»n trong danh sÃ¡ch táº£i vá».', 'error');
                throw new Error('KhÃ´ng tÃ¬m tháº¥y má» Ä‘Ã£ chá»n trong danh sÃ¡ch.');
            }
            if (!targetMine.is_current) {
                if (parseInt(targetMine.user_count) >= parseInt(targetMine.max_users)) {
                    showNotification('Má» Ä‘Ã£ Ä‘áº§y. KhÃ´ng vÃ o Ä‘Æ°á»£c.', 'warn');
                    return true;
                } else {
                    showNotification(`Äang vÃ o má» ${targetMine.name}...`, 'info');
                    await this.enterMine(targetMine.id);
                    return true;
                }
            }

            // Báº¯t Ä‘áº§u vÃ²ng láº·p Ä‘á»ƒ kiá»ƒm tra vÃ  thá»±c hiá»‡n tÃ¡c vá»¥ liÃªn tá»¥c
            while (true) {
                // Kiá»ƒm tra thÃ´ng tin trong má»
                let mineInfo = await this.getUsersInMine(targetMine.id);
                if (!mineInfo) throw new Error('Lá»—i láº¥y thÃ´ng tin chi tiáº¿t trong má»');
                const users = mineInfo.users || [];
                if (users.length === 0) {
                    console.log(`[KhoÃ¡ng máº¡ch] Má» ${targetMine.id} trá»‘ng.`);
                    showNotification('Má» trá»‘ng trÆ¡n???', 'warn');
                    throw new Error('Má» trá»‘ng trÆ¡n???');
                }

                // Kiá»ƒm tra vá»‹ trÃ­ trong má» (u.id bá»‹ mÃ£ hÃ³a, pháº£i láº¥y id thá»±c tá»« avatar)
                let myIndex = -1;
                for (let i = 0; i < users.length; i++) {
                    const u = users[i];
                    const avatarUrl = u.avatar || await this.decodeAvatar(u.avatar, accountId);
                    const realId = u.profile_id || this.getIdfromAvatar(avatarUrl) || u.id;
                    // console.log(`[KhoÃ¡ng máº¡ch] User ${i}: id = ${u.id}, avatar=${u.avatar}, decodedAvatar=${avatarUrl}, realId=${realId}, accountId=${accountId}`);
                    if (realId && realId.toString() === accountId.toString()) {
                        myIndex = i;
                        break;
                    }
                }
                if (myIndex === -1) {
                    console.log(`[KhoÃ¡ng máº¡ch] Kiá»ƒm tra vá»‹ trÃ­. Báº¡n chÆ°a vÃ o má» ${targetMine.name}.`);
                    showNotification(`Báº¡n chÆ°a vÃ o má» ${targetMine.name}.`, 'warn');
                    return true;
                }

                // Kiá»ƒm tra ngoáº¡i tÃ´ng
                const outerUsers = users.filter(u => !u.lien_minh && !u.dong_mon);
                this.checkAndNotifyOuterEnemies(outerUsers, targetMine);


                let myInfo = users[myIndex];
                console.log(`[KhoÃ¡ng máº¡ch] Vá»‹ trÃ­: ${myIndex}, TÃªn: ${myInfo.name}, Time: ${myInfo.time_spent}`);

                // Kiá»ƒm tra thá»i gian
                const timeSpent = myInfo.time_spent || '';
                console.log(`[KhoÃ¡ng máº¡ch] â±ï¸ Thá»i gian khai thÃ¡c: ${timeSpent || '0 phÃºt'} | Cháº¿ Ä‘á»™: ${rewardTimeSelected}`);
                if (timeSpent !== "Äáº¡t tá»‘i Ä‘a") {
                    const timeMatch = timeSpent.match(/(\d+)\s*phÃºt/);
                    const minutesSpent = timeMatch ? parseInt(timeMatch[1]) : 0;

                    let shouldWait = false;
                    let nextTime = null;

                    if (rewardTimeSelected === 'max') {
                        // ChÆ°a Ä‘áº¡t tá»‘i Ä‘a â†’ tÃ­nh thá»i gian cÃ²n láº¡i vÃ  chá»
                        shouldWait = true;
                        const remainingMs = Math.max(30 * 60 * 1000 - (minutesSpent * 60 * 1000), 60 * 1000);
                        nextTime = Date.now() + remainingMs;
                        const msg = `KhoÃ¡ng máº¡ch chÆ°a Ä‘á»§ thá»i gian. Hiá»‡n: ${timeSpent || '0 phÃºt'} | Cáº§n: Äáº¡t tá»‘i Ä‘a | CÃ²n: ${Math.round(remainingMs/60000)} phÃºt`;
                        console.log(`[KhoÃ¡ng máº¡ch] ${msg}`);
                        showNotification(`KhoÃ¡ng máº¡ch chÆ°a Ä‘á»§ thá»i gian.<br>Hiá»‡n Ä‘áº¡t: <b>${timeSpent || '0 phÃºt'}</b><br>Cáº§n: <b>Äáº¡t tá»‘i Ä‘a</b><br>CÃ²n: <b>${Math.round(remainingMs/60000)} phÃºt</b>`, 'warn');
                    } else {
                        // Kiá»ƒm tra vá»›i thá»i gian cá»¥ thá»ƒ
                        const requiredMinutes = parseInt(rewardTimeSelected);
                        if (!isNaN(requiredMinutes) && minutesSpent < requiredMinutes) {
                            shouldWait = true;
                            nextTime = Date.now() + Math.max((requiredMinutes - minutesSpent) * 60 * 1000, 60 * 1000);
                            const msg = `KhoÃ¡ng máº¡ch chÆ°a Ä‘á»§ thá»i gian. Hiá»‡n: ${timeSpent || '0 phÃºt'} | Cáº§n: ${requiredMinutes} phÃºt`;
                            console.log(`[KhoÃ¡ng máº¡ch] ${msg}`);
                            showNotification(`KhoÃ¡ng máº¡ch chÆ°a Ä‘á»§ thá»i gian.<br>Hiá»‡n Ä‘áº¡t: <b>${timeSpent || '0 phÃºt'}</b><br>Cáº§n: <b>${requiredMinutes} phÃºt</b>`, 'warn');
                        } else if (!isNaN(requiredMinutes)) {
                            console.log(`[KhoÃ¡ng máº¡ch] âœ… ÄÃ£ Ä‘á»§ ${minutesSpent}/${requiredMinutes} phÃºt. Tiáº¿n hÃ nh nháº­n thÆ°á»Ÿng...`);
                        }
                    }

                    if (shouldWait) {
                        taskTracker.adjustTaskTime(accountId, 'khoangmach', nextTime);
                        break;
                    }
                } else {
                    console.log(`[KhoÃ¡ng máº¡ch] âœ… Thá»i gian Äáº¡t tá»‘i Ä‘a. Tiáº¿n hÃ nh nháº­n thÆ°á»Ÿng...`);
                }

                // Kiá»ƒm tra tráº¡ng thÃ¡i bonus
                let bonus = mineInfo.bonus_percentage || 0;
                let canClaim = false;
                if (rewardMode === "any") {
                    canClaim = true;
                } else if (rewardMode === "20" && bonus >= 20) {
                    canClaim = true;
                } else if (rewardMode === "100" && bonus >= 100) {
                    canClaim = true;
                } else if (rewardMode === "110" && bonus === 110) {
                    canClaim = true;
                }

                if (canClaim) {
                    console.log(`[KhoÃ¡ng máº¡ch] Nháº­n thÆ°á»Ÿng táº¡i má» ${targetMine.id}, bonus=${bonus}%`);
                    await this.claimReward(targetMine.id);  // Nháº­n thÆ°á»Ÿng
                    break; // ThoÃ¡t vÃ²ng láº·p sau khi nháº­n thÆ°á»Ÿng
                } else {
                    console.log(`[KhoÃ¡ng máº¡ch] Bonus tu vi ${bonus}% chÆ°a Ä‘áº¡t ngÆ°á»¡ng ${rewardMode}`);

                    // Náº¿u cÃ³ thá»ƒ, thá»­ takeover trÆ°á»›c (option Ä‘oáº¡t má» khi chÆ°a buff)
                    if (autoTakeover && mineInfo.can_takeover) {
                        await this.delay(500);
                        console.log(`[KhoÃ¡ng máº¡ch] Thá»­ Ä‘oáº¡t má» ${targetMine.id}...`);
                        await this.takeOverMine(targetMine.id);
                        continue;
                    }

                    // Náº¿u cÃ³ thá»ƒ, thá»­ takeover trÆ°á»›c (option Ä‘oáº¡t má» báº¥t ká»ƒ buff)
                    if (autoTakeoverRotation && mineInfo.can_takeover) {
                        await this.delay(500);
                        console.log(`[KhoÃ¡ng máº¡ch] Thá»­ Ä‘oáº¡t má» ${targetMine.id}...`);
                        await this.takeOverMine(targetMine.id);
                        continue;
                    }

                    // Náº¿u cÃ³ chá»n mua buff
                    if (useBuff && bonus > 20 && !this.buffBought) {
                        await this.delay(500);
                        console.log(`[KhoÃ¡ng máº¡ch] Mua linh quang phÃ¹...`);
                        await this.buyBuffItem(targetMine.id);
                        // Äá»£i má»™t chÃºt Ä‘á»ƒ server xá»­ lÃ½
                        await new Promise(resolve => setTimeout(resolve, 300));
                        continue;
                    }

                    // Náº¿u khÃ´ng thá»ƒ lÃ m gÃ¬, thoÃ¡t khá»i vÃ²ng láº·p
                    showNotification(`[KhoÃ¡ng máº¡ch] Bonus ${bonus}% chÆ°a Ä‘áº¡t ${rewardMode}%<br>Hiá»‡n khÃ´ng thá»ƒ Ä‘oáº¡t má».<br>KhÃ´ng thá»±c hiá»‡n Ä‘Æ°á»£c hÃ nh Ä‘á»™ng nÃ o.`, 'info')
                    break;
                }
            }
        }

        /**
         * Láº¥y danh sÃ¡ch tá»•ng mÃ´n
         * @returns {Promise<Array<{id: string, name: string, level: number}>>} Máº£ng Ä‘á»‘i tÆ°á»£ng tá»•ng mÃ´n
         * vÃ­ dá»¥: [{id: "123", name: "TÃ´ng MÃ´n A", level: 6}, ...]
         */
        async getListTongMon() {
            try {
                // 1. Sá»¬A Lá»–I LOGIC URL: 
                // DÃ¹ng Ä‘Æ°á»ng dáº«n tÆ°Æ¡ng Ä‘á»‘i "/" Ä‘á»ƒ tá»± Ä‘á»™ng láº¥y domain hiá»‡n táº¡i.
                // KhÃ´ng cáº§n biáº¿n "weburl" (trÃ¡nh lá»—i weburl is not defined).
                const response = await fetch("/danh-sach-cac-tong-mon-tai-hoathinh3d");
                // Kiá»ƒm tra tráº¡ng thÃ¡i HTTP
                if (!response.ok) {
                    throw new Error(`Lá»—i káº¿t ná»‘i: ${response.status} ${response.statusText}`);
                }

                // 2. Chuyá»ƒn Ä‘á»•i dá»¯ liá»‡u
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");

                // Chá»n danh sÃ¡ch hÃ ng
                const rows = doc.querySelectorAll('table.guild-table tbody tr');
                const results = [];
                console.log(`TÃ¬m tháº¥y ${rows.length} hÃ ng tá»•ng mÃ´n.`);

                rows.forEach(row => {
                    // â­ Cáº¤U TRÃšC Má»šI: TÃ¬m guild-info-wrapper
                    const guildWrapper = row.querySelector('.guild-info-wrapper');
                    if (!guildWrapper) return;

                    // â­ Láº¤Y ID Tá»ª LINK /tong-mon/[ID]
                    const link = guildWrapper.querySelector('a[href*="/tong-mon/"]');
                    let id = null;
                    if (link) {
                        const href = link.getAttribute('href') || '';
                        const match = href.match(/\/tong-mon\/(\d+)/);
                        if (match) id = match[1];
                    }

                    // Fallback: Láº¥y tá»« nÃºt button náº¿u khÃ´ng tÃ¬m tháº¥y tá»« link
                    if (!id) {
                        const btn = row.querySelector('button.join-group');
                        id = btn ? btn.getAttribute('data-group-id') : null;
                    }

                    // â­ Láº¤Y TÃŠN Tá»ª .guild-name
                    const nameSpan = guildWrapper.querySelector('.guild-name');
                    let nameText = '';
                    if (nameSpan) {
                        nameText = (nameSpan.textContent || '').trim()
                            .replace(/^[""\s]+|[""\s]+$/g, ''); // Loáº¡i bá» dáº¥u ngoáº·c kÃ©p vÃ  khoáº£ng tráº¯ng Ä‘áº§u/cuá»‘i
                    }

                    // â­ Láº¤Y LEVEL Tá»ª .guild-level
                    let levelNum = 0;
                    const levelSpan = guildWrapper.querySelector('.guild-level');
                    if (levelSpan) {
                        const levelText = levelSpan.textContent || '';
                        const match = levelText.match(/\d+/);
                        if (match) levelNum = parseInt(match[0], 10);
                    }

                    // â­ CHá»ˆ LÆ¯U KHI CÃ“ ID VÃ€ TÃŠN Há»¢P Lá»†
                    if (id && nameText && nameText.length > 0) {
                        results.push({
                            id: id,
                            name: nameText,
                            level: levelNum
                        });
                        // console.log(`Tá»•ng mÃ´n: ID=${id}, Name="${nameText}", Level=${levelNum}`);
                    }
                });

                return results;

            } catch (error) {
                // Ghi log lá»—i Ä‘á»ƒ dá»… debug
                console.error("Lá»—i táº¡i getListTongMon:", error);
                // NÃ©m lá»—i tiáº¿p ra ngoÃ i Ä‘á»ƒ hÃ m gá»i bÃªn ngoÃ i biáº¿t lÃ  cÃ³ lá»—i
                throw error;
            }
        }


        parseGroupRoleHtml(groupRoleHtml) {
            if (!groupRoleHtml || typeof groupRoleHtml !== 'string') {
                return { tongMonName: null, role: null };
            }
            try {
                const doc = new DOMParser().parseFromString(`<div>${groupRoleHtml}</div>`, 'text/html');
                const root = doc.body;
                const tongLink = root.querySelector('a.tong-link');
                const tongMonName = tongLink ? tongLink.textContent.trim() || null : null;
                const roleSpans = Array.from(root.querySelectorAll('span[data-tooltip]'))
                    .filter(el => !el.classList.contains('tong-cap-wrapper'));
                const role = roleSpans.length ? roleSpans[roleSpans.length - 1].getAttribute('data-tooltip').trim() || null : null;
                return { tongMonName, role };
            } catch {
                return { tongMonName: null, role: null };
            }
        }


        /**
         * TÃ¬m kiáº¿m káº» Ä‘á»‹ch theo ID vÃ /hoáº·c theo TÃ´ng MÃ´n (ID tÃ´ng).
         * @param {string[]} enemyList - danh sÃ¡ch userId (string)
         * @param {string[]} tongMonList - danh sÃ¡ch groupId tÃ´ng mÃ´n (string)
         * @param {function} onProgressCallback - callback Ä‘á»ƒ cáº­p nháº­t tiáº¿n Ä‘á»™ UI
         * @returns {Promise<Array>}
         */


        /**
         * Kiá»ƒm tra vÃ  hiá»ƒn thá»‹ cáº£nh bÃ¡o ngÆ°á»i chÆ¡i ngoáº¡i tÃ´ng kÃ¨m cÆ¡ cháº¿ chá»‘ng spam (cooldown 3 phÃºt hoáº·c khi Ä‘á»•i danh sÃ¡ch)
         * @param {Array} outerUsers Danh sÃ¡ch user ngoáº¡i tÃ´ng
         * @param {Object|string|number} mine ThÃ´ng tin má» hoáº·c ID má»
         */
        checkAndNotifyOuterEnemies(outerUsers, mine) {
            const outerNotification = localStorage.getItem('khoangmach_outer_notification') === 'true';
            if (!outerNotification || outerUsers.length === 0) return;

            const mineObj = typeof mine === 'object' && mine !== null ? mine : { id: mine, name: 'Má» ' + mine };
            const currentIds = outerUsers.map(u => u.profile_id || u.id).sort().join(',');
            const now = Date.now();
            const cooldown = 3 * 60 * 1000; // 3 phÃºt

            if (currentIds !== this.lastOuterUserIds || (now - this.lastOuterNotificationTime > cooldown)) {
                this.lastOuterUserIds = currentIds;
                this.lastOuterNotificationTime = now;
                showNotification(`CÃ³ <b>${outerUsers.length}</b> ngÆ°á»i chÆ¡i ngoáº¡i tÃ´ng trong má»!`, 'warn');
                this.showOuterEnemyModal(outerUsers, mineObj);
            }
        }

        /**
         * Hiá»ƒn thá»‹ modal cáº£nh bÃ¡o ngoáº¡i tÃ´ng trong má» hiá»‡n táº¡i
         * @param {Array} outerUsers Danh sÃ¡ch user ngoáº¡i tÃ´ng
         * @param {Object|string|number} mine ThÃ´ng tin má» hiá»‡n táº¡i
         */
        async showOuterEnemyModal(outerUsers, mine) {
            const PANEL_ID = 'outerEnemyModal';
            const oldPanel = document.getElementById(PANEL_ID);
            if (oldPanel) oldPanel.remove();

            const mineObj = typeof mine === 'object' && mine !== null ? mine : { id: mine, name: 'Má» ' + mine };
            const accountId = await getAccountId();
            const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

            const usersHtml = (await Promise.all(outerUsers.map(async (u) => {
                const attackToken = u.attack_token || u.att || u.id;
                const avatarUrl = u.avatar || await this.decodeAvatar(u.avatar, accountId);
                const id = u.profile_id || this.getIdfromAvatar(avatarUrl) || u.id;
                const { tongMonName: group = null, role: _role = null } = u.group_role_html ? this.parseGroupRoleHtml(u.group_role_html) : {};
                const groupDisplay = group || 'VÃ´ phÃ¡i';
                const roleDisplay = _role || 'ThÃ nh viÃªn';

                return `
                    <div style="padding: 8px 0; border-bottom: 1px dashed #333; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <a href="/profile/${id}" target="_blank" style="flex-shrink:0;display:block">
                                <img src="${esc(avatarUrl || u.avatar)}" alt="avatar" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #555; cursor:pointer;">
                            </a>
                            <div style="display: flex; flex-direction: column; min-width: 0; flex: 1;">
                                <div style="color: #ff6b6b; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(u.name)} (${id})</div>
                                <div style="font-size: 11px; color: #777; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(groupDisplay)} - ${esc(roleDisplay)}</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;">
                            <div style="display: flex; gap: 5px;">
                                <button class="oe-btn-tuvi" data-uid="${id}" data-attack-token="${attackToken}" style="border:none; background:#039be5; color:white; border-radius:3px; padding:3px 8px; font-size:11px; cursor:pointer; font-weight:bold;">ðŸ‘</button>
                                <button class="oe-btn-attack" data-uid="${id}" data-attack-token="${attackToken}" data-mid="${mineObj.id}" style="border:none; background:#d32f2f; color:white; border-radius:3px; padding:3px 8px; font-size:11px; cursor:pointer; font-weight:bold;">ðŸ‘Š</button>
                            </div>
                            <div id="oe-info-${id}" style="font-size:10px; color:#b0bec5; min-height:14px;"></div>
                        </div>
                    </div>
                `;
            }))).join('');

            const panel = document.createElement('div');
            panel.id = PANEL_ID;
            panel.style.cssText = `
                position: fixed; right: 20px; bottom: 20px;
                width: 400px; max-width: 95vw;
                background: #1a1a1a; color: #e0e0e0;
                border: 1px solid #c62828; border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.7);
                z-index: 999999; font-family: sans-serif;
                display: flex; flex-direction: column;
                overflow: hidden; font-size: 13px;
            `;

            panel.innerHTML = `
                <div style="padding: 10px 12px; background: #c62828; border-bottom: 1px solid #b71c1c;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-weight: bold; font-size: 14px; color: #fff;">
                            âš ï¸ Ngoáº¡i TÃ´ng Trong Má» <span style="background:#b71c1c; border-radius:10px; padding:1px 7px;">${outerUsers.length}</span>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button id="oe-goto" style="background:#fff3e0; color:#e65100; border:none; border-radius:4px; padding:4px 8px; font-size:11px; cursor:pointer; font-weight:bold;">ðŸ” Äáº¿n KM</button>
                            <button id="oe-close" style="background:#333; border:none; color:#fff; width:28px; height:28px; border-radius:4px; cursor:pointer;">âœ•</button>
                        </div>
                    </div>
                    <div style="font-size:11px; color:#ffcdd2; margin-top:3px;">â› ${esc(mineObj.name)}</div>
                </div>
                <div style="padding: 8px 12px; max-height: 55vh; overflow-y: auto; background: #1a1a1a;">
                    ${usersHtml}
                </div>
            `;

            document.body.appendChild(panel);

            panel.querySelector('#oe-goto').onclick = () => { window.location.href = this.khoangMachUrl; };
            panel.querySelector('#oe-close').onclick = () => panel.remove();

            panel.querySelectorAll('.oe-btn-tuvi').forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const uid = btn.getAttribute('data-uid');
                    const resDiv = document.getElementById(`oe-info-${uid}`);
                    btn.disabled = true; btn.textContent = '...';
                    if (resDiv) resDiv.textContent = 'Äang xem...';
                    try {
                        const tierText = await hienTuviKM.getProfileTier(uid);
                        if (resDiv) resDiv.textContent = tierText || 'K.RÃµ';
                    } catch (err) {
                        if (resDiv) resDiv.textContent = 'Lá»—i';
                    } finally {
                        btn.textContent = 'ðŸ‘'; btn.disabled = false;
                    }
                };
            });

            panel.querySelectorAll('.oe-btn-attack').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const attackToken = btn.getAttribute('data-attack-token');
                    const mid = btn.getAttribute('data-mid');
                    btn.textContent = 'âš”';
                    if (typeof khoangmach !== 'undefined' && khoangmach.attackUser) {
                        khoangmach.attackUser(attackToken, mid);
                        setTimeout(() => { btn.textContent = 'âœ”'; }, 500);
                    } else {
                        showNotification('Lá»—i: KhÃ´ng tÃ¬m tháº¥y hÃ m táº¥n cÃ´ng!', 'error');
                    }
                };
            });
        }

        /**
         * Hiá»ƒn thá»‹ káº¿t quáº£ tÃ¬m kiáº¿m vá»›i thÃ´ng tin nguá»“n vÃ  thá»i gian
         * @param {Array} foundUsers Danh sÃ¡ch káº» Ä‘á»‹ch tÃ¬m tháº¥y
         * @param {Number} timestamp Thá»i gian dá»¯ liá»‡u Ä‘Æ°á»£c táº¡o (Date.now())
         * @param {String} source Nguá»“n dá»¯ liá»‡u ('Server' hoáº·c 'QuÃ©t trá»±c tiáº¿p')
         */
        async showEnemySearchResults(foundUsers, timestamp, source = 'N/A') {
            // 1. Kiá»ƒm tra dá»¯ liá»‡u Ä‘áº§u vÃ o
            if (!Array.isArray(foundUsers) || foundUsers.length === 0) {
                showNotification('KhÃ´ng tÃ¬m tháº¥y káº» Ä‘á»‹ch nÃ o phÃ¹ há»£p trong cÃ¡c má».', 'info');
                return;
            }

            // Get account ID
            const accountId = await getAccountId();

            const PANEL_ID = 'enemyDashboard';
            const RESTORE_ID = 'enemyDashboardRestore';

            // 2. XÃ³a panel cÅ©
            const oldPanel = document.getElementById(PANEL_ID);
            if (oldPanel) oldPanel.remove();
            const oldRestore = document.getElementById(RESTORE_ID);
            if (oldRestore) oldRestore.remove();

            // 3. Tiá»‡n Ã­ch
            const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const timeSinceStr = (ts) => {
                if (!ts) return 'Vá»«a xong';
                const seconds = Math.floor((Date.now() - ts) / 1000);
                if (seconds < 60) return `${seconds} giÃ¢y trÆ°á»›c`;
                const minutes = Math.floor(seconds / 60);
                if (minutes < 60) return `${minutes} phÃºt trÆ°á»›c`;
                return 'KhÃ¡ lÃ¢u trÆ°á»›c';
            };

            // 4. Gom nhÃ³m
            const minesMap = foundUsers.reduce((acc, u) => {
                const mId = String(u.mineId || 'unknown');
                if (!acc[mId]) {
                    acc[mId] = {
                        id: mId,
                        name: u.mineName || 'Má» Láº¡',
                        users: [],
                        tongMons: new Set()
                    };
                }
                acc[mId].users.push(u);
                if (u.tongMonName) acc[mId].tongMons.add(u.tongMonName);
                return acc;
            }, {});

            const sortedMines = Object.values(minesMap).sort((a, b) => b.users.length - a.users.length);

            // 5. Táº¡o Panel
            const panel = document.createElement('div');
            panel.id = PANEL_ID;
            panel.className = 'enemy-dashboard';
            panel.style.cssText = `
                position: fixed; right: 20px; bottom: 20px;
                width: 460px; max-width: 95vw;
                background: #1a1a1a; color: #e0e0e0;
                border: 1px solid #444; border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.7);
                z-index: 999999; font-family: sans-serif;
                display: flex; flex-direction: column;
                overflow: hidden; font-size: 13px;
            `;

            const sourceColor = source.includes('Server') ? '#4caf50' : '#ff9800';

            // HTML Structure - Build mines HTML first
            const minesHtml = (await Promise.all(sortedMines.map(async (mine) => {
                const tongList = mine.tongMons.size > 0 ? Array.from(mine.tongMons).join(', ') : 'VÃ´ phÃ¡i';
                const usersHtml = (await Promise.all(mine.users.map(async (u) => {
                    const isAlly = u.dong_mon || u.lien_minh;
                    const attackToken = u.attack_token || u.att || u.id;
                    const avatarUrl = u.avatar || await this.decodeAvatar(u.avatar, accountId);
                    // console.log(`Avatar URL for user ${u.name} (ID: ${u.id}): ${avatarUrl} (avatar: ${u.avatar})`);
                    const id = this.getIdfromAvatar(avatarUrl) || u.id;
                    // console.log(`User: ${u.name}, ID: ${id}, Äá»“ng MÃ´n: ${u.dong_mon}, LiÃªn Minh: ${u.lien_minh}`);
                    const allyLabel = u.dong_mon ? 'â˜¯ï¸ Äá»“ng MÃ´n' : (u.lien_minh ? 'ðŸ¤ LiÃªn Minh' : '');
                    const nameColor = isAlly ? '#4caf50' : '#ff6b6b';
                    return `
                        <div style="padding: 6px 0; border-bottom: 1px dashed #333; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                                <a href="/profile/${id}" target="_blank" style="flex-shrink:0;display:block">
                                    <img src="${avatarUrl || u.a || u.avatar}" alt="avatar" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #555; cursor:pointer;">
                                </a>
                                <div style="display: flex; flex-direction: column; min-width: 0; flex: 1;">
                                    <div style="color: ${nameColor}; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(u.name)} ${allyLabel ? `<span style="font-size: 10px;">${allyLabel}</span>` : ''} (${id})</div>
                                    <div style="font-size: 11px; color: #777; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(u.tongMonName || 'VÃ´ phÃ¡i')} - ${esc(u.role || 'ThÃ nh viÃªn')}</div>
                                </div>
                            </div>
                            
                            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;">
                                ${isAlly ?
                            `<div style="display: flex; gap: 5px;">
                                        <button class="btn-check-tuvi" data-uid="${id}" data-attack-token="${attackToken}" data-ally="${isAlly ? '1' : '0'}" style="border:none; background: #039be5; color: white; border-radius: 3px; padding: 3px 8px; font-size: 11px; cursor: pointer; font-weight: bold;">ðŸ‘</button>
                                        <!-- <button class="btn-attack" data-uid="${id}" data-attack-token="${attackToken}" data-mid="${mine.id}" style="border:none; background: #d32f2f; color: white; border-radius: 3px; padding: 3px 8px; font-size: 11px; cursor: pointer; font-weight: bold;">ðŸ‘Š</button> -->
                                    </div>
                                    <div id="info-res-${id}" style="font-size: 10px; color: #b0bec5; min-height: 14px;"></div>`
                            :
                            `<div style="display: flex; gap: 5px;">
                                        <button class="btn-check-tuvi" data-uid="${id}" data-attack-token="${attackToken}" data-ally="${isAlly ? '1' : '0'}" style="border:none; background: #039be5; color: white; border-radius: 3px; padding: 3px 8px; font-size: 11px; cursor: pointer; font-weight: bold;">ðŸ‘</button>
                                        <button class="btn-attack" data-uid="${id}" data-attack-token="${attackToken}" data-mid="${mine.id}" style="border:none; background: #d32f2f; color: white; border-radius: 3px; padding: 3px 8px; font-size: 11px; cursor: pointer; font-weight: bold;">ðŸ‘Š</button>
                                    </div>
                                    <div id="info-res-${id}" style="font-size: 10px; color: #b0bec5; min-height: 14px;"></div>`
                        }
                            </div>
                        </div>
                    `;
                }))).join('');

                return `
                    <div style="margin-bottom: 8px; border: 1px solid #333; border-radius: 6px; overflow: hidden;">
                        <div class="mine-header" data-target="m-${mine.id}" style="padding: 8px 10px; background: #252525; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                                <div style="flex: 1;">
                                    <div style="font-weight: bold; color: #ffd700;">â› ${esc(mine.name)}</div>
                                    <div style="font-size: 11px; color: #888;">QuÃ¢n sá»‘: ${mine.users.length} | Phe: ${esc(tongList)}</div>
                                </div>
                                <button class="btn-scan-mine" data-target="m-${mine.id}" style="border: 1px solid #555; background: #333; color: #ccc; border-radius: 3px; padding: 2px 6px; font-size: 10px; cursor: pointer;">ðŸ‘ Soi Má»</button>
                                <button id="btn-weak-mine-${mine.id}" class="btn-attack-weak-mine" data-target="m-${mine.id}" style="background: #ef5350; color: #fff; border: none; border-radius: 3px; padding: 2px 6px; font-size: 10px; cursor: pointer; display: none; font-weight: bold;">ðŸ‘Š Äáº¥m Káº» Yáº¿u</button>
                            </div>
                            <span class="arrow" style="font-size: 10px; color: #666; margin-left: 8px;">â–¼</span>
                        </div>
                        
                        <div id="m-${mine.id}" class="mine-content" style="display: none; padding: 5px 10px; background: #151515; border-top: 1px solid #333;">
                            ${usersHtml}
                        </div>
                    </div>
                `;
            }))).join('');

            // HTML Structure
            panel.innerHTML = `
                <div class="ed-header" style="padding: 10px 12px; background: #2d2d2d; border-bottom: 1px solid #3d3d3d;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <div style="font-weight: bold; font-size: 14px; color: #fff;">
                            ðŸŽ¯ TÃ¬m tháº¥y <span style="color: #ff5252;">${foundUsers.length}</span> má»¥c tiÃªu
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button id="btn-scan-all" style="background: #7b1fa2; color: #fff; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; font-weight: bold;">ðŸ‘ Soi tu vi</button>
                            <button id="btn-attack-weak-global" style="background: #c62828; color: #fff; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; font-weight: bold; display: none;">ðŸ‘Š Äáº¥m Káº» Yáº¿u (0)</button>
                            
                            <button id="edMin" style="background:#3d3d3d; border:none; color:#fff; width:28px; height:28px; border-radius:4px; cursor:pointer;">â€”</button>
                            <button id="edClose" style="background:#d32f2f; border:none; color:#fff; width:28px; height:28px; border-radius:4px; cursor:pointer;">âœ•</button>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: #aaa;">
                        Nguá»“n: <span style="font-weight:bold; color: ${sourceColor}">${source}</span> â€¢ ${timeSinceStr(timestamp)}
                    </div>
                </div>

                <div class="ed-body" style="padding: 10px; max-height: 60vh; overflow-y: auto; background: #1a1a1a;">
                    ${minesHtml}
                </div>
            `;

            document.body.appendChild(panel);

            // NÃºt Restore
            const restoreBtn = document.createElement('button');
            restoreBtn.id = RESTORE_ID;
            restoreBtn.textContent = `ðŸŽ¯ (${foundUsers.length})`;
            restoreBtn.style.cssText = `display: none; position: fixed; bottom: 20px; right: 20px; padding: 8px 12px; border-radius: 20px; background: #2196f3; color: white; border: none; box-shadow: 0 5px 15px rgba(0,0,0,0.3); cursor: pointer; z-index: 999999; font-weight: bold;`;
            document.body.appendChild(restoreBtn);

            // Event Handlers cÆ¡ báº£n
            panel.querySelector('#edMin').onclick = () => { panel.style.display = 'none'; restoreBtn.style.display = 'block'; };
            panel.querySelector('#edClose').onclick = () => { panel.remove(); restoreBtn.remove(); };
            restoreBtn.onclick = () => { panel.style.display = 'flex'; restoreBtn.style.display = 'none'; };

            // Accordion Logic
            panel.querySelectorAll('.mine-header').forEach(header => {
                header.onclick = (e) => {
                    if (e.target.tagName === 'BUTTON') return;
                    const targetId = header.getAttribute('data-target');
                    const content = document.getElementById(targetId);
                    const arrow = header.querySelector('.arrow');
                    if (content) {
                        const isOpen = content.style.display === 'block';
                        content.style.display = isOpen ? 'none' : 'block';
                        if (arrow) arrow.textContent = isOpen ? 'â–¼' : 'â–²';
                    }
                };
            });

            // Má»Ÿ má» Ä‘áº§u tiÃªn
            const firstHeader = panel.querySelector('.mine-header');
            if (firstHeader) firstHeader.click();

            // Biáº¿n quáº£n lÃ½ tráº¡ng thÃ¡i nÃºt Global
            const btnWeakGlobal = panel.querySelector('#btn-attack-weak-global');
            let weakCountGlobal = 0;

            // ============================================================
            // âš”ï¸ LOGIC: HELPER HÃ€M Äáº¤M Tá»° Äá»˜NG (DÃ¹ng chung)
            // ============================================================
            const runBatchAttack = async (targets, statusBtn) => {
                if (targets.length === 0) {
                    showNotification('KhÃ´ng cÃ³ má»¥c tiÃªu nÃ o!', 'warning');
                    return;
                }

                if (!confirm(`TÃ¬m tháº¥y ${targets.length} má»¥c tiÃªu "KhÃ´ng tá»‘n lÆ°á»£t".\nBáº¯t Ä‘áº§u Ä‘áº¥m? (Delay 6s/ngÆ°á»i)`)) {
                    return;
                }

                const originalText = statusBtn.textContent;
                statusBtn.disabled = true;

                for (let i = 0; i < targets.length; i++) {
                    const btn = targets[i];

                    // Cáº­p nháº­t tráº¡ng thÃ¡i nÃºt
                    statusBtn.textContent = `â³ ${i + 1}/${targets.length} (Chá» 6s)`;

                    // Thá»±c hiá»‡n Ä‘áº¥m
                    btn.click();

                    // XÃ³a class
                    btn.classList.remove('is-weak-target');
                    btn.style.border = 'none';

                    // Delay 6s (Trá»« ngÆ°á»i cuá»‘i cÃ¹ng)
                    if (i < targets.length - 1) {
                        await new Promise(r => setTimeout(r, 6000));
                    }
                }

                statusBtn.textContent = 'âœ… Xong';
                setTimeout(() => {
                    statusBtn.style.display = 'none'; // áº¨n nÃºt sau khi xong
                    statusBtn.disabled = false;
                    statusBtn.textContent = originalText;
                }, 3000);
                showNotification('ÄÃ£ xá»­ lÃ½ xong danh sÃ¡ch!', 'success');
            };

            // ============================================================
            // âš”ï¸ LOGIC: CHECK TU VI
            // ============================================================
            panel.querySelectorAll('.btn-check-tuvi').forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const uid = btn.getAttribute('data-uid');
                    const resDiv = document.getElementById(`info-res-${uid}`);
                    const attackBtn = btn.parentElement.querySelector('.btn-attack');

                    btn.disabled = true;
                    btn.textContent = '...';
                    resDiv.textContent = 'Äang xem...';

                    try {
                        // const data = await hienTuviKM.getProfileTier(uid);
                        const tierText = await hienTuviKM.getProfileTier(uid);

                        // if (data) {
                        //     const tuViStr = new Intl.NumberFormat('vi-VN').format(data.tuVi || 0);
                        //     let rightSideHtml = '';

                        //     // âš¡ KÃˆO THÆ M: KHÃ”NG Tá»N LÆ¯á»¢T
                        //     if (data.notCountAttack) {
                        //         rightSideHtml = `<span style="color: #ea80fc; font-weight: bold; text-shadow: 0 0 5px rgba(234,128,252,0.5);">âš¡ KhÃ´ng tá»‘n lÆ°á»£t</span>`;

                        //         // ÄÃ¡nh dáº¥u nÃºt táº¥n cÃ´ng
                        //         if (attackBtn) {
                        //             attackBtn.classList.add('is-weak-target');
                        //             attackBtn.style.border = '1px solid #ea80fc';
                        //             attackBtn.style.boxShadow = '0 0 5px #ea80fc';

                        //             // 1. Cáº­p nháº­t nÃºt Global
                        //             weakCountGlobal++;
                        //             btnWeakGlobal.style.display = 'block';
                        //             btnWeakGlobal.textContent = `ðŸ‘Š Äáº¥m Káº» Yáº¿u (${weakCountGlobal})`;

                        //             // 2. Cáº­p nháº­t nÃºt Local (Cá»§a má»)
                        //             const mid = attackBtn.getAttribute('data-mid');
                        //             const btnWeakMine = document.getElementById(`btn-weak-mine-${mid}`);
                        //             if (btnWeakMine) {
                        //                 btnWeakMine.style.display = 'block';
                        //                 // TÄƒng Ä‘áº¿m cho má» (lÆ°u vÃ o attribute data-count)
                        //                 let currentCount = parseInt(btnWeakMine.getAttribute('data-count') || 0) + 1;
                        //                 btnWeakMine.setAttribute('data-count', currentCount);
                        //                 btnWeakMine.textContent = `ðŸ‘Š Äáº¥m Káº» Yáº¿u (${currentCount})`;
                        //             }
                        //         }

                        //     } else {
                        //         // KÃ¨o thÆ°á»ng
                        //         const winRateRaw = data.winRate || '?';
                        //         const winRateDisplay = String(winRateRaw).includes('%') ? winRateRaw : `${winRateRaw}%`;
                        //         let rateNumber = parseInt(String(winRateRaw).replace('%', ''));
                        //         if (isNaN(rateNumber)) rateNumber = -1;

                        //         let rateColor = '#ffffff';
                        //         if (rateNumber === -1) rateColor = '#808080';
                        //         else if (rateNumber < 25) rateColor = '#ff5f5f';
                        //         else if (rateNumber > 75) rateColor = '#00ff00';

                        //         rightSideHtml = `<span style="color: ${rateColor}; font-weight: bold;">${winRateDisplay}</span>`;

                        //         // XÃ³a dáº¥u hiá»‡u náº¿u user soi láº¡i vÃ  tháº¥y khÃ´ng cÃ²n ngon
                        //         if (attackBtn && attackBtn.classList.contains('is-weak-target')) {
                        //             attackBtn.classList.remove('is-weak-target');
                        //             attackBtn.style.border = 'none';
                        //             attackBtn.style.boxShadow = 'none';
                        //         }
                        //     }

                        //     resDiv.innerHTML = `<span style="color: #4fc3f7;">${tuViStr}</span> | ${rightSideHtml}`;
                        // } else 
                        {
                            // resDiv.textContent = 'K.RÃµ';
                            resDiv.textContent = `${tierText ? tierText : 'K.RÃµ'}`;
                            resDiv.style.color = '#ff5252';
                        }
                    } catch (err) {
                        console.error(err);
                        resDiv.textContent = 'Lá»—i';
                    } finally {
                        btn.textContent = 'ðŸ‘';
                        btn.disabled = false;
                        btn.classList.add('checked-done');
                    }
                };
            });

            // ============================================================
            // âš”ï¸ LOGIC: ATTACK (ÄÆ¡n láº»)
            // ============================================================
            panel.querySelectorAll('.btn-attack').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const uid = btn.getAttribute('data-uid');
                    const attackToken = btn.getAttribute('data-attack-token');
                    const mid = btn.getAttribute('data-mid');
                    btn.textContent = 'âš”';

                    if (typeof khoangmach !== 'undefined' && khoangmach.attackUser) {
                        khoangmach.attackUser(attackToken, mid);
                        setTimeout(() => {
                            btn.textContent = 'âœ”';
                            // btn.style.opacity = '0.5';
                        }, 500);
                    } else {
                        showNotification("Lá»—i: KhÃ´ng tÃ¬m tháº¥y hÃ m táº¥n cÃ´ng!", "error");
                    }
                };
            });

            // ============================================================
            // ðŸš€ LOGIC: SOI HÃ€NG LOáº T (Global & Local)
            // ============================================================
            const runBatchScan = async (buttons) => {
                if (!buttons || buttons.length === 0) return;

                // Khi soi má»›i, cáº§n reset cÃ¡c biáº¿n Ä‘áº¿m náº¿u muá»‘n chÃ­nh xÃ¡c tuyá»‡t Ä‘á»‘i, 
                // nhÆ°ng á»Ÿ Ä‘Ã¢y ta cá»© cá»™ng dá»“n cho Ä‘Æ¡n giáº£n hoáº·c user tá»± táº¯t báº­t láº¡i panel.
                showNotification(`Äang soi ${buttons.length} má»¥c tiÃªu...`, 'info');

                for (const btn of buttons) {
                    if (!btn.disabled && !btn.classList.contains('checked-done')) {
                        btn.click();
                        await new Promise(r => setTimeout(r, 500)); // Delay soi 500ms
                    }
                }
                showNotification('ÄÃ£ soi xong.', 'success');
            };

            panel.querySelector('#btn-scan-all').onclick = () => {
                // Reset Ä‘áº¿m toÃ n cá»¥c khi soi láº¡i tá»« Ä‘áº§u (tuá»³ chá»n)
                weakCountGlobal = 0;
                btnWeakGlobal.style.display = 'none';

                const allBtns = panel.querySelectorAll('.btn-check-tuvi');
                runBatchScan(allBtns);
            };

            panel.querySelectorAll('.btn-scan-mine').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const targetId = btn.getAttribute('data-target');
                    const mineContainer = document.getElementById(targetId);

                    // Reset Ä‘áº¿m cá»¥c bá»™ cá»§a má» nÃ y
                    const mid = targetId.replace('m-', '');
                    const btnWeakMine = document.getElementById(`btn-weak-mine-${mid}`);
                    if (btnWeakMine) {
                        btnWeakMine.style.display = 'none';
                        btnWeakMine.setAttribute('data-count', 0);
                    }

                    if (mineContainer && mineContainer.style.display === 'none') mineContainer.style.display = 'block';
                    if (mineContainer) {
                        runBatchScan(mineContainer.querySelectorAll('.btn-check-tuvi'));
                    }
                };
            });

            // ============================================================
            // ðŸ’€ LOGIC: Äáº¤M Káºº Yáº¾U (Xá»­ lÃ½ sá»± kiá»‡n click)
            // ============================================================

            // 1. Sá»± kiá»‡n nÃºt Tá»•ng (Global)
            btnWeakGlobal.onclick = () => {
                const targets = panel.querySelectorAll('.btn-attack.is-weak-target');
                runBatchAttack(targets, btnWeakGlobal);
            };

            // 2. Sá»± kiá»‡n nÃºt Tá»«ng Má» (Local)
            panel.querySelectorAll('.btn-attack-weak-mine').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation(); // KhÃ´ng Ä‘Ã³ng má»Ÿ accordion
                    const targetId = btn.getAttribute('data-target'); // m-xxxx
                    const mineContainer = document.getElementById(targetId);
                    if (mineContainer) {
                        // Chá»‰ tÃ¬m káº» yáº¿u trong má» nÃ y
                        const targets = mineContainer.querySelectorAll('.btn-attack.is-weak-target');
                        runBatchAttack(targets, btn);
                    }
                };
            });
        }

    }


    //==================================
    // RÆ¯Æ NG HOáº T Äá»˜NG NGÃ€Y
    //==================================
    class HoatDongNgay {
        constructor() {
            this.ajaxUrl = weburl + "/wp-content/themes/halimmovies-child/hh3d-ajax.php";
        }

        // ðŸ“¦ Láº¥y rÆ°Æ¡ng (Daily Chest)
        async getDailyChest(stage) {
            if (stage !== "stage1" && stage !== "stage2") {
                console.error("Lá»—i: Stage pháº£i lÃ  'stage1' hoáº·c 'stage2'.");
                return false;
            }

            const bodyData = new URLSearchParams({
                action: hData?.act?.hdnReward || "daily_activity_reward",
                stage: stage,
                security_token: hData?.securityToken || securityToken // thÃªm token vÃ o Ä‘Ã¢y
            });

            console.log(`ðŸ“¦ Äang nháº­n rÆ°Æ¡ng ${stage} vá»›i dá»¯ liá»‡u:`, bodyData.toString());
            try {
                const response = await fetch(this.ajaxUrl, {
                    credentials: "include",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0",
                        "Accept": "*/*",
                        "Accept-Language": "vi,en-US;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: bodyData,
                    method: "POST",
                    mode: "cors"
                });

                const data = await response.json();
                if (data.success || data.data.message === "Äáº¡o há»¯u Ä‘Ã£ nháº­n pháº§n thÆ°á»Ÿng nÃ y rá»“i.") {
                    return true;
                } else {
                    console.error(`Lá»—i khi nháº­n rÆ°Æ¡ng ${stage}:`, JSON.stringify(data));
                    showNotification(`âŒ Lá»—i nháº­n rÆ°Æ¡ng hÃ ng ngÃ y: ${data.data.message || data.message || JSON.stringify(data)}`, "error");
                    return false;
                }
            } catch (error) {
                console.error(`Lá»—i khi láº¥y rÆ°Æ¡ng ${stage}:`, error);
                showNotification(`âŒ Lá»—i khi láº¥y rÆ°Æ¡ng ${stage}: ${error.message || JSON.stringify(error)}`, "error");
                return false;
            }
        }

        // ðŸŽ° Spin vÃ²ng quay phÃºc váº­n
        async spinLottery() {
            const nonce = await getSecurityNonce(weburl + '?t=' + Date.now(), "restNonce");
            //console.log("ðŸ”‘ Nonce spinLottery:", nonce);

            if (!nonce) {
                showNotification("âŒ Lá»—i: KhÃ´ng thá»ƒ láº¥y nonce cho vÃ²ng quay phÃºc váº­n", "error");
                return false;
            }

            const spinURL = weburl + "wp-json/lottery/v1/" + (hData && hData.act ? hData.act.lotterySpin : '815b016f');
            console.log("ðŸŽ° URL vÃ²ng quay phÃºc váº­n:", spinURL);
            let remainingSpins = 4;

            do {
                try {
                    const response = await fetch(spinURL, {
                        credentials: "include",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0",
                            "Accept": "*/*",
                            "Accept-Language": "vi,en-US;q=0.5",
                            "X-Security-Token": hData?.securityToken || securityToken,
                            "X-WP-Nonce": nonce,
                            "Content-Type": "application/json"
                        },
                        method: "POST",
                        mode: "cors"
                    });

                    const data = await response.json();
                    if (data.success) {
                        showNotification(`ðŸŽ‰ VÃ²ng quay phÃºc váº­n: ${data.message}`, "success");
                        remainingSpins = data.user_info.remaining_spins;
                        if (remainingSpins === 0) {
                            return true;
                        }
                    } else if (data.message === "Äáº¡o há»¯u Ä‘Ã£ háº¿t lÆ°á»£t quay hÃ´m nay.") {
                        return true;
                    } else {
                        showNotification(`âŒ Lá»—i khi quay vÃ²ng quay phÃºc váº­n: ${data.message}`, "error");
                        return false;
                    }
                } catch (error) {
                    console.error("Lá»—i khi spin:", error);
                    return false;
                }

                // â³ Chá» 1 giÃ¢y trÃ¡nh spam
                await new Promise(r => setTimeout(r, 1000));
            } while (remainingSpins > 0);
        }

        extractPtTokenFromHtml(html) {
            if (!html) return null;
            const match = html.match(/pt_token\s*[:=]\s*['"]([a-f0-9]{32,})['"]/i) ||
                html.match(/ptToken\s*[:=]\s*['"]([a-f0-9]{32,})['"]/i) ||
                html.match(/"pt-token"\s*:\s*"([a-f0-9]{32,})"/i) ||
                html.match(/pt_token['"]?\s*:\s*['"]([a-f0-9]{32,})['"]/i);
            return match ? match[1] : null;
        }

        async getPtToken() {
            // 1. Check globals
            if (typeof unsafeWindow !== 'undefined') {
                if (unsafeWindow.ptToken) return unsafeWindow.ptToken;
                if (unsafeWindow.pt_token) return unsafeWindow.pt_token;
            }
            if (typeof window !== 'undefined') {
                if (window.ptToken) return window.ptToken;
                if (window.pt_token) return window.pt_token;
            }

            // 2. Check current document body/scripts
            const currentHTML = document.documentElement.outerHTML;
            let token = this.extractPtTokenFromHtml(currentHTML);
            if (token) return token;

            // 3. Fallback: fetch nhiem-vu-hang-ngay page
            try {
                console.log("[HH3D Auto] Fetching /nhiem-vu-hang-ngay to retrieve pt-token...");
                const response = await fetch(weburl + 'nhiem-vu-hang-ngay?t=' + Date.now());
                if (response.ok) {
                    const html = await response.text();
                    token = this.extractPtTokenFromHtml(html);
                    if (token) return token;
                }
            } catch (e) {
                console.error("Lá»—i khi fetch pt-token:", e);
            }
            return null;
        }

        // ðŸ”‘ Láº¥y nonce vÃ  token tá»« trang PhÃ¡p TÆ°á»›ng (logic tá»« ThamKhao.js)
        async getPtConfig() {
            const logPrefix = "[HH3D Kháº¯c Tráº­n VÄƒn]";
            try {
                const response = await fetch(weburl + "/trieu-hoi-phap-tuong?t", {
                    headers: {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                        "sec-fetch-dest": "iframe",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "referer": weburl + "/tu-bao-cac?t" + Math.random().toString(36).substring(2, 8)
                    },
                    credentials: "include"
                });
                const html = await response.text();

                const regex = /PHAP_TUONG_CONFIG\s*=\s*(\{[\s\S]*?\});/;
                const match = html.match(regex);

                if (match && match[1]) {
                    const config = eval("(" + match[1] + ")");
                    console.log(logPrefix, "ðŸ”‘ Nonce:", config.nonce);
                    console.log(logPrefix, "ðŸ”’ Token:", config.token);
                    return config;
                } else {
                    showNotification("âŒ KhÃ´ng tÃ¬m tháº¥y PHAP_TUONG_CONFIG trong HTML", "error");
                    return null;
                }
            } catch (e) {
                console.error("[HH3D Kháº¯c Tráº­n VÄƒn]", e);
                showNotification("âŒ Lá»—i khi táº£i trang PhÃ¡p TÆ°á»›ng Ä‘á»ƒ láº¥y nonce/token", "error");
                return null;
            }
        }

        // âœ¨ Nháº­n lÆ°á»£t Kháº¯c Tráº­n VÄƒn (Daily Turns) - logic tá»« ThamKhao.js
        async claimDailyTurns() {
            const logPrefix = "[HH3D Kháº¯c Tráº­n VÄƒn]";
            const config = await this.getPtConfig();
            if (!config?.nonce || !config?.token) return false;

            try {
                const response = await fetch(weburl + "wp-json/phap-tuong/v1/claim-daily-turns", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": config.nonce,
                        "X-Pt-Token": config.token
                    },
                    referrer: weburl + "/tu-bao-cac?t",
                });

                const data = await response.json();

                // âœ… ThÃ nh cÃ´ng
                if (data.success) {
                    showNotification(`${logPrefix} âœ¨ ${data.message}`, "success");
                    console.log(logPrefix, `ðŸŽ Nháº­n thÃªm ${data.turns_claimed} lÆ°á»£t`);
                    return true;
                }

                // âœ… ÄÃ£ nháº­n rá»“i (coi nhÆ° OK)
                if (data.message && data.message.includes("Äáº¡o há»¯u Ä‘Ã£ nháº­n lÆ°á»£t VIP hÃ´m nay rá»“i")) {
                    showNotification(`${logPrefix} â„¹ï¸ ${data.message}`, "info");
                    return true;
                }

                // âœ… TÃ­nh nÄƒng dÃ nh riÃªng cho VIP (coi nhÆ° OK)
                if (data.message && data.message.includes("TÃ­nh nÄƒng dÃ nh riÃªng cho VIP")) {
                    showNotification(`${logPrefix} ðŸ”’ ${data.message}`, "error");
                    return true;
                }

                // âŒ CÃ¡c lá»—i khÃ¡c
                showNotification(`${logPrefix} â„¹ï¸ ${data.message}`, "error");
                return false;

            } catch (err) {
                console.error(logPrefix, "âŒ Lá»—i khi claim lÆ°á»£t VIP:", err);
                return null;
            }
        }

        // ðŸ† Thá»±c hiá»‡n toÃ n bá»™ hoáº¡t Ä‘á»™ng ngÃ y
        async doHoatDongNgay() {
            if (taskTracker.isTaskDone(accountId, "hoatdongngay")) {
                console.log("Hoáº¡t Ä‘á»™ng ngÃ y hÃ´m nay Ä‘Ã£ hoÃ n thÃ nh, bá» qua...");
                showNotification("âœ… Hoáº¡t Ä‘á»™ng ngÃ y hÃ´m nay Ä‘Ã£ hoÃ n thÃ nh!", "success");
                return;
            }
            console.log("Báº¯t Ä‘áº§u nháº­n rÆ°Æ¡ng hoáº¡t Ä‘á»™ng ngÃ y...");
            await getSecurityToken(weburl + 'nhiem-vu-hang-ngay?t');
            const chest1 = await this.getDailyChest("stage1");
            await new Promise(r => setTimeout(r, 5000)); // Delay 5s giá»¯a 2 rÆ°Æ¡ng
            const chest2 = await this.getDailyChest("stage2");
            const spin = await this.spinLottery();

            if (localStorage.getItem('generalVipMode') === 'true') {
                console.log("[VIP] Äang tá»± Ä‘á»™ng nháº­n lÆ°á»£t Kháº¯c Tráº­n VÄƒn...");
                await this.claimDailyTurns();
            }

            const phaptuong = await khactran.autoActivateSeal();

            if (chest1 && chest2 && spin) {
                taskTracker.markTaskDone(accountId, "hoatdongngay");
                showNotification("âœ… HoÃ n thÃ nh hoáº¡t Ä‘á»™ng ngÃ y + vÃ²ng quay phÃºc váº­n", "success");
            }
            loadHH3DProfile().catch(() => { }); // Cáº­p nháº­t láº¡i thÃ´ng tin sau khi hoÃ n thÃ nh hoáº¡t Ä‘á»™ng ngÃ y
        }
    }

    // ===============================================
    // EVENT ÄUA TOP
    // ===============================================
    // --- Cáº¤U HÃŒNH ---
    const SECRET_API_URL = 'https://script.google.com/macros/s/AKfycbwOuq62VOwVB0RGraqKUvicsXZjsqsziFDwts0jktwQb2vCPSoJ3t98xGr26yNgfIvZ/exec';

    async function doDuaTopTongMon() {
        const duaTopUrl = weburl + 'wp-json/hh3d/v1/action';
        const nonce = await getNonce();
        if (!nonce) return console.error('Lá»—i nonce.');

        // 1. Load Data
        if (!vandap.questionDataCache) {
            await vandap.loadAnswersFromGitHub();
        }
        const securityToken = await getSecurityToken(weburl + 'dua-top-hh3d?t');

        try {
            // 2. Láº¥y cÃ¢u há»i
            const rGet = await fetch(duaTopUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce, 'X-DuaTop-Token': securityToken },
                body: JSON.stringify({ action: 'hh3d_get_question', dua_top_token: securityToken }),
                credentials: 'include'
            });
            const dGet = await rGet.json();

            if (!dGet || dGet.error || !dGet.id) {
                showNotification(dGet.message, 'warn');
                if (dGet.message && dGet.message.includes('ChÆ°a Ä‘áº¿n thá»i gian káº¿ tiáº¿p')) {
                    const nextTimeMatch = dGet.message.match(/(\d{2}) giá» (\d{2}) phÃºt (\d{2}) giÃ¢y/);
                    if (nextTimeMatch) {
                        const hours = parseInt(nextTimeMatch[1], 10);
                        const minutes = parseInt(nextTimeMatch[2], 10);
                        const seconds = parseInt(nextTimeMatch[3], 10);
                        const nextTime = Date.now() + ((hours * 3600) + (minutes * 60) + seconds) * 1000;
                        taskTracker.adjustTaskTime(accountId, 'event', nextTime);
                    }
                }
                return;
            }

            console.log(`[Äua Top] â“ ${dGet.question}`);

            // --- HÃ€M Gá»ŒI SERVER ---
            const callSecretServer = (action, question, answer = null) => {
                console.log(`[Sync] â˜ï¸ Äang gá»­i lá»‡nh ${action}...`);
                fetch(SECRET_API_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: action,
                        question: question,
                        answer: answer
                    })
                }).then(() => console.log(`[Sync] âœ… Lá»‡nh ${action} Ä‘Ã£ gá»­i Ä‘i!`))
                    .catch(e => console.error(`[Sync] âŒ Lá»—i káº¿t ná»‘i server:`, e));
            };

            // --- HÃ€M SUBMIT ---
            const submitAnswer = async (index, isManual = false) => {
                const rSub = await fetch(duaTopUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce, 'X-DuaTop-Token': securityToken },
                    body: JSON.stringify({
                        action: "hh3d_submit_answer",
                        question_id: dGet.id,
                        selected_answer: index,
                        dua_top_token: securityToken
                    }),
                    credentials: 'include'
                });
                const dSub = await rSub.json();

                if (dSub.correct) {
                    showNotification(`[Äua Top] HoÃ n thÃ nh, Ä‘Æ°á»£c ${dSub.points} tu vi`, 'success');
                    taskTracker.adjustTaskTime(accountId, 'event', Date.now() + 6.5 * 60 * 60 * 1000 + 30 * 1000);
                    if (Swal.isVisible()) Swal.close();

                    if (isManual) {
                        const ansText = dGet.options[index];
                        callSecretServer('save', dGet.question, ansText);
                        if (vandap.questionDataCache) vandap.questionDataCache.questions[dGet.question] = ansText;
                    }
                } else {
                    showNotification(`[Äua Top] Sai rá»“i! CÃ¢u há»i: ${dGet.question}. Äang tiáº¿n hÃ nh sá»­a dá»¯ liá»‡u gá»‘c`, 'error');
                    taskTracker.adjustTaskTime(accountId, 'event', Date.now() + 5 * 60 * 1000 + 15 * 1000);

                    if (vandap && vandap.questionDataCache && vandap.questionDataCache.questions) {
                        const normalize = (str) => str ? str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\s]/g, '') : '';
                        const currentQNorm = normalize(dGet.question);
                        const keyToDelete = Object.keys(vandap.questionDataCache.questions).find(k => normalize(k) === currentQNorm);

                        if (keyToDelete) {
                            console.warn(`[Auto] ðŸ—‘ï¸ PhÃ¡t hiá»‡n dá»¯ liá»‡u sai, Ä‘ang xÃ³a: "${keyToDelete}"`);
                            delete vandap.questionDataCache.questions[keyToDelete];
                            callSecretServer('delete', keyToDelete);
                        }
                    }
                }
            };

            // 3. Logic tÃ¬m kiáº¿m
            // Normalize 1: XÃ³a háº¿t kÃ½ tá»± Ä‘áº·c biá»‡t VÃ€ khoáº£ng tráº¯ng (dÃ¹ng Ä‘á»ƒ tÃ¬m key cÃ¢u há»i)
            const normalize = (str) => str ? str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\s]/g, '') : '';

            // Tokenize: Giá»¯ láº¡i khoáº£ng tráº¯ng Ä‘á»ƒ tÃ¡ch tá»« (dÃ¹ng Ä‘á»ƒ so sÃ¡nh Ä‘iá»ƒm trÃ¹ng láº·p Ä‘Ã¡p Ã¡n)
            const tokenize = (str) => str ? str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ').trim().split(/\s+/).filter(x => x) : [];

            const svQuesNorm = normalize(dGet.question);
            let foundAnswerText = null;

            if (vandap.questionDataCache && vandap.questionDataCache.questions) {
                for (const key in vandap.questionDataCache.questions) {
                    if (normalize(key) === svQuesNorm) {
                        foundAnswerText = vandap.questionDataCache.questions[key];
                        break;
                    }
                }
            }

            // 4. Quyáº¿t Ä‘á»‹nh
            if (foundAnswerText) {
                console.log(`[Äua Top] ðŸ’¡ Dá»¯ liá»‡u gá»‘c: "${foundAnswerText}"`);

                // BÆ°á»›c 1: Thá»­ tÃ¬m chÃ­nh xÃ¡c
                let idx = dGet.options.findIndex(opt => normalize(opt) === normalize(foundAnswerText));

                // BÆ°á»›c 2: TÃ¬m theo Ä‘iá»ƒm trÃ¹ng tá»«
                if (idx === -1) {
                    console.warn('[Äua Top] âš ï¸ KhÃ´ng khá»›p chÃ­nh xÃ¡c, tÃ­nh Ä‘iá»ƒm trÃ¹ng tá»«...');
                    let maxScore = -1;
                    let bestIdx = -1;
                    const targetTokens = tokenize(foundAnswerText);

                    dGet.options.forEach((opt, i) => {
                        const optTokens = tokenize(opt);
                        const intersection = optTokens.filter(token => targetTokens.includes(token));
                        const score = intersection.length;
                        if (score > maxScore) {
                            maxScore = score;
                            bestIdx = i;
                        }
                    });

                    if (bestIdx > -1 && maxScore > 0) {
                        idx = bestIdx;
                    }
                }

                if (idx > -1) {
                    await submitAnswer(idx, false);
                } else {
                    console.warn('[Äua Top] ðŸ›‘ CÃ³ Ä‘Ã¡p Ã¡n máº«u nhÆ°ng khÃ´ng khá»›p option.');

                    // --- Sá»¬A Lá»–I HIá»‚N THá»Š Táº I ÄÃ‚Y ---
                    // ÄÆ°a text gá»£i Ã½ vÃ o thÃ nh HTML
                    const buttonsHtml = dGet.options.map((opt, i) =>
                        `<button id="btn-opt-${i}" class="swal2-confirm swal2-styled"
                        style="display:block; width:100%; margin: 5px 0; background-color: #3085d6;">${opt}</button>`
                    ).join('');

                    // Táº¡o Ä‘oáº¡n HTML chá»©a cáº£ Gá»£i Ã½ vÃ  NÃºt
                    const contentHtml = `
                        <div style="margin-bottom: 15px; color: #d33; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            Gá»£i Ã½: ${foundAnswerText}
                        </div>
                        <div>${buttonsHtml}</div>
                    `;

                    await Swal.fire({
                        title: dGet.question,
                        html: contentHtml, // DÃ¹ng duy nháº¥t html
                        showConfirmButton: false, showCancelButton: true, cancelButtonText: 'Bá» qua',
                        didOpen: () => {
                            dGet.options.forEach((_, i) => {
                                const btn = document.getElementById(`btn-opt-${i}`);
                                if (btn) btn.onclick = () => submitAnswer(i, true);
                            });
                        }
                    });
                }

            } else {
                console.warn('[Äua Top] ðŸ›‘ Há»i ngÆ°á»i dÃ¹ng (ChÆ°a cÃ³ dá»¯ liá»‡u)...');

                // --- Sá»¬A Lá»–I HIá»‚N THá»Š Táº I ÄÃ‚Y (TRÆ¯á»œNG Há»¢P KHÃ”NG CÃ“ DATA) ---
                const buttonsHtml = dGet.options.map((opt, idx) =>
                    `<button id="btn-opt-${idx}" class="swal2-confirm swal2-styled"
                    style="display:block; width:100%; margin: 5px 0; background-color: #3085d6;">${opt}</button>`
                ).join('');

                await Swal.fire({
                    title: dGet.question,
                    // KhÃ´ng dÃ¹ng 'text' ná»¯a vÃ¬ tiÃªu Ä‘á» Ä‘Ã£ cÃ³ cÃ¢u há»i rá»“i, hoáº·c náº¿u muá»‘n hiá»‡n láº¡i cÃ¢u há»i thÃ¬ Ä‘Æ°a vÃ o html
                    html: buttonsHtml,
                    showConfirmButton: false, showCancelButton: true, cancelButtonText: 'Bá» qua',
                    didOpen: () => {
                        dGet.options.forEach((_, idx) => {
                            const btn = document.getElementById(`btn-opt-${idx}`);
                            if (btn) btn.onclick = () => submitAnswer(idx, true);
                        });
                    }
                });
            }
        } catch (e) { console.error('[Äua Top] Lá»—i:', e); }
    }


    // ===============================================
    // HÃ€M HIá»‚N THá»Š THÃ”NG BÃO
    //
    /**
        * HÃ€M HIá»‚N THá»Š THÃ”NG BÃO
        * @param {*} message: ná»™i dung thÃ´ng bÃ¡o (há»— trá»£ HTML)
        * @param {*} type: success, warn, error, info
        * @param {*} duration: thá»i gian hiá»ƒn thá»‹ (ms)

            */

    (function initNotificationContainer() {
        const check = setInterval(() => {
            if (document.body) {
                clearInterval(check);
                if (!document.getElementById('hh3d-notification-container')) {
                    const container = document.createElement('div');
                    container.id = 'hh3d-notification-container';
                    document.body.appendChild(container);
                }
            }
        }, 100);
    })();


    // ===============================================
    // LOG BUFFER (dÃ¹ng cho tab Log trong settings)
    // ===============================================
    const HH3D_LOG_BUFFER_MAX = 200;
    window.hh3dLogBuffer = window.hh3dLogBuffer || [];

    function hh3dPushLog(message, type = 'info') {
        const plain = String(message).replace(/<[^>]*>/g, '');
        window.hh3dLogBuffer.push({ time: Date.now(), message: plain, type });
        if (window.hh3dLogBuffer.length > HH3D_LOG_BUFFER_MAX) window.hh3dLogBuffer.shift();
        // Náº¿u tab Log Ä‘ang má»Ÿ thÃ¬ cáº­p nháº­t live
        const logList = document.getElementById('hh3d-log-list');
        if (logList) {
            _hh3dRenderLogLine(logList, window.hh3dLogBuffer[window.hh3dLogBuffer.length - 1], false);
            logList.scrollTop = logList.scrollHeight;
        }
    }

    function _hh3dRenderLogLine(container, entry, prepend = false) {
        const colors = { success: '#4caf50', warn: '#ff9800', error: '#f44336', info: '#63b3ed', debug: '#9ca3af' };
        const timeStr = new Date(entry.time).toLocaleTimeString('vi-VN');
        const div = document.createElement('div');
        div.style.cssText = `padding:3px 6px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:11px;font-family:monospace;color:${colors[entry.type] || '#ccc'};word-break:break-all`;
        div.textContent = `[${timeStr}] ${entry.message}`;
        if (prepend) container.insertBefore(div, container.firstChild);
        else container.appendChild(div);
    }

    // Intercept console.*
    (function () {
        const _orig = { log: console.log, warn: console.warn, error: console.error };
        console.log = function (...args) { _orig.log.apply(console, args); hh3dPushLog(args.join(' '), 'debug'); };
        console.warn = function (...args) { _orig.warn.apply(console, args); hh3dPushLog(args.join(' '), 'warn'); };
        console.error = function (...args) { _orig.error.apply(console, args); hh3dPushLog(args.join(' '), 'error'); };
    })();

    function showNotification(message, type = 'success', duration = 3000) {
        hh3dPushLog(message, type);

        // --- Báº¯t Ä‘áº§u pháº§n chÃ¨n CSS tá»± Ä‘á»™ng ---
        if (!isCssInjected) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
                    #hh3d-notification-container {
                        position: fixed;
                        top: 30px;
                        left: 10px;
                        width: 300px;
                        max-height: 350px;
                        overflow-y: auto;
                        display: none;
                        flex-direction: column;
                        gap: 6px;
                        padding: 10px;
                        background: rgba(26, 27, 46, 0.95);
                        border: 1px solid #33467C;
                        border-radius: 6px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
                        z-index: 999999;
                        pointer-events: auto;
                    }

                    .hh3d-notification-item {
                        padding: 8px 12px;
                        border-radius: 4px;
                        color: white;
                        font-size: 11px;
                        line-height: 1.4;
                        word-break: break-word;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                    }

                    .hh3d-notification-item.success {
                        background-color: rgba(76, 175, 80, 0.85);
                        border-left: 3px solid #4caf50;
                    }
                    .hh3d-notification-item.warn {
                        background-color: rgba(255, 152, 0, 0.85);
                        border-left: 3px solid #ff9800;
                    }
                    .hh3d-notification-item.error {
                        background-color: rgba(195, 16, 4, 0.85);
                        border-left: 3px solid #c31004;
                    }
                    .hh3d-notification-item.info {
                        background-color: rgba(0, 102, 255, 0.85);
                        border-left: 3px solid #0066ff;
                    }

                    @keyframes noti-blink {
                        0% { background-color: #3b82f6; box-shadow: 0 0 2px #3b82f6; }
                        50% { background-color: #ef4444; box-shadow: 0 0 8px #ef4444; }
                        100% { background-color: #3b82f6; box-shadow: 0 0 2px #3b82f6; }
                    }
                    .hh3d-noti-blink {
                        animation: noti-blink 1s infinite;
                    }
                `;
            document.head.appendChild(style);
            isCssInjected = true;
        }
        // --- Káº¿t thÃºc pháº§n chÃ¨n CSS tá»± Ä‘á»™ng ---

        // Log console
        const logPrefix = '[HH3D Notification]';
        if (type === 'success') {
            console.log(`${logPrefix} âœ… SUCCESS: ${message}`);
        } else if (type === 'warn') {
            console.warn(`${logPrefix} âš ï¸ WARN: ${message}`);
        } else if (type === 'info') {
            console.info(`${logPrefix} â„¹ï¸ INFO: ${message}`);
        } else {
            console.error(`${logPrefix} âŒ ERROR: ${message}`);
        }

        // Táº¡o toggle náº¿u chÆ°a tá»“n táº¡i
        let toggle = document.getElementById('hh3d-noti-toggle');
        if (!toggle) {
            toggle = document.createElement('div');
            toggle.id = 'hh3d-noti-toggle';
            toggle.title = 'Lá»‹ch sá»­ thÃ´ng bÃ¡o';
            toggle.style.cssText = 'position:fixed;top:5px;left:5px;width:20px;height:20px;background:#3b82f6;border-radius:50%;z-index:1000001;cursor:pointer;box-shadow:0 0 6px rgba(59,130,246,0.6);display:flex;align-items:center;justify-content:center;font-size:11px;';
            toggle.innerHTML = 'ðŸ””';

            toggle.addEventListener('click', () => {
                const container = document.getElementById('hh3d-notification-container');
                if (container) {
                    const isHidden = container.style.display === 'none' || !container.style.display;
                    container.style.display = isHidden ? 'flex' : 'none';
                    if (isHidden) {
                        toggle.classList.remove('hh3d-noti-blink');
                    }
                }
            });
            document.body.appendChild(toggle);
        }

        // Táº¡o container náº¿u chÆ°a tá»“n táº¡i
        let container = document.getElementById('hh3d-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'hh3d-notification-container';
            document.body.appendChild(container);
        }

        // Nháº¥p nhÃ¡y toggle náº¿u container Ä‘ang Ä‘Ã³ng
        if (container.style.display === 'none' || !container.style.display) {
            toggle.classList.add('hh3d-noti-blink');
        }

        // Táº¡o item thÃ´ng bÃ¡o
        const notification = document.createElement('div');
        notification.className = `hh3d-notification-item ${type}`;

        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const messageHtml = `<span style="color:#9ca3af;font-size:9px;margin-right:6px;">[${timeStr}]</span>` +
            (/<[a-z][\s\S]*>/i.test(message) ? message : `<span>${message}</span>`);

        notification.innerHTML = messageHtml;

        container.appendChild(notification);

        // Giá»›i háº¡n lá»‹ch sá»­ tá»‘i Ä‘a 50 thÃ´ng bÃ¡o
        while (container.children.length > 50) {
            container.removeChild(container.firstChild);
        }

        // Tá»± Ä‘á»™ng cuá»™n xuá»‘ng cuá»‘i
        container.scrollTop = container.scrollHeight;
    };

    // ===============================================
    // Class quáº£n lÃ½ cÃ¡c quy táº¯c CSS
    // ===============================================
    class UIMenuStyles {
        addStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                /* Kiá»ƒu chung cho toÃ n bá»™ menu */
                .custom-script-menu {
                    display: flex !important;
                    flex-direction: column !important;
                    position: absolute;
                    background-color: #242323ff;
                    min-width: 350px !important;
                    z-index: 1001;
                    border-radius: 5px;
                    top: calc(100% + 6px);
                    right: 0;
                    padding: 8px;
                    gap: 6px;
                }

                /* Kiá»ƒu chung cho cÃ¡c nhÃ³m nÃºt */
                .custom-script-menu-group {
                    display: flex;
                    flex-direction: row;
                    gap: 6px;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                }

                /* Kiá»ƒu chung cho táº¥t cáº£ cÃ¡c nÃºt (a, button) */
                .custom-script-menu-button,
                .custom-script-menu-link {
                    color: black;
                    padding: 8px 10px !important;
                    font-size: 13px !important;
                    text-decoration: none;
                    border-radius: 5px;
                    background-color: #f1f1f1;
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                }
                .custom-script-menu.hidden {
                    visibility: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                }

                .custom-script-menu-button:hover,
                .custom-script-menu-link:hover {
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
                    transform: scale(1.03);
                }

                /* NÃºt auto-btn */
                .custom-script-auto-btn {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                .custom-script-auto-btn:hover {
                    background-color: #2980b9;
                }
                .custom-script-auto-btn:disabled {
                    background-color: #7f8c8d;
                    cursor: not-allowed;
                    box-shadow: none;
                }


            /* PhÃºc lá»£i*/

/* PhÃºc Lá»£i */
.custom-script-phuc-loi-group {
    display:flex;
    flex-direction:row;
    gap:6px;
    width:100%;
}

.custom-script-phuc-loi-btn,
.custom-script-phuc-loi-icon-btn {
    border-radius: 5px;
    border: none;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* NÃºt chÃ­nh PhÃºc Lá»£i */
.custom-script-phuc-loi-btn {
    flex-grow:1;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:8px 10px;
    font-size:13px;
    border-radius:5px;
    border:none;
    background-color:#3498db;
    color:white;
}


.custom-script-phuc-loi-btn:hover {
    background-color: #3498db;
}

.custom-script-phuc-loi-btn:disabled {
    background-color: #7f8c8d;
    cursor: not-allowed;
    box-shadow: none;
}

/* NÃºt Bonus (icon) */
.custom-script-phuc-loi-icon-btn {
    width: 30px;
    height: 30px;
    background-color: #555;
    color: white;
    border-radius: 15px;
    margin-top: 5px;
}

.custom-script-phuc-loi-icon-btn:hover {
    background-color: #1f6da1ff;
}








                /* NhÃ³m Dice Roll */
                .custom-script-dice-roll-group {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-grow: 1;
                }
                .custom-script-dice-roll-select {
                    padding: 8px 10px;
                    font-size: 13px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    background-color: #fff;
                    color: black;
                    cursor: pointer;
                    flex-grow: 1;
                }
                .custom-script-dice-roll-btn {
                    background-color: #e74c3c;
                    color: white;
                    font-weight: bold;
                    padding: 8px 10px;
                }
                .custom-script-dice-roll-btn:hover {
                    background-color: #c0392b;
                }
                .custom-script-dice-roll-btn:disabled {
                    background-color: #7f8c8d;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                .custom-script-menu-group-dice-roll {
                    display: flex;
                    flex-direction: row;
                    gap: 6px;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-items: center;
                }

                /* NhÃ³m Hoang Vá»±c */
                .custom-script-hoang-vuc-group {
                    display: flex;
                    flex-direction: row;
                    gap: 6px;
                }
                .custom-script-hoang-vuc-btn,
                .custom-script-hoang-vuc-settings-btn {
                    border-radius: 5px;
                    border: none;
                    font-weight: bold;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .custom-script-hoang-vuc-btn {
                    background-color: #3498db;
                    color: white;
                }
                .custom-script-hoang-vuc-btn:hover {
                    background-color: #3498db;
                }
                .custom-script-hoang-vuc-btn:disabled {
                    background-color: #7f8c8d;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                .custom-script-hoang-vuc-settings-btn {
                    width: 30px;
                    height: 30px;
                    background-color: #555;
                    color: white;
                    border-radius: 15px;
                    margin-top: 5px;

                }
                .custom-script-hoang-vuc-settings-btn:hover {
                    background-color: #1f6da1ff;
                }


    /* BÃ­ cáº£nh*/
    /* Wrapper Ã©p BÃ­ Cáº£nh xuá»‘ng hÃ ng riÃªng */
            .custom-script-menu-group .bicanh-wrapper {
                flex-basis: 100%;
                display: block;
                margin-top: 2px;
            }

            /* Container hÃ ng ngang cho cÃ¡c nÃºt bÃªn trong */
            .bicanh-row {
                display: flex;
                gap: 6px;
                align-items: stretch; /* Ã©p cÃ¡c pháº§n tá»­ cao báº±ng nhau */
            }

            .bicanh-input {
                width: 60px;
                text-align: center;
                box-sizing: border-box;

            }

            .bicanh-socket {
                width: 40px;
                min-width: 0;
                padding: 0;
                margin: 0;
                text-align: center;
                box-sizing: border-box;

            }

        /* KhoÃ¡ng Máº¡ch */
        .custom-script-khoang-mach-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
        }

        .custom-script-khoang-mach-button-row {
            display: flex;
            flex-direction: row;
            gap: 6px;
            width: 100%;
        }

        .custom-script-khoang-mach-button {
            padding: 8px 10px !important;
            font-size: 13px !important;
            text-decoration: none;
            border-radius: 5px;
            background-color: #3498db;
            color: white;
            font-weight: bold;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        .custom-script-khoang-mach-button:disabled {
            background-color: #7f8c8d;
            cursor: not-allowed;
            box-shadow: none;
        }
        .custom-script-settings-panel {
            background-color: #333;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .custom-script-khoang-mach-config-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .custom-script-khoang-mach-config-group label {
            font-size: 13px;
            color: #ccc;
            font-weight: bold;
        }

        .custom-script-khoang-mach-config-group select {
            padding: 8px;
        }

        .custom-script-khoang-mach-config-group.checkbox-group {
            flex-direction: row;
            align-items: center;
            gap: 6px;
        }

        .custom-script-khoang-mach-config-group.checkbox-group input[type="checkbox"] {
            width: 16px;
            height: 16px;
        }
        .custom-script-khoang-mach-config-group.number-input-group {
            flex-direction: row;
            align-items: center;
            gap: 6px;
        }

        .custom-script-hoat-dong-ngay-btn{
            background-color: #0969b8;
            color: #fff;
            font-weight: bold;
        }
        .custom-script-hoat-dong-ngay-btn:hover {
            background-color: #2100df;
        }
        .custom-script-hoat-dong-ngay-btn:disabled {
            background-color: #939797;
            cursor: not-allowed;
            box-shadow: none;
        }


    /* NÃºt Táº·ng Hoa */
        .custom-script-tang-hoa-btn {
            // background-color: #e91e63; /* há»“ng */
            background-color: #CC3078;
            color: #fff;
            font-weight: bold;
        }
        .custom-script-tang-hoa-btn:hover {
            background-color: #c2185b; /* há»“ng Ä‘áº­m khi hover */
        }
        .custom-script-tang-hoa-btn:disabled {
            background-color: #7f8c8d;
            cursor: not-allowed;
            box-shadow: none;
        }

        /* Dropdown sá»‘ ngÆ°á»i Táº·ng Hoa */
        .custom-script-tang-hoa-select {
            color: #000;
            //border: 1px solid #d81b60;
            border-radius: 5px;
            padding: 6px 10px;
            //font-weight: bold;
            cursor: pointer;
        }

    /* NÃºt Mua RÆ°Æ¡ng Linh Báº£o */
        .custom-script-mua-ruong-btn {
            background-color: #009688; /* xanh ngá»c */
            color: #fff;
            font-weight: bold;
        }
        .custom-script-mua-ruong-btn:hover {
            background-color: #00796b; /* xanh ngá»c Ä‘áº­m khi hover */
        }
        .custom-script-mua-ruong-btn:disabled {
            background-color: #7f8c8d; /* xÃ¡m khi disable */
            cursor: not-allowed;
            box-shadow: none;
        }

        /* Dropdown sá»‘ lÆ°á»£ng Mua RÆ°Æ¡ng */
        .custom-script-mua-ruong-select {
            color: black;
            //border: 1px solid #009688; /* viá»n xanh ngá»c */
            border-radius: 5px;
            padding: 6px 10px;
            //font-weight: bold;
            cursor: pointer;
        }

        .custom-script-mua-ruong-select:hover {
        // color: #004d40;            /* chá»¯ xanh Ä‘áº­m hÆ¡n khi hover */
            color: #000;
        }


    /* NÃºt KHáº®C TRáº¬N VÄ‚N*/
        .custom-script-khac-tran-van-btn {
            background-color: #7B68EE;
            color: #fff;
            font-weight: bold;
        }
        .custom-script-khac-tran-van-btn:hover {
            background-color: #6A5ACD;}

        .custom-script-khac-tran-van-btn:disabled {
            background-color: #7f8c8d; /* xÃ¡m khi disable */
            cursor: not-allowed;
            box-shadow: none;
        }

    /* NÃºt KHáº®C TRáº¬N VÄ‚N lÆ°á»£t nháº­n vip*/
        .custom-script-khac-tran-van-vip-btn {
            // background-color: #FF8C00;
            background-color: #7B68EE;
            color: #fff;
            font-weight: bold;
        }
        .custom-script-khac-tran-van-vip-btn:hover {
            background-color: #6A5ACD;}

        .custom-script-khac-tran-van-vip-btn:disabled {
            background-color: #7f8c8d; /* xÃ¡m khi disable */
            cursor: not-allowed;
            box-shadow: none;
        }

    /* NÃºt Cáº§u Nguyá»‡n tiÃªn duyÃªn*/
        .custom-script-cau-nguyen-btn {
            // background-color: #FF8C00;
            background-color:  #CC3078;
            color: #fff;
            font-weight: bold;
        }
        .custom-script-cau-nguyen-btn:hover {
            background-color: #c2185b;}

        .custom-script-cau-nguyen-btn:disabled {
            background-color: #7f8c8d; /* xÃ¡m khi disable */
            cursor: not-allowed;
            box-shadow: none;
        }
        // .custom-script-cau-nguyen-btn.outline-state {
        // background-color: #7f8c8d; /* ná»n trong suá»‘t */
        // border: 1px solid #666;        /* viá»n mÃ u xÃ¡m hoáº·c mÃ u báº¡n chá»n */
        // opacity: 0.8;                  /* hÆ¡i má» Ä‘á»ƒ phÃ¢n biá»‡t */
        // }



    /*Mua Äan*/
    /* Container chÃ­nh */
        .custom-script-mua-dan-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
        }

        /* HÃ ng chÃ­nh: Mua Äan + gear */
        .custom-script-mua-dan-button-row {
            display: flex;
            flex-direction: row;
            gap: 6px;
            width: 100%;
        }

        /* NÃºt chÃ­nh Mua Äan */
        .custom-script-mua-dan-button {
            padding: 8px 10px;
            font-size: 13px;
            border-radius: 5px;
            background-color: #0a3d66ff;
            color: #fff;
            font-weight: bold;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .custom-script-mua-dan-button:disabled {
            background-color: #7f8c8d;
            cursor: not-allowed;
        }

        /* NÃºt gear âš™ï¸ giá»‘ng KhoÃ¡ng Máº¡ch */
        .custom-script-mua-dan-settings-btn {
            width: 30px;
            height: 30px;
            background-color: #555;
            color: #fff;
            border-radius: 15px;
            margin-top: 5px;
            border: none;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .custom-script-mua-dan-settings-btn:hover {
            background-color: #1f6da1ff;
        }

        /* Panel xá»• xuá»‘ng */
        .custom-script-mua-dan-settings-panel {
            background-color: #444;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        /* HÃ ng trong panel */
        .custom-script-mua-dan-config-row {
            display: flex;
            align-items: center;
            gap: 5px; /* khoáº£ng cÃ¡ch giá»¯a dropdown + button*/
            //margin-bottom: 10px; //khoáº£ng cÃ¡ch giá»¯a 2 dÃ²ng trong menu
        }

        .custom-script-mua-dan-config-row:last-child {
            margin-bottom: 0; /* bá» margin á»Ÿ hÃ ng cuá»‘i */
        }

        /* Dropdown */
        .custom-script-mua-dan-config-row select {
            padding: 4px 8px;       /* giáº£m padding cho gá»n */
            font-size: 13px;
            background-color: #fff;
            color: #000;
            border: 1px solid #ccc;
            border-radius: 4px;
            line-height: 1.4;
            box-sizing: border-box;
            height: 30px;
            width: auto;            /* co theo ná»™i dung */
            white-space: nowrap;    /* khÃ´ng cho chá»¯ xuá»‘ng hÃ ng */
        }
        /* NÃºt hÃ nh Ä‘á»™ng */
        .custom-script-mua-dan-action-btn {
            height: 30px;
            padding: 4px 10px;      /* giáº£m padding cho gá»n */
            font-size: 13px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1.4;
            width: auto;            /* co theo ná»™i dung */
            white-space: nowrap;    /* khÃ´ng cho chá»¯ xuá»‘ng hÃ ng */
        }

        /* MÃ u riÃªng tá»«ng nÃºt */
        .custom-script-mua-dan-tong-btn {
            background-color: #f1c40f; /* xanh ngá»c */
            color: #000;
        }
        .custom-script-mua-dan-tubao-btn {
            background-color: #f1c40f; /* vÃ ng */
            color: #000;
        }

        .custom-script-mua-dan-action-btn:disabled {
            background-color: #7f8c8d; /* mÃ u xÃ¡m */
            color: #ccc;
            cursor: not-allowed;
        }

        #checkbox-tubao {
            width:18px;          /* tÄƒng kÃ­ch thÆ°á»›c */
            height: 18px;
            accent-color: #068202ff;
            cursor: pointer;
            margin-left: 2px;
        }

        #checkbox-tubao:hover {
            outline: 2px solid #f1c40f; /* viá»n vÃ ng khi hover */
            border-radius: 4px;
        }


    /* Hiá»‡u á»©ng cho nÃºt tÃ¬m kiáº¿m */
                @keyframes searchIconToggle {
                    0%, 49.9% {
                        content: 'ðŸ”';
                    }
                    50%, 100% {
                        content: 'ðŸ”Ž';
                    }
                }

                .custom-script-hoang-vuc-settings-btn.searching {
                    animation: searchIconToggle 1s infinite;
                }

                .custom-script-status-icon {
                    width: 10px;
                    height: 10px;
                    margin-top: 0px;
                    margin-right: 0px;
                }

                .custom-script-item-wrapper {
                    position: relative; /* Quan trá»ng: Äáº·t vá»‹ trÃ­ tÆ°Æ¡ng Ä‘á»‘i Ä‘á»ƒ Ä‘á»‹nh vá»‹ icon */
                }

                /* Biá»ƒu tÆ°á»£ng tráº¡ng thÃ¡i Autorun */
                .custom-script-status-icon {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 10px;
                    height: 10px;
                    background-color: transparent;
                    border-radius: 50%;
                    border: none;
                    z-index: 10;
                }

                /* Khi autorun Ä‘ang cháº¡y */
                .custom-script-status-icon.running {
                    background-color: #e74c3c; /* MÃ u Ä‘á» */
                    animation: pulse 1.5s infinite; /* Hiá»‡u á»©ng nháº¥p nhÃ¡y */
                }

                /* Hiá»‡u á»©ng nháº¥p nhÃ¡y */
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                /* CSS cho container chá»©a nhiá»u thÃ´ng bÃ¡o */
                .custom-script-status-bar {
                    position: relative;
                    bottom: 0px;           /* âœ… bÃ¡m Ä‘Ã¡y parent thay vÃ¬ top */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100%;
                    max-width: 250px;
                    padding: 5px;
                    display: flex;
                    flex-direction: column; /* thÃ´ng bÃ¡o má»›i náº±m trÃªn */
                    gap: 5px;
                    z-index: 1000;
                }

                /* CSS cho tá»«ng thÃ´ng bÃ¡o riÃªng láº» */
                .custom-script-message {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 500;
                    color: #fff;
                    white-space: nowrap;
                    text-align: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    opacity: 0;
                    animation: fadeIn 0.3s forwards;
                    transition: opacity 0.3s ease-in-out;
                }

                /* CÃ¡c loáº¡i thÃ´ng bÃ¡o */
                .custom-script-message.info {
                    background-color: #3498db;
                }

                .custom-script-message.success {
                    background-color: #2ecc71;
                }


                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
    }

                /* Xu Info Styles - Compact Version */
                #xu-info.xu-info-container {
                    display: block !important;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(245, 197, 66, 0.2);
                    border-radius: 8px;
                    padding: 8px 10px !important;
                    margin-bottom: 8px;
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    box-sizing: border-box;
                    font-size: 12px;
                }

                #xu-info.xu-info-container:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #22d3a0, #10b981, #0ea5e9);
                }

                .xu-display {
                    display: flex !important;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                    font-size: 11px;
                    color: #d0d8f0;
                }

                .xu-display .xu-left {
                    flex-shrink: 0;
                    padding: 4px 10px;
                    border: 1px solid rgba(122, 162, 247, 0.25);
                    border-radius: 8px;
                    background: linear-gradient(135deg, rgba(26, 27, 46, 0.6), rgba(40, 42, 68, 0.4));
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04);
                }

                .xu-display .xu-right {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .xu-display strong {
                    color: #f5c542;
                    font-weight: 700;
                    font-size: 12px;
                }

                .autorun-main-btn {
                    display: inline-block !important;
                    width: auto;
                    min-width: 100px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    color: #fff;
                    padding: 4px 12px !important;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 10px;
                    font-weight: 600;
                    transition: all 0.2s;
                    text-align: center;
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                .autorun-main-btn:hover {
                    background: linear-gradient(135deg, #764ba2, #667eea);
                    border-color: #667eea;
                    box-shadow: 0 0 12px rgba(102, 126, 234, 0.5);
                    transform: translateY(-1px);
                }

                .autorun-main-btn.running {
                    background: linear-gradient(135deg, #f44336, #e91e63);
                    border-color: rgba(244, 67, 54, 0.3);
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 8px rgba(244, 67, 54, 0.4); }
                    50% { box-shadow: 0 0 16px rgba(244, 67, 54, 0.8); }
                }

                .xu-display .autorun-indicator-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    transition: all 0.3s;
                }

                .xu-display .autorun-indicator-dot.enabled {
                    background: #22d3a0;
                    box-shadow: 0 0 6px rgba(34, 211, 160, 0.6);
                }

                .xu-display .autorun-indicator-dot.disabled {
                    background: #e74c3c;
                    box-shadow: 0 0 6px rgba(231, 76, 60, 0.6);
                }

                .xu-display .autorun-icon {
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    user-select: none;
                }

                .xu-display .autorun-icon:hover {
                    transform: scale(1.2);
                    filter: drop-shadow(0 0 4px rgba(245, 197, 66, 0.8));
                }
                .xu-display .autorun-icon.enabled {
                    color: #22d3a0;
                }
                .xu-display .autorun-icon.disabled {
                    color: #e74c3c;
                }

                .xu-display #profile-refresh-btn {
                    padding: 3px 6px;
                    font-size: 11px;
                    border-radius: 4px;
                    background: rgba(76, 175, 80, 0.8);
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .xu-display #profile-refresh-btn:hover {
                    background: #4caf50;
                    transform: scale(1.05);
                }

                .xu-display #profile-refresh-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .promo-form {
                    display: flex !important;
                    gap: 6px;
                    align-items: center;
                    margin-top: 8px;
                }

                .promo-form input {
                    flex: 1;
                    padding: 4px 8px;
                    font-size: 11px;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                    outline: none;
                    transition: all 0.2s;
                }

                .promo-form input:focus {
                    border-color: #f5c542;
                    background: rgba(255, 255, 255, 0.08);
                }

                .promo-form button {
                    padding: 4px 10px;
                    font-size: 11px;
                    border-radius: 4px;
                    background: linear-gradient(135deg, #f5c542, #fb923c);
                    color: #000;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    white-space: nowrap;
                    transition: all 0.2s;
                }

                .promo-form button.settings-btn {
                    padding: 4px 10px;
                    font-size: 11px;
                    border-radius: 4px;
                    background: linear-gradient(135deg, #333a47, #658586);
                    color: #000;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    white-space: nowrap;
                    transition: all 0.2s;
                }

                .promo-form button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 12px rgba(245, 197, 66, 0.4);
                }

                .promo-form button.settings-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 12px rgba(245, 197, 66, 0.4);
                }

                /* Progress Overview Styles */
                #reward-progress-wrap {
                    font-size: 12px;
                }

                #reward-progress-wrap .nv-overview {
                    display: block !important;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(245, 197, 66, 0.2);
                    border-radius: 8px;
                    padding: 10px 12px !important;
                    margin-bottom: 8px;
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    box-sizing: border-box;
                }

                #reward-progress-wrap .nv-overview:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #f5c542, #fb923c, #f472b6);
                }

                #reward-progress-wrap .nv-ov-header {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 6px;
                    width: 100%;
                    gap: 0 !important;
                }

                #reward-progress-wrap .nv-ov-header h3 {
                    margin: 0 !important;
                    font-size: 13px;
                    font-weight: 700;
                    color: #e0e6f0;
                    flex: 1;
                }

                #reward-progress-wrap .nv-ov-header .percent {
                    font-size: 13px;
                    font-weight: 800;
                    color: #f5c542;
                    flex-shrink: 0;
                }

                #reward-progress-wrap .nv-ov-header .percent.full {
                    color: #22d3a0;
                }

                #reward-progress-wrap .nv-progress-bar {
                    display: block !important;
                    width: 100% !important;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 6px;
                }

                #reward-progress-wrap .nv-progress-fill {
                    display: block !important;
                    height: 100%;
                    background: linear-gradient(90deg, #f5c542, #fb923c);
                    border-radius: 10px;
                    transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 0 8px rgba(245, 197, 66, 0.5);
                }

                #reward-progress-wrap .nv-progress-fill.full {
                    background: linear-gradient(90deg, #22d3a0, #10b981);
                    box-shadow: 0 0 8px rgba(34, 211, 160, 0.6);
                }

                #reward-progress-wrap .nv-ov-summary {
                    display: block !important;
                    margin: 0 0 6px !important;
                    font-size: 11px;
                    color: #9ca3af;
                    width: 100%;
                }

                #reward-progress-wrap .nv-chips {
                    display: flex !important;
                    flex-direction: row !important;
                    flex-wrap: wrap;
                    gap: 4px;
                    width: 100%;
                    margin-bottom: 4px;
                }

                #reward-progress-wrap .nv-chip {
                    display: inline-block !important;
                    font-size: 10px;
                    padding: 2px 6px !important;
                    border-radius: 10px;
                    font-weight: 600;
                    white-space: nowrap;
                    flex-grow: 0 !important;
                }

                #reward-progress-wrap .nv-chip.chip-done {
                    background: rgba(34, 211, 160, 0.12);
                    color: #22d3a0;
                    border: 1px solid rgba(34, 211, 160, 0.2);
                }

                #reward-progress-wrap .nv-chip.chip-pend {
                    background: rgba(90, 99, 122, 0.12);
                    color: #6b7280;
                    border: 1px solid rgba(90, 99, 122, 0.15);
                }

                #reward-progress-wrap .progress-toggle-btn {
                    display: block !important;
                    width: 100%;
                    background: rgba(245, 197, 66, 0.1);
                    border: 1px solid rgba(245, 197, 66, 0.3);
                    color: #f5c542;
                    padding: 4px 8px !important;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 10px;
                    font-weight: 600;
                    transition: all 0.2s;
                    margin-top: 4px;
                    text-align: center;
                }

                #reward-progress-wrap .progress-toggle-btn:hover {
                    background: rgba(245, 197, 66, 0.2);
                    border-color: #f5c542;
                }

                #reward-progress-wrap .nv-quest-details {
                    display: none !important;
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    width: 100%;
                }

                #reward-progress-wrap .nv-quest-details.show {
                    display: block !important;
                }

                #reward-progress-wrap .nv-quest-item {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 8px !important;
                    margin-bottom: 4px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                    font-size: 11px;
                    width: 100%;
                    box-sizing: border-box;
                }

                #reward-progress-wrap .nv-quest-item.done {
                    background: rgba(34, 211, 160, 0.12);
                    color: #22d3a0;
                    border: 1px solid rgba(34, 211, 160, 0.2);
                }

                #reward-progress-wrap .nv-quest-icon {
                    font-size: 16px;
                    width: 20px;
                    text-align: center;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #reward-progress-wrap .nv-quest-icon i {
                    font-size: 14px;
                }

                #reward-progress-wrap .nv-quest-name {
                    flex: 1;
                    color: #d0d8f0;
                }

                #reward-progress-wrap .nv-quest-status {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-weight: 600;
                    flex-shrink: 0;
                    white-space: nowrap;
                }

                #reward-progress-wrap .nv-quest-status.done {
                    background: rgba(34, 211, 160, 0.15);
                    color: #22d3a0;
                }

                #reward-progress-wrap .nv-quest-status.pending {
                    background: rgba(90, 99, 122, 0.15);
                    color: #9ca3af;
                }

                /* Footer Copyright */
                .custom-script-footer {
                    text-align: center;
                    padding: 8px 10px;
                    margin-top: 6px;
                    font-size: 11px;
                    color: #888;
                    border-top: 1px solid #444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }

                .custom-script-footer-heart {
                    color: #e74c3c;
                    font-size: 13px;
                    animation: heartbeat 1.5s ease-in-out infinite;
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    10%, 30% { transform: scale(1.1); }
                    20%, 40% { transform: scale(1); }
                }

                .custom-script-footer-guild {
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: bold;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    filter: drop-shadow(0 0 8px rgba(243, 156, 18, 0.6));
                    animation: guildGlow 2s ease-in-out infinite;
                }

                @keyframes guildGlow {
                    0%, 100% { filter: drop-shadow(0 0 8px rgba(243, 156, 18, 0.6)); }
                    50% { filter: drop-shadow(0 0 12px rgba(243, 156, 18, 0.9)); }
                }

                .custom-script-footer-text {
                    color: #aaa;
                }

                .custom-script-footer-name {
                    color: #3498db;
                    font-weight: bold;
                    font-size: 12px;
                }

                /* ===== Quest Controls Styles ===== */
                .quest-controls {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    flex-wrap: nowrap;
                }

                .quest-action-btn,
                .quest-extra-btn {
                    padding: 4px 8px;
                    font-size: 11px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .quest-action-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-width: 70px;
                }

                .quest-action-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                }

                .quest-action-btn:disabled {
                    background: #555;
                    cursor: not-allowed;
                    opacity: 0.6;
                    color: #22d3a0;
                }

                .quest-extra-btn {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    min-width: 32px;
                }

                .quest-extra-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(245, 87, 108, 0.4);
                }

                .quest-select {
                    padding: 3px 6px;
                    font-size: 10px;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: #d0d8f0;
                    cursor: pointer;
                    max-width: 80px;
                }

                .quest-select:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .quest-input {
                    padding: 3px 6px;
                    font-size: 10px;
                    border-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: #d0d8f0;
                    width: 45px;
                    text-align: center;
                }

                .quest-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .quest-toggle {
                    padding: 4px 8px;
                    font-size: 14px;
                    border-radius: 4px;
                    border: none;
                    background: rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .quest-toggle:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: scale(1.1);
                }

                .quest-settings-btn {
                    padding: 4px 8px;
                    font-size: 12px;
                    border-radius: 4px;
                    border: none;
                    background: rgba(255, 255, 255, 0.05);
                    color: #9ca3af;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .quest-settings-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #d0d8f0;
                    transform: rotate(45deg);
                }

                /* Quest Autorun Indicator Dot */
                .quest-autorun-indicator {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    z-index: 10;
                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
                    transition: all 0.3s ease;
                }

                .quest-autorun-indicator.enabled {
                    background: #22d3a0;
                    box-shadow: 0 0 6px rgba(34, 211, 160, 0.6);
                }

                .quest-autorun-indicator.disabled {
                    background: #e74c3c;
                    box-shadow: 0 0 6px rgba(231, 76, 60, 0.6);
                }

                /* Quest item vá»›i indicator - cáº§n relative position */
                .nv-quest-item {
                    position: relative;
                }

                /* Next run time - ná»•i á»Ÿ bottom-right cá»§a nhiá»‡m vá»¥ */
                .quest-next-time {
                    display: none;
                    position: absolute;
                    bottom: -1px;
                    left: 30%;
                    transform: translateX(-50%);
                    font-size: 9px;
                    color: #7aa2f7;
                    background: transparent;
                    padding: 1px 5px;
                    border-radius: 4px 4px 0 0;
                    opacity: 0.9;
                    pointer-events: none;
                    white-space: nowrap;
                    z-index: 5;
                }
                .quest-next-time.active {
                    display: block;
                }

                .quest-next-time[data-task="restart"] {
                    position: static !important;
                    bottom: auto !important;
                    left: auto !important;
                    transform: none !important;
                    display: none;
                }
                .quest-next-time[data-task="restart"].active {
                    display: inline !important;
                }

                /* Hover effect cho icon khi cÃ³ thá»ƒ toggle */
                .nv-quest-icon[data-task] {
                    transition: all 0.2s ease;
                }

                .nv-quest-icon[data-task]:hover {
                    transform: scale(1.15);
                    filter: brightness(1.2);
                }

                /* Responsive adjustments */
                @media (max-width: 400px) {
                    .quest-controls {
                        flex-wrap: wrap;
                    }
                    .quest-action-btn {
                        min-width: 60px;
                        font-size: 10px;
                    }
                }
                
                /* =============================================== */
                /* UNIFIED SETTINGS MODAL STYLES */
                /* =============================================== */
                .settings-modal {
                    display: none;
                    position: fixed;
                    z-index: 999999;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .settings-modal-content {
                    background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
                    border-radius: 10px;
                    width: 92%;
                    max-width: 520px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    animation: slideIn 0.2s ease;
                }
                
                .settings-modal-header {
                    padding: 10px 14px;
                    border-bottom: 1px solid #3a3a4e;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .settings-modal-header h2 {
                    margin: 0;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 600;
                }
                
                .settings-close-btn {
                    background: transparent;
                    border: none;
                    color: #888;
                    font-size: 22px;
                    cursor: pointer;
                    transition: color 0.2s;
                    line-height: 1;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                }
                
                .settings-close-btn:hover {
                    color: #ff5555;
                }
                
                .settings-tabs-container {
                    display: flex;
                    gap: 4px;
                    padding: 7px 10px;
                    background: #16161e;
                    overflow-x: auto;
                    border-bottom: 1px solid #3a3a4e;
                    scrollbar-width: thin;
                    scrollbar-color: #4a4a6e #16161e;
                }
                
                .settings-tabs-container::-webkit-scrollbar {
                    height: 4px;
                }
                
                .settings-tabs-container::-webkit-scrollbar-track {
                    background: #16161e;
                }
                
                .settings-tabs-container::-webkit-scrollbar-thumb {
                    background: #4a4a6e;
                    border-radius: 3px;
                }
                
                .settings-tabs-container::-webkit-scrollbar-thumb:hover {
                    background: #5a5a7e;
                }
                
                .settings-tab {
                    padding: 5px 10px;
                    background: #2a2a3e;
                    border: none;
                    border-radius: 5px;
                    color: #aaa;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.15s;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .settings-tab:hover {
                    background: #3a3a4e;
                    color: #fff;
                }
                
                .settings-tab.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                    box-shadow: 0 1px 6px rgba(102, 126, 234, 0.4);
                }
                
                .settings-content-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px 12px;
                    scrollbar-width: thin;
                    scrollbar-color: #4a4a6e #1e1e2e;
                }
                
                .settings-content-container::-webkit-scrollbar {
                    width: 5px;
                }
                
                .settings-content-container::-webkit-scrollbar-track {
                    background: #1e1e2e;
                }
                
                .settings-content-container::-webkit-scrollbar-thumb {
                    background: #4a4a6e;
                    border-radius: 4px;
                }
                
                .settings-content-container::-webkit-scrollbar-thumb:hover {
                    background: #5a5a7e;
                }
                
                .settings-section {
                    animation: fadeInUp 0.2s ease;
                }
                
                .settings-section h3 {
                    color: #ccc;
                    margin: 0 0 8px 0;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .settings-option {
                    margin-bottom: 6px;
                    padding: 7px 10px;
                    background: rgba(255, 255, 255, 0.04);
                    border-radius: 6px;
                    transition: background 0.15s;
                }
                
                .settings-option:hover {
                    background: rgba(255, 255, 255, 0.07);
                }
                
                .settings-option label {
                    display: block;
                    color: #ccc;
                    margin-bottom: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .settings-checkbox-label {
                    display: flex !important;
                    align-items: center;
                    cursor: pointer;
                    user-select: none;
                    margin-bottom: 0 !important;
                }
                
                .settings-checkbox-label input[type="checkbox"] {
                    margin-right: 7px;
                    width: 14px;
                    height: 14px;
                    cursor: pointer;
                    accent-color: #667eea;
                    flex-shrink: 0;
                }
                
                .settings-checkbox-label span {
                    font-size: 13px;
                    color: #ddd;
                }
                
                .settings-description {
                    margin: 3px 0 0 0;
                    font-size: 11px;
                    color: #777;
                }
                
                .settings-input,
                .settings-select {
                    width: 100%;
                    padding: 5px 8px;
                    background: #16161e;
                    border: 1px solid #3a3a4e;
                    border-radius: 5px;
                    color: #fff;
                    font-size: 12px;
                    transition: border-color 0.2s;
                    margin-top: 3px;
                }
                
                .settings-input-number {
                    padding: 5px 8px;
                    background: #16161e;
                    border: 1px solid #3a3a4e;
                    border-radius: 5px;
                    color: #fff;
                    font-size: 12px;
                }

                .settings-input:focus,
                .settings-select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
                }
                
                .settings-modal-footer {
                    padding: 8px 12px;
                    border-top: 1px solid #3a3a4e;
                    display: flex;
                    justify-content: flex-end;
                }
                
                .settings-save-btn {
                    padding: 7px 18px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                
                .settings-save-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
                }
                
                .settings-save-btn:active {
                    transform: translateY(0);
                }

                .general-link-btn {
                    padding: 4px 8px;
                    font-size: 11px;
                    border-radius: 4px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06);
                    color: #d0d8f0;
                    cursor: pointer;
                    transition: background 0.15s;
                    white-space: nowrap;
                }
                .general-link-btn:hover {
                    background: rgba(102,126,234,0.25);
                    border-color: #667eea;
                    color: #fff;
                }

                /* Search task item */
                .nv-quest-item.km-search-item {
                    flex-wrap: wrap;
                    align-items: center;
                }
                .km-search-item .nv-quest-name,
                .km-search-item .nv-quest-icon,
                .km-search-item .quest-controls {
                    flex-shrink: 0;
                }
                .km-search-item .nv-quest-name {
                    flex: 1;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `;

            document.head.appendChild(style);
        }
    }

    // ===============================================
    // Class khá»Ÿi táº¡o vÃ  chÃ¨n menu vÃ o DOM
    // ===============================================
    class UIInitializer {
        constructor(selector, linkGroups, accountId) {
            this.selector = selector;
            this.linkGroups = linkGroups;
            this.accountId = accountId;

            this.retryInterval = 500;
            this.timeout = 15000;
            this.elapsedTime = 0;
            this.intervalId = null;
        }

        start() {
            console.log("[HH3D Script] â³ Äang tÃ¬m kiáº¿m vá»‹ trÃ­ Ä‘á»ƒ chÃ¨n menu...");
            this.intervalId = setInterval(() => this.checkAndInsert(), this.retryInterval);
        }

        checkAndInsert() {
            const notificationsDiv = document.querySelector(this.selector);

            if (notificationsDiv) {
                clearInterval(this.intervalId);
                console.log("[HH3D Script] âœ… ÄÃ£ tÃ¬m tháº¥y vá»‹ trÃ­. Báº¯t Ä‘áº§u chÃ¨n menu.");
                this.createAndInjectMenu(notificationsDiv);
            } else {
                this.elapsedTime += this.retryInterval;

                if (this.elapsedTime >= this.timeout) {
                    clearInterval(this.intervalId);
                    console.error(
                        `[HH3D Script - Lá»—i] âŒ KhÃ´ng tÃ¬m tháº¥y pháº§n tá»­ "${this.selector}" sau ${this.timeout / 1000
                        } giÃ¢y.`
                    );
                }
            }
        }


        createAndInjectMenu(notificationsDiv) {
            const parentNavItems = notificationsDiv.parentNode;

            if (parentNavItems && parentNavItems.classList.contains("nav-items")) {
                if (document.querySelector(".custom-script-item-wrapper")) {
                    console.log("[HH3D Script] âš ï¸ Menu Ä‘Ã£ tá»“n táº¡i. Bá» qua viá»‡c chÃ¨n láº¡i.");
                    return;
                }

                const customMenuWrapper = document.createElement("div");
                customMenuWrapper.classList.add("load-notification", "relative", "custom-script-item-wrapper");

                const newMenuButton = document.createElement("a");
                newMenuButton.href = "#";
                newMenuButton.setAttribute("data-view", "hide");

                // Táº¡o pháº§n tá»­ div cho biá»ƒu tÆ°á»£ng tráº¡ng thÃ¡i
                const statusIcon = document.createElement("div");
                statusIcon.classList.add("custom-script-status-icon");
                newMenuButton.appendChild(statusIcon);

                const iconDiv = document.createElement("div");
                const iconSpan = document.createElement("span");
                iconSpan.classList.add("material-icons-round1", "material-icons-menu");
                iconSpan.textContent = "task";
                iconDiv.appendChild(iconSpan);

                const label = document.createElement('span');
                label.classList.add('nav-label');
                label.textContent = 'Auto';
                newMenuButton.appendChild(iconDiv);
                newMenuButton.appendChild(label);

                const dropdownMenu = document.createElement("div");
                dropdownMenu.className = "custom-script-menu hidden";



                /* ===== Khá»Ÿi táº¡o Profile UI vá»›i Quest Skeleton ===== */
                const infoBox = document.createElement("div");
                infoBox.id = "autoProfileInfo";
                infoBox.style.position = "relative";
                infoBox.innerHTML = `                
                <div id="xu-info" class="xu-info-container"></div>
                <div id="reward-progress-wrap" style="margin-top:6px;">${createQuestSkeletonUI()}</div>
            `;
                dropdownMenu.appendChild(infoBox);

                // Gáº¯n sá»± kiá»‡n cho cÃ¡c nÃºt trong quest skeleton
                setTimeout(() => {
                    attachQuestButtonHandlers();
                    loadHH3DProfile();
                }, 100);

                // KhÃ´ng cÃ²n táº¡o menu groups vÃ¬ táº¥t cáº£ Ä‘Ã£ chuyá»ƒn vÃ o quest list
                // LINK_GROUPS hiá»‡n táº¡i rá»—ng
                if (this.linkGroups.length > 0) {
                    this.linkGroups.forEach(group => {
                        const groupDiv = document.createElement("div");
                        groupDiv.className = "custom-script-menu-group";
                        dropdownMenu.appendChild(groupDiv);

                        group.links.forEach(link => {
                            if (!link.isAutorun) {
                                const menuItem = document.createElement("a");
                                menuItem.classList.add("custom-script-menu-link");
                                menuItem.href = link.url;
                                menuItem.textContent = link.text;
                                menuItem.target = "_blank";
                                groupDiv.appendChild(menuItem);
                            }
                        });
                    });
                }

                // --- Thanh tráº¡ng thÃ¡i ---
                const statusBar = document.createElement("div");
                statusBar.className = "custom-script-status-bar";
                dropdownMenu.appendChild(statusBar);
                const tongMonName = localStorage.getItem('tm_name');
                // --- Footer Copyright ---
                const footer = document.createElement("div");
                footer.className = "custom-script-footer";
                footer.innerHTML = `
                    <span class="custom-script-footer-guild">${tongMonName}</span>
                `;
                dropdownMenu.appendChild(footer);

                customMenuWrapper.appendChild(newMenuButton);
                customMenuWrapper.appendChild(dropdownMenu);
                parentNavItems.insertBefore(customMenuWrapper, notificationsDiv.nextSibling);

                console.log("[HH3D Script] ðŸŽ‰ ChÃ¨n menu tÃ¹y chá»‰nh thÃ nh cÃ´ng!");



                newMenuButton.addEventListener("click", e => {
                    e.preventDefault();
                    dropdownMenu.classList.toggle("hidden");
                    iconSpan.textContent = dropdownMenu.classList.contains("hidden") ? "task" : "highlight_off";
                });

                document.addEventListener("click", e => {
                    if (!customMenuWrapper.contains(e.target)) {
                        dropdownMenu.classList.add("hidden");
                        iconSpan.textContent = "task";
                    }
                });
            } else {
                console.warn('[HH3D Script - Cáº£nh bÃ¡o] âš ï¸ KhÃ´ng tÃ¬m tháº¥y pháº§n tá»­ cha ".nav-items". KhÃ´ng thá»ƒ chÃ¨n menu.');
            }
        }

        // HÃ m Ä‘á»ƒ cáº­p nháº­t statusbar
        updateStatusBar(message, type = "info", duration = null) {
            const statusBar = document.querySelector(".custom-script-status-bar");
            if (!statusBar) return;

            const messageElement = document.createElement("div");
            messageElement.className = "custom-script-message";
            messageElement.classList.add(type);
            messageElement.textContent = message;

            // ThÃªm thÃ´ng bÃ¡o vÃ o cuá»‘i danh sÃ¡ch
            statusBar.appendChild(messageElement);

            // Giá»›i háº¡n 5 thÃ´ng bÃ¡o
            while (statusBar.children.length > 5) {
                statusBar.removeChild(statusBar.firstChild);
            }

            // Tá»± Ä‘á»™ng xÃ³a thÃ´ng bÃ¡o sau má»™t khoáº£ng thá»i gian
            if (duration !== null) {
                setTimeout(() => {
                    messageElement.style.animation = "fadeOut 0.3s forwards";
                    messageElement.addEventListener("animationend", () => {
                        if (messageElement.parentNode === statusBar) {
                            statusBar.removeChild(messageElement);
                        }
                    });
                }, duration);
            }
        }

        // XÃ³a táº¥t cáº£ thÃ´ng bÃ¡o
        clearStatusBar() {
            const statusBar = document.querySelector(".custom-script-status-bar");
            if (statusBar) {
                while (statusBar.firstChild) {
                    statusBar.removeChild(statusBar.firstChild);
                }
            }
        }

        // HÃ m updateButtonState (DEPRECATED - no longer needed)
        async updateButtonState(taskName) {
            // No longer needed since UIMenuCreator is removed
            // All task buttons are now in QUEST_CONFIG list
        }
    }

    // ===============================================
    // Countdown Timer - 1 vÃ²ng láº·p duy nháº¥t cho táº¥t cáº£ task
    // ===============================================
    class CountdownTimer {
        constructor() {
            this.tasks = {}; // { taskName: targetTimestamp }
            this.intervalId = null;
        }

        set(taskName, delayMs) {
            this.tasks[taskName] = Date.now() + delayMs;
            const targetName = taskName === 'luyenDanCheck' ? 'luyenDan' : taskName;
            const el = document.querySelector(`.quest-next-time[data-task="${targetName}"]`);
            if (el) el.classList.add('active');
            if (!this.intervalId) this._start();
        }

        remove(taskName) {
            delete this.tasks[taskName];
            if (taskName === 'luyenDan') {
                // KHÃ”NG xÃ³a DOM span â€” span chá»‰ Ä‘Æ°á»£c Ä‘iá»u khiá»ƒn bá»Ÿi updateProgress()
                // Viá»‡c remove() chá»‰ dá»«ng Ä‘áº¿m ngÆ°á»£c, khÃ´ng can thiá»‡p vÃ o text hiá»ƒn thá»‹
            } else if (taskName === 'luyenDanCheck') {
                const el = document.querySelector('.quest-next-time[data-task="luyenDan"]');
                if (el) { el.textContent = ''; el.classList.remove('active'); }
            } else {
                const el = document.querySelector(`.quest-next-time[data-task="${taskName}"]`);
                if (el) { el.textContent = ''; el.classList.remove('active'); }
            }
            if (Object.keys(this.tasks).length === 0) this._stop();
        }

        clear() {
            for (const name in this.tasks) this.remove(name);
            this._stop();
        }

        _start() {
            if (this.intervalId) return;
            this.intervalId = setInterval(() => this._tick(), 1000);
        }

        _stop() {
            if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
        }

        _tick() {
            const now = Date.now();
            for (const taskName in this.tasks) {
                const remaining = this.tasks[taskName] - now;
                if (taskName === 'luyenDanCheck') {
                    const el = document.querySelector('.quest-next-time[data-task="luyenDan"]');
                    if (el) {
                        if (remaining <= 0) {
                            if (el.textContent !== '') {
                                el.textContent = '';
                            }
                            el.classList.remove('active');
                            delete this.tasks[taskName];
                        } else {
                            const s = Math.max(0, Math.floor(remaining / 1000));
                            const newText = `â³ ${s}s`;
                            if (el.textContent !== newText) {
                                el.textContent = newText;
                            }
                            el.classList.add('active');
                        }
                    }
                    continue;
                }
                if (taskName === 'luyenDan') {
                    if (typeof luyendan !== 'undefined' && luyendan && luyendan.isProcessing) {
                        continue;
                    }
                    const el = document.querySelector('.nv-quest-item[data-task-id="luyenDan"] .quest-progress');
                    if (el) {
                        if (remaining <= 0) {
                            if (el.textContent !== '') {
                                el.textContent = '';
                            }
                            delete this.tasks[taskName];
                        } else {
                            const accountId = localStorage.getItem('hh3d_account_id') || '';
                            const isSafe = localStorage.getItem(`luyenDanIsSafe_${accountId}`) === 'true';
                            const tuneCount = localStorage.getItem(`luyenDanTuneCount_${accountId}`) || '0';
                            const tuneSurvivalMin = localStorage.getItem(`luyenDanTuneSurvivalMin_${accountId}`) || '3';
                            const stab = localStorage.getItem(`luyenDanStability_${accountId}`) || '100';
                            const totalSec = Math.max(0, Math.floor(remaining / 1000));
                            const minVal = Math.floor(totalSec / 60);
                            const secVal = totalSec % 60;
                            const timeStr = `${String(minVal).padStart(2, '0')}:${String(secVal).padStart(2, '0')}`;

                            let text;
                            if (isSafe) {
                                text = `Ä‘Ã£ Ä‘iá»u hoáº£ ${tuneCount} láº§n thá»i gian ${timeStr}`;
                            } else {
                                text = `Äang luyá»‡n (${stab}% - ${tuneCount}/${tuneSurvivalMin})`;
                            }
                            const newText = ` (${text})`;
                            if (el.textContent !== newText) {
                                el.textContent = newText;
                            }
                            localStorage.setItem(`luyenDanLastProgress_${accountId}`, text);
                        }
                    }
                    continue;
                }
                const el = document.querySelector(`.quest-next-time[data-task="${taskName}"]`);
                if (!el) continue;
                if (remaining <= 0) {
                    if (el.textContent !== '') {
                        el.textContent = '';
                    }
                    el.classList.remove('active');
                    delete this.tasks[taskName];
                } else {
                    const h = Math.floor(remaining / 3600000);
                    const m = Math.floor((remaining % 3600000) / 60000);
                    const s = Math.floor((remaining % 60000) / 1000);
                    const newText = h > 0 ? `â³ ${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `â³ ${m}:${String(s).padStart(2, '0')}`;
                    if (el.textContent !== newText) {
                        el.textContent = newText;
                    }
                }
            }
            if (Object.keys(this.tasks).length === 0) this._stop();
        }
    }
    const countdownTimer = new CountdownTimer();

    // ===============================================
    // Automactic
    // ===============================================
    class AutomationManager {
        constructor() {
            this.accountId = accountId;
            this.delay = 5000;

            // CÃ¡c khoáº£ng thá»i gian kiá»ƒm tra (ms)
            this.CHECK_INTERVAL_TIEN_DUYEN = 30 * 60 * 1000;
            this.INTERVAL_HOANG_VUC = 3 * 60 * 1000 + this.delay;
            this.INTERVAL_PHUC_LOI = 5 * 60 * 1000 + this.delay;
            this.INTERVAL_THI_LUYEN = 5 * 60 * 1000 + this.delay;
            this.INTERVAL_BI_CANH = 7 * 60 * 1000 + this.delay;
            this.INTERVAL_KHOANG_MACH = localStorage.getItem('khoangmach_check_interval') ? parseInt(localStorage.getItem('khoangmach_check_interval')) * 60 * 1000 + this.delay : 5 * 60 * 1000 + this.delay;
            this.INTERVAL_HOAT_DONG_NGAY = 10 * 60 * 1000 + this.delay;
            this.INTERVAL_LUYEN_DAN = 5 * 60 * 1000 + this.delay;

            this.timeoutIds = {};
            this.isRunning = false;
        }


        async start() {
            console.log(`[Auto] Báº¯t Ä‘áº§u quÃ¡ trÃ¬nh tá»± Ä‘á»™ng cho tÃ i khoáº£n: ${this.accountId}`);
            this.isRunning = true;
            window.isRunning = true;
            // Thá»±c hiá»‡n cÃ¡c tÃ¡c vá»¥ ban Ä‘áº§u

            const autoDiemDanh = localStorage.getItem('autoDiemDanh') !== '0';
            //const autoTangHoa = localStorage.getItem('autoTangHoa') !== '0';

            const autoCauNguyen = localStorage.getItem('autoCaunguyen') !== '0';
            const autoTienDuyen = localStorage.getItem('autoTienDuyen') !== '0';
            const autoThiLuyen = localStorage.getItem('autoThiLuyen') !== '0';
            const autoPhucLoi = localStorage.getItem('autoPhucLoi') !== '0';
            const autoHoangVuc = localStorage.getItem('autoHoangVuc') !== '0';
            const autoBiCanh = localStorage.getItem('autoBiCanh') !== '0';
            const autoLuanVo = localStorage.getItem('autoLuanVo') !== '0';
            const autoDoThach = localStorage.getItem('autoDoThach') !== '0';
            const autoKhoangMach = localStorage.getItem('autoKhoangMach') !== '0';
            const autoLuyenDan = localStorage.getItem('autoLuyenDan') !== '0';

            let offset = 0;
            const runStaggered = (fn) => {
                setTimeout(fn, offset);
                offset += 200;
            };

            // LuÃ´n lÃªn lá»‹ch Luyá»‡n Äan Ä‘á»ƒ tá»± Ä‘á»™ng cáº­p nháº­t tiáº¿n Ä‘á»™ lÃªn UI (náº¿u táº¯t auto sáº½ chá»‰ Ä‘á»c tráº¡ng thÃ¡i)
            runStaggered(() => this.scheduleTask('luyenDan', () => luyendan.doLuyenDan(), this.INTERVAL_LUYEN_DAN));

            if (autoDiemDanh) { runStaggered(() => this.doInitialTasks()); }
            // Báº¯t Ä‘áº§u chu ká»³ háº¹n giá» cho TiÃªn DuyÃªn
            if (autoTienDuyen) { runStaggered(() => this.scheduleTienDuyenCheck()); }
            // Äá»• tháº¡ch
            if (autoDoThach) { runStaggered(() => this.scheduleDoThach()); }
            // LÃªn lá»‹ch cÃ¡c tÃ¡c vá»¥ Ä‘á»‹nh ká»³
            if (autoHoangVuc) {
                runStaggered(() => this.scheduleTask('hoangvuc', () => hoangvuc.doHoangVuc(), this.INTERVAL_HOANG_VUC));
            }
            if (autoThiLuyen) {
                runStaggered(() => this.scheduleTask('thiluyen', () => doThiLuyenTongMon(), this.INTERVAL_THI_LUYEN));
            }
            if (autoPhucLoi) {
                runStaggered(() => this.scheduleTask('phucloi', () => doPhucLoiDuong(), this.INTERVAL_PHUC_LOI));
            }
            if (autoKhoangMach) {
                runStaggered(() => {
                    this.INTERVAL_KHOANG_MACH = localStorage.getItem('khoangmach_check_interval') ? parseInt(localStorage.getItem('khoangmach_check_interval')) * 60 * 1000 + this.delay : 5 * 60 * 1000 + this.delay;
                    this.scheduleTask('khoangmach', () => khoangmach.doKhoangMach(), this.INTERVAL_KHOANG_MACH);
                });
            }

            if (autoBiCanh) {
                runStaggered(() => this.scheduleTask("bicanh", async () => {
                    // Äá»c giá»¯ lÆ°á»£t Ä‘Ã¡nh bÃ­ cáº£nh
                    const reserve = Number(localStorage.getItem("reserveBiCanhAttacks") || "0");
                    console.log("GiÃ¡ trá»‹ reserveBiCanhAttacks trong autobicanh:", reserve);
                    await bicanh.doBiCanh();
                }, this.INTERVAL_BI_CANH));
            }

            if (autoCauNguyen) { runStaggered(() => this.caunguyentienduyen()); }

            runStaggered(() => this.scheduleHoatDongNgay());
            const _sh = parseInt(localStorage.getItem('selfSchedule_h') ?? '0', 10) || 0;
            const _sm = parseInt(localStorage.getItem('selfSchedule_m') ?? '30', 10);
            this.selfSchedule(_sh, _sm, 0); // LÃªn lá»‹ch tá»± Ä‘á»™ng cháº¡y theo cÃ i Ä‘áº·t (máº·c Ä‘á»‹nh 00:30 hÃ ng ngÃ y)
            // this.applyPromoCode();
        }


        async eventSchedule() {
            const now = Date.now();
            const nextEventTime = taskTracker.getNextTime(accountId, 'event');

            // Logic tÃ­nh thá»i gian chá» máº·c Ä‘á»‹nh
            // Náº¿u chÆ°a cÃ³ lá»‹ch hoáº·c tÃ­nh ra sá»‘ Ã¢m (quÃ¡ khá»©) thÃ¬ Ä‘á»£i 1s rá»“i check láº¡i, ngÆ°á»£c láº¡i Ä‘á»£i Ä‘Ãºng thá»i gian
            let waitTime = 1000;

            if (nextEventTime && now >= nextEventTime) {
                console.log("[Auto] â° ÄÃ£ Ä‘áº¿n giá» sá»± kiá»‡n. Äang thá»±c hiá»‡n...");
                try {
                    // Thá»±c hiá»‡n nhiá»‡m vá»¥
                    await doDuaTopTongMon();

                    // QUAN TRá»ŒNG: HÃ m doDuaTopTongMon pháº£i cÃ³ lá»‡nh cáº­p nháº­t láº¡i nextEventTime (taskTracker.adjustTaskTime)
                    // Náº¿u khÃ´ng cáº­p nháº­t thá»i gian, nÃ³ sáº½ láº·p vÃ´ táº­n liÃªn tá»¥c gÃ¢y treo trÃ¬nh duyá»‡t.
                } catch (error) {
                    console.error("[Auto] âŒ Lá»—i khi thá»±c hiá»‡n sá»± kiá»‡n:", error);
                }

                // Sau khi cháº¡y xong (dÃ¹ lá»—i hay khÃ´ng), Ä‘á»£i 5 giÃ¢y rá»“i check láº¡i lá»‹ch má»›i
                waitTime = 5000;
            } else {
                // ChÆ°a Ä‘áº¿n giá», tÃ­nh thá»i gian chá»
                if (nextEventTime) {
                    waitTime = nextEventTime - now;
                    // Äáº£m báº£o khÃ´ng chá» sá»‘ Ã¢m (náº¿u mÃ¡y tÃ­nh bá»‹ lag)
                    if (waitTime < 0) waitTime = 1000;
                } else {
                    // Náº¿u khÃ´ng tÃ¬m tháº¥y lá»‹ch (null), máº·c Ä‘á»‹nh check láº¡i sau 5 phÃºt
                    waitTime = 5 * 60 * 1000;
                }

            }
            // Gá»i Ä‘á»‡ quy Ä‘á»ƒ duy trÃ¬ vÃ²ng láº·p vÄ©nh viá»…n
            // setTimeout(() => {
            //     this.eventSchedule();
            // }, waitTime + (this.delay || 0));
        }
        /**LÃªn lá»‹ch tá»± cháº¡y láº¡i vÃ o lÃºc 1 giá» */
        async selfSchedule(h = 1, m = 0, s = 0) {
            if (!this.isRunning) return;
            const now = Date.now();
            const timeToRerun = new Date();
            timeToRerun.setHours(h, m, s, 0);
            if (timeToRerun.getTime() <= now) {
                timeToRerun.setDate(timeToRerun.getDate() + 1);
            }
            const delay = timeToRerun.getTime() - now;
            console.log(`[Auto] LÃªn lá»‹ch tá»± cháº¡y láº¡i vÃ o lÃºc ${h} giá» ${m} phÃºt ${s} giÃ¢y. Thá»i gian chá»: ${delay}ms.`);
            countdownTimer.set('restart', delay);
            setTimeout(() => { this.stop(); }, delay);
            setTimeout(() => { this.start(); }, delay + 1000);

        }

        async doInitialTasks() {
            if (!taskTracker.isTaskDone(this.accountId, 'diemdanh')) {
                try {
                    const nonce = await getNonce()
                    if (!nonce) return
                    await doDailyCheckin(nonce);
                    await doClanDailyCheckin(nonce);
                    await vandap.doVanDap(nonce);
                } catch (e) {
                    console.error("[Auto] Lá»—i khi thá»±c hiá»‡n Äiá»ƒm danh, táº¿ lá»…, váº¥n Ä‘Ã¡p:", e);
                }
            }
        }


        async caunguyentienduyen() {
            if (!taskTracker.isTaskDone(this.accountId, 'tienduyen')) {
                try {
                    const nonce = await getNonce()
                    if (!nonce) return
                    const result = await docaunguyen(this.accountId);
                    console.log("Káº¿t quáº£ cáº§u nguyá»‡n:", result);
                } catch (e) {
                    console.error("[Cáº§u nguyá»‡n TiÃªn duyÃªn]:", e);
                }
            }
        }

        async scheduleTienDuyenCheck() {
            const isEnabled = localStorage.getItem('autoTienDuyen') !== '0';
            if (!isEnabled) {
                if (this.tienduyenTimeout) {
                    clearTimeout(this.tienduyenTimeout);
                    this.tienduyenTimeout = null;
                }
                countdownTimer.remove('tienduyen');
                return;
            }
            const now = Date.now();
            const lastCheckTienDuyen = taskTracker.getLastCheckTienDuyen(this.accountId);
            let timeToNextCheck;

            if (lastCheckTienDuyen === null || now - lastCheckTienDuyen >= this.CHECK_INTERVAL_TIEN_DUYEN) {
                console.log("[Auto] ÄÃ£ Ä‘áº¿n giá» lÃ m TiÃªn DuyÃªn. Äang thá»±c hiá»‡n...");
                try {
                    await tienduyen.doTienDuyen();
                } catch (error) {
                    console.error("[Auto] Lá»—i khi thá»±c hiá»‡n TiÃªn DuyÃªn:", error);
                }
                timeToNextCheck = this.CHECK_INTERVAL_TIEN_DUYEN;
            } else {
                timeToNextCheck = this.CHECK_INTERVAL_TIEN_DUYEN - (now - lastCheckTienDuyen);
                console.log(`[Auto] ChÆ°a Ä‘áº¿n giá» tiÃªn duyÃªn. Sáº½ chá» ${timeToNextCheck}ms.`);
            }

            // Háº¹n giá» gá»i láº¡i chÃ­nh nÃ³ sau khoáº£ng thá»i gian Ä‘Ã£ tÃ­nh
            if (this.tienduyenTimeout) clearTimeout(this.tienduyenTimeout);
            countdownTimer.set('tienduyen', timeToNextCheck);
            this.tienduyenTimeout = setTimeout(() => this.scheduleTienDuyenCheck(), timeToNextCheck);
        }

        /**
        * Táº¡o lá»‹ch trÃ¬nh cho má»™t nhiá»‡m vá»¥ cá»¥ thá»ƒ.
        - VÃ­ dá»¥: scheduleTask('thiluyen', () => thiluyen.doThiLuyen(), this.INTERVAL_THI_LUYEN, 'thiluyenTimeout')
        * @param {string} taskName TÃªn cá»§a nhiá»‡m vá»¥, dÃ¹ng Ä‘á»ƒ truy váº¥n tráº¡ng thÃ¡i (vÃ­ dá»¥: 'thiluyen').
        * @param {Function} taskAction HÃ m báº¥t Ä‘á»“ng bá»™ thá»±c thi nhiá»‡m vá»¥ (vÃ­ dá»¥: `hoangvuc.doHoangVuc`).
        * @param {number} interval Chu ká»³ láº·p láº¡i cá»§a nhiá»‡m vá»¥ tÃ­nh báº±ng mili giÃ¢y.
        */
        async scheduleTask(taskName, taskAction, interval) {
            if (this.timeoutIds[taskName]) clearTimeout(this.timeoutIds[taskName]);

            // Kiá»ƒm tra xem quest nÃ y cÃ³ bá»‹ táº¯t cháº¡y tá»± Ä‘á»™ng khÃ´ng (bao gá»“m cáº£ luyenDan)
            const quest = QUEST_CONFIG.find(q => q.taskId === taskName);
            if (quest && quest.autorunEnabled) {
                const isEnabled = localStorage.getItem(quest.autorunKey) !== '0';
                if (!isEnabled) {
                    console.log(`[Auto] Nhiá»‡m vá»¥ ${taskName} Ä‘Ã£ bá»‹ táº¯t tá»± Ä‘á»™ng. Dá»«ng lá»‹ch trÃ¬nh.`);
                    if (this.timeoutIds[taskName]) {
                        clearTimeout(this.timeoutIds[taskName]);
                        this.timeoutIds[taskName] = null;
                    }
                    countdownTimer.remove(taskName);
                    if (taskName === 'luyenDan') countdownTimer.remove('luyenDanCheck');
                    return;
                }
            }

            let isTaskDone;
            if (taskName === 'bicanh' && await bicanh.isDailyLimit()) {
                isTaskDone = true;
            } else if (taskName === 'luyenDan') {
                isTaskDone = false; // Luyá»‡n Ä‘an luÃ´n cháº¡y ngáº§m Ä‘á»ƒ hiá»ƒn thá»‹ UI Ä‘áº¿m ngÆ°á»£c
            } else {
                isTaskDone = taskTracker.isTaskDone(this.accountId, taskName);
            }
            // Kiá»ƒm tra vÃ  dá»«ng lá»‹ch trÃ¬nh náº¿u nhiá»‡m vá»¥ Ä‘Ã£ hoÃ n thÃ nh
            if (isTaskDone) {
                loadHH3DProfile().catch(() => { });
                return;
            }

            const now = Date.now();
            // luyenDan luÃ´n cháº¡y ngay khi scheduleTask Ä‘Æ°á»£c gá»i (timeout Ä‘Ã£ xá»­ lÃ½ delay rá»“i)
            // KhÃ´ng dÃ¹ng nextTime cá»§a taskTracker cho luyenDan Ä‘á»ƒ trÃ¡nh bá»‹ káº¹t á»Ÿ tráº¡ng thÃ¡i cÅ©
            const nextTime = taskName === 'luyenDan' ? null : taskTracker.getNextTime(this.accountId, taskName);
            let timeToNextCheck;

            if (nextTime === null || now >= nextTime) {
                // Trá»… pháº£n á»©ng ngáº«u nhiÃªn mÃ´ phá»ng hÃ nh vi ngÆ°á»i dÃ¹ng tháº­t (2s - 7s, riÃªng luyenDan chá»‰ 0.5s - 2s Ä‘á»ƒ Ä‘áº£m báº£o lÃ² Ä‘an á»•n Ä‘á»‹nh)
                const humanDelay = taskName === 'luyenDan' ? (500 + Math.floor(Math.random() * 1500)) : (2000 + Math.floor(Math.random() * 5000));
                console.log(`[Auto] ÄÃ£ Ä‘áº¿n giá» lÃ m nhiá»‡m vá»¥: ${taskName}. Chá» trá»… mÃ´ phá»ng hÃ nh vi ngÆ°á»i dÃ¹ng: ${humanDelay}ms...`);
                await new Promise(r => setTimeout(r, humanDelay));

                console.log(`[Auto] Äang thá»±c hiá»‡n nhiá»‡m vá»¥: ${taskName}...`);
                try {
                    // Cho phÃ©p taskAction tráº£ vá» delay thá»±c táº¿ (ms hoáº·c chuá»—i thá»i gian)
                    let result = await taskAction();
                    // Cáº­p nháº­t tráº¡ng thÃ¡i UI sau khi task cháº¡y xong
                    // KhÃ´ng gá»i loadHH3DProfile cho luyenDan vÃ¬ nÃ³ sáº½ xÃ³a span progress Ä‘ang hiá»ƒn thá»‹
                    if (taskName !== 'luyenDan') {
                        loadHH3DProfile().catch(() => { });
                    } else {
                        // Chá»‰ cáº­p nháº­t nÃºt tráº¡ng thÃ¡i, khÃ´ng rebuild toÃ n bá»™ profile
                        updateAllQuestButtons().catch(() => { });
                    }
                    // Náº¿u tráº£ vá» sá»‘, dÃ¹ng lÃ m delay
                    if (typeof result === 'number' && !isNaN(result) && result > 0) {
                        timeToNextCheck = result;
                    } else if (typeof result === 'string') {
                        // Náº¿u tráº£ vá» chuá»—i, parse ra ms
                        const ms = parseDelayString(result);
                        timeToNextCheck = ms > 0 ? ms : interval;
                    } else {
                        timeToNextCheck = interval;
                    }

                    // ThÃªm jitter ngáº«u nhiÃªn vÃ o chu ká»³ kiá»ƒm tra (trÃ¡nh cÃ¡c nhiá»‡m vá»¥ khÃ´ng pháº£i luyenDan cháº¡y Ä‘á»u Ä‘áº·n tuyá»‡t Ä‘á»‘i)
                    if (taskName !== 'luyenDan') {
                        // Jitter tá»« -15s Ä‘áº¿n +45s
                        const checkJitter = Math.floor(Math.random() * 60000) - 15000;
                        timeToNextCheck = Math.max(10000, timeToNextCheck + checkJitter);
                        console.log(`[Auto] ÄÃ£ thÃªm jitter vÃ o chu ká»³ kiá»ƒm tra cá»§a ${taskName}. Thá»i gian check tiáº¿p theo: ${Math.round(timeToNextCheck / 1000)}s.`);
                    }
                } catch (error) {
                    console.error(`[Auto] Lá»—i khi thá»±c hiá»‡n nhiá»‡m vá»¥ ${taskName}:`, error);
                    // CÃ³ thá»ƒ Ä‘áº·t thá»i gian chá» ngáº¯n hÆ¡n khi cÃ³ lá»—i Ä‘á»ƒ thá»­ láº¡i
                    timeToNextCheck = 3 * 60 * 1000; // Thá»­ láº¡i sau 3 phÃºt
                }
            } else {
                timeToNextCheck = Math.max(nextTime - now, 0);
                console.log(`[Auto] Nhiá»‡m vá»¥ ${taskName} chÆ°a Ä‘áº¿n giá», sáº½ chá» ${timeToNextCheck}ms.`);
            }

            // Háº¹n giá» cho láº§n cháº¡y tiáº¿p theo
            if (this.timeoutIds[taskName]) clearTimeout(this.timeoutIds[taskName]);
            if (taskName === 'luyenDan' || !taskTracker.isTaskDone(accountId, taskName)) {
                const taskFullName = {
                    hoangvuc: "Hoang Vá»±c",
                    phucloi: "PhÃºc Lá»£i",
                    thiluyen: "ThÃ­ Luyá»‡n",
                    bicanh: "BÃ­ Cáº£nh",
                    khoangmach: "KhoÃ¡ng Máº¡ch",
                    luyenDan: "Luyá»‡n Äan"
                }[taskName];
                //showNotification
                if (taskName === 'bicanh') {
                    const isReserveHold = await bicanh.isReserveHold();
                    if (isReserveHold) {
                        //createUI.updateStatusBar(`ðŸ›‘ ${taskFullName}: Ä‘ang giá»¯ lÆ°á»£t, khÃ´ng háº¹n giá»`, 'info', 0);
                        return; // dá»«ng háº³n, khÃ´ng háº¹n giá»
                    }
                }
                // Cáº­p nháº­t countdown vÃ o tá»«ng nhiá»‡m vá»¥ (dÃ¹ng 1 vÃ²ng láº·p chung)
                if (taskName === 'luyenDan') {
                    countdownTimer.set('luyenDanCheck', timeToNextCheck);
                } else {
                    countdownTimer.set(taskName, timeToNextCheck);
                }
                this.timeoutIds[taskName] = setTimeout(() => this.scheduleTask(taskName, taskAction, interval), timeToNextCheck);
            }
        }

        // HÃ m parse chuá»—i thá»i gian dáº¡ng "6 phÃºt 0 giÃ¢y" hoáº·c "0 phÃºt 40 giÃ¢y" thÃ nh ms
        async parseDelayString(str) {
            if (!str) return 0;
            let m = 0, s = 0, h = 0;
            // Há»— trá»£ cáº£ dáº¡ng "6 phÃºt 0 giÃ¢y", "40 giÃ¢y", "1 giá» 2 phÃºt 3 giÃ¢y"
            const hourMatch = str.match(/(\d+)\s*giá»/);
            if (hourMatch) h = parseInt(hourMatch[1]);
            const minMatch = str.match(/(\d+)\s*phÃºt/);
            if (minMatch) m = parseInt(minMatch[1]);
            const secMatch = str.match(/(\d+)\s*giÃ¢y/);
            if (secMatch) s = parseInt(secMatch[1]);
            return h * 3600000 + m * 60000 + s * 1000;
        }

        async scheduleLuanVo() {
            const isDone = taskTracker.isTaskDone(this.accountId, 'luanvo');
            if (isDone) {
                if (this.luanvoTimeout) clearTimeout(this.luanvoTimeout);
                return;
            }
            await luanvo.startLuanVo();
            let timeTo21h = new Date();
            timeTo21h.setHours(21, 1, 0, 0);
            const delay = timeTo21h.getTime() - Date.now();
            console.log(`[Auto] LÃªn lá»‹ch Luáº­n VÃµ vÃ o lÃºc 00:01. Thá»i gian chá»: ${delay}ms.`);
            if (this.luanvoTimeout) clearTimeout(this.luanvoTimeout);
            if (delay < 0) {
                await luanvo.thueTieuViem();
                await luanvo.doLuanVo(true);
            } else {
                countdownTimer.set('luanvo', delay);
                this.luanvoTimeout = setTimeout(() => this.scheduleLuanVo(), delay);
            }
        }

        async scheduleDoThach() {
            const isEnabled = localStorage.getItem('autoDoThach') !== '0';
            if (!isEnabled) {
                if (this.dothachTimeout) {
                    clearTimeout(this.dothachTimeout);
                    this.dothachTimeout = null;
                }
                countdownTimer.remove('dothach');
                return;
            }
            const status = taskTracker.getTaskStatus(accountId, 'dothach');
            const isBetPlaced = status.betplaced;
            const isRewardClaimed = status.reward_claimed;

            const currentHour = parseInt(
                new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                    hour: 'numeric',
                    hour12: false
                }),
                10
            );

            let nextActionTime; // Giá» hÃ nh Ä‘á»™ng tiáº¿p theo (vÃ­ dá»¥: 13, 16, 21, 6)
            let timeToNextCheck; // Thá»i gian chá» (mili giÃ¢y)

            const calculateTimeToNextHour = (targetHour) => {
                const now = new Date();
                const nextTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, 0, 0, 0);
                if (now.getHours() >= targetHour) {
                    nextTime.setDate(nextTime.getDate() + 1); // Náº¿u giá» má»¥c tiÃªu Ä‘Ã£ qua, chuyá»ƒn sang ngÃ y mai
                }
                return nextTime.getTime() - now.getTime();
            };

            if (isBetPlaced) {
                // ÄÃ£ Ä‘áº·t cÆ°á»£c, chá» Ä‘áº¿n giá» nháº­n thÆ°á»Ÿng
                if (currentHour >= 6 && currentHour < 13) {
                    nextActionTime = 13; // Chá» Ä‘áº¿n 13h Ä‘á»ƒ nháº­n thÆ°á»Ÿng láº§n 1
                } else if (currentHour >= 16 && currentHour < 21) {
                    nextActionTime = 21; // Chá» Ä‘áº¿n 21h Ä‘á»ƒ nháº­n thÆ°á»Ÿng láº§n 2
                } else {
                    console.log('[Äá»• Tháº¡ch] ÄÃ£ Ä‘áº·t cÆ°á»£c nhÆ°ng khÃ´ng trong khung giá» cÆ°á»£c, chá» khung giá» nháº­n thÆ°á»Ÿng tiáº¿p theo.');
                    if (currentHour < 13) {
                        nextActionTime = 13;
                    } else if (currentHour < 21) {
                        nextActionTime = 21;
                    } else {
                        nextActionTime = 6; // Chá» Ä‘áº¿n 6h sÃ¡ng mai
                    }
                }
            } else if (isRewardClaimed) {
                // ÄÃ£ nháº­n thÆ°á»Ÿng, chá» Ä‘áº¿n giá» Ä‘áº·t cÆ°á»£c tiáº¿p theo
                if (currentHour >= 13 && currentHour < 16) {
                    nextActionTime = 16; // Chá» Ä‘áº¿n 16h Ä‘á»ƒ Ä‘áº·t cÆ°á»£c láº§n 2
                } else {
                    nextActionTime = 6; // Chá» Ä‘áº¿n 6h sÃ¡ng hÃ´m sau
                }
            } else {
                const stoneType = localStorage.getItem('dice-roll-choice') ?? 'tai';
                // ChÆ°a Ä‘áº·t cÆ°á»£c hoáº·c chÆ°a nháº­n thÆ°á»Ÿng. Cáº§n kiá»ƒm tra khung giá» hiá»‡n táº¡i
                if (currentHour >= 6 && currentHour < 13) {
                    console.log('[Äá»• Tháº¡ch] Äang trong khung giá» 6h-13h. Äang Ä‘áº·t cÆ°á»£c...');
                    await dothach.run(stoneType); // Thá»±c hiá»‡n Ä‘áº·t cÆ°á»£c
                    createUI.updateButtonState('dothach');
                    nextActionTime = 13; // Sau khi cÆ°á»£c, chá» Ä‘áº¿n 13h Ä‘á»ƒ kiá»ƒm tra thÆ°á»Ÿng
                } else if (currentHour >= 16 && currentHour < 21) {
                    console.log('[Äá»• Tháº¡ch] Äang trong khung giá» 16h-21h. Äang Ä‘áº·t cÆ°á»£c...');
                    await dothach.run(stoneType); // Thá»±c hiá»‡n Ä‘áº·t cÆ°á»£c
                    createUI.updateButtonState('dothach');
                    nextActionTime = 21; // Sau khi cÆ°á»£c, chá» Ä‘áº¿n 21h Ä‘á»ƒ kiá»ƒm tra thÆ°á»Ÿng
                    setTimeout(loadHH3DProfile, 100); // cáº­p nháº­t profile sau khi Ä‘áº·t cÆ°á»£c
                } else {
                    // KhÃ´ng trong khung giá» nÃ o, chá» Ä‘áº¿n khung giá» Ä‘áº·t cÆ°á»£c tiáº¿p theo
                    console.log('[Äá»• Tháº¡ch] KhÃ´ng trong khung giá» cÆ°á»£c. Chá»...');
                    if (currentHour < 6) {
                        nextActionTime = 6;
                    } else if (currentHour < 16) {
                        nextActionTime = 16;
                    } else {
                        nextActionTime = 6; // Chá» Ä‘áº¿n 6h sÃ¡ng mai
                    }
                }
            }

            timeToNextCheck = calculateTimeToNextHour(nextActionTime);

            // Há»§y timeout cÅ© náº¿u cÃ³ vÃ  thiáº¿t láº­p timeout má»›i
            if (this.dothachTimeout) clearTimeout(this.dothachTimeout);
            countdownTimer.set('dothach', timeToNextCheck);
            this.dothachTimeout = setTimeout(() => this.scheduleDoThach(), timeToNextCheck);

            console.log(`[Äá»• Tháº¡ch] Láº§n kiá»ƒm tra tiáº¿p theo lÃºc: ${new Date(Date.now() + timeToNextCheck).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
        }

        async scheduleHoatDongNgay() {
            const isDone = taskTracker.isTaskDone(this.accountId, 'hoatdongngay');
            if (isDone) {
                console.log("[Auto] Hoáº¡t Äá»™ng NgÃ y Ä‘Ã£ hoÃ n thÃ nh, khÃ´ng cáº§n lÃªn lá»‹ch.");
                if (this.hoatdongngayTimeout) clearTimeout(this.hoatdongngayTimeout);
                loadHH3DProfile().catch(() => { });
                return;
            }
            const isHoangVucDone = taskTracker.isTaskDone(this.accountId, 'hoangvuc');
            const isPhucLoiDone = taskTracker.isTaskDone(this.accountId, 'phucloi');
            const isDiemDanhDone = taskTracker.isTaskDone(this.accountId, 'diemdanh');
            // const isLuanVoDone = taskTracker.isTaskDone(this.accountId, 'luanvo');
            if (isHoangVucDone && isPhucLoiDone && isDiemDanhDone) {
                console.log("[Auto] Äiá»u kiá»‡n Ä‘Ã£ Ä‘á»§, Ä‘ang thá»±c hiá»‡n Hoáº¡t Äá»™ng NgÃ y...");
                try {
                    await hoatdongngay.doHoatDongNgay();
                    if (this.hoatdongngayTimeout) clearTimeout(this.hoatdongngayTimeout);
                    if (taskTracker.isTaskDone(this.accountId, 'hoatdongngay') && this.hoatdongngayTimeout) {
                        return;
                    } else {
                        countdownTimer.set('hoatdongngay', 5 * 60 * 1000);
                        this.hoatdongngayTimeout = setTimeout(() => this.scheduleHoatDongNgay(), 5 * 60 * 1000);
                    }
                }
                catch (e) {
                    console.error("[Auto] Lá»—i khi thá»±c hiá»‡n Hoáº¡t Äá»™ng NgÃ y:", e);
                }
            } else {
                if (this.hoatdongngayTimeout) clearTimeout(this.hoatdongngayTimeout);
                countdownTimer.set('hoatdongngay', this.INTERVAL_HOAT_DONG_NGAY);
                this.hoatdongngayTimeout = setTimeout(() => this.scheduleHoatDongNgay(), this.INTERVAL_HOAT_DONG_NGAY);
            }
        }

        stop() {
            if (!this.isRunning || !window.isRunning) return;
            window.isRunning = false;
            for (const taskName in this.timeoutIds) {
                if (this.timeoutIds[taskName]) {
                    clearTimeout(this.timeoutIds[taskName]);
                    this.timeoutIds[taskName] = null; // Äáº·t láº¡i giÃ¡ trá»‹ Ä‘á»ƒ trÃ¡nh rÃ² rá»‰ bá»™ nhá»›
                    console.log(`[Auto] ÄÃ£ há»§y háº¹n giá» cho nhiá»‡m vá»¥: ${taskName}`);
                }
            }
            if (this.tienduyenTimeout) {
                clearTimeout(this.tienduyenTimeout);
                console.log(`ÄÃ£ dá»«ng quÃ¡ trÃ¬nh tá»± Ä‘á»™ng tiÃªn duyÃªn`);
            }
            if (this.dothachTimeout) {
                clearTimeout(this.dothachTimeout);
                console.log(`ÄÃ£ dá»«ng quÃ¡ trÃ¬nh tá»± Ä‘á»™ng Ä‘á»• tháº¡ch`);
            }
            if (this.hoatdongngayTimeout) {
                clearTimeout(this.hoatdongngayTimeout);
                console.log(`ÄÃ£ dá»«ng quÃ¡ trÃ¬nh tá»± Ä‘á»™ng hoáº¡t Ä‘á»™ng ngÃ y`);
            }
            // XÃ³a táº¥t cáº£ countdown trá»« 'restart' (váº«n Ä‘ang chá» selfSchedule)
            Object.keys(countdownTimer.tasks).forEach(name => {
                if (name !== 'restart') countdownTimer.remove(name);
            });
            createUI.clearStatusBar();
        }

        checkAndStart() {
            if (localStorage.getItem('autorunEnabled') === null) {
                localStorage.setItem('autorunEnabled', '0');
            }
            if (localStorage.getItem('autoLuyenDan') === null) {
                localStorage.setItem('autoLuyenDan', '1'); // [v2.17.1-local] Máº·c Ä‘á»‹nh Báº¬T tá»± Ä‘á»™ng luyá»‡n Ä‘an
            }

            let autorunEnabled = localStorage.getItem('autorunEnabled') === '1';

            if (autorunEnabled) {
                console.log('[Automation] Tá»± Ä‘á»™ng khá»Ÿi Ä‘á»™ng Autorun...');

                // Táº¡o má»™t hÃ m chá» Ä‘á»ƒ Ä‘áº£m báº£o UI Ä‘Ã£ sáºµn sÃ ng
                const checkStatusIcon = () => {
                    const statusIcon = document.querySelector('.custom-script-status-icon');
                    if (statusIcon) {
                        // Náº¿u icon Ä‘Ã£ tá»“n táº¡i, cáº­p nháº­t tráº¡ng thÃ¡i vÃ  báº¯t Ä‘áº§u tÃ¡c vá»¥
                        this.start();
                    } else {
                        // Náº¿u icon chÆ°a tá»“n táº¡i, chá» 100ms vÃ  thá»­ láº¡i
                        setTimeout(checkStatusIcon, 100);
                    }
                };

                // Báº¯t Ä‘áº§u quÃ¡ trÃ¬nh kiá»ƒm tra
                checkStatusIcon();
            } else {
                console.log('[Automation] Autorun khÃ´ng Ä‘Æ°á»£c báº­t, sáº½ khÃ´ng khá»Ÿi Ä‘á»™ng tá»± Ä‘á»™ng.');
            }
        }
    }
    // ===============================================
    // HIá»†N TU VI KHOÃNG Máº CH
    // ===============================================
    class hienTuviKhoangMach {
        constructor() {
            this.selfTuViCache = null;
            this.mineImageSelector = '.mine-image';
            this.attackButtonSelector = '.attack-btn';
            this.currentMineUsers = []; // Sáº½ lÆ°u dá»¯ liá»‡u ngÆ°á»i dÃ¹ng táº¡i Ä‘Ã¢y
            this.tempObserver = null; // Biáº¿n Ä‘á»ƒ lÆ°u MutationObserver táº¡m thá»i
            this.nonceGetUserInMine = null;
            this.nonce = null;
            this.headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            };
            this.currentMineId = null;
            this.tempObserverRearrange = null; // Biáº¿n Ä‘á»ƒ lÆ°u MutationObserver táº¡m thá»i khi sáº¯p xáº¿p

        }

        async waitForElement(selector, timeout = 15000) {
            const found = document.querySelector(selector);
            if (found) return Promise.resolve(found);
            return new Promise((resolve) => {
                const obs = new MutationObserver(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        obs.disconnect();
                        clearTimeout(timer);
                        resolve(el);
                    }
                });
                obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
                const timer = setTimeout(() => {
                    obs.disconnect();
                    resolve(null);
                }, timeout);
            });
        }
        async getNonceGetUserInMine() {
            const htmlSource = document.documentElement.innerHTML;
            const tokens = extractActionTokens(htmlSource);
            const security_get_users = tokens["get_users_in_mine"];
            return security_get_users || null;
        }

        async getNonce() {
            if (typeof restNonce !== 'undefined' && restNonce) {
                return restNonce;
            }

            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const match = script.innerHTML.match(/"restNonce"\s*:\s*"([a-f0-9]+)"/i);
                if (match) {
                    return match[1];
                }
            }

            try {
                const nonce = await getSecurityNonce(weburl + '?t', "restNonce");
                if (nonce) {
                    return nonce;
                }
            } catch (error) {
                console.error("Failed to get security nonce", error);
            }

            return null;
        }

        async getSelfTuVi(forceRefresh = false) {
            if (!forceRefresh && this.selfTuViCache !== null) {
                return this.selfTuViCache;
            }
            // Æ°u tiÃªn header hiá»‡n tu vi
            const el = document.querySelector('#head_manage_acc');
            const text = (el?.textContent || '').trim();
            let num = text.match(/\d+/);
            if (num) {
                this.selfTuViCache = parseInt(num[0]);
                return this.selfTuViCache;
            }
            // fallback: quÃ©t body (trÆ°á»ng há»£p UI Ä‘á»•i)
            const bodyText = (document.body?.innerText || '').slice(0, 5000);
            num = bodyText.match(/Tu\s*Vi\s*[:ï¼š]?\s*(\d+)/i) || bodyText.match(/(\d{6,})/);
            if (num) {
                this.selfTuViCache = parseInt(num[1] || num[0]);
                return this.selfTuViCache;
            }
            return null;
        }

        async getProfileTier(userId) {
            if (!userId) return null;
            try {
                const res = await fetch(`${weburl}profile/${userId}/`);
                if (!res.ok) return null;

                const text = await res.text(); // pháº£i await
                const doc = new DOMParser().parseFromString(text, 'text/html');

                const h4 = doc.querySelector('.um-name h4');
                if (!h4) return null;

                // láº¥y text tá»« <b> náº¿u cÃ³, náº¿u khÃ´ng fallback div (class thay Ä‘á»•i má»—i id) / h4
                const raw = h4.querySelector('b')?.textContent
                    || h4.querySelector('div[class*="color_"]')?.textContent
                    || h4.querySelector('div')?.textContent
                    || h4.textContent
                    || "";
                console.log(`Láº¥y cáº£nh giá»›i cho userId ${userId}:`, raw.trim());
                return raw.trim();
            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (láº¥y cáº£nh giá»›i):`, e);
                return null;
            }
        }

        winRate(selfTuVi, opponentTuVi) {
            if (!selfTuVi || !opponentTuVi) return -1;
            if (typeof selfTuVi !== 'number' || typeof opponentTuVi !== 'number') return -1;
            if (selfTuVi <= 0 || opponentTuVi <= 0) return -1;
            if (selfTuVi >= 10 * opponentTuVi) return 100;
            if (opponentTuVi >= 10 * selfTuVi) return 0;
            let winChance = 50;
            const diff = selfTuVi - opponentTuVi;
            const ratio = diff > 0 ? selfTuVi / opponentTuVi : opponentTuVi / selfTuVi;
            const factor = ratio >= 8 ? 1 : ratio >= 7 ? 0.9 : ratio >= 6 ? 0.8 :
                ratio >= 5 ? 0.7 : ratio >= 4 ? 0.6 : ratio >= 3 ? 0.5 :
                    ratio >= 2 ? 0.4 : 0.3;
            winChance += (diff / 1000) * factor;
            return Math.max(0, Math.min(100, winChance));
        }

        async upsertTuViInfo(btn, userId, opponentTuVi, myTuVi) {
            const cls = 'hh3d-tuvi-info';
            const next = btn.nextElementSibling;
            const opponentTuViText = typeof opponentTuVi === 'number' ? opponentTuVi : 'Unknown';

            // Táº¡o ná»™i dung HTML má»™t láº§n duy nháº¥t
            const rate = this.winRate(myTuVi, opponentTuVi).toFixed(2);
            const rateNumber = parseFloat(rate);
            let rateColor;
            if (rateNumber === -1) {
                rateColor = '#808080'; // Grey
            }
            else if (rateNumber < 25) {
                rateColor = '#ff5f5f'; // Red
            } else if (rateNumber > 75) {
                rateColor = '#00ff00'; // Green
            } else {
                rateColor = '#ffff00ff'; // White
            }

            let displayRate = rate;
            if (rateNumber === 0.00) {
                displayRate = '0';
            } else if (rateNumber === 100.00) {
                displayRate = '100';
            } else if (rateNumber === -1) {
                displayRate = 'KhÃ´ng rÃµ';
            }
            let innerHTMLContent = '';
            if (myTuVi <= 10 * opponentTuVi) {
                innerHTMLContent = `
                <p><strong>Tu Vi:</strong> <span style="font-weight: bold; color: #ffff00ff;">${opponentTuViText}</span></p>
                <p><strong>Tá»· Lá»‡ Tháº¯ng:</strong> <span style="font-weight: bold; color: ${rateColor};">${displayRate}%</span></p>
            `;
            } else {
                innerHTMLContent = `
                <p><strong>Tu Vi:</strong> <span style="font-weight: bold; color: #ffff00ff;">${opponentTuViText}</span></p>
                <p><span style="font-weight: bold; color: #00ff00ff;">KhÃ´ng tá»‘n lÆ°á»£t</span></p>
            `;
            }

            if (next && next.classList.contains(cls) && next.dataset.userId === String(userId)) {
                next.innerHTML = innerHTMLContent;
                return;
            }

            document.querySelectorAll(`.${cls}[data-user-id="${userId}"]`).forEach(el => {
                if (el !== next) el.remove();
            });

            const info = document.createElement('div');
            info.className = cls;
            info.dataset.userId = String(userId);
            info.style.fontSize = '12px';
            info.style.color = '#fff';
            info.style.marginTop = '3px';
            info.style.backgroundColor = 'none';
            info.style.padding = '0px 0px';
            info.style.border = 'none';

            // Sá»­ dá»¥ng biáº¿n Ä‘Ã£ táº¡o á»Ÿ trÃªn
            info.innerHTML = innerHTMLContent;

            btn.insertAdjacentElement('afterend', info);
        }

        async upsertTierInfo(btn, userId) {
            const cls = 'hh3d-tuvi-info';
            const next = btn.nextElementSibling;
            const tierText = await this.getProfileTier(userId);
            console.log(`UserID: ${userId}, Tier: ${tierText}`);
            if (!tierText) return;
            if (next && next.classList.contains(cls) && next.dataset.userId === String(userId)) {
                next.innerHTML = `<p><strong>Cáº£nh giá»›i:</strong> <span style="font-weight: bold; color: #ffff00ff;">${tierText}</span></p>`;
                return;
            }

            document.querySelectorAll(`.${cls}[data-user-id="${userId}"]`).forEach(el => {
                if (el !== next) el.remove();
            });
            const info = document.createElement('div');
            info.className = cls;
            info.dataset.userId = String(userId);
            info.style.fontSize = '12px';
            info.style.color = '#fff';
            info.style.marginTop = '3px';
            info.style.backgroundColor = 'none';
            info.style.padding = '0px 0px';
            info.style.border = 'none';
            info.innerHTML = `<p><strong>Cáº£nh giá»›i:</strong> <span style="font-weight: bold; color: #ffff00ff;">${tierText}</span></p>`;
            btn.insertAdjacentElement('afterend', info);
        }

        async getUsersInMine(mineId) {
            let securityToken = null;

            // CÃ¡ch 1: Láº¥y tá»« unsafeWindow (Biáº¿n tháº­t cá»§a trang web)
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow.hh3dData && unsafeWindow.hh3dData.securityToken) {
                securityToken = unsafeWindow.hh3dData.securityToken;
            }
            // CÃ¡ch 2: Láº¥y tá»« hData
            else if (typeof hData !== 'undefined' && hData.securityToken) {
                securityToken = hData.securityToken;
            }

            // CÃ¡ch 3: Náº¿u váº«n null -> Gá»i hÃ m quÃ©t (Fallback cuá»‘i cÃ¹ng)
            if (!securityToken) {
                console.log(`${this.logPrefix} âš ï¸ Token biáº¿n global bá»‹ thiáº¿u, Ä‘ang fetch láº¡i...`);
                // Gá»i hÃ m getSecurityToken chÃºng ta Ä‘Ã£ viáº¿t á»Ÿ trÃªn
                securityToken = await getSecurityToken(this.khoangMachUrl || window.location.href);
            }
            this.nonceGetUserInMine = await this.getNonceGetUserInMine();

            if (!this.nonceGetUserInMine || !securityToken) {
                let errorMsg = 'Lá»—i (get_users):';
                if (!this.nonceGetUserInMine) errorMsg += " Nonce (security) chÆ°a Ä‘Æ°á»£c cung cáº¥p.";
                if (!securityToken) errorMsg += " KhÃ´ng tÃ¬m tháº¥y 'security_token' (hh3dData).";

                showNotification(errorMsg, 'error');
                return null;
            }

            const payload = new URLSearchParams({
                action: hData && hData.act ? hData.act.kmUsers : 'get_users_in_mine',
                mine_id: mineId,
                security_token: securityToken,
                security: this.nonceGetUserInMine
            });

            try {
                const r = await fetch(ajaxUrl, {
                    method: 'POST',
                    headers: this.headers,
                    body: payload,
                    credentials: 'include'
                });
                const d = await r.json();
                console.log(`${this.logPrefix} Dá»¯ liá»‡u ngÆ°á»i chÆ¡i trong má»:`, d);
                return d.success ? d.data : (showNotification(d.message || 'Lá»—i láº¥y thÃ´ng tin ngÆ°á»i chÆ¡i.', 'error'), null);

            } catch (e) {
                console.error(`${this.logPrefix} âŒ Lá»—i máº¡ng (láº¥y user):`, e);
                return null;
            }
        }

        // async getTuVi(userId) {
        //     // 0. Chuáº©n bá»‹ Nonce & Headers
        //     if (!this.nonce) {
        //         this.nonce = await this.getNonce();
        //     }
        //     const nonce = this.nonce;
        //     if (!nonce) return null;

        //     const headers = {
        //         "Content-Type": "application/json",
        //         "X-WP-Nonce": nonce
        //     };
        //     const targetId = String(userId);

        //     // ============================================================
        //     // ðŸŸ¢ CÃCH 1: LOGIC CÅ¨ (GIá»® NGUYÃŠN Báº¢N Gá»C)
        //     // ============================================================
        //     try {
        //         const res = await fetch(`${weburl}/wp-json/luan-vo/v1/search-users`, {
        //             method: "POST",
        //             headers: headers,
        //             body: JSON.stringify({ query: targetId, page: 1 }),
        //             credentials: "include",
        //             mode: "cors"
        //         });

        //         // Logic gá»‘c: Láº¥y user Ä‘áº§u tiÃªn trong danh sÃ¡ch (users[0])
        //         const points = res.ok ? (await res.json())?.data?.users?.[0]?.points ?? null : null;

        //         // Náº¿u tÃ¬m tháº¥y Ä‘iá»ƒm -> Tráº£ vá» luÃ´n
        //         if (points !== null && points !== undefined) {
        //             return points;
        //         }
        //     } catch (e) {
        //         // Lá»—i á»Ÿ cÃ¡ch 1 -> Bá» qua Ä‘á»ƒ cháº¡y xuá»‘ng cÃ¡ch 2
        //     }

        //     // ============================================================
        //     // ðŸ”´ CÃCH 2: FALLBACK (FOLLOW -> SCAN -> UNFOLLOW)
        //     // Chá»‰ cháº¡y khi CÃ¡ch 1 tráº£ vá» null hoáº·c lá»—i
        //     // ============================================================
        //     // console.log(`[GetTuVi] CÃ¡ch 1 tháº¥t báº¡i, Ä‘ang dÃ¹ng Fallback cho ID ${targetId}...`);

        //     let tuVi = null;

        //     try {
        //         // B2.1: Follow
        //         await fetch(`${weburl}/wp-json/luan-vo/v1/follow`, {
        //             method: "POST",
        //             headers: headers,
        //             body: JSON.stringify({ followed_user_id: targetId }),
        //             credentials: "include",
        //             mode: "cors"
        //         });

        //         // B2.2: Láº¥y danh sÃ¡ch Following
        //         const resList = await fetch(`${weburl}/wp-json/luan-vo/v1/get-following-users`, {
        //             method: "POST",
        //             headers: headers,
        //             body: JSON.stringify({ page: 1 }),
        //             credentials: "include",
        //             mode: "cors"
        //         });

        //         if (resList.ok) {
        //             const jsonList = await resList.json();
        //             if (jsonList.success && jsonList.data && Array.isArray(jsonList.data.users)) {
        //                 // á»ž danh sÃ¡ch follow thÃ¬ pháº£i tÃ¬m chÃ­nh xÃ¡c ID káº»o láº¥y nháº§m ngÆ°á»i khÃ¡c
        //                 const targetUser = jsonList.data.users.find(u => String(u.id) === targetId);
        //                 if (targetUser) {
        //                     tuVi = targetUser.points;
        //                 }
        //             }
        //         }

        //     } catch (e) {
        //         console.error(`[GetTuVi] Fallback lá»—i:`, e);
        //     } finally {
        //         // B2.3: Unfollow (LuÃ´n cháº¡y Ä‘á»ƒ dá»n rÃ¡c)
        //         try {
        //             await fetch(`${weburl}/wp-json/luan-vo/v1/unfollow`, {
        //                 method: "POST",
        //                 headers: headers,
        //                 body: JSON.stringify({ unfollow_user_id: targetId }),
        //                 credentials: "include",
        //                 mode: "cors"
        //             });
        //         } catch (ignore) {}
        //     }

        //     return tuVi;
        // }

        async showTotalEnemies(mineId) {
            const data = await this.getUsersInMine(mineId);
            const currentMineUsers = data && data.users ? data.users : [];
            let totalEnemies = 0;
            let totalLienMinh = 0;
            let totalDongMon = 0;
            const myTuVi = await this.getSelfTuVi();
            let isInMine = currentMineUsers.some(user => user.id.toString() === accountId.toString());
            for (let user of currentMineUsers) {
                if (user.dong_mon) {
                    totalDongMon++;
                } else if (user.lien_minh) {
                    totalLienMinh++;
                } else {
                    totalEnemies++;
                }
            }


            const bonus_display = document.querySelector('#bonus-display');
            const batquai_section = document.querySelector('#batquai-section');
            const pagination = document.querySelector('.pagination');
            const page_indicator = document.querySelector('#page-indicator');
            if (bonus_display) {
                let existingInfo = document.querySelector('.hh3d-mine-info');
                if (!existingInfo) {
                    existingInfo = document.createElement('div');
                    existingInfo.className = 'hh3d-mine-info';
                    //existingInfo.style.right = '5px';
                    existingInfo.style.fontSize = '11px';
                    existingInfo.style.color = '#fff';
                    existingInfo.style.marginLeft = '-1px';
                    existingInfo.style.backgroundColor = 'none';
                    existingInfo.style.padding = '0px 0px';
                    existingInfo.style.border = 'none';
                    existingInfo.style.textAlign = 'left';
                    existingInfo.style.fontFamily = 'Font Awesome 5 Free';
                    bonus_display.prepend(existingInfo);
                    bonus_display.style.display = 'block';
                    batquai_section.style.display = 'block';
                    const observer = new MutationObserver(() => {
                        bonus_display.style.display = 'block';
                        batquai_section.style.display = 'block';
                        pagination.style.display = 'block';
                        page_indicator.style.display = 'block';
                    });
                    observer.observe(bonus_display, { attributes: true, attributeFilter: ['style'] });
                    observer.observe(batquai_section, { attributes: true, attributeFilter: ['style'] });
                    observer.observe(pagination, { attributes: true, attributeFilter: ['style'] });
                    observer.observe(page_indicator, { attributes: true, attributeFilter: ['style'] });
                }

                existingInfo.innerHTML = `
                    <h style="color: #ff5f5f;">ðŸ©¸Káº» Ä‘á»‹ch: <b>${totalEnemies}</b></h><br>
                    <h style="color: #ffff00;">ðŸ¤LiÃªn Minh: <b>${totalLienMinh}</b></h><br>
                    <h style="color: #9c59bdff;">â˜¯ï¸Äá»“ng MÃ´n: <b>${totalDongMon}</b></h>
                `;
            }
        }

        async addEventListenersToReloadBtn(mineId) {
            const reloadBtn = document.querySelector('#reload-btn');
            if (reloadBtn && !reloadBtn.dataset.listenerAdded) {
                reloadBtn.addEventListener('click', async () => {
                    this.showTotalEnemies(mineId);
                });
                reloadBtn.dataset.listenerAdded = 'true';
            }
        }

        async addEventListenersToMines() {
            const mineImages = document.querySelectorAll(this.mineImageSelector);
            mineImages.forEach(image => {
                if (!image.dataset.listenerAdded) {
                    image.addEventListener('click', async (event) => {
                        const mineId = event.currentTarget.getAttribute('data-mine-id');
                        if (mineId) {
                            this.showTotalEnemies(mineId);
                            this.addEventListenersToReloadBtn(mineId);
                        }
                    });
                    image.dataset.listenerAdded = 'true';
                }
            });
        }
        async decodeAvatar(encoded, viewerId) {
            try {
                // â­ Validate input
                if (!encoded || typeof encoded !== 'string') {
                    return null;
                }

                const key = (viewerId % 251) + 1;
                // â­ Browser khÃ´ng cÃ³ Buffer, dÃ¹ng atob() Ä‘á»ƒ decode Base64
                const raw = atob(encoded);
                let result = '';
                for (let i = 0; i < raw.length; i++) {
                    result += String.fromCharCode(raw.charCodeAt(i) ^ (key ^ (i % 7)));
                }
                return result;
            } catch (e) {
                console.error('decodeAvatar error:', e, 'Input:', encoded);
                return null;
            }
        }

        async showTuVi(myTuVi) {
            if (!myTuVi) return;

            const rows = document.querySelectorAll('.user-row');
            for (const row of rows) {
                if (row.dataset.tuviAttached === '1') continue;
                row.dataset.tuviAttached = '1';

                // Láº¥y userId tá»« href profile hoáº·c src avatar
                const profileLink = row.querySelector('a[href*="/profile/"]');
                const avatarImg = row.querySelector('img[src*="/ultimatemember/"]');
                let userId = null;
                if (profileLink) {
                    const m = profileLink.getAttribute('href').match(/\/profile\/(\d+)/);
                    if (m) userId = m[1];
                }
                if (!userId && avatarImg) {
                    const m = avatarImg.getAttribute('src').match(/\/ultimatemember\/(\d+)\//);
                    if (m) userId = m[1];
                }
                if (!userId) continue;
                // console.log(`Äang xá»­ lÃ½ userId ${userId}...`);

                const btn = row.querySelector('.attack-btn');

                try {
                    await new Promise(r => setTimeout(r, 500));
                    if (btn) this.upsertTierInfo(btn, userId);
                } catch (e) {
                    console.error('getTuVi error', e);
                }

                if (btn) {
                    const mineId = btn.getAttribute('data-mine-id');
                    if (mineId && mineId !== this.currentMineId) {
                        this.currentMineId = mineId;
                        this.showTotalEnemies(mineId);
                        this.addEventListenersToReloadBtn(mineId);
                    }
                }
                // nghá»‰ 1s trÃ¡nh spam
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        async startUp() {
            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
            }
            this.nonceGetUserInMine = await this.getNonceGetUserInMine();
            this.nonce = await this.getNonce();
            await this.waitForElement('#head_manage_acc', 15000);

            const getMyTuVi = async () => {
                const v = await this.getSelfTuVi(true);
                return v;
            };

            const firstTuVi = await getMyTuVi();
            if (firstTuVi) {
                await this.showTuVi(firstTuVi);
            }

            // quan sÃ¡t DOM Ä‘á»ƒ cáº­p nháº­t khi cÃ¡c nÃºt attack xuáº¥t hiá»‡n hoáº·c ná»™i dung thay Ä‘á»•i
            let __timeout = null;
            const observer = new MutationObserver(() => {
                clearTimeout(__timeout);
                __timeout = setTimeout(async () => {
                    const latest = await getMyTuVi();
                    await this.showTuVi(latest);
                }, 200);
            });
            observer.observe(document.body, { childList: true, subtree: true });

            this.addEventListenersToMines();
            // MutationObserver chÃ­nh Ä‘á»ƒ thÃªm listener cho cÃ¡c má» má»›i
            const mainObserver = new MutationObserver(() => {
                this.addEventListenersToMines();
            });

            mainObserver.observe(document.body, { childList: true, subtree: true });
        }
    }
    // ===============================================
    // Bá»™ lá»c tÃ´ng mÃ´n
    // ===============================================
    async function getDivContent(url, selector) {
        const logPrefix = '[HH3D Auto]';

        console.log(`${logPrefix} â–¶ï¸ Äang táº£i trang tá»« ${url} Ä‘á»ƒ láº¥y ná»™i dung...`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();

            // Sá»­ dá»¥ng DOMParser Ä‘á»ƒ phÃ¢n tÃ­ch mÃ£ HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // TÃ¬m pháº§n tá»­ báº±ng selector
            const element = doc.querySelector(selector);

            if (element) {
                const content = element.innerHTML;
                console.log(`${logPrefix} âœ… ÄÃ£ trÃ­ch xuáº¥t thÃ nh cÃ´ng ná»™i dung: ${content}`);
                return content;
            } else {
                console.error(`${logPrefix} âŒ KhÃ´ng tÃ¬m tháº¥y pháº§n tá»­ vá»›i bá»™ chá»n: ${selector}`);
                return null;
            }
        } catch (e) {
            console.error(`${logPrefix} âŒ Lá»—i khi táº£i trang hoáº·c trÃ­ch xuáº¥t ná»™i dung:`, e);
            return null;
        }
    }

    // â­ HÃ€M Láº¤Y ID TÃ”NG MÃ”N Tá»ª URL áº¢NH
    async function getTongMonId(url) {
        const logPrefix = '[HH3D Auto]';
        // console.log(`${logPrefix} â–¶ï¸ Äang láº¥y ID tÃ´ng mÃ´n tá»« ${url}...`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // TÃ¬m áº£nh tÃ´ng mÃ´n trong link: <img src=".../group-image/628390.jpg?t=...">
            const link = doc.querySelector('.tm-guild-avatar-link');

            if (link) {
                const img = link.querySelector('img');
                if (img && img.src) {
                    // Extract ID tá»« URL áº£nh: .../group-image/628390.jpg â†’ 628390
                    const match = img.src.match(/\/group-image\/(\d+)\.jpg/);
                    if (match && match[1]) {
                        const tongMonId = match[1];
                        // console.log(`${logPrefix} âœ… ÄÃ£ láº¥y ID tÃ´ng mÃ´n: ${tongMonId}`);

                        // Láº¥y tÃªn tÃ´ng mÃ´n tá»« alt cá»§a img
                        localStorage.setItem('tm_name', img.alt ? img.alt.trim() : 'KhÃ´ng rÃµ');
                        console.log(`${logPrefix} ðŸ·ï¸ TÃªn tÃ´ng mÃ´n: ${img.alt} = ${localStorage.getItem('tm_name')}`);

                        return tongMonId;
                    }
                }
            }
            console.error(`${logPrefix} âŒ KhÃ´ng tÃ¬m tháº¥y ID tÃ´ng mÃ´n`);
            return null;
        } catch (e) {
            console.error(`${logPrefix} âŒ Lá»—i khi láº¥y ID tÃ´ng mÃ´n:`, e);
            return null;
        }
    }

    async function kiemTraIdTong(tongMonId) {
        try {
            // Gá»i GitHub Ä‘á»ƒ láº¥y danh sÃ¡ch ID tÃ´ng mÃ´n há»£p lá»‡: ["628390", "123456", ...]
            const response = await fetch('https://raw.githubusercontent.com/krizk-tool/hh3d-tool/main/tm_hop_le.json');

            if (!response.ok) {
                throw new Error(`KhÃ´ng thá»ƒ kiá»ƒm tra tÃ´ng mÃ´n: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Response.json() Ä‘Ã£ tráº£ vá» array trá»±c tiáº¿p: ["628390", "123456", ...]
            if (!data || !Array.isArray(data)) {
                throw new Error("KhÃ´ng tÃ¬m tháº¥y danh sÃ¡ch tÃ´ng mÃ´n Ä‘Æ°á»£c phÃ©p.");
            }

            const danhSachTongId = data;
            // console.log(`[HH3D Auto] Danh sÃ¡ch ID tÃ´ng mÃ´n há»£p lá»‡ Ä‘Ã£ táº£i: ${danhSachTongId.length} tÃ´ng mÃ´n.`);
            // console.log(`[HH3D Auto] Danh sÃ¡ch ID tÃ´ng mÃ´n: ${danhSachTongId.join(', ')}`);

            if (!tongMonId) {
                console.error('[HH3D Auto] âŒ ID tÃ´ng mÃ´n trá»‘ng');
                return false;
            }

            // Chuáº©n hÃ³a ID: trim vÃ  chuyá»ƒn thÃ nh string
            const idChuanHoa = String(tongMonId).trim();
            // console.log(`[HH3D Auto] ID tÃ´ng mÃ´n sau khi chuáº©n hÃ³a: "${idChuanHoa}"`);
            // Kiá»ƒm tra tá»“n táº¡i - so sÃ¡nh trá»±c tiáº¿p vá»›i danh sÃ¡ch ID (as string)
            const isExist = danhSachTongId.some(id => String(id) === idChuanHoa);
            // console.log(`[HH3D Auto] Káº¿t quáº£ kiá»ƒm tra: ID "${idChuanHoa}" ${isExist ? 'TÃŒM THáº¤Y' : 'KHÃ”NG TÃŒM THáº¤Y'} trong danh sÃ¡ch`);

            return isExist;

        } catch (error) {
            console.error('Lá»—i khi kiá»ƒm tra tÃ´ng:', error);
            return false;
        }
    }

    async function checkTongMon() {
        // Láº¥y ID tÃ´ng mÃ´n tá»« URL áº£nh (628390.jpg) thay vÃ¬ tÃªn
        const tongMonId = await getTongMonId(weburl + 'danh-sach-thanh-vien-tong-mon?t=' + Date.now());
        // console.log(`[HH3D Auto] ID tÃ´ng mÃ´n hiá»‡n táº¡i: ${tongMonId}`);

        if (!tongMonId) {
            console.error('[HH3D Auto] âŒ KhÃ´ng láº¥y Ä‘Æ°á»£c ID tÃ´ng mÃ´n');
            return false;
        }

        const isValid = await kiemTraIdTong(tongMonId);
        console.log(`[HH3D Auto] TÃ´ng mÃ´n ${isValid ? 'há»£p lá»‡' : 'khÃ´ng há»£p lá»‡'}.`);

        if (isValid) {
            return true;
        } else {
            // XÃ³a menu náº¿u tÃ´ng mÃ´n khÃ´ng há»£p lá»‡
            const menuWrapper = document.querySelector('.custom-script-item-wrapper');
            if (menuWrapper) {
                menuWrapper.remove();
                console.log('[HH3D Auto] ðŸ—‘ï¸ ÄÃ£ xÃ³a menu do tÃ´ng mÃ´n khÃ´ng há»£p lá»‡');
            }
            // showNotification("[HH3D Auto] âš ï¸ TÃ´ng mÃ´n khÃ´ng há»£p lá»‡. KhÃ´ng thá»ƒ tiáº¿p tá»¥c sá»­ dá»¥ng script.", "error", 10000);
            return false;
        }
    }



    // ===============================================
    // KHá»žI Äá»˜NG CHÆ¯Æ NG TRÃŒNH
    // ===============================================
    // if(await checkTongMon()) {
    //     console.log("[HH3D Auto] âœ… TÃ´ng mÃ´n há»£p lá»‡, tiáº¿p tá»¥c khá»Ÿi Ä‘á»™ng script...");
    //     showNotification("[HH3D Auto] âœ… TÃ´ng mÃ´n há»£p lá»‡, tiáº¿p tá»¥c khá»Ÿi Ä‘á»™ng script...", "success");
    // } else {
    //     console.warn("[HH3D Auto] âš ï¸ TÃ´ng mÃ´n khÃ´ng há»£p lá»‡, vui lÃ²ng tham gia tÃ´ng mÃ´n há»£p lá»‡ Ä‘á»ƒ sá»­ dá»¥ng script.");
    //     showNotification("[HH3D Auto] âš ï¸ TÃ´ng mÃ´n khÃ´ng há»£p lá»‡, vui lÃ²ng tham gia tÃ´ng mÃ´n há»£p lá»‡ Ä‘á»ƒ sá»­ dá»¥ng script.", "error", 10000);
    //     return; // Dá»«ng khá»Ÿi Ä‘á»™ng script náº¿u tÃ´ng mÃ´n khÃ´ng há»£p lá»‡
    // }

    // ......
    // náº¿u xÃ³a pháº§n check tÃ´ng mÃ´n thÃ¬ gá»i riÃªng pháº§n láº¥y ID tÃ´ng mÃ´n Ä‘á»ƒ lÆ°u tÃªn tÃ´ng mÃ´n vÃ o localStorage vÃ  hiá»ƒn thá»‹ á»Ÿ UI
    await getTongMonId(weburl + 'danh-sach-thanh-vien-tong-mon?t=' + Date.now());

    // ===============================================
    // KHá»žI Táº O SCRIPT
    // ===============================================
    const taskTracker = new TaskTracker();
    accountId = await getAccountId();
    if (accountId) {
        let accountData = taskTracker.getAccountData(accountId);
        // console.log(`[HH3D] âœ… Account ID: ${accountId}`);
        // console.log(`[HH3D] âœ… ÄÃ£ láº¥y dá»¯ liá»‡u tÃ i khoáº£n: ${JSON.stringify(accountData)}`);
    } else {
        console.warn("[HH3D] âš ï¸ KhÃ´ng thá»ƒ láº¥y ID tÃ i khoáº£n.");
    }

    const securityToken = await getSecurityToken();
    if (!securityToken) {
        showNotification("[HH3D] âš ï¸ KhÃ´ng thá»ƒ láº¥y security token.", "error");
    }

    // Khá»Ÿi táº¡o cÃ¡c class
    const vandap = new VanDap();
    const dothach = new DoThach();
    const hoangvuc = new HoangVuc();
    // const luanvo = new LuanVo();
    const bicanh = new BiCanh();
    const bicanhhiente = new BiCanhHienTe();
    const khoangmach = new KhoangMach();
    const hienTuviKM = new hienTuviKhoangMach();
    const hoatdongngay = new HoatDongNgay();
    const tanghoa = new TangHoa();
    // await tanghoa.init();

    const hvmuaruong = new HoangVucShop();

    const luyendan = new LuyenDan();

    if (securityToken) {
        console.log("[HH3D Auto] ÄÃ£ láº¥y thÃ nh cÃ´ng token, tá»± Ä‘á»™ng kiá»ƒm tra tiáº¿n Ä‘á»™ luyá»‡n Ä‘an...");
        luyendan.doLuyenDan().catch(err => {
            console.error("[HH3D Auto] Lá»—i khi cháº¡y luyá»‡n Ä‘an ban Ä‘áº§u:", err);
        });
    }

    // Khá»Ÿi táº¡o vÃ  cháº¡y UI
    const uiStyles = new UIMenuStyles();
    uiStyles.addStyles();

    const createUI = new UIInitializer(".load-notification.relative", LINK_GROUPS, accountId);
    createUI.start();

    const tienduyen = new TienDuyen();
    //await tienduyen.init();

    const automatic = new AutomationManager();
    window.hh3dAutomatic = automatic; // Save to window for access from UI
    window.isRunning = null; // null = chÆ°a cháº¡y, true = Ä‘ang cháº¡y, false = Ä‘Ã£ dá»«ng

    // Äá»£i 1000ms Ä‘á»ƒ UI á»•n Ä‘á»‹nh
    await new Promise(resolve => setTimeout(resolve, 1000));

    automatic.checkAndStart();
    if (location.pathname.includes("khoang-mach") || location.href.includes("khoang-mach")) {
        hienTuviKM.startUp();
    }
})();

