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
    const { commodity, state, market, date } = await req.json()
    
    if (!commodity || !state) {
      return new Response(
        JSON.stringify({ error: 'Commodity and state are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get API key from environment variables
    const apiKey = Deno.env.get('DATA_GOV_IN_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Build API URL with filters
    const baseUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'
    const params = new URLSearchParams({
      'api-key': apiKey,
      format: 'json',
      limit: '100',
      'filters[commodity]': commodity,
      'filters[state]': state,
    })

    if (market && market.trim()) {
      params.append('filters[market]', market)
    }

    if (date) {
      params.append('filters[arrival_date]', date)
    }

    const apiUrl = `${baseUrl}?${params.toString()}`
    
    console.log('Fetching data from:', apiUrl)
    
    // Fetch data from data.gov.in API
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      console.error('API response error:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch market data', 
          status: response.status,
          statusText: response.statusText 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await response.json()
    
    console.log('API response:', data)
    
    // Return the market data
    return new Response(
      JSON.stringify({
        success: true,
        records: data.records || [],
        count: data.records?.length || 0,
        message: data.records?.length ? 
          `Found ${data.records.length} records` : 
          'No records found for the selected filters'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in market-data function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})