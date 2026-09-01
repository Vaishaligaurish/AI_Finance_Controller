import { useState, useEffect } from 'react';
import { getRunStatus, getRunSummary } from '../api/reconciliation';

export const useRunStatus = (runId) => {
  const [status, setStatus] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!runId) return;
    let interval;
    const fetchStatus = async () => {
      try {
        const res = await getRunStatus(runId);
        setStatus(res.data.status);
        if (res.data.status === 'COMPLETED' || res.data.status === 'FAILED') {
          clearInterval(interval);
          const sumRes = await getRunSummary(runId);
          setSummary(sumRes.data);
        }
      } catch (err) { console.error(err); }
    };
    fetchStatus();
    interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [runId]);

  return { status, summary };
};
