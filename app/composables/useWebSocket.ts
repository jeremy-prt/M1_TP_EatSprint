export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const wsUrl = config.public.apiBaseUrl.replace('http', 'ws')

  let socket: WebSocket | null = null
  const isConnected = ref(false)
  const lastMessage = ref<{ event: string; data: any; timestamp: string } | null>(null)

  const connect = (onMessage?: (msg: any) => void) => {
    if (socket) disconnect()

    socket = new WebSocket(`${wsUrl}/ws/restaurant`)

    socket.onopen = () => {
      socket!.send(JSON.stringify({
        event: 'authenticate',
        token: authStore.accessToken,
      }))
    }

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      lastMessage.value = msg

      if (msg.event === 'connected') {
        isConnected.value = true
      }

      if (onMessage) onMessage(msg)
    }

    socket.onclose = () => {
      isConnected.value = false
    }

    socket.onerror = () => {
      isConnected.value = false
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
      socket = null
      isConnected.value = false
    }
  }

  return { connect, disconnect, isConnected, lastMessage }
}
