import { verify as verifyApi } from '@/services/api';
import type { VerifyPayload } from '@/types/auth';

export const useIsVerifyCode = () => {

  const handleVerify = async (payload: VerifyPayload) => {
    try {
      await verifyApi(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Verification failed');
      }
    }
  };

  return handleVerify;
};
