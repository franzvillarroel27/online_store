const reduceStock = async (tx, productId, quantity, orderId) => {
  const product = await tx.product.findUnique({ where: { id: productId } });
  const newQty = product.stockQuantity - quantity;
  const threshold = product.lowStockThreshold || 5;

  const stockStatus = newQty <= 0 ? 'out_of_stock'
    : newQty <= threshold ? 'low_stock'
    : 'available';

  await tx.product.update({
    where: { id: productId },
    data: { stockQuantity: newQty, stockStatus }
  });

  await tx.inventoryMovement.create({
    data: {
      productId,
      type: 'sale',
      quantityChange: -quantity,
      quantityAfter: newQty,
      notes: `Venta - Pedido #${orderId}`
    }
  });
};

const restoreStock = async (tx, productId, quantity, reason) => {
  const product = await tx.product.findUnique({ where: { id: productId } });
  const newQty = product.stockQuantity + quantity;
  const threshold = product.lowStockThreshold || 5;

  const stockStatus = newQty <= 0 ? 'out_of_stock'
    : newQty <= threshold ? 'low_stock'
    : 'available';

  await tx.product.update({
    where: { id: productId },
    data: { stockQuantity: newQty, stockStatus }
  });

  await tx.inventoryMovement.create({
    data: {
      productId,
      type: 'restock',
      quantityChange: quantity,
      quantityAfter: newQty,
      notes: reason || 'Reposición de stock'
    }
  });
};

module.exports = { reduceStock, restoreStock };
