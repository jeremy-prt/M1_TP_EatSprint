export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  const apiFetch = <T>(path: string, options: Record<string, any> = {}) => {
    const authStore = useAuthStore()
    const headers: Record<string, string> = {
      ...options.headers,
    }

    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }

    return $fetch<T>(`${baseUrl}${path}`, {
      ...options,
      headers,
    })
  }

  return { apiFetch, baseUrl }
}
