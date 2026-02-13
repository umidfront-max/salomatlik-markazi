<script setup>
const { locale } = useI18n();
const localePath = useLocalePath();
const { list: setting } = useSetting();
const { list: menu } = useMenu();
const { list: social } = useSocial();
</script>
<template>
	<footer class="section container">
		<div class="section-top">
			<ARow items="middle" :gutter="[16, 16]">
				<ACol :xl="6" :xs="24">
					<Logo />
				</ACol>
				<ACol :xl="6" :xs="24">
					<div class="section-item">
						<div class="section-item__icon">
							<Icon name="map" />
						</div>
						<div class="section-item__info">
							<span class="section-item__label"
								>asdasd{{ $t("phone1") }}</span
							>
							<!-- <a class="section-item__value" :href="toGetNumber(setting.phone)">
                {{ setting.phone }}
              </a> -->
							<a
								:href="setting.addressLink?.[locale]"
								target="_blank"
								class="section-item__value"
							>
								{{ setting?.address?.[locale] }}
							</a>
						</div>
					</div>
				</ACol>
				<ACol :xs="24" :xl="6">
					<div class="section-item">
						<div class="section-item__icon">
							<Icon name="email" />
						</div>
						<div class="section-item__info">
							<span class="section-item__label">{{
								$t("address")
							}}</span>
							<a
								:href="setting.addressLink?.[locale]"
								target="_blank"
								class="section-item__value"
							>
								{{ setting?.address?.[locale] }}
							</a>
						</div>
					</div>
				</ACol>
				<ACol :xs="24" :xl="6">
					<div class="section-item">
						<div class="section-item__icon">
							<Icon name="telephone" />
						</div>
						<div class="section-item__info">
							<span class="section-item__label">{{
								$t("workTime")
							}}</span>
							<a class="section-item__value">
								{{ setting?.workTime?.[locale] }}
							</a>
						</div>
					</div>
				</ACol>
			</ARow>
		</div>
		<div class="section-bot">
			<ul class="section-menu">
				<li class="section-menu__item">
					<NuxtLink class="section-menu__link" :to="localePath('/news')">
						{{ setting?.news?.[locale] }}
					</NuxtLink>
				</li>
				<li class="section-menu__item">
					<NuxtLink class="section-menu__link" :to="localePath('/doctor')">
						{{ setting?.doctor?.[locale] }}
					</NuxtLink>
				</li>
				<li class="section-menu__item">
					<NuxtLink
						class="section-menu__link"
						:to="localePath('/service')"
					>
						{{ setting?.service?.[locale] }}
					</NuxtLink>
				</li>
			</ul>

			<div class="section-right">
				<div class="section-social">
					<span class="section-social__label">
						{{ $t("subscribeUs") }}
					</span>

					<a
						v-if="setting?.telegram?.[locale]"
						class="section-social__icon"
						:href="normalizeLink(setting?.telegram?.[locale], 'telegram')"
						target="_blank"
						rel="noopener"
						aria-label="Telegram"
						title="Telegram"
					>
						<i class="ri-telegram-line"></i>
					</a>

					<a
						v-if="setting?.instagram?.[locale]"
						class="section-social__icon"
						:href="
							normalizeLink(setting?.instagram?.[locale], 'instagram')
						"
						target="_blank"
						rel="noopener"
						aria-label="Instagram"
						title="Instagram"
					>
						<i class="ri-instagram-line"></i>
					</a>

					<a
						v-if="setting?.facebook?.[locale]"
						class="section-social__icon"
						:href="normalizeLink(setting?.facebook?.[locale], 'facebook')"
						target="_blank"
						rel="noopener"
						aria-label="Facebook"
						title="Facebook"
					>
						<i class="ri-facebook-fill"></i>
					</a>

					<a
						v-if="setting?.youtube?.[locale]"
						class="section-social__icon section-social__icon--yt"
						:href="normalizeLink(setting?.youtube?.[locale], 'youtube')"
						target="_blank"
						rel="noopener"
						aria-label="YouTube"
						title="YouTube"
					>
						<i class="ri-youtube-fill"></i>
					</a>
				</div>
				<span class="section-right__copy">
					Made by
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

	&-top {
		padding: var(--space-32);
		background: var(--black-1);
	}

	&-item {
		display: flex;
		align-items: center;
		gap: 12px;

		&__icon {
			--icon-size: var(--size-icon-32);
			--icon-color: var(--white-1);
			min-width: 60px;
			aspect-ratio: 1/1;
			border-radius: 2px;
			background: var(--red-1);
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 8px;
			border-radius: 12px;

			@include devices(sm) {
				min-width: 48px;
			}
		}

		&__info {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}

		&__label {
			@include text(20, var(--white-1), 400, normal);
			display: block;
			margin-bottom: 4px;
		}

		&__value {
			@include text(22, var(--white-1), 500, normal);
		}
	}

	&-bot {
		padding: var(--space-32);
		width: calc(100% - var(--space-32) * 2);
		margin: -8px auto 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--red-2);
		padding-right: calc(var(--space-32) + 48px);
	}

	&-menu {
		display: flex;
		align-items: center;
		gap: var(--space-32);

		@include devices(lg) {
			display: none;
		}

		&__link {
			@include text(20, rgba(var(--white), 1), 500, normal);

			&:hover {
				color: var(--white-1);
			}
		}
	}

	&-social {
		display: flex;
		align-items: center;

		&__icon {
			--icon-size: var(--size-icon-24);
			--icon-color: var(--white-1);

			&:not(:last-of-type) {
				margin-right: 8px;
			}
		}

		&__label {
			margin-right: 12px;
			@include text(20, rgba(var(--white), 1), 400, normal);
		}
	}

	&-right {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;

		&__copy {
			margin-right: 12px;
			@include text(20, rgba(var(--white), 1), 400, normal);

			a {
				font-weight: 500;
				color: white;
			}
		}
	}
}
</style>
