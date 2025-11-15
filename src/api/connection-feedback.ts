export interface SubmitConnectionFeedbackInput {
  connectionIdentifier: string;
  connectionName: string;
  metContext?: string;
  rating: number;
  comment?: string | null;
}

export interface ConnectionFeedbackRecord {
  id: string;
  user_id: string;
  connection_identifier: string;
  connection_name: string;
  met_context: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Store feedback in memory for now
const feedbackStore: ConnectionFeedbackRecord[] = [];

const createOfflineResponse = () => ({ id: `offline-${Date.now()}` });

export const fetchConnectionFeedback = async (): Promise<ConnectionFeedbackRecord[]> => {
  return feedbackStore;
};

export const submitConnectionFeedback = async (
  input: SubmitConnectionFeedbackInput,
): Promise<{ id: string }> => {
  const feedback: ConnectionFeedbackRecord = {
    id: `feedback-${Date.now()}`,
    user_id: 'local-user',
    connection_identifier: input.connectionIdentifier,
    connection_name: input.connectionName,
    met_context: input.metContext ?? null,
    rating: input.rating,
    comment: input.comment ?? null,
    created_at: new Date().toISOString(),
  };
  
  feedbackStore.push(feedback);
  return { id: feedback.id };
};
