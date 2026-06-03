<script setup>
const { locale } = useI18n();
const route = useRoute();
const { $api } = useNuxtApp();

const { data: checkup } = await useAsyncData(
	`checkup_${route.params.slug}`,
	() => $api(`checkup/${route.params.slug}`),
);

useHead({
	title: computed(
		() =>
			checkup.value?.metaTitle?.[locale.value] ||
			checkup.value?.name?.[locale.value],
	),
	meta: [
		{
			name: "description",
			content: computed(
				() => checkup.value?.metaDescription?.[locale.value],
			),
		},
		{
			property: "og:title",
			content: computed(
				() =>
					checkup.value?.metaTitle?.[locale.value] ||
					checkup.value?.name?.[locale.value],
			),
		},
		{
			property: "og:description",
			content: computed(
				() => checkup.value?.metaDescription?.[locale.value],
			),
		},
		{ property: "og:image", content: computed(() => checkup.value?.image) },
	],
});

// ── Computed helpers ────────────────────────────────────────────
const hasDiscount = computed(
	() =>
		checkup.value?.oldPrice && checkup.value.oldPrice > checkup.value.price,
);

const discountPercent = computed(() => {
	if (!hasDiscount.value) return 0;
	return Math.round(
		((checkup.value.oldPrice - checkup.value.price) /
			checkup.value.oldPrice) *
			100,
	);
});

const durationText = computed(() => {
	const c = checkup.value;
	if (!c) return "";
	if (c.durationText) return c.durationText;
	if (c.durationMinutes) return `${c.durationMinutes} min`;
	if (c.durationHours) return `${c.durationHours} soat`;
	if (c.durationDays) return `${c.durationDays} kun`;
	return "";
});

// Gender localization
const genderLabel = computed(() => {
	const map = {
		CHILD: { uz: "Bolalar", ru: "Дети", en: "Children" },
		MALE: { uz: "Erkaklar", ru: "Мужчины", en: "Male" },
		FEMALE: { uz: "Ayollar", ru: "Женщины", en: "Female" },
		ALL: { uz: "Hammaga", ru: "Для всех", en: "For all" },
	};
	const g = checkup.value?.gender;
	return g && map[g] ? (map[g][locale.value] ?? g) : (g ?? "");
});

// Age text
const ageLabel = computed(() => {
	const c = checkup.value;
	if (!c) return "";
	if (c.ageText) return c.ageText;
	if (c.minAge && c.maxAge) return `${c.minAge}–${c.maxAge} yosh`;
	if (c.minAge) return `${c.minAge}+ yosh`;
	return "";
});

