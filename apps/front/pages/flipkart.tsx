/* eslint-disable @next/next/no-img-element */
import { Widget, getData } from '@knovator/pagecreator';
import Head from 'next/head';

const CategoryItem = ({ category }) => {
  return (
    <div
      key={category._id}
      className="text-center cursor-pointer hover:bg-slate-100 rounded-sm duration-150 transition-colors"
    >
      <img
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
      />
    </div>
  );
};

const BrochureItem = ({ tile }) => {
  return (
    <div className="cursor-pointer hover:bg-slate-100 duration-200 transition-colors p-1 rounded-sm bg-slate-50 m-1">
      <img
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${tile?.image?.uri}`}
        alt={tile.title}
      />
    </div>
  );
};

const TopProductItem = ({ item }) => {
  return (
    <div className="flex flex-col bg-white text-center">
      <div className="relative flex items-center justify-center h-60 cursor-pointer">
        <img
          className="max-h-40 max-w-full hover:scale-105 duration-150 transition-transform"
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item?.img?.uri}`}
          alt={item.name}
        />
      </div>
      <p className="text-base font-medium">{item.name}</p>
      <p className="text-green-700">&#8377;{item.price}</p>
    </div>
  );
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      //   id="preArrow"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
}

export function FlipkartPage({ widgetsData }) {
  return (
    <>
      <Head>
        <title>Flipkart</title>
      </Head>
      <div className="page">
        <div className="categories">
          <div className="tiles">
            <Widget
              widgetData={widgetsData[0]}
              imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
              formatItem={(item) => <CategoryItem category={item} />}
              settings={{
                dots: false,
                arrows: false,
                slidesToShow: 9,
                slidesToScroll: 1,
                swipeToSlide: true,
              }}
            />
          </div>
        </div>
        <div className="content">
          <Widget
            widgetData={widgetsData[1]}
            imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
            formatItem={(item) => <BigBillionDayItem tile={item} />}
            settings={{
              dots: false,
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 1500,
              infinite: true,
            }}
          />

          <div>
            <img src="https://rukminim1.flixcart.com/fk-p-flap/3328/287/image/87da51544bff6617.jpg?q=50" />
          </div>

          <Widget
            widgetData={widgetsData[2]}
            imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
            formatItem={(item) => <BrochureItem tile={item} />}
          />

          <div className="flex flex-row">
            <div className="flex-grow-0 w-4/6">
              <Widget
                widgetData={widgetsData[3]}
                imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
                formatItem={(item) => <TopProductItem item={item} />}
                settings={{
                  slidesToShow: 5,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 1500,
                  infinite: true,
                  nextArrow: <SampleNextArrow />,
                  prevArrow: <SamplePrevArrow />,
                }}
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
