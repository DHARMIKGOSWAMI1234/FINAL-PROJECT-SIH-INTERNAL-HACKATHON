import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface SoilRadarChartProps {
  n: number;
  p: number;
  k: number;
  ph: number;
  targetN: number;
  targetP: number;
  targetK: number;
}

export const SoilRadarChart: React.FC<SoilRadarChartProps> = ({
  n,
  p,
  k,
  ph,
  targetN,
  targetP,
  targetK,
}) => {
  const { isDark } = useTheme();

  // Normalize metrics on a 0-100 scale for radar visualization
  const data = [
    { subject: 'Nitrogen (N)', Current: Math.min(100, Math.round((n / targetN) * 100)), Ideal: 100 },
    { subject: 'Phosphorus (P)', Current: Math.min(100, Math.round((p / targetP) * 100)), Ideal: 100 },
    { subject: 'Potassium (K)', Current: Math.min(100, Math.round((k / targetK) * 100)), Ideal: 100 },
    { subject: 'pH Balance', Current: Math.min(100, Math.round((ph / 6.8) * 100)), Ideal: 100 },
    { subject: 'Micro-Fauna', Current: 85, Ideal: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke={isDark ? '#1e293b' : '#e2e8f0'} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 11 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Soil Current %" dataKey="Current" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
          <Radar name="Optimal Target" dataKey="Ideal" stroke="#84cc16" fill="#84cc16" fillOpacity={0.15} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0b1710' : '#ffffff',
              borderColor: isDark ? '#10b981' : '#cbd5e1',
              borderRadius: '12px',
              color: isDark ? '#ffffff' : '#000000',
              fontSize: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
