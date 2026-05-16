const STATE_VERSION = 1;

const DEFAULT_STATE = {
  version: STATE_VERSION,
  investment: {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 20,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  },
  portfolio: {
    investorId: "primary"
  },
  simulations: {
    iterations: 1000,
    monteCarlo: null,
    historicalReplay: null,
    scenarios: [],
    ranking: [],
    result: null
  },
  explanation: null,
  attribution: [],
  comparison: null,
  diagnostics: [],
  charts: {
    viewport: {
      zoom: 1,
      panX: 0
    },
    dataset: null
  },
  presets: {
    selected: "balanced"
  },
  ui: {
    isLoading: false,
    error: "",
    debug: false,
    theme: "light",
    currentTab: "dashboard"
  },
  export: {}
};

function createRepository(storageKey) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    save(value) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  };
}

function createStateManager(initialState, repository) {
  let state = mergeState(initialState, migrateState(repository.load()));
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(updater) {
    const nextState = typeof updater === "function" ? updater(state) : updater;
    state = mergeState(state, nextState);
    repository.save(state);
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

function migrateState(storedState) {
  if (!storedState || typeof storedState !== "object") return null;
  if (storedState.version === STATE_VERSION) return storedState;

  const legacyConfig = storedState.config || {};
  const legacyUi = storedState.ui || {};
  return {
    version: STATE_VERSION,
    investment: {
      initialAmount: legacyConfig.initialAmount,
      monthlyContribution: legacyConfig.monthlyContribution,
      years: legacyConfig.years,
      annualReturn: legacyConfig.annualReturn,
      volatility: legacyConfig.volatility,
      dividendYield: legacyConfig.dividendYield
    },
    portfolio: {
      investorId: "primary"
    },
    simulations: {
      iterations: legacyConfig.simulations,
      monteCarlo: storedState.monteCarlo || null,
      historicalReplay: storedState.historicalReplay || null,
      scenarios: [],
      ranking: [],
      result: storedState.result || null
    },
    explanation: null,
    attribution: [],
    comparison: null,
    diagnostics: [],
    charts: {
      viewport: legacyUi.viewport
    },
    presets: {},
    ui: {
      isLoading: legacyUi.isLoading,
      error: legacyUi.error,
      debug: legacyUi.debug,
      theme: legacyConfig.theme,
      currentTab: legacyConfig.currentTab
    },
    export: {}
  };
}

function mergeState(base, patch) {
  if (!patch || typeof patch !== "object") return structuredClone(base);
  return {
    ...base,
    ...patch,
    investment: { ...base.investment, ...(patch.investment || {}) },
    portfolio: { ...base.portfolio, ...(patch.portfolio || {}) },
    simulations: { ...base.simulations, ...(patch.simulations || {}) },
    explanation: patch.explanation || base.explanation,
    diagnostics: patch.diagnostics || base.diagnostics,
    charts: {
      ...base.charts,
      ...(patch.charts || {}),
      viewport: {
        ...base.charts.viewport,
        ...((patch.charts && patch.charts.viewport) || {})
      }
    },
    presets: { ...base.presets, ...(patch.presets || {}) },
    ui: { ...base.ui, ...(patch.ui || {}) },
    attribution: patch.attribution || base.attribution,
    comparison: patch.comparison || base.comparison,
    export: { ...base.export, ...(patch.export || {}) }
  };
}

function createServiceLayer(stateManager) {
  return {
    updateInvestment(partialInvestment) {
      stateManager.setState((state) => ({
        investment: { ...state.investment, ...partialInvestment }
      }));
    },
    updateSimulationConfig(partialSimulationConfig) {
      stateManager.setState((state) => ({
        simulations: { ...state.simulations, ...partialSimulationConfig }
      }));
    },
    setSimulationResult(result) {
      stateManager.setState((state) => ({
        simulations: { ...state.simulations, result }
      }));
    },
    setDerivedDataset(dataset, result, portfolio, historicalReplay, scenarios, ranking, explanation, diagnostics, attribution, comparison) {
      stateManager.setState((state) => ({
        portfolio: portfolio || state.portfolio,
        simulations: {
          ...state.simulations,
          result,
          ...(historicalReplay ? { historicalReplay } : {}),
          ...(scenarios ? { scenarios } : {}),
          ...(ranking ? { ranking } : {})
        },
        explanation: explanation || state.explanation,
        attribution: attribution || state.attribution,
        comparison: comparison || state.comparison,
        diagnostics: diagnostics || state.diagnostics,
        charts: { ...state.charts, dataset }
      }));
    },
    setInvestmentAndDerived(investment, dataset, result, portfolio, historicalReplay, scenarios, ranking, explanation, diagnostics, attribution, comparison) {
      stateManager.setState((state) => ({
        portfolio: portfolio || state.portfolio,
        investment,
        simulations: {
          ...state.simulations,
          result,
          ...(historicalReplay ? { historicalReplay } : {}),
          ...(scenarios ? { scenarios } : {}),
          ...(ranking ? { ranking } : {})
        },
        explanation: explanation || state.explanation,
        attribution: attribution || state.attribution,
        comparison: comparison || state.comparison,
        diagnostics: diagnostics || state.diagnostics,
        charts: { ...state.charts, dataset }
      }));
    },
    setMonteCarloResult(monteCarlo) {
      stateManager.setState((state) => ({
        simulations: { ...state.simulations, monteCarlo }
      }));
    },
    setHistoricalReplay(historicalReplay) {
      stateManager.setState((state) => ({
        simulations: { ...state.simulations, historicalReplay }
      }));
    },
    updateViewport(updater) {
      stateManager.setState((state) => ({
        charts: {
          ...state.charts,
          viewport: updater(state.charts.viewport)
        }
      }));
    },
    setError(error) {
      stateManager.setState((state) => ({
        ui: { ...state.ui, error }
      }));
    }
  };
}
