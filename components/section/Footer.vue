<script setup>
const localePath = useLocalePath();
const { locale } = useI18n();
const applyRef = ref();

const { list: setting } = useSetting();
const { list: deparment } = useDepartment();
const { list: social } = useSocial();
const { list: service } = useService();

const news = [
	{
		id: 1,
		title: "Collaboratively Pontificate Bleed Edge Resources",
		author: "Admin",
		comments: 2,
		img: "/f1.jpg",
		to: "/blog/1",
	},
	{
		id: 2,
		title: "Quick Sync The Horse Is Out Of The Barn, Yet This Vendor",
		author: "Admin",
		comments: 2,
		img: "/f2.jpg",
		to: "/blog/2",
	},
];
</script>

<template>
	<footer class="footer">
		<div class="footer__bg" />
		<div class="container footer__container">
			<!-- TOP -->
			<div class="footer__top">
				<ARow :gutter="[28, 28]" align="top">
					<!-- Brand -->
					<ACol :xs="24" :md="12" :xl="10">
						<NuxtLink :to="localePath('/')" class="footer__brand">
							<!-- <img class="footer__logo" src="/logo-white.png" alt="logo" /> -->
							<span class="footer__name">Salomatlik Maskani</span>
						</NuxtLink>

						<p class="footer__desc">
							{{ setting?.footerText?.[locale] }}
						</p>

						<NuxtLink :to="localePath('/contact')" class="footer__cta">
							<span>{{ $t("contact") }}</span>
							<span class="footer__ctaIcon">
								<i class="ri-arrow-right-up-line"></i>
							</span>
						</NuxtLink>

						<div class="footer__social">
							<a
								v-for="item in social"
								:key="item.id ?? item.site_url"
								class="footer__socialBtn"
								target="_blank"
								rel="noopener"
								:href="item.site_url"
								:aria-label="item.icon"
							>
								<Icon :name="item.icon" />
							</a>
						</div>
					</ACol>

					<!-- Services -->
					<ACol :xs="12" :md="6" :xl="7">
						<div class="footer__col">
							<h4 class="footer__title">Our Services</h4>

							<ul class="footer__list">
								<li class="footer__item">
									<NuxtLink
										class="footer__link"
										:to="localePath('/news')"
									>
										{{ setting?.news?.[locale] }}
									</NuxtLink>
								</li>
								<li class="footer__item">
									<NuxtLink
										class="footer__link"
										:to="localePath('/doctor')"
									>
										{{ setting?.doctor?.[locale] }}
									</NuxtLink>
								</li>
								<li class="footer__item">
									<NuxtLink
										class="footer__link"
										:to="localePath('/service')"
									>
										{{ setting?.service?.[locale] }}
									</NuxtLink>
								</li>
                        	<li class="footer__item">
									<NuxtLink
										class="footer__link"
										:to="localePath('/contact')"
									>
										{{ setting?.contact?.[locale] }}
									</NuxtLink>
								</li>
								<!-- <li v-for="(value, key) in setting" :key="value">
									<NuxtLink class="footer__link" :to="localePath(key)">
										{{ value }}
									</NuxtLink>
								</li> -->
							</ul>
						</div>
					</ACol>

					<!-- Useful Links -->
					<ACol :xs="12" :md="6" :xl="7">
						<div class="footer__col">
							<h4 class="footer__title">Useful Links</h4>
							<ul class="footer__list">
								<li
									v-for="item in deparment"
									:key="item.id ?? item.slug"
								>
									<NuxtLink
										class="footer__link"
										:to="`/service/${item.id}`"
									>
										{{ item?.title?.[locale] }}
									</NuxtLink>
								</li>
							</ul>
						</div>
					</ACol>

					<!-- Recent News -->
					<!-- <ACol :xs="24" :md="12" :xl="6">
						<div class="footer__col">
							<h4 class="footer__title">Recent News</h4>

							<div class="footer__news">
								<NuxtLink
									v-for="n in news"
									:key="n.id"
									:to="localePath(n.to)"
									class="footer__newsItem"
								>
									<div class="footer__newsThumb">
										<img :src="n.img" :alt="n.title" />
									</div>

									<div class="footer__newsBody">
										<div class="footer__newsMeta">
											<span class="footer__newsMetaItem">
												<span class="footer__dot" /> By
												{{ n.author }}
											</span>
											<span class="footer__newsMetaItem">
												<span class="footer__dot" />
												{{ n.comments }} comments
											</span>
										</div>

										<div class="footer__newsTitle">
											{{ n.title }}
										</div>
									</div>
								</NuxtLink>
							</div>
						</div>
					</ACol> -->
				</ARow>
			</div>

			<!-- CONTACT STRIP (blue bar) -->
			<div class="footer__strip">
				<div class="footer__stripItem">
					<div class="footer__stripIcon">
						<Icon name="location" />
					</div>
					<a
						target="_black"
						:href="setting.addressLink?.[locale]"
						class="footer__stripText"
					>
						<span class="footer__stripLabel">{{ $t("address") }}</span>
						<span class="footer__stripValue">
							{{ setting?.address?.[locale] || "—" }}
						</span>
					</a>
				</div>

				<div class="footer__stripDivider" />

				<div class="footer__stripItem">
					<div class="footer__stripIcon">
						<Icon name="send-email" />
					</div>
					<div class="footer__stripText">
						<span class="footer__stripLabel">{{ $t("email") }}</span>
						<a
							class="footer__stripValue footer__stripValue--link"
							:href="`mailto:${setting?.email?.[locale]}`"
						>
							{{ setting?.email?.[locale] || "—" }}
						</a>
					</div>
				</div>

				<div class="footer__stripDivider" />

				<div class="footer__stripItem">
					<div class="footer__stripIcon">
						<Icon name="phone-fill" />
					</div>
					<div class="footer__stripText">
						<span class="footer__stripLabel">{{ $t("phone1") }}</span>
						<a
							class="footer__stripValue footer__stripValue--link"
							:href="
								setting?.phone?.[locale]
									? `tel:${setting.phone?.[locale]}`
									: '#'
							"
						>
							{{ setting?.phone?.[locale] || "—" }}
						</a>
					</div>
				</div>
			</div>

			<!-- BOTTOM -->
			<div class="footer__bottom">
				<span class="footer__made">
					{{ $t("footer.madeBy") }}
					<a
						href="https://www.instagram.com/wemard.management/"
						target="_blank"
						rel="noopener"
					>
						Wemard
					</a>
				</span>
			</div>
		</div>
	</footer>
