<template>
  <div
    class="flex min-h-[calc(100vh-var(--spacing-header))] items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md">
      <div class="bg-white p-8 shadow-[8px_8px_0_#f97316]">
        <h1 class="text-primary mb-2 text-center text-3xl font-bold uppercase">
          {{ $t('auth.login.title') }}
        </h1>
        <p class="mb-8 text-center text-gray-600">
          {{ $t('auth.login.subtitle') }}
        </p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <UiInput
            v-model="email"
            :label="$t('auth.login.email')"
            type="email"
            :placeholder="$t('auth.login.emailPlaceholder')"
            required
          />

          <UiInput
            v-model="password"
            :label="$t('auth.login.password')"
            type="password"
            :placeholder="$t('auth.login.passwordPlaceholder')"
            required
          />

          <div v-if="error" class="bg-red-50 p-3 text-red-600">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="button-cta bg-secondary inline-flex w-full -skew-x-6 cursor-pointer items-center justify-center border-none px-8 py-3 text-2xl font-bold text-white no-underline shadow-[6px_6px_0_black] transition-all duration-150 focus:outline-none disabled:opacity-50"
          >
            <span class="skew-x-6 italic">
              {{ loading ? $t('auth.login.submitting') : $t('auth.login.submit') }}
            </span>
          </button>
        </form>

        <p class="mt-6 text-center text-gray-600">
          {{ $t('auth.login.noAccount') }}
          <NuxtLink
            to="/auth/register"
            class="text-primary font-semibold hover:underline"
          >
            {{ $t('auth.login.signupLink') }}
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
  title: () => t('pages.login.title'),
  description: () => t('pages.login.description'),
  ogTitle: () => t('pages.login.ogTitle'),
  ogDescription: () => t('pages.login.ogDescription'),
  ogImage: '/assets/logo_new.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
})

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    navigateTo("/mon-espace-perso");
  } catch (err: any) {
    error.value = err.data?.statusMessage || t('auth.login.error');
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
