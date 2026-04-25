'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { deleteAccount } from './actions';

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? 'Suppression…' : 'Supprimer définitivement'}
    </Button>
  );
}

export function DeleteAccount({ ownsShops }: { ownsShops: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-destructive/30 mt-16 rounded-md border p-6">
      <h2 className="font-serif text-2xl">Supprimer mon compte</h2>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
        La suppression de votre compte est <strong>définitive</strong> et entraîne
        l’effacement de votre profil, de vos avis, de votre carnet de
        dégustation, de vos favoris et de vos demandes de revendication.
        {ownsShops ? (
          <>
            {' '}Les fiches des shops que vous gérez ne sont pas supprimées :
            elles redeviennent simplement non revendiquées.
          </>
        ) : null}
      </p>

      {!open ? (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/5"
            onClick={() => setOpen(true)}
          >
            Supprimer mon compte
          </Button>
        </div>
      ) : (
        <form action={deleteAccount} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm">
              Tapez <strong>SUPPRIMER</strong> pour confirmer
            </Label>
            <Input
              id="confirm"
              name="confirm"
              required
              autoComplete="off"
              placeholder="SUPPRIMER"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ConfirmButton />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
