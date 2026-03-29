import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Save, Trash2, PlusCircle, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  getAllConfiguredRedCircles,
  upsertRedCircle,
  removeRedCircle,
  resetRedCirclesToDefault
} from '../utils/redCircleStore';

const emptyZone = {
  id: '',
  name: '',
  reason: '',
  latitude: 20.5937,
  longitude: 78.9629,
  radiusMeters: 180,
  nearestPoliceSubstation: '',
  active: true
};

const AdminRedCircles = () => {
  const { isDark } = useTheme();
  const [zones, setZones] = useState(() => getAllConfiguredRedCircles());
  const [draft, setDraft] = useState(emptyZone);
  const [editingId, setEditingId] = useState(null);

  const sortedZones = useMemo(() => {
    return [...zones].sort((a, b) => a.name.localeCompare(b.name));
  }, [zones]);

  const handleSave = () => {
    if (!draft.name.trim() || !draft.reason.trim() || !draft.nearestPoliceSubstation.trim()) {
      alert('Please fill zone name, reason, and nearest police substation.');
      return;
    }

    const id = editingId || `zone-${Date.now()}`;
    const zoneToSave = {
      ...draft,
      id,
      latitude: Number(draft.latitude),
      longitude: Number(draft.longitude),
      radiusMeters: Number(draft.radiusMeters)
    };

    const updated = upsertRedCircle(zoneToSave);
    setZones(updated);
    setDraft(emptyZone);
    setEditingId(null);
  };

  const handleEdit = (zone) => {
    setDraft(zone);
    setEditingId(zone.id);
  };

  const handleDelete = (zoneId) => {
    const updated = removeRedCircle(zoneId);
    setZones(updated);
    if (editingId === zoneId) {
      setDraft(emptyZone);
      setEditingId(null);
    }
  };

  const handleReset = () => {
    const updated = resetRedCirclesToDefault();
    setZones(updated);
    setDraft(emptyZone);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Red Circle Geofence Admin
        </h1>
        <p className={isDark ? 'text-gray-400 mt-2' : 'text-slate-600 mt-2'}>
          Create and manage restricted circles across India with radius and nearest substation.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 glass-card">
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {editingId ? 'Edit Red Circle' : 'Add Red Circle'}
          </h2>

          <div className="space-y-3">
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Zone name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900"
            />
            <input
              value={draft.reason}
              onChange={(e) => setDraft((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Reason"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={draft.latitude}
                onChange={(e) => setDraft((prev) => ({ ...prev, latitude: e.target.value }))}
                placeholder="Latitude"
                className="rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900"
              />
              <input
                type="number"
                value={draft.longitude}
                onChange={(e) => setDraft((prev) => ({ ...prev, longitude: e.target.value }))}
                placeholder="Longitude"
                className="rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900"
              />
            </div>
            <input
              type="number"
              value={draft.radiusMeters}
              onChange={(e) => setDraft((prev) => ({ ...prev, radiusMeters: e.target.value }))}
              placeholder="Radius in meters"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900"
            />
            <input
              value={draft.nearestPoliceSubstation}
              onChange={(e) => setDraft((prev) => ({ ...prev, nearestPoliceSubstation: e.target.value }))}
              placeholder="Nearest police substation"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900"
            />

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft((prev) => ({ ...prev, active: e.target.checked }))}
              />
              Active zone
            </label>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 rounded-lg bg-blue-800 text-white px-3 py-2 font-medium flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={() => {
                  setDraft(emptyZone);
                  setEditingId(null);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700"
              >
                <PlusCircle size={16} />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full rounded-lg border border-orange-300 text-orange-700 px-3 py-2 font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Reset to India Defaults
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 glass-card">
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Configured Red Circles ({sortedZones.length})
          </h2>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {sortedZones.map((zone) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className={zone.active ? 'text-red-600' : 'text-slate-400'} />
                      <h3 className="font-semibold text-slate-900">{zone.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{zone.reason}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {zone.latitude}, {zone.longitude} | Radius: {zone.radiusMeters}m | {zone.nearestPoliceSubstation}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(zone.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRedCircles;
