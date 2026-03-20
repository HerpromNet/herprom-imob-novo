import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, email, title, price } = await req.json()
    const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')

    if (!MP_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN was not configured in Supabase Secrets')
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            title: title || 'HerpromNet CRM - Plano PRO',
            description: 'Assinatura Anual Promocional',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number(price) || 97.00
          }
        ],
        payer: {
          email: email
        },
        external_reference: user_id, // Important: binds payment to the user in Supabase
        back_urls: {
          success: req.headers.get("origin") + "/dashboard" || "https://herpromnet.com/dashboard",
          failure: req.headers.get("origin") + "/dashboard/subscription" || "https://herpromnet.com/dashboard/subscription",
          pending: req.headers.get("origin") + "/dashboard/subscription" || "https://herpromnet.com/dashboard/subscription"
        },
        auto_return: "approved"
      })
    });

    const data = await response.json();
    if (!response.ok) {
       console.error("MP API error details:", data);
       throw new Error("Falha ao gerar o Link de Pagamento. Verifique a chave de acesso do MP.");
    }

    // Return the init_point (redirect URL wrapper) to the frontend
    return new Response(JSON.stringify({ init_point: data.init_point, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("Create Checkout Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
