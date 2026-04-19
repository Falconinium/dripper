import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: ComponentPropsWithoutRef<'h1'>) => (
      <h1
        className="font-serif text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl"
        {...props}
      />
    ),
    h2: (props: ComponentPropsWithoutRef<'h2'>) => (
      <h2
        className="mt-16 font-serif text-3xl leading-tight font-normal tracking-tight md:text-4xl"
        {...props}
      />
    ),
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="mt-10 font-serif text-2xl leading-snug font-normal italic" {...props} />
    ),
    p: (props: ComponentPropsWithoutRef<'p'>) => (
      <p className="text-foreground/90 mt-6 text-lg leading-relaxed" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="text-foreground/90 mt-6 space-y-2 pl-6 text-lg leading-relaxed" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
      <ol
        className="text-foreground/90 mt-6 list-decimal space-y-2 pl-6 text-lg leading-relaxed"
        {...props}
      />
    ),
    li: (props: ComponentPropsWithoutRef<'li'>) => <li className="leading-relaxed" {...props} />,
    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote
        className="border-foreground text-foreground/90 my-8 border-l-2 pl-6 font-serif text-xl italic"
        {...props}
      />
    ),
    hr: () => <hr className="border-border my-12" />,
    strong: (props: ComponentPropsWithoutRef<'strong'>) => (
      <strong className="text-foreground font-semibold" {...props} />
    ),
    a: (props: ComponentPropsWithoutRef<'a'>) => (
      <a className="hover:text-muted-foreground underline underline-offset-4" {...props} />
    ),
    ...components,
  };
}
