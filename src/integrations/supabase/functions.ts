import { supabase } from "./client";

export type BulkEmailPayload = {
  subject: string;
  body: string;
  preview?: boolean;
};

export async function sendBulkEmail(payload: BulkEmailPayload) {
  const { data, error } = await supabase.functions.invoke("send-bulk-email", {
    body: payload,
  });
  if (error) throw error;
  return data as {
    sent: number;
    totalRecipients: number;
    preview: boolean;
    sample: string[];
  };
}

export async function listUserEmails() {
  const { data, error } = await supabase.functions.invoke("list-user-emails", {
    method: "GET",
  });
  if (error) throw error;
  return data as { emails: string[]; count: number };
}
