// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";
export default defineNuxtConfig({
   compatibilityDate: "2025-07-28",
   devtools: { enabled: true },
   modules: [
      "nuxt-swiper",
      "@nuxtjs/i18n",
      "@pinia/nuxt",
      "nuxt-aos",
      "@nuxtjs/sitemap",
   ],
   app: {
      head: {
         bodyAttrs: {
            class: process.env.SITE_NAME,
         },
         link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
         meta: [
            {
               name: "google-site-verification",
               content: "sRh1VoGKprDmSVJeuh-R3hFEAJBy9A1uYPzh7IS8PxA",
            },
            {
               name: "og-type",
               content: "article",
            },
            {
               name: "og-image-width",
               content: 200,
            },
            {
               name: "og-image-height",
               content: 200,
            },
            {
               name: "og-url",
               content: process.env.SITE_BASE_URL,
            },
         ],
         style: [
            {
               id: 'al-css',
               innerHTML: `
            #al{--mq:22s;position:fixed;inset:0;z-index:9999;overflow:hidden;background:#0f1e5c;pointer-events:auto}
            #al .al-p{position:absolute;inset:0;background:linear-gradient(148deg,#1d4ed8 0%,#1e3a8a 44%,#0f1e5c 100%);transform:translateY(0%);transition:transform 700ms cubic-bezier(0.76,0,0.24,1);will-change:transform}
            #al .o{position:absolute;border-radius:50%;filter:blur(72px);pointer-events:none}
            #al .o1{width:560px;height:560px;top:-160px;left:-110px;background:radial-gradient(circle,rgba(96,165,250,.24),transparent 68%);animation:oF1 11s ease-in-out infinite}
            #al .o2{width:380px;height:380px;bottom:30px;right:-70px;background:radial-gradient(circle,rgba(147,197,253,.17),transparent 68%);animation:oF2 14s ease-in-out infinite}
            #al .o3{width:240px;height:240px;top:38%;left:60%;background:radial-gradient(circle,rgba(30,64,175,.2),transparent 68%);animation:oF1 9s ease-in-out infinite reverse}
            @keyframes oF1{0%,100%{transform:translate(0,0)}50%{transform:translate(24px,-38px)}}
            @keyframes oF2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,24px)}}
            #al .grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.28;mix-blend-mode:overlay;pointer-events:none;animation:gD 9s steps(2) infinite;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")}
            @keyframes gD{0%{transform:translate(0,0)}25%{transform:translate(-2%,1%)}50%{transform:translate(1%,-2%)}75%{transform:translate(-1%,2%)}100%{transform:translate(0,0)}}
            #al .shim{position:absolute;inset:0;pointer-events:none;overflow:hidden}
            #al .shim::after{content:'';position:absolute;top:-60%;left:-30%;width:60%;height:220%;background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.05) 50%,transparent 100%);animation:shim 3.4s ease-in-out infinite}
            @keyframes shim{0%,100%{transform:translateX(-30%)}50%{transform:translateX(230%)}}
            #al .al-c{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding-bottom:90px;pointer-events:none;transition:opacity 280ms ease,transform 280ms cubic-bezier(.4,0,1,1)}
            #al .logo{position:relative;width:92px;height:92px;border-radius:26px;background:rgba(255,255,255,.07);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.16);box-shadow:0 0 0 1px rgba(255,255,255,.06),0 24px 56px rgba(0,0,0,.38),0 6px 18px rgba(59,130,246,.3),inset 0 1px 0 rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;animation:lP 560ms cubic-bezier(.18,.86,.25,1) both}
            @keyframes lP{from{transform:scale(.68) translateY(18px);opacity:0}65%{transform:scale(1.06) translateY(-3px);opacity:1}to{transform:scale(1) translateY(0);opacity:1}}
            #al .ring{position:absolute;inset:0;border-radius:26px;border:1px solid rgba(147,197,253,.35);animation:ringP 2.4s ease-out .5s infinite;pointer-events:none}
            @keyframes ringP{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}
            #al .ttl{display:flex;gap:12px;align-items:baseline}
            #al .ttl span{font-family:'Gill Sans','Gill Sans MT',Optima,Candara,sans-serif;font-size:clamp(26px,5.5vw,42px);font-weight:300;letter-spacing:.09em;color:rgba(255,255,255,.93);text-transform:uppercase;animation:fU 620ms cubic-bezier(.18,.86,.25,1) .12s both}
            #al .ttl .ac{font-weight:800;color:#93c5fd;letter-spacing:.14em;animation-delay:.22s}
            @keyframes fU{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}
            #al .tag{font-family:'Gill Sans','Gill Sans MT',Optima,Candara,sans-serif;font-size:11px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.38);animation:fU 500ms ease .38s both}
            #al .pb{width:140px;height:2px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;animation:fU 400ms ease .45s both}
            #al .pf{height:100%;border-radius:99px;background:linear-gradient(90deg,#3b82f6,#93c5fd,#3b82f6);background-size:200% 100%;box-shadow:0 0 12px rgba(96,165,250,.6);animation:pF 2.2s cubic-bezier(.4,0,.2,1) .4s both,pShim 1.6s linear .4s infinite}
            @keyframes pF{from{width:0}to{width:100%}}
            @keyframes pShim{0%{background-position:100% 0}100%{background-position:-100% 0}}
            #al .mb{position:absolute;bottom:0;left:0;right:0;z-index:3;background:rgba(255,255,255,.038);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.09);transition:transform 700ms cubic-bezier(0.76,0,0.24,1),opacity 200ms ease}
            #al .mr{overflow:hidden;height:38px;display:flex;align-items:center}
            #al .mr2{background:rgba(0,0,0,.07);border-top:1px solid rgba(255,255,255,.06)}
            #al .mt{display:flex;white-space:nowrap;will-change:transform}
            #al .ltr{animation:sL var(--mq) linear infinite}
            #al .rtl{animation:sR var(--mq) linear infinite}
            @keyframes sL{from{transform:translateX(0)}to{transform:translateX(-50%)}}
            @keyframes sR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
            #al .mi{display:inline-block;white-space:nowrap;padding:0 8px;flex-shrink:0;font-family:'Gill Sans','Gill Sans MT',Optima,Candara,sans-serif;font-size:11px;font-weight:600;letter-spacing:.17em;text-transform:uppercase;color:rgba(255,255,255,.48);user-select:none}
            #al .mr2 .mi{color:rgba(255,255,255,.28);font-weight:400;font-size:10px}
            #al .el,#al .er{position:absolute;bottom:0;height:76px;width:120px;z-index:4;pointer-events:none}
            #al .el{left:0;background:linear-gradient(to right,#0f1e5c 30%,transparent)}
            #al .er{right:0;background:linear-gradient(to left,#0f1e5c 30%,transparent)}
            #al.al-hide .al-c{opacity:0;transform:scale(.96) translateY(-10px)}
            #al.al-hide .al-p{transform:translateY(100%)}
            #al.al-hide .mb{transform:translateY(100%);opacity:0}
            #al.al-hide .ring,#al.al-hide .o,#al.al-hide .grain,#al.al-hide .shim{opacity:0;transition:opacity 200ms ease}
            @media(max-width:480px){#al .logo{width:72px;height:72px;border-radius:20px}#al .ring{border-radius:20px}#al .mr{height:32px}#al .mi{font-size:10px}}
            @media(prefers-reduced-motion:reduce){#al *{animation:none!important}#al .al-p,#al .al-c,#al .mb{transition:none!important}#al.al-hide{display:none}#al .pf{width:100%}}
          `
            }
         ],

         // ── Loader HTML — <body> ochilishi bilan DARROV yaratiladi ───
         // tagPosition: 'bodyOpen' → Nuxt bu scriptni <body> ning
         // eng birinchi elementi sifatida render qiladi.
         // Vue / Nuxt bundle yuklanishini kutmaydi — 0ms da ishlaydi.
         script: [
            {
               tagPosition: 'bodyOpen',
               innerHTML: `(function(){
            var d=document,b=d.body;
            if(d.getElementById('al'))return;
            function row(txt,cls){
              var t=d.createElement('div');t.className='mt '+cls;
              for(var i=0;i<4;i++){var s=d.createElement('span');s.className='mi';s.innerHTML=txt;t.appendChild(s);}
              var r=d.createElement('div');r.className='mr'+(cls==='rtl'?' mr2':'');r.appendChild(t);return r;
            }
            var al=d.createElement('div');al.id='al';
            al.innerHTML=
              '<div class="al-p"></div>'+
              '<div class="grain"></div>'+
              '<div class="shim"></div>'+
              '<div class="o o1"></div>'+
              '<div class="o o2"></div>'+
              '<div class="o o3"></div>'+
              '<div class="al-c">'+
                '<div style="position:relative;display:flex;align-items:center;justify-content:center;">'+
                  '<div class="ring"></div>'+
                  '<div class="logo">'+
                    '<svg width="58" height="58" viewBox="0 0 58 58" fill="none">'+
                      '<defs><linearGradient id="alg" x1="0" y1="0" x2="1" y2="1">'+
                        '<stop offset="0%" stop-color="#bfdbfe"/>'+
                        '<stop offset="100%" stop-color="#3b82f6"/>'+
                      '</linearGradient></defs>'+
                      '<rect width="58" height="58" rx="15" fill="url(#alg)" opacity=".95"/>'+
                      '<text x="50%" y="54%" text-anchor="middle" fill="white" font-size="22" font-family="Gill Sans,Optima,Candara,sans-serif" font-weight="700" dominant-baseline="middle">SM</text>'+
                    '</svg>'+
                  '</div>'+
                '</div>'+
                '<div class="ttl"><span>Salomatlik</span><span class="ac">maskani</span></div>'+
                '<div class="tag">Sog\u02bcliq \u00b7 Shifo \u00b7 Hayot</div>'+
                '<div class="pb"><div class="pf"></div></div>'+
              '</div>'+
              '<div class="el"></div><div class="er"></div>';
            var mb=d.createElement('div');mb.className='mb';
            mb.appendChild(row('Salomatlik maskani \u00a0\u2726\u00a0 Sog\u02bcliq \u00a0\u2726\u00a0 Shifo \u00a0\u2726\u00a0 Hayot \u00a0\u2726\u00a0','ltr'));
            mb.appendChild(row('Health \u00a0\u25c6\u00a0 Wellness \u00a0\u25c6\u00a0 Care \u00a0\u25c6\u00a0 Vitality \u00a0\u25c6\u00a0 Balance \u00a0\u25c6\u00a0','rtl'));
            al.appendChild(mb);
            b.insertBefore(al,b.firstChild);
          })()`
            }
         ]
      },
   },
   i18n: {
      locales: [
         {
            code: "uz",
            name: "O'zbekcha",
            file: "uz.ts",
         },
         {
            code: "en",
            name: "English",
            file: "en.ts",
         },
         {
            code: "ru",
            name: "Русский",
            file: "ru.ts",
         },
      ],
      defaultLocale: "uz",
      langDir: "constants/locales/",
      strategy: "prefix_and_default",
      detectBrowserLanguage: false,
      trailingSlash: false,

   },
   sitemap: {
      urls: [],
      autoI18n: true,
      sources: ["/api/sitemap/dynamic"],
   },
   site: {
      url: process.env.SITE_BASE_URL,
      name: process.env.SITE_NAME,
   },
   css: [
      "ant-design-vue/dist/antd.css",
      'remixicon/fonts/remixicon.css',
      "swiper/css",
      "~/assets/font/stylesheet.css",
      "~/assets/scss/main.scss",
   ],
   plugins: ["~/plugins/ant-design.ts", "~/plugins/api.ts"],

   pinia: {
      storesDirs: ["./store/**"],
   },
   aos: {
      once: true,
   },

   vite: {
      plugins: [
         svgLoader({
            svgoConfig: {
               multipass: true,
            },
         }),
      ],
   },
   runtimeConfig: {
      public: {
         baseURL: process.env.SITE_BASE_URL,
         apiURL: process.env.SITE_API_URL,
         name: process.env.SITE_NAME,
         loaderDuration: 1500,
      },
   },
});
