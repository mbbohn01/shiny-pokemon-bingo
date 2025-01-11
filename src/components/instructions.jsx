import { Box } from '@mantine/core';


function Instructions({ text, title }) {
    return (
        <Box display={{ base: 'none', lg: 'block' }}>
            <div style={instructionStyle}>
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
const instructionStyle = {
    background: 'white',
    width: '15rem',
    height: '30rem',
    padding: '1rem',        
    border: '2px solid #f2f0ef',
    textAlign: 'center'

  };        

  const bannerStyle = {
    background: '#e87b58',  // Same color as border
    padding: '0.5rem',
    marginBottom: '1rem',
    textAlign: 'center',
    marginLeft: '-1rem',    // Offset the parent padding
    marginRight: '-1rem',
    marginTop: '-1rem',     // Extend to top edge
    color: 'white',
    fontWeight: 'bold',
    borderBottom: '4px solid #f2f0ef'
};

export default Instructions;