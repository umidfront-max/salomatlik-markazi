<script setup>
defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});

function formatDate(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	return d.toLocaleDateString("uz-UZ", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function getInitials(name) {
	if (!name) return "?";
	return name
		.trim()
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join("");
}

function getAvatarColor(name) {
	const colors = [
		["#6C63FF", "#48BFE3"],
		["#F77F00", "#FCBF49"],
		["#2EC4B6", "#CBF3F0"],
		["#E63946", "#F1A1A8"],
		["#457B9D", "#A8DADC"],
		["#8338EC", "#C77DFF"],
	];
	const index = (name || "").charCodeAt(0) % colors.length;
	return colors[index];
}
</script>

<template>
	<div class="fb-card">
		<!-- Ambient glow -->
		<div class="fb-card__glow"></div>

		<!-- Top row: avatar + name + badge -->
		<div class="fb-card__top">
			<div
				class="fb-card__avatar"
				:style="`background: linear-gradient(135deg, ${getAvatarColor(data.authorName)[0]}, ${getAvatarColor(data.authorName)[1]})`"
			>
				<span>{{ getInitials(data.authorName) }}</span>
			</div>
			<div class="fb-card__meta">
				<span class="fb-card__name">{{ data.authorName }}</span>
				<span class="fb-card__date" v-if="data.createdAt">
					<Icon name="calendar" />
					{{ data.createdAt?.substring(0, 10) }}
				</span>
			</div>
			<span
				class="fb-card__badge"
				:class="
					data.entityType === 'DOCTOR' ? 'badge--doctor' : 'badge--service'
				"
			>
				{{ data.entityType === "DOCTOR" ? "Shifokor" : "Xizmat" }}
			</span>
		</div>

		<!-- Stars -->
		<div class="fb-card__stars">
			<span
				v-for="i in 5"
				:key="i"
				class="fb-card__star"
				:class="{ active: i <= data.rating }"
				>★</span
			>
		</div>

		<!-- Quote icon -->
		<!-- <div class="fb-card__quote">"</div> -->

		<!-- Comment -->
		<p class="fb-card__comment">{{ data.comment }}</p>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.fb-card {
	position: relative;
	background: #fff;
	border-radius: 20px;
	padding: 28px 26px 24px;
	border: 1.5px solid rgba(108, 99, 255, 0.08);
	overflow: hidden;
	transition:
		transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
		box-shadow 0.35s ease,
		border-color 0.35s ease;
	cursor: default;

	&:hover {
		box-shadow:
			0 24px 48px rgba(108, 99, 255, 0.1),
			0 4px 12px rgba(0, 0, 0, 0.05);
		border-color: rgba(108, 99, 255, 0.25);
		transform: translateY(-6px) scale(1.01);

		.fb-card__glow {
			opacity: 1;
		}

		.fb-card__quote {
			transform: scale(1.1) rotate(-5deg);
			opacity: 0.08;
		}
	}
	&__date {
		@include text(16, 500, 150%);
		display: flex;
		align-items: center;
		gap: 4px;
		margin-right: auto;
		color: #aaa;

		.icon {
			--icon-size: 16px;
			--icon-color: #aaa;
		}
	}
	/* Ambient glow at top */
	&__glow {
		position: absolute;
		top: -40px;
		right: -40px;
		width: 160px;
		height: 160px;
		background: radial-gradient(
			circle,
			rgba(108, 99, 255, 0.15) 0%,
			transparent 70%
		);
		border-radius: 50%;
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		z-index: 0;
	}

	/* Giant decorative quote */
	&__quote {
		position: absolute;
		bottom: 10px;
		right: 20px;
		font-size: 120px;
		line-height: 1;
		font-family: Georgia, serif;
		color: rgba(108, 99, 255, 0.05);
		transition:
			transform 0.4s ease,
			opacity 0.4s ease;
		pointer-events: none;
		z-index: 0;
		user-select: none;
	}

	/* Top section */
	&__top {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;
	}

	&__avatar {
		flex-shrink: 0;
		width: 46px;
		height: 46px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

		span {
			font-size: 15px;
			font-weight: 700;
			color: #fff;
			letter-spacing: 0.5px;
			text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		}
	}

	&__meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__name {
		font-size: 14px;
		font-weight: 700;
		color: #1a1a2e;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: -0.2px;
	}

	&__date {
		font-size: 11px;
		color: #aaa;
		font-weight: 400;
	}

	&__badge {
		flex-shrink: 0;
		font-size: 10px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 20px;
		letter-spacing: 0.4px;
		text-transform: uppercase;

		&.badge--doctor {
			background: rgba(108, 99, 255, 0.1);
			color: #6c63ff;
		}
		&.badge--service {
			background: rgba(46, 196, 182, 0.1);
			color: #2ec4b6;
		}
	}

	/* Stars */
	&__stars {
		position: relative;
		z-index: 1;
		display: flex;
		gap: 3px;
		margin-bottom: 14px;
	}

	&__star {
		font-size: 16px;
		color: #e8e8e8;
		transition:
			color 0.2s ease,
			transform 0.2s ease;
		display: inline-block;

		&.active {
			color: #fbbf24;
			animation: starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		}

		@for $i from 1 through 5 {
			&:nth-child(#{$i}).active {
				animation-delay: #{($i - 1) * 0.07s};
			}
		}
	}

	/* Comment */
	&__comment {
		position: relative;
		z-index: 1;
		font-size: 14px;
		line-height: 1.65;
		color: #555;
		font-weight: 400;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
	}
}

@keyframes starPop {
	0% {
		transform: scale(0.5);
		opacity: 0;
	}
	60% {
		transform: scale(1.3);
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
