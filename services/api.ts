export interface ApiDoor {
  id: number;
  name: string;
  price: string;
  image_url: string;
  category: number;
  category_name: string;
  description: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

const API_BASE = 'https://rkdoors.pythonanywhere.com/api';

export async function fetchDoors(): Promise<ApiDoor[]> {
  const res = await fetch(`${API_BASE}/doors/`);
  if (!res.ok) {
    throw new Error(`Failed to fetch doors: ${res.status}`);
  }
  return res.json();
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_BASE}/categories/`);
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }
  return res.json();
}

