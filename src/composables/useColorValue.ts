import { ref, computed } from 'vue';

export function useColorValue(initial = 0) {
  const value = ref(initial);

  const colorClass = computed(() => {
    if (value.value > 0) return 'text-green-500';
    if (value.value < 0) return 'text-red-500';
    return 'text-gray-500';
  });

  return { value, colorClass };
}