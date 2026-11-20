import { AlertCircleIcon, CheckIcon } from '../icons';

const StatusBanner = ({ status }) => {
  if (!status) return null;

  return (
    <div className={`status-banner ${status.type}`}>
      <div className="status-icon">
        {status.type === 'success' ? <CheckIcon size={18} strokeWidth={2.5} /> : <AlertCircleIcon size={18} />}
      </div>
      <div className="status-text">{status.text}</div>
    </div>
  );
};

export default StatusBanner;
