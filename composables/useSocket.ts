import { ref } from 'vue';
import { Client } from '@stomp/stompjs';

// This composable is now cleaner and more focused.
export function useSocket() {
  const state = ref('Idle');
  const store = useAuthStore();
  const accessToken = store.accessToken;
  const receivedMessages = ref<any>();
  let stompClient: Client | null = null;

  const connect = (transactionId: string) => {
    // All connection logic is now self-contained.
    const baseUrl = __STOMP_URL__;
    const bearerToken = `Bearer ${store.accessToken}`
    // const bearerToken = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImxhbmdLZXkiOiJlbiIsImF1dGgiOiJST0xFX0FETUlOIiwidXNlcl9pZCI6IjcxOTkwNzc0MDY3OTI4MjkwMyIsImV4cCI6MTc1NTI0MzAyMiwiaWF0IjoxNzUyNjUxMDIyfQ.1NS270yKBkI4amfibsjS216dpr4A26NMbCG0Wf3sxPaL3bZvvzMWYpby7nLaEej8VlBVXUDFK_JnUA3jxcEtHw';
    const jwtToken = bearerToken.split(' ')[1];
    const destination = `/topic/transactions/${transactionId}`;
    const id = transactionId;

    stompClient = new Client({
      brokerURL: `${baseUrl}?access_token=${jwtToken}`,
      connectHeaders: {
        Authorization: bearerToken,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        state.value = 'Connected';
        stompClient?.subscribe(destination, (message) => {
          receivedMessages.value = JSON.parse(message.body);
          state.value = `Message Received at ${new Date().toLocaleTimeString()}`;
        }, { id });
        state.value = 'Subscribed';
      },
      onStompError: (frame) => {
        console.log("STOMP Error: ", frame.headers['message']);
        state.value = `STOMP Error: ${frame.headers['message'] || 'Unknown'}`;
      },
      onWebSocketError: () => {
        state.value = 'WebSocket Connection Failed';
      },
      onDisconnect: () => {
        state.value = 'Disconnected';
      },
      beforeConnect: () => {
        state.value = 'Connecting...';
      },
    });

    stompClient.activate();
  };

  const disconnect = () => {
    stompClient?.deactivate();
  };

  return {
    state,
    receivedMessages,
    connect,
    disconnect,
  };
}