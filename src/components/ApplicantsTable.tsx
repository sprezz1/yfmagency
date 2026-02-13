import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Applicant {
  id: string;
  name: string;
  email: string;
  nationality: string;
  country_of_residence: string;
  discord_username: string;
  phone_type: string;
  contacted: boolean;
  created_at: string;
}

export default function ApplicantsTable() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setApplicants(data ?? []);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400 text-lg">Loading applicants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-slate-400 text-sm">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''} total</div>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Nationality</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Discord</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Contacted</th>
              <th className="px-4 py-3">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {applicants.map((a) => (
              <tr key={a.id} className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-white">{a.name}</td>
                <td className="px-4 py-3 text-slate-300">{a.email}</td>
                <td className="px-4 py-3 text-slate-300">{a.nationality}</td>
                <td className="px-4 py-3 text-slate-300">{a.country_of_residence}</td>
                <td className="px-4 py-3 text-slate-300">{a.discord_username}</td>
                <td className="px-4 py-3 text-slate-300">{a.phone_type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${a.contacted ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {a.contacted ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
