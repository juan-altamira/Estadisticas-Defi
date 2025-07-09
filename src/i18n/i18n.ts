import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    dashboard: {
      title: 'DeFi Dashboard',
      tvl_by_category: 'TVL by Category',
      tvl_by_chain: 'TVL by Chain',
      top_protocols: 'Top Protocols',
      tvl_evolution: 'TVL Evolution by Programming Language',
      tvl_breakdown: 'TVL Breakdown (May 2025)',
    },
    common: {
      refresh: 'Refresh',
      loading: 'Loading...',
      error: 'Error',
      something_went_wrong: 'Something went wrong',
      retry: 'Retry',
      no_data_available: 'No data available',
      rank: 'Rank',
      name: 'Name',
      tvl: 'TVL',
      change_24h: '24h Change',
      chains: 'Chains',
      category: 'Category',
      tvl_evolution: 'TVL Evolution',
      transactions: 'Transactions',
      volume: 'Volume',
      price: 'Price',
      market_cap: 'Market Cap',
      all_categories: 'All Categories',
      all_chains: 'All Chains',
      search: 'Search...',
      no_results: 'No results found',
      select_language: 'Select Language',
      select_theme: 'Select Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    daily_transactions: 'Daily Transactions',
    protocols: {
      title: 'Protocols',
      description: 'List of all DeFi protocols',
      columns: {
        name: 'Name',
        category: 'Category',
        chains: 'Chains',
        tvl: 'TVL',
        change_24h: '24h Change',
      },
    },
    charts: {
      tvl: 'Total Value Locked',
      volume: 'Trading Volume',
      users: 'Active Users',
    },
    transaction_fees: 'Transaction Fees by Network',
    speed: {
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
    },
  }
};

// Spanish translations
const es = {
  translation: {
    dashboard: {
      title: 'Panel DeFi',
      tvl_by_category: 'TVL por Categoría',
      tvl_by_chain: 'TVL por Cadena',
      top_protocols: 'Protocolos Principales',
      tvl_evolution: 'Evolución del TVL por Lenguaje de Programación',
      tvl_breakdown: 'Desglose del TVL (Mayo 2025)',
    },
    common: {
      refresh: 'Actualizar',
      loading: 'Cargando...',
      error: 'Error',
      something_went_wrong: 'Algo salió mal',
      retry: 'Reintentar',
      no_data_available: 'No hay datos disponibles',
      rank: 'Posición',
      name: 'Nombre',
      tvl: 'TVL',
      change_24h: 'Cambio 24h',
      chains: 'Cadenas',
      category: 'Categoría',
      tvl_evolution: 'Evolución del TVL',
      transactions: 'Transacciones',
      volume: 'Volumen',
      price: 'Precio',
      market_cap: 'Capitalización de Mercado',
      all_categories: 'Todas las Categorías',
      all_chains: 'Todas las Cadenas',
      search: 'Buscar...',
      no_results: 'No se encontraron resultados',
      select_language: 'Seleccionar Idioma',
      select_theme: 'Seleccionar Tema',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },
    daily_transactions: 'Transacciones Diarias',
    protocols: {
      title: 'Protocolos',
      description: 'Lista de todos los protocolos DeFi',
      columns: {
        name: 'Nombre',
        category: 'Categoría',
        chains: 'Cadenas',
        tvl: 'TVL',
        change_24h: 'Cambio 24h',
      },
    },
    charts: {
      tvl: 'Valor Total Bloqueado',
      volume: 'Volumen de Operaciones',
      users: 'Usuarios Activos',
    },
    transaction_fees: 'Tarifas de Transacción por Red',
    speed: {
      slow: 'Lento',
      normal: 'Normal',
      fast: 'Rápido',
    },
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      es: es,
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
