import { useEffect, useMemo, useState } from 'react';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
  if (selected) {
    fetch(selected.url)
      .then((response) => response.json())
      .then(setDetails);
  }
}, [selected]);

 useEffect(() => {
  async function loadPokemon() {
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=100000'
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setPokemon(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

    loadPokemon();
  }, []);

  const matches = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return [];

    return pokemon.filter((item) => item.name.includes(search));
  }, [pokemon, query]);

  if (selected) {
  return (
    <main>
      <button onClick={() => { setSelected(null); setDetails(null); }}>
        ← Back
      </button>

      {!details ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{details.name}</h1>
          <img src={details.sprites.front_default} alt={details.name} />
          <p>Height: {details.height}</p>
          <p>Type: {details.types.map((entry) => entry.type.name).join(', ')}</p>
          <p>Weight: {details.weight}</p>
        </>
      )}
    </main>
  );
}

  return (
    <main>
      <h1>Pokémon Search</h1>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Pokémon..."
      />

      {loading && <p>Loading Pokémon...</p>}
      {error && <p role="alert">Could not load Pokémon: {error}</p>}

      {!loading && !error && query.trim() && (
  <div className="pokemon-grid">
    {matches.map((item) => {
      const id = item.url.split('/').filter(Boolean).pop();

      return (
  <button
    className="pokemon-card"
    key={item.name}
    type="button"
    onClick={() => {
      setDetails(null);
      setSelected(item);
    }}
  >
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      alt={item.name}
    />
    <h2>{item.name}</h2>
  </button>
);
    })}
  </div>
)}
    </main>
  );
}

export default App;