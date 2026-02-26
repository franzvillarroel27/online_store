const nodemailer = require('nodemailer');

const getTransporter = () => {
  if (!process.env.NODEMAILER_USER || process.env.NODEMAILER_USER === 'tu_email@gmail.com') {
    return null; // No configurado
  }
  return nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: parseInt(process.env.NODEMAILER_PORT),
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
};

const buildOrderEmailHtml = (order) => {
  const itemsList = order.items.map(item =>
    `<tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>Bs. ${parseFloat(item.unitPrice).toFixed(2)}</td>
      <td>Bs. ${(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <h2>🛒 Nuevo Pedido CocinaShop - ${order.orderNumber}</h2>
    <h3>Cliente</h3>
    <p><b>Nombre:</b> ${order.customerName}</p>
    <p><b>Teléfono:</b> ${order.customerPhone}</p>
    <p><b>Email:</b> ${order.customerEmail || 'N/A'}</p>
    <p><b>Dirección:</b> ${order.deliveryAddress}, ${order.city}</p>
    <h3>Productos</h3>
    <table border="1" cellpadding="8" style="border-collapse:collapse">
      <tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th></tr>
      ${itemsList}
    </table>
    <p><b>Subtotal:</b> Bs. ${parseFloat(order.subtotal).toFixed(2)}</p>
    <p><b>Envío:</b> Bs. ${parseFloat(order.shippingCost).toFixed(2)}</p>
    <p><b>TOTAL:</b> Bs. ${parseFloat(order.total).toFixed(2)}</p>
    <p><b>Método de pago:</b> ${order.paymentMethod === 'qr_transfer' ? 'QR/Transferencia' : 'Efectivo contraentrega'}</p>
    ${order.notes ? `<p><b>Notas:</b> ${order.notes}</p>` : ''}
  `;
};

const sendEmailNotification = async (order) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('📧 [EMAIL MOCK] Nuevo pedido:', order.orderNumber, '-', order.customerName);
    return;
  }

  await transporter.sendMail({
    from: `"CocinaShop" <${process.env.NODEMAILER_USER}>`,
    to: process.env.SELLER_EMAIL,
    subject: `🛒 Nuevo Pedido ${order.orderNumber} - Bs. ${parseFloat(order.total).toFixed(2)}`,
    html: buildOrderEmailHtml(order)
  });
  console.log('📧 Email de pedido enviado a', process.env.SELLER_EMAIL);
};

const sendWhatsAppNotification = async (order) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'ACxxxxx') {
    console.log('📱 [WHATSAPP MOCK] Nuevo pedido:', order.orderNumber, '- Total: Bs.', parseFloat(order.total).toFixed(2));
    return;
  }

  try {
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const message = `🛒 *Nuevo Pedido CocinaShop*\n` +
      `📋 N°: ${order.orderNumber}\n` +
      `👤 Cliente: ${order.customerName}\n` +
      `📞 Tel: ${order.customerPhone}\n` +
      `📍 Dirección: ${order.deliveryAddress}, ${order.city}\n` +
      `💰 Total: Bs. ${parseFloat(order.total).toFixed(2)}\n` +
      `💳 Pago: ${order.paymentMethod === 'qr_transfer' ? 'QR/Transferencia' : 'Efectivo'}`;

    await twilio.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.SELLER_WHATSAPP
    });
    console.log('📱 WhatsApp enviado al vendedor');
  } catch (err) {
    console.error('Error WhatsApp:', err.message);
  }
};

const notifyNewOrder = async (order) => {
  await Promise.allSettled([
    sendEmailNotification(order),
    sendWhatsAppNotification(order)
  ]);
};

module.exports = { notifyNewOrder };
