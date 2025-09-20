import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Video, 
  Clock, 
  Star, 
  Send, 
  Users,
  Leaf,
  Bug,
  Droplets,
  Sun,
  Bot,
  Loader2,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Mic,
  MicOff
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ExpertHelp = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [queryForm, setQueryForm] = useState({
    description: ""
  });
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recentQueries, setRecentQueries] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);

  // Check for speech synthesis and recognition support
  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
    setSpeechRecognitionSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sample experts data
  const experts = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      title: "Agricultural Scientist",
      specialization: "Crop Management",
      experience: "15 years",
      rating: 4.8,
      location: "Punjab Agricultural University",
      availability: "Available",
      languages: ["Hindi", "English", "Punjabi"],
      expertise: ["Rice cultivation", "Pest management", "Soil health"],
      consultationFee: "Free",
      responseTime: "2-4 hours"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      title: "Plant Pathologist",
      specialization: "Disease Management",
      experience: "12 years",
      rating: 4.9,
      location: "IARI, New Delhi",
      availability: "Available",
      languages: ["Hindi", "English"],
      expertise: ["Plant diseases", "Organic farming", "IPM"],
      consultationFee: "Free",
      responseTime: "1-3 hours"
    },
    {
      id: 3,
      name: "Suresh Patel",
      title: "Extension Officer",
      specialization: "General Agriculture",
      experience: "8 years",
      rating: 4.6,
      location: "Gujarat State Agriculture Dept",
      availability: "Busy",
      languages: ["Gujarati", "Hindi", "English"],
      expertise: ["Cotton farming", "Water management", "Government schemes"],
      consultationFee: "Free",
      responseTime: "4-6 hours"
    },
    {
      id: 4,
      name: "Dr. Anita Singh",
      title: "Soil Scientist",
      specialization: "Soil & Nutrition",
      experience: "18 years",
      rating: 4.7,
      location: "Indian Institute of Soil Science",
      availability: "Available",
      languages: ["Hindi", "English"],
      expertise: ["Soil testing", "Fertilizer management", "Nutrient deficiency"],
      consultationFee: "Free",
      responseTime: "2-4 hours"
    }
  ];

  // Load recent queries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('Expert_Recent_Queries');
    if (saved) {
      setRecentQueries(JSON.parse(saved));
    }
  }, []);

  // Save query to recent queries
  const saveToRecentQueries = (question: string, answer: string, status: string) => {
    const newQuery = {
      id: Date.now(),
      subject: question.length > 50 ? question.substring(0, 50) + '...' : question,
      fullQuestion: question,
      answer: answer,
      status: status,
      date: new Date().toLocaleString(),
      replies: status === 'Answered' ? 1 : 0
    };
    
    const existing = JSON.parse(localStorage.getItem('Expert_Recent_Queries') || '[]');
    existing.unshift(newQuery);
    const limited = existing.slice(0, 10); // Keep only last 10 queries
    localStorage.setItem('Expert_Recent_Queries', JSON.stringify(limited));
    setRecentQueries(limited);
  };

  // Local agricultural advice function
  const getLocalAgriculturalAdvice = (question: string) => {
    const q = question.toLowerCase();
    
    // Enhanced language detection for Tanglish
    const isTanglish = (q.includes('la ') || q.includes('ku ') || q.includes('iruku') || q.includes('enna') || q.includes('epdi')) && /[a-zA-Z]/.test(question);
    const isPureTamil = /[\u0B80-\u0BFF]/.test(question) && !/[a-zA-Z]/.test(question);
    const isHinglish = (q.includes('kya') || q.includes('kaise') || q.includes('mein') || q.includes('hai') || q.includes('karo')) && /[a-zA-Z]/.test(question);
    const isPureHindi = /[\u0900-\u097F]/.test(question) && !/[a-zA-Z]/.test(question);
    
    if (q.includes('yellowing') || q.includes('yellow') || q.includes('nitrogen') || q.includes('deficiency')) {
      if (isTanglish) return "Rice field la yellowing problem nitrogen deficiency aagalam. Urea fertilizer 120 kg per hectare apply pannunga. Soil test pannitu proper fertilizer use pannunga.";
      if (isPureTamil) return "நெல் வயலில் மஞ்சள் நிறம் நைட்ரஜன் குறைபாடு காரணமாகவும். யூரியா உரம் 120 kg வீதம் இடவும்.";
      if (isHinglish) return "Rice field mein yellowing nitrogen deficiency ka sign hai. Urea fertilizer 120 kg per hectare apply karo.";
      if (isPureHindi) return "धान के खेत में पीलापन नाइट्रोजन की कमी का संकेत है। यूरिया खाद 120 kg प्रति हेक्टेयर डालें।";
      return "Rice field yellowing indicates nitrogen deficiency. Apply urea fertilizer 120 kg per hectare.";
    }
    
    if (q.includes('fertilizer') || q.includes('nutrient')) {
      if (isTanglish) return "Crop ku NPK fertilizer use pannunga. Nitrogen 120-150 kg/ha, Phosphorus 60-80 kg/ha apply pannunga.";
      if (isPureTamil) return "பயிருக்கு NPK உரம் பயன்படுத்தவும்.";
      if (isHinglish) return "Crop mein NPK fertilizer use karo. Nitrogen 120-150 kg/ha apply karo.";
      if (isPureHindi) return "फसल में NPK खाद का उपयोग करें।";
      return "Use NPK fertilizer for crops. Apply nitrogen 120-150 kg/ha.";
    }
    
    if (isTanglish) return "General farming advice: Quality seeds use pannunga, correct spacing maintain pannunga, balanced fertilizer apply pannunga.";
    if (isPureTamil) return "பொதுவான விவசாய ஆலோசனை: தரமான விதைகள் பயன்படுத்தவும்.";
    if (isHinglish) return "General farming advice: Quality beej use karo, sahi spacing rakho, balanced fertilizer dalo.";
    if (isPureHindi) return "सामान्य कृषि सलाह: गुणवत्तापूर्ण बीज का उपयोग करें।";
    return "General farming advice: Use quality seeds, maintain proper spacing, apply balanced fertilizers.";
  };

  const offlineFAQ = [
    {
      question: "What are the common signs of nitrogen deficiency in crops?",
      answer: "Common signs include yellowing of older leaves first, stunted growth, reduced leaf size, and poor overall plant vigor. Apply nitrogen-rich fertilizers like urea or ammonium sulfate."
    },
    {
      question: "How often should I water my vegetable garden?",
      answer: "Water 2-3 times per week during normal weather, daily during hot/dry periods. Water deeply in the morning. Check soil moisture 2 inches deep - if dry, water is needed."
    },
    {
      question: "What is the best time to plant crops?",
      answer: "Plant timing depends on your region and crop type. Generally, plant after the last frost date for your area. Summer crops like tomatoes need warm soil, while cool crops like lettuce can be planted earlier."
    },
    {
      question: "How do I control common garden pests naturally?",
      answer: "Use neem oil spray, companion planting, row covers, and beneficial insects. Remove affected plants promptly. Rotate crops yearly to break pest cycles."
    },
    {
      question: "What are the signs of overwatering in plants?",
      answer: "Signs include yellowing leaves, wilting despite moist soil, fungal growth, root rot, and musty smell from soil. Reduce watering frequency and improve drainage."
    }
  ];

  const categories = [
    { value: "crop-management", label: t('cropManagement'), icon: Leaf },
    { value: "pest-control", label: t('pestControl'), icon: Bug },
    { value: "disease-management", label: t('diseaseManagement'), icon: Leaf },
    { value: "soil-nutrition", label: t('soilNutrition'), icon: Droplets },
    { value: "weather-climate", label: t('weatherClimate'), icon: Sun },
    { value: "government-schemes", label: t('governmentSchemes'), icon: UserCheck }
  ];

  const handleSubmitQuery = async () => {
    if (!queryForm.description.trim()) {
      toast({
        title: "Question required",
        description: "Please enter your agricultural question.",
        variant: "destructive"
      });
      return;
    }

    // Check if question is agriculture-related (multi-language keywords)
    const agricultureKeywords = [
      // English
      'crop', 'farming', 'fertilizer', 'soil', 'plant', 'seed', 'harvest', 'pest', 'disease', 
      'irrigation', 'agriculture', 'cultivation', 'farm', 'field', 'wheat', 'rice', 'corn',
      'vegetable', 'fruit', 'organic', 'pesticide', 'herbicide', 'nutrient', 'growth',
      'yield', 'weather', 'climate', 'season', 'planting', 'sowing', 'water', 'drought',
      'livestock', 'cattle', 'poultry', 'dairy', 'manure', 'compost', 'greenhouse',
      // Tamil/Tanglish
      'vivasayam', 'krishi', 'nel', 'godhumai', 'cholam', 'kambu', 'ragi', 'pasu', 'koli',
      'thanni', 'mazhai', 'bhoomi', 'mann', 'vithai', 'poo', 'keerai', 'pazham', 'maram',
      // Tamil Unicode
      'தக்காளி', 'செடி', 'உரம்', 'விவசாயம்', 'நெல்', 'கோதுமை', 'சோளம்', 'கம்பு', 'ராகி',
      'தண்ணீர்', 'மழை', 'மண்', 'விதை', 'பூ', 'கீரை', 'பழம்', 'மரம்', 'பசு', 'கோழி',
      'பயிர்', 'வயல்', 'தோட்டம்', 'இலை', 'வேர்', 'கிளை', 'பூச்சி', 'நோய்', 'மருந்து',
      // Hindi/Hinglish + Unicode
      'kheti', 'fasal', 'kisan', 'bhoomi', 'paani', 'beej', 'dhan', 'gehu', 'makka',
      'sabzi', 'phal', 'pashu', 'murgi', 'barish', 'mitti', 'ugana', 'kaatna',
      'खेती', 'फसल', 'किसान', 'भूमि', 'पानी', 'बीज', 'धान', 'गेहूं', 'मक्का',
      'सब्जी', 'फल', 'पशु', 'मुर्गी', 'बारिश', 'मिट्टी', 'उगाना', 'काटना',
      // Telugu
      'వివసాయం', 'రైతు', 'కృషి', 'విత్తనం', 'మిట్ట', 'నీరు', 'పంట', 'కీడులు', 'రోగం',
      // Punjabi
      'ਖੇਤੀ', 'ਫਸਲ', 'ਕਿਸਾਨ', 'ਜਮੀਨ', 'ਪਾਣੀ', 'ਬੀਜ', 'ਧਾਨ', 'ਕਣਕ', 'ਮਕਈ',
      // Malayalam
      'കൃഷി', 'നെല്ല്', 'വിവസായം', 'വിത്ത്', 'മണ്ണ്', 'വെള്ളം', 'പശു', 'കോഴി',
      // Urdu
      'کاشتکاری', 'فصل', 'کسان', 'زمین', 'پانی', 'بیج', 'دھان', 'گیہوں', 'مکئی'
    ];
    
    const isAgricultureRelated = agricultureKeywords.some(keyword => 
      queryForm.description.toLowerCase().includes(keyword)
    );
    
    if (!isAgricultureRelated) {
      // Detect language and provide redirect message in same language
      const q = queryForm.description;
      let redirectMessage = "Please ask questions related to agriculture, farming, crops, or rural development. This app is designed to help farmers with agricultural guidance.";
      
      // Tamil detection
      if (/[\u0B80-\u0BFF]/.test(q) || q.includes('la ') || q.includes('ku ') || q.includes('iruku') || q.includes('enna')) {
        redirectMessage = "விவசாயம், வேளாண்மை, பயிர்கள் அல்லது கிராமப்புற வளர்ச்சி பற்றி கேள்விகள் கேட்கவும். இந்த ஆப் விவசாயிகளுக்கு உதவ செய்ய வசதியாக வடிவமைக்கப்பட்டது.";
      }
      // Hindi detection
      else if (/[\u0900-\u097F]/.test(q) || q.includes('kya') || q.includes('kaise') || q.includes('mein') || q.includes('hai')) {
        redirectMessage = "कृपया कृषि, खेती, फसलों, या ग्रामीण विकास से संबंधित प्रश्न पूछें। यह ऐप किसानों को कृषि मार्गदर्शन प्रदान करने के लिए बनाया गया है।";
      }
      // Telugu detection
      else if (/[\u0C00-\u0C7F]/.test(q)) {
        redirectMessage = "దయచేసి వివసాయం, వేళాన్ని పన్నులు, పంటలు, లేదా గ్రామీణ అభివృద్ధికి సంబంధించిన ప్రశ్నలు అడగండి। ఈ ఆప్ రైతులకు వేళాన్ని మార్గదర్శనం అందించడానికి రూపొందించబడింది।";
      }
      // Punjabi detection
      else if (/[\u0A00-\u0A7F]/.test(q)) {
        redirectMessage = "ਕਿਰਪਾ ਕਰਕੇ ਖੇਤੀਬਾੜੀ, ਖੇਤੀ, ਫਸਲਾਂ, ਜਾਂ ਦੇਹਾਤੀ ਵਿਕਾਸ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲ ਪੁੱਛੋ। ਇਹ ਐਪ ਕਿਸਾਨਾਂ ਨੂੰ ਖੇਤੀਬਾੜੀ ਦੀ ਰਾਹਨੁਮਾਈ ਦੇਣ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ।";
      }
      // Malayalam detection
      else if (/[\u0D00-\u0D7F]/.test(q)) {
        redirectMessage = "കൃഷി, കൃഷിയുമായി, വിളകളുകളുമായി, അല്ലെങ്കില് ഗ്രാമീണ വികസനവുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങള് ചോദിക്കുക. ഈ ആപ്പ് കൃഷകര്ക്ക് കൃഷി മാര്ഗ്ഗദര്ശനം നല്കാനായി രൂപകല്പ്പന ചെയ്തിട്ടുള്ളതാണ്.";
      }
      // Urdu detection
      else if (/[\u0600-\u06FF]/.test(q)) {
        redirectMessage = "براہ کرم زراعت، کاشتکاری، فصلوں، یا دیہی ترقی سے متعلق سوالات پوچھیں۔ یہ ایپ کسانوں کو زراعتی رہنمائی فراہم کرنے کے لیے بنایا گیا ہے۔";
      }
      
      setCurrentQuestion(queryForm.description);
      setAiResponse(redirectMessage);
      saveToRecentQueries(queryForm.description, redirectMessage, 'Redirected');
      setQueryForm({ description: "" });
      return;
    }

    // Handle offline mode
    if (!isOnline) {
      const matchedFAQ = offlineFAQ.find(faq => 
        faq.question.toLowerCase().includes(queryForm.description.toLowerCase()) ||
        queryForm.description.toLowerCase().includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
      );
      
      if (matchedFAQ) {
        setCurrentQuestion(queryForm.description);
        setAiResponse(matchedFAQ.answer);
        saveToRecentQueries(queryForm.description, matchedFAQ.answer, 'Answered');
        setQueryForm({ description: "" });
        toast({
          title: "Offline Mode",
          description: "Answer provided from offline knowledge base.",
        });
        return;
      } else {
        toast({
          title: "No Internet Connection",
          description: "Connect to the internet to get expert advice or try asking about common farming topics.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);
    setCurrentQuestion(queryForm.description);
    setAiResponse("");

    // Check if API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey.length < 20) {
      // Provide local agricultural advice without API
      const localAdvice = getLocalAgriculturalAdvice(queryForm.description);
      setAiResponse(localAdvice);
      saveToRecentQueries(queryForm.description, localAdvice, 'Answered');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert agricultural advisor for the Krishi Dost app. Provide helpful, practical advice for farmers in India.
              
              CRITICAL LANGUAGE RULES:
              1. If question has English + Tamil words (Tanglish), respond in SAME Tanglish style
              2. If question has English + Hindi words (Hinglish), respond in SAME Hinglish style  
              3. If question is pure Tamil/Hindi, respond in pure Tamil/Hindi
              4. NEVER convert Tanglish to pure Tamil or Hinglish to pure Hindi
              
              Tanglish Examples:
              Q: "Tomato crop la pest problem iruku" → A: "Tomato crop ku neem oil spray pannunga, pest control ku IPM method use pannunga"
              Q: "Rice field la yellowing problem" → A: "Rice field la nitrogen deficiency irukalam, urea fertilizer apply pannunga"
              
              Hinglish Examples:
              Q: "Wheat mein kya fertilizer use karu" → A: "Wheat mein NPK fertilizer use karo, soil test karke apply karo"
              
              Keep responses practical and in the EXACT SAME language mix as the question.`
            },
            {
              role: 'user',
              content: `Please respond to this question in the SAME LANGUAGE it was asked: "${queryForm.description}"`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const response = data.choices[0].message.content;
        setAiResponse(response);
        saveToRecentQueries(queryForm.description, response, 'Answered');
      } else {
        throw new Error("No response received from ChatGPT");
      }
    } catch (error) {
      console.error("Error getting ChatGPT response:", error);
      
      // Provide local agricultural advice as fallback
      const localAdvice = getLocalAgriculturalAdvice(queryForm.description);
      setAiResponse(localAdvice);
      saveToRecentQueries(queryForm.description, localAdvice, 'Answered');
    } finally {
      setIsLoading(false);
      setQueryForm({ description: "" });
    }
  };

  const speakResponse = (text: string) => {
    if (!speechSupported) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
      return;
    }

    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    
    console.log('Text analysis:', { text: text.substring(0, 100), hasTamil, hasEnglish });

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('All available voices:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Check for Tamil voices
      const tamilVoices = voices.filter(v => 
        v.lang === 'ta-IN' || 
        v.lang === 'ta' || 
        v.lang.startsWith('ta') || 
        v.name.toLowerCase().includes('tamil')
      );
      
      console.log('Tamil voices found:', tamilVoices.map(v => `${v.name} (${v.lang})`));
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      let selectedVoice = null;
      
      // For Tamil content
      if (hasTamil) {
        if (tamilVoices.length > 0) {
          selectedVoice = tamilVoices[0];
          utterance.lang = selectedVoice.lang;
          utterance.voice = selectedVoice;
          console.log(`Using Tamil voice: ${selectedVoice.name} (${selectedVoice.lang})`);
        } else {
          // No Tamil voice available - notify user and use English
          console.log('No Tamil voice available on this system');
          toast({
            title: "Tamil Voice Not Available",
            description: "Your system doesn't have Tamil text-to-speech voices installed. Using English voice instead.",
            variant: "default"
          });
          utterance.lang = 'en-US';
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }
      } else {
        // For English/mixed content
        utterance.lang = 'en-US';
        selectedVoice = voices.find(v => v.lang.startsWith('en') && v.default) ||
                      voices.find(v => v.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      console.log(`Final voice selection: ${selectedVoice?.name || 'default'} (${utterance.lang})`);
      
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: `TTS failed: ${event.error}`,
          variant: "destructive"
        });
      };
      
      window.speechSynthesis.speak(utterance);
    };

    // Wait for voices to load
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        setTimeout(speak, 100);
      };
      // Force load voices
      setTimeout(() => {
        const tempUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(tempUtterance);
        window.speechSynthesis.cancel();
      }, 50);
    } else {
      speak();
    }
  };

  const startVoiceInput = () => {
    if (!speechRecognitionSupported) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Default, but will auto-detect

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQueryForm({...queryForm, description: transcript});
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Voice Input Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available": return "bg-green-100 text-green-800";
      case "Busy": return "bg-yellow-100 text-yellow-800";
      case "Offline": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Answered": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Redirected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('expertHelp')}</h1>
          <p className="text-muted-foreground">{t('getExpertAdvice')}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Badge className="bg-green-100 text-green-800 flex items-center">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 flex items-center">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Categories */}
      <Card>
        <CardHeader>
          <CardTitle>{t('browseByCategory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <category.icon className="h-6 w-6 text-primary" />
                <span className="text-xs text-center">{category.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Ask Question Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ask New Question */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('askQuestion')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('askQuestion')}</label>
                <div className="relative">
                  <Textarea
                    placeholder="Ask in any language - English, Hindi, Tamil, Tanglish, or mixed languages (e.g., 'Tomato crop la pest problem iruku, enna solution?')..."
                    value={queryForm.description}
                    onChange={(e) => setQueryForm({...queryForm, description: e.target.value})}
                    rows={4}
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute top-2 right-2 h-8 w-8 p-0 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                    onClick={startVoiceInput}
                    disabled={!speechRecognitionSupported || isListening}
                    title={speechRecognitionSupported ? (isListening ? 'Listening...' : 'Click to speak in any language') : 'Voice input not supported'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                {isListening && (
                  <p className="text-sm text-primary animate-pulse">🎤 Listening... Speak in any language</p>
                )}
              </div>

              <Button 
                onClick={handleSubmitQuery} 
                variant="farmer" 
                className="w-full text-lg p-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Getting Expert Response...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {isOnline ? 'Ask Agricultural Expert' : 'Ask (Offline Mode)'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Expert Response */}
          {(currentQuestion || aiResponse) && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Bot className="mr-2 h-5 w-5" />
                  Agricultural Expert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium text-foreground mb-2">Your Question:</p>
                    <p className="text-muted-foreground text-lg leading-relaxed">{currentQuestion}</p>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-3 text-lg">Getting expert response...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-primary">Expert Advice:</p>
                      {speechSupported && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const voices = window.speechSynthesis.getVoices();
                              const tamilVoices = voices.filter(v => 
                                v.lang.includes('ta') || v.name.toLowerCase().includes('tamil')
                              );
                              console.log('=== VOICE DEBUG ===');
                              console.log('Total voices:', voices.length);
                              console.log('Tamil voices:', tamilVoices.length);
                              console.log('All voices:', voices.map(v => `${v.name} (${v.lang})`));
                              toast({
                                title: "Voice Debug",
                                description: `Found ${voices.length} total voices, ${tamilVoices.length} Tamil voices. Check console for details.`,
                              });
                            }}
                            className="text-xs px-2"
                            title="Debug: Show available voices"
                          >
                            Debug
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakResponse(aiResponse)}
                            className="flex items-center"
                            title="Click to hear the response. Note: Tamil TTS requires Tamil language pack to be installed on your system."
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="h-4 w-4 mr-1" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-4 w-4 mr-1" />
                                Listen
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Offline FAQ or Recent Queries */}
          <Card>
            <CardHeader>
              <CardTitle>{isOnline ? t('recentQueries') : 'Common Farming Questions (Offline)'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isOnline ? (
                  recentQueries.length > 0 ? (
                    recentQueries.map((query) => (
                      <div key={query.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                           onClick={() => {
                             setCurrentQuestion(query.fullQuestion);
                             setAiResponse(query.answer);
                           }}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{query.subject}</h4>
                          <Badge className={getStatusColor(query.status)}>
                            {query.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <span>{query.date}</span>
                          {query.replies > 0 && (
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {query.replies} replies
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent queries yet. Ask your first question!</p>
                  )
                ) : (
                  offlineFAQ.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                         onClick={() => {
                           setCurrentQuestion(faq.question);
                           setAiResponse(faq.answer);
                         }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{faq.question}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          Offline
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Available Experts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {t('availableExperts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experts.map((expert) => (
                  <div key={expert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{expert.name}</h4>
                          <Badge className={getAvailabilityColor(expert.availability)} style={{fontSize: '10px'}}>
                            {expert.availability}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">{expert.title}</p>
                        <p className="text-xs text-primary font-medium">{expert.specialization}</p>
                        
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          <span>{expert.rating}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{expert.responseTime}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {expert.expertise.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" style={{fontSize: '9px'}}>
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-1 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 text-xs p-1">
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs p-1">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs p-1">
                            <Video className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertHelp;