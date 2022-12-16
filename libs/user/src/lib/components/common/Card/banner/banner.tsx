import { CardProps } from '../../../../types';

export function Banner({
  imageAltText,
  imageUrl,
  onClick,
  srcSets,
  title,
  subtitle,
}: CardProps) {
  return (
    <div className="kpc_banner">
      <b>{title}</b>
      {subtitle ? <p>{subtitle}</p> : null}
      <img
        src={imageUrl}
        alt={imageAltText}
        className="kpc_banner-image"
        srcSet={srcSets}
        loading="lazy"
        onClick={() => onClick && onClick()}
      />
    </div>
  );
}

export default Banner;
