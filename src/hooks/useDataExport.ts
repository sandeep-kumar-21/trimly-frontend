import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { usersApi, ExportDataJobResponse } from '../lib/api/users.api';
import { toast } from 'sonner';

export function useDataExport() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const triggerExportMutation = useMutation({
    mutationFn: () => usersApi.triggerDataExport(),
    onSuccess: (data) => {
      setActiveJobId(data.jobId);
      toast.info('Data export started. Preparing your download file...');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to start data export';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });

  const pollQuery = useQuery<ExportDataJobResponse>({
    queryKey: ['export-status', activeJobId],
    queryFn: () => usersApi.checkExportStatus(activeJobId!),
    enabled: !!activeJobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') {
        return false; // Stop polling when finished
      }
      return 2000; // Poll every 2 seconds
    },
  });

  // Automatically trigger browser JSON file download when status is completed
  useEffect(() => {
    if (pollQuery.data?.status === 'completed' && pollQuery.data.result) {
      const jsonString = JSON.stringify(pollQuery.data.result, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trimly-export-${activeJobId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data export download completed!');
      setActiveJobId(null);
    } else if (pollQuery.data?.status === 'failed') {
      toast.error('Data export failed: ' + (pollQuery.data.message || 'Unknown error'));
      setActiveJobId(null);
    }
  }, [pollQuery.data, activeJobId]);

  return {
    startExport: triggerExportMutation.mutate,
    isExporting: triggerExportMutation.isPending || (!!activeJobId && pollQuery.data?.status !== 'completed'),
    jobStatus: pollQuery.data?.status || (activeJobId ? 'pending' : 'idle'),
  };
}