</template>

<style lang="scss" scoped>
.footer {
	position: relative;
	overflow: hidden;
	padding: 84px 0 26px;
	color: #eaf0ff;

	// background (rasmdagidek: chuqur ko'k + pattern)
	background:
		radial-gradient(
			1200px 600px at 20% 20%,
			rgba(0, 140, 255, 0.1),
			transparent 55%
		),
		radial-gradient(
			900px 520px at 80% 0%,
			rgba(0, 255, 208, 0.08),
			transparent 60%
		),
		linear-gradient(180deg, #071428, #061022);

	&__bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.35;
		background-image: url("@/assets/images/footer.webp");
		background-repeat: no-repeat;
		background-color: #0a2241;
		background-size: cover;
		background-position: center;
		mix-blend-mode: screen;
		filter: blur(3px);
	}

	&__container {
		position: relative;
		z-index: 2;
		max-width: 1400px;
		width: 100%;
	}

	&__top {
		padding-bottom: 34px;
	}

	/* BRAND */
	&__brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: #fff;
		margin-bottom: 14px;

		&:hover .footer__name {
			transform: translateY(-1px);
			opacity: 0.95;
		}
	}

	&__logo {
		width: 44px;
		height: 44px;
		object-fit: contain;
		filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.35));
	}

	&__name {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: 0.2px;
		transition: 0.25s ease;
	}

	&__desc {
		max-width: 360px;
		margin: 0 0 18px;
		color: rgba(234, 240, 255, 0.72);
		line-height: 1.7;
		font-size: 15px;
	}

	/* CTA BUTTON (left+right colors merge + icon rotate) */
	&__cta {
		position: relative;
		overflow: hidden;
		isolation: isolate;

		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: #eaf0ff;

		font-weight: 700;
		letter-spacing: 0.3px;
		font-size: 13px;
		text-decoration: none;

		transition:
			transform 0.25s ease,
			border-color 0.25s ease;

		> span {
			position: relative;
			z-index: 2;
		}

		&::before,
		&::after {
			content: "";
			position: absolute;
			inset: 0;
			z-index: 1;
			opacity: 0.95;
			transition: transform 0.38s ease;
		}

		/* chapdan keladi */
		&::before {
			background: linear-gradient(
				90deg,
				rgba(0, 166, 255, 0.9),
				rgba(0, 166, 255, 0)
			);
			transform: translateX(-105%);
		}

		/* o'ngdan keladi */
		&::after {
			background: linear-gradient(
				270deg,
				rgba(0, 255, 214, 0.85),
				rgba(0, 255, 214, 0)
			);
			transform: translateX(105%);
		}

		&:hover {
			transform: translateY(-2px);
			border-color: rgba(0, 221, 255, 0.35);
			box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);

			&::before {
				transform: translateX(0);
			}

			&::after {
				transform: translateX(0);
			}
		}

		&:active {
			transform: translateY(0px);
		}
	}

	&__ctaIcon {
		display: inline-flex;
		width: 26px;
		height: 26px;
		border-radius: 999px;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.12);

		transition:
			transform 0.35s ease,
			background 0.25s ease;

		:deep(i),
		:deep(.icon) {
			transition: transform 0.35s ease;
		}
	}

	&__cta:hover &__ctaIcon {
		background: rgba(255, 255, 255, 0.18);
		transform: rotate(45deg) scale(1.06);
	}

	/* SOCIAL */
	&__social {
		display: flex;
		gap: 10px;
		margin-top: 18px;
	}

	&__socialBtn {
		position: relative;
		overflow: hidden;
		isolation: isolate;

		width: 38px;
		height: 38px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;

		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;

		transition:
			transform 0.25s ease,
			border-color 0.25s ease;

		&::before {
			content: "";
			position: absolute;
			inset: -2px;
			border-radius: inherit;
			z-index: 0;

			background: radial-gradient(
				120px 120px at 30% 30%,
				rgba(0, 166, 255, 0.35),
				rgba(0, 255, 214, 0.22),
				transparent 60%
			);

			transform: scale(0);
			transition: transform 0.32s ease;
		}

		&::after {
			content: "";
			position: absolute;
			inset: 0;
			border-radius: inherit;
			z-index: 0;
			box-shadow: 0 0 0 0 rgba(0, 221, 255, 0);
			transition: box-shadow 0.32s ease;
		}

		:deep(.icon),
		svg,
		:deep(i) {
			position: relative;
			fill: #989e9f;
			z-index: 1;
			transition: transform 0.25s ease;
		}

		&:hover {
			transform: translateY(-2px) scale(1.04);
			border-color: rgba(0, 221, 255, 0.35);
			fill: #00ddff;

			&::before {
				transform: scale(1);
			}

			&::after {
				box-shadow: 0 0 0 6px rgba(0, 221, 255, 0.12);
			}

			:deep(.icon),
			svg,
			:deep(i) {
				transform: rotate(-8deg) scale(1.05);
				fill: #00ddff;
			}
		}

		&:active {
			transform: translateY(0) scale(0.99);
		}
	}

	/* COLUMNS */
	&__col {
		padding-top: 8px;
	}

	&__title {
		position: relative;
		display: inline-block;
		margin: 0 0 18px;
		padding-bottom: 10px;

		font-size: 18px;
		font-weight: 700;
		color: #ffffff;

		&::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 34px;
			height: 2px;
			background: rgba(255, 255, 255, 0.85);
			border-radius: 99px;
			transition: 0.25s ease;
		}
	}

	&__col:hover &__title::after {
		width: 54px;
		background: rgba(0, 221, 255, 0.9);
	}

	&__list {
		margin: 0;
		padding: 0;
		// font-size: 18px;
		// line-height: 1.4;
		list-style: none;

		li + li {
			margin-top: 10px;
		}
		a {
			font-size: 16px;
		}
	}

	/* MENU LINK underline RIGHT -> LEFT */
	&__link {
		position: relative;
		display: inline-flex;
		gap: 8px;
		align-items: center;

		color: rgba(234, 240, 255, 0.78);
		text-decoration: none;
		font-size: 14.5px;

		transition:
			transform 0.2s ease,
			color 0.2s ease;

		&::before {
			content: "";
			width: 6px;
			height: 6px;
			border-radius: 99px;
			background: rgba(0, 221, 255, 0);
			transform: scale(0.7);
			transition: 0.2s ease;
		}

		&::after {
			content: "";
			position: absolute;
			left: 0;
			right: 0;
			bottom: -6px;
			height: 2px;
			border-radius: 99px;

			background: linear-gradient(
				90deg,
				rgba(0, 166, 255, 0.95),
				rgba(0, 255, 214, 0.9)
			);

			transform: scaleX(0);
			transform-origin: right; // ⭐ start RIGHT
			transition: transform 0.28s ease;
		}

		&:hover {
			color: #ffffff;
			transform: translateX(4px);

			&::before {
				background: rgba(0, 221, 255, 0.9);
				transform: scale(1);
			}

			&::after {
				transform: scaleX(1);
				transform-origin: left; // ⭐ animate to LEFT
			}
		}
	}

	/* NEWS */
	&__news {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__newsItem {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 12px;
		text-decoration: none;
		color: inherit;

		padding: 10px;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.04);
		transition: 0.25s ease;

		&:hover {
			transform: translateY(-2px);
			border-color: rgba(0, 221, 255, 0.35);
			background: rgba(0, 221, 255, 0.07);
			box-shadow: 0 20px 55px rgba(0, 0, 0, 0.28);
		}
	}

	&__newsThumb {
		width: 64px;
		height: 64px;
		border-radius: 12px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.06);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transform: scale(1.02);
			transition: 0.35s ease;
		}
	}

	&__newsItem:hover &__newsThumb img {
		transform: scale(1.1);
	}

	&__newsMeta {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		font-size: 12px;
		color: rgba(234, 240, 255, 0.6);
		margin-bottom: 6px;
	}

	&__newsMetaItem {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	&__dot {
		width: 6px;
		height: 6px;
		border-radius: 99px;
		background: rgba(0, 221, 255, 0.9);
		box-shadow: 0 0 0 4px rgba(0, 221, 255, 0.1);
	}

	&__newsTitle {
		font-size: 14.2px;
		font-weight: 700;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.92);
	}

	/* STRIP (blue bar) */
	&__strip {
		position: relative;
		overflow: hidden;

		margin-top: 28px;
		border-radius: 20px;
		padding: 18px 20px;

		display: grid;
		grid-template-columns: 2fr auto 1fr auto 1fr;
		gap: 18px;
		align-items: center;

		// border: 1px solid rgba(255, 255, 255, 0.14);
		box-shadow: 0 22px 70px rgba(0, 0, 0, 0.35);

		/* 🔥 BACKGROUND LAYERLAR */
		background:
			linear-gradient(90deg, rgba(7, 34, 82, 0.88), rgba(6, 16, 34, 0.6)),
			url("@/assets/images/footer-bottom.webp");
		padding: 30px 20px;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		backdrop-filter: blur(10px);

		/* overlay (text aniq ko‘rinsin) */
		&::after {
			content: "";
			position: absolute;
			inset: 0;
			background: rgba(30, 165, 237, 0.3);
			z-index: 0;
		}

		/* ichidagi content ustida bo‘lsin */
		> * {
			position: relative;
			z-index: 1;
		}

		@media (max-width: 992px) {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}

	&__stripDivider {
		width: 1px;
		height: 40px;
		background: rgba(255, 255, 255, 0.18);

		@media (max-width: 992px) {
			display: none;
		}
	}
	&__stripItem {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
		cursor: pointer;
		transition: transform 0.25s ease;

		&:hover {
			transform: translateY(-2px);
		}

		/* ICON */
		.footer__stripIcon {
			position: relative;
			width: 44px;
			height: 44px;
			min-width: 44px;

			border-radius: 999px;
			display: flex;
			align-items: center;
			justify-content: center;

			background: rgba(255, 255, 255, 0.18);
			border: 1px solid rgba(255, 255, 255, 0.22);

			transition:
				background 0.3s ease,
				transform 0.3s ease,
				box-shadow 0.3s ease;

			:deep(svg),
			:deep(.icon) {
				color: #ffffff;
				fill: currentColor;
				stroke: currentColor;
				transition: transform 0.3s ease;
			}
		}

		/* LINK */
		.footer__stripValue--link {
			position: relative;
			display: inline-block;
			color: #ffffff;
			font-weight: 600;
			text-decoration: none;

			&::after {
				content: "";
				position: absolute;
				left: 0;
				bottom: -4px;
				width: 100%;
				height: 2px;
				border-radius: 99px;
				background: linear-gradient(90deg, #00a6ff, #00ffd6);

				transform: scaleX(0);
				transform-origin: left;
				transition: transform 0.3s ease;
			}
		}

		/* MAGIC: parent hover bo‘lsa hammasi ishlaydi */
		&:hover {
			.footer__stripIcon {
				background: rgba(0, 221, 255, 0.25);
				transform: scale(1.08);
				box-shadow: 0 0 0 6px rgba(0, 221, 255, 0.18);

				:deep(svg),
				:deep(.icon) {
					transform: rotate(-8deg) scale(1.05);
				}
			}

			.footer__stripValue--link::after {
				transform: scaleX(1);
			}
		}

		/* icon yoki linkning o‘zini hover qilganda ham ishlasin (zamonaviy browserlar) */
		&:has(.footer__stripValue--link:hover),
		&:has(.footer__stripIcon:hover) {
			.footer__stripIcon {
				background: rgba(0, 221, 255, 0.25);
				transform: scale(1.08);
				box-shadow: 0 0 0 6px rgba(0, 221, 255, 0.18);
			}

			.footer__stripValue--link::after {
				transform: scaleX(1);
			}
		}
	}

	&__stripText {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	&__stripLabel {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.8);
	}

	&__stripValue {
		font-size: 14.5px;
		font-weight: 600;
		color: #ffffff;
		text-decoration: none;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 100%;
	}

	&__stripValue--link {
		position: relative;

		&:hover {
			opacity: 0.95;
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	/* BOTTOM */
	&__bottom {
		margin-top: 12px;
		padding: 8px;
		padding-bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;

		@media (max-width: 576px) {
			justify-content: center;
			text-align: center;
		}
	}

	&__copy {
		color: rgba(234, 240, 255, 0.72);
		font-size: 13.5px;
	}

	&__made {
		color: rgba(234, 240, 255, 0.72);
		font-size: 16px;

		a {
			color: #fff;
			font-weight: 800;
			text-decoration: none;
			border-bottom: 1px dashed rgba(255, 255, 255, 0.35);
			transition: 0.2s ease;
			font-size: 20px;

			&:hover {
				border-bottom-color: rgba(0, 221, 255, 0.9);
				color: rgba(0, 221, 255, 0.95);
			}
		}
	}
}
</style>
