import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Megaphone, Mail, Download, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export const AdminMarketing: React.FC = () => {
  const { subscribers, addSubscriber } = useStore();
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignStatus, setCampaignStatus] = useState('');

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Email,SubscribedAt\n' +
      subscribers.map((s) => `${s.id},${s.email},${s.subscribedAt}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurelia_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignStatus(`Campaign "${campaignTitle}" transmitted to ${subscribers.length} verified VIP subscribers.`);
    setCampaignTitle('');
    setCampaignSubject('');
    setTimeout(() => setCampaignStatus(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Marketing &amp; Gazette Subscriptions
          </h1>
          <p className="text-xs text-[#78716C]">
            Manage client subscriptions, private invitations, and seasonal salon launches.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-white border border-[#DDD5C5] text-[#1A1918] hover:bg-[#F5F2EB] rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Client CSV ({subscribers.length})</span>
        </button>
      </div>

      {campaignStatus && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{campaignStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        
        {/* Campaign Dispatcher */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-2">
            <Megaphone className="w-4 h-4 text-[#9A7B4F]" />
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              Broadcast Atelier Gazette
            </h3>
          </div>

          <form onSubmit={handleLaunchCampaign} className="space-y-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Campaign Title</label>
              <input
                type="text"
                required
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="e.g. Private Salon: The Winter Fragrance Reserve"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Email Subject Header</label>
              <input
                type="text"
                required
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="An invitation to the Paris private collection..."
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Recipient Segment</label>
              <select className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]">
                <option>All Newsletter Subscribers ({subscribers.length})</option>
                <option>VIP Clients (&gt; $300 Lifetime Spend)</option>
                <option>Fragrance Enthusiasts</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Campaign</span>
            </button>
          </form>
        </div>

        {/* Subscribers Directory */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E8E4DA]">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              Verified Newsletter Subscribers ({subscribers.length})
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Subscribed Timestamp</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAF9F5]">
                  <td className="py-3 px-4 font-medium text-[#1A1918]">{s.email}</td>
                  <td className="py-3 px-4 font-mono text-[#78716C]">
                    {new Date(s.subscribedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 font-semibold uppercase">
                      Subscribed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
