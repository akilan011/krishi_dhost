import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Fertilizer {
  name: string;
  mrp?: number | null;
  subsidy?: number | null;
  cost_of_sale?: number | null;
  source: "gov" | "local";
}

interface SavedSuggestion {
  id: number;
  crop: string;
  soil: string;
  area: number;
  suggestion: string;
  created_at: string;
}

const Fertilizer: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>(() => {
    // Load cached data immediately for instant display
    const cached = localStorage.getItem('fertilizerCache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [savedSuggestions, setSavedSuggestions] = useState<SavedSuggestion[]>(() => {
    const saved = localStorage.getItem('Fertilizer Suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  // Form state
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [area, setArea] = useState<number | "">("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [currentLocation, setCurrentLocation] = useState(() => {
    const farmerData = localStorage.getItem('farmerData');
    return farmerData ? JSON.parse(farmerData).village || 'India' : 'India';
  });
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showStores, setShowStores] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState<string>('');

  const getStoresForLocation = (fertilizer: string, location: string) => {
    const locationName = location.split(',')[0];
    return [
      { name: `${locationName} Agro Center`, address: `Main Road, ${locationName}`, phone: '+91 98765 43210', distance: '0.5 km' },
      { name: `Krishi Seva Kendra`, address: `Market Area, ${locationName}`, phone: '+91 98765 43211', distance: '1.2 km' },
      { name: `${locationName} Fertilizer Store`, address: `Bus Stand Road, ${locationName}`, phone: '+91 98765 43212', distance: '2.1 km' }
    ];
  };

  const cropOptions = [
    "Wheat", "Rice", "Maize", "Millets", "Soybeans", "Sugarcane",
    "Barley", "Cotton", "Groundnut", "Potato", "Tomato", "Onion",
    "Chili", "Cabbage", "Cauliflower", "Brinjal", "Mustard",
    "Sunflower", "Sesame", "Bajra", "Jowar", "Ragi",
  ];

  const soilOptions = ["Loamy", "Sandy", "Clay", "Silty", "Peaty", "Chalky"];

  const cropSoilFertilizerMap: Record<string, Record<string, string[]>> = {
    wheat: {
      loamy: ["Urea", "DAP"],
      sandy: ["NPK", "MOP"],
      clay: ["DAP", "MOP"],
      silty: ["NPK", "Urea"],
      peaty: ["DAP", "NPK"],
      chalky: ["Urea", "MOP"]
    },
    rice: {
      loamy: ["DAP", "MOP"],
      sandy: ["NPK", "Urea"],
      clay: ["NPK", "MOP"],
      silty: ["DAP", "NPK"],
      peaty: ["Urea", "DAP"],
      chalky: ["NPK", "MOP"]
    },
    maize: {
      loamy: ["Urea", "MOP"],
      sandy: ["NPK", "DAP"],
      clay: ["Urea", "DAP"],
      silty: ["NPK", "MOP"],
      peaty: ["NPK", "DAP"],
      chalky: ["Urea", "NPK"]
    },
  };

  // Memoized comprehensive list of fertilizers
  const getComprehensiveFertilizerList = useMemo((): Fertilizer[] => {
    return [
      // Primary Fertilizers
      { name: "Urea (46% N)", mrp: 266, subsidy: 242, cost_of_sale: 24, source: "local" },
      { name: "DAP (Di-Ammonium Phosphate)", mrp: 1350, subsidy: 150, cost_of_sale: 1200, source: "local" },
      { name: "MOP (Muriate of Potash)", mrp: 1700, subsidy: 200, cost_of_sale: 1500, source: "local" },
      { name: "NPK 10:26:26", mrp: 1450, subsidy: 180, cost_of_sale: 1270, source: "local" },
      { name: "NPK 12:32:16", mrp: 1380, subsidy: 160, cost_of_sale: 1220, source: "local" },
      { name: "NPK 20:20:0:13", mrp: 1250, subsidy: 140, cost_of_sale: 1110, source: "local" },
      { name: "NPK 19:19:19", mrp: 1320, subsidy: 170, cost_of_sale: 1150, source: "local" },
      { name: "NPK 17:17:17", mrp: 1280, subsidy: 150, cost_of_sale: 1130, source: "local" },
      { name: "NPK 15:15:15", mrp: 1200, subsidy: 130, cost_of_sale: 1070, source: "local" },
      { name: "NPK 14:35:14", mrp: 1420, subsidy: 190, cost_of_sale: 1230, source: "local" },
      
      // Secondary Fertilizers
      { name: "Single Super Phosphate (SSP)", mrp: 450, subsidy: 80, cost_of_sale: 370, source: "local" },
      { name: "Triple Super Phosphate (TSP)", mrp: 850, subsidy: 120, cost_of_sale: 730, source: "local" },
      { name: "Ammonium Sulphate", mrp: 680, subsidy: 90, cost_of_sale: 590, source: "local" },
      { name: "Calcium Ammonium Nitrate (CAN)", mrp: 720, subsidy: 100, cost_of_sale: 620, source: "local" },
      { name: "Potassium Sulphate", mrp: 2200, subsidy: 300, cost_of_sale: 1900, source: "local" },
      { name: "Potassium Chloride", mrp: 1650, subsidy: 200, cost_of_sale: 1450, source: "local" },
      
      // Micronutrient Fertilizers
      { name: "Zinc Sulphate (21% Zn)", mrp: 850, subsidy: 50, cost_of_sale: 800, source: "local" },
      { name: "Ferrous Sulphate (19% Fe)", mrp: 420, subsidy: 30, cost_of_sale: 390, source: "local" },
      { name: "Manganese Sulphate (30% Mn)", mrp: 950, subsidy: 60, cost_of_sale: 890, source: "local" },
      { name: "Copper Sulphate (24% Cu)", mrp: 1200, subsidy: 80, cost_of_sale: 1120, source: "local" },
      { name: "Boron (17% B)", mrp: 1800, subsidy: 100, cost_of_sale: 1700, source: "local" },
      { name: "Magnesium Sulphate (9.6% Mg)", mrp: 650, subsidy: 40, cost_of_sale: 610, source: "local" },
      
      // Organic Fertilizers
      { name: "Vermicompost", mrp: 350, subsidy: 50, cost_of_sale: 300, source: "local" },
      { name: "Neem Cake", mrp: 280, subsidy: 40, cost_of_sale: 240, source: "local" },
      { name: "Bone Meal", mrp: 450, subsidy: 60, cost_of_sale: 390, source: "local" },
      { name: "Castor Cake", mrp: 320, subsidy: 45, cost_of_sale: 275, source: "local" },
      { name: "Mustard Cake", mrp: 380, subsidy: 55, cost_of_sale: 325, source: "local" },
      { name: "Groundnut Cake", mrp: 420, subsidy: 65, cost_of_sale: 355, source: "local" },
      
      // Liquid Fertilizers
      { name: "Liquid NPK 19:19:19", mrp: 180, subsidy: 20, cost_of_sale: 160, source: "local" },
      { name: "Liquid Urea (25% N)", mrp: 120, subsidy: 15, cost_of_sale: 105, source: "local" },
      { name: "Liquid Phosphorus (52% P2O5)", mrp: 220, subsidy: 30, cost_of_sale: 190, source: "local" },
      { name: "Liquid Potash (50% K2O)", mrp: 250, subsidy: 35, cost_of_sale: 215, source: "local" },
      
      // Specialty Fertilizers
      { name: "Calcium Nitrate", mrp: 980, subsidy: 80, cost_of_sale: 900, source: "local" },
      { name: "Magnesium Nitrate", mrp: 1150, subsidy: 90, cost_of_sale: 1060, source: "local" },
      { name: "Potassium Nitrate", mrp: 2800, subsidy: 200, cost_of_sale: 2600, source: "local" },
      { name: "Mono Ammonium Phosphate (MAP)", mrp: 1380, subsidy: 160, cost_of_sale: 1220, source: "local" },
      { name: "Ammonium Chloride", mrp: 580, subsidy: 70, cost_of_sale: 510, source: "local" },
      
      // Water Soluble Fertilizers
      { name: "WSF NPK 20:20:20", mrp: 320, subsidy: 40, cost_of_sale: 280, source: "local" },
      { name: "WSF NPK 13:0:45", mrp: 380, subsidy: 50, cost_of_sale: 330, source: "local" },
      { name: "WSF NPK 0:52:34", mrp: 420, subsidy: 60, cost_of_sale: 360, source: "local" },
      { name: "WSF Calcium Chloride", mrp: 280, subsidy: 30, cost_of_sale: 250, source: "local" },
      
      // Bio-fertilizers
      { name: "Rhizobium Culture", mrp: 150, subsidy: 25, cost_of_sale: 125, source: "local" },
      { name: "Azotobacter Culture", mrp: 180, subsidy: 30, cost_of_sale: 150, source: "local" },
      { name: "PSB (Phosphate Solubilizing Bacteria)", mrp: 160, subsidy: 28, cost_of_sale: 132, source: "local" },
      { name: "Mycorrhiza", mrp: 220, subsidy: 35, cost_of_sale: 185, source: "local" },
      { name: "Azospirillum", mrp: 170, subsidy: 25, cost_of_sale: 145, source: "local" },
      
      // Foliar Fertilizers
      { name: "Foliar NPK 12:61:0", mrp: 280, subsidy: 35, cost_of_sale: 245, source: "local" },
      { name: "Foliar Micronutrient Mix", mrp: 350, subsidy: 45, cost_of_sale: 305, source: "local" },
      { name: "Foliar Calcium Boron", mrp: 320, subsidy: 40, cost_of_sale: 280, source: "local" },
      
      // Slow Release Fertilizers
      { name: "Coated Urea (Slow Release)", mrp: 450, subsidy: 60, cost_of_sale: 390, source: "local" },
      { name: "Polymer Coated NPK", mrp: 680, subsidy: 80, cost_of_sale: 600, source: "local" },
      
      // Chelated Micronutrients
      { name: "Chelated Iron (EDTA)", mrp: 1200, subsidy: 100, cost_of_sale: 1100, source: "local" },
      { name: "Chelated Zinc (EDTA)", mrp: 1350, subsidy: 120, cost_of_sale: 1230, source: "local" },
      { name: "Chelated Manganese (EDTA)", mrp: 1450, subsidy: 130, cost_of_sale: 1320, source: "local" },
      
      // Soil Conditioners
      { name: "Gypsum (Calcium Sulphate)", mrp: 180, subsidy: 20, cost_of_sale: 160, source: "local" },
      { name: "Lime (Calcium Carbonate)", mrp: 120, subsidy: 15, cost_of_sale: 105, source: "local" },
      { name: "Sulphur (90% S)", mrp: 280, subsidy: 30, cost_of_sale: 250, source: "local" },
      
      // Specialty Crop Fertilizers
      { name: "Tea Special Fertilizer", mrp: 850, subsidy: 80, cost_of_sale: 770, source: "local" },
      { name: "Coffee Special Fertilizer", mrp: 920, subsidy: 90, cost_of_sale: 830, source: "local" },
      { name: "Sugarcane Special NPK", mrp: 1180, subsidy: 120, cost_of_sale: 1060, source: "local" },
      { name: "Cotton Special Fertilizer", mrp: 1050, subsidy: 100, cost_of_sale: 950, source: "local" },
      { name: "Paddy Special NPK", mrp: 980, subsidy: 95, cost_of_sale: 885, source: "local" },
      { name: "Wheat Special Fertilizer", mrp: 890, subsidy: 85, cost_of_sale: 805, source: "local" }
    ];
  }, []);

  const fetchFromGov = useCallback(async (): Promise<Fertilizer[]> => {
    const cached = localStorage.getItem('fertilizerCache');
    const cacheTime = localStorage.getItem('fertilizerCacheTime');
    const now = Date.now();
    
    // Use 1 hour cache
    if (cached && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
      return JSON.parse(cached);
    }

    try {
      // Use AbortController for faster timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const resp = await fetch(
        "https://api.data.gov.in/resource/b73c4670-a371-4747-824c-4ea767918dc9?format=json&api-key=579b464db66ec23bdd00000176dc0d6be29548ac4b068a452db7959f&limit=30",
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!resp.ok) throw new Error('API response not ok');
      
      const json = await resp.json();
      const govRecords = json.records?.slice(0, 15).map((rec: any) => ({
        name: rec.fertilizer || rec.fertilizer_name || 'Unknown',
        mrp: rec.mrp ? Number(rec.mrp) : null,
        subsidy: rec.subsidy ? Number(rec.subsidy) : null,
        cost_of_sale: rec.cost_of_sale ? Number(rec.cost_of_sale) : null,
        source: "gov" as const,
      })) || [];

      // Combine with local data
      const allFertilizers = [...getComprehensiveFertilizerList, ...govRecords];
      const sortedRecords = allFertilizers.sort((a, b) => a.name.localeCompare(b.name));
      
      localStorage.setItem('fertilizerCache', JSON.stringify(sortedRecords));
      localStorage.setItem('fertilizerCacheTime', now.toString());
      
      return sortedRecords;
    } catch (err) {
      console.log('Using local fertilizer data');
      return getComprehensiveFertilizerList;
    }
  }, [getComprehensiveFertilizerList]);

  const fetchSavedSuggestions = useCallback(() => {
    const saved = localStorage.getItem('Fertilizer Suggestions');
    if (saved) {
      setSavedSuggestions(JSON.parse(saved));
    }
  }, []);

  const handleDeleteSuggestion = useCallback((id: number) => {
    const existing = JSON.parse(localStorage.getItem('Fertilizer Suggestions') || '[]');
    const updated = existing.filter((s: SavedSuggestion) => s.id !== id);
    localStorage.setItem('Fertilizer Suggestions', JSON.stringify(updated));
    setSavedSuggestions(updated);
  }, []);

  useEffect(() => {
    // If no cached data, load local data immediately
    if (fertilizers.length === 0) {
      setFertilizers(getComprehensiveFertilizerList);
    }
    
    // Background fetch of government data
    const loadGovData = async () => {
      setLoading(true);
      try {
        const govData = await fetchFromGov();
        if (govData && govData.length > 0) {
          setFertilizers(govData);
        }
      } catch (err) {
        console.log('Using local fertilizer data');
      } finally {
        setLoading(false);
      }
    };
    
    // Delay government API call to not block initial render
    const timeoutId = setTimeout(loadGovData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = (event: any) => {
      const newLocation = event.detail || (window as any).currentLocation || 'India';
      setCurrentLocation(newLocation);
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  const handleSuggest = useCallback(() => {
    if (!crop || !soil || !area) {
      setSuggestion("Please fill all fields to get a suggestion.");
      return;
    }

    const selected = crop.toLowerCase();
    const soilSelected = soil.toLowerCase();
    const recommendedFerts = cropSoilFertilizerMap[selected]?.[soilSelected];

    let recommended: string;
    if (recommendedFerts && recommendedFerts.length > 0) {
      recommended = `Recommended fertilizers for ${crop} on ${soil} soil: ${recommendedFerts.join(", ")}`;
    } else {
      recommended = `No specific fertilizer found for ${crop}. Use general NPK fertilizers.`;
    }

    setSuggestion(recommended);

    const newSuggestion = {
      id: Date.now(),
      crop,
      soil,
      area: Number(area),
      suggestion: recommended,
      created_at: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('Fertilizer Suggestions') || '[]');
    existing.unshift(newSuggestion);
    localStorage.setItem('Fertilizer Suggestions', JSON.stringify(existing));
    fetchSavedSuggestions();
  }, [crop, soil, area, fetchSavedSuggestions]);

  return (
    <div className={`p-6 max-w-5xl mx-auto ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{t('fertilizerPrices')}</h2>
        {loading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
            Updating prices...
          </div>
        )}
      </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search fertilizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div className="overflow-x-auto mb-8">
          <table className={`min-w-full border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
            <thead className={theme === 'dark' ? 'bg-green-800' : 'bg-green-100'}>
              <tr>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>{t('name')}</th>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>{t('subsidy')}</th>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>{t('costOfSale')}</th>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {useMemo(() => {
                const filtered = fertilizers.filter(f => 
                  f.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                return filtered.slice(startIndex, endIndex).map((f, idx) => (
                  <tr key={`${f.name}-${idx}`} className={theme === 'dark' ? 'hover:bg-green-900' : 'hover:bg-green-50'}>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.name}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.subsidy !== null ? `₹${f.subsidy}` : "-"}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.cost_of_sale !== null ? `₹${f.cost_of_sale}` : "-"}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => window.open(`https://www.google.com/search?q=buy+${encodeURIComponent(f.name)}+fertilizer+online`, '_blank')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        >
                          Buy
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedFertilizer(f.name);
                            setShowStores(true);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors"
                          title={`Find ${f.name} near ${currentLocation}`}
                        >
                          Near {currentLocation.split(',')[0]}
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              }, [fertilizers, searchTerm, currentPage, itemsPerPage, theme])}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {useMemo(() => {
          const filtered = fertilizers.filter(f => 
            f.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          const totalPages = Math.ceil(filtered.length / itemsPerPage);
          
          if (totalPages <= 1) return null;
          
          return (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                Previous
              </button>
              
              <span className={`px-3 py-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Page {currentPage} of {totalPages} ({filtered.length} fertilizers)
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                Next
              </button>
            </div>
          );
        }, [fertilizers, searchTerm, itemsPerPage, currentPage, theme])}


      <h2 className="text-2xl font-bold mb-4">{t('personalizedFertilizerSuggestion')}</h2>
      <div className="flex gap-6 mb-8 items-start">
        <div className={`p-6 rounded-lg shadow-md flex-1 max-w-md space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <label className="block font-medium mb-1">{t('crop')}</label>
          <select
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            <option value="">{t('selectCrop')}</option>
            {cropOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">{t('soilType')}</label>
          <select
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
          >
            <option value="">{t('selectSoil')}</option>
            {soilOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">{t('areaAcres')}</label>
          <input
            type="number"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            placeholder={t('areaPlaceholder')}
          />
        </div>

        <button
          onClick={handleSuggest}
          className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          {t('getSuggestion')}
        </button>

        {suggestion && (
          <div className={`mt-4 p-3 border-l-4 border-green-400 rounded ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
            <strong>{t('suggestion')}:</strong> {suggestion}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/fertilizer+stores+near+${encodeURIComponent(currentLocation)}`, '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Find Stores in {currentLocation.split(',')[0]}
              </button>
              <button
                onClick={() => window.open('https://www.google.com/search?q=buy+fertilizer+online+India', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Buy Online
              </button>
            </div>
          </div>
        )}
        </div>
        
        {savedSuggestions.length > 0 && (
          <div className="flex-1 max-w-md">
            <h3 className="text-xl font-bold mb-4">{t('yourPreviousSuggestions')}</h3>
            <div className={`rounded-lg shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {savedSuggestions.slice(0, 5).map((s) => (
                  <div key={s.id} className={`p-3 rounded border-l-4 border-green-400 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <div className="text-sm font-medium">{s.crop} - {s.soil} ({s.area} acres)</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(s.created_at).toLocaleDateString()}</div>
                    <div className="text-sm mt-2">{s.suggestion}</div>
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => window.open('https://www.google.com/search?q=buy+fertilizer+online+India', '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => handleDeleteSuggestion(s.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stores Modal */}
      {showStores && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{selectedFertilizer} Stores in {currentLocation.split(',')[0]}</h3>
              <button 
                onClick={() => setShowStores(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {getStoresForLocation(selectedFertilizer, currentLocation).map((store, idx) => (
                <div key={idx} className={`p-3 rounded border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="font-medium">{store.name}</div>
                  <div className="text-sm text-gray-500">{store.address}</div>
                  <div className="text-sm text-gray-500">{store.phone} • {store.distance}</div>
                  <div className="mt-2 flex gap-2">
                    <button 
                      onClick={() => window.open(`tel:${store.phone}`, '_self')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Call
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(store.name + ' ' + store.address)}`, '_blank')}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fertilizer;