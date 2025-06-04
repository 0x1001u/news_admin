import { PiniaPluginContext } from 'pinia';

export default function piniaPersist({ store }: PiniaPluginContext) {
  const key = `pinia_${store.$id}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      store.$patch(JSON.parse(saved));
    } catch (e) {
      console.error(`Failed to parse saved state for store ${store.$id}`, e);
    }
  }
  
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state));
  });
}