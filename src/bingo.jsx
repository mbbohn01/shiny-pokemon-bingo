import { Grid, Modal, TextInput, Stack, Button, Container, Select} from '@mantine/core';
import { useState, useEffect } from 'react';

const gameData = [
    {value: 'rby', label: 'Pokemon Red/Blue/Green', abbr: 'RBG', zoom: 0.8},
    {value: 'ylw', label: 'Pokemon Yellow', abbr: 'Yellow', zoom: 0.8},
    {value: 'gsc', label: 'Pokemon Gold/Silver', abbr: 'GS', zoom: 0.6},
    {value: 'cry', label: 'Pokemon Crystal', abbr: 'Crystal', zoom: 0.6},
    {value: 'rse', label: 'Pokemon Ruby/Sapphire', abbr: 'RS', zoom: 0.8},
    {value: 'emr', label: 'Pokemon Emerald', abbr: 'Emerald', 'zoom': 0.8},
    {value: 'frlg', label: 'Pokemon FireRed/LeafGreen', abbr: 'FRLG', 'zoom': 0.8},
    {value: 'dpp', label: 'Pokemon Diamond/Pearl', abbr: 'DP', zoom: 1},
    {value: 'plat', label: 'Pokemon Platinum', abbr: 'Platinum', zoom: 1},
    {value: 'hgss', label: 'Pokemon HeartGold/SoulSilver', abbr: 'HGSS', zoom: 1},
    {value: 'bw', label: 'Pokemon Black/White', abbr: 'BW', zoom: 1},
    {value: 'b2w2', label: 'Pokemon Black 2/White 2', abbr: 'B2W2', zoom: 1},
    {value: 'xy', label: 'Pokemon X/Y', abbr: 'XY', zoom: 0.8},
    {value: 'oras', label: 'Pokemon Omega Ruby/Alpha Sapphire', abbr: 'ORAS', zoom: 1},
    {value: 'sm', label: 'Pokemon Sun/Moon', abbr: 'SM', zoom: 1.2},
    {value: 'usum', label: 'Pokemon Ultra Sun/Ultra Moon', abbr: 'USUM', zoom: 1.2},
    {value: 'lgpe', label: "Pokemon Let's Go Pikachu/Eevee", abbr: 'LGPE', zoom: 1},
    {value: 'ss', label: 'Pokemon Sword/Shield', abbr: 'SWSH', zoom: 1},
    {value: 'bdsp', label: 'Pokemon Brilliant Diamond/Shining Pearl', abbr: 'BDSP', zoom: 1},
    {value: 'pla', label: 'Pokemon Legends Arceus', abbr: 'PLA', zoom: 1},
    {value: 'sv', label: 'Pokemon Scarlet/Violet', abbr: 'SV', zoom: 1},
    {value: 'za', label: 'Pokemon Legends: Z-A', abbr: 'Legends Z-A', zoom: 1},
    {value: 'pogo', label: 'Pokemon GO', abbr: 'POGO', zoom: 1},
    {value: 'sleep', label: 'Pokemon Sleep', abbr: 'Sleep', zoom: 1},
    {value: 'col', label: 'Pokemon Colosseum', abbr: 'Colosseum', zoom: 1},
    {value: 'xd', label: 'Pokemon XD: Gale of Darkness', abbr: 'XD', zoom: 1},
    {value: 'pmdx', label: 'Pokemon Mystery Dungeon: Rescue Team DX', abbr: 'PMDX', zoom: 1},
    {value: 'rum', label: 'Pokemon Rumble', abbr: 'Rumble', zoom: 1}
]

const getSpritePath = (pokemon, value) => { 
    switch (value) {
        case 'rby':
            return pokemon.sprites.versions['generation-i']['red-blue'].front_default
        case 'gsc':
            return pokemon.sprites.versions['generation-ii']['gold'].front_shiny
        case 'rse':
            return pokemon.sprites.versions['generation-iii']['ruby-sapphire'].front_shiny
        case 'dpp':
            return pokemon.sprites.versions['generation-iv']['diamond-pearl'].front_shiny
        case 'bw':
        case 'b2w2':
            return pokemon.sprites.versions['generation-v']['black-white'].front_shiny
        case 'xy':
            return pokemon.sprites.versions['generation-vi']['x-y'].front_shiny
        case 'sm':
        case 'usum':
            return pokemon.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny
        case 'lgpe':
        case 'ss':
        case 'sv':
        case 'bdsp':
        case 'pla':
            return pokemon.sprites['other']['home'].front_shiny
        case 'ylw': 
            return pokemon.sprites.versions['generation-i']['yellow'].front_default
        case 'cry': 
            return pokemon.sprites.versions['generation-ii']['crystal'].front_shiny
        case 'emr':
            return pokemon.sprites.versions['generation-iii']['emerald'].front_shiny
        case 'frlg':
            return pokemon.sprites.versions['generation-iii']['firered-leafgreen'].front_shiny
        case 'plat':
            return pokemon.sprites.versions['generation-iv']['platinum'].front_shiny
        case 'hgss': 
            return pokemon.sprites.versions['generation-iv']['heartgold-soulsilver'].front_shiny
        case 'oras':
            return pokemon.sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_shiny
        default:
            return pokemon.sprites['other']['home'].front_shiny
    } 
}

function TestGrid() {
  const [cells, setCells] = useState(Array(25).fill({ name: '', sprite: '', customText: '', generation: ''}));
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customText, setCustomText] = useState('');
  const [generation, setGeneration] = useState('');
  const [allPokemonData, setAllPokemonData] = useState({});
  const [isSearchable, setIsSearchable] = useState(false);

