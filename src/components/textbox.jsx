// Component for textbox (instructions/notes etc.)

import { Box } from '@mantine/core';

// Mantine box element
function Textbox({ text, title }) {
    return (
        <Box display={{ base: 'none', lg: 'block' }} style={{marginTop: '-3rem'}}>
            <div style={textboxStyle}>
                <div style={bannerStyle}>{title}</div>
                <div style={{ 
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    paddingTop: '1rem'
                }}>{text}</div>
            </div>
        </Box>
    )
}

// Style objects
const textboxStyle = {
    background: 'white',
    width: '15rem',
    height: '30rem',
    padding: '1rem',        
    border: '2px solid #f2f0ef',
    textAlign: 'center'

  };        

  const bannerStyle = {
    background: '#e87b58', 
    padding: '0.5rem',
    marginBottom: '1rem',
    textAlign: 'center',
    marginLeft: '-1rem', 
    marginRight: '-1rem',
    marginTop: '-1rem', 
    color: 'white',
    fontWeight: 'bold',
    borderBottom: '4px solid #f2f0ef'
};

export default Textbox;