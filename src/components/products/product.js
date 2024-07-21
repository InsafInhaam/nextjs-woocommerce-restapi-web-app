import Link from "next/link";
import Image from "../image";
import AddToCart from "../cart/add-to-cart";
import { isEmpty } from "lodash";

const Product = ({ product }) => {
  if (isEmpty(product)) {
    return null;
  }

  const img = product?.images?.[0] ?? {};
  const productType = product?.type ?? "";

  return (
    <div className="group relative">
      <Link href={product?.permalink ?? "/"}>
        <a>
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
            <Image
              sourceUrl={img?.src ?? ""}
              altText={product?.name ?? ""}
              title={product?.name ?? ""}
              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              width="280"
              height="320"
              priority
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <span aria-hidden="true" className="absolute inset-0" />
                {product?.name ?? ""}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Black</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {/* <div dangerouslySetInnerHTML={{ __html: sanitize( product?.price_html ?? '' ) }}/> */}
              {product?.price ? `$${product?.price}` : "Price not available"}
            </p>
          </div>
        </a>
      </Link>

      {"simple" === productType ? <AddToCart product={product} /> : null}
    </div>
  );
};

export default Product;
