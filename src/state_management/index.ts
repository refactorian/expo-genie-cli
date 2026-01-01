/**
 * State Management Abstraction System
 * Supports multiple state management libraries and provides conversion between them
 */

export type StateManagement = 'zustand' | 'redux' | 'mobx' | 'jotai' | 'context' | 'none';

export interface StateManagementConfig {
  name: StateManagement;
  displayName: string;
  packages: string[];
  devPackages?: string[];
  setupInstructions: string[];
}

export const stateManagementLibraries: Record<StateManagement, StateManagementConfig> = {
  zustand: {
    name: 'zustand',
    displayName: 'Zustand',
    packages: ['zustand'],
    setupInstructions: [
      'Create stores in src/store/',
      'Use create() to define stores',
      'Access with custom hooks',
    ],
  },

  redux: {
    name: 'redux',
    displayName: 'Redux Toolkit',
    packages: ['@reduxjs/toolkit', 'react-redux'],
    setupInstructions: [
      'Create store in src/store/',
      'Wrap app with <Provider>',
      'Create slices for features',
    ],
  },

  mobx: {
    name: 'mobx',
    displayName: 'MobX',
    packages: ['mobx', 'mobx-react-lite'],
    setupInstructions: [
      'Create observable stores',
      'Use observer() for components',
      'Define actions and computed values',
    ],
  },

  jotai: {
    name: 'jotai',
    displayName: 'Jotai',
    packages: ['jotai'],
    setupInstructions: [
      'Create atoms in src/atoms/',
      'Use useAtom() hook',
      'Define derived atoms',
    ],
  },

  context: {
    name: 'context',
    displayName: 'React Context',
    packages: [],
    setupInstructions: [
      'Create context providers',
      'Use useContext() hook',
      'Define context values',
    ],
  },

  none: {
    name: 'none',
    displayName: 'Local State (useState)',
    packages: [],
    setupInstructions: ['Use useState() for local state'],
  },
};

export class StateManagementAdapter {
  constructor(private stateManagement: StateManagement) { }

  generateStore(storeName: string, typescript: boolean): string {
    switch (this.stateManagement) {
      case 'zustand':
        return this.generateZustandStore(storeName, typescript);
      case 'redux':
        return this.generateReduxSlice(storeName, typescript);
      case 'mobx':
        return this.generateMobXStore(storeName, typescript);
      case 'jotai':
        return this.generateJotaiAtoms(storeName, typescript);
      case 'context':
        return this.generateContextProvider(storeName, typescript);
      default:
        return this.generateLocalState(storeName, typescript);
    }
  }

  private generateZustandStore(storeName: string, typescript: boolean): string {
    const capitalizedName = storeName.charAt(0).toUpperCase() + storeName.slice(1);

    return typescript
      ? `import { create } from 'zustand';

interface ${capitalizedName}State {
  items: any[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: any) => void;
  clearError: () => void;
}

export const use${capitalizedName}Store = create<${capitalizedName}State>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      // Sample implementation: replace with your API call or adapter
      set({ error: error.message, loading: false });
    }
  },

  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));`
      : `import { create } from 'zustand';

export const use${capitalizedName}Store = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = [];
      set({ items, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));`;
  }

  private generateReduxSlice(storeName: string, typescript: boolean): string {
    return typescript
      ? `import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ${storeName}State {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ${storeName}State = {
  items: [],
  loading: false,
  error: null,
};

export const fetch${storeName} = createAsyncThunk(
  '${storeName}/fetch',
  async () => {
    // Example: replace with your API endpoint
    const response = await fetch('YOUR_API_URL');
    return response.json();
  }
);

const ${storeName}Slice = createSlice({
  name: '${storeName}',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<any>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<{ id: string; updates: any }>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch${storeName}.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch${storeName}.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetch${storeName}.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export const { addItem, removeItem, updateItem } = ${storeName}Slice.actions;
export default ${storeName}Slice.reducer;`
      : `// Redux Toolkit Slice (JavaScript version)`;
  }

  private generateMobXStore(storeName: string, _typescript: boolean): string {
    void _typescript;
    return `import { makeAutoObservable, runInAction } from 'mobx';

class ${storeName}Store {
  items = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchItems() {
    this.loading = true;
    this.error = null;
    try {
      // Sample implementation: replace with your API call or adapter
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateItem(id, updates) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
    }
  }

  clearError() {
    this.error = null;
  }
}

export const ${storeName}Store = new ${storeName}Store();`;
  }

  private generateJotaiAtoms(storeName: string, _typescript: boolean): string {
    void _typescript;
    return `import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const ${storeName}ItemsAtom = atom([]);
export const ${storeName}LoadingAtom = atom(false);
export const ${storeName}ErrorAtom = atom(null);

export const ${storeName}FetchAtom = atom(
  null,
  async (get, set) => {
    set(${storeName}LoadingAtom, true);
    set(${storeName}ErrorAtom, null);
    try {
      // Sample implementation: replace with your API call or adapter
      const items = [];
      set(${storeName}ItemsAtom, items);
    } catch (error) {
      set(${storeName}ErrorAtom, error.message);
    } finally {
      set(${storeName}LoadingAtom, false);
    }
  }
);`;
  }

  private generateContextProvider(storeName: string, _typescript: boolean): string {
    const capitalizedName = storeName.charAt(0).toUpperCase() + storeName.slice(1);

    return _typescript
      ? `import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ${capitalizedName}ContextType {
  items: any[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: any) => void;
}

const ${capitalizedName}Context = createContext<${capitalizedName}ContextType | undefined>(undefined);

export function ${capitalizedName}Provider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sample implementation: replace with your API call or adapter
    } finally {
      setLoading(false);
    }
  };

  const addItem = (item: any) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return (
    <${capitalizedName}Context.Provider
      value={{ items, loading, error, fetchItems, addItem, removeItem, updateItem }}
    >
      {children}
    </${capitalizedName}Context.Provider>
  );
}

export function use${capitalizedName}() {
  const context = useContext(${capitalizedName}Context);
  if (context === undefined) {
    throw new Error('use${capitalizedName} must be used within a ${capitalizedName}Provider');
  }
  return context;
}`
      : `// Context Provider (JavaScript version)`;
  }

  private generateLocalState(_storeName: string, _typescript: boolean): string {
    // Parameters intentionally unused in this simplified example
    void _storeName;
    void _typescript;
    return `// Use useState() in your component for local state management
// Example:
// const [items, setItems] = useState([]);
// const [loading, setLoading] = useState(false);`;
  }
}

export const getStateManagement = (name: string): StateManagementConfig | undefined => {
  return stateManagementLibraries[name as StateManagement];
};

export const createStateAdapter = (stateManagement: StateManagement): StateManagementAdapter => {
  return new StateManagementAdapter(stateManagement);
};