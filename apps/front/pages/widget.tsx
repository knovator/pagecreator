import { Widget, getData } from '@knovator/pagecreator';

export function WidgetPage({ widgetData }) {
  return (
    <Widget
      widgetData={widgetData}
      imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
    />
  );
}

export async function getServerSideProps() {
  const widgetData = await getData({
    url: process.env.NEXT_PUBLIC_GET_WIDGETS_URL,
    code: 'BIG_BILLION_DAYS_OFFERS',
  });
  return { props: { widgetData } };
}

export default WidgetPage;
