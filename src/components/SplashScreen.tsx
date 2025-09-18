import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, X } from "lucide-react";
import agriculturalLandscape from "@/assets/agricultural-landscape.jpg";
import { useLanguage, SupportedLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useLanguage();
  const [showVideo, setShowVideo] = useState(false);

  const handleSkip = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-agricultural relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${agriculturalLandscape})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* App Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🌱 {t('smartCropAdvisory')}
          </h1>
          <h2 className="text-2xl font-semibold text-white/90 drop-shadow-md">
            {t('krishiDost')}
          </h2>
          <p className="text-lg text-white/80 mt-2 drop-shadow-sm">
            {t('digitalFarmingCompanion')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-md">
            {t('chooseYourLanguage')}
          </h3>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                variant={language === lang.code ? "hero" : "outline"}
                size="sm"
                className={`text-sm font-medium ${
                  language === lang.code 
                    ? "bg-white/30 border-white/50 text-white" 
                    : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                }`}
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
            size="lg"
            className="w-full text-xl py-6 shadow-2xl"
          >
            <Play className="mr-3 h-6 w-6" />
            {t('tutorialVideo')}
          </Button>

          {/* Skip Button */}
          <Button 
            onClick={handleSkip}
            variant="outline"
            size="lg"
            className="w-full text-xl py-6 bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/30"
          >
            {t('skip')}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center mt-8 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
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