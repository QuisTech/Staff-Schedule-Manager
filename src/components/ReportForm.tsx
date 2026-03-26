import { useState, FormEvent } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ReportForm() {
  const [formData, setFormData] = useState({ reportType: 'activity', who: '', what: '', when: '', where: '', latitude: '', longitude: '', why: '', how: '', imageUrl: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    await addDoc(collection(db, 'reports'), {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      authorUid: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
    });
    setFormData({ reportType: 'activity', who: '', what: '', when: '', where: '', latitude: '', longitude: '', why: '', how: '', imageUrl: '' });
    alert('Report submitted!');
  };

  const fields: { name: 'who' | 'what' | 'when' | 'where' | 'latitude' | 'longitude' | 'why' | 'how' | 'imageUrl', label: string, type?: string }[] = [
    { name: 'who', label: 'Who (Involved)' },
    { name: 'what', label: 'What (Incident/Activity)' },
    { name: 'when', label: 'When (Timestamp)', type: 'datetime-local' },
    { name: 'where', label: 'Where (Zone/Location)' },
    { name: 'latitude', label: 'Latitude', type: 'number' },
    { name: 'longitude', label: 'Longitude', type: 'number' },
    { name: 'why', label: 'Why (Context)' },
    { name: 'how', label: 'How (Methodology)' },
    { name: 'imageUrl', label: 'Image URL (Optional)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 border border-zinc-200 rounded-xl shadow-sm space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Report Type</label>
        <select value={formData.reportType} onChange={e => setFormData({...formData, reportType: e.target.value})} className="w-full p-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900">
          <option value="activity">Activity Report</option>
          <option value="incident">Incident Report</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {fields.map(field => (
          <div key={field.name} className={field.name === 'what' || field.name === 'why' || field.name === 'how' ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-zinc-700 mb-2">{field.label}</label>
            <input 
              required={field.name !== 'imageUrl'}
              type={field.type || 'text'}
              placeholder={field.label} 
              value={formData[field.name]} 
              onChange={e => setFormData({...formData, [field.name]: e.target.value})} 
              className="w-full p-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900" 
            />
          </div>
        ))}
      </div>
      <button type="submit" className="w-full bg-zinc-900 text-white py-3 rounded-lg font-semibold hover:bg-zinc-800 transition-colors">Submit Report</button>
    </form>
  );
}