// Discount validity
const formatDate = (d) => {
	if (!d) return "";
	return new Date(d).toLocaleDateString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

const discountPeriod = computed(() => {
	const c = checkup.value;
	if (!c?.discountFrom) return "";
	if (c.discountTo)
		return `${formatDate(c.discountFrom)} – ${formatDate(c.discountTo)}`;
	return `${formatDate(c.discountFrom)}`;
});

// Hero image (main from entityImages, fallback to image)
const heroImage = computed(() => {
	const imgs = checkup.value?.entityImages ?? [];
	const main = imgs.find((i) => i.isMain) || imgs[0];
	return main?.url || checkup.value?.image || "";
});

// Short description (plain text, first paragraph only)
const shortDescText = computed(() => {
	const raw =
		checkup.value?.shortDescription?.[locale.value] ||
		checkup.value?.description?.[locale.value] ||
		"";
	// extract first <p>...</p> content
	const m = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
	const first = m ? m[1] : raw;
	return first
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
});

// Modal
const applyRef = ref();
const openModal = () => applyRef.value?.toOpen();

// Description paragraphs (skip first — already shown as subtitle)
const descParagraphs = computed(() => {
	const raw = checkup.value?.description?.[locale.value] || "";
	return raw
		.split(/<\/p>/i)
		.map((s) =>
			s
				.replace(/<[^>]*>/g, " ")
				.replace(/\s+/g, " ")
				.trim(),
		)
		.filter(Boolean)
		.slice(1, 5); // ← skip first paragraph (duplicate with subtitle)
});

// Combine API features into 3 compact chips (discount, from, to)
const compactFeatures = computed(() => {
	const arr = checkup.value?.features ?? [];
	return arr.slice(0, 3);
});

// ── Static content (stats, journey, reviews) ────────────────────
const stats = [
	{
		icon: "consultant",
		value: "50K+",
		label: { uz: "Bemorlar", ru: "Пациентов", en: "Happy Patients" },
	},
	{
		icon: "calendar",
		value: "25+",
		label: { uz: "Yillik tajriba", ru: "Лет опыта", en: "Years Experience" },
	},
	{
		icon: "check-circle",
		value: "100%",
		label: { uz: "Sertifikatlangan", ru: "Сертифицировано", en: "Certified" },
	},
	{
		icon: "star",
		value: "4.9/5",
		label: { uz: "Bemor reytingi", ru: "Рейтинг", en: "Patient Rating" },
	},
];

const aboutCards = [
	{
		icon: "check-circle",
		title: {
			uz: "Erta aniqlash",
			ru: "Раннее выявление",
			en: "Early Detection",
		},
		text: {
			uz: "Salomatlik muammolarini jiddiy holatga aylanmasdan oldin aniqlang.",
			ru: "Выявляйте проблемы со здоровьем до того, как они станут серьёзными.",
			en: "Identify potential health issues before they become serious problems.",
		},
		color: "blue",
	},
	{
		icon: "star",
		title: { uz: "Kuzatuv", ru: "Контроль прогресса", en: "Track Progress" },
		text: {
			uz: "Salomatlik ko'rsatkichlarini muntazam kuzatib boring.",
			ru: "Следите за показателями здоровья и улучшениями со временем.",
			en: "Monitor your health metrics and see improvements over time.",
		},
		color: "red",
	},
	{
		icon: "apply",
		title: { uz: "Choralar", ru: "Действуйте", en: "Take Action" },
		text: {
			uz: "Sizning ehtiyojlaringizga moslashtirilgan tavsiyalarni oling.",
			ru: "Получите персональные рекомендации, подходящие вам.",
			en: "Get personalized recommendations tailored to your needs.",
		},
		color: "blue",
	},
];

const journeySteps = [
	{
		icon: "calendar",
		title: {
			uz: "Online Buyurtma",
			ru: "Онлайн-запись",
			en: "Book Online",
		},
		text: {
			uz: "Uydan chiqmasdan, 2 daqiqada vaqt band qiling — 24/7 ishlaydi.",
			ru: "Запишитесь за 2 минуты, не выходя из дома — работаем 24/7.",
			en: "Schedule in 2 minutes without leaving home — available 24/7.",
		},
	},
	{
		icon: "check-circle",
		title: {
			uz: "Klinikaga Kelish & Ro'yxat",
			ru: "Приезд в клинику & Регистрация",
			en: "Arrive & Check-In",
		},
		text: {
			uz: "Navbatsiz qabul. Iliq muhit, tez xizmat — vaqtingizni tejaymiz.",
			ru: "Приём без очереди. Тёплая атмосфера, быстрое обслуживание — ценим ваше время.",
			en: "No waiting in line. Warm atmosphere, fast service — we respect your time.",
		},
	},
	{
		icon: "consultant",
		title: {
			uz: "Tekshiruvlar & Mutaxassis Maslahati",
			ru: "Обследование & Консультация",
			en: "Tests & Specialist Consultation",
		},
		text: {
			uz: "Zamonaviy uskunalar + tajribali shifokorlar = aniq natija.",
			ru: "Современное оборудование + опытные врачи = точный результат.",
			en: "Modern equipment + experienced doctors = accurate results.",
		},
		accent: true,
	},
	{
		icon: "apply",
		title: {
			uz: "Natijangizni Oling",
			ru: "Получите результаты",
			en: "Receive Your Results",
		},
		text: {
			uz: "Shaxsiy hisobot + keyingi qadam tavsiyalari — raqamli formatda.",
			ru: "Персональный отчёт + рекомендации по дальнейшим шагам — в цифровом формате.",
			en: "Personal report + next-step recommendations — in digital format.",
		},
	},
];

const reviews = [
	{
		rating: 5,
		text: {
			uz: "Ajoyib xizmat! Butun jarayon silliq va xodimlar professional edi.",
			ru: "Отличный сервис! Весь процесс был гладким, персонал — профессиональный.",
			en: "Excellent service! The entire process was smooth and the staff was very professional.",
		},
		name: "John Smith",
		date: { uz: "Mart 2026", ru: "Март 2026", en: "March 2026" },
	},
	{
		rating: 5,
		text: {
			uz: "Juda batafsil tekshiruv. Shifokorlarning tushuntirishi yoqdi.",
			ru: "Очень подробный осмотр. Понравились детальные объяснения врачей.",
			en: "Very comprehensive check-up. I appreciated the detailed explanations from the doctors.",
		},
		name: "Maria Garcia",
		date: { uz: "Fevral 2026", ru: "Февраль 2026", en: "February 2026" },
	},
	{
		rating: 5,
		text: {
			uz: "Pulga arziydi. Chegirma yanada yaxshi qildi. Tavsiya qilaman!",
			ru: "Отличное соотношение цены и качества. Скидка сделала ещё лучше. Рекомендую!",
			en: "Great value for money. The discount made it even better. Highly recommend!",
		},
		name: "David Lee",
		date: { uz: "Yanvar 2026", ru: "Январь 2026", en: "January 2026" },
	},
];

// ── Tabs (Diagnostic Tests / Consultations) — STATIC ────────────
const staticTabs = [
	{
		key: "DIAGNOSTIC",
		label: { uz: "Diagnostika", ru: "Диагностика", en: "Diagnostic Tests" },
		headline: {
			uz: "Kompleks diagnostika",
			ru: "Комплексная диагностика",
			en: "Comprehensive Diagnostic Tests",
		},
		sub: {
			uz: "Barcha testlar sertifikatlangan laboratoriyada bajariladi",
			ru: "Все тесты выполняются в сертифицированной лаборатории",
			en: "All tests performed in our NABL accredited laboratory with ISO certification",
		},
		items: [
			{
				emoji: "🩸",
				name: {
					uz: "To‘liq qon tahlili (UQT)",
					ru: "Общий анализ крови",
					en: "Complete Blood Count (CBC)",
				},
				cat: { uz: "Gematologiya", ru: "Гематология", en: "Hematology" },
				desc: {
					uz: "Umumiy sog‘liqni baholash",
					ru: "Оценка общего состояния здоровья",
					en: "Evaluates overall health and detects disorders",
				},
			},
			{
				emoji: "🍯",
				name: {
					uz: "Qondagi glyukoza testi",
					ru: "Анализ на глюкозу",
					en: "Blood Glucose Test",
				},
				cat: {
					uz: "Diabet skriningi",
					ru: "Скрининг диабета",
					en: "Diabetes Screening",
				},
				desc: {
					uz: "Qondagi shakar darajasini o‘lchaydi",
					ru: "Измеряет уровень сахара в крови",
					en: "Measures blood sugar levels",
				},
			},
			{
				emoji: "❤️",
				name: {
					uz: "Lipid profili",
					ru: "Липидный профиль",
					en: "Lipid Profile",
				},
				cat: {
					uz: "Yurak-qon tomir",
					ru: "Сердечно-сосудистый",
					en: "Cardiovascular",
				},
				desc: {
					uz: "Xolesterin va triglitseridlarni tekshiradi",
					ru: "Проверяет холестерин и триглицериды",
					en: "Checks cholesterol and triglycerides",
				},
			},
			{
				emoji: "🦋",
				name: {
					uz: "Qalqonsimon bez tahlili",
					ru: "Анализ щитовидной железы",
					en: "Thyroid Function Test",
				},
				cat: {
					uz: "Endokrinologiya",
					ru: "Эндокринология",
					en: "Endocrine",
				},
				desc: {
					uz: "Gormon darajalarini baholaydi",
					ru: "Оценивает уровень гормонов",
					en: "Assesses thyroid hormone levels",
				},
			},
			{
				emoji: "🫀",
				name: {
					uz: "Jigar funksiyasi testi",
					ru: "Анализ функции печени",
					en: "Liver Function Test",
				},
				cat: { uz: "Gepatologiya", ru: "Гепатология", en: "Hepatic" },
				desc: {
					uz: "Jigar sog‘ligini baholaydi",
					ru: "Оценивает здоровье печени",
					en: "Evaluates liver health and function",
				},
			},
			{
				emoji: "💧",
				name: {
					uz: "Buyrak funksiyasi testi",
					ru: "Анализ функции почек",
					en: "Kidney Function Test",
				},
				cat: { uz: "Nefrologiya", ru: "Нефрология", en: "Renal" },
				desc: {
					uz: "Buyrak ishini o‘lchaydi",
					ru: "Измеряет работу почек",
					en: "Measures kidney performance",
				},
			},
			{
				emoji: "🌟",
				name: {
					uz: "D vitamini darajasi",
					ru: "Уровень витамина D",
					en: "Vitamin D Level",
				},
				cat: { uz: "Ozuqaviy", ru: "Питательный", en: "Nutritional" },
				desc: {
					uz: "D vitamini yetishmovchiligini tekshiradi",
					ru: "Проверяет дефицит витамина D",
					en: "Checks vitamin D deficiency",
				},
			},
			{
				emoji: "📊",
				name: {
					uz: "Elektrokardiogramma (EKG)",
					ru: "Электрокардиограмма (ЭКГ)",
					en: "Electrocardiogram (ECG)",
				},
				cat: { uz: "Kardiologiya", ru: "Кардиология", en: "Cardiac" },
				desc: {
					uz: "Yurak elektr faolligini qayd etadi",
					ru: "Записывает электрическую активность сердца",
					en: "Records heart electrical activity",
				},
			},
		],
	},
	{
		key: "CONSULTATION",
		label: {
			uz: "Konsultatsiyalar",
			ru: "Консультации",
			en: "Consultations",
		},
		headline: {
			uz: "Mutaxassis konsultatsiyalari",
			ru: "Консультации специалистов",
			en: "Expert Consultations",
		},
		sub: {
			uz: "Tajribali shifokorlar bilan shaxsiy uchrashuvlar",
			ru: "Личные встречи с опытными врачами",
			en: "Personal consultations with board-certified specialists",
		},
		items: [
			{
				emoji: "🫀",
				name: {
					uz: "Kardiolog konsultatsiyasi",
					ru: "Консультация кардиолога",
					en: "Cardiologist Consultation",
				},
				cat: {
					uz: "Yurak-qon tomir",
					ru: "Сердечно-сосудистый",
					en: "Cardiovascular",
				},
				desc: {
					uz: "Yurak salomatligini chuqur baholash",
					ru: "Глубокая оценка здоровья сердца",
					en: "In-depth evaluation of heart health",
				},
			},
			{
				emoji: "🧠",
				name: {
					uz: "Nevrolog konsultatsiyasi",
					ru: "Консультация невролога",
					en: "Neurologist Consultation",
				},
				cat: { uz: "Nevrologiya", ru: "Неврология", en: "Neurology" },
				desc: {
					uz: "Asab tizimi tekshiruvi",
					ru: "Обследование нервной системы",
					en: "Nervous system examination",
				},
			},
			{
				emoji: "🩺",
				name: {
					uz: "Terapevt konsultatsiyasi",
					ru: "Консультация терапевта",
					en: "General Practitioner",
				},
				cat: {
					uz: "Umumiy amaliyot",
					ru: "Общая практика",
					en: "General Practice",
				},
				desc: {
					uz: "Umumiy salomatlik bo‘yicha maslahat",
					ru: "Общая консультация по здоровью",
					en: "General health consultation",
				},
			},
			{
				emoji: "👁️",
				name: {
					uz: "Oftalmolog konsultatsiyasi",
					ru: "Консультация офтальмолога",
					en: "Ophthalmologist Consult",
				},
				cat: {
					uz: "Oftalmologiya",
					ru: "Офтальмология",
					en: "Ophthalmology",
				},
				desc: {
					uz: "Ko‘rish va ko‘z salomatligi",
					ru: "Зрение и здоровье глаз",
					en: "Vision and eye health check",
				},
			},
		],
	},
];

const activeTab = ref("DIAGNOSTIC");
const currentTab = computed(
	() => staticTabs.find((t) => t.key === activeTab.value) ?? staticTabs[0],
);
</script>

<template>
	<div class="ck-page" v-if="checkup">
		<div class="container ck-page__inner">
			<!-- ══════════════════ MAIN TWO-PANEL ══════════════════ -->
			<div class="ck-layout">
				<!-- ── LEFT: Hero image ─────────────────────────── -->
				<div class="ck-panel">
					<img
						:src="heroImage"
						:alt="checkup.name?.[locale]"
						class="ck-panel__bg"
					/>
					<div class="ck-panel__overlay" aria-hidden="true"></div>

					<!-- Bottom info -->
					<div class="ck-panel__bottom">
						<div class="ck-panel__top-row">
							<span v-if="genderLabel" class="ck-panel__badge">
								{{ genderLabel }}
							</span>
						</div>
						<h1 class="ck-panel__title">{{ checkup.name?.[locale] }}</h1>
						<p v-if="ageLabel" class="ck-panel__subtitle">
							{{ ageLabel }}
						</p>
					</div>
				</div>

				<!-- ── RIGHT: Info card ─────────────────────────── -->
				<div class="ck-card">
					<div class="ck-card__header">
						<h2 class="ck-card__title">
							{{ shortDescText || checkup.name?.[locale] }}
						</h2>
					</div>

					<!-- Features from API + computed -->
					<div class="ck-card__features">
						<!-- Items count -->
						<div v-if="checkup.items?.length" class="ck-feat">
							<div class="ck-feat__icon">
								<Icon name="check-circle" />
							</div>
							<div class="ck-feat__body">
								<b>{{ checkup.items.length }} {{ $t("checTitle") }}</b>
								<span>{{ $t("service.prescriptionSupport") }}</span>
							</div>
						</div>

						<!-- Duration -->
						<div v-if="durationText" class="ck-feat">
							<div class="ck-feat__icon"><Icon name="clock" /></div>
							<div class="ck-feat__body">
								<b>{{ durationText }}</b>
								<span>{{ $t("service.followUp") }}</span>
							</div>
						</div>

						<!-- Gender -->
						<div v-if="genderLabel" class="ck-feat">
							<div class="ck-feat__icon"><Icon name="consultant" /></div>
							<div class="ck-feat__body">
								<b>{{ genderLabel }}</b>
								<span v-if="ageLabel">{{ ageLabel }}</span>
							</div>
						</div>

						<!-- API features — combined into ONE compact row -->
						<div
							v-if="compactFeatures.length"
							class="ck-feat ck-feat--light"
						>
							<div class="ck-feat__icon"><Icon name="star" /></div>
							<div class="ck-feat__body">
								<b>{{ compactFeatures[0] }}</b>
								<span v-if="compactFeatures.length > 1">
									{{ compactFeatures.slice(1).join(" · ") }}
								</span>
							</div>
						</div>
					</div>

					<!-- Price block -->
					<div class="ck-card__price-block">
						<div class="ck-card__price-label">
							{{ $t("service.PRICE") }}
						</div>
						<div class="ck-card__price-row">
							<div class="ck-card__price-nums">
								<span class="ck-card__current">
									{{ checkup.price?.toLocaleString() }}
									<small>{{ $t("service.sum") }}</small>
								</span>
								<span v-if="hasDiscount" class="ck-card__old">
									{{ checkup.oldPrice.toLocaleString() }}
									{{ $t("service.sum") }}
								</span>
							</div>
							<span v-if="hasDiscount" class="ck-card__discount-badge">
								−{{ discountPercent }}%
							</span>
						</div>

						<!-- Discount period -->
						<p v-if="discountPeriod" class="ck-card__discount-period">
							<Icon name="calendar" />
							{{ discountPeriod }}
						</p>

						<button class="ck-card__btn" type="button" @click="openModal">
							<span>{{ $t("apply.title") }}</span>
							<Icon name="arrow-right" />
						</button>
					</div>
				</div>
			</div>

			<!-- ══════════════════ STATS (4 cards) ══════════════════ -->
			<div class="ck-stats">
				<div
					v-for="(s, i) in stats"
					:key="i"
					class="ck-stat"
					:class="`ck-stat--${i}`"
				>
					<div class="ck-stat__icon"><Icon :name="s.icon" /></div>
					<div class="ck-stat__body">
						<b class="ck-stat__value">{{ s.value }}</b>
						<span class="ck-stat__label">{{ s.label[locale] }}</span>
					</div>
				</div>
			</div>

			<!-- ══════════════════ ABOUT THIS PACKAGE ══════════════════ -->
			<div class="ck-about">
				<span class="ck-about__badge">{{
					locale === "uz"
						? "Paket haqida"
						: locale === "ru"
							? "О пакете"
							: "About This Package"
				}}</span>
				<h2 class="ck-about__title">{{ checkup.name?.[locale] }}</h2>
				<p class="ck-about__sub">{{ shortDescText }}</p>

				<div class="ck-about__cards">
					<div
						v-for="(c, i) in aboutCards"
						:key="i"
						class="ck-about__card"
						:class="`ck-about__card--${c.color}`"
					>
						<div class="ck-about__card-icon"><Icon :name="c.icon" /></div>
						<h3 class="ck-about__card-title">{{ c.title[locale] }}</h3>
						<p class="ck-about__card-text">{{ c.text[locale] }}</p>
					</div>
				</div>

				<div v-if="descParagraphs.length" class="ck-about__text">
					<p v-for="(p, i) in descParagraphs" :key="i">{{ p }}</p>
				</div>
			</div>

			<!-- ══════════════════ TABS (Diagnostic / Consultations) ══ -->
			<div class="ck-tabs">
				<div class="ck-tabs__head">
					<button
						v-for="tab in staticTabs"
						:key="tab.key"
						class="ck-tabs__tab"
						:class="{ 'is-active': activeTab === tab.key }"
						@click="activeTab = tab.key"
					>
						<Icon
							:name="
								tab.key === 'CONSULTATION'
									? 'consultant'
									: 'check-circle'
							"
							class="ck-tabs__tab-icon"
						/>
						{{ tab.label[locale] }} ({{ tab.items.length }})
					</button>
				</div>

				<Transition name="tab-fade" mode="out-in">
					<div class="ck-tabs__body" :key="currentTab.key">
						<h3 class="ck-tabs__title">
							{{ currentTab.headline[locale] }}
						</h3>
						<p class="ck-tabs__sub">{{ currentTab.sub[locale] }}</p>

						<div class="ck-tabs__grid">
							<div
								v-for="(item, i) in currentTab.items"
								:key="i"
								class="ck-test-card"
								:style="{ '--i': i }"
							>
								<div class="ck-test-card__emoji">{{ item.emoji }}</div>
								<div class="ck-test-card__body">
									<h4 class="ck-test-card__name">
										{{ item.name[locale] }}
									</h4>
									<span class="ck-test-card__cat">{{
										item.cat[locale]
									}}</span>
									<p class="ck-test-card__desc">
										{{ item.desc[locale] }}
									</p>
								</div>
								<div class="ck-test-card__check">
									<Icon name="check-circle" />
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</div>

			<!-- ══════════════════ JOURNEY TIMELINE ══════════════════ -->
			<div class="ck-journey">
				<span class="ck-journey__badge">
					{{
						locale === "uz"
							? "Qanday ishlaydi?"
							: locale === "ru"
								? "Как это работает?"
								: "How does it work?"
					}}
				</span>
				<h2 class="ck-journey__title">
					{{
						locale === "uz"
							? "Zamonaviy Check-Up — 1 kunda, 1 joyda"
							: locale === "ru"
								? "Современный Check-Up — за 1 день, в 1 месте"
								: "Modern Check-Up — 1 day, 1 place"
					}}
				</h2>
				<p class="ck-journey__sub">
					{{
						locale === "uz"
							? "Barcha tahlillar, ko'riklar va mutaxassis maslahatlari — bir kunda, qulay sharoitda."
							: locale === "ru"
								? "Все анализы, осмотры и консультации специалистов — в один день, в комфортных условиях."
								: "All tests, examinations and specialist consultations — in one day, in comfortable conditions."
					}}
				</p>

				<div class="ck-journey__steps">
					<div
						v-for="(step, i) in journeySteps"
						:key="i"
						class="ck-journey__step"
						:class="{ 'is-accent': step.accent }"
					>
						<div class="ck-journey__icon"><Icon :name="step.icon" /></div>
						<h4 class="ck-journey__step-title">
							{{ step.title[locale] }}
						</h4>
						<p class="ck-journey__step-text">{{ step.text[locale] }}</p>
						<div
							v-if="i < journeySteps.length - 1"
							class="ck-journey__line"
							aria-hidden="true"
						></div>
					</div>
				</div>

				<div class="ck-journey__footer">
					<div class="ck-journey__info">
						<Icon name="clock" />
						<div>
							<b>{{
								locale === "uz"
									? "Umumiy vaqt"
									: locale === "ru"
										? "Общее время"
										: "Total Time"
							}}</b>
							<span>{{
								locale === "uz"
									? "2–3 soat"
									: locale === "ru"
										? "2–3 часа"
										: "2–3 hours"
							}}</span>
						</div>
					</div>
					<div class="ck-journey__info">
						<Icon name="smartphone" />
						<div>
							<b>{{
								locale === "uz"
									? "Natijalar"
									: locale === "ru"
										? "Результаты"
										: "Results"
							}}</b>
							<span>{{
								locale === "uz"
									? "24–48 soat ichida — telefoningizga"
									: locale === "ru"
										? "В течение 24–48 часов — на ваш телефон"
										: "Within 24–48 hours — delivered to your phone"
							}}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- ══════════════════ REVIEWS ══════════════════ -->
			<div class="ck-reviews">
				<h2 class="ck-reviews__title">
					{{
						locale === "uz"
							? "Bemorlarimiz fikrlari"
							: locale === "ru"
								? "Отзывы пациентов"
								: "What Our Patients Say"
					}}
				</h2>
				<p class="ck-reviews__sub">
					{{
						locale === "uz"
							? "Minglab mamnun bemorlar tomonidan ishonchli"
							: locale === "ru"
								? "Нам доверяют тысячи довольных пациентов"
								: "Trusted by thousands of satisfied patients"
					}}
				</p>
				<div class="ck-reviews__grid">
					<div v-for="(r, i) in reviews" :key="i" class="ck-review">
						<div class="ck-review__stars">
							<Icon v-for="n in r.rating" :key="n" name="star" />
						</div>
						<p class="ck-review__text">"{{ r.text[locale] }}"</p>
						<div class="ck-review__foot">
							<div>
								<b>{{ r.name }}</b>
								<span>{{ r.date[locale] }}</span>
							</div>
							<Icon name="check-circle" class="ck-review__verified" />
						</div>
					</div>
				</div>
			</div>

			<!-- ══════════════════ FINAL CTA ══════════════════ -->
			<div class="ck-cta">
				<div class="ck-cta__left">
					<h2 class="ck-cta__title">
						{{
							locale === "uz"
								? "Salomatligingizni nazoratga oling"
								: locale === "ru"
									? "Возьмите здоровье под контроль"
									: "Ready to Take Control of Your Health?"
						}}
					</h2>
					<p class="ck-cta__sub">
						{{
							locale === "uz"
								? "Bugun kompleks tekshiruvga yoziling va chegirmaga ega bo'ling."
								: locale === "ru"
									? "Запишитесь сегодня и получите скидку на комплексное обследование."
									: "Book your comprehensive check-up today and get a discount."
						}}
					</p>
					<div v-if="checkup.price" class="ck-cta__price">
						<span class="ck-cta__price-current">
							{{ checkup.price.toLocaleString() }}
							{{ $t("service.sum") }}
						</span>
						<span v-if="hasDiscount" class="ck-cta__price-old">
							{{ checkup.oldPrice.toLocaleString() }}
						</span>
						<span v-if="hasDiscount" class="ck-cta__save"
							>−{{ discountPercent }}%</span
						>
					</div>
				</div>
				<div class="ck-cta__right">
					<button
						class="ck-cta__btn ck-cta__btn--primary"
						@click="openModal"
					>
						<Icon name="calendar" />
						{{ $t("apply.title") }}
					</button>
				</div>
			</div>
		</div>

		<!-- Modal -->
		<SectionHeaderApply ref="applyRef" />
	</div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/config/mixins" as *;

$primary: #33c1ed;
$primary-dk: rgba(15, 82, 159, 1);
$primary-lt: rgba(51, 193, 237, 0.12);
$red: #ef4444;
$green: #16a34a;
$border: rgba(2, 10, 20, 0.08);
$dark: #03182b;
$muted: #64748b;
$shadow-md: 0 12px 48px rgba(0, 0, 0, 0.14);
$shadow-sm: 0 4px 18px rgba(0, 0, 0, 0.07);

// ── Page ─────────────────────────────────────────────────────
.ck-page {
	padding: 48px 0 100px;
	background: #f0f6ff;
	@include devices(sm) {
		padding: 20px 0 60px;
	}
	&__inner {
		--width-container: 1320px;
		max-width: 1320px;
	}
}

// ── Two-panel layout ──────────────────────────────────────────
.ck-layout {
	display: grid;
	grid-template-columns: 1fr 1fr;
	border-radius: 28px;
	overflow: hidden;
	box-shadow: $shadow-md;
	min-height: 600px;

	@include devices(lg) {
		min-height: 520px;
	}
	@include devices(md) {
		grid-template-columns: 1fr;
		min-height: auto;
	}
}

// ── LEFT PANEL (image) ────────────────────────────────────────
.ck-panel {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-end; // ← text goes to bottom
	min-height: 600px;
	overflow: hidden;
	order: 1; // mobile: image first

	@include devices(lg) {
		min-height: 540px;
	}
	@include devices(md) {
		min-height: 420px;
	}
	@include devices(xs) {
		min-height: 340px;
	}

	// Subtle hover zoom
	&:hover &__bg {
		transform: scale(1.04);
	}

	&__bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: 0;
		transition: transform 1.2s ease;
	}

	// Stronger gradient at bottom for readable text
	&__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba($dark, 0.95) 0%,
			rgba($dark, 0.7) 30%,
			rgba($dark, 0.25) 60%,
			rgba($dark, 0) 100%
		);
		z-index: 1;
	}

	// ── Bottom info block (now actually at bottom)
	&__bottom {
		position: relative;
		z-index: 2;
		padding: 36px 32px;
		display: flex;
		flex-direction: column;
		gap: 14px;

		@include devices(md) {
			padding: 28px 24px;
		}
		@include devices(xs) {
			padding: 22px 20px;
			gap: 10px;
		}
	}

	&__top-row {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	&__badge {
		display: inline-flex;
		align-items: center;
		background: linear-gradient(135deg, $primary 0%, #4dd6ff 100%);
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		padding: 6px 16px;
		border-radius: 999px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		box-shadow: 0 6px 18px rgba($primary, 0.45);
	}

	&__gender {
		display: inline-flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		padding: 5px 14px;
		border-radius: 999px;
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.25);
	}

	&__title {
		font-size: clamp(1.5rem, 3vw, 2.4rem);
		font-weight: 800;
		color: #fff;
		line-height: 1.12;
		margin: 0;
		letter-spacing: -0.01em;
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
	}

	&__subtitle {
		font-size: 15px;
		color: rgba(255, 255, 255, 0.78);
		margin: 0;
		line-height: 1.5;
	}

	&__btn {
		margin-top: 8px;
		align-self: flex-start;

		@include devices(xs) {
			align-self: stretch;
			width: 100%;
		}
	}
}

