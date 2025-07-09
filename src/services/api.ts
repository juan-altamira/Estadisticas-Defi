// This is a mock API service. In a real application, you would fetch this data from a backend.

export type Blockchain = 'Ethereum' | 'BNBChain' | 'Polygon' | 'Arbitrum' | 'Base' | 'Solana';

export interface GasFee {
  slow: number;
  normal: number;
  fast: number;
}

// A map of chain names used by DeFi Llama to their display names
const DEFILAMA_CHAIN_MAP: { [key: string]: string } = {
  "Ethereum": "Ethereum",
  "BNB": "BNBChain",
  "Base": "Base",
  "Polygon": "Polygon",
  "Arbitrum": "Arbitrum",
  "Solana": "Solana"
};

// Helper function to format TVL values
const formatTvlValue = (value: number): number => {
  // Convert to billions for better readability
  return value / 1e9;
};

/**
 * Fetches Total Value Locked (TVL) data from DeFi Llama.
 */
export const fetchTvlData = async (): Promise<{name: string, value: number}[]> => {
  try {
    const response = await fetch('https://api.llama.fi/chains');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format from API');
    }
    
    console.log('Raw TVL data from API:', data);
    
    // Filter and map to our desired format
    const formattedData = data
      .filter((chain: any) => {
        const isValid = chain.name && DEFILAMA_CHAIN_MAP[chain.name] && chain.tvl !== undefined;
        if (!isValid) {
          console.log('Skipping chain:', chain.name, 'Reason: Missing name, TVL, or not in our mapping');
        }
        return isValid;
      })
      .map((chain: any) => {
        const formattedValue = formatTvlValue(chain.tvl);
        console.log(`Chain: ${chain.name}, Raw TVL: ${chain.tvl}, Formatted: ${formattedValue}`);
        return {
          name: DEFILAMA_CHAIN_MAP[chain.name],
          value: formattedValue,
          rawValue: chain.tvl // Keep raw value for reference
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by value descending
    
    if (formattedData.length === 0) {
      throw new Error('No valid chain data found after filtering');
    }
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching TVL data:', error);
    // Return mock data as fallback with realistic values in billions
    const mockData = [
      { name: 'Ethereum', value: 40.5, rawValue: 40500000000 },
      { name: 'BNBChain', value: 15.2, rawValue: 15200000000 },
      { name: 'Polygon', value: 8.7, rawValue: 8700000000 },
      { name: 'Arbitrum', value: 6.3, rawValue: 6300000000 },
      { name: 'Optimism', value: 4.1, rawValue: 4100000000 },
    ];
    console.log('Using mock TVL data:', mockData);
    return mockData;
  }
};

/**
 * Fetches Gas Fees from Moralis.
 * NOTE: This is a simplified mock. The real Moralis API for gas is more complex
 * and requires converting Gwei to USD via a price feed.
 */
export const fetchGasFees = async (chain: Blockchain): Promise<GasFee> => {
  console.log(`Fetching gas fees for ${chain}...`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock data as the actual API is complex.
  const mockData: Record<Blockchain, GasFee> = {
    Ethereum: { slow: 0.17, normal: 0.31, fast: 0.49 },
    BNBChain: { slow: 0.0014, normal: 0.0015, fast: 0.0023 },
    Polygon: { slow: 0.00012, normal: 0.00013, fast: 0.00014 },
    Base: { slow: 0.00067, normal: 0.0017, fast: 0.0037 },
    Arbitrum: { slow: 0.0007, normal: 0.00081, fast: 0.001 },
    Solana: { slow: 0.003, normal: 0.005, fast: 0.01 }
  };

  return mockData[chain] || { slow: 0, normal: 0, fast: 0 };
};

type TimeRange = '1m' | '6m' | '1y';

/**
 * Fetches Daily Transactions.
 * @param range Time range for the data (1m, 6m, 1y)
 */
// Cache para los 365 días de datos generados una vez
let _cachedYearlyTxData: any[] | null = null;

export const fetchDailyTransactions = async (range: TimeRange = '1m') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Si ya tenemos los datos generados, usamos el cache
  if (!_cachedYearlyTxData) {
    // Generar olas aleatorias de duración e intensidad variable
    function generateRandomWaves(days: number, baseAmplitude: number) {
      const waves: Array<{start: number, end: number, strength: number, direction: number}> = [];
      let currentDay = 0;
      
      while (currentDay < days) {
        // Duración aleatoria de la ola (entre 7 y 60 días para cambios más dinámicos)
        const waveLength = Math.max(7, Math.floor(Math.random() * 60));
        // Intensidad aleatoria (entre 0.8x y 1.5x de la amplitud base para cambios más notorios)
        const strength = baseAmplitude * (0.8 + Math.random() * 0.7);
        // Dirección aleatoria (alcista o bajista) con un pequeño sesgo alcista (60% alcista, 40% bajista)
        const direction = Math.random() > 0.4 ? 1 : -1;
        
        waves.push({
          start: currentDay,
          end: Math.min(currentDay + waveLength, days - 1),
          strength,
          direction
        });
        
        currentDay += waveLength;
      }
      
      return waves;
    }

    function simulateSeries({
      start, 
      end, 
      days, 
      volatility = 0.1, 
      min = start * 0.8,  // 20% por debajo del mínimo
      max = end * 1.2,    // 20% por encima del máximo
      endBias = 0.5,      // 0-1, qué tan concentrado está el crecimiento al final
      spikes = []
    }: {
      start: number, 
      end: number, 
      days: number, 
      volatility?: number, 
      min?: number,
      max?: number,
      endBias?: number,
      spikes?: Array<{pos: number, mult: number}>
    }) {
      const arr = [];
      let value = start;
      const avgValue = (start + end) / 2;
      
      // Sistema de eventos mensuales (más largos y significativos)
      const events = [];
      for (let i = 0; i < days; i++) {
        // 5% de probabilidad de que comience un evento mensual
        if (Math.random() < 0.05) {
          // Duración del evento: entre 15 y 45 días (para cubrir variaciones mensuales)
          const duration = 15 + Math.floor(Math.random() * 31);
          // Intensidad: entre -30% y +50% del valor promedio (más suave pero más prolongado)
          const intensity = (Math.random() * 1.6 - 0.6) * 0.5;
          // Tipo de evento: 0 = tendencia alcista, 1 = tendencia bajista, 2 = corrección lateral
          const eventType = Math.floor(Math.random() * 3);
          
          events.push({
            startDay: i,
            endDay: Math.min(i + duration - 1, days - 1),
            intensity: intensity * (0.8 + Math.random() * 0.4), // Variabilidad en la intensidad
            type: eventType,
            params: {
              // Variación en la forma de la curva del evento
              curveShape: Math.random() * 2 - 1, // -1 a 1 para diferentes formas de curva
              // Variabilidad en la duración de las fases
              phaseRatio: 0.3 + Math.random() * 0.4 // 30%-70% de la duración para la fase principal
            }
          });
          
          // Saltar algunos días después de un evento para evitar superposiciones excesivas
          i += Math.floor(duration * 0.7);
        }
      }

      for (let i = 0; i < days; i++) {
        // Tendencia base con ruido estocástico suave
        let progress = i / (days - 1);
        if (endBias > 0.5) {
          // Aplicar curva de crecimiento exponencial para el final
          const bias = (endBias - 0.5) * 2; // Convertir a rango 0-1
          progress = Math.pow(progress, 1 + (bias * 3));
        }
        // Ruido de muy baja frecuencia para la tendencia base (variación mensual)
        const monthlyNoise = Math.sin(i / 30 * Math.PI * 2) * 0.05 * progress;
        let target = start + (end - start) * progress + monthlyNoise;
        
        // Máxima fluctuación diaria posible (15-25% de variación)
        const dailyNoise = (Math.random() - 0.5) * volatility * target * 5.0;
        
        // Sin suavizado para máxima variación
        const prevValue = arr.length > 0 ? arr[arr.length - 1] : target;
        const smoothFactor = 0.1; // Solo 10% del valor anterior, 90% del nuevo
        target = prevValue * smoothFactor + target * (1 - smoothFactor);
        
        // Múltiples capas de ruido para máxima variabilidad
        const noise1 = (Math.random() - 0.5) * volatility * target * 1.5;
        const noise2 = (Math.random() - 0.5) * volatility * target * 1.0;
        target += noise1 + noise2;
        
        // Aplicar eventos activos (fluctuaciones mensuales)
        let monthlyEffect = 0;
        for (const event of events) {
          if (i >= event.startDay && i <= event.endDay) {
            const eventDuration = event.endDay - event.startDay;
            const eventProgress = (i - event.startDay) / eventDuration;
            let effect = 0;
            
            // Forma de la curva del evento
            const curve = event.params.curveShape;
            let progressFactor;
            
            if (curve < 0) {
              // Curva cóncava (rápido al principio, lento al final)
              progressFactor = Math.pow(eventProgress, 1 - curve * 2);
            } else {
              // Curva convexa (lento al principio, rápido al final)
              progressFactor = 1 - Math.pow(1 - eventProgress, 1 + curve * 2);
            }
            
            const phaseRatio = event.params.phaseRatio;
            
            switch(event.type) {
              case 0: // Tendencias alcistas
                effect = progressFactor * event.intensity * avgValue * 0.8;
                break;
                
              case 1: // Tendencias bajistas
                effect = -progressFactor * event.intensity * avgValue * 0.6;
                break;
                
              case 2: // Correcciones laterales (sube y baja)
                const cycleProgress = (i % 30) / 30; // Ciclo de ~1 mes
                effect = Math.sin(cycleProgress * Math.PI * 2) * event.intensity * avgValue * 0.4;
                break;
            }
            
            // Aplicar efecto de entrada/salida suave
            const fadeIn = Math.min(1, (i - event.startDay) / (eventDuration * 0.2));
            const fadeOut = Math.min(1, (event.endDay - i) / (eventDuration * 0.2));
            const fade = Math.min(fadeIn, fadeOut, 1);
            
            monthlyEffect += effect * fade;
          }
        }
        
        // Picos programados (si los hay)
        let spikeMult = 1;
        for (const s of spikes) {
          if (i === s.pos) spikeMult = s.mult;
        }
        
        // Máximo peso en la variabilidad diaria
        const baseWeight = 0.4;    // Solo 40% de peso en la tendencia
        const noiseWeight = 1.2;   // 120% de peso en el ruido diario
        const eventWeight = 0.4;   // 40% de peso en los eventos mensuales
        
        // Calcular el valor con máxima variabilidad
        const baseNoise = (Math.random() - 0.5) * volatility * target * 0.8;
        let baseValue = target * baseWeight + (dailyNoise + baseNoise) * noiseWeight;
        
        // Aplicar el efecto mensual con variabilidad adicional
        const monthlyVariation = 0.8 + Math.random() * 0.4; // 80-120% de variación
        value = (baseValue + monthlyEffect * eventWeight * monthlyVariation) * spikeMult;
        
        // Asegurar que el valor esté dentro de los rangos permitidos
        value = Math.max(min * 0.9, Math.min(max * 1.1, value));
        
        // No redondear para mantener precisión en los valores
        // Los valores se formatearán en el frontend según sea necesario
        
        // Suavizar transiciones con el valor anterior
        if (arr.length > 0) {
          const prevValue = arr[arr.length - 1];
          const smoothing = 0.9; // 90% del valor anterior, 10% del nuevo
          value = prevValue * smoothing + value * (1 - smoothing);
        }
        
        arr.push(Math.round(value));
      }
      
      return arr;
    }
    const days = 365;
    // Función para asegurar que los valores se mantengan dentro de los rangos objetivo
    const clampValue = (value: number, min: number, max: number) => {
      // No redondear, solo asegurar los límites
      return Math.max(min, Math.min(max, value));
    };

    // Generar series para cada blockchain con sus rangos específicos
    // Ethereum con tendencia alcista pronunciada al final
    const eth = simulateSeries({ 
      start: 1000000, 
      end: 2000000,  // Aumentado de 1.5M a 2M para mayor tendencia alcista
      days, 
      volatility: 0.15,
      min: 800000,
      max: 2200000,  // Aumentado el máximo para permitir la tendencia
      endBias: 0.7  // 70% del crecimiento ocurre en el último tercio
    });

    // BNB Chain con fuerte tendencia alcista al final
    const bnb = simulateSeries({ 
      start: 3000000, 
      end: 18000000,  // Aumentado de 14M a 18M para tendencia más pronunciada
      days, 
      volatility: 0.25,
      min: 2500000,
      max: 20000000,  // Aumentado el máximo
      endBias: 0.8   // 80% del crecimiento en el último tercio
    });

    const polygon = simulateSeries({ 
      start: 2000000, 
      end: 3600000, 
      days, 
      volatility: 0.18,
      min: 1800000,    // Mínimo 1.8M
      max: 4000000     // Máximo 4M
    });

    const arbitrum = simulateSeries({ 
      start: 1000000, 
      end: 2000000, 
      days, 
      volatility: 0.15,
      min: 800000,     // Mínimo 800K
      max: 2200000     // Máximo 2.2M
    });

    // Base con fuerte tendencia alcista al final
    const base = simulateSeries({ 
      start: 2000000, 
      end: 15000000,  // Aumentado de 10M a 15M para tendencia más pronunciada
      days, 
      volatility: 0.22,
      min: 1800000,
      max: 16000000,  // Aumentado el máximo
      endBias: 0.75   // 75% del crecimiento en el último tercio
    });

    const solana = simulateSeries({ 
      start: 10000000, 
      end: 28000000, 
      days, 
      volatility: 0.3,  // Máxima volatilidad para Solana
      min: 9000000,    // Mínimo 9M
      max: 30000000    // Máximo 30M
    });
    _cachedYearlyTxData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        Ethereum: eth[i],
        BNBChain: bnb[i],
        Polygon: polygon[i],
        Arbitrum: arbitrum[i],
        Base: base[i],
        Solana: solana[i],
        Tron: 0,
        Bitcoin: 0
      };
    });
  }

  if (range === '1y') return _cachedYearlyTxData;
  if (range === '6m') return _cachedYearlyTxData.slice(-180);
  if (range === '1m') return _cachedYearlyTxData.slice(-30);
  // fallback: todo el año
  return _cachedYearlyTxData;
};

// Export functions to get data instead of direct values
export const getDailyTransactions = fetchDailyTransactions;
export const getTvlData = fetchTvlData;

export const getGasFeesData = async (): Promise<Record<Blockchain, GasFee>> => {
  return {
    Ethereum: await fetchGasFees("Ethereum"),
    BNBChain: await fetchGasFees("BNBChain"),
    Base: await fetchGasFees("Base"),
    Polygon: await fetchGasFees("Polygon"),
    Arbitrum: await fetchGasFees("Arbitrum"),
    Solana: await fetchGasFees("Solana")
  };
};

// For backward compatibility (deprecated)
export const dailyTransactions = getDailyTransactions();
export const tvlData = getTvlData();
export const gasFeesData = getGasFeesData();
