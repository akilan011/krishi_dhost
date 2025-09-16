import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    return translations[language]?.[key] || translations.en[key] || key;
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
    'mainMenu': 'Main Menu',
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
    
    // Sidebar descriptions
    'dashboardOverview': 'Dashboard overview',
    'manageYourCrops': 'Manage your crops',
    'smartFarmingCalendar': 'Smart farming calendar',
    'getCurrentMarketRates': 'Current market rates',
    'getExpertAdvice': 'Get expert advice',
    'identifyCropDiseases': 'Identify crop diseases',
    
    // Market & Schemes
    'latestMandiRates': 'Latest mandi rates and commodity prices',
    'searchCropsVarieties': 'Search crops and varieties...',
    'allCrops': 'All Crops',
    'cereals': 'Cereals',
    'cashCrops': 'Cash Crops',
    'priceAlerts': 'Price Alerts',
    'exploreApplySchemes': 'Explore and apply for various government schemes',
    'viewDetails': 'View Details',
    'applyNow': 'Apply Now',
    
    // Crop names
    'Rice': 'Rice',
    'Wheat': 'Wheat',
    'Maize': 'Maize',
    'Cotton': 'Cotton',
    'Sugarcane': 'Sugarcane',
    'Soybean': 'Soybean',
    
    // Scheme names
    'PM-KISAN': 'PM-KISAN',
    'Crop Insurance': 'Crop Insurance',
    'Soil Health Card': 'Soil Health Card',
    'KCC': 'KCC',
    'Organic Farming': 'Organic Farming',
    'Solar Pump': 'Solar Pump',
    
    // Common
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'back': 'Back',
    'next': 'Next',
    'welcome': 'Welcome',
    'loading': 'Loading...',
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
    'mainMenu': 'मुख्य मेनू',
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
    
    // Sidebar descriptions
    'dashboardOverview': 'डैशबोर्ड अवलोकन',
    'manageYourCrops': 'अपनी फसलों का प्रबंधन करें',
    'smartFarmingCalendar': 'स्मार्ट खेती कैलेंडर',
    'getCurrentMarketRates': 'वर्तमान बाजार दरें',
    'getExpertAdvice': 'विशेषज्ञ सलाह प्राप्त करें',
    'identifyCropDiseases': 'फसल रोगों की पहचान करें',
    
    // Market & Schemes
    'latestMandiRates': 'नवीनतम मंडी दरें और कमोडिटी मूल्य',
    'searchCropsVarieties': 'फसलों और किस्मों की खोज करें...',
    'allCrops': 'सभी फसलें',
    'cereals': 'अनाज',
    'cashCrops': 'नकदी फसलें',
    'priceAlerts': 'मूल्य चेतावनी',
    'exploreApplySchemes': 'विभिन्न सरकारी योजनाओं का अन्वेषण और आवेदन करें',
    'viewDetails': 'विवरण देखें',
    'applyNow': 'अभी आवेदन करें',
    
    // Crop names
    'Rice': 'चावल',
    'Wheat': 'गेहूँ',
    'Maize': 'मक्का',
    'Cotton': 'कपास',
    'Sugarcane': 'गन्ना',
    'Soybean': 'सोयाबीन',
    
    // Scheme names
    'PM-KISAN': 'प्रधानमंत्री किसान सम्मान निधि',
    'Crop Insurance': 'फसल बीमा',
    'Soil Health Card': 'मिट्टी स्वास्थ्य कार्ड',
    'KCC': 'किसान क्रेडिट कार्ड',
    'Organic Farming': 'जैविक खेती',
    'Solar Pump': 'सौर पंप',
    
    // Common
    'submit': 'जमा करें',
    'cancel': 'रद्द करें',
    'save': 'सहेजें',
    'back': 'वापस',
    'next': 'आगे',
    'welcome': 'स्वागत',
    'loading': 'लोड हो रहा है...',
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
    'mainMenu': 'முதன்மை மெனு',
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
    
    // Sidebar descriptions
    'dashboardOverview': 'டாஷ்போர்டு அவலோகனம்',
    'manageYourCrops': 'உங்கள் பயிர்களை நிர்வகிக்கவும்',
    'smartFarmingCalendar': 'ஸ்மார்ட் விவசாய நாட்காட்டி',
    'getCurrentMarketRates': 'தற்போதைய சந்தை விலைகள்',
    'getExpertAdvice': 'நிபுணர் ஆலோசனை பெறவும்',
    'identifyCropDiseases': 'பயிர் நோய்களை கண்டறியவும்',
    
    // Market & Schemes
    'latestMandiRates': 'சமீபத்திய மண்டி விலைகள் மற்றும் பொருட்களின் விலைகள்',
    'searchCropsVarieties': 'பயிர்கள் மற்றும் வகைகளைத் தேடுங்கள்...',
    'allCrops': 'அனைத்து பயிர்கள்',
    'cereals': 'தானியங்கள்',
    'cashCrops': 'பணப்பயிர்கள்',
    'priceAlerts': 'விலை எச்சரிக்கைகள்',
    'exploreApplySchemes': 'பல்வேறு அரசு திட்டங்களை ஆராய்ந்து விண்ணப்பிக்கவும்',
    'viewDetails': 'விவரங்களைப் பார்க்கவும்',
    'applyNow': 'இப்போது விண்ணப்பிக்கவும்',
    
    // Crop names
    'Rice': 'அரிசி',
    'Wheat': 'கோதுமை',
    'Maize': 'சோளம்',
    'Cotton': 'பருத்தி',
    'Sugarcane': 'கரும்பு',
    'Soybean': 'சோயாபீன்',
    
    // Scheme names
    'PM-KISAN': 'பிரதான் மந்திரி கிசான் சம்மான் நிதி',
    'Crop Insurance': 'பயிர் காப்பீடு',
    'Soil Health Card': 'மண் ஆரோக்கிய அட்டை',
    'KCC': 'கிசான் கிரெடிட் கார்டு',
    'Organic Farming': 'இயற்கை விவசாயம்',
    'Solar Pump': 'சூரிய பம்ப்',
    
    // Common
    'submit': 'சமர்ப்பிக்கவும்',
    'cancel': 'ரத்து செய்யவும்',
    'save': 'சேமிக்கவும்',
    'back': 'பின்',
    'next': 'அடுத்து',
    'welcome': 'வரவேற்கிறோம்',
    'loading': 'ஏற்றுகிறது...',
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
    'mainMenu': 'ముఖ్య మెనూ',
    'governmentSchemes': 'ప్రభుత్వ పథకాలు',
    
    // Dashboard
    'goodMorningFarmer': 'శుభోదయం, రైతు గారు!',
    'farmingDashboardToday': 'ఇన్ని మీ వ్యవసాయ డాష్బోర్డ్',
    'checkCropsField': 'వయల్లో మీ పంటలను చూడండి',
    'todayMandiRates': 'ఇన్ని మండీ రేటులు',
    'availableGovtSchemes': 'లభ్యమైన ప్రభుత్వ పథకాలు',
    'connectExperts': 'వ్యవసాయ నిపుణులతో కలుపుకోండి',
    'weather': 'వాతావరణం',
    'rainfall': 'వర్షం',
    'season': 'ఋతువు',
    'alerts': 'హెచ్చరికలు',
    'newAlerts': 'కొత్త హెచ్చరికలు',
    'voiceAssistant': 'వాయిస్ అసిస్టెంట్',
    'askFarmingQuestions': 'ఏదైనా వ్యవసాయ ప్రశ్నలను నన్ను అడగండి',
    'startVoiceChat': 'వాయిస్ చాట్ ప్రారంభించండి',
    'open': 'తెరవండి',
    'recentActivity': 'ఇక్కడ కార్యకలాపాలు',
    'riceCropUpdated': 'వాదలు పంట స్థితి అప్డేట్ అయ్యింది',
    'hoursAgo': 'గంటల క్రితం',
    'marketPriceAlert': 'మార్కెట్ విలువ హెచ్చరిక వచ్చింది',
    
    // Sidebar descriptions
    'dashboardOverview': 'డాష్బోర్డ్ అవలోకనం',
    'manageYourCrops': 'మీ పంటలను నిర్వహించండి',
    'smartFarmingCalendar': 'స్మార్ట్ వ్యవసాయ క్యాలెండర్',
    'getCurrentMarketRates': 'ప్రస్తుత మార్కెట్ రేటులు',
    'getExpertAdvice': 'నిపుణుల సలహా తీసుకోండి',
    'identifyCropDiseases': 'పంట రోగాలను గుర్తించండి',
    
    // Market & Schemes
    'latestMandiRates': 'తాజా మండీ రేటులు మరియు వస్తువుల విలువలు',
    'searchCropsVarieties': 'పంటలు మరియు విధాలను వెతకండి...',
    'allCrops': 'అన్ని పంటలు',
    'cereals': 'ధాన్యాలు',
    'cashCrops': 'పణపు పంటలు',
    'priceAlerts': 'విలువ హెచ్చరికలు',
    'exploreApplySchemes': 'వివిధ ప్రభుత్వ పథకాలను అన్వేషించి దరఖాస్తు చేయండి',
    'viewDetails': 'వివరాలు చూడండి',
    'applyNow': 'ఇప్పుడే దరఖాస్తు చేయండి',
    
    // Crop names
    'Rice': 'వాదలు',
    'Wheat': 'గోధుమలు',
    'Maize': 'మక్కజోళం',
    'Cotton': 'పట్టి',
    'Sugarcane': 'కల్లపండు',
    'Soybean': 'సోయాబీన్',
    
    // Scheme names
    'PM-KISAN': 'ప్రధానమంత్రి కిసాన్ సమ్మాన్ నిధి',
    'Crop Insurance': 'పంట వీమ',
    'Soil Health Card': 'మృత్తిక ఆరోగ్య కార్డు',
    'KCC': 'కిసాన్ క్రెడిట్ కార్డు',
    'Organic Farming': 'సేంద్రియ వ్యవసాయం',
    'Solar Pump': 'సౌర పంపు',
    
    // Common
    'submit': 'సబ్మిట్ చేయండి',
    'cancel': 'రద్దు చేయండి',
    'save': 'సేవ్ చేయండి',
    'back': 'వెనుకకు',
    'next': 'తదుపరి',
    'welcome': 'స్వాగతం',
    'loading': 'లోడ్ అవుతోంది...',
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
    
    // Navigation & Pages
    'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'myCrop': 'ਮੇਰੀ ਫਸਲ',
    'myCrops': 'ਮੇਰੀਆਂ ਫਸਲਾਂ',
    'aiCropCalendar': 'AI ਫਸਲ ਕੈਲੰਡਰ',
    'marketPrice': 'ਮਾਰਕੀਟ ਰੇਟ',
    'marketPrices': 'ਮਾਰਕੀਟ ਰੇਟਾਂ',
    'govtSchemes': 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    'expertHelp': 'ਮਾਹਰ ਸਹਾਇਤਾ',
    'cameraDetection': 'ਕੈਮਰਾ ਪਛਾਣ',
    'mainMenu': 'ਮੁੱਖ ਮੀਨੂ',
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
    
    // Sidebar descriptions
    'dashboardOverview': 'ਡੈਸ਼ਬੋਰਡ ਅਵਲੋਕਨ',
    'manageYourCrops': 'ਆਪਣੀਆਂ ਫਸਲਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
    'smartFarmingCalendar': 'ਸਮਾਰਟ ਖੇਤੀ ਕੈਲੰਡਰ',
    'getCurrentMarketRates': 'ਵਰਤਮਾਨ ਮਾਰਕੀਟ ਰੇਟ',
    'getExpertAdvice': 'ਮਾਹਰ ਸਲਾਹ ਲੈਣ ਦਿਓ',
    'identifyCropDiseases': 'ਫਸਲ ਰੋਗਾਂ ਦੀ ਪਹਿਚਾਣ ਕਰੋ',
    
    // Market & Schemes
    'latestMandiRates': 'ਤਾਜ਼ਾ ਮੰਡੀ ਰੇਟ ਅਤੇ ਵਸਤੂਆਂ ਦੇ ਭਾਅ',
    'searchCropsVarieties': 'ਫਸਲਾਂ ਅਤੇ ਕਿਸਮਾਂ ਦੀ ਖੋਜ ਕਰੋ...',
    'allCrops': 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
    'cereals': 'ਅਨਾਜ',
    'cashCrops': 'ਨਕਦੀ ਫਸਲਾਂ',
    'priceAlerts': 'ਰੇਟ ਅਲਰਟ',
    'exploreApplySchemes': 'ਵੱਖ-ਵੱਖ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਖੋਜ ਕਰੋ ਅਤੇ ਅਰਜ਼ੀ ਦਿਓ',
    'viewDetails': 'ਵੇਰਵੇ ਵੇਖੋ',
    'applyNow': 'ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ',
    
    // Crop names
    'Rice': 'ਚਾਵਲ',
    'Wheat': 'ਕਣਕ',
    'Maize': 'ਮਕੈ',
    'Cotton': 'ਕਪਾਹ',
    'Sugarcane': 'ਗਨ੍ਨਾ',
    'Soybean': 'ਸੋਯਾਬੀਨ',
    
    // Scheme names
    'PM-KISAN': 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਮਾਨ ਨਿਧੀ',
    'Crop Insurance': 'ਫਸਲ ਬੀਮਾ',
    'Soil Health Card': 'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ',
    'KCC': 'ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ',
    'Organic Farming': 'ਜੈਵਿਕ ਖੇਤੀ',
    'Solar Pump': 'ਸੌਰ ਪੰਪ',
    
    // Common
    'submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'cancel': 'ਰੱਦ ਕਰੋ',
    'save': 'ਸੇਵ ਕਰੋ',
    'back': 'ਵਾਪਸ',
    'next': 'ਅਗਲਾ',
    'welcome': 'ਸਵਾਗਤ',
    'loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
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
    
    // Navigation & Pages
    'dashboard': 'ڈیش بورڈ',
    'myCrop': 'میری فصل',
    'myCrops': 'میری فصلیں',
    'aiCropCalendar': 'AI فصل کیلنڈر',
    'marketPrice': 'مارکیٹ ریٹ',
    'marketPrices': 'مارکیٹ ریٹس',
    'govtSchemes': 'حکومتی اسکیمیں',
    'expertHelp': 'ماہر مدد',
    'cameraDetection': 'کیمرہ شناخت',
    'mainMenu': 'مین مینو',
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
    
    // Sidebar descriptions
    'dashboardOverview': 'ڈیش بورڈ جائزہ',
    'manageYourCrops': 'اپنی فصلوں کا انتظام کریں',
    'smartFarmingCalendar': 'سمارٹ زراعتی کیلنڈر',
    'getCurrentMarketRates': 'موجودہ مارکیٹ ریٹ',
    'getExpertAdvice': 'ماہر مشورہ حاصل کریں',
    'identifyCropDiseases': 'فصلی بیماریوں کی شناخت کریں',
    
    // Market & Schemes
    'latestMandiRates': 'تازہ منڈی ریٹ اور اجناس کی قیمتیں',
    'searchCropsVarieties': 'فصلوں اور قسموں کی تلاش کریں...',
    'allCrops': 'تمام فصلیں',
    'cereals': 'اناج',
    'cashCrops': 'نقدی فصلیں',
    'priceAlerts': 'قیمت الرٹ',
    'exploreApplySchemes': 'مختلف حکومتی اسکیموں کی تلاش اور اپلائی کریں',
    'viewDetails': 'تفصیلات دیکھیں',
    'applyNow': 'اب اپلائی کریں',
    
    // Crop names
    'Rice': 'چاول',
    'Wheat': 'گیہوں',
    'Maize': 'مکئی',
    'Cotton': 'کپاس',
    'Sugarcane': 'گنا',
    'Soybean': 'سویا بین',
    
    // Scheme names
    'PM-KISAN': 'وزیر اعظم کسان سمان ندھی',
    'Crop Insurance': 'فصلی بیمہ',
    'Soil Health Card': 'مٹی کی صحت کارڈ',
    'KCC': 'کسان کریڈٹ کارڈ',
    'Organic Farming': 'نیچرل کھیتی',
    'Solar Pump': 'شمسی پمپ',
    
    // Common
    'submit': 'جمع کریں',
    'cancel': 'منسوخ',
    'save': 'محفوظ کریں',
    'back': 'واپس',
    'next': 'اگلا',
    'welcome': 'خوش آمدید',
    'loading': 'لوڈ ہو رہا ہے...',
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
    
    // Navigation & Pages
    'dashboard': 'ഡാഷ്ബോർഡ്',
    'myCrop': 'എന്റെ വിള',
    'myCrops': 'എന്റെ വിളകൾ',
    'aiCropCalendar': 'AI വിള കാലണ്ടർ',
    'marketPrice': 'മാർക്കറ്റ് വില',
    'marketPrices': 'മാർക്കറ്റ് വിലകൾ',
    'govtSchemes': 'സർക്കാർ പദ്ധതികൾ',
    'expertHelp': 'വിദഗ്ധ സഹായം',
    'cameraDetection': 'കാമറ കണ്ടെത്തൽ',
    'mainMenu': 'പ്രധാന മെനു',
    'governmentSchemes': 'സർക്കാർ പദ്ധതികൾ',
    
    // Dashboard
    'goodMorningFarmer': 'സുപ്രഭാതം, കൃഷിക്കാരൻ!',
    'farmingDashboardToday': 'ഇന്നത്തെ നിങ്ങളുടെ കൃഷി ഡാഷ്ബോർഡ്',
    'checkCropsField': 'വയലിലെ നിങ്ങളുടെ വിളകള് പരിശോധിക്കുക',
    'todayMandiRates': 'ഇന്നത്തെ മണ്ഡി വിലകള്',
    'availableGovtSchemes': 'ലഭ്യമായ സർക്കാർ പദ്ധതികള്',
    'connectExperts': 'കൃഷി വിശേഷഞ്ഞരുമായി യോഗം ചെയ്യുക',
    'weather': 'കാലാവസ്ഥ',
    'rainfall': 'മഴപ്പൊഴിവ്',
    'season': 'കാലം',
    'alerts': 'അലർട്ടുകൾ',
    'newAlerts': 'പുതിയ അലർട്ടുകള്',
    'voiceAssistant': 'വോയ്സ് അസിസ്റ്റന്റ്',
    'askFarmingQuestions': 'എന്നോട് ഏതെങ്കിലും കൃഷി ചോദ്യങ്ങള് ചോദിക്കുക',
    'startVoiceChat': 'വോയ്സ് ചാറ്റ് ആരംഭിക്കുക',
    'open': 'തുറക്കുക',
    'recentActivity': 'ഇതിന്റെ പ്രവർത്തനങ്ങള്',
    'riceCropUpdated': 'നെല്ലിന്റെ സ്ഥിതി അപ്ഡേറ്റ് ചെയ്തു',
    'hoursAgo': 'മണിക്കൂർ മുമ്പ്',
    'marketPriceAlert': 'മാർക്കറ്റ് വില അലർട്ട് ലഭിച്ചു',
    
    // Sidebar descriptions
    'dashboardOverview': 'ഡാഷ്ബോർഡ് അവലോകനം',
    'manageYourCrops': 'നിങ്ങളുടെ വിളകള് നിര്വഹിക്കുക',
    'smartFarmingCalendar': 'സ്മാർട്ട് കൃഷി ക്യാലണ്ടർ',
    'getCurrentMarketRates': 'നിലവിലെ മാർക്കറ്റ് രേറ്റുകള്',
    'getExpertAdvice': 'വിശേഷഞ്ഞ ഉപദേശം നേടുക',
    'identifyCropDiseases': 'വിള രോഗങ്ങള് കണ്ടെത്തുക',
    
    // Market & Schemes
    'latestMandiRates': 'ഏറ്റവും പുതിയ മണ്ഡി വിലകളും വസ്തുക്കളുടെ വിലകളും',
    'searchCropsVarieties': 'വിളകളും വരീയറ്റികളും തെടുക്കുക...',
    'allCrops': 'എല്ലാ വിളകളും',
    'cereals': 'ധാന്യങ്ങള്',
    'cashCrops': 'പണവിളകള്',
    'priceAlerts': 'വില അലർട്ടുകള്',
    'exploreApplySchemes': 'വിവിധ സർക്കാർ പദ്ധതികള് അന്വേഷിച്ച് അപ്ലിക്കേഷന് നൽകുക',
    'viewDetails': 'വിശദാംശങ്ങൾ കാണുക',
    'applyNow': 'ഇപ്പോൾ അപ്ലൈ ചെയ്യുക',
    
    // Crop names
    'Rice': 'അരി',
    'Wheat': 'ഗോധുമയ്',
    'Maize': 'ചോളം',
    'Cotton': 'പരുത്തി',
    'Sugarcane': 'കരിംപ്',
    'Soybean': 'സോയാബീൻ',
    
    // Scheme names
    'PM-KISAN': 'പ്രധാനമന്ത്രി കിസാൻ സമ്മാൻ നിധി',
    'Crop Insurance': 'വിള ഇൻഷ്വറൻസ്',
    'Soil Health Card': 'മണ്ണിന്റെ ആരോഗ്യ കാർഡ്',
    'KCC': 'കിസാൻ ക്രെഡിറ്റ് കാർഡ്',
    'Organic Farming': 'ഓർഗാനിക് കൃഷി',
    'Solar Pump': 'സൌര പമ്പ്',
    
    // Common
    'submit': 'സമർപ്പിക്കുക',
    'cancel': 'റദ്ദാക്കുക',
    'save': 'സേവ് ചെയ്യുക',
    'back': 'തിരികെ',
    'next': 'അടുത്തത്',
    'welcome': 'സ്വാഗതം',
    'loading': 'ലോഡ് ചെയ്യുന്നു...',
  }
};