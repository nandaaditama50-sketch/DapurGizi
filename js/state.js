// Centralized application state
export let recipesData = [];
export let kecamatanData = [];
export let kategoriData = [];
export let favoriteIds = new Set(JSON.parse(localStorage.getItem('dapurgizi_favorites') || '[]'));

export function setRecipesData(data) { recipesData = data; }
export function setKecamatanData(data) { kecamatanData = data; }
export function setKategoriData(data) { kategoriData = data; }

export function toggleFavorite(id) {
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
  } else {
    favoriteIds.add(id);
  }
  localStorage.setItem('dapurgizi_favorites', JSON.stringify([...favoriteIds]));
}

export async function loadData() {
  const [recipesRes, kecamatanRes, kategoriRes] = await Promise.all([
    fetch('data/recipes.json'),
    fetch('data/kecamatan.json'),
    fetch('data/kategori.json')
  ]);
  if (!recipesRes.ok) throw new Error('Gagal memuat data resep');
  if (!kecamatanRes.ok) throw new Error('Gagal memuat data kecamatan');
  if (!kategoriRes.ok) throw new Error('Gagal memuat data kategori');
  
  setRecipesData(await recipesRes.json());
  setKecamatanData(await kecamatanRes.json());
  setKategoriData(await kategoriRes.json());
}