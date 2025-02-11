import React from 'react';
import githubIcon from '../assets/github-mark.svg'

const GitHub = ({ repoUrl }) => {
  return (
    <a 
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ 
        position: 'fixed',
        top: '1rem',
        right: '1rem'
      }}
      className="github-icon z-50 opacity-80 hover:opacity-100 transition-opacity"
      aria-label="View source on GitHub"
    >
      <img 
        src={githubIcon} 
        alt="GitHub"
        style={{
          width: '30px',
          height: '30px'
        }}
      />
    </a>
  );
};
export default GitHub;