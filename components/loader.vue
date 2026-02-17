<script setup lang="ts">
// components/AppLoader.vue
// Nuxt3 — bitta fayl, hamma narsa ichida.
// Exit: content fade+scale → panel pastdan tushadi (translateY 100%)
// Ishlatish: <AppLoader /> — app.vue ga qo'ying, tamom.

useHead({
	style: [
		{
			id: "loader-css",
			innerHTML: `
      /* ── Wrapper ─────────────────────────────── */
      #app-loader {
        --mq: 20s;
        --exit-panel: 580ms;
        --exit-content: 320ms;
        position: fixed; inset: 0; z-index: 9999; overflow: hidden;
        pointer-events: auto;
      }

      /* ── Panel (fon) ─────────────────────────── */
      #app-loader .panel {
        position: absolute; inset: 0;
        background: linear-gradient(148deg, #1d4ed8 0%, #1e3a8a 42%, #0f1e5c 100%);
        transform: translateY(0%);
        transition: transform var(--exit-panel) cubic-bezier(0.76, 0, 0.24, 1);
        will-change: transform;
      }

      /* ── Orbs ────────────────────────────────── */
      #app-loader .o {
        position: absolute; border-radius: 50%;
        filter: blur(72px); pointer-events: none;
      }
      #app-loader .o1 {
        width: 560px; height: 560px; top: -160px; left: -110px;
        background: radial-gradient(circle, rgba(96,165,250,.24), transparent 68%);
        animation: oF1 11s ease-in-out infinite;
      }
      #app-loader .o2 {
        width: 380px; height: 380px; bottom: 30px; right: -70px;
        background: radial-gradient(circle, rgba(147,197,253,.17), transparent 68%);
        animation: oF2 14s ease-in-out infinite;
      }
      #app-loader .o3 {
        width: 240px; height: 240px; top: 38%; left: 60%;
        background: radial-gradient(circle, rgba(30,64,175,.2), transparent 68%);
        animation: oF1 9s ease-in-out infinite reverse;
      }
      @keyframes oF1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(24px,-38px)} }
      @keyframes oF2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,24px)} }

      /* ── Grain ───────────────────────────────── */
      #app-loader .grain {
        position: absolute; inset: -50%; width: 200%; height: 200%;
        opacity: .28; mix-blend-mode: overlay; pointer-events: none;
        animation: gD 9s steps(2) infinite;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
      }
      @keyframes gD {
        0%   { transform: translate(0,0) }
        25%  { transform: translate(-2%,1%) }
        50%  { transform: translate(1%,-2%) }
        75%  { transform: translate(-1%,2%) }
        100% { transform: translate(0,0) }
      }

      /* ── Diagonal shimmer line ───────────────── */
      #app-loader .shimmer {
        position: absolute; inset: 0; pointer-events: none; overflow: hidden;
      }
      #app-loader .shimmer::after {
        content: '';
        position: absolute; top: -60%; left: -30%;
        width: 60%; height: 220%;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,.055) 50%, transparent 100%);
        animation: shim 3.2s ease-in-out infinite;
      }
      @keyframes shim { 0%,100%{transform:translateX(-30%)} 50%{transform:translateX(230%)} }

      /* ── Center content ──────────────────────── */
      #app-loader .content {
        position: absolute; inset: 0; z-index: 2;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 22px; padding-bottom: 90px;
        pointer-events: none;
        transition: opacity var(--exit-content) ease,
                    transform var(--exit-content) cubic-bezier(0.4,0,1,1);
      }

      /* ── Logo ────────────────────────────────── */
      #app-loader .logo {
        width: 92px; height: 92px; border-radius: 26px;
        background: rgba(255,255,255,.07);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,.16);
        box-shadow:
          0 0 0 1px rgba(255,255,255,.06),
          0 24px 56px rgba(0,0,0,.38),
          0 6px 18px rgba(59,130,246,.3),
          inset 0 1px 0 rgba(255,255,255,.12);
        display: flex; align-items: center; justify-content: center;
        animation: lP 560ms cubic-bezier(.18,.86,.25,1) both;
      }
      @keyframes lP {
        from { transform: scale(.68) translateY(18px); opacity: 0 }
        65%  { transform: scale(1.06) translateY(-3px); opacity: 1 }
        to   { transform: scale(1) translateY(0); opacity: 1 }
      }

      /* ── Ring pulse around logo ──────────────── */
      #app-loader .ring {
        position: absolute;
        width: 92px; height: 92px; border-radius: 26px;
        border: 1px solid rgba(147,197,253,.35);
        animation: ringPulse 2.4s ease-out 0.5s infinite;
        pointer-events: none;
      }
      @keyframes ringPulse {
        0%   { transform: scale(1);    opacity: .6 }
        100% { transform: scale(1.55); opacity: 0  }
      }

      /* ── Title ───────────────────────────────── */
      #app-loader .ttl {
        display: flex; gap: 12px; align-items: baseline;
      }
      #app-loader .ttl span {
        font-family: 'Gill Sans','Gill Sans MT',Optima,Candara,sans-serif;
        font-size: clamp(26px, 5.5vw, 42px);
        font-weight: 300; letter-spacing: .09em;
        color: rgba(255,255,255,.93); text-transform: uppercase;
        animation: fU 620ms cubic-bezier(.18,.86,.25,1) .12s both;
      }
      #app-loader .ttl .ac {
        font-weight: 800; color: #93c5fd;
        letter-spacing: .14em; animation-delay: .22s;
      }
      @keyframes fU {
        from { transform: translateY(28px); opacity: 0 }
        to   { transform: translateY(0);    opacity: 1 }
      }

      /* ── Tagline ─────────────────────────────── */
      #app-loader .tag {
        font-family: 'Gill Sans','Gill Sans MT',Optima,Candara,sans-serif;
        font-size: 11px; font-weight: 500; letter-spacing: .22em;
        text-transform: uppercase; color: rgba(255,255,255,.38);
        animation: fU 500ms ease .38s both;
      }

      /* ── Progress bar ────────────────────────── */
      #app-loader .pb {
        width: 140px; height: 2px; border-radius: 99px;
        background: rgba(255,255,255,.1); overflow: hidden;
        animation: fU 400ms ease .45s both;
      }
      #app-loader .pf {
        height: 100%; border-radius: 99px;
        background: linear-gradient(90deg, #3b82f6, #93c5fd, #3b82f6);
        background-size: 200% 100%;
        box-shadow: 0 0 12px rgba(96,165,250,.6);
        animation:
          pF 2s cubic-bezier(.4,0,.2,1) .4s both,
          pShim 1.6s linear .4s infinite;
      }
      @keyframes pF    { from{width:0} to{width:100%} }
      @keyframes pShim { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

      /* ── Marquee band ────────────────────────── */
      #app-loader .mb {
        position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
        background: rgba(255,255,255,.038);
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255,255,255,.09);
        transition: transform var(--exit-panel) cubic-bezier(0.76,0,0.24,1),
                    opacity 200ms ease;
      }
      #app-loader .mr  { overflow:hidden; height:38px; display:flex; align-items:center }
      #app-loader .mr2 { background:rgba(0,0,0,.07); border-top:1px solid rgba(255,255,255,.06) }
      #app-loader .mt  { display:flex; white-space:nowrap; will-change:transform }
      #app-loader .ltr { animation: sL var(--mq) linear infinite }
      #app-loader .rtl { animation: sR var(--mq) linear infinite }
      @keyframes sL { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes sR { from{transform:translateX(-50%)} to{transform:translateX(0)} }
      #app-loader .mi {
        display:inline-block; white-space:nowrap; padding:0 8px; flex-shrink:0;
        font-family:'Gill Sans','Gill Sans MT',Optima,Candara,sans-serif;
        font-size:11px; font-weight:600; letter-spacing:.17em;
        text-transform:uppercase; color:rgba(255,255,255,.48); user-select:none;
      }
      #app-loader .mr2 .mi { color:rgba(255,255,255,.28); font-weight:400; font-size:10px }

      /* ── Edge masks ──────────────────────────── */
      #app-loader .el,
      #app-loader .er {
        position:absolute; bottom:0; height:76px; width:120px;
        z-index:4; pointer-events:none;
      }
      #app-loader .el { left:0;  background:linear-gradient(to right,#0f1e5c 30%,transparent) }
      #app-loader .er { right:0; background:linear-gradient(to left, #0f1e5c 30%,transparent) }

      /* ══════════════════════════════════════════
         EXIT STATE
      ══════════════════════════════════════════ */
      #app-loader.hide .content {
        opacity: 0;
        transform: scale(.96) translateY(-10px);
      }
      /* Panel + marquee pastga siljiydi */
      #app-loader.hide .panel {
        transform: translateY(100%);
      }
      #app-loader.hide .mb {
        transform: translateY(100%);
        opacity: 0;
      }
      /* Ring + orbs ham yo'qoladi */
      #app-loader.hide .ring,
      #app-loader.hide .o,
      #app-loader.hide .grain,
      #app-loader.hide .shimmer {
        opacity: 0;
        transition: opacity 180ms ease;
      }

      /* ── Responsive ──────────────────────────── */
      @media(max-width:480px){
        #app-loader .logo { width:72px; height:72px; border-radius:20px }
        #app-loader .ring { width:72px; height:72px; border-radius:20px }
        #app-loader .mr   { height:32px }
        #app-loader .mi   { font-size:10px }
      }

      /* ── Reduced motion ──────────────────────── */
      @media(prefers-reduced-motion:reduce){
        #app-loader *               { animation:none!important }
        #app-loader .panel,
        #app-loader .content,
        #app-loader .mb             { transition:none!important }
        #app-loader.hide            { display:none }
        #app-loader .pf             { width:100% }
      }
    `,
		},
	],
});

