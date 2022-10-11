/* eslint-disable @next/next/no-img-element */
import { Widget, getData, buildSrcSets } from '@knovator/pagecreator';
import Head from 'next/head';

const CategoryItem = ({ category }) => {
  return (
    <div
      key={category._id}
      className="text-center cursor-pointer hover:bg-slate-100 rounded-sm duration-150 transition-colors"
    >
      <img
        srcSet={category.srcSets || ''}
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category?.img?.uri}`}
        alt={category?.name}
        className="mx-auto h-16 w-16"
      />
      <p className="text-sm">{category?.name}</p>
    </div>
  );
};

const BigBillionDayItem = ({ tile }) => {
  return (
    <div className="cursor-pointer">
      <img
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${tile?.image?.uri}`}
        alt={tile.title}
        className="h-52 w-full"
        srcSet={buildSrcSets(
          process.env.NEXT_PUBLIC_API_BASE_URL,
          tile.srcSets || ''
        )}
      />
    </div>
  );
};

const BrochureItem = ({ tile }) => {
  return (
    <div className="cursor-pointer hover:bg-slate-100 duration-200 transition-colors rounded-sm bg-slate-50">
      <img
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${tile?.image?.uri}`}
        alt={tile.title}
        className="w-full"
      />
    </div>
  );
};

const TopProductItem = ({ item }) => {
  return (
    <div className="flex flex-col bg-white text-center border border-gray-300 items-stretch h-full">
      <div className="relative flex items-center justify-center h-24 md:h-32 lg:h-60 cursor-pointer p-2">
        <img
          className="h-full max-w-full hover:scale-105 duration-150 transition-transform"
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item?.img?.uri}`}
          alt={item.name}
        />
      </div>
      <p className="text-base font-medium">{item.name}</p>
      <p className="text-green-700">&#8377;{item.price}</p>
    </div>
  );
};

const BBSNextArrow = ({
  currentSlide,
  slideCount,
  className2,
  ...props
}: any) => (
  <button
    {...props}
    className={`slick-next -right-0 z-50 slick-arrow ${className2}`}
    type="button"
  >
    Next
  </button>
);
const BBSPrevArrow = ({
  currentSlide,
  slideCount,
  className2,
  ...props
}: any) => (
  <button
    {...props}
    className={`slick-prev -left-0 z-50 slick-arrow ${className2}`}
    type="button"
  >
    Prev
  </button>
);

export function FlipkartPage({ widgetsData }) {
  return (
    <>
      <Head>
        <title>Flipkart</title>
      </Head>
      <div className="page pb-10">
        <div className="categories">
          <div className="tiles">
            <Widget
              widgetData={widgetsData[0]}
              imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
              formatItem={(item) => <CategoryItem category={item} />}
              settings={(settings) => ({
                ...settings,
                dots: false,
                arrows: false,
                infinite: false,
                slidesToScroll: 1,
                swipeToSlide: true,
              })}
            />
          </div>
        </div>
        <div className="content">
          <Widget
            widgetData={widgetsData[1]}
            imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
            formatItem={(item) => <BigBillionDayItem tile={item} />}
            settings={(settings) => ({
              ...settings,
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 1500,
              infinite: true,
              nextArrow: (
                <BBSNextArrow className2="bg-gray-400 hover:bg-gray-400 hover:text-gray-400 py-10 align-middle rounded-l-sm" />
              ),
              prevArrow: (
                <BBSPrevArrow className2="bg-gray-400 hover:bg-gray-400 py-10 align-middle rounded-r-sm" />
              ),
            })}
          />

          <div>
            <img
              srcSet={`
                ${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/temp/1500x287/banner.jpg 500w,
                ${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/temp/2000x287/banner.jpg 900w,
                ${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/temp/banner.jpg 1200w
              `}
              alt="banner"
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/temp/banner.jpg`}
              className="h-20 w-full"
            />
          </div>

          <Widget
            widgetData={widgetsData[2]}
            imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
            formatItem={(item) => <BrochureItem tile={item} />}
            className={`gap-1 grid lg:grid-cols-${widgetsData[2].webPerRow} md:grid-cols-${widgetsData[2].tabletPerRow} grid-cols-${widgetsData[2].mobilePerRow}`}
          />

          <div className="bg-white w-full flex">
            <img
              src="/best-of-electronics-photo.png"
              alt="best of electronics"
              className="w-1/6"
            />
            <div className="w-5/6 bg-white">
              <Widget
                widgetData={widgetsData[3]}
                imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
                formatItem={(item) => <TopProductItem item={item} />}
                settings={(settings) => ({
                  ...settings,
                  slidesToShow: 5,
                  autoplay: true,
                  autoplaySpeed: 1500,
                  infinite: false,
                  dots: false,
                  swipeToSlide: true,
                  nextArrow: (
                    <BBSNextArrow className2="bg-gray-400 hover:bg-gray-400 py-10 align-middler ounded-l-sm" />
                  ),
                  prevArrow: (
                    <BBSPrevArrow className2="bg-gray-400 hover:bg-gray-400 py-10 align-middle rounded-r-sm" />
                  ),
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const widgetDataResponses = await Promise.all([
    getData({
      url: process.env.NEXT_PUBLIC_GET_WIDGETS_URL,
      code: 'FK_CATEGORIES',
    }),
    getData({
      url: process.env.NEXT_PUBLIC_GET_WIDGETS_URL,
      code: 'BIG_BILLION_DAYS_OFFERS',
    }),
    getData({
      url: process.env.NEXT_PUBLIC_GET_WIDGETS_URL,
      code: 'FK_BROCHURES',
    }),
    getData({
      url: process.env.NEXT_PUBLIC_GET_WIDGETS_URL,
      code: 'FK_TOP_OFFER_PRODUCTS',
    }),
  ]);
  return { props: { widgetsData: widgetDataResponses } };
}

export default FlipkartPage;