// ── RIGHT CARD ────────────────────────────────────────────────
.ck-card {
	position: relative;
	background: linear-gradient(
		145deg,
		$primary-dk 0%,
		#1e6ed8 60%,
		#2986e8 100%
	);
	display: flex;
	flex-direction: column;
	padding: 32px 28px;
	order: 2; // mobile: info card second (below image)
	overflow: hidden;

	// Decorative orb (top-right)
	&::before {
		content: "";
		position: absolute;
		top: -120px;
		right: -120px;
		width: 320px;
		height: 320px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba($primary, 0.35) 0%,
			transparent 70%
		);
		pointer-events: none;
		z-index: 0;
	}
	// Decorative orb (bottom-left)
	&::after {
		content: "";
		position: absolute;
		bottom: -100px;
		left: -80px;
		width: 240px;
		height: 240px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(255, 255, 255, 0.08) 0%,
			transparent 70%
		);
		pointer-events: none;
		z-index: 0;
	}

	> * {
		position: relative;
		z-index: 1;
	}

	@include devices(lg) {
		padding: 24px 20px;
	}
	@include devices(md) {
		padding: 22px 20px;
	}
	@include devices(xs) {
		padding: 18px 16px;
	}

	&__header {
		margin-bottom: 18px;
		@include devices(sm) {
			margin-bottom: 14px;
		}
	}

	&__title {
		font-size: clamp(0.95rem, 1.6vw, 1.05rem);
		font-weight: 500;
		color: rgba(255, 255, 255, 0.92);
		line-height: 1.55;
		margin: 0;
		letter-spacing: 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		overflow: hidden;
	}

	&__desc {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.65;
		margin: 0;
	}

	&__features {
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
		margin-bottom: 18px;

		@include devices(sm) {
			gap: 7px;
			margin-bottom: 14px;
		}
	}

	// White price block
	&__price-block {
		background: #fff;
		border-radius: 18px;
		padding: 18px 20px;
		margin-top: auto;
		@include devices(xs) {
			padding: 14px 16px;
		}
	}

	&__price-label {
		font-size: 11px;
		font-weight: 600;
		color: $muted;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		margin-bottom: 8px;
	}

	&__price-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 6px;
		flex-wrap: wrap;
	}

	&__price-nums {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
	}

	&__current {
		font-size: clamp(1.3rem, 2.5vw, 1.8rem);
		font-weight: 800;
		color: $dark;
		small {
			font-size: 13px;
			font-weight: 600;
			color: $muted;
		}
	}

	&__old {
		font-size: 13px;
		color: #94a3b8;
		text-decoration: line-through;
	}

	&__discount-badge {
		flex-shrink: 0;
		background: $red;
		color: #fff;
		font-size: 13px;
		font-weight: 700;
		padding: 4px 10px;
		border-radius: 8px;
		box-shadow: 0 3px 8px rgba($red, 0.35);
	}

	&__discount-period {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 500;
		color: $primary-dk;
		background: rgba($primary, 0.08);
		border: 1px solid rgba($primary, 0.18);
		padding: 5px 10px;
		border-radius: 8px;
		margin: 0 0 14px;

		:deep(.icon),
		:deep(svg) {
			width: 13px;
			height: 13px;
			color: $primary-dk;
			fill: $primary-dk;
			stroke: $primary-dk;
		}
	}

	&__btn {
		width: 100%;
		margin-top: 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 50px;
		padding: 0 24px;
		background: var(--blue-4);
		color: #fff;
		border: none;
		border-radius: 10px;
		font-family: inherit;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;

		:deep(.icon),
		:deep(svg) {
			width: 18px;
			height: 18px;
			color: #fff;
			fill: #fff;
			stroke: #fff;
			transition: transform 0.25s ease;
		}
		:deep(svg *) { fill: #fff !important; stroke: #fff !important; }

		&:hover {
			background: #0f3f8c;
			transform: translateY(-2px);
			box-shadow: 0 10px 24px rgba(15, 82, 159, 0.4);

			:deep(svg) { transform: translateX(4px); }
		}

		&:active {
			transform: translateY(0);
			box-shadow: 0 6px 16px rgba(15, 82, 159, 0.3);
		}
	}
}

