import React, { useCallback, useEffect, useState } from 'react';
import { UserPreferences, LogisticsJob, LogisticsJobStatus } from '../../types';
import {
  listLogisticsJobs,
  acceptLogisticsJob,
  updateLogisticsJobStatus,
} from '../../services/mvpDataService';
import { useI18n } from '../../i18n/I18nContext';
import { Loader2, Truck } from 'lucide-react';

type LogisticsJobsViewProps = {
  preferences: UserPreferences | null;
  refreshKey?: number;
};

const transporterId = 'me';

export const LogisticsJobsView: React.FC<LogisticsJobsViewProps> = ({ preferences, refreshKey = 0 }) => {
  const { t, lang } = useI18n();
  const [jobs, setJobs] = useState<LogisticsJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const name =
    preferences?.location?.trim() ||
    (lang === 'hi' ? 'ड्राइवर' : 'Driver');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await listLogisticsJobs();
    setJobs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const onAccept = async (jobId: string) => {
    setBusy(jobId);
    await acceptLogisticsJob(jobId, transporterId, name);
    setBusy(null);
    await load();
  };

  const onStatus = async (jobId: string, status: LogisticsJobStatus) => {
    setBusy(jobId);
    await updateLogisticsJobStatus(jobId, status);
    setBusy(null);
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Truck className="text-orange-600" aria-hidden />
        {t('jobs.title')}
      </h2>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed">{t('jobs.empty')}</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li key={job.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-2">
              <p className="font-bold text-gray-900">{job.crop}</p>
              <p className="text-sm text-gray-600">
                {job.quantity} {job.unit} · {job.pickupLocation} → {job.dropLocation}
              </p>
              <p className="text-xs text-gray-500">{job.farmerName}</p>
              <p className="text-xs font-semibold text-orange-700">{job.status}</p>
              {job.status === 'open' && (
                <button
                  type="button"
                  disabled={busy === job.id}
                  onClick={() => onAccept(job.id)}
                  className="w-full min-h-[48px] rounded-xl bg-orange-600 text-white font-bold disabled:opacity-50"
                >
                  {busy === job.id ? '…' : t('jobs.accept')}
                </button>
              )}
              {job.status !== 'open' && job.status !== 'delivered' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">{t('jobs.status')}</label>
                  <select
                    value={job.status}
                    disabled={busy === job.id}
                    onChange={(e) => onStatus(job.id, e.target.value as LogisticsJobStatus)}
                    className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                  >
                    <option value="accepted">accepted</option>
                    <option value="picked_up">picked_up</option>
                    <option value="in_transit">in_transit</option>
                    <option value="delivered">delivered</option>
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
