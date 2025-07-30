import { ref, computed, type Ref } from 'vue'; 

interface ColorConfig {
  positiveColor?: string;
  negativeColor?: string;
  neutralColor?: string;
  includeFontWeight?: boolean;
  fontWeight?: string;
}

interface UseColorResult {
  value: Ref<number>;
  colorClass: Readonly<Ref<string>>; 
  setValue: (newValue: number) => void;
  updateConfig: (config: Partial<ColorConfig>) => void;
}

const DEFAULT_CONFIG: ColorConfig = {
  positiveColor: 'text-green-500',
  negativeColor: 'text-red-500',
  neutralColor: 'text-gray-500',
  includeFontWeight: false,
  fontWeight: 'font-semibold'
};

export function useColor(
  initialValue: number = 0, 
  config: Partial<ColorConfig> = {}
): UseColorResult {
  const value: Ref<number> = ref(initialValue);
  const currentConfig = ref<ColorConfig>({ ...DEFAULT_CONFIG, ...config });
  
  const colorClass = computed<string>(() => {
    let baseColor = '';
    
    if (value.value > 0) {
      baseColor = currentConfig.value.positiveColor || DEFAULT_CONFIG.positiveColor!;
    } else if (value.value < 0) {
      baseColor = currentConfig.value.negativeColor || DEFAULT_CONFIG.negativeColor!;
    } else {
      baseColor = currentConfig.value.neutralColor || DEFAULT_CONFIG.neutralColor!;
    }
    
    if (currentConfig.value.includeFontWeight) {
      return `${baseColor} ${currentConfig.value.fontWeight}`;
    }
    
    return baseColor;
  });
  
  const setValue = (newValue: number): void => {
    value.value = newValue;
  };

  const updateConfig = (newConfig: Partial<ColorConfig>): void => {
    currentConfig.value = { ...currentConfig.value, ...newConfig };
  };

  return {
    value,
    colorClass,
    setValue,
    updateConfig,
  };
}

// Composables específicos para casos comunes
export function usePriceColor(initialValue: number = 0): UseColorResult {
  return useColor(initialValue, {
    positiveColor: 'text-gray-900',
    negativeColor: 'text-gray-900',
    neutralColor: 'text-gray-900',
    includeFontWeight: false
  });
}

export function useVariationColor(initialValue: number = 0): UseColorResult {
  return useColor(initialValue, {
    includeFontWeight: true,
    fontWeight: 'font-semibold'
  });
}

export function usePercentageColor(initialValue: number = 0): UseColorResult {
  return useColor(initialValue, {
    positiveColor: 'text-green-600',
    negativeColor: 'text-red-600',
    neutralColor: 'text-gray-600',
    includeFontWeight: true,
    fontWeight: 'font-bold'
  });
}

export function useTrendColor(initialValue: number = 0): UseColorResult {
  return useColor(initialValue, {
    positiveColor: 'text-emerald-500',
    negativeColor: 'text-rose-500',
    neutralColor: 'text-slate-500',
    includeFontWeight: false
  });
}

// Composable para valores monetarios
export function useCurrencyColor(initialValue: number = 0): UseColorResult {
  return useColor(initialValue, {
    positiveColor: 'text-green-700',
    negativeColor: 'text-red-700',
    neutralColor: 'text-gray-700',
    includeFontWeight: true,
    fontWeight: 'font-medium'
  });
}

// Composable para indicadores de estado
export function useStatusColor(initialValue: number = 0): UseColorResult {
  return useColor(initialValue, {
    positiveColor: 'text-blue-500',
    negativeColor: 'text-orange-500',
    neutralColor: 'text-gray-400',
    includeFontWeight: false
  });
}