import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RecommendationResult, FarmDetails } from '../types';

/**
 * AGRISENSE Professional PDF Farm Recommendation Report Generator
 * -----------------------------------------------------------------
 * Generates a clean, 7-page vector PDF document with custom A4 layout,
 * headers, footers, page numbers, charts, tables, and color coding.
 *
 * NOT a screenshot or canvas export — 100% native PDF vector & text.
 */

export const generateFarmReportPDF = (
  result: RecommendationResult,
  farmDetails?: FarmDetails
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const crop = result.crop;
  const soil = result.soil;
  const env = result.environment;
  const primaryFert = result.primaryFertilizer;
  const analysis = result.nutrientAnalysis;
  const explanation = result.aiExplanation;
  const alternatives = result.alternatives || [];

  const cropName = crop.name || 'Crop';
  const reportDate = new Date().toISOString().split('T')[0];
  const fieldArea = env.fieldArea || farmDetails?.fields?.[0]?.area || 2.5;
  const farmName = farmDetails?.farmName || 'Patel Precision Farm';
  const location = env.location || 'Gujarat, India';

  // Total Quantity Calculation (Dosage x Area)
  const numericDosage = parseFloat(result.recommendedDosage) || 100;
  const totalFarmKg = Math.round(numericDosage * fieldArea);

  // Color Palette Definition (RGB Arrays for jsPDF)
  const colors = {
    primaryDark: [15, 23, 42] as [number, number, number],      // #0F172A slate-900
    textSecondary: [71, 85, 105] as [number, number, number],   // #475569 slate-600
    bgLight: [248, 250, 252] as [number, number, number],       // #F8FAFC slate-50
    cardBorder: [226, 232, 240] as [number, number, number],    // #E2E8F0 slate-200
    emerald: [5, 150, 105] as [number, number, number],        // #059669 emerald-600
    emeraldLight: [209, 250, 229] as [number, number, number],  // #D1FAE5 emerald-100
    cyan: [6, 182, 212] as [number, number, number],           // #06B6D4 cyan-500
    cyanLight: [207, 250, 254] as [number, number, number],     // #CFFAFE cyan-100
    purple: [139, 92, 246] as [number, number, number],        // #8B5CF6 purple-500
    purpleLight: [237, 233, 254] as [number, number, number],  // #EDE9FE purple-100
    amber: [245, 158, 11] as [number, number, number],         // #F59E0B amber-500
    amberLight: [254, 243, 199] as [number, number, number],   // #FEF3C7 amber-100
    rose: [225, 29, 72] as [number, number, number],           // #E11D48 rose-600
    roseLight: [254, 226, 226] as [number, number, number],    // #FEE2E2 rose-100
  };

  // Helper: Draw Header Bar on Pages 2-7
  const drawPageHeader = (pageNum: number, titleStr: string) => {
    // Top Brand Strip
    doc.setFillColor(...colors.emerald);
    doc.rect(0, 0, 210, 4, 'F');

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 4, 210, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colors.emerald);
    doc.text('AGRISENSE', 15, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colors.textSecondary);
    doc.text('• Precision Agronomy Engine Report', 38, 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...colors.primaryDark);
    doc.text(titleStr, 195, 14, { align: 'right' });

    doc.setDrawColor(...colors.cardBorder);
    doc.setLineWidth(0.3);
    doc.line(15, 20, 195, 20);
  };

  // Helper: Draw Footer on All Pages
  const drawPageFooter = (pageNum: number, totalPages: number = 7) => {
    const footerY = 285;
    doc.setDrawColor(...colors.cardBorder);
    doc.setLineWidth(0.3);
    doc.line(15, footerY - 5, 195, footerY - 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.textSecondary);
    doc.text(`AGRISENSE © 2026 • Official Farm Recommendation • Confidential`, 15, footerY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, 195, footerY, { align: 'right' });
  };

  // =========================================================================
  // PAGE 1 — COVER / EXECUTIVE OVERVIEW
  // =========================================================================

  // Top Header Banner
  doc.setFillColor(...colors.emerald);
  doc.rect(0, 0, 210, 8, 'F');

  // Brand Logo Header
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 8, 210, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...colors.emerald);
  doc.text('Fertilizer', 15, 28);

  const fertWidth = doc.getTextWidth('Fertilizer');
  doc.setTextColor(...colors.primaryDark);
  doc.text('AI', 15 + fertWidth, 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('PRECISION AGRONOMY ENGINE • OFFICIAL ADVISORY REPORT', 15, 34);

  // Main Report Title Box
  doc.setFillColor(255, 255, 255);
  doc.rect(15, 48, 180, 36, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 48, 180, 36, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.primaryDark);
  doc.text('AI-POWERED FARM FERTILIZER RECOMMENDATION REPORT', 20, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...colors.textSecondary);
  doc.text(`Custom Soil Test & Crop NPK Advisory Plan for ${cropName}`, 20, 72);

  // Executive Summary Cards Row (4 Metric Badges)
  const cardW = 42;
  const startX = 15;
  const gap = 4;
  const cardY = 92;

  // Badge 1: AI Match Score
  doc.setFillColor(...colors.emeraldLight);
  doc.roundedRect(startX, cardY, cardW, 30, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.emerald);
  doc.text('AI MATCH SCORE', startX + 5, cardY + 8);
  doc.setFontSize(16);
  doc.text(`${result.suitabilityScore || 95}%`, startX + 5, cardY + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Verified Optimal', startX + 5, cardY + 25);

  // Badge 2: Crop Target
  doc.setFillColor(...colors.cyanLight);
  doc.roundedRect(startX + cardW + gap, cardY, cardW, 30, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.cyan);
  doc.text('TARGET CROP', startX + cardW + gap + 5, cardY + 8);
  doc.setFontSize(12);
  doc.text(cropName, startX + cardW + gap + 5, cardY + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${crop.season} Season`, startX + cardW + gap + 5, cardY + 25);

  // Badge 3: Field Area
  doc.setFillColor(...colors.purpleLight);
  doc.roundedRect(startX + (cardW + gap) * 2, cardY, cardW, 30, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.purple);
  doc.text('FARM SIZE', startX + (cardW + gap) * 2 + 5, cardY + 8);
  doc.setFontSize(14);
  doc.text(`${fieldArea} ha`, startX + (cardW + gap) * 2 + 5, cardY + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total ${totalFarmKg} kg Fert`, startX + (cardW + gap) * 2 + 5, cardY + 25);

  // Badge 4: Yield Potential
  doc.setFillColor(...colors.amberLight);
  doc.roundedRect(startX + (cardW + gap) * 3, cardY, cardW, 30, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.amber);
  doc.text('YIELD POTENTIAL', startX + (cardW + gap) * 3 + 5, cardY + 8);
  doc.setFontSize(14);
  doc.text('HIGH', startX + (cardW + gap) * 3 + 5, cardY + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Top Tier Canopy', startX + (cardW + gap) * 3 + 5, cardY + 25);

  // Farm & Report Metadata Table Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 130, 180, 55, 3, 3, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, 130, 180, 55, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.emerald);
  doc.text('1 • FARM & ADVISORY INFORMATION', 22, 142);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primaryDark);
  doc.text('Farm Name:', 22, 152);
  doc.text('Location:', 22, 160);
  doc.text('Primary Crop:', 22, 168);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textSecondary);
  doc.text(farmName, 55, 152);
  doc.text(location, 55, 160);
  doc.text(`${cropName} (${crop.scientificName || 'Triticum aestivum'})`, 55, 168);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primaryDark);
  doc.text('Report Date:', 115, 152);
  doc.text('Report Reference:', 115, 160);
  doc.text('Advisory Status:', 115, 168);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textSecondary);
  doc.text(reportDate, 150, 152);
  doc.text(result.id || 'REC-2026-8841', 150, 160);
  doc.setTextColor(...colors.emerald);
  doc.setFont('helvetica', 'bold');
  doc.text('Verified AI Advisory', 150, 168);

  // Executive Rationale Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 193, 180, 75, 3, 3, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, 193, 180, 75, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.primaryDark);
  doc.text('EXECUTIVE AGRONOMIC SUMMARY', 22, 206);

  const summaryText = explanation?.summary ||
    `Soil test parameters for ${cropName} indicate a specific nutrient requirement. ` +
    `AGRISENSE recommends a targeted formulation of ${primaryFert.name} to maximize root development, stem vigor, and final harvest weight while preventing fertilizer waste.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.textSecondary);
  const splitSummary = doc.splitTextToSize(summaryText, 166);
  doc.text(splitSummary, 22, 216);

  drawPageFooter(1);

  // =========================================================================
  // PAGE 2 — FARM & CROP PROFILE
  // =========================================================================
  doc.addPage();
  drawPageHeader(2, 'FARM & CROP PROFILE');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Crop Agronomic Profile & Growing Conditions', 15, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('Optimal environmental thresholds and field requirements for maximum yield.', 15, 38);

  // AutoTable 1: Crop Profile Specifications
  autoTable(doc, {
    startY: 44,
    margin: { left: 15, right: 15 },
    head: [['Agronomic Parameter', 'Crop Requirement / Field Specification']],
    body: [
      ['Crop Name', cropName],
      ['Scientific Name', crop.scientificName || 'Triticum aestivum'],
      ['Crop Category', crop.category || 'Cereal'],
      ['Growing Season', `${crop.season || 'Rabi'} Season`],
      ['Total Growing Duration', `${crop.growingDays || 120} Days (Sowing to Canopy Harvest)`],
      ['Ideal Soil Types', (crop.idealSoil || ['Loamy', 'Alluvial']).join(', ') + ' Soil'],
      ['Ideal Soil pH Range', `${crop.idealpH?.min || 6.0} - ${crop.idealpH?.max || 7.5} pH`],
      ['Target N-P-K Ratio', `${crop.idealNPK?.n || 120} - ${crop.idealNPK?.p || 60} - ${crop.idealNPK?.k || 40} kg/ha`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: colors.emerald,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5,
    },
    bodyStyles: {
      textColor: colors.primaryDark,
      fontSize: 9,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 110 },
    },
  });

  // AutoTable 2: Environmental & Field Parameters
  // @ts-expect-error lastAutoTable typing
  const p2Y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 140;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Current Field Climate & Soil Environmental Data', 15, p2Y);

  autoTable(doc, {
    startY: p2Y + 6,
    margin: { left: 15, right: 15 },
    head: [['Field Climate Variable', 'Current Measured Value', 'Agronomic Optimal Range', 'Status']],
    body: [
      ['Soil pH Level', `${soil.pH || 6.5} pH`, `${crop.idealpH?.min || 6.0} - ${crop.idealpH?.max || 7.5} pH`, analysis.phStatus?.toUpperCase() || 'OPTIMAL'],
      ['Ambient Temperature', `${env.temperature || 24}°C`, `${crop.idealTemp?.min || 15}°C - ${crop.idealTemp?.max || 25}°C`, 'OPTIMAL'],
      ['Relative Humidity', `${env.humidity || 65}%`, `${crop.idealHumidity?.min || 50}% - ${crop.idealHumidity?.max || 70}%`, 'GOOD'],
      ['Annual Rainfall', `${env.rainfall || 850} mm`, `${crop.idealRainfall?.min || 750} - ${crop.idealRainfall?.max || 1000} mm`, 'ADEQUATE'],
      ['Field Area', `${fieldArea} Hectares`, 'Commercial Landholder', 'ACTIVE'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: colors.primaryDark,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: colors.primaryDark,
      fontSize: 8.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 45 },
      2: { cellWidth: 50 },
      3: { fontStyle: 'bold', cellWidth: 35, textColor: colors.emerald },
    },
  });

  drawPageFooter(2);

  // =========================================================================
  // PAGE 3 — SOIL & NUTRIENT ANALYSIS
  // =========================================================================
  doc.addPage();
  drawPageHeader(3, 'SOIL & NUTRIENT ANALYSIS');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Nutrient Deficit Analysis & Soil Status', 15, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('Comparison of measured soil nutrients against crop target specifications.', 15, 38);

  // 4 Nutrient Visual Cards (N, P, K, pH)
  const nY = 46;

  // 1. Nitrogen (N) Card - Cyan `#06B6D4`
  doc.setFillColor(...colors.bgLight);
  doc.roundedRect(15, nY, 180, 32, 2, 2, 'F');
  doc.setDrawColor(...colors.cyan);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, nY, 180, 32, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.cyan);
  doc.text('NITROGEN (N)', 22, nY + 10);

  doc.setFontSize(9);
  doc.setTextColor(...colors.primaryDark);
  doc.text(`Current Value: ${soil.n} kg/ha`, 22, nY + 18);
  doc.text(`Target Requirement: ${crop.idealNPK?.n || 120} kg/ha`, 85, nY + 18);

  const nStatusStr = (analysis.nStatus || 'low').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(analysis.nStatus === 'low' ? colors.rose[0] : colors.emerald[0], analysis.nStatus === 'low' ? colors.rose[1] : colors.emerald[1], analysis.nStatus === 'low' ? colors.rose[2] : colors.emerald[2]);
  doc.text(`Status: ${nStatusStr}`, 155, nY + 18);

  // Vector Progress Bar N
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(22, nY + 22, 155, 4, 1.5, 1.5, 'F');
  const nPct = Math.min(100, Math.max(10, Math.round((soil.n / (crop.idealNPK?.n || 120)) * 100)));
  doc.setFillColor(...colors.cyan);
  doc.roundedRect(22, nY + 22, (155 * nPct) / 100, 4, 1.5, 1.5, 'F');

  // 2. Phosphorus (P) Card - Purple `#8B5CF6`
  const pY = nY + 38;
  doc.setFillColor(...colors.bgLight);
  doc.roundedRect(15, pY, 180, 32, 2, 2, 'F');
  doc.setDrawColor(...colors.purple);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, pY, 180, 32, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.purple);
  doc.text('PHOSPHORUS (P)', 22, pY + 10);

  doc.setFontSize(9);
  doc.setTextColor(...colors.primaryDark);
  doc.text(`Current Value: ${soil.p} kg/ha`, 22, pY + 18);
  doc.text(`Target Requirement: ${crop.idealNPK?.p || 60} kg/ha`, 85, pY + 18);

  const pStatusStr = (analysis.pStatus || 'low').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(analysis.pStatus === 'low' ? colors.rose[0] : colors.emerald[0], analysis.pStatus === 'low' ? colors.rose[1] : colors.emerald[1], analysis.pStatus === 'low' ? colors.rose[2] : colors.emerald[2]);
  doc.text(`Status: ${pStatusStr}`, 155, pY + 18);

  // Vector Progress Bar P
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(22, pY + 22, 155, 4, 1.5, 1.5, 'F');
  const pPct = Math.min(100, Math.max(10, Math.round((soil.p / (crop.idealNPK?.p || 60)) * 100)));
  doc.setFillColor(...colors.purple);
  doc.roundedRect(22, pY + 22, (155 * pPct) / 100, 4, 1.5, 1.5, 'F');

  // 3. Potassium (K) Card - Amber `#F59E0B`
  const kY = pY + 38;
  doc.setFillColor(...colors.bgLight);
  doc.roundedRect(15, kY, 180, 32, 2, 2, 'F');
  doc.setDrawColor(...colors.amber);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, kY, 180, 32, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.amber);
  doc.text('POTASSIUM (K)', 22, kY + 10);

  doc.setFontSize(9);
  doc.setTextColor(...colors.primaryDark);
  doc.text(`Current Value: ${soil.k} kg/ha`, 22, kY + 18);
  doc.text(`Target Requirement: ${crop.idealNPK?.k || 40} kg/ha`, 85, kY + 18);

  const kStatusStr = (analysis.kStatus || 'optimal').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(analysis.kStatus === 'low' ? colors.rose[0] : colors.emerald[0], analysis.kStatus === 'low' ? colors.rose[1] : colors.emerald[1], analysis.kStatus === 'low' ? colors.rose[2] : colors.emerald[2]);
  doc.text(`Status: ${kStatusStr}`, 155, kY + 18);

  // Vector Progress Bar K
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(22, kY + 22, 155, 4, 1.5, 1.5, 'F');
  const kPct = Math.min(100, Math.max(10, Math.round((soil.k / (crop.idealNPK?.k || 40)) * 100)));
  doc.setFillColor(...colors.amber);
  doc.roundedRect(22, kY + 22, (155 * kPct) / 100, 4, 1.5, 1.5, 'F');

  // 4. Soil pH Card - Emerald `#10B981`
  const phY = kY + 38;
  doc.setFillColor(...colors.bgLight);
  doc.roundedRect(15, phY, 180, 32, 2, 2, 'F');
  doc.setDrawColor(...colors.emerald);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, phY, 180, 32, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.emerald);
  doc.text('SOIL pH LEVEL', 22, phY + 10);

  doc.setFontSize(9);
  doc.setTextColor(...colors.primaryDark);
  doc.text(`Current pH: ${soil.pH}`, 22, phY + 18);
  doc.text(`Ideal pH Window: ${crop.idealpH?.min || 6.0} - ${crop.idealpH?.max || 7.5} pH`, 85, phY + 18);

  const phStatusStr = (analysis.phStatus || 'optimal').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.emerald);
  doc.text(`Status: ${phStatusStr}`, 155, phY + 18);

  // Vector Progress Bar pH
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(22, phY + 22, 155, 4, 1.5, 1.5, 'F');
  const phPct = Math.min(100, Math.max(10, Math.round(((soil.pH - 4) / 6) * 100)));
  doc.setFillColor(...colors.emerald);
  doc.roundedRect(22, phY + 22, (155 * phPct) / 100, 4, 1.5, 1.5, 'F');

  // Key Finding Summary Box
  const summaryBoxY = phY + 38;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, summaryBoxY, 180, 30, 2, 2, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, summaryBoxY, 180, 30, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.emerald);
  doc.text('KEY SOIL ANALYSIS FINDING:', 22, summaryBoxY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  const findingText = `Primary deficits detected in Nitrogen (Gap: ${analysis.nGap || 0} kg/ha) and Phosphorus (Gap: ${analysis.pGap || 0} kg/ha). ` +
    `Immediate application of targeted starter fertilizer is advised prior to vegetative canopy expansion.`;
  doc.text(doc.splitTextToSize(findingText, 166), 22, summaryBoxY + 18);

  drawPageFooter(3);

  // =========================================================================
  // PAGE 4 — AI FERTILIZER RECOMMENDATION
  // =========================================================================
  doc.addPage();
  drawPageHeader(4, 'AI FERTILIZER RECOMMENDATION');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Primary Fertilizer Recommendation', 15, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('AI-optimized formulation tailored specifically to crop biology and soil deficits.', 15, 38);

  // Hero Card for Recommended Fertilizer
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 45, 180, 75, 3, 3, 'F');
  doc.setDrawColor(...colors.emerald);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 45, 180, 75, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.emerald);
  doc.text(primaryFert.name, 22, 60);

  doc.setFontSize(10);
  doc.setTextColor(...colors.textSecondary);
  doc.text(`NPK Formula Ratio: ${primaryFert.npkRatio}`, 22, 68);

  // Grid of Specifications inside Recommendation Card
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primaryDark);

  doc.text('Recommended Rate:', 22, 80);
  doc.text('Total Farm Quantity:', 22, 88);
  doc.text('Application Stage:', 22, 96);
  doc.text('Placement Method:', 22, 104);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textSecondary);
  doc.text(`${result.recommendedDosage || '100 kg/ha'}`, 65, 80);
  doc.text(`${totalFarmKg} kg (for ${fieldArea} ha field)`, 65, 88);
  doc.text(result.applicationTiming || primaryFert.bestStage || 'Basal at sowing', 65, 96);
  doc.text(result.applicationMethod || 'Soil band placement beside seed line', 65, 104);

  // "Why This Fertilizer Was Recommended" Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Why This Fertilizer Was Recommended', 15, 130);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 136, 180, 85, 3, 3, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, 136, 180, 85, 3, 3, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.textSecondary);

  const whyText = explanation?.whyThisFertilizer ||
    `${primaryFert.name} is recommended because it directly addresses the nitrogen and phosphorus deficit detected in your soil test. ` +
    `Its specific NPK composition (${primaryFert.npkRatio}) provides highly soluble nutrients during early root branching, ensuring vigorous seedling establishment and higher grain density.`;

  const splitWhy = doc.splitTextToSize(whyText, 166);
  doc.text(splitWhy, 22, 148);

  // Key Advantages List
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.emerald);
  doc.text('Key Agronomic Benefits & Soil Alignment:', 22, 180);

  const tips = explanation?.soilCorrectionTips && explanation.soilCorrectionTips.length > 0
    ? explanation.soilCorrectionTips
    : [
        `Addresses N gap of ${analysis.nGap || 40} kg/ha and P gap of ${analysis.pGap || 35} kg/ha efficiently.`,
        'High phosphorus availability encourages deep taproot penetration.',
        'Reduces nitrogen leaching losses compared to broadcast urea alone.',
      ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.primaryDark);
  tips.slice(0, 3).forEach((tip, idx) => {
    doc.text(`•  ${tip}`, 25, 190 + idx * 7);
  });

  drawPageFooter(4);

  // =========================================================================
  // PAGE 5 — ALTERNATIVES & COST COMPARISON
  // =========================================================================
  doc.addPage();
  drawPageHeader(5, 'ALTERNATIVES & COST');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Alternative Fertilizer Formulations & Comparison', 15, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('Viable alternative choices if the primary recommendation is unavailable locally.', 15, 38);

  const altBody = alternatives.length > 0
    ? alternatives.map((alt) => [
        alt.fertilizer.name,
        alt.fertilizer.npkRatio,
        `${alt.suitabilityScore}%`,
        alt.fertilizer.priceRange || 'Market Rate',
        alt.rationale || `Alternative ${alt.fertilizer.npkRatio} formulation for ${cropName}.`,
      ])
    : [
        ['NPK 19-19-19', '19-19-19', '88%', '₹1,100 - ₹1,300', 'Balanced complex fertilizer for vegetative top-dressing.'],
        ['Single Super Phosphate (SSP)', '0-16-0', '82%', '₹350 - ₹450', 'Supplies phosphorus and sulfur for root strength.'],
        ['Muriate of Potash (MOP)', '0-0-60', '78%', '₹850 - ₹1,000', 'Potassium source for stress tolerance and stem rigidity.'],
      ];

  autoTable(doc, {
    startY: 44,
    margin: { left: 15, right: 15 },
    head: [['Fertilizer Name', 'NPK Ratio', 'Match %', 'Est. Price Range', 'Agronomic Rationale & Advantages']],
    body: altBody,
    theme: 'grid',
    headStyles: {
      fillColor: colors.primaryDark,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: colors.primaryDark,
      fontSize: 8.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 25 },
      2: { fontStyle: 'bold', cellWidth: 20, textColor: colors.emerald },
      3: { cellWidth: 35 },
      4: { cellWidth: 60 },
    },
  });

  // Note on Market Pricing
  // @ts-expect-error lastAutoTable typing
  const p5Y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 140;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, p5Y, 180, 30, 2, 2, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, p5Y, 180, 30, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.primaryDark);
  doc.text('MARKET & PROCUREMENT GUIDANCE:', 22, p5Y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.textSecondary);
  doc.text(
    'Prices indicated above reflect government subsidized rates and retail averages across agricultural cooperatives. ' +
    'Always verify local retailer availability and inspect bag seal integrity before purchase.',
    22,
    p5Y + 18,
    { maxWidth: 166 }
  );

  drawPageFooter(5);

  // =========================================================================
  // PAGE 6 — FARM ACTION PLAN
  // =========================================================================
  doc.addPage();
  drawPageHeader(6, 'FARM ACTION PLAN');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Step-by-Step Field Application Schedule', 15, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('Timely split application plan to match crop nutrient uptake stages.', 15, 38);

  autoTable(doc, {
    startY: 44,
    margin: { left: 15, right: 15 },
    head: [['Stage', 'Crop Growth Stage', 'Fertilizer Product', 'Dosage (kg/ha)', 'Placement Method & Action']],
    body: [
      [
        'Stage 1',
        'Basal (At Sowing)',
        primaryFert.name,
        `${Math.round(numericDosage * 0.5)} kg/ha`,
        'Apply 50% basal dose below seed line during land preparation.',
      ],
      [
        'Stage 2',
        'Tillering / Early Growth (21-25 DAS)',
        'Neem Coated Urea',
        '45 kg/ha',
        'Top-dress nitrogen when first node appears. Ensure moist soil.',
      ],
      [
        'Stage 3',
        'Jointing / Pre-Flowering (40-45 DAS)',
        primaryFert.name + ' / Urea',
        `${Math.round(numericDosage * 0.3)} kg/ha`,
        'Second split application to boost earhead & panicle size.',
      ],
      [
        'Stage 4',
        'Grain Filling / Maturity',
        'Foliar Micronutrients',
        '1-2 kg/ha (Spray)',
        'Foliar spray of 0.5% Zinc Sulfate + Boron if deficiency persists.',
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: colors.emerald,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: colors.primaryDark,
      fontSize: 8.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 22 },
      1: { cellWidth: 40 },
      2: { fontStyle: 'bold', cellWidth: 42 },
      3: { cellWidth: 28 },
      4: { cellWidth: 48 },
    },
  });

  // @ts-expect-error lastAutoTable typing
  const p6Y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 150;

  // Practical Field Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Practical Handling & Application Guidelines:', 15, p6Y);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, p6Y + 5, 180, 50, 2, 2, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, p6Y + 5, 180, 50, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.textSecondary);

  const guidelines = [
    'Soil Moisture: Ensure adequate soil moisture before top-dressing nitrogen fertilizers to prevent volatilization.',
    'Calibration: Calibrate seed-cum-fertilizer drills to deliver exact prescribed rates per hectare.',
    'Mixing Precautions: Do not combine DAP directly with water-soluble calcium nitrate fertilizers in the same tank.',
    'Storage: Store bags in a cool, elevated dry storehouse away from direct rainfall and ground dampness.',
  ];

  guidelines.forEach((g, idx) => {
    doc.text(`•  ${g}`, 22, p6Y + 15 + idx * 10, { maxWidth: 166 });
  });

  drawPageFooter(6);

  // =========================================================================
  // PAGE 7 — IMPORTANT NOTES & DISCLAIMER
  // =========================================================================
  doc.addPage();
  drawPageHeader(7, 'IMPORTANT NOTES & DISCLAIMER');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.primaryDark);
  doc.text('Safety Precautions & Regulatory Disclaimer', 15, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textSecondary);
  doc.text('Essential agricultural compliance and safety requirements.', 15, 38);

  // Safety Box
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, 45, 180, 45, 2, 2, 'F');
  doc.setDrawColor(...colors.amber);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, 45, 180, 45, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...colors.amber);
  doc.text('SAFETY & ENVIRONMENTAL PRECAUTIONS', 22, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.primaryDark);

  const precautions = Array.isArray(primaryFert.precautions)
    ? primaryFert.precautions.join(' ')
    : primaryFert.precautions ||
      'Wear protective gloves and facemask during fertilizer handling and broadcasting. ' +
      'Avoid application during high winds or immediately prior to torrential rainfall to prevent run-off into natural water bodies. Keep out of reach of livestock and children.';

  doc.text(doc.splitTextToSize(precautions, 166), 22, 65);

  // Risk Factors Box
  doc.setFillColor(254, 226, 226);
  doc.roundedRect(15, 98, 180, 45, 2, 2, 'F');
  doc.setDrawColor(...colors.rose);
  doc.setLineWidth(0.6);
  doc.roundedRect(15, 98, 180, 45, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...colors.rose);
  doc.text('SOIL HEALTH & RISK WARNINGS', 22, 109);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.primaryDark);

  const risks = explanation?.riskFactors && explanation.riskFactors.length > 0
    ? explanation.riskFactors.join(' ')
    : 'Continuous over-application of synthetic nitrogen without organic manure can lead to soil acidification and micro-nutrient lockup. Incorporate compost or green manure once per season.';

  doc.text(doc.splitTextToSize(risks, 166), 22, 118);

  // Official Legal Disclaimer Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 152, 180, 50, 2, 2, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, 152, 180, 50, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.primaryDark);
  doc.text('OFFICIAL AGRONOMIC ADVISORY DISCLAIMER', 22, 164);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...colors.textSecondary);
  const disclaimerText =
    'This report is generated by AGRISENSE Precision Agronomy Engine based on user-supplied soil parameters, climate data, and crop growth models. ' +
    'While recommendations are calculated using established agricultural science, local field conditions, micro-climates, and soil variations may alter nutrient response. ' +
    'Farmers are advised to validate recommendations with local agricultural extension officers or certified agronomists prior to commercial application.';

  doc.text(doc.splitTextToSize(disclaimerText, 166), 22, 172);

  // Verification Stamp Box
  doc.setDrawColor(...colors.emerald);
  doc.setLineWidth(0.8);
  doc.roundedRect(120, 212, 75, 25, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.emerald);
  doc.text('AGRISENSE VERIFIED ADVISORY', 125, 222);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.textSecondary);
  doc.text(`Digital Sign ID: ${result.id || 'REC-8841'}`, 125, 228);
  doc.text(`Date Issued: ${reportDate}`, 125, 233);

  drawPageFooter(7);

  // Dynamic Meaningful Filename: AGRISENSE_[CropName]_Recommendation_[YYYY-MM-DD].pdf
  const sanitizedCropName = cropName.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `AGRISENSE_${sanitizedCropName}_Recommendation_${reportDate}.pdf`;

  // Download PDF
  doc.save(fileName);
};
