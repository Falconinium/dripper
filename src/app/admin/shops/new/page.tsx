import { createShop } from '../actions';
import { ShopForm } from '../shop-form';

export default function NewShopPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Nouveau shop</h2>
      <ShopForm action={createShop} submitLabel="Créer" mapboxToken={mapboxToken} />
    </div>
  );
}
