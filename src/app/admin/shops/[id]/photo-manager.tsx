'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

import { removeShopPhoto, uploadShopPhoto } from '../actions';

type Photo = { url: string; path: string; alt?: string };

export function PhotoManager({ shopId, photos }: { shopId: string; photos: Photo[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpload = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.append('file', file);
    startTransition(async () => {
      const res = await uploadShopPhoto(shopId, fd);
      if (res.status === 'error') setError(res.message ?? 'Erreur upload');
      if (inputRef.current) inputRef.current.value = '';
    });
  };

  const handleRemove = (path: string) => {
    startTransition(async () => {
      await removeShopPhoto(shopId, path);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((p) => (
          <div key={p.path} className="group border-border relative aspect-square overflow-hidden rounded-md border">
            <Image src={p.url} alt={p.alt ?? ''} fill className="object-cover" sizes="200px" unoptimized />
            <button
              type="button"
              onClick={() => handleRemove(p.path)}
              disabled={isPending}
              className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-30"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
          className="text-sm"
          disabled={isPending}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isPending}>
          {isPending ? 'Upload…' : 'Ajouter une photo'}
        </Button>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
