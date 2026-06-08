export async function fetchPack() {
  const res = await fetch('/api/pack');
  if (!res.ok) throw new Error('Erro na rede ao buscar pack');
  return res.json();
}

export async function fetchSpells() {
  const res = await fetch('/api/spells');
  if (!res.ok) throw new Error('Erro na rede ao buscar feitiços');
  return res.json();
}

export async function fetchCpuDeck() {
  const res = await fetch('/api/cpu-deck', { method: 'POST' });
  if (!res.ok) throw new Error('Erro na rede ao buscar deck CPU');
  return res.json();
}