import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MOCK_CROPS } from '../data/crops';
import { GlassCard } from '../components/common/GlassCard';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Mic,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  Copy,
  ArrowDown,
  Sprout,
  Sliders,
  MapPin,
  Globe,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  Lightbulb,
} from 'lucide-react';

interface StructuredAiResponse {
  answer: string;
  recommendation: string;
  note: string;
  nextAction: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  structuredResponse?: StructuredAiResponse;
  timestamp: string;
}

export const AssistantPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const { isListening, toggleListening, isSupported } = useSpeechRecognition({
    language,
    onTranscript: (text) => setInput(text),
    onError: (err) => {
      showToast(t('aiAssistant.voiceInput', 'Voice Input'), err, 'error');
    },
  });

  const handleMicClick = () => {
    if (!isSupported) {
      showToast(
        t('aiAssistant.voiceInput', 'Voice Input'),
        'Speech recognition is not supported by your browser.',
        'warning'
      );
      return;
    }
    toggleListening(input);
  };

  const soilTypeOptions = [
    { id: 'soilLoamy', key: 'aiAssistant.soilLoamy', defaultLabel: 'Loamy Soil (Balanced)' },
    { id: 'soilBlack', key: 'aiAssistant.soilBlack', defaultLabel: 'Black Cotton Soil (Deep Clay)' },
    { id: 'soilRed', key: 'aiAssistant.soilRed', defaultLabel: 'Red Clay Soil (Iron rich)' },
    { id: 'soilSandy', key: 'aiAssistant.soilSandy', defaultLabel: 'Sandy Soil (High Drainage)' },
    { id: 'soilSilty', key: 'aiAssistant.soilSilty', defaultLabel: 'Silty Soil (River Basin)' },
    { id: 'soilAlluvial', key: 'aiAssistant.soilAlluvial', defaultLabel: 'Alluvial Soil (Fertile Plain)' },
  ];

  // Context Selection States
  const [selectedCropId, setSelectedCropId] = useState<string>(MOCK_CROPS[0].id);
  const [selectedSoilTypeKey, setSelectedSoilTypeKey] = useState<string>('soilLoamy');
  const [userLocation, setUserLocation] = useState<string>('Anand, Gujarat');

  const selectedCrop = MOCK_CROPS.find((c) => c.id === selectedCropId) || MOCK_CROPS[0];
  const cropDisplayName = selectedCrop.localNames?.[language] || selectedCrop.name;
  const currentSoilTypeLabel = t(
    soilTypeOptions.find((s) => s.id === selectedSoilTypeKey)?.key || 'aiAssistant.soilLoamy',
    'Loamy Soil (Balanced)'
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const getInitialGreeting = (): ChatMessage => ({
    id: 'msg_welcome',
    sender: 'ai',
    structuredResponse: {
      answer: t(
        'aiAssistant.welcomeMessage',
        `Hello! I am your AI Soil & Fertilizer Assistant. How can I help your crop yields today?`
      ),
      recommendation: t(
        'aiAssistant.initialRec',
        `Ask me any question regarding NPK dosage calculation, leaf yellowing diagnosis, soil pH correction, or fertilizer split timing.`
      ),
      note: t(
        'aiAssistant.initialNote',
        `You can customize your target crop, soil type, and location in the Agricultural Context panel on the side.`
      ),
      nextAction: t(
        'aiAssistant.initialNext',
        `Click any quick question suggestion below or type your query to begin.`
      ),
    },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialGreeting()]);

  // Reactive translation update for initial greeting message when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === 'msg_welcome') {
          return {
            ...msg,
            structuredResponse: {
              answer: t(
                'aiAssistant.welcomeMessage',
                `Hello! I am your AI Soil & Fertilizer Assistant. How can I help your crop yields today?`
              ),
              recommendation: t(
                'aiAssistant.initialRec',
                `Ask me any question regarding NPK dosage calculation, leaf yellowing diagnosis, soil pH correction, or fertilizer split timing.`
              ),
              note: t(
                'aiAssistant.initialNote',
                `You can customize your target crop, soil type, and location in the Agricultural Context panel on the side.`
              ),
              nextAction: t(
                'aiAssistant.initialNext',
                `Click any quick question suggestion below or type your query to begin.`
              ),
            },
          };
        }
        return msg;
      })
    );
  }, [language, selectedCropId, selectedSoilTypeKey, userLocation, t]);

  const prevMessageCountRef = useRef(messages.length);

  // Scroll ONLY the inner chat container (never the page window) when a new message is added
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current || isLoading) {
      scrollToBottom('smooth');
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, isLoading]);

  // Check scroll position to display scroll to bottom button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 100);
  };

  // Helper for generating structured agronomic AI responses localized by active language
  const generateMockAiResponse = (query: string): StructuredAiResponse => {
    const qLower = query.toLowerCase();

    // Yellow Leaves / Chlorosis Query
    if (
      qLower.includes('yellow') ||
      qLower.includes('leaf') ||
      qLower.includes('deficiency') ||
      qLower.includes('पीली') ||
      qLower.includes('પીળા')
    ) {
      if (language === 'hi') {
        return {
          answer: `${cropDisplayName} (${currentSoilTypeLabel}) की निचली पत्तियों का पीला पड़ना आमतौर पर नाइट्रोजन (N) की कमी या जलभराव के कारण होता है। ऊपरी पत्तियों का पीलापन लोहे या सल्फर की कमी का संकेत देता है।`,
          recommendation: `नीम लेपित यूरिया (46% N) 30-45 किग्रा/हेक्टेयर की दर से दें या 1% मैग्नीशियम सल्फेट + जिंक सल्फेट के घोल का छिड़काव करें।`,
          note: `यूरिया डालने से पहले खेत में पानी की निकासी सुनिश्चित करें ताकि जड़ें नाइट्रोजन को आसानी से अवशोषित कर सकें।`,
          nextAction: `उर्वरक सलाहकार विज़ार्ड में एनपीके पोषक तत्वों की कमी की जांच करें।`,
        };
      }
      if (language === 'gu') {
        return {
          answer: `${currentSoilTypeLabel} માં વાવેલા ${cropDisplayName} ના નીચલા પાંદડા પીળા થવા એ સામાન્ય રીતે નાઇટ્રોજન (N) ની ઉણપ અથવા પાણી ભરાવાને કારણે થાય છે. ઉપરના પાંદડા પીળા થવા એ આયર્ન અથવા સલ્ફરની ઉણપ દર્શાવે છે.`,
          recommendation: `30-45 કિગ્રા/હેક્ટરના દરે લીમડા યુક્ત યુરિયા (46% N) આપો અથવા 1% મેગ્નેશિયમ સલ્ફેટ + ઝીંક સલ્ફેટ દવાનો છંટકાવ કરો.`,
          note: `યુરિયા આપતા પહેલા ખેતરમાંથી નકામા પાણીનો નિકાલ કરો જેથી મૂળ નાઇટ્રોજન સરળતાથી શોષી શકે.`,
          nextAction: `ખાતર સલાહકાર વિઝાર્ડમાં NPK પોષક તત્વોની ઉણપ તપાસો.`,
        };
      }
      return {
        answer: `Yellowing of lower leaves in ${cropDisplayName} grown in ${currentSoilTypeLabel} typically indicates Nitrogen (N) deficiency or waterlogging induced root hypoxia. Upper leaf chlorosis suggests Iron or Sulfur shortage.`,
        recommendation: `Apply top-dressing of Neem Coated Urea (46% N) at 30-45 kg/ha or spray 1% Magnesium Sulfate + Zinc Sulfate solution if interveinal chlorosis is present.`,
        note: `Ensure field drainage is clear before top-dressing urea so roots absorb nitrogen without anaerobic leaching.`,
        nextAction: `Check NPK nutrient deficit status in the Fertilizer Advisor wizard.`,
      };
    }

    // Dosage / Quantity Query
    if (
      qLower.includes('how much') ||
      qLower.includes('dosage') ||
      qLower.includes('quantity') ||
      qLower.includes('मात्रा') ||
      qLower.includes('જથ્થો')
    ) {
      if (language === 'hi') {
        return {
          answer: `${cropDisplayName} के लिए आदर्श एनपीके आवश्यकताएं हैं: नाइट्रोजन: ${selectedCrop.idealNPK.n} किग्रा/हेक्टेयर, फास्फोरस: ${selectedCrop.idealNPK.p} किग्रा/हेक्टेयर, पोटेशियम: ${selectedCrop.idealNPK.k} किग्रा/हेक्टेयर।`,
          recommendation: `बुआई के समय डीएपी (100 किग्रा/हेक्टेयर) + एमओपी (50 किग्रा/हेक्टेयर) की आधार खुराक दें, इसके बाद 21 और 45 दिनों पर यूरिया की विभाजित खुराक दें।`,
          note: `यदि वर्मीकंपोस्ट (2 टन/हेक्टेयर) का उपयोग कर रहे हैं तो रासायनिक यूरिया की आवश्यकता 20% कम हो जाती है।`,
          nextAction: `सलाहकार पृष्ठ पर अपने खेत के आकार के लिए सटीक बैग की आवश्यकता की गणना करें।`,
        };
      }
      if (language === 'gu') {
        return {
          answer: `${cropDisplayName} માટે યોગ્ય NPK જરૂરિયાત: નાઇટ્રોજન: ${selectedCrop.idealNPK.n} કિગ્રા/હેક્ટર, ફોસ્ફરસ: ${selectedCrop.idealNPK.p} કિગ્રા/હેક્ટર, પોટેશિયમ: ${selectedCrop.idealNPK.k} કિગ્રા/હેક્ટર છે.`,
          recommendation: `વાવણી સમયે DAP (100 કિગ્રા/હેક્ટર) + MOP (50 કિગ્રા/હેક્ટર) પાયાના ખાતર તરીકે આપો, ત્યારબાદ 21 અને 45 દિવસે યુરિયા આપો.`,
          note: `જો સેન્દ્રિય વર્મીકમ્પોસ્ટ (2 ટન/હેક્ટર) વાપરતા હોવ તો રાસાયણિક ખાતરની જરૂરિયાત 20% ઘટે છે.`,
          nextAction: `સલાહકાર પૃષ્ઠ પર તમારા ખેતર માટે ખાતરના થેલાની ગણતરી કરો.`,
        };
      }
      return {
        answer: `For ${cropDisplayName}, ideal NPK requirements are Nitrogen: ${selectedCrop.idealNPK.n} kg/ha, Phosphorus: ${selectedCrop.idealNPK.p} kg/ha, Potassium: ${selectedCrop.idealNPK.k} kg/ha.`,
        recommendation: `Apply basal dose of DAP (100 kg/ha) + MOP (50 kg/ha) at sowing, followed by split Urea applications (50 kg/ha each) at 21 and 45 days post-germination.`,
        note: `Adjust final chemical dosage if incorporating organic vermicompost (2 tonnes/ha reduces chemical N requirement by 20%).`,
        nextAction: `Calculate precise bag requirements for your field size on the Advisor page.`,
      };
    }

    // Best Fertilizer Query
    if (
      qLower.includes('best fertilizer') ||
      qLower.includes('which fertilizer') ||
      qLower.includes('recommend') ||
      qLower.includes('खाद') ||
      qLower.includes('ખાતર')
    ) {
      if (language === 'hi') {
        return {
          answer: `${currentSoilTypeLabel} में ${cropDisplayName} के लिए सबसे अच्छा शुरुआती उर्वरक डाई-अमोनियम फॉस्फेट (DAP 18-46-0) नीम लेपित यूरिया और म्यूटेट ऑफ पोटाश (MOP 0-0-60) के साथ है।`,
          recommendation: `शुरुआती जड़ों के विकास के लिए डीएपी, पत्तियों की हरियाली के लिए यूरिया और तने की मजबूती के लिए एमओपी का उपयोग करें।`,
          note: `क्षारीय मिट्टी (pH > 7.8) के लिए स्थानीय पीएच को कम करने के लिए यूरिया के बजाय अमोनियम सल्फेट पर विचार करें।`,
          nextAction: `उर्वरक पुस्तकालय में पूर्ण तकनीकी विवरण देखें।`,
        };
      }
      if (language === 'gu') {
        return {
          answer: `${currentSoilTypeLabel} માં ${cropDisplayName} માટે ઉત્તમ પાયાનું ખાતર ડાય-એમોનિયમ ફોસ્ફેટ (DAP 18-46-0) સાથે લીમડા યુક્ત યુરિયા અને પોટાશ (MOP 0-0-60) છે.`,
          recommendation: `મૂળના વિકાસ માટે DAP, પાંદડાની વૃદ્ધિ માટે યુરિયા અને છોડની મજબૂતાઈ માટે MOP નો ઉપયોગ કરો.`,
          note: `મોળી જમીન (pH > 7.8) માટે જમીનનો pH ઘટાડવા યુરિયાની જગ્યાએ એમોનિયમ સલ્ફેટ વાપરી શકાય.`,
          nextAction: `ખાતર લાઈબ્રેરીમાં સંપૂર્ણ ટેકનિકલ માહિતી જુઓ.`,
        };
      }
      return {
        answer: `The premier starter fertilizer for ${cropDisplayName} in ${currentSoilTypeLabel} is Di-Ammonium Phosphate (DAP 18-46-0) combined with Neem Coated Urea and Muriate of Potash (MOP 0-0-60).`,
        recommendation: `Use DAP for early root branching, Urea for leaf canopy vigor, and MOP for stalk rigidity and grain weight development.`,
        note: `For alkaline soils (pH > 7.8), consider Ammonium Sulfate instead of Urea to lower localized root zone pH.`,
        nextAction: `Explore complete technical profiles in the Fertilizer Library.`,
      };
    }

    // NPK Ratio Query
    if (
      qLower.includes('npk') ||
      qLower.includes('explain') ||
      qLower.includes('अनुपात') ||
      qLower.includes('ગુણોત્તર')
    ) {
      if (language === 'hi') {
        return {
          answer: `एनपीके का अर्थ नाइट्रोजन (N), फास्फोरस (P), और पोटेशियम (K) है - जो फसलों के विकास के लिए प्राथमिक पोषक तत्व हैं।`,
          recommendation: `नाइट्रोजन पत्तियों और वनस्पति वृद्धि को बढ़ाता है; फास्फोरस जड़ों और फूलों को मजबूत करता है; पोटेशियम रोगों से लड़ने की क्षमता बढ़ाता है।`,
          note: `पर्याप्त पोटाश के बिना अधिक नाइट्रोजन देने से तेज हवाओं के दौरान पौधे गिर सकते हैं।`,
          nextAction: `कृषि इनसाइट्स पृष्ठ पर इंटरेक्टिव एनपीके संतुलन चार्ट की समीक्षा करें।`,
        };
      }
      if (language === 'gu') {
        return {
          answer: `NPK એટલે નાઇટ્રોજન (N), ફોસ્ફરસ (P), અને પોટેશિયમ (K) - જે પાકના વિકાસ માટે મુખ્ય પોષક તત્વો છે.`,
          recommendation: `નાઇટ્રોજન પાંદડા અને વિકાસ માટે; ફોસ્ફરસ મૂળ અને ફૂલ માટે; પોટેશિયમ રોગ પ્રતિકારક શક્તિ અને દાણાના વજન માટે છે.`,
          note: `પોટાશ વિના વધુ પડતું નાઇટ્રોજન આપવાથી પવનમાં પાક ઢળી શકે છે.`,
          nextAction: `એગ્રી ઇનસાઇટ્સ પેજ પર NPK સંતુલન ચાર્ટ જુઓ.`,
        };
      }
      return {
        answer: `NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K) — the primary macronutrients required for crop life cycles.`,
        recommendation: `N (Cyan) drives foliage & vegetative growth; P (Violet) fuels root branching & early bloom; K (Amber) strengthens pest resistance & fruit quality.`,
        note: `Over-applying Nitrogen without adequate Potassium leads to lodging (stem collapse) during high winds.`,
        nextAction: `Review interactive NPK balance charts on the Farm Insights page.`,
      };
    }

    // Default Response
    if (language === 'hi') {
      return {
        answer: `${userLocation} में ${currentSoilTypeLabel} पर ${cropDisplayName} के लिए वर्तमान विकास चरण के दौरान संतुलित पोषण बहुत महत्वपूर्ण है।`,
        recommendation: `शीर्ष खाद डालने से पहले मिट्टी के पीएच और कार्बनिक कार्बन का परीक्षण सुनिश्चित करें। इष्टतम सूक्ष्मजीव गतिविधि के लिए रासायनिक एनपीके को जैविक खाद के साथ मिलाएं।`,
        note: `दानेदार उर्वरक डालने से पहले मिट्टी में 40-60% नमी बनाए रखें।`,
        nextAction: `उर्वरक सलाहकार में पूर्ण एआई मिट्टी गणना चलाएं।`,
      };
    }
    if (language === 'gu') {
      return {
        answer: `${userLocation} માં ${currentSoilTypeLabel} પર ${cropDisplayName} માટે વર્તમાન તબક્કે સંતુલિત ખાતર આપવું ખૂબ જરૂરી છે.`,
        recommendation: `ખાતર આપતા પહેલા જમીન ચકાસણી કરો. સારો પાક મેળવવા રાસાયણિક ખાતર સાથે સેન્દ્રિય ખાતરનો ઉપયોગ કરો.`,
        note: `ખાતર આપતા પહેલા જમીનમાં 40-60% ભેજ હોવો જરૂરી છે.`,
        nextAction: `ખાતર સલાહકારમાં સંપૂર્ણ AI જમીન ગણતરી કરો.`,
      };
    }
    return {
      answer: `Based on your selected context for ${cropDisplayName} in ${currentSoilTypeLabel} (${userLocation}), balanced nutrition is vital during current growth stage.`,
      recommendation: `Ensure baseline soil testing for pH and organic carbon before applying top-dressing fertilizers. Combine chemical NPK with organic manure for optimal microbial activity.`,
      note: `Maintain optimum soil moisture (40-60%) prior to applying high-concentration granular fertilizers.`,
      nextAction: `Run full AI soil calculation in the Fertilizer Advisor.`,
    };
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (isLoading || !textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const structured = generateMockAiResponse(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        structuredResponse: structured,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(t('aiAssistant.copy', 'Copy'), 'AI response text copied to clipboard.', 'info');
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg && lastUserMsg.text) {
      handleSend(lastUserMsg.text);
    }
  };

  const handleNewChat = () => {
    setMessages([getInitialGreeting()]);
    showToast(t('aiAssistant.newChat', 'New Chat'), 'Conversation reset with active context.', 'info');
  };

  const handleClearChat = () => {
    setMessages([]);
    showToast(t('aiAssistant.clearChat', 'Clear Chat'), 'All messages removed.', 'info');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActionSuggestions = [
    t('aiAssistant.suggested1', 'What fertilizer should I use for wheat?'),
    t('aiAssistant.suggested2', 'Why are my crop leaves turning yellow?'),
    t('aiAssistant.suggested3', 'How to cure soil pH imbalance?'),
    t('aiAssistant.suggested4', 'Explain optimal NPK split timing'),
  ];

  return (
    <div className="pt-28 pb-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-300">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('aiAssistant.statusActive', 'AI Advisor Active')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('aiAssistant.windowTitle', 'AGRISENSE Assistant')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {t(
              'aiAssistant.welcomeMessage',
              'Instant agronomic guidance, NPK dosage calculations, and deficiency diagnosis.'
            )}
          </p>
        </div>

        {/* Toolbar Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('aiAssistant.newChat', 'New Chat')}</span>
          </button>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-[#121614] px-3.5 py-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('aiAssistant.clearChat', 'Clear Chat')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Chat Interface + Right Agricultural Context Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Interface Column */}
        <div className="lg:col-span-8 space-y-4 flex flex-col h-[660px] relative">
          {/* Messages Scroll Viewport */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-4 sm:p-6 shadow-sm space-y-5 relative"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-20 text-slate-500 dark:text-slate-400">
                <Bot className="h-12 w-12 text-emerald-500/40" />
                <p className="text-xs font-semibold">
                  {t(
                    'aiAssistant.noMessages',
                    'No messages in chat. Type a question or select a suggestion below.'
                  )}
                </p>
                <button
                  onClick={handleNewChat}
                  className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {t('aiAssistant.startNewSession', 'Start New Session')}
                </button>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  {/* Message Bubble Content */}
                  <div
                    className={`max-w-[88%] space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-3xl rounded-br-none px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm'
                        : 'w-full'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <div>
                        <p>{msg.text}</p>
                        <div className="mt-1 text-[9px] opacity-80 text-right font-mono">{msg.timestamp}</div>
                      </div>
                    ) : (
                      /* Structured AI Response Card */
                      <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#151A18] space-y-3.5 p-5 shadow-sm text-xs leading-relaxed">
                        {/* Top AI Badge & Timestamp */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              <Sparkles className="h-3 w-3" />
                              <span>{t('aiAssistant.aiResponse', 'AGRISENSE Response')}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {t('aiAssistant.contextLabel', 'Context:')} {cropDisplayName} ({currentSoilTypeLabel})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">{msg.timestamp}</span>
                            {msg.structuredResponse && (
                              <button
                                onClick={() =>
                                  handleCopyResponse(
                                    `${msg.structuredResponse?.answer}\n\nRecommendation: ${msg.structuredResponse?.recommendation}`
                                  )
                                }
                                className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1 cursor-pointer"
                                title={t('aiAssistant.copy', 'Copy')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Structured Sections */}
                        {msg.structuredResponse && (
                          <div className="space-y-3">
                            {/* Answer */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wider block">
                                {t('aiAssistant.agronomicDiagnosis', '💬 Agronomic Diagnosis')}
                              </span>
                              <p className="text-slate-900 dark:text-slate-100 font-semibold text-xs">
                                {msg.structuredResponse.answer}
                              </p>
                            </div>

                            {/* Recommendation */}
                            <div className="rounded-2xl bg-emerald-500/10 dark:bg-[#171C19] p-3.5 border border-emerald-500/30 space-y-1">
                              <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span>{t('aiAssistant.recommendedAction', 'Recommended Action')}</span>
                              </span>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {msg.structuredResponse.recommendation}
                              </p>
                            </div>

                            {/* Important Note */}
                            <div className="rounded-2xl bg-amber-500/10 dark:bg-[#171C19] p-3 border border-amber-500/30 space-y-1">
                              <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                <span>{t('aiAssistant.importantNote', 'Important Note')}</span>
                              </span>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                                {msg.structuredResponse.note}
                              </p>
                            </div>

                            {/* Suggested Next Action */}
                            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                              <span className="text-slate-600 dark:text-slate-400 font-bold">
                                {t('aiAssistant.suggestedNextAction', 'Suggested Next Action:')}{' '}
                                <strong className="text-slate-900 dark:text-white">{msg.structuredResponse.nextAction}</strong>
                              </span>
                              <button
                                onClick={() => navigate('/advisor')}
                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                              >
                                {t('aiAssistant.goToAdvisor', 'Go to Advisor →')}
                              </button>
                            </div>
                          </div>
                        )}
                      </GlassCard>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-xs mt-1 shadow-sm">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-600 dark:text-slate-400 italic pl-11">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold">
                  {t(
                    'aiAssistant.analyzingStatus',
                    'AI Assistant analyzing soil parameters & crop biology...'
                  )}
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="absolute bottom-20 right-6 z-20 p-2.5 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 transition-all duration-300 cursor-pointer"
              title={t('aiAssistant.scrollToLatest', 'Scroll to latest message')}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          )}

          {/* Quick Suggestions Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              <span>{t('aiAssistant.suggestions', 'Suggestions:')}</span>
            </span>
            {quickActionSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="shrink-0 text-[11px] font-extrabold rounded-xl bg-white dark:bg-[#121614] px-3.5 py-1.5 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-300 dark:border-slate-800 shadow-sm transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Bottom Fixed Input Controls Bar */}
          <div className="rounded-3xl p-3 border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] shadow-md flex items-center gap-2">
            {/* Image Upload Button */}
            <button
              onClick={() =>
                showToast(
                  t('aiAssistant.uploadImage', 'Upload Leaf Image'),
                  '📷 Image Diagnosis Module - Coming Soon!',
                  'info'
                )
              }
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              title={t('aiAssistant.uploadImage', 'Upload Leaf Image')}
            >
              <ImageIcon className="h-4 w-4" />
            </button>

            {/* Voice Input Button */}
            <button
              onClick={handleMicClick}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-[#171C19] border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
              title={t('aiAssistant.voiceInput', 'Voice Input')}
            >
              <Mic className="h-4 w-4" />
            </button>

            {/* Main Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? t('aiAssistant.micSimulated', 'Listening... Speak your crop question')
                  : t('aiAssistant.placeholder', 'Ask a question about your crop, soil test, or fertilizer dosage...')
              }
              className="flex-1 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />

            {/* Regenerate Button if messages exist */}
            {messages.length > 1 && (
              <button
                onClick={handleRegenerate}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
                title={t('aiAssistant.regenerate', 'Regenerate')}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`p-2.5 rounded-2xl bg-emerald-600 text-white transition-all shadow-md ${
                isLoading || !input.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-emerald-500 active:scale-95 cursor-pointer'
              }`}
              title={t('aiAssistant.send', 'Send')}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Agricultural Context Panel Column */}
        <div className="lg:col-span-4 space-y-5">
          <GlassCard className="border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121614] p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Sprout className="h-5 w-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {t('aiAssistant.agriContext', 'Agricultural Context')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  {t('aiAssistant.agriContextSub', 'Personalize AI responses to your field parameters')}
                </p>
              </div>
            </div>

            {/* Crop Selector (From MOCK_CROPS) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('aiAssistant.targetCrop', 'Target Crop')}</span>
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {MOCK_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.localNames?.[language] || c.name} ({c.season})
                  </option>
                ))}
              </select>
            </div>

            {/* Soil Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('aiAssistant.soilTextureType', 'Soil Texture Type')}</span>
              </label>
              <select
                value={selectedSoilTypeKey}
                onChange={(e) => setSelectedSoilTypeKey(e.target.value)}
                className="w-full rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {soilTypeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(opt.key, opt.defaultLabel)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Region Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('aiAssistant.locationRegion', 'Location / Region')}</span>
              </label>
              <input
                type="text"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                placeholder="e.g. Anand, Gujarat"
                className="w-full rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-[#171C19] border border-slate-300 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Language Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t('aiAssistant.assistantLanguage', 'Assistant Language')}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'gu', label: 'ગુજરાતી' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      language === lang.code
                        ? 'bg-emerald-500 text-white shadow-glow-sm'
                        : 'bg-slate-100 dark:bg-[#171C19] text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 border border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Context Summary Badge */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                {t('aiAssistant.activeContextSummary', 'Active Context Summary:')}
              </span>
              <p>
                • {t('aiAssistant.summaryTarget', 'Target:')}{' '}
                <strong className="text-slate-900 dark:text-white">{cropDisplayName}</strong> ({selectedCrop.season})
              </p>
              <p>
                • {t('aiAssistant.summaryNpks', 'NPK Target:')}{' '}
                <strong className="text-cyan-600 dark:text-cyan-400">{selectedCrop.idealNPK.n}</strong>-
                <strong className="text-violet-600 dark:text-violet-400">{selectedCrop.idealNPK.p}</strong>-
                <strong className="text-amber-600 dark:text-amber-400">{selectedCrop.idealNPK.k}</strong> kg/ha
              </p>
              <p>
                • {t('aiAssistant.summarySoilRegion', 'Soil & Region:')}{' '}
                <strong className="text-slate-900 dark:text-white">{currentSoilTypeLabel}</strong> ({userLocation})
              </p>
            </div>
          </GlassCard>

          {/* Helpful Tips Card */}
          <GlassCard className="border border-emerald-500/20 bg-emerald-500/5 dark:bg-[#121614] p-4 space-y-2">
            <h4 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-emerald-500" />
              <span>{t('aiAssistant.promptingTipsTitle', 'Agronomic Prompting Tips')}</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{t('aiAssistant.tip1', 'Ask about split Urea timing during vegetative tiller stage.')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{t('aiAssistant.tip2', 'Query deficiency symptoms (e.g. leaf tip burning or purple veins).')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{t('aiAssistant.tip3', 'Ask how organic vermicompost alters soil moisture retention.')}</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