// ── Feature row (BRIGHTER + compact on mobile) ────────────────
.ck-feat {
	display: flex;
	align-items: center;
	gap: 12px;
	background: rgba(255, 255, 255, 0.18);
	border-radius: 12px;
	padding: 10px 14px;
	border: 1px solid rgba(255, 255, 255, 0.28);
	backdrop-filter: blur(10px);
	box-shadow:
		inset 0 1px 0 rgba(255, 255, 255, 0.18),
		0 4px 12px rgba(0, 0, 0, 0.08);
	transition:
		background 0.2s ease,
		transform 0.2s ease,
		border-color 0.2s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.24);
		border-color: rgba(255, 255, 255, 0.4);
		transform: translateX(2px);
	}

	@include devices(sm) {
		padding: 9px 12px;
		gap: 10px;
		border-radius: 10px;
	}
	@include devices(xs) {
		padding: 8px 10px;
		gap: 9px;
		&:hover {
			transform: none;
		}
	}

	&--light {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.2);
	}

	&__icon {
		flex-shrink: 0;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.42) 0%,
			rgba(255, 255, 255, 0.22) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);

		@include devices(sm) {
			width: 34px;
			height: 34px;
			border-radius: 9px;
			:deep(svg) {
				width: 17px;
				height: 17px;
			}
		}
		@include devices(xs) {
			width: 30px;
			height: 30px;
			:deep(svg) {
				width: 15px;
				height: 15px;
			}
		}

		:deep(.icon),
		:deep(svg) {
			width: 18px;
			height: 18px;
			color: #fff;
			fill: #fff;
			stroke: #fff;
		}
		:deep(svg *) {
			fill: #fff !important;
			stroke: #fff !important;
		}
	}

	&__body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;

		b {
			font-size: 13.5px;
			font-weight: 700;
			color: #fff;
			line-height: 1.3;
		}
		span {
			font-size: 12px;
			color: rgba(255, 255, 255, 0.78);
			line-height: 1.3;
		}

		@include devices(xs) {
			b {
				font-size: 12.5px;
			}
			span {
				font-size: 11px;
			}
		}
	}
}

