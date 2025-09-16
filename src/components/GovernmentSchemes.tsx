import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Search, Calendar, IndianRupee, Users, FileText, ExternalLink, Filter, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GovernmentSchemes = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [apiSchemes, setApiSchemes] = useState<any[]>([]);
  const [showPersonalizedSearch, setShowPersonalizedSearch] = useState(false);
  
  // Form state for MyScheme API
  const [formData, setFormData] = useState({
    state: "",
    category: "agriculture",
    landSize: "",
    cropType: "",
    income: "",
    age: ""
  });

  // Sample government schemes data
  const schemes = [
    {
      id: 1,
      name: "PM-KISAN",
      fullName: "Pradhan Mantri Kisan Samman Nidhi",
      description: "Direct income support of ₹6000 per year to small and marginal farmers",
      benefit: "₹6,000 per year",
      eligibility: "Small and marginal farmers with cultivable land up to 2 hectares",
      category: "central",
      status: "active",
      applicationProcess: "Online through PM-KISAN portal or nearest CSC",
      documents: ["Land records", "Aadhaar card", "Bank account details"],
      lastDate: "Ongoing"
    },
    {
      id: 2,
      name: "Crop Insurance",
      fullName: "Pradhan Mantri Fasal Bima Yojana",
      description: "Comprehensive crop insurance against natural calamities",
      benefit: "Up to 200% of sum insured",
      eligibility: "All farmers growing notified crops in notified areas",
      category: "central",
      status: "active",
      applicationProcess: "Through banks, insurance companies, or CSCs",
      documents: ["Land documents", "Sowing certificate", "Aadhaar card"],
      lastDate: "Before sowing season"
    },
    {
      id: 3,
      name: "Soil Health Card",
      fullName: "Soil Health Card Scheme",
      description: "Free soil testing and nutrient recommendations for farmers",
      benefit: "Free soil analysis",
      eligibility: "All farmers",
      category: "central",
      status: "active",
      applicationProcess: "Contact local agriculture department",
      documents: ["Land ownership proof", "Application form"],
      lastDate: "Ongoing"
    },
    {
      id: 4,
      name: "KCC",
      fullName: "Kisan Credit Card",
      description: "Credit support for agriculture and allied activities",
      benefit: "Credit up to ₹3 lakh",
      eligibility: "All farmers with land holding or tenant farmers",
      category: "central",
      status: "active",
      applicationProcess: "Apply at nearest bank branch",
      documents: ["Land documents", "Identity proof", "Address proof"],
      lastDate: "Ongoing"
    },
    {
      id: 5,
      name: "Organic Farming",
      fullName: "Paramparagat Krishi Vikas Yojana",
      description: "Support for organic farming practices and certification",
      benefit: "₹50,000 per hectare over 3 years",
      eligibility: "Farmers willing to adopt organic farming",
      category: "central",
      status: "active",
      applicationProcess: "Through state agriculture departments",
      documents: ["Land records", "Cluster formation certificate"],
      lastDate: "March 31, 2024"
    },
    {
      id: 6,
      name: "Solar Pump",
      fullName: "PM-KUSUM Solar Pump Scheme",
      description: "Subsidized solar water pumps for irrigation",
      benefit: "60% subsidy on solar pumps",
      eligibility: "Individual farmers and farmer groups",
      category: "central",
      status: "active",
      applicationProcess: "Through state nodal agencies",
      documents: ["Land ownership proof", "Electricity connection proof"],
      lastDate: "December 31, 2024"
    }
  ];

  // Combine static schemes with API schemes
  const allSchemes = [...schemes, ...apiSchemes];
  
  const filteredSchemes = allSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || scheme.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handlePersonalizedSearch = async () => {
    if (!formData.state || !formData.landSize) {
      toast.error("Please fill in at least State and Land Size to search for schemes");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('myscheme-search', {
        body: formData
      });

      if (error) {
        console.error('API Error:', error);
        toast.error("Failed to fetch personalized schemes. Please try again.");
        return;
      }

      if (data?.success && data?.schemes) {
        setApiSchemes(data.schemes);
        toast.success(`Found ${data.schemes.length} personalized schemes for you!`);
        setShowPersonalizedSearch(false);
      } else {
        toast.error("No schemes found matching your criteria. Try adjusting your search parameters.");
      }
    } catch (error) {
      console.error('Search Error:', error);
      toast.error("Unable to connect to scheme database. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "central": return "bg-blue-100 text-blue-800";
      case "state": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('governmentSchemes')}</h1>
        <p className="text-muted-foreground">{t('exploreApplySchemes')}</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchSchemes')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="farmer"
                onClick={() => setShowPersonalizedSearch(!showPersonalizedSearch)}
                size="sm"
                disabled={isLoading}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Find For Me
              </Button>
              <Button
                variant={selectedFilter === "all" ? "farmer" : "outline"}
                onClick={() => setSelectedFilter("all")}
                size="sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                {t('all')}
              </Button>
              <Button
                variant={selectedFilter === "central" ? "farmer" : "outline"}
                onClick={() => setSelectedFilter("central")}
                size="sm"
              >
                {t('central')}
              </Button>
              <Button
                variant={selectedFilter === "state" ? "farmer" : "outline"}
                onClick={() => setSelectedFilter("state")}
                size="sm"
              >
                {t('state')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Search Form */}
      {showPersonalizedSearch && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Find Schemes Personalized for You</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in your details to get schemes that match your specific requirements
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">State *</label>
                <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Land Size *</label>
                <Select value={formData.landSize} onValueChange={(value) => setFormData({...formData, landSize: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select land size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (Up to 2 hectares)</SelectItem>
                    <SelectItem value="marginal">Marginal (Up to 1 hectare)</SelectItem>
                    <SelectItem value="medium">Medium (2-10 hectares)</SelectItem>
                    <SelectItem value="large">Large (Above 10 hectares)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Primary Crop Type</label>
                <Select value={formData.cropType} onValueChange={(value) => setFormData({...formData, cropType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="oilseeds">Oilseeds</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Annual Income</label>
                <Select value={formData.income} onValueChange={(value) => setFormData({...formData, income: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below-2-lakh">Below ₹2 Lakh</SelectItem>
                    <SelectItem value="2-5-lakh">₹2-5 Lakh</SelectItem>
                    <SelectItem value="5-10-lakh">₹5-10 Lakh</SelectItem>
                    <SelectItem value="above-10-lakh">Above ₹10 Lakh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handlePersonalizedSearch} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fetching schemes...
                  </>
                ) : (
                  'Find Matching Schemes'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPersonalizedSearch(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{schemes.length}</p>
            <p className="text-sm text-muted-foreground">{t('totalSchemes')}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <IndianRupee className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">₹6K+</p>
            <p className="text-sm text-muted-foreground">{t('avgBenefit')}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">12M+</p>
            <p className="text-sm text-muted-foreground">{t('beneficiaries')}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">{t('ongoing')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(scheme.category)}>
                  {scheme.category.toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(scheme.status)}>
                  {scheme.status.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-lg">{t(scheme.name) || scheme.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">{scheme.fullName}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm">{scheme.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <IndianRupee className="h-4 w-4 mr-2 text-success" />
                  <span className="font-medium text-success">{scheme.benefit}</span>
                </div>
                
                <div className="flex items-start text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{scheme.eligibility}</span>
                </div>
                
                 <div className="flex items-center text-sm">
                   <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                   <span className="text-muted-foreground">
                     Apply by: {scheme.lastDate || scheme.applicationDeadline || "Ongoing"}
                   </span>
                 </div>

                 {scheme.ministry && (
                   <div className="flex items-center text-sm">
                     <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                     <span className="text-muted-foreground">{scheme.ministry}</span>
                   </div>
                 )}
               </div>

               <div className="space-y-2">
                 <h4 className="font-medium text-sm">{t('requiredDocuments')}:</h4>
                 <div className="flex flex-wrap gap-1">
                   {(scheme.documents || scheme.documentsRequired || []).slice(0, 2).map((doc, index) => (
                     <Badge key={index} variant="outline" className="text-xs">
                       {doc}
                    </Badge>
                   ))}
                   {(scheme.documents || scheme.documentsRequired || []).length > 2 && (
                     <Badge variant="outline" className="text-xs">
                       +{(scheme.documents || scheme.documentsRequired || []).length - 2} more
                     </Badge>
                   )}
                 </div>
               </div>

               <div className="flex space-x-2">
                 <Button size="sm" variant="farmer" className="flex-1 min-w-0 text-xs px-2 py-1">
                   <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                   <span className="truncate">{t('applyNow')}</span>
                 </Button>
                 <Button 
                   size="sm" 
                   variant="outline"
                   className="flex-shrink-0 px-2"
                   onClick={() => {
                     if (scheme.officialLink) {
                       window.open(scheme.officialLink, '_blank');
                     } else {
                       toast.info("Official link will be available soon");
                     }
                   }}
                 >
                   <ExternalLink className="h-3 w-3" />
                 </Button>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">{t('applicationTips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">{t('documentsReady')}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">{t('applyEarly')}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">{t('visitCSC')}</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-sm">{t('keepReceipts')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentSchemes;