import { Widget, getWidgetData } from '@knovator/pagecreator';

export function Index({ widgetData }) {
  return <Widget widgetData={widgetData} apiBaseUrl="http://localhost:3333" />;
}

export async function getServerSideProps() {
  const widgetData = await getWidgetData({
    url: 'http:localhost:3333/users/widget-data',
    code: 'IMAGE_WIDGET',
  });
  return { props: { widgetData } };
}

export default Index;