// ══════════════════════════════════════════════════════════════
//  STATS (4 cards)
// ══════════════════════════════════════════════════════════════
.ck-stats {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-top: 32px;

	@include devices(lg) {
		gap: 12px;
	}
	@include devices(md) {
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-top: 24px;
	}
	@include devices(xs) {
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}
}

.ck-stat {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 18px 20px;
	background: #fff;
	border-radius: 16px;
	border: 1px solid $border;
	box-shadow: $shadow-sm;
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;
	animation: floatUp 0.55s ease-out backwards;

	&--0 {
		animation-delay: 0.05s;
	}
	&--1 {
		animation-delay: 0.15s;
	}
	&--2 {
		animation-delay: 0.25s;
	}
	&--3 {
		animation-delay: 0.35s;
	}

	&:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
	}

	@include devices(xs) {
		padding: 14px 16px;
		gap: 10px;
	}

	&__icon {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;

		:deep(.icon),
		:deep(svg) {
			width: 24px;
			height: 24px;
			fill: currentColor;
			stroke: currentColor;
		}

		@include devices(xs) {
			width: 40px;
			height: 40px;
			:deep(svg) {
				width: 20px;
				height: 20px;
			}
		}
	}

	// Per-card icon colors (inspired by reference)
	&--0 &__icon {
		background: rgba(59, 130, 246, 0.12);
		color: #3b82f6;
	}
	&--1 &__icon {
		background: rgba(34, 197, 94, 0.12);
		color: #22c55e;
	}
	&--2 &__icon {
		background: rgba(168, 85, 247, 0.12);
		color: #a855f7;
	}
	&--3 &__icon {
		background: rgba(239, 68, 68, 0.12);
		color: #ef4444;
	}

	&__value {
		font-size: clamp(1.2rem, 2vw, 1.6rem);
		font-weight: 800;
		color: $dark;
		line-height: 1;
	}

	&__label {
		font-size: 13px;
		color: $muted;
		font-weight: 500;
		margin-top: 4px;
		display: block;
	}

	&__body {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
}

