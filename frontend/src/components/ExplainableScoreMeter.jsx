import React from 'react';

const ExplainableScoreMeter = ({ scores }) => {
  const {
    budgetScore = 90,
    locationScore = 85,
    lifestyleScore = 88,
    amenitiesScore = 92,
    safetyScore = 95,
  } = scores || {};

  const metrics = [
    { label: 'Budget Fit', value: budgetScore, color: 'bg-emerald-500' },
    { label: 'Location Match', value: locationScore, color: 'bg-blue-500' },
    { label: 'Lifestyle & Vibe', value: lifestyleScore, color: 'bg-purple-500' },
    { label: 'Amenities Suite', value: amenitiesScore, color: 'bg-amber-500' },
    { label: 'Safety & Transit', value: safetyScore, color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          AI Explainability Breakdown
        </span>
        <span className="text-xs text-slate-400 font-medium">Algorithmic Weighting</span>
      </div>

      <div className="space-y-2.5">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>{m.label}</span>
              <span className="font-semibold text-slate-900">{m.value}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplainableScoreMeter;
