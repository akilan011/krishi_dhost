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
  WifiOff
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ExpertHelp = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [queryForm, setQueryForm] = useState({
    category: "",
    subject: "",
    description: ""
  });
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check for speech synthesis support
  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
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

  // Recent queries
  const recentQueries = [
    {
      id: 1,
      subject: "Yellow leaves in rice crop",
      category: "Disease Management",
      status: "Answered",
      expert: "Dr. Priya Sharma",
      date: "2 hours ago",
      replies: 3
    },
    {
      id: 2,
      subject: "Best fertilizer for wheat",
      category: "Soil & Nutrition",
      status: "Pending",
      date: "5 hours ago",
      replies: 0
    },
    {
      id: 3,
      subject: "Pest control in cotton",
      category: "Pest Management",
      status: "Answered",
      expert: "Dr. Rajesh Kumar",
      date: "1 day ago",
      replies: 5
    }
  ];

  // Offline FAQ for common agricultural questions
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

    // Handle offline mode
    if (!isOnline) {
      const matchedFAQ = offlineFAQ.find(faq => 
        faq.question.toLowerCase().includes(queryForm.description.toLowerCase()) ||
        queryForm.description.toLowerCase().includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
      );
      
      if (matchedFAQ) {
        setCurrentQuestion(queryForm.description);
        setAiResponse(matchedFAQ.answer);
        setQueryForm({ category: "", subject: "", description: "" });
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

    try {
      const { data, error } = await supabase.functions.invoke('ai-expert', {
        body: { question: queryForm.description }
      });

      if (error) {
        throw error;
      }

      if (data.answer) {
        setAiResponse(data.answer);
      } else {
        throw new Error("No response received");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Provide offline fallback if network error
      if (!navigator.onLine) {
        const fallbackFAQ = offlineFAQ[0]; // Provide a general answer
        setAiResponse("I couldn't connect to get the latest advice, but here's some general guidance: " + fallbackFAQ.answer);
      } else {
        setAiResponse("I couldn't find an answer right now. Please try again or check your internet connection.");
      }
      
      toast({
        title: "Connection Error",
        description: "Failed to get expert advice. Please check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setQueryForm({ category: "", subject: "", description: "" });
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

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to play audio response.",
        variant: "destructive"
      });
    };

    window.speechSynthesis.speak(utterance);
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
                <label className="text-sm font-medium">{t('category')}</label>
                <Select onValueChange={(value) => setQueryForm({...queryForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('subject')}</label>
                <Input
                  placeholder={t('briefDescription')}
                  value={queryForm.subject}
                  onChange={(e) => setQueryForm({...queryForm, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t('detailedDescription')}</label>
                <Textarea
                  placeholder={t('describeProblem')}
                  value={queryForm.description}
                  onChange={(e) => setQueryForm({...queryForm, description: e.target.value})}
                  rows={4}
                />
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
                    Fetching Expert Advice...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {isOnline ? t('submitQuestion') : 'Ask (Offline Mode)'}
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
                  AI Agricultural Expert
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
                    <span className="ml-3 text-lg">Fetching expert advice...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-primary">Expert Advice:</p>
                      {speechSupported && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakResponse(aiResponse)}
                          className="flex items-center"
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
                  recentQueries.map((query) => (
                    <div key={query.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{query.subject}</h4>
                        <Badge className={getStatusColor(query.status)}>
                          {query.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <span>{query.category}</span>
                        <span>{query.date}</span>
                        {query.replies > 0 && (
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {query.replies} replies
                          </span>
                        )}
                      </div>
                      {query.expert && (
                        <p className="text-sm text-primary mt-1">{t('answeredBy')} {query.expert}</p>
                      )}
                    </div>
                  ))
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