// ══════════════════════════════════════════════════════════════
//  ABOUT THIS PACKAGE
// ══════════════════════════════════════════════════════════════
.ck-about {
	margin-top: 56px;
	padding: 48px 36px;
	background: #fff;
	border-radius: 24px;
	box-shadow: $shadow-sm;
	text-align: center;
   

	@include devices(md) {
		margin-top: 40px;
		padding: 36px 24px;
		border-radius: 20px;
	}
	@include devices(sm) {
		margin-top: 28px;
		padding: 24px 16px;
		border-radius: 18px;
	}
	@include devices(xs) {
		padding: 22px 14px;
	}

	&__badge {
		display: inline-block;
		background: $primary-lt;
		color: $primary-dk;
		font-size: 13px;
		font-weight: 700;
		padding: 6px 18px;
		border-radius: 999px;
		margin-bottom: 16px;
	}

	&__title {
		font-size: clamp(1.5rem, 3vw, 2.2rem);
		font-weight: 800;
		color: $dark;
		margin: 0 0 12px;
		letter-spacing: -0.01em;
	}

	&__sub {
		font-size: clamp(0.95rem, 1.5vw, 1.05rem);
		color: $muted;
		line-height: 1.6;
		margin: 0 auto 36px;
		max-width: 720px;
	}

	&__cards,
	&__text {
		width: 100%;
		box-sizing: border-box;
		margin-left: 0;
		margin-right: 0;
	}

	&__cards {
		max-width: 900px;
      margin: 0px auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
		margin-bottom: 36px;

		@include devices(lg) {
			gap: 14px;
		}
		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 14px;
			margin-bottom: 24px;
		}
	}

	&__text {
		text-align: left;
		padding-top: 4px;

		p {
			font-size: 15px;
			color: #475569;
			line-height: 1.75;
			margin: 0 0 12px;
			&:last-child {
				margin-bottom: 0;
			}
		}

		@include devices(sm) {
			p {
				font-size: 14px;
				line-height: 1.65;
			}
		}
	}

	&__card {
		padding: 26px 22px;
		border-radius: 18px;
		text-align: center;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
		animation: floatUp 0.55s ease-out backwards;

		&:nth-child(1) {
			animation-delay: 0.1s;
		}
		&:nth-child(2) {
			animation-delay: 0.22s;
		}
		&:nth-child(3) {
			animation-delay: 0.34s;
		}

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 14px 32px rgba(0, 0, 0, 0.08);
		}

		&--blue {
			background: linear-gradient(
				180deg,
				rgba(59, 130, 246, 0.1) 0%,
				rgba(59, 130, 246, 0.02) 100%
			);
		}
		&--red {
			background: linear-gradient(
				180deg,
				rgba(239, 68, 68, 0.1) 0%,
				rgba(239, 68, 68, 0.02) 100%
			);
		}
	}

	&__card-icon {
		width: 56px;
		height: 56px;
		border-radius: 14px;
		margin: 0 auto 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;

		.ck-about__card--blue & {
			background: linear-gradient(135deg, #3b82f6, #1e40af);
			box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
		}
		.ck-about__card--red & {
			background: linear-gradient(135deg, $red, #b91c1c);
			box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
		}

		:deep(.icon),
		:deep(svg) {
			width: 26px;
			height: 26px;
			color: #fff;
			fill: #fff;
			stroke: #fff;
		}
		:deep(svg *) {
			fill: #fff !important;
			stroke: #fff !important;
		}
	}

	&__card-title {
		font-size: 17px;
		font-weight: 800;
		color: $dark;
		margin: 0 0 8px;
	}

	&__card-text {
		font-size: 13.5px;
		color: $muted;
		line-height: 1.55;
		margin: 0;
	}

	&__text {
		text-align: left;
		max-width: 900px;
		margin: 0 auto;
		p {
			font-size: 15px;
			color: #475569;
			line-height: 1.75;
			margin: 0 0 14px;
		}
	}
}

// ══════════════════════════════════════════════════════════════
//  TABS (Diagnostic / Consultations)
// ══════════════════════════════════════════════════════════════
.ck-tabs {
	margin-top: 48px;
	background: #fff;
	border-radius: 24px;
	box-shadow: $shadow-sm;
	overflow: hidden;

	@include devices(sm) {
		margin-top: 32px;
	}

	&__head {
		display: flex;
		border-bottom: 2px solid #f1f5f9;
		overflow-x: auto;

		// Hide scrollbar across browsers
		scrollbar-width: none; // Firefox
		-ms-overflow-style: none; // IE/Edge
		&::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		} // Webkit
	}

	&__tab {
		flex: 1;
		padding: 18px 24px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 15px;
		font-weight: 700;
		color: $muted;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		position: relative;
		transition: color 0.2s ease;
		white-space: nowrap;

		@include devices(sm) {
			padding: 14px 18px;
			font-size: 13.5px;
			gap: 8px;
		}
		@include devices(xs) {
			padding: 12px 14px;
			font-size: 12.5px;
			gap: 6px;
			:deep(svg) {
				width: 16px;
				height: 16px;
			}
		}

		:deep(.icon),
		:deep(svg) {
			width: 18px;
			height: 18px;
			fill: currentColor;
			stroke: currentColor;
		}

		&::after {
			content: "";
			position: absolute;
			left: 0;
			right: 0;
			bottom: -2px;
			height: 3px;
			background: $primary-dk;
			transform: scaleX(0);
			transform-origin: center;
			transition: transform 0.25s ease;
		}

		&.is-active {
			color: $primary-dk;
			background: rgba($primary, 0.06);
			&::after {
				transform: scaleX(1);
			}
		}
	}

	&__body {
		padding: 32px;
		@include devices(sm) {
			padding: 20px 16px;
		}
	}

	&__title {
		font-size: clamp(1.2rem, 2vw, 1.5rem);
		font-weight: 800;
		color: $dark;
		margin: 0 0 8px;
	}

	&__sub {
		font-size: 14px;
		color: $muted;
		margin: 0 0 24px;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 14px;

		@include devices(sm) {
			grid-template-columns: 1fr;
		}
	}
}

