// Extended translation keys for comprehensive language support
export const extendedTranslations = {
  en: {
    // Crop types and varieties
    'rice': 'Rice',
    'wheat': 'Wheat',
    'corn': 'Corn',
    'millets': 'Millets',
    'oats': 'Oats',
    'soybeans': 'Soybeans',
    'sugarcane': 'Sugarcane',
    'cotton': 'Cotton',
    'chickpea': 'Chickpea',
    'mustard': 'Mustard',
    'potato': 'Potato',
    'tomato': 'Tomato',
    'onion': 'Onion',
    'other': 'Other',
    
    // App features
    'whatCropSowing': 'What crop are you sowing?',
    'selectCropType': 'Select crop type',
    'howMuchLand': 'How much land/acreage?',
    'plantingDate': 'Planting Date',
    'addCropGenerateSchedule': 'Add Crop & Generate Schedule',
    'harvestInformation': 'Harvest Information',
    'redirectingMyCrops': 'Redirecting to My Crops page...',
    
    // Government schemes and features
    'governmentSchemes': 'Government Schemes',
    'availableSchemes': 'Available government schemes for farmers',
    'identifyCropDiseases': 'Identify crop diseases',
    'smartFarmingCalendar': 'Smart farming calendar',
    'getCurrentMarketRates': 'Current market rates',
    'getExpertAdvice': 'Get expert advice',
    'manageYourCrops': 'Manage your crops',
    'dashboardOverview': 'Dashboard overview',
    'location': 'Location',
    'manageLocation': 'Manage your location',
    
    // Common agricultural terms
    'perQuintal': 'per quintal',
    'acres': 'acres',
    'hectare': 'hectare',
    'quintal': 'quintal',
    'kg': 'kg',
    'tons': 'tons',
    
    // Weather and farming
    'temperature': 'Temperature',
    'humidity': 'Humidity',
    'windSpeed': 'Wind Speed',
    'soilMoisture': 'Soil Moisture',
    'irrigation': 'Irrigation',
    'fertilizer': 'Fertilizer',
    'pestControl': 'Pest Control',
    'harvesting': 'Harvesting',
    'analyzeImage': "Analyze"
  },
  
  hi: {
    // Crop types and varieties
    'rice': 'चावल',
    'wheat': 'गेहूँ',
    'corn': 'मक्का',
    'millets': 'बाजरा',
    'oats': 'जई',
    'soybeans': 'सोयाबीन',
    'sugarcane': 'गन्ना',
    'cotton': 'कपास',
    'chickpea': 'चना',
    'mustard': 'सरसों',
    'potato': 'आलू',
    'tomato': 'टमाटर',
    'onion': 'प्याज',
    'other': 'अन्य',
    
    // App features
    'whatCropSowing': 'आप कौन सी फसल बो रहे हैं?',
    'selectCropType': 'फसल का प्रकार चुनें',
    'howMuchLand': 'कितनी जमीन/एकड़?',
    'plantingDate': 'बुवाई की तारीख',
    'addCropGenerateSchedule': 'फसल जोड़ें और कार्यक्रम बनाएं',
    'harvestInformation': 'कटाई की जानकारी',
    'redirectingMyCrops': 'मेरी फसलें पेज पर जा रहे हैं...',
    
    // Government schemes and features
    'governmentSchemes': 'सरकारी योजनाएं',
    'availableSchemes': 'किसानों के लिए उपलब्ध सरकारी योजनाएं',
    'identifyCropDiseases': 'फसल रोगों की पहचान करें',
    'smartFarmingCalendar': 'स्मार्ट कृषि कैलेंडर',
    'getCurrentMarketRates': 'वर्तमान बाजार दरें',
    'getExpertAdvice': 'विशेषज्ञ सलाह प्राप्त करें',
    'manageYourCrops': 'अपनी फसलों का प्रबंधन करें',
    'dashboardOverview': 'डैशबोर्ड अवलोकन',
    'location': 'स्थान',
    'manageLocation': 'अपना स्थान प्रबंधित करें',
    
    // Common agricultural terms
    'perQuintal': 'प्रति क्विंटल',
    'acres': 'एकड़',
    'hectare': 'हेक्टेयर',
    'quintal': 'क्विंटल',
    'kg': 'किलो',
    'tons': 'टन',
    
    // Weather and farming
    'temperature': 'तापमान',
    'humidity': 'नमी',
    'windSpeed': 'हवा की गति',
    'soilMoisture': 'मिट्टी की नमी',
    'irrigation': 'सिंचाई',
    'fertilizer': 'उर्वरक',
    'pestControl': 'कीट नियंत्रण',
    'harvesting': 'कटाई',
  }
};

// Helper function to get extended translation
export const getExtendedTranslation = (language: string, key: string): string => {
  return extendedTranslations[language as keyof typeof extendedTranslations]?.[key as keyof typeof extendedTranslations.en] || key;
};