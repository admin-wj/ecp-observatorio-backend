import { FC } from 'react';

let ecoPetrolLogo = '';
let oceanaLogoType = '';

if (typeof window === 'undefined') {
  // Only run fs on the server
  const fs = require('fs');
  const path = require('path');
  ecoPetrolLogo = fs
    .readFileSync('src/utils/report-templates/images/ecopetrol-logo.png')
    .toString('base64');
  oceanaLogoType = fs
    .readFileSync('src/utils/report-templates/images/oceana-logo.png')
    .toString('base64');
}

const HeaderTemplate: FC = () => {
  return (
    <header style={{ backgroundColor: '#a492da' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 64,
          padding: 32,
        }}
      >
        <h1
          style={{
            flex: 0.5,
            fontSize: 24,
            color: 'white',
          }}
        >
          Observatorio Corporativo
        </h1>
        <div
          style={{
            flex: 0.3,
            height: 64,
            position: 'relative',
          }}
        >
          <img
            src={`data:image/png;base64,${ecoPetrolLogo}`}
            alt="eco-petrol-logo"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />
        </div>
        <div
          style={{
            width: 1,
            backgroundColor: 'black',
            height: 64,
          }}
        />
        <div
          style={{
            flex: 0.3,
            height: 64,
            position: 'relative',
          }}
        >
          <img
            src={`data:image/png;base64,${oceanaLogoType}`}
            alt="oceana-logo"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderTemplate;
