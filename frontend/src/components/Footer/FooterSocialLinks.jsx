import { SOCIAL_LINKS } from '../../constants/social';

const FooterSocialLinks = () => (
  <div className="footer-social-icons">
    {SOCIAL_LINKS.map(({ id, name, url, Icon }) => (
      <a
        key={id}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
        className="social-icon-btn"
      >
        <Icon className="social-svg-outline" />
      </a>
    ))}
  </div>
);

export default FooterSocialLinks;
