'use client';

import { useState } from 'react';
import { Palette as PaletteIcon } from 'lucide-react';
import { PALETTES, usePalette } from '@/components/PaletteProvider';

export function PaletteSwitcher() {
  const { palette, setPalette } = usePalette();
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change accent color"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: '1px solid var(--line)',
          background: 'var(--bg)',
          color: 'var(--fg)',
          cursor: 'pointer',
        }}
      >
        <PaletteIcon size={16} />
      </button>

      <div
        role="listbox"
        aria-label="Accent colors"
        style={{
          position: 'absolute',
          top: 'calc(100% + 0.6rem)',
          right: 0,
          display: 'flex',
          gap: '0.4rem',
          padding: '0.55rem',
          borderRadius: '100px',
          border: '1px solid var(--line)',
          background: 'var(--bg-elev)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: 'var(--shadow)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.96)',
          transformOrigin: 'top right',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out)',
        }}
      >
        {PALETTES.map((p) => {
          const isActive = palette === p.key;
          return (
            <button
              key={p.key}
              role="option"
              aria-selected={isActive}
              title={p.label}
              onClick={() => setPalette(p.key)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                background: p.swatch,
                border: 'none',
                cursor: 'pointer',
                outline: isActive ? '2px solid var(--fg)' : '2px solid transparent',
                outlineOffset: '2px',
                transition: 'transform 0.2s var(--ease-out), outline-color 0.2s ease',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
