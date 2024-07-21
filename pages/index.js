import Footer from "../src/components/layouts/footer";
import Header from "../src/components/layouts/header";
import axios from "axios";
import Products from "../src/components/products";
import { GET_PRODUCTS, HEADER_FOOTER_ENDPOINT } from "../src/utils/constants/endpoints";
import { getProductsData } from "../src/utils/products";

export default function Home({ headerFooter, products }) {
  //   console.log(data);
  const { header, footer } = headerFooter || {};

  return (
    <>
      <Header header={header} />
      <main className="container mx-auto py-4">
        <Products products={products} />
      </main>
      <Footer footer={footer} />
    </>
  );
}

export async function getStaticProps() {
  const { data: headerFooterData } = await axios.get(HEADER_FOOTER_ENDPOINT);
  const { data: products } = await getProductsData();

  const data = {
    headerFooter: headerFooterData?.data ?? {},
    products: products ?? {},
  };

  return {
    props: data || {},
    /**
     * Revalidate means that if a new request comes to server, then every 1 sec it will check
     * if the data is changed, if it is changed then it will update the
     * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
     */
    revalidate: 1,
  };
}
