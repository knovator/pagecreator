import React, { Fragment } from 'react';
import { Swiper, SwiperSlide, SwiperProps } from 'swiper/react';
import { Pagination, Autoplay, Virtual } from 'swiper';
import { ItemsTypeProps } from '../../../types';
import { filterItemData } from '../../../utils/helper';

export function CarouselWidget({
  widgetData,
  formatItem,
  settings,
  className,
  itemsContainer,
}: ItemsTypeProps) {
  const defaultSetting: SwiperProps = {
    slidesPerView: widgetData.mobilePerRow,
    loop: true,
    loopAdditionalSlides: 2,
    speed: 5000,
    breakpoints: {
      640: {
        slidesPerView: widgetData.mobilePerRow,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: widgetData.tabletPerRow,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: widgetData.webPerRow,
        spaceBetween: 50,
      },
    },
  };
  if (!widgetData) return null;
  if (typeof itemsContainer === 'function')
    return itemsContainer(
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <Fragment>
        {widgetData.itemsType === 'Image'
          ? widgetData.items
              .filter(filterItemData)
              .map((item, index) => (
                <Fragment key={index}>{formatItem(item)}</Fragment>
              ))
          : widgetData.collectionItems.map((item, index) => (
              <Fragment key={index}>{formatItem(item)}</Fragment>
            ))}
      </Fragment>
    );
  return (
    <Swiper
      {...{ ...defaultSetting, ...(settings || {}) }}
      className={className}
      modules={[Pagination, Autoplay, Virtual]}
      virtual={typeof window === 'undefined'}
    >
      {widgetData.itemsType === 'Image'
        ? widgetData.items
            .filter(filterItemData)
            .map((item, index) => (
              <SwiperSlide key={index}>{formatItem(item)}</SwiperSlide>
            ))
        : widgetData.collectionItems.map((item, index) => (
            <SwiperSlide key={index}>{formatItem(item)}</SwiperSlide>
          ))}
    </Swiper>
  );
}

export default CarouselWidget;