.ck-test-card {
	display: flex;
	align-items: flex-start;
	gap: 14px;
	padding: 16px 18px;
	background: #fff;
	border: 1px solid $border;
	border-radius: 14px;
	transition:
		border-color 0.25s ease,
		box-shadow 0.25s ease,
		transform 0.25s ease;
	animation: cardFadeIn 0.45s ease-out backwards;
	animation-delay: calc(var(--i, 0) * 0.06s);

	&:hover {
		border-color: rgba($primary, 0.45);
		box-shadow: 0 8px 22px rgba($primary, 0.1);
		transform: translateY(-2px);
	}

	@include devices(xs) {
		padding: 14px 14px;
		gap: 12px;
		&:hover {
			transform: none;
		}
	}

	&__emoji {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			rgba($primary, 0.12),
			rgba($primary, 0.05)
		);
		@include devices(xs) {
			width: 38px;
			height: 38px;
			font-size: 20px;
		}
		font-size: 24px;
		line-height: 1;
	}

	&__body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	&__name {
		font-size: 15px;
		font-weight: 700;
		color: $dark;
		margin: 0;
		line-height: 1.3;
	}

	&__cat {
		font-size: 12.5px;
		color: $primary-dk;
		font-weight: 600;
	}

	&__desc {
		font-size: 12.5px;
		color: $muted;
		margin: 3px 0 0;
		line-height: 1.5;
	}

	&__check {
		flex-shrink: 0;
		color: $primary;
		margin-top: 2px;
		:deep(svg) {
			width: 22px;
			height: 22px;
			fill: currentColor;
			stroke: currentColor;
		}
	}
}

@keyframes cardFadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// Tab transition
.tab-fade-enter-active,
.tab-fade-leave-active {
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;
}
.tab-fade-enter-from {
	opacity: 0;
	transform: translateY(8px);
}
.tab-fade-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

