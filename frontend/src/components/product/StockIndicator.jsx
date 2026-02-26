export default function StockIndicator({ product }) {
  const { stockStatus, stockQuantity } = product;

  if (stockStatus === 'out_of_stock') {
    return (
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
        <span className="text-red-600 font-semibold text-sm">Agotado</span>
      </div>
    );
  }

  if (stockStatus === 'low_stock') {
    return (
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 animate-pulse" />
        <span className="text-amber-600 font-semibold text-sm">
          ¡Solo {stockQuantity} unidades disponibles!
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
      <span className="text-green-700 font-semibold text-sm">
        {stockQuantity > 20 ? 'En stock' : `${stockQuantity} unidades disponibles`}
      </span>
    </div>
  );
}
