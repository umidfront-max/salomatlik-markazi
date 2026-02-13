<script setup>
const localePath = useLocalePath();
const { data: setting } = useSetting();
const { list: menu } = useMenu();
const { list: social } = useSocial();
const { list: service } = useService();
</script>
<template>
	<footer class="section">
		<div class="container section-container">
			<div class="section-top">
				<ARow :gutter="[24, 24]" align="middle">
					<ACol span="7" :xl="7" :xs="24">
						<NuxtLink :to="localePath('/')" class="section-logo">
							<img src="/logo-white.png" alt="test" />
						</NuxtLink>
					</ACol>
					<ACol span="7" :xl="7" :lg="10" :xs="24">
						<a href="#!" class="section-contact">
							<div class="section-contact__icon">
								<Icon name="location" />
							</div>
							<div class="section-contact__info">
								<span class="section-contact__label">
									{{ $t("address") }}
								</span>
								<span class="section-contact__value">
									{{ setting.address }}
								</span>
							</div>
						</a>
					</ACol>
					<ACol span="5" :xl="5" :lg="7" :md="12" :xs="24">
						<a href="#!" class="section-contact">
							<div class="section-contact__icon">
								<Icon name="phone-fill" />
							</div>
							<div class="section-contact__info">
								<span class="section-contact__label">
									{{ $t("footer.ourNumbers") }}
								</span>
								<span
									class="section-contact__value"
									v-if="setting.phone"
								>
									{{ setting.phone }}
								</span>
								<span
									class="section-contact__value"
									v-if="setting.phone2"
								>
									{{ setting.phone2 }}
								</span>
							</div>
						</a>
					</ACol>
					<ACol span="5" :xl="5" :lg="7" :md="12" :xs="24">
						<a href="#!" class="section-contact">
							<div class="section-contact__icon">
								<Icon name="send-email" />
							</div>
							<div class="section-contact__info">
								<span class="section-contact__label">
									{{ $t("footer.sendEmail") }}
								</span>
								<span class="section-contact__value">
									{{ setting.email }}
								</span>
							</div>
						</a>
					</ACol>
				</ARow>
			</div>
			<div class="section-mid">
				<ARow :gutter="[24, 32]">
					<ACol span="6" :lg="6" :md="24" :xs="24">
						<div class="section-mid__left">
							<p class="section-text">
								{{ $t("footer.aboutText") }}
							</p>
							<div class="section-social">
								<a
									class="section-social__icon"
									target="_blank"
									:href="item.site_url"
									v-for="item in social"
								>
									<Icon :name="item.icon" />
								</a>
							</div>
						</div>
					</ACol>
					<ACol :lg="1" :xs="0"></ACol>
					<ACol span="5" :lg="5" :md="8" :xs="12">
						<div class="section-item">
							<span class="section-item__label">{{
								$t("footer.quickLinks")
							}}</span>
							<ul class="section-menu">
								<li
									class="section-menu__item"
									v-for="(item, index) in menu?.filter(
										(el) => el.show_header,
									)"
									:key="index"
								>
									<NuxtLink
										class="section-menu__link"
										:to="
											localePath(
												item.page
													? item.page
													: `/static/${item.slug}`,
											)
										"
									>
										{{ item.title }}
									</NuxtLink>
								</li>
							</ul>
						</div>
					</ACol>
					<ACol :lg="5" :md="8" :xs="12">
						<div class="section-item">
							<span class="section-item__label">{{
								$t("footer.ourServices")
							}}</span>
							<ul class="section-menu">
								<li
									class="section-menu__item"
									v-for="item in service.slice(0, 6)"
								>
									<NuxtLink
										class="section-menu__link"
										:to="localePath(`/service/${item.slug}`)"
									>
										{{ item.title }}
									</NuxtLink>
								</li>
							</ul>
						</div>
					</ACol>
					<ACol :lg="5" :md="8" :xs="12">
						<div class="section-item">
							<span class="section-item__label">{{
								$t("footer.openingHours")
							}}</span>
							<ul class="section-menu">
								<li class="section-menu__item">
									<a class="section-menu__link">
										{{ $t("footer.mondayFriday") }}
									</a>
								</li>
								<li class="section-menu__item">
									<a class="section-menu__link">
										{{ $t("footer.saturday") }}
									</a>
								</li>
								<li
									class="section-menu__item"
									v-if="$t('footer.sunday')"
								>
									<a class="section-menu__link">
										{{ $t("footer.sunday") }}
									</a>
								</li>
							</ul>
						</div>
					</ACol>
				</ARow>
			</div>
			<div class="section-bot">
				<span class="section-bot__copy">
					© 2008-2025 Salomatlik-Maskani
				</span>
				<span class="section-bot__author">
					{{ $t("footer.madeBy") }}
					<a
						href="https://www.instagram.com/wemard.management/"
						target="_blank"
					>
						Wemard
					</a>
				</span>
			</div>
		</div>
	</footer>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.section {
	margin-top: -12px;
	position: relative;
	z-index: 2;
	background-color: #111821;
	background-image: url("@/assets/images/footer-pattern.png");
	min-height: 400px;
	background-repeat: no-repeat;
	background-size: auto;
	background-position: center center;

	&-logo {
		max-width: 320px;
		flex: 0 0 auto;
		width: 100%;
		display: block;

		img {
			width: 100%;
			height: auto;
		}
	}

	&-container {
		max-width: var(--width-mini-container);
	}

	&-top {
		padding-top: 48px;
		padding-bottom: 48px;
	}

	&-contact {
		display: flex;
		align-items: center;
		gap: 16px;

		&__icon {
			position: relative;
			flex: 0 0 auto;
			width: 60px;
			height: 60px;
			text-align: center;
			background-color: var(--red-1);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;

			.icon {
				--icon-color: var(--white-1);
				--icon-size: 24px;
			}
		}

		&__info {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}

		&__label {
			display: block;
			font-size: 14px;
			font-weight: 400;
			margin-bottom: 5px;
			color: white;
		}

		&__value {
			font-size: 18px;
			font-weight: 600;
			color: white;
		}
	}

	&-mid {
		padding-top: 50px;
		border-top: 1px solid rgba(255, 255, 255, 0.09);
	}

	&-text {
		color: var(--white-1);
		margin-bottom: var(--space-32);
		font-size: 16px;
	}

	&-social {
		display: flex;
		align-items: center;

		&__icon {
			position: relative;
			color: var(--primary-color);
			background-color: #e6f9f8;
			height: 50px;
			width: 50px;
			line-height: 50px;
			font-size: 16px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 100px;

			--icon-size: var(--size-icon-24);
			--icon-color: var(--black-1);

			&:not(:last-of-type) {
				margin-right: 8px;
			}
		}
	}

	&-item {
		&__label {
			position: relative;
			font-size: 20px;
			font-weight: 500;
			color: var(--white-1);
			margin-bottom: 30px;
			padding-bottom: 15px;
			display: block;

			&::after {
				position: absolute;
				content: "";
				left: 0px;
				bottom: 0px;
				width: 30px;
				height: 2px;
				background-color: var(--white-1);
				transition: 0.5s;
			}
		}
	}

	&-menu {
		&__item {
			&:not(:last-child) {
				margin-bottom: 10px;
			}
		}

		&__link {
			display: flex;
			position: relative;
			color: var(--white-1);
			font-size: 16px;
			align-items: center;
			gap: 8px;
		}
	}

	&-bot {
		background-color: #0e131a;
		padding-top: 15px;
		padding-left: 25px;
		padding-bottom: 30px;
		padding-right: 25px;
		border-radius: 20px 20px 0px 0px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 40px;

		@include devices(xs) {
			justify-content: center;
			row-gap: 12px;
		}

		&__copy {
			font-size: 16px;
			line-height: 1.6em;
			color: var(--white-1);
			margin-bottom: 0;

			@include devices(xs) {
				width: 100%;
				text-align: center;
			}
		}

		&__author {
			@include text(20, rgba(var(--white), 1), 400, normal);
			display: flex;
			align-items: center;
			gap: 8px;

			@include devices(xs) {
				width: 100%;
				justify-content: center;
			}

			a {
				font-weight: 500;
				color: white;
			}
		}
	}
}
</style>
