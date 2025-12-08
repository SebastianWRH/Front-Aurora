import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== PRODUCTOS ====================

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }

  return data;
};

export const getProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener productos por categoría:', error);
    return [];
  }

  return data;
};

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener productos destacados:', error);
    return [];
  }

  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error al obtener producto:', error);
    return null;
  }

  return data;
};

// ==================== ÓRDENES ====================

/**
 * Genera un código único para la orden (format: ORD-XXXXXX)
 */
const generateOrderCode = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}${random}`.toUpperCase();
};

/**
 * Calcula el costo de envío
 */
const calculateShipping = (subtotal) => {
  return subtotal > 200 ? 0 : 15;
};

/**
 * Crea una nueva orden en Supabase
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<Object>} - Orden creada con su ID
 */
export const createOrder = async (orderData) => {
  try {
    const { formData, paymentMethod, cartItems, ticket } = orderData;

    // Calcular totales
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Preparar datos para insertar
    const newOrder = {
      Order_code: generateOrderCode(),
      Name: formData.fullName,
      Email: formData.email, // ✅ CAMPO EMAIL AGREGADO
      Phone: formData.phone,
      Address: formData.address,
      District: formData.district,
      City: formData.city,
      References: formData.reference || null,
      Notes: formData.notes || null,
      Pay_meth: paymentMethod,
      Ticket: ticket || null, // URL del comprobante de Cloudinary
      Cost: total,
      // created_at se genera automáticamente con now()
    };



    // Insertar en Supabase
    const { data, error } = await supabase
      .from('Orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('❌ Error detallado de Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Mensaje más amigable para el usuario
      let userMessage = 'Error al crear la orden. ';
      if (error.message.includes('row-level security')) {
        userMessage += 'Por favor contacta al administrador para configurar los permisos de la base de datos.';
      } else {
        userMessage += error.message;
      }
      
      throw new Error(userMessage);
    }



    return {
      success: true,
      order: data,
      orderCode: data.Order_code
    };

  } catch (error) {
    console.error('💥 Error en createOrder:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Obtiene todas las órdenes (opcional, para admin)
 */
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('Orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener órdenes:', error);
    return [];
  }

  return data;
};

/**
 * Obtiene una orden por código
 */
export const getOrderByCode = async (orderCode) => {
  const { data, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('Order_code', orderCode)
    .single();

  if (error) {
    console.error('Error al obtener orden:', error);
    return null;
  }

  return data;
};