'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { deleteAccount } from './actions';

const PHRASE = 'SUPPRIMER';

function ConfirmButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={disabled || pending}>
      {pending ? 'Suppression…' : 'Supprimer définitivement'}
    </Button>
  );
}

export function DeleteAccount({ ownsShops }: { ownsShops: boolean }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const matches = value === PHRASE;
  const showMismatch = value.length > 0 && !matches;

  return (
    <section className="border-destructive/30 mt-16 rounded-md border p-6">
      <h2 className="font-serif text-2xl">Supprimer mon compte</h2>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
        La suppression de votre compte est <strong>définitive</strong> et entraîne
        l’effacement de votre profil, de vos avis, de vos favoris et de vos
        demandes de revendication.
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
              Tapez <strong>{PHRASE}</strong> en majuscules pour confirmer
            </Label>
            <Input
              id="confirm"
              name="confirm"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder={PHRASE}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-invalid={showMismatch || undefined}
              className={
                showMismatch
                  ? 'border-destructive focus-visible:ring-destructive/30'
                  : undefined
              }
            />
            {showMismatch ? (
              <p className="text-destructive text-xs">
                Saisissez exactement « {PHRASE} » pour activer la suppression.
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Cette action est irréversible.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ConfirmButton disabled={!matches} />
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setValue('');
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
