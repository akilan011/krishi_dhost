import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { extendedTranslations, getExtendedTranslation } from '@/lib/translations';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'pa' | 'ur' | 'ml';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    const farmerData = localStorage.getItem('farmerData');
    
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    } else if (farmerData) {
      const parsed = JSON.parse(farmerData);
      if (parsed.language) {
        setLanguageState(parsed.language as SupportedLanguage);
      }
    }
  }, []);

  const t = (key: string): string => {
    // First try the main translations
    const mainTranslation = translations[language]?.[key];
    if (mainTranslation) {
      return mainTranslation;
    }
    
    // Then try extended translations
    const extendedTranslation = getExtendedTranslation(language, key);
    if (extendedTranslation !== key) {
      return extendedTranslation;
    }
    
    // Fallback to English
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'Welcome to Krishi Dost',
    'smartCropAdvisory': 'Smart Crop Advisory',
    'krishiDost': 'Krishi Dost',
    'digitalFarmingCompanion': 'Your Digital Farming Companion',
    'getStarted': 'Get Started',
    'tutorialVideo': 'Tutorial Video',
    'skip': 'Skip',
    'chooseYourLanguage': 'Choose Your Language',
    
    // Form Fields
    'yourName': 'Your Name',
    'enterFullName': 'Enter your full name',
    'password': 'Password',
    'enterPassword': 'Enter your password',
    'confirmPassword': 'Confirm Password',
    'confirmYourPassword': 'Confirm your password',
    'login': 'Login',
    'register': 'Register',
    'continueOffline': 'Continue Offline',
    
    // Navigation & Pages
    'dashboard': 'Dashboard',
    'myCrop': 'My Crop',
    'myCrops': 'My Crops',
    'aiCropCalendar': 'AI Crop Calendar',
    'marketPrice': 'Market Price',
    'marketPrices': 'Market Prices',
    'govtSchemes': 'Govt Schemes',
    'expertHelp': 'Expert Help',
    'cameraDetection': 'Camera Detection',
    'location': 'Location',
    'mainMenu': 'Main Menu',
    'manageLocation': 'Manage your location',
    'governmentSchemes': 'Government Schemes',
    
    // Dashboard
    'goodMorningFarmer': 'Good Morning, Farmer!',
    'farmingDashboardToday': 'Here\'s your farming dashboard for today',
    'checkCropsField': 'Check your crops in the field',
    'todayMandiRates': 'Today\'s mandi rates',
    'availableGovtSchemes': 'Available government schemes',
    'connectExperts': 'Connect with farming experts',
    'weather': 'Weather',
    'rainfall': 'Rainfall',
    'season': 'Season',
    'alerts': 'Alerts',
    'newAlerts': 'new alerts',
    'voiceAssistant': 'Voice Assistant',
    'askFarmingQuestions': 'Ask me any farming questions',
    'startVoiceChat': 'Start Voice Chat',
    'open': 'Open',
    'recentActivity': 'Recent Activity',
    'riceCropUpdated': 'Rice crop status updated',
    'hoursAgo': 'hours ago',
    'marketPriceAlert': 'Market price alert received',
    
    // Common
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'back': 'Back',
    'next': 'Next',
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'newToKrishiDost': 'New to Krishi Dost?',
    'createNewAccount': 'Create New Account',
    
    // Voice Assistant
    'tapToSpeak': 'Tap to Speak',
    'listeningForCommand': 'Listening for command',
    'processing': 'Processing',
    'aiResponse': 'AI Response',
    'analyzeImage': 'Analyze',
    
    // Fertilizer
    'fertilizerPrices': 'Fertilizer Prices (Govt Data)',
    'name': 'Name',
    'mrp': 'MRP',
    'subsidy': 'Subsidy',
    'costOfSale': 'Cost of Sale',
    'personalizedFertilizerSuggestion': 'Personalized Fertilizer Suggestion',
    'crop': 'Crop',
    'selectCrop': 'Select Crop',
    'soilType': 'Soil Type',
    'selectSoil': 'Select Soil',
    'areaAcres': 'Area (acres)',
    'areaPlaceholder': 'e.g. 2',
    'getSuggestion': 'Get Suggestion',
    'suggestion': 'Suggestion',
    'yourPreviousSuggestions': 'Your Previous Suggestions',
    
    // Sidebar
    'fertilizer': 'Fertilizer',
    'fertilizerSuggestions': 'Get fertilizer recommendations',
    
    // Additional common translations
    'soil': 'Soil',
    'date': 'Date',
    'area': 'Area',
  },
  
  hi: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'कृषि दोस्त में आपका स्वागत है',
    'smartCropAdvisory': 'स्मार्ट फसल सलाहकार',
    'krishiDost': 'कृषि दोस्त',
    'digitalFarmingCompanion': 'आपका डिजिटल कृषि साथी',
    'getStarted': 'शुरू करें',
    'tutorialVideo': 'ट्यूटोरियल वीडियो',
    'skip': 'छोड़ें',
    'chooseYourLanguage': 'अपनी भाषा चुनें',
    
    // Form Fields
    'yourName': 'आपका नाम',
    'enterFullName': 'अपना पूरा नाम दर्ज करें',
    'password': 'पासवर्ड',
    'enterPassword': 'अपना पासवर्ड दर्ज करें',
    'confirmPassword': 'पासवर्ड की पुष्टि करें',
    'confirmYourPassword': 'अपने पासवर्ड की पुष्टि करें',
    'login': 'लॉगिन',
    'register': 'पंजीकरण',
    'continueOffline': 'ऑफलाइन जारी रखें',
    
    // Navigation & Pages
    'dashboard': 'डैशबोर्ड',
    'myCrop': 'मेरी फसल',
    'myCrops': 'मेरी फसलें',
    'aiCropCalendar': 'AI फसल कैलेंडर',
    'marketPrice': 'बाजार भाव',
    'marketPrices': 'बाजार भाव',
    'govtSchemes': 'सरकारी योजनाएं',
    'expertHelp': 'विशेषज्ञ सहायता',
    'cameraDetection': 'कैमरा जांच',
    'location': 'स्थान',
    'mainMenu': 'मुख्य मेनू',
    'manageLocation': 'अपना स्थान प्रबंधित करें',
    'governmentSchemes': 'सरकारी योजनाएं',
    
    // Dashboard
    'goodMorningFarmer': 'सुप्रभात, किसान भाई!',
    'farmingDashboardToday': 'आज के लिए आपका कृषि डैशबोर्ड',
    'checkCropsField': 'खेत में अपनी फसलों की जांच करें',
    'todayMandiRates': 'आज के मंडी भाव',
    'availableGovtSchemes': 'उपलब्ध सरकारी योजनाएं',
    'connectExperts': 'कृषि विशेषज्ञों से जुड़ें',
    'weather': 'मौसम',
    'rainfall': 'वर्षा',
    'season': 'मौसम',
    'alerts': 'अलर्ट',
    'newAlerts': 'नए अलर्ट',
    'voiceAssistant': 'आवाज सहायक',
    'askFarmingQuestions': 'मुझसे कोई भी कृषि प्रश्न पूछें',
    'startVoiceChat': 'आवाज चैट शुरू करें',
    'open': 'खोलें',
    'recentActivity': 'हाल की गतिविधि',
    'riceCropUpdated': 'धान की फसल की स्थिति अपडेट की गई',
    'hoursAgo': 'घंटे पहले',
    'marketPriceAlert': 'बाजार भाव अलर्ट प्राप्त हुआ',
    
    // Common
    'submit': 'जमा करें',
    'cancel': 'रद्द करें',
    'save': 'सहेजें',
    'back': 'वापस',
    'next': 'आगे',
    'welcome': 'स्वागत',
    'loading': 'लोड हो रहा है...',
    'newToKrishiDost': 'कृषि दोस्त में नए हैं?',
    'createNewAccount': 'नया खाता बनाएं',
    
    // Voice Assistant
    'tapToSpeak': 'बोलने के लिए टैप करें',
    'listeningForCommand': 'आदेश सुन रहा है',
    'processing': 'प्रोसेसिंग',
    'aiResponse': 'AI प्रतिक्रिया',
    'analyzeImage': 'विश्लेषण करें',
    
    // Fertilizer
    'fertilizerPrices': 'उर्वरक मूल्य (सरकारी डेटा)',
    'name': 'नाम',
    'mrp': 'एमआरपी',
    'subsidy': 'सब्सिडी',
    'costOfSale': 'बिक्री लागत',
    'personalizedFertilizerSuggestion': 'व्यक्तिगत उर्वरक सुझाव',
    'crop': 'फसल',
    'selectCrop': 'फसल चुनें',
    'soilType': 'मिट्टी का प्रकार',
    'selectSoil': 'मिट्टी चुनें',
    'areaAcres': 'क्षेत्रफल (एकड़)',
    'areaPlaceholder': 'जैसे 2',
    'getSuggestion': 'सुझाव प्राप्त करें',
    'suggestion': 'सुझाव',
    'yourPreviousSuggestions': 'आपके पिछले सुझाव',
    
    // Sidebar
    'fertilizer': 'उर्वरक',
    'fertilizerSuggestions': 'उर्वरक सुझाव प्राप्त करें',
    
    // Additional common translations
    'soil': 'मिट्टी',
    'date': 'तारीख',
    'area': 'क्षेत्र',
  },
  
  ta: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'கிருஷி தோஸ்ட்டுக்கு வரவேற்கிறோம்',
    'smartCropAdvisory': 'ஸ்மார்ட் பயிர் ஆலோசனை',
    'krishiDost': 'கிருஷி தோஸ்ட்',
    'digitalFarmingCompanion': 'உங்கள் டிஜிட்டல் விவசாய துணை',
    'getStarted': 'தொடங்குங்கள்',
    'tutorialVideo': 'டுடோரியல் வீடியோ',
    'skip': 'தவிர்க்கவும்',
    'chooseYourLanguage': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    
    // Form Fields
    'yourName': 'உங்கள் பெயர்',
    'enterFullName': 'உங்கள் முழு பெயரை உள்ளிடவும்',
    'password': 'கடவுச்சொல்',
    'enterPassword': 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
    'confirmPassword': 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    'confirmYourPassword': 'உங்கள் கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    'login': 'உள்நுழைய',
    'register': 'பதிவு',
    'continueOffline': 'ஆஃப்லைனில் தொடரவும்',
    
    // Navigation & Pages
    'dashboard': 'டாஷ்போர்டு',
    'myCrop': 'என் பயிர்',
    'myCrops': 'என் பயிர்கள்',
    'aiCropCalendar': 'AI பயிர் நாட்காட்டி',
    'marketPrice': 'சந்தை விலை',
    'marketPrices': 'சந்தை விலைகள்',
    'govtSchemes': 'அரசு திட்டங்கள்',
    'expertHelp': 'நிபுணர் உதவி',
    'cameraDetection': 'கேமரா கண்டறிதல்',
    'location': 'இடம்',
    'mainMenu': 'முதன்மை மெனு',
    'manageLocation': 'உங்கள் இடத்தை நிர்வகிக்கவும்',
    'governmentSchemes': 'அரசு திட்டங்கள்',
    
    // Dashboard
    'goodMorningFarmer': 'காலை வணக்கம், விவசாயி!',
    'farmingDashboardToday': 'இன்றைய உங்கள் விவசாய டாஷ்போர்டு இங்கே',
    'checkCropsField': 'வயலில் உங்கள் பயிர்களைச் சரிபார்க்கவும்',
    'todayMandiRates': 'இன்றைய மண்டி விலைகள்',
    'availableGovtSchemes': 'கிடைக்கும் அரசு திட்டங்கள்',
    'connectExperts': 'விவசாய நிபுணர்களுடன் இணைக்கவும்',
    'weather': 'வானிலை',
    'rainfall': 'மழைப்பொழிவு',
    'season': 'பருவம்',
    'alerts': 'எச்சரிக்கைகள்',
    'newAlerts': 'புதிய எச்சரிக்கைகள்',
    'voiceAssistant': 'குரல் உதவியாளர்',
    'askFarmingQuestions': 'எந்த விவசாய கேள்விகளையும் என்னிடம் கேளுங்கள்',
    'startVoiceChat': 'குரல் அரட்டையைத் தொடங்கவும்',
    'open': 'திறக்கவும்',
    'recentActivity': 'சமீபத்திய செயல்பாடு',
    'riceCropUpdated': 'நெல் பயிர் நிலை புதுப்பிக்கப்பட்டது',
    'hoursAgo': 'மணி நேரங்களுக்கு முன்பு',
    'marketPriceAlert': 'சந்தை விலை எச்சரிக்கை பெறப்பட்டது',
    
    // Common
    'submit': 'சமர்ப்பிக்கவும்',
    'cancel': 'ரத்து செய்யவும்',
    'save': 'சேமிக்கவும்',
    'back': 'பின்',
    'next': 'அடுத்து',
    'welcome': 'வரவேற்கிறோம்',
    'loading': 'ஏற்றுகிறது...',
    'newToKrishiDost': 'கிருஷி தோஸ்ட்டில் புதியவரா?',
    'createNewAccount': 'புதிய கணக்கை உருவாக்கவும்',
    
    // Voice Assistant
    'tapToSpeak': 'பேசுவதற்கு தட்டவும்',
    'listeningForCommand': 'கட்டளையை கேட்கிறது',
    'processing': 'செயலாக்கம்',
    'aiResponse': 'AI பதில்',
    'analyzeImage': 'பகுப்பாய்வு செய்யவும்',
    
    // Fertilizer
    'fertilizerPrices': 'உர விலைகள் (அரசு தரவு)',
    'name': 'பெயர்',
    'mrp': 'எம்ஆர்பி',
    'subsidy': 'மானியம்',
    'costOfSale': 'விற்பனை செலவு',
    'personalizedFertilizerSuggestion': 'தனிப்பயனாக்கப்பட்ட உர பரிந்துரை',
    'crop': 'பயிர்',
    'selectCrop': 'பயிரைத் தேர்ந்தெடுக்கவும்',
    'soilType': 'மண் வகை',
    'selectSoil': 'மண்ணைத் தேர்ந்தெடுக்கவும்',
    'areaAcres': 'பரப்பளவு (ஏக்கர்)',
    'areaPlaceholder': 'உதா. 2',
    'getSuggestion': 'பரிந்துரையைப் பெறுங்கள்',
    'suggestion': 'பரிந்துரை',
    'yourPreviousSuggestions': 'உங்கள் முந்தைய பரிந்துரைகள்',
    
    // Sidebar
    'fertilizer': 'உரம்',
    'fertilizerSuggestions': 'உர பரிந்துரைகளைப் பெறுங்கள்',
    
    // Additional common translations
    'soil': 'மண்',
    'date': 'தேதி',
    'area': 'பரப்பளவு',
  },
  
  te: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'కృషి దోస్త్ కు స్వాగతం',
    'smartCropAdvisory': 'స్మార్ట్ క్రాప్ అడ్వైజరీ',
    'krishiDost': 'కృషి దోస్త్',
    'digitalFarmingCompanion': 'మీ డిజిటల్ వ్యవసాయ సహాయి',
    'getStarted': 'ప్రారంభించండి',
    'tutorialVideo': 'ట్యుటోరియల్ వీడియో',
    'skip': 'దాటవేయండి',
    'chooseYourLanguage': 'మీ భాషను ఎంచుకోండి',
    
    // Form Fields
    'yourName': 'మీ పేరు',
    'enterFullName': 'మీ పూర్తి పేరును నమోదు చేయండి',
    'password': 'పాస్వర్డ్',
    'enterPassword': 'మీ పాస్వర్డ్ను నమోదు చేయండి',
    'confirmPassword': 'పాస్వర్డ్ను నిర్ధారించండి',
    'confirmYourPassword': 'మీ పాస్వర్డ్ను నిర్ధారించండి',
    'login': 'లాగిన్',
    'register': 'నమోదు',
    'continueOffline': 'ఆఫ్లైన్లో కొనసాగించండి',
    
    // Navigation & Pages
    'dashboard': 'డాష్బోర్డ్',
    'myCrop': 'నా పంట',
    'myCrops': 'నా పంటలు',
    'aiCropCalendar': 'AI పంట క్యాలెండర్',
    'marketPrice': 'మార్కెట్ ధర',
    'marketPrices': 'మార్కెట్ ధరలు',
    'govtSchemes': 'ప్రభుత్వ పథకాలు',
    'expertHelp': 'నిపుణుల సహాయం',
    'cameraDetection': 'కెమెరా గుర్తింపు',
    'location': 'స్థానం',
    'mainMenu': 'ప్రధాన మెనూ',
    'manageLocation': 'మీ స్థానాన్ని నిర్వహించండి',
    'governmentSchemes': 'ప్రభుత్వ పథకాలు',
    
    // Dashboard
    'goodMorningFarmer': 'శుభోదయం, రైతు గారు!',
    'farmingDashboardToday': 'ఈ రోజు మీ వ్యవసాయ డాష్బోర్డ్',
    'checkCropsField': 'వయల్లో మీ పంటలను చూడండి',
    'todayMandiRates': 'ఈ రోజు మండీ రేట్లు',
    'availableGovtSchemes': 'అందుబాటులో ఉన్న ప్రభుత్వ పథకాలు',
    'connectExperts': 'వ్యవసాయ నిపుణులతో కనెక్ట్ అవ్వండి',
    'weather': 'వాతావరణం',
    'rainfall': 'వర్షపాతం',
    'season': 'సీజన్',
    'alerts': 'హెచ్చరికలు',
    'newAlerts': 'కొత్త హెచ్చరికలు',
    'voiceAssistant': 'వాయిస్ అసిస్టెంట్',
    'askFarmingQuestions': 'ఏదైనా వ్యవసాయ ప్రశ్నలను నన్ను అడగండి',
    'startVoiceChat': 'వాయిస్ చాట్ ప్రారంభించండి',
    'open': 'తెరవండి',
    'recentActivity': 'ఇటీవలి కార్యకలాపాలు',
    'riceCropUpdated': 'వరి పంట స్థితి అప్డేట్ అయ్యింది',
    'hoursAgo': 'గంటల క్రితం',
    'marketPriceAlert': 'మార్కెట్ ధర హెచ్చరిక వచ్చింది',
    
    // Common
    'submit': 'సమర్పించండి',
    'cancel': 'రద్దు చేయండి',
    'save': 'సేవ్ చేయండి',
    'back': 'వెనుకకు',
    'next': 'తదుపరి',
    'welcome': 'స్వాగతం',
    'loading': 'లోడ్ అవుతోంది...',
    'newToKrishiDost': 'కృషి దోస్త్కు కొత్తవారా?',
    'createNewAccount': 'కొత్త ఖాతా సృష్టించండి',
    
    // Voice Assistant
    'tapToSpeak': 'మాట్లాడటానికి నొక్కండి',
    'listeningForCommand': 'ఆదేశం వింటోంది',
    'processing': 'ప్రాసెసింగ్',
    'aiResponse': 'AI ప్రతిస్పందన',
    'analyzeImage': 'విశ్లేషించండి',
    
    // Fertilizer
    'fertilizerPrices': 'ఎరువుల ధరలు (ప్రభుత్వ డేటా)',
    'name': 'పేరు',
    'mrp': 'ఎంఆర్పీ',
    'subsidy': 'సబ్సిడీ',
    'costOfSale': 'అమ్మకపు ధర',
    'personalizedFertilizerSuggestion': 'వ్యక్తిగత ఎరువుల సూచన',
    'crop': 'పంట',
    'selectCrop': 'పంటను ఎంచుకోండి',
    'soilType': 'మట్టి రకం',
    'selectSoil': 'మట్టిని ఎంచుకోండి',
    'areaAcres': 'వైశాల్యం (ఎకరాలు)',
    'areaPlaceholder': 'ఉదా. 2',
    'getSuggestion': 'సూచన పొందండి',
    'suggestion': 'సూచన',
    'yourPreviousSuggestions': 'మీ మునుపటి సూచనలు',
    
    // Sidebar
    'fertilizer': 'ఎరువులు',
    'fertilizerSuggestions': 'ఎరువుల సూచనలను పొందండి',
    
    // Additional common translations
    'soil': 'మట్టి',
    'date': 'తేదీ',
    'area': 'వైశాల్యం',
  },
  
  pa: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'ਕ੍ਰਿਸ਼ੀ ਦੋਸਤ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    'smartCropAdvisory': 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ',
    'krishiDost': 'ਕ੍ਰਿਸ਼ੀ ਦੋਸਤ',
    'digitalFarmingCompanion': 'ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀ ਸਾਥੀ',
    'getStarted': 'ਸ਼ੁਰੂ ਕਰੋ',
    'tutorialVideo': 'ਟਿਊਟੋਰੀਅਲ ਵੀਡੀਓ',
    'skip': 'ਛੱਡੋ',
    'chooseYourLanguage': 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    
    // Form Fields
    'yourName': 'ਤੁਹਾਡਾ ਨਾਮ',
    'enterFullName': 'ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ',
    'password': 'ਪਾਸਵਰਡ',
    'enterPassword': 'ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ',
    'confirmPassword': 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    'confirmYourPassword': 'ਆਪਣੇ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    'login': 'ਲਾਗਇਨ',
    'register': 'ਰਜਿਸਟਰ',
    'continueOffline': 'ਆਫਲਾਈਨ ਜਾਰੀ ਰੱਖੋ',
    
    // Navigation & Pages
    'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'myCrop': 'ਮੇਰੀ ਫਸਲ',
    'myCrops': 'ਮੇਰੀਆਂ ਫਸਲਾਂ',
    'aiCropCalendar': 'AI ਫਸਲ ਕੈਲੰਡਰ',
    'marketPrice': 'ਮਾਰਕੀਟ ਰੇਟ',
    'marketPrices': 'ਮਾਰਕੀਟ ਰੇਟ',
    'govtSchemes': 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    'expertHelp': 'ਮਾਹਰ ਸਹਾਇਤਾ',
    'cameraDetection': 'ਕੈਮਰਾ ਪਛਾਣ',
    'location': 'ਸਥਾਨ',
    'mainMenu': 'ਮੁੱਖ ਮੇਨੂ',
    'manageLocation': 'ਆਪਣਾ ਸਥਾਨ ਪ੍ਰਬੰਧਿਤ ਕਰੋ',
    'governmentSchemes': 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    
    // Dashboard
    'goodMorningFarmer': 'ਸਤਿ ਅਕਾਲ, ਕਿਸਾਨ ਜੀ!',
    'farmingDashboardToday': 'ਅੱਜ ਦੇ ਲਈ ਤੁਹਾਡਾ ਖੇਤੀ ਡੈਸ਼ਬੋਰਡ',
    'checkCropsField': 'ਖੇਤ ਵਿੱਚ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਜਾਂਚ ਕਰੋ',
    'todayMandiRates': 'ਅੱਜ ਦੇ ਮੰਡੀ ਰੇਟ',
    'availableGovtSchemes': 'ਉਪਲਬਧ ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    'connectExperts': 'ਖੇਤੀ ਮਾਹਰਾਂ ਨਾਲ ਜੁੜੋ',
    'weather': 'ਮੌਸਮ',
    'rainfall': 'ਮੀਂਹ',
    'season': 'ਮੌਸਮ',
    'alerts': 'ਅਲਰਟ',
    'newAlerts': 'ਨਵੇਂ ਅਲਰਟ',
    'voiceAssistant': 'ਆਵਾਜ਼ ਸਹਾਇਕ',
    'askFarmingQuestions': 'ਮੇਰੇ ਤੋਂ ਕੋਈ ਵੀ ਖੇਤੀ ਸਵਾਲ ਪੁੱਛੋ',
    'startVoiceChat': 'ਆਵਾਜ਼ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ',
    'open': 'ਖੋਲ੍ਹੋ',
    'recentActivity': 'ਹਾਲ ਦੀ ਗਤੀਵਿਧੀ',
    'riceCropUpdated': 'ਚਾਵਲ ਦੀ ਫਸਲ ਦੀ ਸ੍ਥਿਤੀ ਅਪਡੇਟ ਹੋਈ',
    'hoursAgo': 'ਘੰਟੇ ਪਹਿਲਾਂ',
    'marketPriceAlert': 'ਮਾਰਕੀਟ ਰੇਟ ਅਲਰਟ ਮਿਲਿਆ',
    
    // Common
    'submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'cancel': 'ਰੱਦ ਕਰੋ',
    'save': 'ਸੇਵ ਕਰੋ',
    'back': 'ਵਾਪਸ',
    'next': 'ਅਗਲਾ',
    'welcome': 'ਸਵਾਗਤ',
    'loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'newToKrishiDost': 'ਕ੍ਰਿਸ਼ੀ ਦੋਸਤ ਵਿੱਚ ਨਵੇਂ ਹੋ?',
    'createNewAccount': 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ',
    
    // Voice Assistant
    'tapToSpeak': 'ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ',
    'listeningForCommand': 'ਹੁਕਮ ਸੁਣ ਰਿਹਾ ਹੈ',
    'processing': 'ਪ੍ਰੋਸੈਸਿੰਗ',
    'aiResponse': 'AI ਜਵਾਬ',
    'analyzeImage': 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    
    // Fertilizer
    'fertilizerPrices': 'ਖਾਦ ਦੇ ਰੇਟ (ਸਰਕਾਰੀ ਡੇਟਾ)',
    'name': 'ਨਾਮ',
    'mrp': 'ਐਮਆਰਪੀ',
    'subsidy': 'ਸਬਸਿਡੀ',
    'costOfSale': 'ਵਿਕਰੀ ਦੀ ਲਾਗਤ',
    'personalizedFertilizerSuggestion': 'ਵਿਅਕਤੀਗਤ ਖਾਦ ਸੁਝਾਅ',
    'crop': 'ਫਸਲ',
    'selectCrop': 'ਫਸਲ ਚੁਣੋ',
    'soilType': 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
    'selectSoil': 'ਮਿੱਟੀ ਚੁਣੋ',
    'areaAcres': 'ਖੇਤਰ (ਏਕੜ)',
    'areaPlaceholder': 'ਜਿਵੇਂ 2',
    'getSuggestion': 'ਸੁਝਾਅ ਲਓ',
    'suggestion': 'ਸੁਝਾਅ',
    'yourPreviousSuggestions': 'ਤੁਹਾਡੇ ਪਿਛਲੇ ਸੁਝਾਅ',
    
    // Sidebar
    'fertilizer': 'ਖਾਦ',
    'fertilizerSuggestions': 'ਖਾਦ ਦੀਆਂ ਸੁਝਾਅਾਂ ਪ੍ਰਾਪਤ ਕਰੋ',
    
    // Additional common translations
    'soil': 'ਮਿੱਟੀ',
    'date': 'ਤਾਰੀਖ',
    'area': 'ਖੇਤਰ',
  },
  
  ur: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'کرشی دوست میں آپ کا خوش آمدید',
    'smartCropAdvisory': 'سمارٹ کراپ ایڈوائزری',
    'krishiDost': 'کرشی دوست',
    'digitalFarmingCompanion': 'آپ کا ڈیجیٹل کاشتکاری ساتھی',
    'getStarted': 'شروع کریں',
    'tutorialVideo': 'ٹیوٹوریل ویڈیو',
    'skip': 'چھوڑیں',
    'chooseYourLanguage': 'اپنی زبان منتخب کریں',
    
    // Form Fields
    'yourName': 'آپ کا نام',
    'enterFullName': 'اپنا پورا نام درج کریں',
    'password': 'پاس ورڈ',
    'enterPassword': 'اپنا پاس ورڈ درج کریں',
    'confirmPassword': 'پاس ورڈ کی تصدیق کریں',
    'confirmYourPassword': 'اپنے پاس ورڈ کی تصدیق کریں',
    'login': 'لاگ ان',
    'register': 'رجسٹر',
    'continueOffline': 'آف لائن جاری رکھیں',
    
    // Navigation & Pages
    'dashboard': 'ڈیش بورڈ',
    'myCrop': 'میری فصل',
    'myCrops': 'میری فصلیں',
    'aiCropCalendar': 'AI فصل کیلنڈر',
    'marketPrice': 'مارکیٹ ریٹ',
    'marketPrices': 'مارکیٹ ریٹ',
    'govtSchemes': 'حکومتی اسکیمیں',
    'expertHelp': 'ماہر مدد',
    'cameraDetection': 'کیمرہ شناخت',
    'location': 'مقام',
    'mainMenu': 'اصل مینو',
    'manageLocation': 'اپنا مقام منظم کریں',
    'governmentSchemes': 'حکومتی اسکیمیں',
    
    // Dashboard
    'goodMorningFarmer': 'صبح بخیر، کسان!',
    'farmingDashboardToday': 'آج کے لیے آپ کا زراعتی ڈیش بورڈ',
    'checkCropsField': 'کھیت میں اپنی فصلوں کی جانچ کریں',
    'todayMandiRates': 'آج کے منڈی ریٹ',
    'availableGovtSchemes': 'دستیاب حکومتی اسکیمیں',
    'connectExperts': 'زراعتی ماہرین سے رابطہ',
    'weather': 'موسم',
    'rainfall': 'بارش',
    'season': 'موسم',
    'alerts': 'الرٹ',
    'newAlerts': 'نئے الرٹ',
    'voiceAssistant': 'آوازی مددگار',
    'askFarmingQuestions': 'مجھ سے کوئی بھی زراعتی سوال پوچھیں',
    'startVoiceChat': 'آوازی بات شروع کریں',
    'open': 'کھولیں',
    'recentActivity': 'حالیہ سرگرمی',
    'riceCropUpdated': 'چاول کی فصل کی صورتحال اپ ڈیٹ ہوئی',
    'hoursAgo': 'گھنٹے پہلے',
    'marketPriceAlert': 'مارکیٹ ریٹ الرٹ ملا',
    
    // Common
    'submit': 'جمع کریں',
    'cancel': 'منسوخ',
    'save': 'محفوظ کریں',
    'back': 'واپس',
    'next': 'اگلا',
    'welcome': 'خوش آمدید',
    'loading': 'لوڈ ہو رہا ہے...',
    'newToKrishiDost': 'کرشی دوست میں نئے ہیں؟',
    'createNewAccount': 'نیا اکاؤنٹ بنائیں',
    
    // Voice Assistant
    'tapToSpeak': 'بولنے کے لیے ٹیپ کریں',
    'listeningForCommand': 'حکم سن رہا ہے',
    'processing': 'پروسیسنگ',
    'aiResponse': 'AI جواب',
    'analyzeImage': 'تجزیہ کریں',
    
    // Fertilizer
    'fertilizerPrices': 'کھاد کی قیمتیں (حکومتی ڈیٹا)',
    'name': 'نام',
    'mrp': 'ایم آر پی',
    'subsidy': 'سبسڈی',
    'costOfSale': 'فروخت کی لاگت',
    'personalizedFertilizerSuggestion': 'ذاتی کھاد کی تجویز',
    'crop': 'فصل',
    'selectCrop': 'فصل منتخب کریں',
    'soilType': 'مٹی کی قسم',
    'selectSoil': 'مٹی منتخب کریں',
    'areaAcres': 'رقبہ (ایکڑ)',
    'areaPlaceholder': 'جیسے 2',
    'getSuggestion': 'تجویز حاصل کریں',
    'suggestion': 'تجویز',
    'yourPreviousSuggestions': 'آپ کی پچھلی تجاویز',
    
    // Sidebar
    'fertilizer': 'کھاد',
    'fertilizerSuggestions': 'کھاد کی تجاویز حاصل کریں',
    
    // Additional common translations
    'soil': 'مٹی',
    'date': 'تاریخ',
    'area': 'رقبہ',
  },
  
  ml: {
    // App Title & Welcome
    'welcomeToKrishiDost': 'കൃഷി ദോസ്തിലേക്ക് സ്വാഗതം',
    'smartCropAdvisory': 'സ്മാർട്ട് ക്രോപ്പ് അഡ്വൈസറി',
    'krishiDost': 'കൃഷി ദോസ്ത്',
    'digitalFarmingCompanion': 'നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി',
    'getStarted': 'ആരംഭിക്കുക',
    'tutorialVideo': 'ട്യൂട്ടോറിയൽ വീഡിയോ',
    'skip': 'ഒഴിവാക്കുക',
    'chooseYourLanguage': 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    
    // Form Fields
    'yourName': 'നിങ്ങളുടെ പേര്',
    'enterFullName': 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക',
    'password': 'പാസ്വേഡ്',
    'enterPassword': 'നിങ്ങളുടെ പാസ്വേഡ് നൽകുക',
    'confirmPassword': 'പാസ്വേഡ് സ്ഥിരീകരിക്കുക',
    'confirmYourPassword': 'നിങ്ങളുടെ പാസ്വേഡ് സ്ഥിരീകരിക്കുക',
    'login': 'ലോഗിൻ',
    'register': 'രജിസ്റ്റർ',
    'continueOffline': 'ഓഫ്ലൈനായി തുടരുക',
    
    // Navigation & Pages
    'dashboard': 'ഡാഷ്ബോർഡ്',
    'myCrop': 'എന്റെ വിള',
    'myCrops': 'എന്റെ വിളകൾ',
    'aiCropCalendar': 'AI വിള കലണ്ടർ',
    'marketPrice': 'മാർക്കറ്റ് വില',
    'marketPrices': 'മാർക്കറ്റ് വിലകൾ',
    'govtSchemes': 'സർക്കാർ പദ്ധതികൾ',
    'expertHelp': 'വിദഗ്ധ സഹായം',
    'cameraDetection': 'ക്യാമറ കണ്ടെത്തൽ',
    'location': 'സ്ഥലം',
    'mainMenu': 'പ്രധാന മെനു',
    'manageLocation': 'നിങ്ങളുടെ സ്ഥലം നിയന്ത്രിക്കുക',
    'governmentSchemes': 'സർക്കാർ പദ്ധതികൾ',
    
    // Dashboard
    'goodMorningFarmer': 'സുപ്രഭാതം, കൃഷിക്കാരൻ!',
    'farmingDashboardToday': 'ഇന്നത്തെ നിങ്ങളുടെ കൃഷി ഡാഷ്ബോർഡ്',
    'checkCropsField': 'വയലിലെ നിങ്ങളുടെ വിളകൾ പരിശോധിക്കുക',
    'todayMandiRates': 'ഇന്നത്തെ മണ്ഡി വിലകൾ',
    'availableGovtSchemes': 'ലഭ്യമായ സർക്കാർ പദ്ധതികൾ',
    'connectExperts': 'കൃഷി വിശേഷജ്ഞരുമായി ബന്ധപ്പെടുക',
    'weather': 'കാലാവസ്ഥ',
    'rainfall': 'മഴപ്പൊഴിവ്',
    'season': 'കാലം',
    'alerts': 'അലർട്ടുകൾ',
    'newAlerts': 'പുതിയ അലർട്ടുകൾ',
    'voiceAssistant': 'വോയ്സ് അസിസ്റ്റന്റ്',
    'askFarmingQuestions': 'എന്നോട് ഏതെങ്കിലും കൃഷി ചോദ്യങ്ങൾ ചോദിക്കുക',
    'startVoiceChat': 'വോയ്സ് ചാറ്റ് ആരംഭിക്കുക',
    'open': 'തുറക്കുക',
    'recentActivity': 'സമീപകാല പ്രവർത്തനങ്ങൾ',
    'riceCropUpdated': 'നെല്ലിന്റെ സ്ഥിതി അപ്ഡേറ്റ് ചെയ്തു',
    'hoursAgo': 'മണിക്കൂർ മുമ്പ്',
    'marketPriceAlert': 'മാർക്കറ്റ് വില അലർട്ട് ലഭിച്ചു',
    
    // Common
    'submit': 'സമർപ്പിക്കുക',
    'cancel': 'റദ്ദാക്കുക',
    'save': 'സേവ് ചെയ്യുക',
    'back': 'തിരികെ',
    'next': 'അടുത്തത്',
    'welcome': 'സ്വാഗതം',
    'loading': 'ലോഡ് ചെയ്യുന്നു...',
    'newToKrishiDost': 'കൃഷി ദോസ്തിൽ പുതിയവരാണോ?',
    'createNewAccount': 'പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    
    // Voice Assistant
    'tapToSpeak': 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    'listeningForCommand': 'കമാൻഡ് കേൾക്കുന്നു',
    'processing': 'പ്രോസസ്സിംഗ്',
    'aiResponse': 'AI പ്രതികരണം',
    'analyzeImage': 'വിശകലനം ചെയ്യുക',
    
    // Fertilizer
    'fertilizerPrices': 'വളത്തിന്റെ വിലകൾ (സർക്കാർ ഡാറ്റ)',
    'name': 'പേര്',
    'mrp': 'എംആർപി',
    'subsidy': 'സബ്സിഡി',
    'costOfSale': 'വിൽപ്പന ചെലവ്',
    'personalizedFertilizerSuggestion': 'വ്യക്തിഗത വള നിർദ്ദേശം',
    'crop': 'വിള',
    'selectCrop': 'വിള തിരഞ്ഞെടുക്കുക',
    'soilType': 'മണ്ണിന്റെ തരം',
    'selectSoil': 'മണ്ണ് തിരഞ്ഞെടുക്കുക',
    'areaAcres': 'വിസ്തീർണ്ണം (ഏക്കർ)',
    'areaPlaceholder': 'ഉദാ. 2',
    'getSuggestion': 'നിർദ്ദേശം നേടുക',
    'suggestion': 'നിർദ്ദേശം',
    'yourPreviousSuggestions': 'നിങ്ങളുടെ മുൻ നിർദ്ദേശങ്ങൾ',
    
    // Sidebar
    'fertilizer': 'വളം',
    'fertilizerSuggestions': 'വള നിർദ്ദേശങ്ങൾ നേടുക',
    
    // Additional common translations
    'soil': 'മണ്ണ്',
    'date': 'തീയതി',
    'area': 'വിസ്തീർണ്ണം',
  }
};