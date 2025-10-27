interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

/**
 * Composable pour gérer les notifications toast
 * State global partagé entre tous les composants
 */
export const useToast = () => {
  /**
   * Ajoute une notification toast
   * @param message - Texte du message
   * @param type - Type de notification (success, error, warning, info)
   * @param duration - Durée d'affichage en ms (0 = permanent)
   * @returns ID du toast créé
   */
  const addToast = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = `toast-${toastId++}`

    toasts.value.push({
      id,
      message,
      type,
      duration,
    })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  /**
   * Supprime une notification toast
   * @param id - ID du toast à supprimer
   */
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Raccourci pour afficher un toast de succès
   */
  const success = (message: string, duration = 5000) => {
    return addToast(message, 'success', duration)
  }

  /**
   * Raccourci pour afficher un toast d'erreur
   */
  const error = (message: string, duration = 5000) => {
    return addToast(message, 'error', duration)
  }

  /**
   * Raccourci pour afficher un toast d'avertissement
   */
  const warning = (message: string, duration = 5000) => {
    return addToast(message, 'warning', duration)
  }

  /**
   * Raccourci pour afficher un toast d'information
   */
  const info = (message: string, duration = 5000) => {
    return addToast(message, 'info', duration)
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
