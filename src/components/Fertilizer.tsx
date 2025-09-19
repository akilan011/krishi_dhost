import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuggestions, setSavedSuggestions] = useState<SavedSuggestion[]>([]);

  // Form state
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [area, setArea] = useState<number | "">("");
  const [suggestion, setSuggestion] = useState<string>("");

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

  const fetchFromGov = async (): Promise<Fertilizer[]> => {
    try {
      const resp = await fetch(
        "https://api.data.gov.in/resource/b73c4670-a371-4747-824c-4ea767918dc9?format=json&api-key=579b464db66ec23bdd00000176dc0d6be29548ac4b068a452db7959f"
      );
      const json = await resp.json();
      const records = json.records.map((rec: any) => ({
        name: rec.fertilizer || rec.fertilizer_name,
        mrp: rec.mrp ? Number(rec.mrp) : null,
        subsidy: rec.subsidy ? Number(rec.subsidy) : null,
        cost_of_sale: rec.cost_of_sale ? Number(rec.cost_of_sale) : null,
        source: "gov" as const,
      }));

      return records.sort((a, b) => (b.mrp || 0) - (a.mrp || 0));
    } catch (err) {
      console.error("Gov API error:", err);
      return [];
    }
  };

  const fetchSavedSuggestions = () => {
    const saved = localStorage.getItem('fertilizerSuggestions');
    if (saved) {
      setSavedSuggestions(JSON.parse(saved));
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const govData = await fetchFromGov();
      setFertilizers(govData);
      fetchSavedSuggestions();
      setLoading(false);
    };
    load();
  }, []);

  const handleSuggest = () => {
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
    
    const existing = JSON.parse(localStorage.getItem('fertilizerSuggestions') || '[]');
    existing.unshift(newSuggestion);
    localStorage.setItem('fertilizerSuggestions', JSON.stringify(existing));
    fetchSavedSuggestions();
  };

  return (
    <div className={`p-6 max-w-5xl mx-auto ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Fertilizer Prices (Govt Data)</h2>
      {loading ? (
        <p>Loading fertilizers...</p>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className={`min-w-full border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
            <thead className={theme === 'dark' ? 'bg-green-800' : 'bg-green-100'}>
              <tr>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Name</th>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>MRP</th>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Subsidy</th>
                <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Cost of Sale</th>
              </tr>
            </thead>
            <tbody>
              {fertilizers.map((f, idx) => (
                <tr key={idx} className={theme === 'dark' ? 'hover:bg-green-900' : 'hover:bg-green-50'}>
                  <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.name}</td>
                  <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.mrp !== null ? `₹${f.mrp}` : "-"}</td>
                  <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.subsidy !== null ? `₹${f.subsidy}` : "-"}</td>
                  <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{f.cost_of_sale !== null ? `₹${f.cost_of_sale}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Personalized Fertilizer Suggestion</h2>
      <div className={`p-6 rounded-lg shadow-md max-w-md mb-8 space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <label className="block font-medium mb-1">Crop</label>
          <select
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            <option value="">Select Crop</option>
            {cropOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Soil Type</label>
          <select
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
          >
            <option value="">Select Soil</option>
            {soilOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Area (acres)</label>
          <input
            type="number"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            placeholder="e.g. 2"
          />
        </div>

        <button
          onClick={handleSuggest}
          className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Get Suggestion
        </button>

        {suggestion && (
          <div className={`mt-4 p-3 border-l-4 border-green-400 rounded ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
            <strong>Suggestion:</strong> {suggestion}
          </div>
        )}
      </div>

      {savedSuggestions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Previous Suggestions</h2>
          <div className="overflow-x-auto">
            <table className={`min-w-full border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
              <thead className={theme === 'dark' ? 'bg-green-800' : 'bg-green-100'}>
                <tr>
                  <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Crop</th>
                  <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Soil</th>
                  <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Area</th>
                  <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Suggestion</th>
                  <th className={`p-3 text-left border-b ${theme === 'dark' ? 'text-white border-gray-600' : 'border-gray-300'}`}>Date</th>
                </tr>
              </thead>
              <tbody>
                {savedSuggestions.map((s) => (
                  <tr key={s.id} className={theme === 'dark' ? 'hover:bg-green-900' : 'hover:bg-green-50'}>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{s.crop}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{s.soil}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{s.area}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{s.suggestion}</td>
                    <td className={`p-3 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fertilizer;