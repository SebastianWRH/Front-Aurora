import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Buscar orden por código
export const getOrderByCode = async (orderCode) => {
  try {
    const { data, error } = await supabase
      .from('Orders')
      .select('*')
      .eq('Order_code', orderCode)
      .single();

    if (error) throw error;
    
    // 🔍 DEBUG: Ver qué campos tiene la orden
    console.log('📦 Datos de la orden:', data);
    console.log('📧 Campos disponibles:', Object.keys(data));
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: error.message };
  }
};

// Generar y enviar código de verificación
export const sendVerificationCode = async (orderCode, email) => {
  try {
    // Primero buscar la orden para ver qué campos tiene
    const { data: orderCheck } = await supabase
      .from('Orders')
      .select('*')
      .eq('Order_code', orderCode)
      .single();

    console.log('🔍 Orden encontrada:', orderCheck);
    console.log('📋 Campos de la orden:', Object.keys(orderCheck || {}));

    // Intentar con diferentes variaciones del nombre de la columna
    let order = null;
    let orderError = null;

    // Intento 1: Email (PascalCase)
    const { data: attempt1, error: error1 } = await supabase
      .from('Orders')
      .select('*')
      .eq('Order_code', orderCode)
      .eq('Email', email)
      .maybeSingle();

    if (attempt1) {
      order = attempt1;
      console.log('✅ Encontrado con "Email"');
    } else {
      console.log('❌ No encontrado con "Email":', error1?.message);

      // Intento 2: email (lowercase)
      const { data: attempt2, error: error2 } = await supabase
        .from('Orders')
        .select('*')
        .eq('Order_code', orderCode)
        .eq('email', email)
        .maybeSingle();

      if (attempt2) {
        order = attempt2;
        console.log('✅ Encontrado con "email"');
      } else {
        console.log('❌ No encontrado con "email":', error2?.message);

        // Intento 3: EMAIL (uppercase)
        const { data: attempt3, error: error3 } = await supabase
          .from('Orders')
          .select('*')
          .eq('Order_code', orderCode)
          .eq('EMAIL', email)
          .maybeSingle();

        if (attempt3) {
          order = attempt3;
          console.log('✅ Encontrado con "EMAIL"');
        } else {
          console.log('❌ No encontrado con "EMAIL":', error3?.message);
          orderError = 'No se pudo encontrar la orden con ninguna variación del campo email';
        }
      }
    }

    if (orderError || !order) {
      // Verificar si el email está en la orden pero con otro nombre
      if (orderCheck) {
        const emailFields = Object.keys(orderCheck).filter(key => 
          key.toLowerCase().includes('email') || 
          key.toLowerCase().includes('mail')
        );
        console.log('📧 Posibles campos de email encontrados:', emailFields);
      }

      return { 
        success: false, 
        error: 'Orden no encontrada o email incorrecto. Revisa la consola para ver los campos disponibles.' 
      };
    }

    // Llamar al backend para enviar el email
    const response = await fetch(`${API_URL}/api/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode,
        email
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return { 
        success: false, 
        error: result.error || 'Error al enviar el código' 
      };
    }

    // Calcular expiración (10 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Guardar código en la base de datos
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        order_code: orderCode,
        email: email,
        code: result.code,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (insertError) throw insertError;

    return { success: true };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, error: error.message };
  }
};

// Verificar código
export const verifyCode = async (orderCode, email, code) => {
  try {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('order_code', orderCode)
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return { 
        success: false, 
        error: 'Código inválido o expirado' 
      };
    }

    // Marcar código como usado
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', data.id);

    return { success: true };
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar datos de la orden
export const updateOrderData = async (orderCode, updates) => {
  try {
    const { data, error } = await supabase
      .from('Orders')
      .update(updates)
      .eq('Order_code', orderCode)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message };
  }
};