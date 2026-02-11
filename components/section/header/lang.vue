<script setup>
const { locales, setLocale, locale } = useI18n();
async function changeLocale(localeCode) {
	await setLocale(localeCode);
	location.reload();
}
</script>
<template>
	<ADropdown placement="bottomRight">
		<slot v-bind="{ locales, locale }"></slot>
		<template #overlay>
			<ul class="options">
				<li
					class="options-item"
					@click="changeLocale(item.code)"
					v-for="item in locales"
					:key="item.code"
				>
					<img
						class="options-item__flag"
						:src="`/flag/${item.code}.png`"
						:alt="item.code"
					/>
					<span class="options-item__name">
						{{ item.code }}
					</span>
				</li>
			</ul>
		</template>
	</ADropdown>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.options {
	border-radius: 12px;

	border: 1px solid #d3e0ea;
	background: var(--white-1);
	box-shadow: 0px 4px 20px 0px rgba(var(--black), 0.1);
	min-width: 100px;
	padding: 12px;

	&-item {
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		padding: 8px 12px;
		border-radius: 8px;
		@include text(20, var(--black-1), 400, 150%);
		transition: all 0.2s ease-in-out;

		&__flag {
			min-width: 24px;
			width: 24px;
			height: auto;
		}
		&__name {
			text-transform: uppercase;
			font-weight: 500;
			font-size: 14px;
		}

		&:not(:last-child) {
			margin-bottom: 6px;
		}

		&:hover {
			color: var(--red-1);
			background-color: #ebeef0;
		}
	}
}
</style>
