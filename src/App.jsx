import './App.css'
import BingoBoard from './components/bingo'
import Instructions from './components/instructions'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Flex } from '@mantine/core';


function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS
    theme = {{fontFamily: 'Inter, Impact'}}
    >
      <Flex 
        align="center"
        justify="center" 
        style={{ marginTop: '3rem' }}
        px="10rem"
      >
      <Instructions title = "Instructions"
      text={`To get started, simply click on any cell you'd like to fill! You must choose a game in order to select your Pokemon. The game you choose will determine which sprite is shown. If you'd like to have text other than the game in front of the Pokemon, use the "custom text" field.

Enjoy!`}/>
      <ModalsProvider>
        <BingoBoard />
      </ModalsProvider>
      <Instructions title = "Notes" 
       text={`• There will only be sprites available for mainline games Gens 1-7. I hope to add support for more sprites in the future.

• If you come across any bugs, just message "bohn" on Discord`}/>
    </Flex>
    </MantineProvider>
  )
} 

export default App
