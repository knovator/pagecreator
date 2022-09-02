import { SimpleCardProps } from '../../../../types';

export function SimpleCard({
  imageUrl,
  imageAltText,
  subTitle,
  label,
  title,
  onClick,
}: SimpleCardProps) {
  return (
    <div className="kpc_simple-card" onClick={() => onClick && onClick()}>
      <div className="kpc_simple-card-heading">
        <img
          src={imageUrl}
          className="kpc_simple-card-image"
          alt={imageAltText}
        />
      </div>
      <div className="kpc_simple-card-body">
        {label && <p className="kpc_simple-card-label">{label}</p>}
        <div className="kpc_simple-card-content">
          <h4 className="kpc_simple-card-title">{title}</h4>
          {subTitle && <p className="kpc_simple-card-subtitle">{subTitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default SimpleCard;