onMounted(() => {
	const el = document.getElementById("app-loader");
	if (!el) return;

	// Kamida 2 soniya ko'rsatilsin (prod da hydration tez bo'lsa ham)
	const MIN_MS = 3000;
	const startTime = performance.now();

	nextTick(() => {
		const elapsed = performance.now() - startTime;
		const remaining = Math.max(0, MIN_MS - elapsed);

		setTimeout(() => {
			el.classList.add("hide");
			setTimeout(() => {
				el.remove();
				document.getElementById("loader-css")?.remove();
			}, 620);
		}, remaining);
	});
});
</script>

<template>
	<Teleport to="body">
		<div id="app-loader">
			<!-- Fon panel -->
			<div class="panel"></div>

			<!-- Depth layers -->
			<div class="grain"></div>
			<div class="shimmer"></div>
			<div class="o o1"></div>
			<div class="o o2"></div>
			<div class="o o3"></div>

			<!-- Center content -->
			<div class="content">
				<!-- Logo + ring pulse -->
				<div
					style="
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
					"
				>
					<div class="ring"></div>
					<div class="logo">
						<svg width="58" height="58" viewBox="0 0 58 58" fill="none">
							<defs>
								<linearGradient id="ll" x1="0" y1="0" x2="1" y2="1">
									<stop offset="0%" stop-color="#bfdbfe" />
									<stop offset="100%" stop-color="#3b82f6" />
								</linearGradient>
							</defs>
							<rect
								width="58"
								height="58"
								rx="15"
								fill="url(#ll)"
								opacity=".95"
							/>
							<text
								x="50%"
								y="54%"
								text-anchor="middle"
								fill="white"
								font-size="22"
								font-family="'Gill Sans',Optima,Candara,sans-serif"
								font-weight="700"
								dominant-baseline="middle"
							>
								SM
							</text>
						</svg>
					</div>
				</div>

				<!-- Title -->
				<div class="ttl">
					<span>Salomatlik</span>
					<span class="ac">maskani</span>
				</div>

				<!-- Tagline -->
				<div class="tag">Sog'liq · Shifo · Hayot</div>

				<!-- Progress -->
				<div class="pb"><div class="pf"></div></div>
			</div>

			<!-- Marquee band -->
			<div class="mb">
				<div class="mr">
					<div class="mt ltr">
						<span class="mi" v-for="n in 4" :key="'a' + n">
							Salomatlik maskani &nbsp;✦&nbsp; Sog'liq &nbsp;✦&nbsp;
							Shifо &nbsp;✦&nbsp; Hayot &nbsp;✦&nbsp;
						</span>
					</div>
				</div>
				<div class="mr mr2">
					<div class="mt rtl">
						<span class="mi" v-for="n in 4" :key="'b' + n">
							Health &nbsp;◆&nbsp; Wellness &nbsp;◆&nbsp; Care
							&nbsp;◆&nbsp; Vitality &nbsp;◆&nbsp; Balance &nbsp;◆&nbsp;
						</span>
					</div>
				</div>
			</div>

			<!-- Edge fades -->
			<div class="el"></div>
			<div class="er"></div>
		</div>
	</Teleport>
</template>
