// Asegurar que TypeScript reconozca los módulos de imágenes
// y otros archivos estáticos

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Asegurar que TypeScript reconozca los módulos CSS/SCSS
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Asegurar que TypeScript reconozca los alias de ruta
declare module '@/services/api' {
  export type Blockchain = 'Ethereum' | 'BNBChain' | 'Base' | 'Polygon' | 'Arbitrum' | 'Optimism' | 'Bitcoin' | 'Solana' | 'Tron';
  
  export interface GasFee {
    slow: number;
    normal: number;
    fast: number;
  }
  
  export const fetchTvlData: () => Promise<Array<{name: string, value: number}>>;
  export const fetchGasFees: (chain: Blockchain) => Promise<GasFee>;
  export const fetchDailyTransactions: () => Promise<Array<Record<string, any>>>;
  
  // New getter functions
  export const getTvlData: () => Promise<Array<{name: string, value: number}>>;
  export const getGasFeesData: () => Promise<Record<Blockchain, GasFee>>;
  export const getDailyTransactions: () => Promise<Array<Record<string, any>>>;
  
  // Deprecated - for backward compatibility only
  export const dailyTransactions: Promise<Array<Record<string, any>>>;
  export const tvlData: Promise<Array<{name: string, value: number}>>;
  export const gasFeesData: Promise<Record<Blockchain, GasFee>>;
}

// Declaración para los hooks
declare module '@/hooks/useGasFees' {
  import { GasFee, Blockchain } from '@/services/api';
  
  export const useGasFees: (chain: Blockchain) => {
    data: GasFee | undefined;
    isLoading: boolean;
    error: Error | null;
  };
}

declare module '@/hooks/useTvlData' {
  export const useTvlData: () => {
    data: Array<{name: string, value: number}> | undefined;
    isLoading: boolean;
    error: Error | null;
  };
}

declare module '@/hooks/useDailyTransactions' {
  export const useDailyTransactions: () => {
    data: Array<Record<string, any>> | undefined;
    isLoading: boolean;
    error: Error | null;
  };
}

// Declaración para los componentes de UI
declare module '@/components/ui/card' {
  import { ComponentType, HTMLAttributes, ReactNode } from 'react';
  
  export const Card: ComponentType<HTMLAttributes<HTMLDivElement>>;
  export const CardHeader: ComponentType<HTMLAttributes<HTMLDivElement>>;
  export const CardTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>;
  export const CardContent: ComponentType<HTMLAttributes<HTMLDivElement>>;
}

declare module '@/components/ui/skeleton' {
  import { ComponentType, HTMLAttributes } from 'react';
  
  export const Skeleton: ComponentType<HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }>;
}

declare module '@/lib/utils' {
  export const cn: (...inputs: Array<string | Record<string, boolean> | undefined | null | false>) => string;
}
