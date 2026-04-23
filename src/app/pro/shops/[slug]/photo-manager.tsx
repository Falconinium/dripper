'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

import {
  removeOwnerShopPhoto,
  reorderOwnerShopPhotos,
  uploadOwnerShopPhoto,
} from './actions';

type Photo = { url: string; path: string; alt?: string };

export function OwnerPhotoManager({
  slug,
  photos: initialPhotos,
}: {
  slug: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const photos = initialPhotos;

  const handleUpload = (file: File) => {
    setError(null);
    const fd = new FormData();
    fd.append('file', file);
    startTransition(async () => {
      const res = await uploadOwnerShopPhoto(slug, fd);
      if (inputRef.current) inputRef.current.value = '';
      if (res.status === 'error') {
        setError(res.message);
        return;
      }
      router.refresh();
    });
  };

  const handleRemove = (path: string) => {
    setError(null);
    startTransition(async () => {
      const res = await removeOwnerShopPhoto(slug, path);
      if (res.status === 'error') {
        setError(res.message);
        return;
      }
      router.refresh();
    });
  };

  const makeCover = (path: string) => {
    setError(null);
    const next = [...photos].sort((a, b) => {
      if (a.path === path) return -1;
      if (b.path === path) return 1;
      return 0;
    });
    startTransition(async () => {
      const res = await reorderOwnerShopPhotos(
        slug,
        next.map((p) => p.path),
      );
      if (res.status === 'error') {
        setError(res.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {photos.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune photo pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <li
              key={p.path}
              className="group border-border relative aspect-square overflow-hidden rounded-md border"
            >
              <Image
                src={p.url}
                alt={p.alt ?? ''}
                fill
                className="object-cover"
                sizes="200px"
                unoptimized
              />
              {i === 0 ? (
                <span className="bg-background/95 absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase">
                  Couverture
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeCover(p.path)}
                  disabled={isPending}
                  className="bg-background/90 absolute bottom-2 left-2 rounded-full border px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-30"
                >
                  Mettre en couverture
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(p.path)}
                disabled={isPending}
                className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-30"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
          className="hidden"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? 'Upload…' : 'Ajouter une photo'}
        </Button>
        <span className="text-muted-foreground text-xs">
          JPG ou PNG, 8 Mo max.
        </span>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
