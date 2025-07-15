import { supabase } from "@/lib/supabaseClient";

const provider = '292448b8-6438-47b7-9408-7d8f03ea4a37';

export const fetchResults = async (branch) => {
  const { data, error } = await supabase
    .from('results')
    .select('data')
    .eq('provider', provider)
    .eq('branch', branch)
    .single();

  if (error) {
    console.error('Fetch error:', error.message);
    return null;
  }

  return data.data;
};

export const fetchReports = async (branch) => {
  const { data, error } = await supabase
    .from('reports')
    .select('data')
    .eq('provider', provider)
    .eq('branch', branch)
    .single();

  if (error) {
    console.error('Fetch error:', error.message);
    return null;
  }

  return data.data;
};

export const updateResults = async (branch, updated) => {
  const { error } = await supabase
    .from('results')
    .update({ provider, branch, data: updated })
    .eq('provider', provider)
    .eq('branch', branch);


  if (error) {
    console.error('Update error:', error.message);
    return false;
  }

  return true;
};
