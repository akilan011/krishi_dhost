import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))

    // Get Google Cloud Vision API key from secrets
    const apiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY')
    if (!apiKey) {
      throw new Error('Google Cloud Vision API key not configured')
    }

    // Call Google Cloud Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64,
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 10,
                },
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 5,
                }
              ],
            },
          ],
        }),
      }
    )

    if (!visionResponse.ok) {
      throw new Error(`Google Vision API error: ${visionResponse.statusText}`)
    }

    const visionData = await visionResponse.json()
    const labels = visionData.responses[0]?.labelAnnotations || []
    
    // Simple disease detection logic based on labels
    const diseaseKeywords = [
      'leaf spot', 'blight', 'rust', 'mildew', 'wilt', 'rot', 'disease',
      'fungus', 'pest', 'damage', 'infection', 'yellowing', 'brown spot'
    ]
    
    let detectedDisease = 'Healthy Plant'
    let confidence = 0
    let severity = 'Low'
    let description = 'No signs of disease detected. Plant appears healthy.'
    
    // Check labels for disease indicators
    for (const label of labels) {
      const labelText = label.description.toLowerCase()
      for (const keyword of diseaseKeywords) {
        if (labelText.includes(keyword)) {
          detectedDisease = `Possible ${label.description}`
          confidence = Math.round(label.score * 100)
          severity = confidence > 70 ? 'High' : confidence > 40 ? 'Moderate' : 'Low'
          description = `Detected potential plant health issue. ${label.description} identified with ${confidence}% confidence.`
          break
        }
      }
      if (detectedDisease !== 'Healthy Plant') break
    }

    // If no disease detected, check for common plant issues in labels
    if (detectedDisease === 'Healthy Plant') {
      const plantIssues = labels.filter(label => 
        label.description.toLowerCase().includes('yellow') ||
        label.description.toLowerCase().includes('brown') ||
        label.description.toLowerCase().includes('dry') ||
        label.description.toLowerCase().includes('wilted')
      )
      
      if (plantIssues.length > 0) {
        detectedDisease = 'Potential Stress'
        confidence = Math.round(plantIssues[0].score * 100)
        severity = 'Moderate'
        description = 'Plant may be experiencing environmental stress or nutrient deficiency.'
      }
    }

    // Generate appropriate remedies based on detected issue
    const remedies = detectedDisease === 'Healthy Plant' 
      ? [
          'Continue current care routine',
          'Monitor plant regularly for changes',
          'Maintain proper watering schedule',
          'Ensure adequate sunlight'
        ]
      : [
          'Remove affected plant parts if visible',
          'Apply appropriate fungicide or treatment',
          'Improve air circulation around plant',
          'Adjust watering to prevent moisture buildup',
          'Consult with agricultural extension service'
        ]

    const prevention = [
      'Maintain proper plant spacing',
      'Ensure good drainage',
      'Apply balanced fertilizer regularly',
      'Monitor plants weekly for early detection'
    ]

    const result = {
      disease: detectedDisease,
      confidence,
      severity,
      description,
      remedies,
      prevention,
      labels: labels.slice(0, 5).map(label => ({
        description: label.description,
        score: Math.round(label.score * 100)
      }))
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in plant disease detection:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Detection failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})