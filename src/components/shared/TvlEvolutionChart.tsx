import React from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Brush } from 'recharts';
import { useTheme } from '@/components/shared/theme-provider';

// Color definitions for each language
const LANGUAGE_COLORS = {
  solidity: '#007bff',
  rust: '#ff3d3d',
  bitcoinScript: '#6c963f',
  vyper: '#63c3ff',
  haskell: '#ff69b4',
  cpp: '#90ee90',
  cairo: '#ffd700',
  ride: '#dda0dd',
  clarity: '#ff1493',
  java: '#66ccff',
  others: '#d3d3d3',
};

// Generate time series data from Jan 2018 to May 2025
const generateTvlData = () => {
  const data = [];
  const startDate = new Date(2018, 0, 1);
  const endDate = new Date(2025, 4, 10); // May 10, 2025
  const months = [];
  let currentDate = new Date(startDate);

  // Helper: Suavizado con rolling mean
  function smooth(arr: number[], window: number) {
    return arr.map((_, i, a) => {
      const start = Math.max(0, i - Math.floor(window / 2));
      const end = Math.min(a.length, i + Math.ceil(window / 2));
      const slice = a.slice(start, end);
      return slice.reduce((s, v) => s + v, 0) / slice.length;
    });
  }
  // Ruido controlado: combinación de senos y dientes de sierra
  function controlledNoise(i: number, amp = 1, freq = 1, saw = false) {
    let base = Math.sin(i / freq) * amp;
    if (saw) base += (i % 12) / 12 * amp * 0.5 - amp * 0.25;
    return base;
  }

  // 1. Simular el TVL total (curvas suaves y fluctuaciones naturales)
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  const n = months.length;
  const tvlTotal: number[] = [];
  // Índice del primer mes de 2025
  const idx2025 = months.findIndex(m => m.getFullYear() === 2025 && m.getMonth() === 0);

  for (let i = 0; i < n; i++) {
    // Fases: crecimiento logístico, bullrun progresivo, corrección, meseta, dientes de sierra
    let t = i / n;
    // Crecimiento logístico inicial
    let logistic = 200 / (1 + Math.exp(-10 * (t - 0.35)));
    // Bullrun progresivo (2020-2021)
    if (i >= 24 && i < 48) {
      logistic += 30 * Math.tanh((i-30)/8);
    }
    // Corrección abrupta pero progresiva (2022)
    if (i >= 49 && i < 60) {
      logistic -= 40 * (1 - Math.exp(-(i-49)/3));
    }
    // Meseta con oscilaciones (2023+)
    if (i >= 60) {
      logistic += 10 * Math.sin((i-60)/5) + 8 * Math.sin((i-60)/13);
    }
    // Crecimiento extra en 2025
    if (i >= idx2025) {
      logistic += 18 * Math.tanh((i-idx2025)/4) + 1.2 * (i-idx2025);
    }
    // Dientes de sierra y ruido controlado
    let noise = controlledNoise(i, 6, 3, true) + controlledNoise(i, 2, 0.9);
    let tvl = Math.max(0, logistic + noise + 10 * Math.sin(i/24));
    // Limitar cambios bruscos
    if (i > 0) {
      const prev = tvlTotal[i-1];
      if (Math.abs(tvl - prev) > 18) {
        tvl = prev + Math.sign(tvl - prev) * 18; // máximo cambio mensual
      }
    }
    tvlTotal.push(+tvl.toFixed(2));
  }
  // Suavizado leve para evitar picos artificiales
  const tvlTotalSmooth = smooth(tvlTotal, 2);

  // 2. Proporciones por lenguaje (curvas suaves, sin saltos, con fluctuaciones)
  const weights: { [lang: string]: number[] } = {
    Solidity: [],
    Rust: [],
    'Bitcoin Script': [],
    Vyper: [],
    Haskell: [],
    'C++': [],
    Cairo: [],
    Ride: [],
    Clarity: [],
    Java: [],
    Others: [],
  };
  for (let i = 0; i < n; i++) {
    // Solidity: dominante, decrece levemente tras el pico, con fluctuaciones suaves
    let sol = 0.91 - 0.04 * Math.tanh((i-50)/20) - 0.03 * Math.sin(i/12) + 0.008 * Math.sin(i/2) + 0.01 * Math.sin(i/7);
    // Rust: crece desde 2021, con dientes de sierra
    let rust = 0.0005 * (i > 36 ? Math.pow(i-36, 1.32) : 0) + 0.002 * Math.sin(i/3) + 0.002 * ((i % 9) / 9 - 0.5);
    // Bitcoin Script: estable, leve crecimiento, con ruido
    let btc = 0.035 + 0.01 * Math.tanh((i-40)/25) + 0.004 * Math.cos(i/2) + 0.002 * Math.sin(i/6);
    // Vyper: residual, plano, micro-variación
    let vyper = 0.013 + 0.003 * Math.sin(i/4) + 0.001 * Math.cos(i/2);
    // Haskell: plano, micro-variación
    let haskell = 0.0015 + 0.0005 * Math.sin(i/3) + 0.0005 * Math.cos(i/4);
    // C++: crece tras 2023, micro-variación
    let cpp = (i > 70 ? 0.002 + 0.002 * Math.tanh((i-70)/8) : 0.0015) + 0.0007 * Math.cos(i/2) + 0.0005 * Math.sin(i/5);
    // Cairo: surge 2022, micro-variación
    let cairo = (i > 55 ? 0.002 + 0.0025 * Math.tanh((i-55)/12) : 0.0002) + 0.0008 * Math.sin(i/2) + 0.001 * ((i % 7) / 7 - 0.5);
    // Ride: aparece 2021, micro-variación
    let ride = (i > 36 ? 0.0007 + 0.0002 * Math.sin(i/10) : 0.0001) + 0.0004 * Math.cos(i/2) + 0.0003 * Math.sin(i/3);
    // Clarity: desde 2020, micro-variación
    let clarity = (i > 24 ? 0.002 + 0.0002 * Math.sin(i/8) : 0.0001) + 0.0005 * Math.sin(i/2) + 0.0004 * Math.cos(i/3);
    // Java: marginal, micro-variación
    let java = 0.0008 + 0.0004 * Math.sin(i/4) + 0.0003 * Math.cos(i/2);
    // Others: lo que resta
    let sum = sol + rust + btc + vyper + haskell + cpp + cairo + ride + clarity + java;
    let others = Math.max(0, 1 - sum);
    weights['Solidity'].push(sol);
    weights['Rust'].push(rust);
    weights['Bitcoin Script'].push(btc);
    weights['Vyper'].push(vyper);
    weights['Haskell'].push(haskell);
    weights['C++'].push(cpp);
    weights['Cairo'].push(cairo);
    weights['Ride'].push(ride);
    weights['Clarity'].push(clarity);
    weights['Java'].push(java);
    weights['Others'].push(others);
  }
  // Suavizado de proporciones
  Object.keys(weights).forEach(lang => {
    weights[lang] = smooth(weights[lang], 7);
  });

  // 3. Construcción de la serie final
  for (let i = 0; i < n; i++) {
    const entry: any = { date: months[i].toISOString().split('T')[0] };
    Object.keys(weights).forEach(lang => {
      entry[lang] = +(tvlTotalSmooth[i] * weights[lang][i]).toFixed(2);
    });
    data.push(entry);
  }
  return data;
};

