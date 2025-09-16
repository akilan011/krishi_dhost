import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { state, category, landSize, cropType, income, age } = await req.json()

    console.log('MyScheme search request:', { state, category, landSize, cropType, income, age })

    // For now, we'll return mock data based on the MyScheme.gov.in structure
    // The actual API endpoints would need to be configured once we have proper API documentation
    const mockSchemes = [
      {
        id: "pm_kisan_2024",
        name: "PM-KISAN",
        fullName: "Pradhan Mantri Kisan Samman Nidhi",
        description: "Direct income support of ₹6000 per year to small and marginal farmers",
        benefit: "₹6,000 per year in three equal installments",
        eligibility: `Small and marginal farmers with cultivable land up to 2 hectares in ${state || 'any state'}`,
        applicationProcess: "Online through PM-KISAN portal or nearest Common Service Centre (CSC)",
        documentsRequired: ["Land ownership papers", "Aadhaar card", "Bank account details", "Passport size photograph"],
        officialLink: "https://pmkisan.gov.in/",
        status: "Active",
        lastDate: "Ongoing - No deadline",
        ministry: "Ministry of Agriculture and Farmers Welfare",
        category: "Central Scheme"
      },
      {
        id: "crop_insurance_2024",
        name: "PMFBY",
        fullName: "Pradhan Mantri Fasal Bima Yojana",
        description: "Comprehensive crop insurance scheme to provide insurance coverage and financial support to farmers",
        benefit: "Insurance coverage for crop loss due to natural calamities",
        eligibility: `All farmers growing notified crops in ${state || 'notified areas'}`,
        applicationProcess: "Through banks, insurance companies, or Common Service Centres",
        documentsRequired: ["Land records", "Sowing certificate", "Aadhaar card", "Bank passbook"],
        officialLink: "https://pmfby.gov.in/",
        status: "Active",
        lastDate: "Before sowing season",
        ministry: "Ministry of Agriculture and Farmers Welfare",
        category: "Central Scheme"
      },
      {
        id: "soil_health_card_2024",
        name: "Soil Health Card",
        fullName: "Soil Health Card Scheme",
        description: "Provides soil health cards to farmers with information on nutrient status of their soil",
        benefit: "Free soil testing and nutrient-based fertilizer recommendations",
        eligibility: "All farmers across the country",
        applicationProcess: "Contact local agriculture department or soil testing laboratory",
        documentsRequired: ["Land ownership proof", "Application form", "Soil sample"],
        officialLink: "https://soilhealth.dac.gov.in/",
        status: "Active",
        lastDate: "Ongoing",
        ministry: "Ministry of Agriculture and Farmers Welfare",
        category: "Central Scheme"
      }
    ]

    // Filter schemes based on criteria
    let filteredSchemes = mockSchemes

    if (cropType && cropType !== 'all') {
      // In a real implementation, this would filter based on crop-specific schemes
      filteredSchemes = filteredSchemes.filter(scheme => 
        scheme.name.toLowerCase().includes('crop') || 
        scheme.eligibility.toLowerCase().includes('crop') ||
        scheme.name === "PM-KISAN" // PM-KISAN is for all crops
      )
    }

    if (landSize === 'small') {
      filteredSchemes = filteredSchemes.filter(scheme => 
        scheme.eligibility.toLowerCase().includes('small') || 
        scheme.eligibility.toLowerCase().includes('marginal') ||
        scheme.name === "Soil Health Card" // Available to all
      )
    }

    const response = {
      success: true,
      schemes: filteredSchemes,
      searchCriteria: { state, category, landSize, cropType, income, age },
      totalFound: filteredSchemes.length
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in myscheme-search function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Unable to fetch schemes at the moment. Please try again later.',
        schemes: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})