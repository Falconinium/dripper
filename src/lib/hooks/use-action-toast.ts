'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

type ActionState = {
  status: 'idle' | 'success' | 'error' | string;
  message?: string;
};

export function useActionToast(state: ActionState) {
  useEffect(() => {
    if (state.status === 'success' && state.message) {
      toast.success(state.message);
    } else if (state.status === 'error' && state.message) {
      toast.error(state.message);
    }
  }, [state.status, state.message]);
}
