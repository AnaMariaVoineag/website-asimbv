const PageHeader = ({ title, subtitle, children }) => (
  <header className="adm-page-header">
    <div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {children && <div className="adm-page-actions">{children}</div>}
  </header>
);

export default PageHeader;
