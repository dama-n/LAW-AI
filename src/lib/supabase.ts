type User = {
  id: string;
  email: string;
  fullName: string;
};

export type Session = {
  user: User | null;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const STORAGE_KEY = 'law_ai_compat_db';

const defaultSeed = {
  profiles: [],
  subscriptions: [],
  chat_conversations: [],
  chat_messages: [],
  documents: [],
  legal_templates: [
    {
      id: 'tpl-1',
      title: 'Service Agreement',
      description: 'Standard service agreement template for Indian businesses.',
      category: 'agreement',
      jurisdiction: 'India',
      content: 'This Service Agreement is entered into between {{party_name}} and {{client_name}}.',
      variables: ['party_name', 'client_name'],
      is_public: true,
      usage_count: 24,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tpl-2',
      title: 'NDA Agreement',
      description: 'Mutual non-disclosure agreement for business discussions.',
      category: 'contract',
      jurisdiction: 'India',
      content: 'This NDA is executed between {{company_name}} and {{recipient_name}}.',
      variables: ['company_name', 'recipient_name'],
      is_public: true,
      usage_count: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  document_generations: [],
};

function safeRead<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getState() {
  return safeRead<Record<string, unknown>>(STORAGE_KEY, defaultSeed);
}

function writeState(nextState: Record<string, unknown>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function listRows(table: string) {
  const state = getState();
  return (state[table] as Array<Record<string, unknown>> | undefined) ?? [];
}

function setRows(table: string, rows: Array<Record<string, unknown>>) {
  const state = getState();
  state[table] = rows;
  writeState(state);
}

function applyFilters(rows: Array<Record<string, unknown>>, filters: Array<(row: Record<string, unknown>) => boolean>) {
  return rows.filter((row) => filters.every((filter) => filter(row)));
}

function buildQueryBuilder(table: string) {
  const builder: any = {
    _filters: [] as Array<(row: Record<string, unknown>) => boolean>,
    _sort: null as { field: string; ascending: boolean } | null,
    _limit: null as number | null,
    _inserted: null as Record<string, unknown> | null,
    select() {
      return builder;
    },
    eq(field: string, value: unknown) {
      builder._filters.push((row: Record<string, unknown>) => row[field] === value);
      return builder;
    },
    order(field: string, options: { ascending?: boolean } = {}) {
      builder._sort = { field, ascending: options.ascending ?? true };
      return builder;
    },
    limit(limit: number) {
      builder._limit = limit;
      return builder;
    },
    insert(values: Record<string, unknown>) {
      const rows = listRows(table);
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${table}-${Date.now()}`;
      const next = {
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...values,
      };
      rows.push(next);
      setRows(table, rows);
      builder._inserted = next;
      return builder;
    },
    update(values: Record<string, unknown>) {
      const rows = listRows(table);
      const updated = rows.map((row) => {
        const match = builder._filters.every((filter: (row: Record<string, unknown>) => boolean) => filter(row));
        if (!match) return row;
        return { ...row, ...values, updated_at: new Date().toISOString() };
      });
      setRows(table, updated);
      return builder;
    },
    delete() {
      const rows = listRows(table);
      const filtered = rows.filter((row) => !builder._filters.every((filter: (row: Record<string, unknown>) => boolean) => filter(row)));
      setRows(table, filtered);
      return builder;
    },
    single() {
      const rows = applyFilters(listRows(table), builder._filters);
      const result = builder._inserted ?? rows[0] ?? null;
      return Promise.resolve({ data: result, error: null });
    },
    maybeSingle() {
      const rows = applyFilters(listRows(table), builder._filters);
      const result = builder._inserted ?? rows[0] ?? null;
      return Promise.resolve({ data: result, error: null });
    },
    async then(resolve: any, reject: any) {
      try {
        const rows = applyFilters(listRows(table), builder._filters);
        let result = rows;
        if (builder._sort) {
          result = [...result].sort((a, b) => {
            const left = a[builder._sort.field];
            const right = b[builder._sort.field];
            const direction = builder._sort.ascending ? 1 : -1;
            if (left === right) return 0;
            return left > right ? direction : -direction;
          });
        }
        if (builder._limit !== null) {
          result = result.slice(0, builder._limit);
        }
        return resolve({ data: result, error: null });
      } catch (error) {
        return reject(error);
      }
    },
  };

  return builder;
}

function getStoredUser(): User | null {
  const raw = localStorage.getItem('law_ai_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

const auth = {
  async getSession() {
    const user = getStoredUser();
    return {
      data: {
        session: user ? { user } : null,
      },
    };
  },
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const user = getStoredUser();
    callback('INITIAL_SESSION', user ? { user } : null);
    return {
      data: {
        subscription: {
          unsubscribe() {
            return undefined;
          },
        },
      },
    };
  },
  async signUp(email: string, password: string, fullName: string) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: new Error(data.message || 'Signup failed') };
    }
    localStorage.setItem('law_ai_token', data.token);
    localStorage.setItem('law_ai_user', JSON.stringify(data.user));
    return { data: { user: data.user }, error: null };
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: new Error(data.message || 'Login failed') };
    }
    localStorage.setItem('law_ai_token', data.token);
    localStorage.setItem('law_ai_user', JSON.stringify(data.user));
    return { data: { user: data.user }, error: null };
  },
  async signOut() {
    localStorage.removeItem('law_ai_token');
    localStorage.removeItem('law_ai_user');
    return { error: null };
  },
  async signInWithOAuth() {
    return { error: null };
  },
};

export const supabase = {
  auth,
  from(table: string) {
    return buildQueryBuilder(table);
  },
};

export type Database = {
  public: {
    Tables: Record<string, never>;
  };
};
