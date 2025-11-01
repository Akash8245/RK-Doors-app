import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchDoors, ApiDoor, ApiCategory } from '../services/api';
import { Door } from './CartContext';

interface DoorsContextType {
  doors: Door[];
  categories: { id: string; name: string; slug: string; icon: string }[];
  loading: boolean;
  error?: string;
  getDoorById: (id: string) => Door | undefined;
  getDoorsByCategoryName: (categoryName: string) => Door[];
}

const DoorsContext = createContext<DoorsContextType | undefined>(undefined);

function mapApiDoorToDoor(d: ApiDoor): Door {
  return {
    id: String(d.id),
    name: d.name,
    price: Number(parseFloat(d.price)),
    image: d.image_url, // expo-image can take string URI
    category: d.category_name || String(d.category),
    description: d.description || '',
  };
}

function pickIconForCategory(name: string, slug: string): string {
  const n = name.toLowerCase();
  if (n.includes('wood')) return '🪵';
  if (n.includes('laminate') || n.includes('gloria')) return '🎨';
  if (n.includes('primer')) return '🧪';
  return '🚪';
}

export const DoorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doors, setDoors] = useState<Door[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(undefined);
      try {
        const [apiDoors, apiCategories] = await Promise.all([fetchDoors(), fetchCategories()]);
        if (!isMounted) return;
        const mappedDoors = apiDoors.map(mapApiDoorToDoor);
        const mappedCategories = apiCategories.map((c: ApiCategory) => ({
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          icon: pickIconForCategory(c.name, c.slug),
        }));
        setDoors(mappedDoors);
        setCategories(mappedCategories);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getDoorById = (id: string) => doors.find(d => d.id === id);
  const getDoorsByCategoryName = (categoryName: string) => doors.filter(d => d.category === categoryName);

  const value = useMemo(
    () => ({ doors, categories, loading, error, getDoorById, getDoorsByCategoryName }),
    [doors, categories, loading, error]
  );

  return <DoorsContext.Provider value={value}>{children}</DoorsContext.Provider>;
};

export function useDoors() {
  const ctx = useContext(DoorsContext);
  if (!ctx) throw new Error('useDoors must be used within DoorsProvider');
  return ctx;
}


