import { createShop } from '../actions';
import { ShopForm } from '../shop-form';

export default function NewShopPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Nouveau shop</h2>
      <ShopForm action={createShop} submitLabel="Créer" />
    </div>
  );
}
