// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kgsvxuheriypagodwehc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnc3Z4dWhlcml5cGFnb2R3ZWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MjA5MTksImV4cCI6MjA2ODM5NjkxOX0.dhZPrQ-5mCXPLtT0lqajVs_qQm1iHPGdOKhjx-fA5B4';

export const supabase = createClient(supabaseUrl, supabaseKey);
