import { useCallback, useEffect, useMemo, useState } from "react";
import {
  decryptString,
  ensureConversationKey,
  encryptString,
  isWebCryptoAvailable,
} from "@/lib/encryption";

interface UseEndToEndEncryptionResult {
  isReady: boolean;
  error: string | null;
  encrypt: (text: string) => Promise<string>;
  decrypt: (payload: string) => Promise<string>;
}

export const useEndToEndEncryption = (conversationId: string): UseEndToEndEncryptionResult => {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initialise = async () => {
      setIsReady(false);
      setError(null);
      setKey(null);

      if (!conversationId) {
        setError("A valid conversation identifier is required for encryption.");
        return;
      }

      if (!isWebCryptoAvailable()) {
        setError("Secure messaging is unavailable: Web Crypto API not supported.");
        return;
      }

      try {
        const conversationKey = await ensureConversationKey(conversationId);
        if (!cancelled) {
          setKey(conversationKey);
          setIsReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setIsReady(false);
        }
      }
    };

    void initialise();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const encrypt = useCallback(
    async (text: string) => {
      if (!key) {
        throw new Error("Encryption key is not ready");
      }
      return encryptString(text, key);
    },
    [key],
  );

  const decrypt = useCallback(
    async (payload: string) => {
      if (!key) {
        throw new Error("Encryption key is not ready");
      }
      return decryptString(payload, key);
    },
    [key],
  );

  return useMemo(
    () => ({
      isReady,
      error,
      encrypt,
      decrypt,
    }),
    [decrypt, encrypt, error, isReady],
  );
};
