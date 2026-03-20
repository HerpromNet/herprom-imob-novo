import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Endpoint called automatically by Mercado Pago when a payment changes status
serve(async (req) => {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    let paymentId = url.searchParams.get('id') || url.searchParams.get('data.id');

    // Parse JSON body if the payload is sent via POST body instead of URL parameters (Webhooks vs IPN)
    if (!paymentId && req.body) {
         try {
           const body = await req.json();
           if (body.type === 'payment' || body.action?.includes('payment')) {
               paymentId = body.data?.id || body.id;
           }
         } catch(e) {
           console.error("Error parsing JSON body", e);
         }
    }

    if ((topic === 'payment' || url.searchParams.get('type') === 'payment' || paymentId) && paymentId) {
      const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
      
      // Step 1: Query the actual payment status directly from Mercado Pago (Security Measure)
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      })
      const paymentData = await mpResponse.json()

      // Step 2: If the status is approved and we have the external_reference (our user ID)
      if (paymentData.status === 'approved' && paymentData.external_reference) {
        const userId = paymentData.external_reference;

        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey); // Need service role to bypass RLS

        // Update the user's plan inside the 'users' table 
        const { error } = await supabaseAdmin
          .from('users')
          .update({ plan: 'PRO' })
          .eq('id', userId);

        if (error) {
           console.error("Erro ao atualizar plano no Supabase:", error);
           throw error;
        } else {
           console.log(`Usuário ${userId} promovido a PRO com sucesso via MP Webhook!`);
        }
      }
    }

    return new Response("OK", { status: 200 })
  } catch (error: any) {
    console.error("Webhook Process Error:", error);
    return new Response(error.message, { status: 400 })
  }
})
