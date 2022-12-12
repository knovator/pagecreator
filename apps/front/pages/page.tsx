import { Page, getData } from '@knovator/pagecreator';

export function PagePage({ pageData }) {
  if (!(pageData && pageData._id)) return null;
  return (
    <Page
      pageData={pageData}
      imageBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
      // title={`Page Name is ${pageData.name}`}
    />
  );
}

export async function getServerSideProps() {
  const pageData = await getData({
    url: process.env.NEXT_PUBLIC_GET_PAGE_URL,
    code: process.env.NEXT_PAGE_CODE,
  });
  return { props: { pageData } };
}

export default PagePage;
