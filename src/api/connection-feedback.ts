import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export interface SubmitConnectionFeedbackInput {
  connectionIdentifier: string;
  connectionName: string;
  metContext?: string;
  rating: number;
  comment?: string | null;
}

export type ConnectionFeedbackRecord = Tables<"connection_feedback">;

const createOfflineResponse = () => ({ id: `offline-${Date.now()}` });

export const fetchConnectionFeedback = async (): Promise<ConnectionFeedbackRecord[]> => {
  if (!isSupabaseConfigured) {
    return [];
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("connection_feedback")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const submitConnectionFeedback = async (
  input: SubmitConnectionFeedbackInput,
): Promise<{ id: string }> => {
  if (!isSupabaseConfigured) {
    console.info("Supabase is not configured. Capturing feedback locally only.");
    return createOfflineResponse();
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("Please sign in to share connection feedback.");
  }

  const { data, error } = await supabase
    .from("connection_feedback")
    .insert({
      user_id: user.id,
      connection_identifier: input.connectionIdentifier,
      connection_name: input.connectionName,
      met_context: input.metContext ?? null,
      rating: input.rating,
      comment: input.comment ?? null,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Feedback submission did not return an identifier.");
  }

  return data;
};
