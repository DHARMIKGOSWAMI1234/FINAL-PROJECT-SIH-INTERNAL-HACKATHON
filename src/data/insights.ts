import { LanguageCode } from '../types';

export type InsightCategory =
  | 'soil-npk'
  | 'crop-management'
  | 'fertilizers'
  | 'weather-irrigation'
  | 'sustainable-farming'
  | 'farmer-tips';

export interface LocalizedString {
  en: string;
  hi: string;
  gu: string;
}

export interface LocalizedStringList {
  en: string[];
  hi: string[];
  gu: string[];
}

export interface LocalizedInsightSection {
  heading: LocalizedString;
  content: LocalizedStringList;
  listItems?: LocalizedStringList;
}

export interface InsightArticle {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  category: InsightCategory;
  readTimeMinutes: number;
  image: string;
  author: string;
  authorRole: LocalizedString;
  publishedDate: LocalizedString;
  featured?: boolean;
  introduction: LocalizedString;
  sections: LocalizedInsightSection[];
  practicalTips: LocalizedStringList;
  keyTakeaways: LocalizedStringList;
  relatedArticleIds: string[];
}

export interface FarmerTip {
  id: string;
  tip: LocalizedString;
  categoryType: InsightCategory;
  explanation: LocalizedString;
}

export interface DisplayArticle {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  categoryLabel: string;
  readTime: string;
  readTimeMinutes: number;
  image: string;
  author: string;
  authorRole: string;
  publishedDate: string;
  featured?: boolean;
  introduction: string;
  sections: Array<{
    heading: string;
    content: string[];
    listItems?: string[];
  }>;
  practicalTips: string[];
  keyTakeaways: string[];
  relatedArticleIds: string[];
}

export interface DisplayFarmerTip {
  id: string;
  tip: string;
  category: string;
  categoryType: InsightCategory;
  explanation: string;
}

