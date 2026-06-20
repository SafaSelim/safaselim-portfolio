'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const PALETTES = [
  { key: 'amber', label: 'Amber', swatch: '#ff7a34' },
  { key: 'cobalt', label: 'Cobalt', swatch: '#6a7cff' },
  { key: 'emerald', label: 'Emerald', swatch: '#2dd4a7' },
  { key: 'sunset', label: 'Sunset', swatch: 'linear-gradient(120deg,#ff8a3d,#ff3d7f,#b06bff)' },
  { key: 'aurora', label: 'Aurora', swatch: 'linear-gradient(120deg,#2dd4a7,#34b3ff,#6a7cff)' },
  { key: 'spectrum', label: 'Spectrum', swatch: 'linear-gradient(120deg,#c4f82e,#2dd4a7,#6a7cff)' },
] as const;

export type PaletteKey = (typeof PALETTES)[number]['key'];

const STORAGE_KEY = 'portfolio-palette';

type Ctx = { palette: PaletteKey; setPalette: (p: PaletteKey) => void };

const PaletteContext = createContext<Ctx>({ palette: 'amber', setPalette: () => {} });

export const usePalette = () => useContext(PaletteContext);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteKey>('amber');

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as PaletteKey) || 'amber';
    const valid = PALETTES.some((p) => p.key === saved) ? saved : 'amber';
    document.documentElement.dataset.palette = valid;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaletteState(valid);
  }, []);

  const setPalette = (p: PaletteKey) => {
    document.documentElement.dataset.palette = p;
    localStorage.setItem(STORAGE_KEY, p);
    setPaletteState(p);
  };

  return (
    <PaletteContext.Provider value={{ palette, setPalette }}>{children}</PaletteContext.Provider>
  );
}
