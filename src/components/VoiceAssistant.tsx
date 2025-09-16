import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface VoiceMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

const VoiceAssistant = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = getLanguageCode(language);
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleVoiceCommand(transcript);
        };
        
        recognitionRef.current.onerror = () => {
          setIsListening(false);
          setIsProcessing(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [language]);

  const getLanguageCode = (lang: string): string => {
    const languageCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN'
    };
    return languageCodes[lang as keyof typeof languageCodes] || 'en-US';
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setIsProcessing(false);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    setIsListening(false);
    setIsProcessing(true);
    
    // Add user message
    const userMessage: VoiceMessage = {
      type: 'user',
      content: command,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Process command and generate response
    const response = await processVoiceCommand(command);
    
    // Add assistant response
    const assistantMessage: VoiceMessage = {
      type: 'assistant',
      content: response.text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    
    // Navigate if needed
    if (response.navigation) {
      setTimeout(() => {
        navigate(response.navigation!);
        setIsOpen(false);
      }, 2000);
    }
    
    // Speak response
    speakResponse(response.text);
    
    setIsProcessing(false);
  };

  const processVoiceCommand = async (command: string): Promise<{text: string, navigation?: string}> => {
    const lowerCommand = command.toLowerCase();
    
    // Navigation patterns for different languages
    const navigationPatterns = {
      en: {
        crop: ['crop', 'plant', 'farming', 'sowing', 'harvest'],
        market: ['price', 'market', 'sell', 'buy', 'cost'],
        scheme: ['scheme', 'government', 'subsidy', 'loan'],
        expert: ['expert', 'help', 'advice', 'consultation'],
        camera: ['camera', 'disease', 'photo', 'picture', 'detect'],
        home: ['home', 'dashboard', 'main']
      },
      hi: {
        crop: ['फसल', 'पौधा', 'खेती', 'बोना', 'कटाई'],
        market: ['मूल्य', 'बाजार', 'बेचना', 'खरीदना', 'लागत'],
        scheme: ['योजना', 'सरकार', 'सब्सिडी', 'ऋण'],
        expert: ['विशेषज्ञ', 'सहायता', 'सलाह', 'परामर्श'],
        camera: ['कैमरा', 'बीमारी', 'फोटो', 'तस्वीर', 'पहचान'],
        home: ['होम', 'डैशबोर्ड', 'मुख्य']
      },
      ta: {
        crop: ['பயிர்', 'செடி', 'விவசாயம்', 'விதைத்தல்', 'அறுவடை'],
        market: ['விலை', 'சந்தை', 'விற்கவும்', 'வாங்கவும்', 'செலவு'],
        scheme: ['திட்டம்', 'அரசு', 'மானியம்', 'கடன்'],
        expert: ['நிபுணர்', 'உதவி', 'ஆலோசனை', 'ஆலோசனை'],
        camera: ['கேமரா', 'நோய்', 'புகைப்படம்', 'படம்', 'கண்டறிதல்'],
        home: ['முகப்பு', 'டாஷ்போர்டு', 'முக்கிய']
      },
      te: {
        crop: ['పంట', 'మొక్క', 'వ్యవసాయం', 'విత్తడం', 'కోత'],
        market: ['ధర', 'మార్కెట్', 'అమ్మడం', 'కొనడం', 'ఖర్చు'],
        scheme: ['పథకం', 'ప్రభుత్వం', 'సబ్సిడీ', 'రుణం'],
        expert: ['నిపుణుడు', 'సహాయం', 'సలహా', 'సంప్రదింపులు'],
        camera: ['కెమెరా', 'వ్యాధి', 'ఫోటో', 'చిత్రం', 'గుర్తించడం'],
        home: ['హోమ్', 'డాష్‌బోర్డ్', 'ప్రధాన']
      },
      bn: {
        crop: ['ফসল', 'গাছ', 'চাষাবাদ', 'বপন', 'ফসল কাটা'],
        market: ['মূল্য', 'বাজার', 'বিক্রয়', 'কেনা', 'খরচ'],
        scheme: ['পরিকল্পনা', 'সরকার', 'ভর্তুকি', 'ঋণ'],
        expert: ['বিশেষজ্ঞ', 'সাহায্য', 'পরামর্শ', 'পরামর্শ'],
        camera: ['ক্যামেরা', 'রোগ', 'ছবি', 'ছবি', 'সনাক্তকরণ'],
        home: ['হোম', 'ড্যাশবোর্ড', 'প্রধান']
      }
    };

    const patterns = navigationPatterns[language as keyof typeof navigationPatterns] || navigationPatterns.en;
    
    // Check for navigation intent
    for (const [page, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => lowerCommand.includes(keyword))) {
        const responses: Record<string, Record<string, string>> = {
          crop: {
            en: "Taking you to My Crops section where you can manage your farming activities.",
            hi: "आपको मेरी फसलें अनुभाग में ले जा रहे हैं जहाँ आप अपनी खेती की गतिविधियों का प्रबंधन कर सकते हैं।",
            ta: "உங்கள் விவசாய நடவடிக்கைகளை நிர்வகிக்கக்கூடிய என் பயிர்கள் பிரிவுக்கு அழைத்துச் செல்கிறது।",
            te: "మీ వ్యవసాయ కార్యకలాపాలను నిర్వహించగల నా పంటలు విభాగానికి తీసుకువెళుతున్నాను।",
            bn: "আপনার কৃষি কার্যক্রম পরিচালনা করতে পারেন এমন আমার ফসল বিভাগে নিয়ে যাচ্ছি।"
          },
          market: {
            en: "Opening Market Prices section to check current crop prices.",
            hi: "वर्तमान फसल की कीमतों की जांच के लिए बाजार मूल्य अनुभाग खोल रहे हैं।",
            ta: "தற்போதைய பயிர் விலைகளைச் சரிபார்க்க மார்க்கெட் பிரைஸ் பிரிவைத் திறக்கிறது।",
            te: "ప్రస్తుత పంట ధరలను తనిఖీ చేయడానికి మార్కెట్ ధరల విభాగాన్ని తెరుస్తున్నాను।",
            bn: "বর্তমান ফসলের দাম পরীক্ষা করতে মার্কেট প্রাইস বিভাগ খুলছি।"
          },
          scheme: {
            en: "Navigating to Government Schemes section for available programs.",
            hi: "उपलब्ध कार्यक्रमों के लिए सरकारी योजनाएं अनुभाग में जा रहे हैं।",
            ta: "கிடைக்கக்கூடிய திட்டங்களுக்கான அரசு திட்டங்கள் பிரிவுக்கு செல்கிறது।",
            te: "అందుబాటులో ఉన్న కార్యక్రమాల కోసం ప్రభుత్వ పథకాల విభాగానికి వెళుతున్నాను।",
            bn: "উপলব্ধ প্রোগ্রামের জন্য সরকারি প্রকল্প বিভাগে যাচ্ছি।"
          },
          expert: {
            en: "Taking you to Expert Help section for professional advice.",
            hi: "पेशेवर सलाह के लिए आपको विशेषज्ञ सहायता अनुभाग में ले जा रहे हैं।",
            ta: "தொழில்முறை ஆலோசனைக்காக நிபுணர் உதவி பிரிவுக்கு அழைத்துச் செல்கிறது।",
            te: "వృత్తిపరమైన సలహా కోసం నిపుణుల సహాయం విభాగానికి తీసుకువెళుతున్నాను।",
            bn: "পেশাদার পরামর্শের জন্য বিশেষজ্ঞ সাহায্য বিভাগে নিয়ে যাচ্ছি।"
          },
          camera: {
            en: "Opening Camera Detection to help identify crop diseases.",
            hi: "फसल की बीमारियों की पहचान में मदद के लिए कैमरा डिटेक्शन खोल रहे हैं।",
            ta: "பயிர் நோய்களைக் கண்டறிய உதவும் கேமரா கண்டறிதலைத் திறக்கிறது।",
            te: "పంట వ్యాధులను గుర్తించడంలో సహాయపడటానికి కెమెరా గుర్తింపును తెరుస్తున్నాను।",
            bn: "ফসলের রোগ চিহ্নিত করতে সাহায্য করার জন্য ক্যামেরা সনাক্তকরণ খুলছি।"
          },
          home: {
            en: "Going back to home dashboard.",
            hi: "होम डैशबोर्ड पर वापस जा রहे हैं।",
            ta: "முகப்பு டாஷ்போர்டுக்குத் திரும்பிச் செல்கிறது।",
            te: "హోమ్ డాష్‌బోర్డుకు తిరిగి వెళుతున్నాను।",
            bn: "হোম ড্যাশবোর্ডে ফিরে যাচ্ছি।"
          }
        };

        const navigationMap = {
          crop: '/dashboard/my-crop',
          market: '/dashboard/market-price',
          scheme: '/dashboard/government-schemes',
          expert: '/dashboard/expert-help',
          camera: '/dashboard/camera-detection',
          home: '/dashboard'
        };

        return {
          text: responses[page][language] || responses[page].en,
          navigation: navigationMap[page as keyof typeof navigationMap]
        };
      }
    }

    // Default response for unrecognized commands
    const defaultResponses = {
      en: "I understand you want to know about farming. You can ask me about crops, market prices, government schemes, or get expert help. Try saying 'show my crops' or 'market prices'.",
      hi: "मैं समझता हूँ कि आप कृषि के बारे में जानना चाहते हैं। आप मुझसे फसलों, बाजार की कीमतों, सरकारी योजनाओं के बारे में पूछ सकते हैं या विशेषज्ञ की मदद ले सकते हैं। 'मेरी फसल दिखाएं' या 'बाजार की कीमतें' कहने की कोशिश करें।",
      ta: "நீங்கள் விவசாயத்தைப் பற்றி அறிய விரும்புகிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன். பயிர்கள், சந்தை விலைகள், அரசு திட்டங்கள் அல்லது நிபுணர் உதவி பற்றி என்னிடம் கேட்கலாம். 'என் பயிர்களைக் காட்டு' அல்லது 'சந்தை விலைகள்' என்று சொல்ல முயற்சிக்கவும்.",
      te: "మీరు వ్యవసాయం గురించి తెలుసుకోవాలని అనుకుంటున్నారని నేను అర్థం చేసుకున్నాను। పంటలు, మార్కెట్ ధరలు, ప్రభుత్వ పథకాలు లేదా నిపుణుల సహాయం గురించి నన్ను అడగవచ్చు. 'నా పంటలను చూపించు' లేదా 'మార్కెట్ ధరలు' అని చెప్పడానికి ప్రయత్నించండి।",
      bn: "আমি বুঝতে পারছি আপনি কৃষি সম্পর্কে জানতে চান। আপনি ফসল, বাজার দর, সরকারি প্রকল্প বা বিশেষজ্ঞের সাহায্য সম্পর্কে আমাকে জিজ্ঞাসা করতে পারেন। 'আমার ফসল দেখান' বা 'বাজার দর' বলার চেষ্টা করুন।"
    };

    return {
      text: defaultResponses[language as keyof typeof defaultResponses] || defaultResponses.en
    };
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (isOpen && isListening) {
      stopListening();
    }
  };

  return (
    <>
      {/* Floating Voice Assistant Button */}
      <Button
        onClick={toggleAssistant}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "border-2 border-white/20 backdrop-blur-sm",
          "transform transition-all duration-300 hover:scale-110",
          isOpen && "bg-secondary hover:bg-secondary/90"
        )}
        size="icon"
      >
        <Mic className="h-6 w-6" />
      </Button>

      {/* Voice Assistant Interface */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-80 max-h-96 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{t('voiceAssistant')}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('tapToSpeak')}
                </p>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-2 rounded-lg text-sm",
                    message.type === 'user'
                      ? "bg-primary text-primary-foreground ml-4"
                      : "bg-muted mr-4"
                  )}
                >
                  <div className="font-medium mb-1">
                    {message.type === 'user' ? '👤' : '🤖'} {message.type === 'user' ? 'You' : t('aiResponse')}
                  </div>
                  <div>{message.content}</div>
                </div>
              ))}
            </div>

            {/* Voice Controls */}
            <div className="flex gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                variant={isListening ? "destructive" : "farmer"}
                className="flex-1"
                size="sm"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    {t('listeningForCommand')}
                  </>
                ) : isProcessing ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    {t('tapToSpeak')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};


export default VoiceAssistant;