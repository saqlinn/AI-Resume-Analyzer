type DemoUser = {
  email: string;
  password: string;
};

type DemoSession = {
  user: {
    id: string;
    email: string;
    aud: string;
  };
  access_token: string;
  token_type: string;
};

const demoUsers = new Map<string, DemoUser>([
  ['demo@example.com', { email: 'demo@example.com', password: 'demo123' }],
  ['test@example.com', { email: 'test@example.com', password: 'test123' }],
]);

const getStoredSession = (): DemoSession | null => {
  const session = localStorage.getItem('demo_session');
  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as DemoSession;
  } catch {
    localStorage.removeItem('demo_session');
    return null;
  }
};

const createSession = (email: string): DemoSession => ({
  user: { id: email, email, aud: 'authenticated' },
  access_token: btoa(`${email}:${Date.now()}`),
  token_type: 'bearer',
});

export const supabase = {
  auth: {
    signInWithPassword: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const user = demoUsers.get(email);
      if (!user || user.password !== password) {
        return {
          error: { message: 'Invalid email or password' },
          data: { session: null },
        };
      }

      const session = createSession(email);
      localStorage.setItem('demo_session', JSON.stringify(session));
      return { error: null, data: { session } };
    },

    signUp: async ({ email, password }: DemoUser) => {
      if (demoUsers.has(email)) {
        return {
          error: { message: 'This email is already registered. Please login instead.' },
          data: { user: null },
        };
      }

      demoUsers.set(email, { email, password });
      return { error: null, data: { user: { id: email, email } } };
    },

    getSession: async () => ({ data: { session: getStoredSession() } }),

    signOut: async () => {
      localStorage.removeItem('demo_session');
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: DemoSession | null) => void) => {
      callback('INITIAL_SESSION', getStoredSession());
      return { data: { subscription: { unsubscribe: () => undefined } } };
    },
  },

  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
} as any;
