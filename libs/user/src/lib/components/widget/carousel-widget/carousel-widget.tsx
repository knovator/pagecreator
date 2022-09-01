import Slider, { Settings } from 'react-slick';
import { WidgetTypeProps } from '../../../types';
import Next from '../../../icons/Next';
import Previous from '../../../icons/Previous';

export function CarouselWidget({
  widgetData,
  apiBaseUrl,
  formatTile,
  settings,
  onClick,
}: WidgetTypeProps) {
  const defaultSettings: Settings = {
    dots: false,
    infinite: true,
    slidesToShow: widgetData.mobilePerRow,
    slidesToScroll: 1,
    autoplay: widgetData.autoPlay,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    nextArrow: (
      <div>
        <Next />
      </div>
    ),
    prevArrow: (
      <div>
        <Previous />
      </div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: widgetData.tabletPerRow,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: widgetData.webPerRow,
        },
      },
    ],
  };
  if (!widgetData) return null;
  return (
    <Slider {...(settings ? settings : defaultSettings)}>
      {widgetData.webTiles.map((tile) => formatTile(tile))}
    </Slider>
  );
}

export default CarouselWidget;
