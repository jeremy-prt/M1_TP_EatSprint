<template>
  <div
    class="flex min-h-[calc(100vh-var(--spacing-header))] items-center justify-center px-4 py-4"
  >
    <div class="w-full max-w-2xl">
      <div class="bg-white p-8 shadow-[8px_8px_0_#f97316]">
        <h1 class="text-primary mb-2 text-center text-3xl font-bold uppercase">
          {{ $t('auth.register.title') }}
        </h1>
        <p class="mb-6 text-center text-gray-600">
          {{ $t('auth.register.subtitle') }}
        </p>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <UiInput
            v-model="formData.name"
            :label="$t('auth.register.name')"
            type="text"
            :placeholder="$t('auth.register.namePlaceholder')"
            required
          />

          <div class="grid grid-cols-2 gap-4">
            <UiInput
              v-model="formData.email"
              :label="$t('auth.register.email')"
              type="email"
              :placeholder="$t('auth.register.emailPlaceholder')"
              required
            />

            <UiInput
              v-model="formData.password"
              :label="$t('auth.register.password')"
              type="password"
              :placeholder="$t('auth.register.passwordPlaceholder')"
              required
            />
          </div>

          <UiInput
            v-model="formData.adresse"
            :label="$t('auth.register.address')"
            type="text"
            :placeholder="$t('auth.register.addressPlaceholder')"
            optional
          />

          <div class="grid grid-cols-2 gap-4">
            <UiInput
              v-model="formData.code_postal"
              :label="$t('auth.register.postalCode')"
              type="text"
              :placeholder="$t('auth.register.postalCodePlaceholder')"
            />

            <UiInput
              v-model="formData.ville"
              :label="$t('auth.register.city')"
              type="text"
              :placeholder="$t('auth.register.cityPlaceholder')"
            />
          </div>

          <div v-if="error" class="bg-red-50 p-3 text-red-600">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="button-cta bg-secondary inline-flex w-full -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-2xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none disabled:opacity-50"
          >
            <span class="skew-x-6 italic">
              {{ loading ? $t('auth.register.submitting') : $t('auth.register.submit') }}
            </span>
          </button>
        </form>

        <p class="mt-6 text-center text-gray-600">
          {{ $t('auth.register.hasAccount') }}
          <NuxtLink
            to="/auth/login"
            class="text-primary font-semibold hover:underline"
          >
            {{ $t('auth.register.loginLink') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const authStore = useAuthStore();

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: () => t('pages.register.title'),
  description: () => t('pages.register.description'),
  ogTitle: () => t('pages.register.ogTitle'),
  ogDescription: () => t('pages.register.ogDescription'),
  ogImage: '/assets/logo_new.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
})

const formData = ref({
  name: "",
  email: "",
  password: "",
  adresse: "",
  ville: "",
  code_postal: "",
});

const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  error.value = "";
  loading.value = true;

  try {
    await authStore.register(formData.value);

    navigateTo("/mon-espace-perso");
  } catch (err: any) {
    error.value = err.data?.statusMessage || t('auth.register.error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.button-cta:active {
  transform: skewX(-15deg) translate(3px, 3px);
  box-shadow: 3px 3px 0 black;
}
</style>
