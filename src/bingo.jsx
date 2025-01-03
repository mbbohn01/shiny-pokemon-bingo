import { Grid, Modal, TextInput, Stack, Button, Container } from '@mantine/core';
import { useState, useEffect } from 'react';

function TestGrid() {
  const [cells, setCells] = useState(Array(25).fill({ name: '', sprite: '', customText: '' }));
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customText, setCustomText] = useState('');
  const [generation, setGeneration] = useState('');

  const getGenerationSprite = (detailData, gen) => {
    switch(gen) {
      case '1':
        return detailData.sprites.versions['generation-i']['red-blue'].front_transparent;
      case '2':
        return detailData.sprites.versions['generation-ii'].crystal.front_shiny;
      case '3':
        return detailData.sprites.versions['generation-iii'].emerald.front_shiny;
      case '4':
        return detailData.sprites.versions['generation-iv'].platinum.front_shiny;
      case '5':
        return detailData.sprites.versions['generation-v']['black-white'].front_shiny;
      case '6':
        return detailData.sprites.versions['generation-vi']['x-y'].front_shiny;
      case '7':
        return detailData.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny;
      case '8':
        return detailData.sprites.versions['generation-viii']['sword-shield'].front_shiny;
      case '9':
        return detailData.sprites.other.home.front_shiny;
    //   default:
    //     return detailData.sprites.front_shiny;
    }
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const initialResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        const initialData = await initialResponse.json();
        const totalPokemon = initialData.count;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${30}`);
        const data = await response.json();
        
        const detailedPokemon = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            const detailData = await detailResponse.json();
            return {
              name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
              sprite: getGenerationSprite(detailData, generation)
            };
          })
        );
        
        setPokemonList(detailedPokemon);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, [generation]);

  const handleCellChange = (index, pokemon) => {
    const newCells = [...cells];
    newCells[index] = { 
      name: pokemon.name, 
      sprite: pokemon.sprite, 
      customText: customText
    };
    setCells(newCells);
    setEditingIndex(null);
    setSearchValue('');
    setCustomText('');
  };

  const filteredPokemon = searchValue.trim().length >= 2
    ? pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

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
                    style={{ width: '110%', height: '110%', objectFit: 'contain' }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    right: '0',
                    textAlign: 'center',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white background
                    padding: '0px',
                  }}>
                    {cell.customText || cell.name}
                  </div>
                </>     
              )}
              <button
                onClick={() => setEditingIndex(index)}
                style={editButtonStyle}
              >
                ⚙️
              </button>
            </div>
          </Grid.Col>
        ))}
      </Grid>

      <Modal.Root opened={editingIndex !== null} onClose={() => setEditingIndex(null)} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Select Pokémon</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <TextInput
              placeholder="Enter generation (1-5, or leave empty for modern)..."
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              mb="md"
              autoFocus
            />
            <TextInput
              placeholder="Enter custom text (optional)..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              mb="md"
            />
            <TextInput
              placeholder="Type at least 2 letters to search Pokémon..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
              ) : filteredPokemon.map((pokemon) => (
                <Button
                  key={pokemon.name}
                  variant="light"
                  onClick={() => handleCellChange(editingIndex, pokemon)}
                  fullWidth
                  mb="xs"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <img 
                    src={pokemon.sprite} 
                    alt={pokemon.name} 
                    style={{ width: '40px', height: '40px' }}
                  />
                  {pokemon.name}
                </Button>
              ))}
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
  justifyContent: 'center'
};

const inputStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
  background: 'none',
  textAlign: 'center',
  fontSize: '18px',
  padding: '0',
  margin: '0',
  outline: 'none'
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

const numberListStyle = {
  maxHeight: '300px',
  overflowY: 'auto',
};

export default TestGrid;