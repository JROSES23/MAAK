'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth';

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    authClient.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  return { loading, email };
}
