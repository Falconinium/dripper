import { createRoaster } from '../actions';
import { RoasterForm } from '../roaster-form';

export default function NewRoasterPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Nouveau torréfacteur</h2>
      <RoasterForm action={createRoaster} submitLabel="Créer" />
    </div>
  );
}
