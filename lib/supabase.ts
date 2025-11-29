import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { Platform } from 'react-native';

const supabaseUrl = 'https://lvmbedzoyantuowhjysc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWJlZHpveWFudHVvd2hqeXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTg5NjYsImV4cCI6MjA3OTgzNDk2Nn0.GhT3CGPa62lwM7sjRp6cCv04zWFUau8Tii4mjYPM7RM';

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web'
      ? (isBrowser ? AsyncStorage : {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
      })
      : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
