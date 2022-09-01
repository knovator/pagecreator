import { CardProps } from '../../../../types';

export function Banner({ imageAltText, imageUrl, onClick }: CardProps) {
  return (
    <div className="kpc_banner">
      <img
        src={imageUrl}
        alt={imageAltText}
        className="kpc_banner-image"
        onClick={() => onClick && onClick()}
      />
    </div>
  );
}

export default Banner;