export const QUICK_FARMER_TIPS: FarmerTip[] = [
  {
    id: 'tip-1',
    tip: {
      en: 'Test soil before making major fertilizer changes.',
      hi: 'उर्वरक में बड़े बदलाव करने से पहले मिट्टी का परीक्षण जरूर करें।',
      gu: 'ખાતરમાં મોટા ફેરફારો કરતા પહેલાં જમીન ચકાસણી ચોક્કસ કરો.',
    },
    categoryType: 'soil-npk',
    explanation: {
      en: 'A lab or sensor soil test prevents wasteful over-application of nutrients your soil already contains in surplus.',
      hi: 'प्रयोगशाला या सेंसर परीक्षण से उन पोषक तत्वों के अनावश्यक छिड़काव से बचा जा सकता है जो मिट्टी में पहले से मौजूद हैं।',
      gu: 'લેબ અથવા સેન્સર પરીક્ષણથી જમીનમાં પહેલેથી હાજર હોય તેવા પોષક તત્વોના બિનજરૂરી વપરાશથી બચી શકાય છે.',
    },
  },
  {
    id: 'tip-2',
    tip: {
      en: 'Avoid fertilizer application immediately before heavy rainfall.',
      hi: 'भारी बारिश से ठीक पहले रासायनिक उर्वरक डालने से बचें।',
      gu: 'ભારે વરસાદની આગાહી હોય ત્યારે તરત જ ખાતર આપવાનું ટાળો.',
    },
    categoryType: 'weather-irrigation',
    explanation: {
      en: 'High rainfall causes rapid runoff and leaching of nitrates, wasting 40–60% of your applied input.',
      hi: 'अधिक बारिश से पोषक तत्व बह जाते हैं और जमीन में गहरे चले जाते हैं, जिससे 40-60% उर्वरक बर्बाद हो जाता है।',
      gu: 'વધુ વરસાદથી નાઇટ્રેટ્સ ધોવાઈ જાય છે અને જમીનમાં ઊંડે ઉતરી જાય છે, જેથી 40-60% ખાતર વેડફાઈ જાય છે.',
    },
  },
  {
    id: 'tip-3',
    tip: {
      en: 'Monitor soil pH regularly to prevent nutrient lockout.',
      hi: 'पोषक तत्वों के लॉकआउट को रोकने के लिए नियमित रूप से मिट्टी के pH की निगरानी करें।',
      gu: 'પોષક તત્વો બ્લોક ન થાય તે માટે નિયમિતપણે જમીનનું pH તપાસો.',
    },
    categoryType: 'soil-npk',
    explanation: {
      en: 'Nutrient availability drops significantly outside the 6.2–7.2 pH range due to chemical precipitation.',
      hi: '6.2 से 7.2 pH सीमा से बाहर होने पर रासायनिक प्रतिक्रिया के कारण पौधे पोषक तत्वों को ग्रहण नहीं कर पाते।',
      gu: '6.2 થી 7.2 pH રેન્જ બહાર જમીનમાં રાસાયણિક પ્રક્રિયાને લીધે પાક ખાતર ગ્રહણ કરી શકતો નથી.',
    },
  },
  {
    id: 'tip-4',
    tip: {
      en: 'Use crop growth stage when planning nutrient application.',
      hi: 'पोषक तत्वों की खुराक की योजना बनाते समय फसल की वृद्धि अवस्था का ध्यान रखें।',
      gu: 'ખાતર આપવાનું આયોજન કરતી વખતે પાકના વિકાસના તબક્કાને ધ્યાનમાં લો.',
    },
    categoryType: 'fertilizers',
    explanation: {
      en: 'Splitting Nitrogen doses between basal sowing, vegetative tillering, and panicle initiation increases uptake efficiency by 35%.',
      hi: 'बुवाई, कल्ले फूटने और बाली आने के समय नाइट्रोजन को विभाजित करके देने से उपयोग क्षमता 35% बढ़ जाती है।',
      gu: 'વાવણી, ફૂટ અને કંકી બેસવાના સમયે નાઇટ્રોજનનો ડોઝ વહેંચીને આપવાથી 35% વધુ ફાયદો થાય છે.',
    },
  },
  {
    id: 'tip-5',
    tip: {
      en: 'Avoid excessive nitrogen application.',
      hi: 'अत्यधिक नाइट्रोजन (यूरिया) के प्रयोग से हमेशा बचें।',
      gu: 'વધુ પડતો નાઇટ્રોજન (યુરિયા) આપવાનું હંમેશાં ટાળો.',
    },
    categoryType: 'sustainable-farming',
    explanation: {
      en: 'Surplus nitrogen promotes excessive leaf foliage at the expense of grain formation and attracts sucking pests.',
      hi: 'अत्यधिक नाइट्रोजन से केवल पत्तियां बढ़ती हैं, दाना कमजोर होता है और कीटों का प्रकोप बढ़ जाता है।',
      gu: 'વધારાના નાઇટ્રોજનથી પાનમાં નકામી વૃદ્ધિ થાય છે, દાણો નબળો રહે છે અને ચૂસિયા જીવાતો વધે છે.',
    },
  },
  {
    id: 'tip-6',
    tip: {
      en: 'Maintain adequate soil moisture without waterlogging.',
      hi: 'जलभराव किए बिना मिट्टी में पर्याप्त नमी बनाए रखें।',
      gu: 'પાણી ભરાઈ ન રહે તે રીતે જમીનમાં યોગ્ય ભેજ જાળવી રાખો.',
    },
    categoryType: 'crop-management',
    explanation: {
      en: 'Plant roots absorb dissolved ions through soil water solution; dry soil halts nutrient mobility while waterlogging suffocates root respiration.',
      hi: 'जड़ें पानी में घुले पोषक तत्व ही सोखती हैं; सूखी मिट्टी में पोषण रुक जाता है और जलभराव से जड़ें सड़ने लगती हैं।',
      gu: 'મૂળિયાં પાણીમાં ઓગળેલા તત્વો જ શોષે છે; સૂકી જમીનમાં પોષણ અટકે છે અને પાણી ભરાવાથી મૂળિયાં શ્વાસ લઈ શકતા નથી.',
    },
  },
];

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: 'precision-soil-management',
    title: {
      en: 'Precision Soil Management: The Complete Agronomy Guide',
      hi: 'सटीक मृदा प्रबंधन: संपूर्ण कृषि विज्ञान गाइड',
      gu: 'સચોટ જમીન વ્યવસ્થાપન: સંપૂર્ણ કૃષિ વિજ્ઞાન માર્ગદર્શિકા',
    },
    description: {
      en: 'Understand soil chemistry, nutrient balance, pH, and moisture to make data-driven fertilizer decisions for maximum yield.',
      hi: 'अधिकतम उपज के लिए मिट्टी के रसायन विज्ञान, पोषक तत्व संतुलन, pH और नमी को समझकर डेटा-आधारित उर्वरक निर्णय लें।',
      gu: 'મહત્તમ ઉપજ મેળવવા માટે જમીન રસાયણશાસ્ત્ર, પોષક તત્વોનું સંતુલન, pH અને ભેજ સમજીને ડેટા આધારિત ખાતરનો નિર્ણય લો.',
    },
    category: 'soil-npk',
    readTimeMinutes: 7,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    author: 'Dr. Ramesh Agronomist',
    authorRole: {
      en: 'Senior Soil Chemist & Precision Agronomy Specialist',
      hi: 'वरिष्ठ मृदा रसायनज्ञ एवं सटीक कृषि विशेषज्ञ',
      gu: 'સિનિયર સોઈલ કેમિસ્ટ અને પ્રિસિઝન એગ્રોનોમી નિષ્ણાત',
    },
    publishedDate: {
      en: 'August 18, 2026',
      hi: '18 अगस्त, 2026',
      gu: '18 ઓગસ્ટ, 2026',
    },
    featured: true,
    introduction: {
      en: 'Precision soil management is the cornerstone of modern agricultural profitability. By understanding the chemical interplay between soil pH, moisture dynamics, and cation exchange capacity (CEC), farmers can eliminate guesswork, cut input costs by up to 35%, and sustain multi-year soil fertility.',
      hi: 'सटीक मृदा प्रबंधन आधुनिक कृषि में लाभ कमाने की आधारशिला है। मिट्टी के pH, नमी की स्थिति और धनायन विनिमय क्षमता (CEC) के रासायनिक प्रभाव को समझकर किसान अनुमान लगाने की आदत छोड़ सकते हैं, लागत में 35% तक की कमी कर सकते हैं और मिट्टी की उर्वरता बनाए रख सकते हैं।',
      gu: 'સચોટ જમીન વ્યવસ્થાપન આધુનિક ખેતીમાં નફો મેળવવાનો પાયો છે. જમીનનું pH, ભેજ અને પોષક તત્વો જાળવવાની ક્ષમતા (CEC) સમજીને ખેડૂતો અંદાજિત ખેતી બંધ કરી શકે છે, ખર્ચમાં 35% સુધીનો ઘટાડો કરી શકે છે અને ફળદ્રુપતા લાંબો સમય જાળવી શકે છે.',
    },
    sections: [
      {
        heading: {
          en: '1. The Four Pillars of Precision Soil Chemistry',
          hi: '1. सटीक मृदा रसायन विज्ञान के चार मुख्य स्तंभ',
          gu: '1. સચોટ જમીન રસાયણશાસ્ત્રના ચાર મુખ્ય સ્તંભો',
        },
        content: {
          en: [
            'Soil is not an inert sponge; it is a live biological and electrochemical medium. Precision agronomy analyzes four primary physical and chemical vectors before determining input dosages:',
          ],
          hi: [
            'मिट्टी कोई निर्जीव वस्तु नहीं है, बल्कि एक सजीव जैविक और विद्युत-रासायनिक माध्यम है। उर्वरक की सही खुराक तय करने से पहले चार मुख्य कारकों का विश्लेषण किया जाता है:',
          ],
          gu: [
            'જમીન માત્ર માટીનો ઢગલો નથી, પરંતુ જીવંત જૈવિક અને ઇલેક્ટ્રો-કેમિકલ માધ્યમ છે. ખાતરની યોગ્ય માત્રા નક્કી કરતા પહેલા ચાર મુખ્ય પરિબળો તપાસવા જરૂરી છે:',
          ],
        },
        listItems: {
          en: [
            'Cation Exchange Capacity (CEC): Determines how effectively soil clay particles hold Potassium (K+), Calcium (Ca2+), and Magnesium (Mg2+) against leaching.',
            'Soil pH Dynamics: Governs the chemical ionization of mineral salts and their bio-availability to root hairs.',
            'Organic Carbon Matrix: Enhances soil porosity, water holding capacity, and beneficial microbial colonies.',
            'Soil Volumetric Water Content: Solubilizes applied fertilizers into ionic solutions for root xylem uptake.',
          ],
          hi: [
            'धनायन विनिमय क्षमता (CEC): तय करती है कि मिट्टी पोटेशियम (K), कैल्शियम (Ca) और मैग्नीशियम (Mg) को बहने से कितना रोक सकती है।',
            'मृदा pH गतिशीलता: नियंत्रित करता है कि खनिज लवण पौधों की जड़ों द्वारा अवशोषण के लिए कितने उपलब्ध हैं।',
            'जैविक कार्बन (Organic Carbon): मिट्टी की जल धारण क्षमता और लाभकारी सूक्ष्मजीवों की संख्या बढ़ाता है।',
            'मृदा नमी का स्तर: उर्वरकों को पानी में घोलकर जड़ों तक पहुंचाने में मदद करता है।',
          ],
          gu: [
            'કેટાયન એક્સચેન્જ કેપેસિટી (CEC): જમીનના કણો પોટાશ, કેલ્શિયમ અને મેગ્નેશિયમને કેટલા સમય સુધી પકડી રાખી શકે છે તે નક્કી કરે છે.',
            'જમીનનું pH: ખાતરના ક્ષારો ઓગળીને છોડના મૂળિયાં સુધી પહોંચવાની ક્ષમતા નિયંત્રિત કરે છે.',
            'ઓર્ગેનિક કાર્બન: જમીનની ભેજ સંગ્રહ શક્તિ અને ઉપયોગી બેક્ટેરિયા વધારે છે.',
            'જમીનનો ભેજ: ખાતરને ઓગાળીને મૂળિયાં સુધી પહોંચાડવામાં મદદરૂપ બને છે.',
          ],
        },
      },
      {
        heading: {
          en: '2. Avoiding the Critical Nutrient Lockout Zone',
          hi: '2. पोषक तत्वों के लॉकआउट (अवरोध) से बचाव',
          gu: '2. પોષક તત્વો બ્લોક થવાથી બચાવ',
        },
        content: {
          en: [
            'When soil pH strays outside the optimal 6.2–7.2 window, chemical precipitation locks essential macro and micronutrients into insoluble mineral forms. In acidic soils below pH 5.5, Aluminum and Iron bind Phosphorus into insoluble phosphates.',
            'In alkaline soils above pH 7.8, Calcium binds Phosphorus into insoluble calcium phosphate crystals, while Zinc and Iron become unavailable. Calibrating pH through Lime or Gypsum must always precede heavy fertilization.',
          ],
          hi: [
            'जब मिट्टी का pH 6.2 से 7.2 के बाहर चला जाता है, तो रासायनिक प्रतिक्रिया के कारण पोषक तत्व अघुलनशील हो जाते हैं। अम्लीय मिट्टी (pH < 5.5) में एल्यूमीनियम और आयरन फास्फोरस को जकड़ लेते हैं।',
            'क्षारीय मिट्टी (pH > 7.8) में कैल्शियम फास्फोरस और जिंक को लॉक कर देता है। भारी मात्रा में उर्वरक डालने से पहले चूना या जिप्सम डालकर pH को संतुलित करना आवश्यक है।',
          ],
          gu: [
            'જ્યારે જમીનનું pH 6.2 થી 7.2 ની બહાર જાય છે, ત્યારે રાસાયણિક પ્રક્રિયાથી ખાતર અદ્રાવ્ય બની જાય છે. એસિડિક જમીનમાં (pH < 5.5) ફોસ્ફરસ જકડાઈ જાય છે.',
            'આલ્કલાઇન જમીનમાં (pH > 7.8) કેલ્શિયમ ફોસ્ફરસ અને ઝિંકને બ્લોક કરે છે. મોંઘા ખાતરો આપતાં પહેલાં ચૂનો અથવા જીપ્સમ વાપરીને pH સંતુલિત કરવું અનિવાર્ય છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Conduct a grid or zone soil sampling test at least once every 2 cropping seasons.',
        'Always test soil at a consistent depth of 15–20 cm where 80% of feeder roots reside.',
        'Combine synthetic NPK with organic compost or biofertilizers to boost microbial cation exchange.',
      ],
      hi: [
        'हर 2 फसल सत्रों में कम से कम एक बार खेत की मिट्टी की जांच अवश्य करवाएं।',
        'मिट्टी का नमूना हमेशा 15-20 सेमी की गहराई से लें जहां 80% पोषक जड़ें होती हैं।',
        'रासायनिक NPK के साथ गोबर की खाद या वर्मीकम्पोस्ट का प्रयोग अवश्य करें।',
      ],
      gu: [
        'દર 2 પાક સીઝનમાં ઓછામાં ઓછી એક વાર જમીનનું લેબ પરીક્ષણ કરાવો.',
        'માટીનો નમૂનો હંમેશા 15-20 સેમી ઊંડાઈએથી જ લો જ્યાં મૂળિયાંનો મોટો ભાગ હોય છે.',
        'રાસાયણિક NPK સાથે દેશી છાણિયું ખાતર અથવા અળસિયા ખાતર ચોક્કસ ઉમેરો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Soil pH directly controls whether applied fertilizers can be absorbed or remain chemically locked.',
        'Split-dosage fertilizer strategies increase nutrient use efficiency (NUE) by up to 40%.',
        'Data-driven soil management cuts unnecessary input expenses while preserving long-term field productivity.',
      ],
      hi: [
        'मिट्टी का pH सीधे तौर पर तय करता है कि डाला गया खाद पौधे को मिलेगा या मिट्टी में फंसा रहेगा।',
        'टुकड़ों में खाद देने (Split Dosage) से उर्वरक की उपयोग दक्षता 40% तक बढ़ जाती है।',
        'वैज्ञानिक मृदा प्रबंधन से फालतू खर्च बचता है और जमीन की सेहत सुरक्षित रहती है।',
      ],
      gu: [
        'જમીનનું pH નક્કી કરે છે કે આપેલું ખાતર પાકને મળશે કે જમીનમાં બિનઉપયોગી પડી રહેશે.',
        'ખાતર ભાગ પાડીને (Split Dosage) આપવાથી તેની કાર્યક્ષમતા 40% સુધી વધે છે.',
        'વૈજ્ઞાનિક પદ્ધતિથી ખાતર વાપરવાથી બિનજરૂરી ખર્ચ બચે છે અને જમીન ફળદ્રુપ રહે છે.',
      ],
    },
    relatedArticleIds: ['npk-ratios', 'soil-ph', 'over-fertilization'],
  },
  {
    id: 'npk-ratios',
    title: {
      en: 'Understanding NPK Ratios for Maximum Crop Growth',
      hi: 'अधिकतम फसल वृद्धि के लिए NPK अनुपात को समझें',
      gu: 'મહત્તમ પાક વિકાસ માટે NPK ગુણોત્તર સમજો',
    },
    description: {
      en: 'Learn how Nitrogen, Phosphorus, and Potassium ratios dictate vegetative vigor, root development, and final grain weight.',
      hi: 'जानें कि नाइट्रोजन, फास्फोरस और पोटेशियम का अनुपात कैसे फसल की वृद्धि, जड़ों के विकास और दाने के वजन को तय करता है।',
      gu: 'જાણો કે નાઇટ્રોજન, ફોસ્ફરસ અને પોટાશનું પ્રમાણ કેવી રીતે પાકની વૃદ્ધિ, મૂળિયાં અને દાણાના વજનને અસર કરે છે.',
    },
    category: 'soil-npk',
    readTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    author: 'Sunita Patel',
    authorRole: {
      en: 'Agricultural Research Scientist',
      hi: 'कृषि अनुसंधान वैज्ञानिक',
      gu: 'કૃષિ સંશોધન વૈજ્ઞાનિક',
    },
    publishedDate: {
      en: 'August 14, 2026',
      hi: '14 अगस्त, 2026',
      gu: '14 ઓગસ્ટ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Every commercial fertilizer package displays three prominent numbers, such as 18-46-0 (DAP) or 10-26-26. These numbers represent the exact percentage by weight of Nitrogen (N), Phosphorus (P₂O₅), and Potassium (K₂O). Interpreting these ratios is critical to matching plant demand.',
      hi: 'उर्वरक की हर बोरी पर 18-46-0 (DAP) या 10-26-26 जैसे तीन नंबर लिखे होते हैं। ये नाइट्रोजन (N), फास्फोरस (P) और पोटेशियम (K) का प्रतिशत दर्शाते हैं। फसल की मांग के अनुसार सही अनुपात चुनना बहुत जरूरी है।',
      gu: 'ખાતરની દરેક થેલી પર 18-46-0 (DAP) અથવા 10-26-26 જેવા ત્રણ આંકડા હોય છે. આ નાઇટ્રોજન (N), ફોસ્ફરસ (P) અને પોટાશ (K) ની ટકાવારી દર્શાવે છે. પાકની જરૂરિયાત મુજબ યોગ્ય ખાતર પસંદ કરવું જરૂરી છે.',
    },
    sections: [
      {
        heading: {
          en: 'Nitrogen (N): The Foliage & Chlorophyll Engine',
          hi: 'नाइट्रोजन (N): पत्तियों और क्लोरोफिल का मुख्य स्रोत',
          gu: 'નાઇટ્રોજન (N): પાંદડાં અને હરિતદ્રવ્યનું એન્જિન',
        },
        content: {
          en: [
            'Nitrogen is the primary constituent of plant amino acids and chlorophyll molecules. It governs the rate of vegetative development, leaf surface area, and photosynthetic capacity. Excess nitrogen leads to weak lodging-prone stems.',
          ],
          hi: [
            'नाइट्रोजन पौधों में प्रोटीन और क्लोरोफिल बनाने का काम करता है। इससे पत्तियों का विकास और हरापन बढ़ता है। हालांकि, अधिक नाइट्रोजन से तना कमजोर हो जाता है और फसल गिरने लगती है।',
          ],
          gu: [
            'નાઇટ્રોજન છોડમાં પ્રોટીન અને હરિતદ્રવ્ય બનાવવાનું મુખ્ય કામ કરે છે. તે પાંદડાંની વૃદ્ધિ વધારે છે. વધુ પડતા નાઇટ્રોજનથી થડ નબળું પડે છે અને પાક ઢળી પડે છે.',
          ],
        },
      },
      {
        heading: {
          en: 'Phosphorus (P): Energy Transfer & Root Starter',
          hi: 'फास्फोरस (P): ऊर्जा संचार एवं जड़ों का विकास',
          gu: 'ફોસ્ફરસ (P): ઊર્જા સંચાર અને મૂળિયાંનો વિકાસ',
        },
        content: {
          en: [
            'Phosphorus is the structural core of ATP, driving early seedling vigor, lateral root branching, flower bud differentiation, and uniform seed setting.',
          ],
          hi: [
            'फास्फोरस पौधों की कोशिकाओं में ऊर्जा संचार करता है। यह शुरुआती अवस्था में मजबूत जड़ों, फूलों की संख्या और दानों के विकास के लिए जरूरी है।',
          ],
          gu: [
            'ફોસ્ફરસ છોડમાં ઊર્જાનું વહન કરે છે. શરૂઆતના તબક્કામાં મજબૂત મૂળિયાં, ફૂલ બેસવા અને દાણાના બંધારણ માટે તે ખૂબ જરૂરી છે.',
          ],
        },
      },
      {
        heading: {
          en: 'Potassium (K): Yield Quality & Stress Resilience',
          hi: 'पोटेशियम (K): उपज की गुणवत्ता और रोग प्रतिरोधक क्षमता',
          gu: 'પોટાશ (K): ગુણવત્તા અને રોગ પ્રતિકારક શક્તિ',
        },
        content: {
          en: [
            'Potassium regulates water retention during drought, strengthens plant stems against lodging, and enhances grain shine, fruit size, and disease resistance.',
          ],
          hi: [
            'पोटेशियम सूखे के समय पानी की कमी सहने में मदद करता है, तनों को मजबूत करता है और दानों की चमक, फलों का आकार व रोग प्रतिरोधक क्षमता बढ़ाता है।',
          ],
          gu: [
            'પોટાશ દુષ્કાળ સામે છોડને રક્ષણ આપે છે, થડને મજબૂત બનાવે છે અને દાણાની ચમક, ફળનું કદ તથા રોગ સામે લડવાની શક્તિ વધારે છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Calculate actual elemental nutrient requirement in kg/ha before buying commercial bags.',
        'Pair heavy Nitrogen applications with balanced Potassium to reinforce stalk strength.',
      ],
      hi: [
        'उर्वरक खरीदने से पहले खेत के लिए प्रति हेक्टेयर आवश्यक शुद्ध N, P, K की मात्रा निकालें।',
        'फसल को गिरने से बचाने के लिए नाइट्रोजन के साथ पोटाश का उचित संतुलन रखें।',
      ],
      gu: [
        'ખાતર ખરીદતાં પહેલાં પ્રતિ હેક્ટર જરૂરી ચોખ્ખા N, P, K ની ગણતરી કરો.',
        'પાકને ઢળી પડતો અટકાવવા નાઇટ્રોજન સાથે પોટાશનું યોગ્ય સંતુલન રાખો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Nitrogen drives leaf growth, Phosphorus builds roots, and Potassium regulates water and fruit quality.',
        'Balanced NPK nutrition delivers significantly higher returns than single-nutrient over-application.',
      ],
      hi: [
        'नाइट्रोजन पत्तियां बढ़ाता है, फास्फोरस जड़ें मजबूत करता है और पोटाश दाने की गुणवत्ता सुधारता है।',
        'संतुलित NPK अनुपात एकल उर्वरक के अत्यधिक प्रयोग की तुलना में कई गुना अधिक लाभ देता है।',
      ],
      gu: [
        'નાઇટ્રોજન પાન વધારે છે, ફોસ્ફરસ મૂળિયાં મજબૂત કરે છે અને પોટાશ ગુણવત્તા વધારે છે.',
        'સંતુલિત NPK ખાતર એકલા યુરિયા કરતાં ઘણો સારો નફો આપે છે.',
      ],
    },
    relatedArticleIds: ['precision-soil-management', 'urea-timing', 'npk-fundamentals'],
  },
  {
    id: 'soil-ph',
    title: {
      en: 'Managing Soil pH to Prevent Nutrient Lockout',
      hi: 'पोषक तत्वों के लॉकआउट को रोकने के लिए मिट्टी का pH प्रबंधन',
      gu: 'પોષક તત્વો બ્લોક ન થાય તે માટે જમીનનું pH વ્યવસ્થાપન',
    },
    description: {
      en: 'Discover why a 6.2–7.2 pH range is the critical sweet spot for fertilizer assimilation and how to correct acidic or alkaline fields.',
      hi: 'जानें कि 6.2-7.2 pH सीमा उर्वरक अवशोषण के लिए सबसे उपयुक्त क्यों है और अम्लीय या क्षारीय मिट्टी को कैसे ठीक करें।',
      gu: 'જાણો કે 6.2-7.2 pH રેન્જ ખાતર ગ્રહણ કરવા માટે શા માટે શ્રેષ્ઠ છે અને ખારી કે એસિડિક જમીનને કેવી રીતે સુધારવી.',
    },
    category: 'soil-npk',
    readTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Joshi',
    authorRole: {
      en: 'Soil Health Consultant',
      hi: 'मृदा स्वास्थ्य सलाहकार',
      gu: 'જમીન આરોગ્ય સલાહકાર',
    },
    publishedDate: {
      en: 'August 11, 2026',
      hi: '11 अगस्त, 2026',
      gu: '11 ઓગસ્ટ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Farmers frequently invest in high-grade fertilizers only to see minimal crop response. In over 60% of cases, the underlying culprit is soil pH imbalance, which causes chemical lockup of applied nutrients into insoluble complexes.',
      hi: 'किसान अक्सर महंगे उर्वरक डालते हैं लेकिन फसल में उचित परिणाम नहीं मिलता। 60% से अधिक मामलों में मुख्य कारण मिट्टी का pH असंतुलन होता है, जिससे पोषक तत्व मिट्टी में बंधकर रह जाते हैं।',
      gu: 'ખેડૂતો મોંઘા ખાતરો વાપરે છે પણ પાકમાં પૂરતો ફાયદો થતો નથી. 60% થી વધુ કિસ્સાઓમાં જમીનનું pH અસંતુલિત હોવાથી ખાતર જમીનમાં બ્લોક થઈ જાય છે.',
    },
    sections: [
      {
        heading: {
          en: 'The Chemistry of Soil pH Lockout',
          hi: 'मृदा pH और पोषक तत्वों के लॉकआउट का विज्ञान',
          gu: 'જમીનનું pH અને ખાતર બ્લોક થવાનું વિજ્ઞાન',
        },
        content: {
          en: [
            'In strongly acidic soils (pH < 5.5), Phosphorus bonds with Aluminum and Iron. In alkaline soils (pH > 7.8), Calcium binds Phosphorus, while Zinc, Iron, and Manganese become completely unavailable.',
          ],
          hi: [
            'अम्लीय मिट्टी (pH < 5.5) में फास्फोरस एल्युमिनियम और लोहे से जुड़कर अनुपयोगी हो जाता है। क्षारीय मिट्टी (pH > 7.8) में कैल्शियम फास्फोरस को बांध देता है और जिंक, लोहा पौधों को नहीं मिल पाता।',
          ],
          gu: [
            'વધુ એસિડિક જમીનમાં (pH < 5.5) ફોસ્ફરસ જકડાઈ જાય છે. વધુ આલ્કલાઇન જમીનમાં (pH > 7.8) કેલ્શિયમ ફોસ્ફરસને બાંધી રાખે છે અને ઝિંક-લોહતત્વ મળતા નથી.',
          ],
        },
      },
      {
        heading: {
          en: 'Correcting Acidic vs Alkaline Soils',
          hi: 'अम्लीय बनाम क्षारीय मिट्टी का सुधार',
          gu: 'એસિડિક અને ખારી જમીનનો સુધારો',
        },
        content: {
          en: [
            'To raise pH in acidic soil, apply finely ground Agricultural Lime 3–4 weeks before sowing. To treat alkaline/saline soils, apply Gypsum or Elemental Sulfur followed by flushing irrigation.',
          ],
          hi: [
            'अम्लीय मिट्टी का pH बढ़ाने के लिए बुवाई से 3-4 सप्ताह पहले कृषि चूना डालें। क्षारीय मिट्टी के उपचार के लिए जिप्सम या सल्फर डालें और भरपूर पानी दें।',
          ],
          gu: [
            'એસિડિક જમીનમાં pH વધારવા વાવણીના 3-4 અઠવાડિયા પહેલાં ચૂનો નાખો. ખારી/આલ્કલાઇન જમીન સુધારવા માટે જીપ્સમ અથવા સલ્ફર નાખીને પિયત આપો.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Test pH twice annually: once before Kharif and once before Rabi season.',
        'Incorporate organic green manure or FYM to naturally buffer extreme soil pH.',
      ],
      hi: [
        'साल में दो बार pH की जांच करें: खरीफ और रबी सीजन की शुरुआत में।',
        'हरी खाद या गोबर की खाद डालकर मिट्टी के pH को प्राकृतिक रूप से संतुलित करें।',
      ],
      gu: [
        'વર્ષમાં બે વાર pH ચકાસો: ખરીફ અને રવિ સીઝન પહેલાં.',
        'લીલો પડવાશ અથવા છાણિયું ખાતર ઉમેરીને જમીનનું pH કુદરતી રીતે સુધારો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Nutrient uptake efficiency drops below 50% when soil pH is outside the 6.0–7.5 range.',
        'Correcting pH is significantly cheaper and more impactful than adding excess fertilizer.',
      ],
      hi: [
        'जब pH 6.0 से 7.5 के बीच नहीं होता, तो 50% से अधिक खाद बर्बाद हो जाती है।',
        'अधिक खाद डालने की तुलना में पहले मिट्टी का pH सुधारना बहुत सस्ता और असरदार है।',
      ],
      gu: [
        'જ્યારે pH 6.0 થી 7.5 ની વચ્ચે ન હોય, ત્યારે 50% થી વધુ ખાતર વેડફાય છે.',
        'વધુ ખાતર નાખવા કરતાં પહેલાં જમીનનું pH સુધારવું વધુ સસ્તું અને ફાયદાકારક છે.',
      ],
    },
    relatedArticleIds: ['precision-soil-management', 'soil-moisture', 'building-soil-health'],
  },
  {
    id: 'over-fertilization',
    title: {
      en: 'How Over-Fertilization Damages Long-Term Soil Health',
      hi: 'अत्यधिक उर्वरक प्रयोग से मिट्टी की सेहत को कैसे नुकसान होता है',
      gu: 'વધુ પડતા ખાતરના વપરાશથી જમીનનું આરોગ્ય કેવી રીતે બગડે છે',
    },
    description: {
      en: 'Learn about the hidden risks of excess fertilizer: soil salinity, acidification, microbial disruption, and groundwater runoff.',
      hi: 'अत्यधिक खाद के नुकसानों को समझें: मिट्टी में खारापन, अम्लता, लाभकारी जीवाणुओं का विनाश और भूजल प्रदूषण।',
      gu: 'વધારે પડતા ખાતરના છુપા નુકસાન સમજો: જમીનમાં ક્ષાર વધવો, ઉપયોગી બેક્ટેરિયાનો નાશ અને ભૂગર્ભજળ પ્રદૂષણ.',
    },
    category: 'sustainable-farming',
    readTimeMinutes: 6,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Ramesh Agronomist',
    authorRole: {
      en: 'Senior Agronomy Specialist',
      hi: 'वरिष्ठ कृषि विशेषज्ञ',
      gu: 'સિનિયર એગ્રોનોમી સ્પેશિયાલિસ્ટ',
    },
    publishedDate: {
      en: 'August 07, 2026',
      hi: '07 अगस्त, 2026',
      gu: '07 ઓગસ્ટ, 2026',
    },
    featured: false,
    introduction: {
      en: 'The traditional assumption that "more fertilizer equals more yield" has degraded millions of hectares of agricultural soil. Over-fertilization creates chemical toxicity, suppresses soil earthworms, and harms long-term farm profitability.',
      hi: 'यह पुरानी धारणा कि "जितना ज्यादा खाद, उतनी ज्यादा पैदावार" लाखों हेक्टेयर उपजाऊ जमीन को बंजर बना रही है। अत्यधिक रासायनिक खाद केंचुओं और सूक्ष्मजीवों को नष्ट कर देती है।',
      gu: '"જેટલું વધારે ખાતર એટલો વધારે પાક" તેવી જૂની માન્યતા લાખો હેક્ટર જમીનને બગાડી રહી છે. વધારે પડતું ખાતર અળસિયા અને ઉપયોગી જીવાણુઓનો નાશ કરે છે.',
    },
    sections: [
      {
        heading: {
          en: 'Soil Compaction and Microbial Decline',
          hi: 'मिट्टी का कड़ापन और सूक्ष्मजीवों की कमी',
          gu: 'જમીન કઠણ થવી અને સૂક્ષ્મજીવોનો ઘટાડો',
        },
        content: {
          en: [
            'High chemical salt concentrations dehydrate beneficial mycorrhizal fungi and nitrogen-fixing bacteria. Over time, natural soil porosity collapses, forming a hard topsoil crust that blocks water penetration.',
          ],
          hi: [
            'रासायनिक लवणों की अधिकता से लाभदायक फफूंद और राइजोबियम बैक्टीरिया मर जाते हैं। धीरे-धीरे मिट्टी की हवा और पानी सोखने की क्षमता खत्म हो जाती है और जमीन कड़क हो जाती है।',
          ],
          gu: [
            'રાસાયણિક ક્ષાર વધવાથી ઉપયોગી ફૂગ અને બેક્ટેરિયા મરી જાય છે. ધીમે ધીમે જમીનની હવા-પાણી સંગ્રહવાની શક્તિ ઘટે છે અને પોપડો બંધાઈ જાય છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Adopt precision dosage recommendations generated from accurate soil deficit calculations.',
        'Rotate synthetic fertilizers with organic matter to replenish microbial food supplies.',
      ],
      hi: [
        'मिट्टी परीक्षण रिपोर्ट के आधार पर केवल आवश्यक मात्रा में ही खाद डालें।',
        'मिट्टी के जीवाणुओं को सक्रिय रखने के लिए जैविक खाद का नियमित उपयोग करें।',
      ],
      gu: [
        'જમીન ચકાસણી મુજબ જરૂરી માત્રામાં જ ખાતર આપો.',
        'જમીનના જીવાણુઓને જીવંત રાખવા સેન્દ્રીય ખાતરનો નિયમિત ઉપયોગ કરો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Excess fertilizer leads to root burn, soil salinization, and financial waste.',
        'Precision agriculture saves 20–40% in input costs while protecting multi-generational soil vitality.',
      ],
      hi: [
        'अत्यधिक खाद से जड़ें जलती हैं, मिट्टी खारी होती है और धन की बर्बादी होती है।',
        'सटीक कृषि से 20-40% खर्च बचता है और जमीन की ताकत सुरक्षित रहती है।',
      ],
      gu: [
        'વધારાના ખાતરથી મૂળિયાં બળે છે, જમીન ખારી થાય છે અને પૈસા વેડફાય છે.',
        'સચોટ ખેતી પદ્ધતિથી 20-40% ખર્ચ બચે છે અને જમીનનું આયુષ્ય વધે છે.',
      ],
    },
    relatedArticleIds: ['precision-soil-management', 'building-soil-health', 'npk-ratios'],
  },
  {
    id: 'urea-timing',
    title: {
      en: 'When Should You Apply Urea? Optimal Split-Application Timing',
      hi: 'यूरिया कब डालना चाहिए? सही समय और विभाजित खुराक का नियम',
      gu: 'યુરિયા ક્યારે આપવું? યોગ્ય સમય અને વહેંચીને વાપરવાનો નિયમ',
    },
    description: {
      en: 'Master the scientific timing for urea top-dressing to prevent atmospheric ammonia volatilization and maximize nitrogen assimilation.',
      hi: 'यूरिया को गैस बनकर हवा में उड़ने से रोकने और फसल द्वारा अधिकतम अवशोषण के लिए सही समय और नियम समझें।',
      gu: 'યુરિયા હવામાં ઉડી જતું અટકાવવા અને પાકને પૂરેપૂરો ફાયદો મળે તે માટેનો સાચો સમય અને નિયમ સમજો.',
    },
    category: 'fertilizers',
    readTimeMinutes: 4,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    author: 'Sunita Patel',
    authorRole: {
      en: 'Crop Nutritionist',
      hi: 'फसल पोषण विशेषज्ञ',
      gu: 'પાક પોષણ નિષ્ણાત',
    },
    publishedDate: {
      en: 'August 04, 2026',
      hi: '04 अगस्त, 2026',
      gu: '04 ઓગસ્ટ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Urea contains 46% Nitrogen. However, improper application timing can cause up to 50% of applied nitrogen to evaporate as ammonia gas before plant roots can access it.',
      hi: 'यूरिया में 46% नाइट्रोजन होता है। यदि इसे गलत समय या गलत तरीके से डाला जाए, तो 50% तक नाइट्रोजन अमोनिया गैस बनकर हवा में उड़ जाता है।',
      gu: 'યુરિયામાં 46% નાઇટ્રોજન હોય છે. જો તેને ખોટા સમયે નાખવામાં આવે, તો 50% જેટલો નાઇટ્રોજન હવામાં ઉડીને વેડફાઈ જાય છે.',
    },
    sections: [
      {
        heading: {
          en: 'The 3 Rules of Optimal Urea Timing',
          hi: 'यूरिया देने के 3 अचूक नियम',
          gu: 'યુરિયા આપવાના 3 સોનેરી નિયમો',
        },
        content: {
          en: [
            '1. Apply in the late afternoon when soil surface temperatures drop.',
            '2. Apply to moist soil followed immediately by light irrigation or shallow hoeing.',
            '3. Never broadcast urea onto standing floodwater.',
          ],
          hi: [
            '1. दोपहर की तेज धूप में कभी न डालें; हमेशा शाम के समय छिड़कें जब तापमान कम हो।',
            '2. यूरिया को हमेशा नम मिट्टी में डालें और तुरंत हल्की सिंचाई करें।',
            '3. खेत में भरे हुए खड़े पानी में यूरिया न फेंकें।',
          ],
          gu: [
            '1. બપોરના તડકામાં ક્યારેય ન નાખો; હંમેશાં મોડી સાંજે તાપમાન ઓછું હોય ત્યારે આપો.',
            '2. જમીનમાં પૂરતો ભેજ હોય ત્યારે જ યુરિયા નાખો અને તરત હળવું પિયત આપો.',
            '3. ખેતરમાં ભરેલા પાણીમાં યુરિયા ન વેરવું.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Split total urea into 2–3 equal top-dressings aligned with critical vegetative growth stages.',
        'Use Neem-Coated Urea to slow down ammonia release and extend availability by 15–20 days.',
      ],
      hi: [
        'यूरिया की पूरी मात्रा एक साथ न दें; फसल की बढ़वार की अवस्थाओं में 2-3 बार में दें।',
        'नीम लेपित यूरिया का उपयोग करें ताकि नाइट्रोजन धीरे-धीरे 15-20 दिनों तक मिलती रहे।',
      ],
      gu: [
        'યુરિયાનો બધો જથ્થો એકસાથે ન આપો; વૃદ્ધિના તબક્કે 2-3 હપ્તામાં વહેંચીને આપો.',
        'નીમ કોટેડ યુરિયા વાપરો જેથી નાઇટ્રોજન ધીમે ધીમે 15-20 દિવસ સુધી મળતો રહે.',
      ],
    },
    keyTakeaways: {
      en: [
        'Broadcasting urea on dry soil under midday sun wastes up to half of your purchased nitrogen.',
        'Apply during late afternoon followed by light irrigation for maximum uptake.',
      ],
      hi: [
        'सूखी मिट्टी और तेज धूप में यूरिया डालने से आधा खाद हवा में उड़ जाता है।',
        'शाम के समय डालकर हल्की सिंचाई करने से फसल को पूरा पोषण मिलता है।',
      ],
      gu: [
        'સૂકી જમીન અને બપોરના તડકામાં યુરિયા નાખવાથી અડધું ખાતર વેડફાઈ જાય છે.',
        'સાંજે નાખીને હળવું પિયત આપવાથી પાકને પૂરેપૂરો ફાયદો થાય છે.',
      ],
    },
    relatedArticleIds: ['growth-stages', 'npk-ratios', 'weather-fertilizer'],
  },
  {
    id: 'npk-fundamentals',
    title: {
      en: 'Understanding Nitrogen, Phosphorus and Potassium',
      hi: 'नाइट्रोजन, फास्फोरस और पोटेशियम के मूलभूत कार्य',
      gu: 'નાઇટ્રોજન, ફોસ્ફરસ અને પોટાશના મૂળભૂત કાર્યો',
    },
    description: {
      en: 'A comprehensive primer on primary macronutrients, their biochemical functions in plants, and how to spot early deficiencies.',
      hi: 'प्राथमिक पोषक तत्वों, पौधों में उनके जैविक कार्यों और शुरुआती कमी के लक्षणों की पहचान पर संपूर्ण मार्गदर्शिका।',
      gu: 'મુખ્ય પોષક તત્વો, છોડમાં તેમના કાર્યો અને ઉણપના લક્ષણો ઓળખવા માટેની સંપૂર્ણ માર્ગદર્શિકા.',
    },
    category: 'soil-npk',
    readTimeMinutes: 6,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Ramesh Agronomist',
    authorRole: {
      en: 'Agronomy Specialist',
      hi: 'कृषि विशेषज्ञ',
      gu: 'એગ્રોનોમી નિષ્ણાત',
    },
    publishedDate: {
      en: 'July 29, 2026',
      hi: '29 जुलाई, 2026',
      gu: '29 જુલાઈ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Nitrogen, Phosphorus, and Potassium form the foundational trio of crop physiology. Understanding how these elements interact inside plant tissues empowers growers to make proactive nutritional corrections before yield losses occur.',
      hi: 'नाइट्रोजन, फास्फोरस और पोटाश फसल के मुख्य पोषक तत्व हैं। इनके कार्यों को समझकर किसान नुकसान होने से पहले ही समय पर सही पोषण दे सकते हैं।',
      gu: 'નાઇટ્રોજન, ફોસ્ફરસ અને પોટાશ પાકના મુખ્ય પોષક તત્વો છે. તેમના કાર્યો સમજીને ખેડૂતો નુકસાન થતાં પહેલાં જ યોગ્ય ખાતર આપી શકે છે.',
    },
    sections: [
      {
        heading: {
          en: 'Identifying Mobile vs Immobile Nutrient Movements',
          hi: 'पौधों में पोषक तत्वों की गतिशीलता की पहचान',
          gu: 'છોડમાં પોષક તત્વોની ગતિશીલતા ઓળખવી',
        },
        content: {
          en: [
            'Because N, P, and K are mobile within plant vascular systems, deficiency symptoms always appear first on the oldest bottom leaves as the plant transfers nutrients to new growth.',
          ],
          hi: [
            'N, P और K पौधों में गतिशील होते हैं, इसलिए इनकी कमी के लक्षण हमेशा पौधे की सबसे निचली पुरानी पत्तियों पर पहले दिखाई देते हैं।',
          ],
          gu: [
            'N, P અને K છોડની અંદર હલનચલન કરી શકે છે, તેથી તેમની ઉણપના લક્ષણો હંમેશાં નીચેના જૂના પાન પર પહેલાં દેખાય છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Inspect lower leaves weekly for early yellowing (N deficiency) or edge browning (K deficiency).',
        'Maintain balanced elemental ratios rather than applying isolated single nutrients.',
      ],
      hi: [
        'निचली पत्तियों की हर हफ्ते जांच करें: पीलापन (N की कमी) और किनारों का जलना (K की कमी) दर्शाता है।',
        'केवल एक पोषक तत्व देने के बजाय संतुलित अनुपात बनाए रखें।',
      ],
      gu: [
        'નીચેના પાનની દર અઠવાડિયે તપાસ કરો: પીળાશ (N ની ઉણપ) અને કિનારી બળવી (K ની ઉણપ) દર્શાવે છે.',
        'માત્ર એક જ ખાતર વાપરવાને બદલે સંતુલિત પોષણ આપો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Primary macronutrients are mobile within the plant; deficiency symptoms manifest on bottom leaves first.',
        'Balanced NPK ratios deliver superior crop vigor, disease resistance, and harvest weight.',
      ],
      hi: [
        'प्राथमिक पोषक तत्वों की कमी सबसे पहले निचली पत्तियों पर दिखती है।',
        'संतुलित NPK से फसल में मजबूती, रोग प्रतिरोधकता और दानों का बेहतर वजन मिलता है।',
      ],
      gu: [
        'મુખ્ય તત્વોની ઉણપ સૌથી પહેલાં નીચેના પાન પર દેખાય છે.',
        'સંતુલિત NPK થી પાકમાં મજબૂતી, રોગ સામે રક્ષણ અને સારું ઉત્પાદન મળે છે.',
      ],
    },
    relatedArticleIds: ['npk-ratios', 'nutrient-deficiencies', 'precision-soil-management'],
  },
  {
    id: 'weather-fertilizer',
    title: {
      en: 'How Weather Conditions Affect Fertilizer Application',
      hi: 'मौसम की स्थिति उर्वरक के उपयोग को कैसे प्रभावित करती है',
      gu: 'હવામાનની સ્થિતિ ખાતરના વપરાશને કેવી રીતે અસર કરે છે',
    },
    description: {
      en: 'How rainfall forecast, wind speed, ambient temperature, and humidity dictate fertilizer absorption and loss prevention.',
      hi: 'जानें कि बारिश का पूर्वानुमान, हवा की गति, तापमान और नमी खाद के असर और बर्बादी को कैसे नियंत्रित करते हैं।',
      gu: 'જાણો કે વરસાદની આગાહી, પવનની ઝડપ, તાપમાન અને ભેજ ખાતરના ફાયદા અને બગાડને કેવી રીતે નિયંત્રિત કરે છે.',
    },
    category: 'weather-irrigation',
    readTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Joshi',
    authorRole: {
      en: 'Agro-Meteorology Analyst',
      hi: 'कृषि-मौसम विश्लेषक',
      gu: 'કૃષિ હવામાન વિશ્લેષક',
    },
    publishedDate: {
      en: 'July 24, 2026',
      hi: '24 जुलाई, 2026',
      gu: '24 જુલાઈ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Fertilizer efficiency depends just as much on weather telemetry as it does on soil chemistry. Applying nutrients without checking rainfall forecasts can wash away thousands of rupees in a single thunderstorm.',
      hi: 'उर्वरक का असर मिट्टी के साथ-साथ मौसम पर भी निर्भर करता है। बारिश का पूर्वानुमान देखे बिना खाद डालने से एक ही बारिश में हजारों रुपये का खाद बह सकता है।',
      gu: 'ખાતરનો ફાયદો જમીનની સાથે હવામાન પર પણ આધાર રાખે છે. વરસાદની આગાહી જોયા વિના ખાતર આપવાથી એક જ વરસાદમાં હજારો રૂપિયાનું ખાતર ધોવાઈ જાય છે.',
    },
    sections: [
      {
        heading: {
          en: 'Precipitation Alerts and Leaching Prevention',
          hi: 'वर्षा चेतावनी और पोषक तत्वों के बहने से बचाव',
          gu: 'વરસાદની ચેતવણી અને ખાતર ધોવાઈ જતું અટકાવવું',
        },
        content: {
          en: [
            'Heavy rain within 24 hours of fertilizer application causes surface runoff that carries water-soluble nutrients away. Always check the AGRISENSE Weather forecast before field broadcasting.',
          ],
          hi: [
            'खाद डालने के 24 घंटे के भीतर तेज बारिश होने पर पानी में घुलनशील खाद बह जाती है। खेत में खाद डालने से पहले AGRISENSE मौसम पूर्वानुमान जरूर देखें।',
          ],
          gu: [
            'ખાતર નાખ્યાના 24 કલાકમાં ભારે વરસાદ પડે તો ખાતર ધોવાઈ જાય છે. ખાતર આપતાં પહેલાં AGRISENSE હવામાનની આગાહી ચોક્કસ તપાસો.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Never broadcast granular fertilizers if heavy rainfall is predicted within 24–48 hours.',
        'Spray foliar micronutrients when relative humidity is above 60% for prolonged leaf absorption.',
      ],
      hi: [
        'यदि 24-48 घंटों के भीतर भारी बारिश की संभावना हो तो दानेदार खाद का छिड़काव न करें।',
        'पत्तियों पर सूक्ष्म पोषक तत्वों का छिड़काव तब करें जब वातावरण में 60% से अधिक नमी हो।',
      ],
      gu: [
        'જો 24-48 કલાકમાં ભારે વરસાદની શક્યતા હોય તો દાણાદાર ખાતર ન આપો.',
        'પાંદડાં પર છંટકાવ ત્યારે જ કરો જ્યારે હવામાં 60% થી વધુ ભેજ હોય જેથી પાકને વધુ ફાયદો થાય.',
      ],
    },
    keyTakeaways: {
      en: [
        'Synchronizing fertilizer application with weather intelligence prevents costly runoff losses.',
        'Foliar applications should be timed during high-humidity, moderate-temperature spray windows.',
      ],
      hi: [
        'मौसम की जानकारी के अनुसार खाद डालने से बर्बादी रुकती है।',
        'पत्तियों पर छिड़काव सुबह या शाम के समय सामान्य तापमान और नमी में ही करें।',
      ],
      gu: [
        'હવામાનની માહિતી મુજબ ખાતર આપવાથી મોટું નુકસાન અટકે છે.',
        'છંટકાવ સવારે અથવા સાંજે સામાન્ય તાપમાન અને ભેજમાં જ કરવો.',
      ],
    },
    relatedArticleIds: ['drip-fertigation', 'urea-timing', 'soil-moisture'],
  },
  {
    id: 'drip-fertigation',
    title: {
      en: 'Drip Irrigation and Fertigation Best Practices',
      hi: 'ड्रिप सिंचाई और फर्टिगेशन (Fertigation) की सर्वोत्तम पद्धतियां',
      gu: 'ટપક સિંચાઈ અને ફર્ટિગેશન (ખાતર આપવાની) શ્રેષ્ઠ પદ્ધતિઓ',
    },
    description: {
      en: 'Maximize nutrient delivery efficiency up to 90% through micro-dosing soluble fertilizers directly into root zones.',
      hi: 'घुलनशील उर्वरकों को सीधे जड़ों तक पहुंचाकर पोषक तत्वों की उपयोग क्षमता 90% तक बढ़ाएं।',
      gu: 'દ્રાવ્ય ખાતરોને સીધા મૂળિયાં સુધી પહોંચાડીને ખાતરની કાર્યક્ષમતા 90% સુધી વધારો.',
    },
    category: 'weather-irrigation',
    readTimeMinutes: 6,
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    author: 'Sunita Patel',
    authorRole: {
      en: 'Irrigation & Fertigation Specialist',
      hi: 'सिंचाई एवं फर्टिगेशन विशेषज्ञ',
      gu: 'પિયત અને ફર્ટિગેશન નિષ્ણાત',
    },
    publishedDate: {
      en: 'July 19, 2026',
      hi: '19 जुलाई, 2026',
      gu: '19 જુલાઈ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Fertigation—the injection of water-soluble fertilizers through pressurized drip irrigation systems—delivers micro-doses directly to the active root rhizosphere, slashing water use by 40% and fertilizer use by 30%.',
      hi: 'फर्टिगेशन यानी ड्रिप सिंचाई के माध्यम से पानी में घुलनशील खाद देना। यह सीधे जड़ों तक पहुंचती है, जिससे 40% पानी और 30% खाद की बचत होती है।',
      gu: 'ફર્ટિગેશન એટલે ટપક પદ્ધતિ દ્વારા પાણીમાં ઓગળેલા ખાતર આપવા. આ પદ્ધતિથી સીધું મૂળિયાં સુધી પોષણ મળે છે, જેથી 40% પાણી અને 30% ખાતર બચે છે.',
    },
    sections: [
      {
        heading: {
          en: 'Selecting 100% Water-Soluble Fertilizers',
          hi: '100% जल-घुलनशील उर्वरकों का चयन',
          gu: '100% પાણીમાં ઓગળતા ખાતરોની પસંદગી',
        },
        content: {
          en: [
            'Traditional DAP contains insoluble fillers that clog drip nozzles. Fertigation requires 100% water-soluble grades such as 19-19-19, 0-52-34 (MKP), 13-0-45 (Potassium Nitrate), and Calcium Nitrate.',
          ],
          hi: [
            'पारंपरिक डीएपी में ऐसे अघुलनशील पदार्थ होते हैं जो ड्रिप के ड्रिपर्स को जाम कर देते हैं। ड्रिप के लिए हमेशा 19-19-19, 0-52-34 या 13-0-45 जैसे 100% घुलनशील ग्रेड ही चुनें।',
          ],
          gu: [
            'સાદા ડીએપીમાં અદ્રાવ્ય કચરો હોય છે જે ડ્રિપરને જામ કરી દે છે. ટપક માટે હંમેશા 19-19-19, 0-52-34 કે 13-0-45 જેવા 100% દ્રાવ્ય ગ્રેડ જ વાપરો.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Always run clean water through drip lines for 15 minutes before and after every fertigation cycle.',
        'Never mix Calcium Nitrate with Phosphorus or Sulfate fertilizers in the same stock tank.',
      ],
      hi: [
        'फर्टिगेशन से पहले और बाद में 15 मिनट तक ड्रिप में सादा पानी जरूर चलाएं।',
        'कैल्शियम नाइट्रेट को फास्फेट या सल्फेट वाले खादों के साथ एक ही टैंक में न मिलाएं।',
      ],
      gu: [
        'ખાતર આપતાં પહેલાં અને પછી 15 મિનિટ ટપકમાં સાદું પાણી ચોક્કસ ચલાવો.',
        'કેલ્શિયમ નાઇટ્રેટને ફોસ્ફેટ કે સલ્ફેટ ખાતરો સાથે એક જ ટાંકીમાં ન ભેળવો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Fertigation increases nutrient use efficiency from 45% to over 85%.',
        'Use 100% water-soluble grades and prevent chemical precipitate formation.',
      ],
      hi: [
        'ड्रिप से खाद देने पर पौधों को 85% से अधिक पोषण मिलता है।',
        'हमेशा 100% घुलनशील खाद का उपयोग करें और पाइपों को जाम होने से बचाएं।',
      ],
      gu: [
        'ટપકથી ખાતર આપવાથી પાકને 85% થી વધુ ફાયદો થાય છે.',
        'હંમેશા 100% દ્રાવ્ય ખાતર વાપરો અને ડ્રિપરો ચોક થતાં અટકાવો.',
      ],
    },
    relatedArticleIds: ['weather-fertilizer', 'soil-moisture', 'growth-stages'],
  },
  {
    id: 'growth-stages',
    title: {
      en: 'Choosing Fertilizer Based on Crop Growth Stage',
      hi: 'फसल की वृद्धि अवस्था के अनुसार सही उर्वरक का चुनाव',
      gu: 'પાકના વિકાસના તબક્કા મુજબ યોગ્ય ખાતરની પસંદગી',
    },
    description: {
      en: 'Dynamic nutrient schedules: How crop nutritional requirements shift from seedling, tillering, flowering, to grain maturation.',
      hi: 'अंकुरण, कल्ले फूटने, फूल आने और दाना भरने तक फसल की पोषक तत्वों की बदलती जरूरतों को समझें।',
      gu: 'અંકુરણ, ફૂટ, ફૂલ બેસવા અને દાણો ભરાવા સુધી પાકની બદલાતી પોષક જરૂરિયાતો સમજો.',
    },
    category: 'fertilizers',
    readTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Ramesh Agronomist',
    authorRole: {
      en: 'Agronomy Specialist',
      hi: 'कृषि विशेषज्ञ',
      gu: 'એગ્રોનોમી નિષ્ણાત',
    },
    publishedDate: {
      en: 'July 12, 2026',
      hi: '12 जुलाई, 2026',
      gu: '12 જુલાઈ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Crops do not consume nutrients at a constant rate. A seedling has radically different physiological demands than a crop entering reproductive flowering. Applying the right nutrient at the wrong stage is a major source of yield loss.',
      hi: 'फसल हर अवस्था में एक जैसी खाद नहीं लेती। छोटे पौधे की जरूरत फूल और दाना आने वाले पौधे से बिल्कुल अलग होती है। सही समय पर सही पोषक तत्व देना ही अच्छी पैदावार की कुंजी है।',
      gu: 'પાક દરેક તબક્કે એકસરખું ખાતર લેતો નથી. નાના રોપાની જરૂરિયાત ફૂલ અને દાણા બેસવાના સમય કરતાં જુદી હોય છે. યોગ્ય સમયે યોગ્ય તત્વ આપવું જ સફળતાની ચાવી છે.',
    },
    sections: [
      {
        heading: {
          en: 'Nutrient Dynamics Across 3 Crucial Growth Phases',
          hi: 'फसल के 3 मुख्य चरणों में पोषक तत्वों की मांग',
          gu: 'પાકના 3 મહત્વના તબક્કામાં ખાતરની જરૂરિયાત',
        },
        content: {
          en: [
            '1. Early Vegetative: High Phosphorus requirement for root development.',
            '2. Peak Tillering: Maximum Nitrogen requirement for canopy and chlorophyll expansion.',
            '3. Flowering & Grain Filling: High Potassium and Boron requirement for pollination and kernel weight.',
          ],
          hi: [
            '1. प्रारंभिक अवस्था: जड़ों के विकास के लिए फास्फोरस की अधिक आवश्यकता।',
            '2. कल्ले फूटने की अवस्था: पत्तियां और तना बढ़ाने के लिए नाइट्रोजन की सबसे अधिक मांग।',
            '3. फूल और दाना भरने की अवस्था: परागण और दाने के वजन के लिए पोटाश और बोरॉन जरूरी।',
          ],
          gu: [
            '1. શરૂઆતનો તબક્કો: મૂળિયાંના વિકાસ માટે ફોસ્ફરસ જરૂરી.',
            '2. ફૂટનો તબક્કો: પાન અને થડના વિકાસ માટે નાઇટ્રોજનની સૌથી વધુ જરૂર.',
            '3. ફૂલ અને દાણાનો તબક્કો: દાણાની ચમક અને વજન માટે પોટાશ તથા બોરોન જરૂરી.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Taper off Nitrogen applications once crop flowering commences to prevent excessive leafiness.',
        'Supplement with foliar Boron and Potassium during pre-flowering for higher fruit retention.',
      ],
      hi: [
        'फूल आने के बाद नाइट्रोजन देना बंद करें ताकि केवल पत्तियां न बढ़ती रहें।',
        'फूल आने से पहले पोटाश और बोरॉन का हल्का छिड़काव करें ताकि फूल न झड़ें।',
      ],
      gu: [
        'ફૂલ આવવાની શરૂઆત થાય પછી નાઇટ્રોજન બંધ કરો જેથી પાંદડાં જ ન વધ્યા કરે.',
        'ફૂલ ખરતાં અટકાવવા ફૂલ બેસતા પહેલાં પોટાશ અને બોરોનનો હળવો છંટકાવ કરો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Phosphorus dominates root development, Nitrogen powers tillering, and Potassium drives grain filling.',
        'Adjust dosage schedules dynamically to match crop physiological milestones.',
      ],
      hi: [
        'फास्फोरस जड़ें बनाता है, नाइट्रोजन बढ़वार देता है और पोटाश दाना भरता है।',
        'फसल की उम्र और अवस्था के अनुसार ही खाद की योजना बनाएं।',
      ],
      gu: [
        'ફોસ્ફરસ મૂળ બનાવે છે, નાઇટ્રોજન વિકાસ આપે છે અને પોટાશ દાણો ભરે છે.',
        'પાકના વિકાસના તબક્કા મુજબ જ ખાતર આપો.',
      ],
    },
    relatedArticleIds: ['npk-ratios', 'urea-timing', 'crop-rotation'],
  },
  {
    id: 'soil-moisture',
    title: {
      en: 'How Soil Moisture Affects Nutrient Uptake',
      hi: 'मिट्टी की नमी पोषक तत्वों के अवशोषण को कैसे प्रभावित करती है',
      gu: 'જમીનનો ભેજ પોષક તત્વોના શોષણને કેવી રીતે અસર કરે છે',
    },
    description: {
      en: 'Explore the biophysical mechanics of mass flow and diffusion that dictate how plant roots absorb dissolved soil mineral ions.',
      hi: 'जानें कि मिट्टी की नमी की मदद से पौधे पानी में घुले पोषक तत्वों को जड़ों द्वारा कैसे अवशोषित करते हैं।',
      gu: 'જાણો કે જમીનના ભેજની મદદથી છોડના મૂળિયાં પાણીમાં ઓગળેલા પોષક તત્વોનું શોષણ કેવી રીતે કરે છે.',
    },
    category: 'soil-npk',
    readTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Joshi',
    authorRole: {
      en: 'Soil Biophysicist',
      hi: 'मृदा भौतिक विज्ञानी',
      gu: 'જમીન ભૌતિક વિજ્ઞાની',
    },
    publishedDate: {
      en: 'July 05, 2026',
      hi: '05 जुलाई, 2026',
      gu: '05 જુલાઈ, 2026',
    },
    featured: false,
    introduction: {
      en: 'Plant roots cannot absorb dry fertilizer granules; they only take in mineral ions dissolved in soil water films. Without adequate soil moisture, nutrients remain completely unavailable.',
      hi: 'पौधों की जड़ें सूखे उर्वरक को नहीं खा सकतीं; वे केवल पानी में घुले हुए पोषक तत्व ही सोखती हैं। यदि मिट्टी में नमी नहीं होगी तो डाला गया खाद पूरी तरह व्यर्थ रहेगा।',
      gu: 'છોડના મૂળિયાં સૂકા ખાતરને સીધા લઈ શકતા નથી; તેઓ માત્ર પાણીમાં ઓગળેલા ક્ષારો જ શોષે છે. જમીનમાં પૂરતો ભેજ ન હોય તો ખાતર નકામું પડી રહે છે.',
    },
    sections: [
      {
        heading: {
          en: 'Mass Flow vs Diffusion Mechanics',
          hi: 'मास फ्लो और डिफ्यूजन की प्रक्रिया',
          gu: 'પાણી સાથે પોષણ વહન થવાની પ્રક્રિયા',
        },
        content: {
          en: [
            'Nitrogen moves with water flow into roots, while Phosphorus and Potassium move by slow diffusion through water films. In dry soil, nutrient diffusion drops by over 80%.',
          ],
          hi: [
            'नाइट्रोजन पानी के बहाव के साथ जड़ों में जाता है, जबकि फास्फोरस और पोटाश नमी के माध्यम से धीरे-धीरे पहुंचते हैं। सूखी मिट्टी में इनका पहुंचना 80% तक रुक जाता है।',
          ],
          gu: [
            'નાઇટ્રોજન પાણીના પ્રવાહ સાથે મૂળિયાંમાં જાય છે, જ્યારે ફોસ્ફરસ અને પોટાશ ભેજ દ્વારા ધીમે ધીમે પહોંચે છે. સૂકી જમીનમાં આ પ્રક્રિયા 80% ઘટી જાય છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Maintain field moisture between 50% and 75% of field capacity for peak nutrient mobility.',
        'Irrigate lightly prior to broadcasting fertilizers in dry soil.',
      ],
      hi: [
        'पोषक तत्वों के बेहतर असर के लिए खेत में 50% से 75% तक नमी बनाए रखें।',
        'सूखे खेत में खाद डालने से पहले या तुरंत बाद हल्की सिंचाई अवश्य करें।',
      ],
      gu: [
        'ખાતરના સારા પરિણામ માટે જમીનમાં 50% થી 75% ભેજ જાળવી રાખો.',
        'સૂકા ખેતમાં ખાતર આપતાં પહેલાં અથવા તરત પછી હળવું પિયત આપો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Nutrients must be dissolved in soil water films to be absorbed by roots.',
        'Both severe drought and prolonged waterlogging halt nutrient uptake completely.',
      ],
      hi: [
        'खाद को जड़ों द्वारा सोखने के लिए मिट्टी में नमी होना अनिवार्य है।',
        'सूखा और जलभराव दोनों ही स्थिति में पौधे पोषण लेना बंद कर देते हैं।',
      ],
      gu: [
        'મૂળિયાં દ્વારા ખાતર શોષવા માટે જમીનમાં ભેજ હોવો અનિવાર્ય છે.',
        'દુષ્કાળ અને પાણી ભરાવો બંને પરિસ્થિતિમાં છોડ ખાતર લેવાનું બંધ કરી દે છે.',
      ],
    },
    relatedArticleIds: ['precision-soil-management', 'weather-fertilizer', 'soil-ph'],
  },
  {
    id: 'crop-rotation',
    title: {
      en: 'Crop Rotation and Soil Nutrient Management',
      hi: 'फसल चक्र और मृदा पोषक तत्व प्रबंधन',
      gu: 'પાકની ફેરબદલી અને જમીન પોષક વ્યવસ્થાપન',
    },
    description: {
      en: 'Harness the power of legume nitrogen fixation, deep-root nutrient mining, and pest cycle disruption across seasonal rotations.',
      hi: 'दलहनी फसलों द्वारा प्राकृतिक नाइट्रोजन स्थिरीकरण, गहरी जड़ों द्वारा पोषण और कीट चक्र को तोड़ने का विज्ञान।',
      gu: 'કઠોળ પાક દ્વારા કુદરતી નાઇટ્રોજન બનાવવો, ઊંડા મૂળિયાં દ્વારા પોષણ અને જીવાતોનું ચક્ર તોડવાની પદ્ધતિ.',
    },
    category: 'crop-management',
    readTimeMinutes: 6,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    author: 'Sunita Patel',
    authorRole: {
      en: 'Agronomy Specialist',
      hi: 'कृषि विशेषज्ञ',
      gu: 'એગ્રોનોમી સ્પેશિયાલિસ્ટ',
    },
    publishedDate: {
      en: 'June 28, 2026',
      hi: '28 जून, 2026',
      gu: '28 જૂન, 2026',
    },
    featured: false,
    introduction: {
      en: 'Monocropping the same crop (such as continuous wheat or sugarcane) strips specific soil layers and promotes pest outbreaks. Crop rotation naturally restores biological balance.',
      hi: 'लगातार एक ही फसल (जैसे लगातार गेहूं या गन्ना) उगाने से मिट्टी के विशेष तत्व खत्म हो जाते हैं और बीमारियां बढ़ती हैं। फसल चक्र से मिट्टी में प्राकृतिक संतुलन लौटता है।',
      gu: 'સતત એક જ પાક (જેમ કે માત્ર ઘઉં કે શેરડી) વાવવાથી જમીનમાંથી ચોક્કસ તત્વો ખૂટી જાય છે અને રોગ વધે છે. પાકની ફેરબદલીથી કુદરતી સંતુલન જળવાય છે.',
    },
    sections: [
      {
        heading: {
          en: 'Legume Synergies: Natural Nitrogen Fixation',
          hi: 'दलहनी फसलों से प्राकृतिक नाइट्रोजन निर्माण',
          gu: 'કઠોળ વર્ગના પાકથી કુદરતી નાઇટ્રોજન ઉત્પાદન',
        },
        content: {
          en: [
            'Rotating cereals with legumes (chickpea, pigeon pea, soybean, green gram) fixes 40–80 kg of atmospheric nitrogen per hectare through root Rhizobium bacteria, slashing synthetic urea needs for the next crop.',
          ],
          hi: [
            'अनाज वाली फसलों के बाद दलहनी फसलें (चना, अरहर, सोयाबीन, मूंग) लगाने से राइजोबियम बैक्टीरिया प्रति हेक्टेयर 40-80 किग्रा प्राकृतिक नाइट्रोजन जमीन में जोड़ते हैं।',
          ],
          gu: [
            'અનાજ પછી કઠોળ પાક (ચણા, તુવેર, સોયાબીન, મગ) વાવવાથી રાઇઝોબિયમ બેક્ટેરિયા પ્રતિ હેક્ટર 40-80 કિગ્રા કુદરતી નાઇટ્રોજન જમીનમાં ઉમેરે છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Plant a short-duration pulse crop during summer fallow to build soil nitrogen reserves.',
        'Never follow a tomato/potato crop with another member of the same family.',
      ],
      hi: [
        'गर्मी के खाली समय में मूंग या ढैंचा जैसी कम अवधि की फसल लगाकर मिट्टी को उपजाऊ बनाएं।',
        'टमाटर या आलू के बाद उसी परिवार की फसल (जैसे बैंगन या मिर्च) तुरंत न लगाएं।',
      ],
      gu: [
        'ઉનાળામાં મગ કે ઇકકડ જેવો ટૂંકા ગાળાનો પાક વાવી જમીનમાં નાઇટ્રોજન વધારો.',
        'ટામેટા કે બટાટા પછી તરત એ જ કુળના પાક (રીંગણ કે મરચી) ન વાવવા.',
      ],
    },
    keyTakeaways: {
      en: [
        'Legume rotation fixes biological nitrogen and cuts synthetic fertilizer expenditure.',
        'Alternating root depths improves soil structure and disrupts pest cycles.',
      ],
      hi: [
        'दलहनी फसलों से प्राकृतिक नाइट्रोजन मिलती है और यूरिया का खर्च बचता है।',
        'अलग-अलग जड़ गहराई वाली फसलें बदलने से जमीन की बनावट सुधरती है और कीट चक्र टूटता है।',
      ],
      gu: [
        'કઠોળ પાકની ફેરબદલીથી યુરિયાનો મોટો ખર્ચ બચે છે.',
        'જુદી જુદી ઊંડાઈના મૂળિયાં વાળા પાક ફેરવવાથી જમીન પોચી રહે છે અને રોગચાળો અટકે છે.',
      ],
    },
    relatedArticleIds: ['building-soil-health', 'growth-stages', 'over-fertilization'],
  },
  {
    id: 'nutrient-deficiencies',
    title: {
      en: 'How to Identify Common Nutrient Deficiencies',
      hi: 'फसलों में मुख्य पोषक तत्वों की कमी के लक्षणों की पहचान',
      gu: 'પાકમાં મુખ્ય પોષક તત્વોની ઉણપના લક્ષણો ઓળખવાની રીત',
    },
    description: {
      en: 'Visual diagnostic key: Identify Chlorosis, Purpling, Interveinal Yellowing, and Necrosis across plant leaves and stems.',
      hi: 'पत्तियों के पीलेपन, बैंगनी रंग, नसों के बीच के पीलेपन और जलने जैसे लक्षणों को देखकर सही कमी पहचानें।',
      gu: 'પાંદડાંની પીળાશ, જાંબલી રંગ, નસો વચ્ચે પીળાશ અને કિનારી બળવા જેવા લક્ષણો પરથી સાચી ઉણપ ઓળખો.',
    },
    category: 'farmer-tips',
    readTimeMinutes: 6,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    author: 'Dr. Ramesh Agronomist',
    authorRole: {
      en: 'Plant Diagnostic Agronomist',
      hi: 'पादप रोग एवं पोषण विशेषज्ञ',
      gu: 'પાક રોગ અને પોષણ નિષ્ણાત',
    },
    publishedDate: {
      en: 'June 20, 2026',
      hi: '20 जून, 2026',
      gu: '20 જૂન, 2026',
    },
    featured: false,
    introduction: {
      en: 'Plant leaves display clear chemical deficiency signs. Learning to read these visual diagnostic symptoms allows farmers to apply targeted foliar corrections before harvest yields are compromised.',
      hi: 'पौधों की पत्तियां पोषण की कमी के स्पष्ट संकेत देती हैं। इन लक्षणों को पहचानकर किसान समय रहते पत्तियों पर स्प्रे करके फसल को नुकसान से बचा सकते हैं।',
      gu: 'પાંદડાં પોષક તત્વોની ઉણપના સ્પષ્ટ સંકેતો આપે છે. આ લક્ષણો ઓળખીને ખેડૂત સમયસર સ્પ્રે કરીને પાકનું નુકસાન અટકાવી શકે છે.',
    },
    sections: [
      {
        heading: {
          en: 'Diagnostic Key: Old (Lower) vs New (Upper) Leaves',
          hi: 'पहचान की कुंजी: पुरानी (निचली) बनाम नई (ऊपरी) पत्तियां',
          gu: 'ઓળખવાની ચાવી: જૂના (નીચેના) વિરુદ્ધ નવા (ઉપરના) પાન',
        },
        content: {
          en: [
            '• Lower Leaf Yellowing: Nitrogen deficiency.\n• Lower Leaf Purpling: Phosphorus deficiency.\n• Lower Leaf Edge Scorch: Potassium deficiency.\n• Upper Leaf Interveinal Yellowing: Iron or Zinc deficiency.\n• Distorted Growing Tips: Calcium or Boron deficiency.',
          ],
          hi: [
            '• निचली पत्तियों का पीला पड़ना: नाइट्रोजन की कमी।\n• निचली पत्तियों का बैंगनी रंग: फास्फोरस की कमी।\n• निचली पत्तियों के किनारों का जलना: पोटाश की कमी।\n• नई ऊपरी पत्तियों की नसों के बीच पीलापन: जिंक या लोहे की कमी।\n• नई कलियों का मुड़ना या झड़ना: बोरॉन या कैल्शियम की कमी।',
          ],
          gu: [
            '• નીચેના પાન પીળા પડવા: નાઇટ્રોજનની ઉણપ.\n• નીચેના પાન જાંબલી થવા: ફોસ્ફરસની ઉણપ.\n• નીચેના પાનની કિનારી બળવી: પોટાશની ઉણપ.\n• ઉપરના નવા પાનની નસો વચ્ચે પીળાશ: ઝિંક અથવા લોહતત્વની ઉણપ.\n• નવી ડૂંખ કે કળીઓ વળી જવી: બોરોન અથવા કેલ્શિયમની ઉણપ.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Use foliar micronutrient sprays (Chelated Zinc, Ferrous Sulfate, Borax) for rapid 48-hour rescue remedies.',
        'Always cross-check visual leaf symptoms with an AGRISENSE soil analysis test.',
      ],
      hi: [
        'तुरंत असर के लिए पत्तियों पर सूक्ष्म पोषक तत्वों (चिलेटेड जिंक, फेरस सल्फेट, बोरॉन) का स्प्रे करें।',
        'लक्षणों की पुष्टि के लिए AGRISENSE मृदा विश्लेषण का उपयोग करें।',
      ],
      gu: [
        'ત્વરિત પરિણામ માટે પાંદડાં પર સૂક્ષ્મ તત્વો (ચિલેટેડ ઝિંક, ફેરસ સલ્ફેટ, બોરેક્સ) નો સ્પ્રે કરો.',
        'ખાતરી કરવા માટે AGRISENSE સોઈલ એનાલિસિસ ટેસ્ટ કરાવો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Deficiencies on lower leaves indicate mobile nutrients (N, P, K); symptoms on top leaves indicate immobile nutrients (Fe, Zn, B).',
        'Foliar micronutrient sprays provide immediate relief while soil amendments correct root causes.',
      ],
      hi: [
        'निचली पत्तियों पर N, P, K की कमी दिखती है; ऊपरी नई पत्तियों पर जिंक, लोहा, बोरॉन की कमी दिखती है।',
        'स्प्रे तुरंत राहत देता है जबकि मिट्टी में सुधार जड़ से समस्या को हल करता है।',
      ],
      gu: [
        'નીચેના પાન પર N, P, K ની ઉણપ દેખાય છે; ઉપરના નવા પાન પર ઝિંક, લોહતત્વ અને બોરોનની ઉણપ દેખાય છે.',
        'સ્પ્રે કરવાથી તરત ફાયદો થાય છે અને જમીન સુધારવાથી કાયમી ઉકેલ મળે છે.',
      ],
    },
    relatedArticleIds: ['npk-fundamentals', 'soil-ph', 'precision-soil-management'],
  },
  {
    id: 'building-soil-health',
    title: {
      en: 'Building Long-Term Soil Health: The Regenerative Playbook',
      hi: 'मिट्टी का दीर्घकालिक स्वास्थ्य: पुनर्योजी (Regenerative) कृषि नियम',
      gu: 'જમીનનું દીર્ઘકાલીન આરોગ્ય: કુદરતી રિજનરેટિવ ખેતીના નિયમો',
    },
    description: {
      en: 'How cover cropping, biochar, compost integration, and reduced tillage restore soil organic matter and drought resilience.',
      hi: 'कवर क्रॉप्स, बायोचार, देशी खाद और कम जुताई से मिट्टी के जैविक कार्बन और सूखे से लड़ने की ताकत को कैसे बढ़ाएं।',
      gu: 'કવર ક્રોપ, બાયોચાર, દેશી ખાતર અને ઓછી ખેડથી જમીનમાં કાર્બન અને દુષ્કાળ સામે લડવાની શક્તિ કેવી રીતે વધારવી.',
    },
    category: 'sustainable-farming',
    readTimeMinutes: 7,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Joshi',
    authorRole: {
      en: 'Regenerative Agriculture Specialist',
      hi: 'प्राकृतिक एवं पुनर्योजी कृषि विशेषज्ञ',
      gu: 'પ્રાકૃતિક અને રિજનરેટિવ એગ્રીકલ્ચર સ્પેશિયાલિસ્ટ',
    },
    publishedDate: {
      en: 'June 14, 2026',
      hi: '14 जून, 2026',
      gu: '14 જૂન, 2026',
    },
    featured: false,
    introduction: {
      en: 'High-yield precision agriculture invests in underlying soil biological capital. Regenerative practices increase soil organic carbon, boost water infiltration by 300%, and reduce total synthetic input needs over time.',
      hi: 'सफल कृषि केवल एक सीजन की पैदावार पर नहीं, बल्कि मिट्टी की जैविक ताकत पर ध्यान देती है। प्राकृतिक पद्धतियों से मिट्टी का कार्बन बढ़ता है, पानी सोखने की क्षमता 3 गुना बढ़ती है और खाद का खर्च घटता है।',
      gu: 'સફળ ખેતી માત્ર એક સીઝનની ઉપજ પર નહીં, પણ જમીનની જૈવિક શક્તિ પર આધાર રાખે છે. કુદરતી પદ્ધતિઓથી ઓર્ગેનિક કાર્બન વધે છે અને પાણી સંગ્રહવાની શક્તિ 3 ગણી વધે છે.',
    },
    sections: [
      {
        heading: {
          en: 'Increasing Soil Organic Carbon (SOC)',
          hi: 'मृदा जैविक कार्बन (SOC) बढ़ाना',
          gu: 'જમીનનો ઓર્ગેનિક કાર્બન (SOC) વધારવો',
        },
        content: {
          en: [
            'Every 1% increase in Soil Organic Carbon enables soil to hold an additional 150,000 liters of water per hectare. Adding well-decomposed Farmyard Manure or biochar fuels billions of beneficial soil microbes.',
          ],
          hi: [
            'मिट्टी में 1% जैविक कार्बन बढ़ने से प्रति हेक्टेयर 1.5 लाख लीटर अतिरिक्त पानी सोखने की क्षमता बढ़ती है। गोबर की सड़ी खाद डालने से मिट्टी के लाभकारी जीवाणुओं को भोजन मिलता है।',
          ],
          gu: [
            'જમીનમાં 1% ઓર્ગેનિક કાર્બન વધવાથી પ્રતિ હેક્ટર 1.5 લાખ લિટર વધુ પાણી સંગ્રહાય છે. સારું છાણિયું ખાતર નાખવાથી જમીનના કરોડો ઉપયોગી જીવાણુઓ સક્રિય થાય છે.',
          ],
        },
      },
    ],
    practicalTips: {
      en: [
        'Incorporate crop residues and stubble into the soil rather than burning field stalks.',
        'Apply 5–10 tons of organic compost per hectare every 2–3 years to maintain carbon balance.',
      ],
      hi: [
        'फसल के अवशेषों (पराली) को जलाने के बजाय मिट्टी में मिलाकर सड़ाएं।',
        'कार्बन संतुलन बनाए रखने के लिए हर 2-3 साल में 5-10 टन देशी खाद प्रति हेक्टेयर अवश्य डालें।',
      ],
      gu: [
        'પાકના અવશેષો (પરાળ) બાળવાને બદલે જમીનમાં દાટીને સડવા દો.',
        'જમીનની તાકાત જાળવી રાખવા દર 2-3 વર્ષે પ્રતિ હેક્ટર 5-10 ટન દેશી ખાતર આપો.',
      ],
    },
    keyTakeaways: {
      en: [
        'Healthy soil with high organic carbon withstands severe droughts and reduces synthetic fertilizer dependency.',
        'Regenerative practices protect long-term land asset valuation and farm profitability.',
      ],
      hi: [
        'उच्च जैविक कार्बन वाली मिट्टी सूखे का मुकाबला आसानी से करती है और खाद पर निर्भरता घटाती है।',
        'प्राकृतिक पद्धतियों से जमीन की उपजाऊ शक्ति और किसान का शुद्ध लाभ बढ़ता है।',
      ],
      gu: [
        'ઊંચો કાર્બન ધરાવતી જમીન દુષ્કાળ સામે ટકી રહે છે અને રાસાયણિક ખાતરનો ખર્ચ ઘટાડે છે.',
        'કુદરતી ખેતીથી જમીનની કિંમત અને ખેડૂતનો ચોખ્ખો નફો વધે છે.',
      ],
    },
    relatedArticleIds: ['over-fertilization', 'crop-rotation', 'precision-soil-management'],
  },
];

/**
 * Maps an internal category to translated localized label
 */
export const getCategoryLabel = (category: InsightCategory | 'all', lang: LanguageCode): string => {
  const categoryLabels: Record<InsightCategory | 'all', Record<LanguageCode, string>> = {
    'all': { en: 'All', hi: 'सभी', gu: 'બધા' },
    'soil-npk': { en: 'Soil & NPK', hi: 'मृदा और NPK', gu: 'માટી અને NPK' },
    'crop-management': { en: 'Crop Management', hi: 'फसल प्रबंधन', gu: 'પાક વ્યવસ્થાપન' },
    'fertilizers': { en: 'Fertilizers', hi: 'उर्वरक', gu: 'ખાતરો' },
    'weather-irrigation': { en: 'Weather & Irrigation', hi: 'मौसम और सिंचाई', gu: 'હવામાન અને પિયત' },
    'sustainable-farming': { en: 'Sustainable Farming', hi: 'टिकाऊ खेती', gu: 'ટકાઉ ખેતી' },
    'farmer-tips': { en: 'Farmer Tips', hi: 'किसान टिप्स', gu: 'ખેડૂત ટિપ્સ' },
  };

  return categoryLabels[category]?.[lang] || categoryLabels[category]?.['en'] || category;
};

/**
 * Returns read time formatted in target language
 */
export const formatReadTime = (minutes: number, lang: LanguageCode): string => {
  if (lang === 'hi') return `${minutes} मिनट`;
  if (lang === 'gu') return `${minutes} મિનિટ`;
  return `${minutes} min read`;
};

/**
 * Formats a localized article for display given a LanguageCode
 */
export const getLocalizedArticle = (article: InsightArticle, lang: LanguageCode): DisplayArticle => {
  const safeLang: LanguageCode = lang === 'hi' || lang === 'gu' ? lang : 'en';

  return {
    id: article.id,
    title: article.title[safeLang] || article.title.en,
    description: article.description[safeLang] || article.description.en,
    category: article.category,
    categoryLabel: getCategoryLabel(article.category, safeLang),
    readTime: formatReadTime(article.readTimeMinutes, safeLang),
    readTimeMinutes: article.readTimeMinutes,
    image: article.image,
    author: article.author,
    authorRole: article.authorRole[safeLang] || article.authorRole.en,
    publishedDate: article.publishedDate[safeLang] || article.publishedDate.en,
    featured: article.featured,
    introduction: article.introduction[safeLang] || article.introduction.en,
    sections: article.sections.map((s) => ({
      heading: s.heading[safeLang] || s.heading.en,
      content: s.content[safeLang] || s.content.en,
      listItems: s.listItems ? s.listItems[safeLang] || s.listItems.en : undefined,
    })),
    practicalTips: article.practicalTips[safeLang] || article.practicalTips.en,
    keyTakeaways: article.keyTakeaways[safeLang] || article.keyTakeaways.en,
    relatedArticleIds: article.relatedArticleIds,
  };
};

/**
 * Formats all localized farmer tips given a LanguageCode
 */
export const getLocalizedFarmerTips = (lang: LanguageCode): DisplayFarmerTip[] => {
  const safeLang: LanguageCode = lang === 'hi' || lang === 'gu' ? lang : 'en';

  return QUICK_FARMER_TIPS.map((tip) => ({
    id: tip.id,
    tip: tip.tip[safeLang] || tip.tip.en,
    category: getCategoryLabel(tip.categoryType, safeLang),
    categoryType: tip.categoryType,
    explanation: tip.explanation[safeLang] || tip.explanation.en,
  }));
};
