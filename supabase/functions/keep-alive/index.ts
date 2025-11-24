import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Make a simple query to keep the database active
    const { data, error } = await supabase
      .from('profil')
      .select('id')
      .limit(1)

    const logTimestamp = new Date().toISOString()

    if (error) {
      console.error('Keep-alive query error:', error)
      
      // Log the failure
      await supabase
        .from('keep_alive_logs')
        .insert({
          status: 'error',
          message: error.message,
          timestamp: logTimestamp
        })

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: logTimestamp
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Log the success
    await supabase
      .from('keep_alive_logs')
      .insert({
        status: 'success',
        message: 'Database keep-alive ping successful',
        timestamp: logTimestamp
      })

    console.log('Keep-alive successful:', logTimestamp)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database keep-alive successful',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Keep-alive function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

