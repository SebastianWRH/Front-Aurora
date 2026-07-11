const fallbackNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '51942346985';

export const normalizeWhatsAppNumber = (number = fallbackNumber) => {
  return String(number).replace(/[^\d]/g, '');
};

export const formatWhatsAppDisplay = (number = fallbackNumber) => {
  const cleanNumber = normalizeWhatsAppNumber(number);

  if (cleanNumber.startsWith('51') && cleanNumber.length === 11) {
    return `+${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 5)} ${cleanNumber.slice(5, 8)} ${cleanNumber.slice(8)}`;
  }

  return cleanNumber ? `+${cleanNumber}` : '';
};

export const formatPrice = (price, currency = 'S/') => {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return null;
  }

  return `${currency} ${Number(price).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const createWhatsAppLink = (message, number = fallbackNumber) => {
  const cleanNumber = normalizeWhatsAppNumber(number);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const generateProductWhatsAppMessage = (product, quantity = 1, currency = 'S/') => {
  const price = formatPrice(product.price, currency);
  const lines = [
    'Hola, me interesa este producto. Sigue disponible?',
    '',
    `Producto: ${product.name}`,
    product.variant_label ? `Variante: ${product.variant_label}` : null,
    product.category ? `Categoria: ${product.category}` : null,
    product.material ? `Material: ${product.material}` : null,
    product.color ? `Color: ${product.color}` : null,
    product.size ? `Medida: ${product.size}` : null,
    `Cantidad: ${quantity}`,
    price ? `Precio referencial: ${price}` : null,
    '',
    'Podrian confirmarme disponibilidad y forma de entrega?'
  ];

  return lines.filter(Boolean).join('\n');
};

export const generateSelectionWhatsAppMessage = (items, currency = 'S/') => {
  const lines = ['Hola, me interesa consultar por estos productos:', ''];
  let total = 0;
  let hasPrices = false;

  items.forEach((item, index) => {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.price);
    const price = formatPrice(unitPrice, currency);

    if (!Number.isNaN(unitPrice)) {
      hasPrices = true;
      total += unitPrice * quantity;
    }

    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   Cantidad: ${quantity}`);
    if (item.variant_label) lines.push(`   Variante: ${item.variant_label}`);
    if (item.category) lines.push(`   Categoria: ${item.category}`);
    if (price) lines.push(`   Precio unitario: ${price}`);
    lines.push('');
  });

  if (hasPrices) {
    lines.push(`Total estimado: ${formatPrice(total, currency)}`);
    lines.push('');
  }

  lines.push('Podrian confirmarme disponibilidad y forma de entrega?');

  return lines.join('\n');
};

export const openWhatsApp = (message, number) => {
  window.open(createWhatsAppLink(message, number), '_blank', 'noopener,noreferrer');
};