// Get the data for May 10, 2025
const getMay2025Data = () => {
  const data = generateTvlData();
  return data.find(item => item.date === '2025-05-10') || data[data.length - 1];
};

// Generate the breakdown for May 2025
export const tvlBreakdownMay2025 = Object.entries(getMay2025Data())
  .filter(([key]) => key !== 'date')
  .map(([language, value]) => ({
    language,
    tvl: {
      value: value as number,
      unit: 'billion'
    },
    color: LANGUAGE_COLORS[language.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS] || '#d3d3d3'
  }));

const TvlEvolutionChart: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const data = generateTvlData();
  const languages = Object.keys(data[0]).filter(key => key !== 'date');
  
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const tooltipBg = isDark ? 'bg-gray-900' : 'bg-white';
  const tooltipBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const cardShadow = isDark ? 'shadow-lg' : 'shadow-md';

  return (
    <div className={`w-full h-[600px] flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-xl border ${isDark ? 'border-gray-800' : 'border-gray-200'} ${cardShadow}`}>
      {/* Header Section */}
      <div className="mb-4">
        <h2 className={`text-2xl font-bold ${textColor}`}>
          {t('dashboard.tvl_evolution')}
        </h2>
      </div>

      {/* Custom Legend - Now in its own container */}
      <div className="w-full py-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {languages.map((lang) => {
            const langKey = lang.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS;
            const color = LANGUAGE_COLORS[langKey] || '#d3d3d3';
            return (
              <div key={lang} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {lang}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Area - Takes remaining space */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="tvl-brush-sync"
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
          <defs>
            {languages.map((lang) => {
              const langKey = lang.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS;
              const color = LANGUAGE_COLORS[langKey] || '#d3d3d3';
              const opacity = isDark ? 0.8 : 0.6;
              
              return (
                <linearGradient key={lang} id={`color${lang}`} x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={color}
                    stopOpacity={opacity}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={color}
                    stopOpacity={isDark ? 0.1 : 0.05}
                  />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={gridColor}
            opacity={isDark ? 0.5 : 0.3}
          />
          <XAxis 
            dataKey="date" 
            tick={{ 
              fontSize: 12,
              fill: isDark ? '#9CA3AF' : '#4B5563',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}B`}
            width={80}
            tick={{ 
              fontSize: 12,
              fill: isDark ? '#9CA3AF' : '#4B5563',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <RechartsTooltip 
            content={<CustomTooltip isDark={isDark} />}
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          {languages.map((lang) => (
            <Area
              key={lang}
              type="monotone"
              dataKey={lang}
              stackId="1"
              stroke={LANGUAGE_COLORS[lang.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS] || '#d3d3d3'}
              fill={`url(#color${lang})`}
              strokeWidth={1.5}
            />
          ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Brush Selector - Fixed height */}
      <div className="h-20 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            syncId="tvl-brush-sync" 
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="date" hide />
            <YAxis hide />
            {languages.map((lang) => (
              <Area
                key={lang}
                type="monotone"
                dataKey={lang}
                stackId="1"
                stroke={LANGUAGE_COLORS[lang.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS] || '#d3d3d3'}
                fill={LANGUAGE_COLORS[lang.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS] || '#d3d3d3'}
                strokeWidth={1}
              />
            ))}
            <Brush
              dataKey="date"
              height={28}
              travellerWidth={10}
              fill={isDark ? '#1F2937' : '#F3F4F6'}
              stroke={isDark ? '#4B5563' : '#9CA3AF'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Types for the tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload: Record<string, unknown>;
  }>;
  label?: string | number | Date;
  isDark: boolean;
}

// Custom Tooltip Component
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length > 0 && label) {
    // Sort payload to show from highest to lowest value
    const sortedPayload = [...payload].sort((a, b) => (b.value - a.value));
    
    // Format the date label
    const formatDate = (date: string | number | Date) => {
      try {
        return new Date(date).toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch (e) {
        return '';
      }
    };
    
    return (
      <div className={`p-3 ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-md border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {formatDate(label)}
        </p>
        <div className="space-y-1">
          {sortedPayload.map((entry: any) => {
            const langKey = entry.dataKey.toLowerCase().replace(/\s+/g, '') as keyof typeof LANGUAGE_COLORS;
            const color = LANGUAGE_COLORS[langKey] || '#d3d3d3';
            
            return (
              <div key={entry.dataKey} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {entry.dataKey}:
                  </span>
                </div>
                <span className={`text-sm font-medium ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${(entry.value).toLocaleString('en-US', { maximumFractionDigits: 2 })}B
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default TvlEvolutionChart;
