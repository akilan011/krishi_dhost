import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, X } from "lucide-react";
import farmerHero from "@/assets/farmer-hero.jpg";
import { useLanguage, SupportedLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useLanguage();
  const [showVideo, setShowVideo] = useState(false);

  const handleSkip = () => {
    localStorage.setItem('hasSeenSplash', 'true');
    navigate("/login");
  };

  const handleTutorialVideo = () => {
    setShowVideo(true);
  };

  const handleLanguageSelect = (selectedLanguage: SupportedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const languages = [
    { code: 'en' as SupportedLanguage, name: 'English' },
    { code: 'hi' as SupportedLanguage, name: 'हिंदी' },
    { code: 'ta' as SupportedLanguage, name: 'தமிழ்' },
    { code: 'te' as SupportedLanguage, name: 'తెలుగు' },
    { code: 'pa' as SupportedLanguage, name: 'ਪੰਜਾਬੀ' },
    { code: 'ur' as SupportedLanguage, name: 'اردو' },
    { code: 'ml' as SupportedLanguage, name: 'മലയാളം' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #2d5016 0%, #3e6b1f 25%, #4a7c23 50%, #5a8f2a 75%, #6ba132 100%)'}}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${farmerHero})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* App Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-2xl text-center" style={{fontFamily: 'Times New Roman, serif', color: '#E1D9D1'}}>
            {t('smartCropAdvisory')}
          </h1>
          <h2 className="text-2xl font-semibold drop-shadow-xl" style={{fontFamily: 'Times New Roman, serif', color: '#E1D9D1'}}>
            {t('krishiDost')}
          </h2>
          <p className="text-lg mt-2 drop-shadow-lg" style={{fontFamily: 'Times New Roman, serif', color: '#E1D9D1'}}>
            {t('digitalFarmingCompanion')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 drop-shadow-xl" style={{fontFamily: 'Times New Roman, serif', color: '#E1D9D1'}}>
            {t('chooseYourLanguage')}
          </h3>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                variant={language === lang.code ? "hero" : "outline"}
                size="lg"
                className={`text-lg font-bold py-4 px-6 ${
                  language === lang.code 
                    ? "bg-white/30 border-white/50 text-white" 
                    : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                }`}
                style={{fontFamily: 'Times New Roman, serif'}}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Tutorial Video Button */}
          <Button 
            onClick={handleTutorialVideo}
            variant="hero"
            className="w-full shadow-2xl text-xl"
            style={{fontFamily: 'Times New Roman, serif'}}
          >
            <Play className="mr-3 h-5 w-5" />
            {t('tutorialVideo')}
          </Button>

          {/* Skip Button */}
          <Button 
            onClick={handleSkip}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/30 text-xl"
            style={{fontFamily: 'Times New Roman, serif'}}
          >
            {t('skip')}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>


      </div>

      {/* Video Dialog */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-4xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              Tutorial Video
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVideo(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/9UB3weW0BLA"
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-b-lg"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SplashScreen;