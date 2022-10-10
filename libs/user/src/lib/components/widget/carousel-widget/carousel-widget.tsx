import Slider, { Settings, CustomArrowProps } from 'react-slick';
import { WidgetTypeProps } from '../../../types';
import Next from '../../../icons/Next';
import Previous from '../../../icons/Previous';
import { filterTileData } from '../../../utils/helper';

const SlickArrowLeft = ({
  currentSlide,
  slideCount,
  ...props
}: CustomArrowProps) => (
  <button
    {...props}
    className={
      'slick-prev slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')
    }
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button"
  >
    <Previous />
  </button>
);
const SlickArrowRight = ({
  currentSlide,
  slideCount,
  ...props
}: CustomArrowProps) => (
  <button
    {...props}
    className={
      'slick-next slick-arrow' +
      (slideCount && currentSlide === slideCount - 1 ? ' slick-disabled' : '')
    }
    aria-hidden="true"
    aria-disabled={slideCount && currentSlide === slideCount - 1 ? true : false}
    type="button"
  >
    <Next />
  </button>
);

export function CarouselWidget({
  widgetData,
  formatItem,
  settings,
  className,
}: WidgetTypeProps) {
  const defaultSettings: Settings = {
    dots: false,
    infinite: true,
    slidesToShow: widgetData.mobilePerRow,
    slidesToScroll: 1,
    autoplay: widgetData.autoPlay,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
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
    <Slider {...(settings ? settings : defaultSettings)} className={className}>
      {widgetData.widgetType === 'Image'
        ? widgetData.tiles
            .filter(filterTileData)
            .map((tile, index) => <div key={index}>{formatItem(tile)}</div>)
        : widgetData.collectionItems.map((item, index) => (
            <div key={index}>{formatItem(item)}</div>
          ))}
    </Slider>
  );
}

export default CarouselWidget;
