/**
 * Composable pour retarder l'affichage d'un état de chargement
 * Évite les "flashs" de skeleton sur les connexions rapides
 *
 * @param pending - Ref booléen indiquant l'état de chargement
 * @param delay - Délai en ms avant d'afficher le skeleton (défaut: 200ms)
 * @returns Ref booléen indiquant si le skeleton doit être affiché
 *
 * @example
 * const { pending } = useAsyncData(...)
 * const showSkeleton = useDelayedPending(pending, 200)
 */
export const useDelayedPending = (
  pending: Ref<boolean>,
  delay: number = 200
): Ref<boolean> => {
  const showSkeleton = ref(false)
  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(
    pending,
    (newVal) => {
      if (newVal) {
        // Démarrer le délai avant d'afficher le skeleton
        timeout = setTimeout(() => {
          showSkeleton.value = true
        }, delay)
      } else {
        // Annuler le délai si le chargement se termine avant
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        showSkeleton.value = false
      }
    },
    { immediate: true }
  )

  // Nettoyage au démontage
  onUnmounted(() => {
    if (timeout) {
      clearTimeout(timeout)
    }
  })

  return showSkeleton
}
