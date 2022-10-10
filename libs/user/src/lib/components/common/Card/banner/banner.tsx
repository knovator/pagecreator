import { CardProps } from '../../../../types';

export function Banner({
  imageAltText,
  imageUrl,
  onClick,
  srcSets,
}: CardProps) {
  return (
    <div className="kpc_banner">
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
