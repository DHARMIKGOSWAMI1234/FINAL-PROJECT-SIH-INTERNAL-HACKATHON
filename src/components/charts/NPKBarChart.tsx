import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface NPKBarChartProps {
  targetNPK: { n: number; p: number; k: number };
  currentNPK: { n: number; p: number; k: number };
}

export const NPKBarChart: React.FC<NPKBarChartProps> = ({ targetNPK, currentNPK }) => {
  const { isDark } = useTheme();

  const data = [
    { name: 'Nitrogen (N)', Target: targetNPK.n, Current: currentNPK.n },
    { name: 'Phosphorus (P)', Target: targetNPK.p, Current: currentNPK.p },
    { name: 'Potassium (K)', Target: targetNPK.k, Current: currentNPK.k },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 12 }}
            stroke={isDark ? '#334155' : '#cbd5e1'}
          />
          <YAxis
            tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 11 }}
            stroke={isDark ? '#334155' : '#cbd5e1'}
            unit=" kg"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0b1710' : '#ffffff',
              borderColor: isDark ? '#10b981' : '#cbd5e1',
              borderRadius: '12px',
              color: isDark ? '#ffffff' : '#000000',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="Target" fill="#10b981" radius={[6, 6, 0, 0]} name="Required (kg/ha)" />
          <Bar dataKey="Current" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Soil Test (kg/ha)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