useEffect(() => {
  if (editingIndex !== null) {  // When modal opens
    const timer = setTimeout(() => {
      setIsSearchable(true);
    }, 300);  // Wait for modal animation
    return () => clearTimeout(timer);
  } else {  // When modal closes
    setIsSearchable(false);
  }
}, [editingIndex]);

    const getPokemonList = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000`)
            const data = await response.json()
            const pokemonData = {} 
            
            for (const mon of data.results) {
                const details = await enrichPokemon(mon)
                pokemonData[mon.name] = details
            }
            console.log('Final Pokemon data:', pokemonData)
            setAllPokemonData(pokemonData)
            setIsLoading(false) 
            
        } catch (error) {
            console.error('Error fetching Pokemon:', error)
            setIsLoading(false)
        }
    }
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const enrichPokemon = async (mon) => {
        await delay(0.1);
        const response = await fetch(mon.url)
        const data = await response.json()
        return data  
    }

  useEffect(() => {
    getPokemonList();
  }, []);

  const handleCellChange = (index, pokemon) => {
    const newCells = [...cells];
    newCells[index] = { 
      name: pokemon.name, 
      sprite: getSpritePath(pokemon, generation),
      customText: customText,
      generation: generation
    };
    setCells(newCells);
    setEditingIndex(null);
    setSearchValue('');
    setCustomText('');
    setGeneration('');
  };

  return (
    <Container size="sm">
      <Grid columns={5} style={{ maxWidth: '500px', margin: 'auto' }}>
        <Grid.Col span={1} style={headerStyle}>B</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>I</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>N</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>G</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>O</Grid.Col>

        {cells.map((cell, index) => (
          <Grid.Col key={index} span={1} style={cellStyle}>
            <div style={cellContainerStyle}>
              {cell.name && (
                <>
                  <img 
                    src={cell.sprite} 
                    alt={cell.name} 
                    style={{ 
                      width: `${110 * (cell.generation ? gameData.find(g => g.value === cell.generation)?.zoom || 1 : 1)}%`, 
                      height: `${110 * (cell.generation ? gameData.find(g => g.value === cell.generation)?.zoom || 1 : 1)}%`,
                      clip: 'auto'
                    }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    right: '0',
                    textAlign: 'center',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    padding: '0px',
                  }}>
                    {cell.customText || (cell.generation ? gameData.find(g => g.value === cell.generation)?.abbr || '' : '')}
                  </div>
                </>     
              )}
              <button
                onClick={() => {
                    setEditingIndex(index);
                    if (cells[index].name) {
                      setSearchValue(cells[index].name.charAt(0).toUpperCase() + cells[index].name.slice(1));
                      setGeneration(cells[index].generation);
                      setCustomText(cells[index].customText);
                    } else {
                      setSearchValue('');
                      setGeneration('');
                      setCustomText('');
                    }
                }}
                style={editButtonStyle}
              >
                ⚙️
              </button>
            </div>
          </Grid.Col>
        ))}
      </Grid>

      <Modal.Root opened={editingIndex !== null} onClose={() => {
        setEditingIndex(null);
        if (!cells[editingIndex]?.name) { 
          setGeneration('');
          setCustomText('');
          setSearchValue('');
        }
      }} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Select Pokémon</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Select
              placeholder="Choose game..."
              value={generation || (cells[editingIndex]?.generation || '')}
              onChange={setGeneration}
              data={gameData}
              mb="md"
              clearable
              autoFocus
              required
              searchable={isSearchable}
            />
            <TextInput
              placeholder="Enter custom text (optional)..."
              value={customText || (cells[editingIndex]?.customText || '')}
              onChange={(e) => setCustomText(e.target.value)}
              mb="md"
            />
            <TextInput
              placeholder="Type at least 2 letters to search Pokémon..."
              disabled={!generation}
              value={searchValue || (cells[editingIndex]?.name || '')}
              onChange={(e) => {
                  setSearchValue(e.target.value);
              }}
              mb="md"
            />
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', color: 'gray' }}>
                  Loading Pokémon...
                </div>
              ) : searchValue.trim().length < 2 ? (
                <div style={{ textAlign: 'center', color: 'gray' }}>
                  Type at least 2 letters to see Pokémon options...
                </div>
              ) : (
                <>
                  {Object.entries(allPokemonData)
                    .filter(([name]) => (
                      name.includes(searchValue.toLowerCase()) && 
                      getSpritePath(allPokemonData[name], generation) !== null
                    ))
                    .map(([name, pokemon]) => {
                      return (
                        <Button
                          key={name}
                          variant="light"
                          onClick={() => handleCellChange(editingIndex, pokemon)}
                          fullWidth
                          mb="xs"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                          }}
                        >
                          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </Button>
                      );
                    })}
                </>
              )}
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </Container>
  );
}

const headerStyle = {
  backgroundColor: '#2C3E50',
  color: 'white',
  padding: '15px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '24px',
  border: '1px solid #34495E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cellStyle = {
  backgroundColor: 'white',
  textAlign: 'center',
  border: '1px solid #BDC3C7',
  fontSize: '18px', 
  cursor: 'default',
  transition: 'background-color 0.3s',
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};

const cellContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const editButtonStyle = {
  position: 'absolute',
  top: '-5px',
  right: '-2px',
  padding: '0px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  opacity: 0.3,
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: 1
  }
};

export default TestGrid;