// Shared float-up animation
@keyframes floatUp {
	from {
		opacity: 0;
		transform: translateY(18px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// ══════════════════════════════════════════════════════════════
//  JOURNEY (dark card — Figma-style: white text, clean lines)
// ══════════════════════════════════════════════════════════════
.ck-journey {
	margin-top: 48px;
	padding: 48px 40px;
	background: linear-gradient(145deg, #0b1d33 0%, #162c4c 100%);
	border-radius: 24px;
	text-align: center;
	position: relative;
	overflow: hidden;

	@include devices(sm) {
		margin-top: 32px;
		padding: 28px 18px;
	}

	// decorative glow
	&::before {
		content: "";
		position: absolute;
		top: -120px;
		left: 50%;
		transform: translateX(-50%);
		width: 600px;
		height: 300px;
		background: radial-gradient(
			ellipse at center,
			rgba(37, 99, 235, 0.18) 0%,
			transparent 70%
		);
		pointer-events: none;
	}

	> * {
		position: relative;
		z-index: 1;
	}

	// Section badge (above title)
	&__badge {
		display: inline-block;
		background: rgba(96, 165, 250, 0.15);
		color: #60a5fa;
		border: 1px solid rgba(96, 165, 250, 0.3);
		font-size: 12px;
		font-weight: 700;
		padding: 6px 16px;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 14px;
	}

	// ★ FORCE WHITE on all text (no inheritance issues)
	&__title {
		color: #ffffff !important;
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 800;
		margin: 0 0 8px;
		letter-spacing: -0.01em;
	}

	&__sub {
		color: rgba(255, 255, 255, 0.7) !important;
		font-size: 14.5px;
		margin: 0 0 44px;
		@include devices(sm) {
			margin-bottom: 28px;
			font-size: 13px;
		}
	}

	&__steps {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
		margin-bottom: 36px;
		position: relative;

		@include devices(md) {
			grid-template-columns: repeat(2, 1fr);
			gap: 28px;
			margin-bottom: 28px;
		}
		@include devices(xs) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	&__step {
		position: relative;
		text-align: center;
		padding: 0 8px;
		animation: stepFadeIn 0.6s ease-out backwards;

		&:nth-child(1) {
			animation-delay: 0.05s;
		}
		&:nth-child(2) {
			animation-delay: 0.18s;
		}
		&:nth-child(3) {
			animation-delay: 0.31s;
		}
		&:nth-child(4) {
			animation-delay: 0.44s;
		}
	}

	&__icon {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: linear-gradient(135deg, #2563eb, #1d4ed8);
		margin: 0 auto 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: 0 10px 28px rgba(37, 99, 235, 0.5);
		position: relative;
		z-index: 2;
		transition: transform 0.3s ease;

		@include devices(sm) {
			width: 54px;
			height: 54px;
			margin-bottom: 12px;
			:deep(svg) {
				width: 22px;
				height: 22px;
			}
		}

		.ck-journey__step:hover & {
			transform: scale(1.08);
		}

		.ck-journey__step.is-accent & {
			background: linear-gradient(135deg, $red, #b91c1c);
			box-shadow: 0 10px 28px rgba(239, 68, 68, 0.5);
		}

		:deep(.icon),
		:deep(svg) {
			width: 26px;
			height: 26px;
			color: #fff;
			fill: #fff;
			stroke: #fff;
		}
		:deep(svg *) {
			fill: #fff !important;
			stroke: #fff !important;
		}
	}

	// connecting line between steps
	&__line {
		position: absolute;
		top: 32px;
		left: calc(50% + 32px);
		right: calc(-50% + 32px);
		height: 2px;
		background: linear-gradient(
			90deg,
			#2563eb 0%,
			rgba(37, 99, 235, 0.3) 100%
		);
		z-index: 1;

		.ck-journey__step.is-accent + &,
		.ck-journey__step.is-accent ~ &__step & {
			background: linear-gradient(
				90deg,
				$red 0%,
				rgba(37, 99, 235, 0.3) 100%
			);
		}

		@include devices(md) {
			display: none;
		}
	}

	// step after accent gets red→blue line
	&__step.is-accent &__line {
		background: linear-gradient(90deg, $red 0%, rgba(37, 99, 235, 0.3) 100%);
	}

	&__step-title {
		color: #ffffff !important;
		font-size: 17px;
		font-weight: 700;
		margin: 0 0 8px;
	}

	&__step-text {
		color: rgba(255, 255, 255, 0.62) !important;
		font-size: 13px;
		margin: 0;
		line-height: 1.55;
	}

	&__footer {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		padding: 20px 28px;
		background: rgba(255, 255, 255, 0.04);
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(10px);

		@include devices(xs) {
			grid-template-columns: 1fr;
			gap: 14px;
			padding: 16px;
		}
	}

	&__info {
		display: flex;
		align-items: center;
		gap: 14px;
		text-align: left;

		:deep(.icon),
		:deep(svg) {
			width: 22px;
			height: 22px;
			color: #60a5fa !important;
			fill: #60a5fa !important;
			stroke: #60a5fa !important;
			flex-shrink: 0;
		}
		:deep(svg *) {
			fill: #60a5fa !important;
			stroke: #60a5fa !important;
		}

		b {
			display: block;
			font-size: 14.5px;
			font-weight: 700;
			color: #ffffff !important;
		}
		span {
			display: block;
			font-size: 12.5px;
			color: rgba(255, 255, 255, 0.55) !important;
			margin-top: 3px;
		}
	}
}

@keyframes stepFadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// ══════════════════════════════════════════════════════════════
//  REVIEWS
// ══════════════════════════════════════════════════════════════
.ck-reviews {
	margin-top: 48px;
	text-align: center;

	@include devices(sm) {
		margin-top: 32px;
	}

	&__title {
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 800;
		color: $dark;
		margin: 0 0 8px;
	}

	&__sub {
		font-size: 14.5px;
		color: $muted;
		margin: 0 0 32px;
		@include devices(sm) {
			margin-bottom: 22px;
			font-size: 13.5px;
		}
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;

		@include devices(lg) {
			gap: 14px;
		}
		@include devices(md) {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}
}

.ck-review {
	padding: 22px;
	background: #fff;
	border-radius: 18px;
	box-shadow: $shadow-sm;
	text-align: left;
	display: flex;
	flex-direction: column;
	gap: 14px;
	animation: floatUp 0.55s ease-out backwards;
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;

	&:nth-child(1) {
		animation-delay: 0.1s;
	}
	&:nth-child(2) {
		animation-delay: 0.22s;
	}
	&:nth-child(3) {
		animation-delay: 0.34s;
	}

	&:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
	}

	&__stars {
		display: flex;
		gap: 2px;
		:deep(.icon),
		:deep(svg) {
			width: 18px;
			height: 18px;
			color: #facc15;
			fill: #facc15;
			stroke: #facc15;
		}
	}

	&__text {
		font-size: 14.5px;
		color: #475569;
		line-height: 1.6;
		margin: 0;
		font-style: italic;
		flex: 1;
	}

	&__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		b {
			display: block;
			font-size: 14.5px;
			font-weight: 700;
			color: $dark;
		}
		span {
			display: block;
			font-size: 12.5px;
			color: $muted;
			margin-top: 2px;
		}
	}

	&__verified {
		color: $green;
		:deep(svg) {
			width: 22px;
			height: 22px;
			fill: currentColor;
			stroke: currentColor;
		}
	}
}

// ══════════════════════════════════════════════════════════════
//  FINAL CTA
// ══════════════════════════════════════════════════════════════
.ck-cta {
	margin-top: 48px;
	padding: 40px;
	background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
	border-radius: 24px;
	color: #fff;
	display: grid;
	grid-template-columns: 1.4fr 1fr;
	gap: 32px;
	align-items: center;

	@include devices(md) {
		grid-template-columns: 1fr;
		gap: 24px;
		padding: 28px 22px;
		margin-top: 32px;
	}
	@include devices(xs) {
		padding: 22px 16px;
		border-radius: 18px;
		gap: 18px;
	}

	&__title {
		color: #ffffff !important;
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 800;
		margin: 0 0 12px;
		line-height: 1.2;
	}

	&__sub {
		color: rgba(255, 255, 255, 0.82) !important;
		font-size: 14.5px;
		margin: 0 0 18px;
		line-height: 1.6;
	}

	&__price {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
	}

	&__price-current {
		color: #ffffff !important;
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		font-weight: 800;
	}

	&__price-old {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.55);
		text-decoration: line-through;
	}

	&__save {
		background: #16a34a;
		color: #fff;
		font-size: 13px;
		font-weight: 700;
		padding: 5px 12px;
		border-radius: 999px;
	}

	&__right {
		display: flex;
	}

	&__btn {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: #fff;
		color: #0d9488;
		border: none;
		padding: 18px 28px;
		border-radius: 14px;
		font-size: 16px;
		font-weight: 800;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

		:deep(.icon),
		:deep(svg) {
			width: 20px;
			height: 20px;
			color: #0d9488;
			fill: #0d9488;
			stroke: #0d9488;
		}

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 14px 32px rgba(0, 0, 0, 0.22);
		}
	}
}

// ══════════════════════════════════════════════════════════════
//  TARKIBGA KIRADI (legacy - kept hidden)
// ══════════════════════════════════════════════════════════════
.ck-included {
	display: none; // replaced by ck-tabs
	margin-top: 48px;
	@include devices(sm) {
		margin-top: 32px;
	}

	&__title {
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		font-weight: 700;
		color: $dark;
		margin-bottom: 24px;
		padding-bottom: 12px;
		position: relative;

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 1px;
			background: $border;
		}

		&::before {
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			width: 60px;
			height: 2px;
			background: $primary;
			border-radius: 2px;
			z-index: 1;
		}
	}
}

// ── Category group ────────────────────────────────────────────
.ck-group {
	&:not(:last-child) {
		margin-bottom: 32px;
	}

	&__label {
		font-size: 14px;
		font-weight: 700;
		color: $primary-dk;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 8px;

		&::before {
			content: "";
			display: inline-block;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: $primary;
			flex-shrink: 0;
		}
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;

		@include devices(md) {
			grid-template-columns: 1fr;
		}
	}
}

// ── Included item card ────────────────────────────────────────
.ck-item {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 14px 18px;
	background: #fff;
	border: 1px solid $border;
	border-radius: 16px;
	box-shadow: $shadow-sm;
	transition:
		box-shadow 0.2s,
		transform 0.2s;

	&:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
		transform: translateY(-1px);
	}

	@include devices(xs) {
		flex-wrap: wrap;
		gap: 10px;
		padding: 12px 14px;
	}

	&__img-wrap {
		flex-shrink: 0;
		width: 56px;
		height: 56px;
		border-radius: 12px;
		overflow: hidden;
		background: $primary-lt;
		display: flex;
		align-items: center;
		justify-content: center;
		@include devices(xs) {
			width: 46px;
			height: 46px;
		}
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: $primary;
		opacity: 0.6;
	}

	&__body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__name {
		font-size: 14px;
		font-weight: 700;
		color: $dark;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		@include devices(xs) {
			white-space: normal;
		}
	}

	&__meta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #94a3b8;
		:deep(.icon),
		:deep(svg) {
			width: 12px;
			height: 12px;
		}
	}

	&__price-wrap {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
		@include devices(xs) {
			width: 100%;
			align-items: flex-start;
		}
	}

	&__price {
		font-size: 14px;
		font-weight: 800;
		color: $primary-dk;
		white-space: nowrap;

		&--new {
			color: $green;
		}
		&--old {
			font-size: 12px;
			font-weight: 400;
			color: #94a3b8;
			text-decoration: line-through;
		}
	}
}
</style>
