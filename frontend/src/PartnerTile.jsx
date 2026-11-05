// src/PartnerTile.jsx
import { useState } from 'react';
import { assetUrl } from './assetUrl';
import './PartnerTile.css';

// Shows the logo. The name appears only if a partner has no logo or it fails to load.
const PartnerTile = ({ partner }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = partner.logoUrl && !logoFailed;

  const content = showLogo ? (
    <img
      src={assetUrl(partner.logoUrl)}
      alt={partner.name}
      title={partner.name}
      className="partner-logo"
      loading="lazy"
      onError={() => setLogoFailed(true)}
    />
  ) : (
    <span className="partner-name">{partner.name}</span>
  );

  return partner.websiteUrl ? (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="partner-tile partner-tile-link"
    >
      {content}
    </a>
  ) : (
    <div className="partner-tile">{content}</div>
  );
};

export default PartnerTile;
