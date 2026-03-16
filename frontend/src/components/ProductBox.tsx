import React from "react";
import { Link } from "react-router-dom";

export interface Product {
  _id: string;
  title: string;
  medias: string[];
  description: number;
  attributes: {
    price: {
      currencyCode: string;
      currencyName: string;
      estimatedOriginalPrice: number;
      estimatedPrice: number;
      estimatedDiscountPercent: number;
    };
  };
}

interface ProductBoxProps {
  data: Product;
}

const ProductBox: React.FC<ProductBoxProps> = ({ data }) => {
  const isINR = data?.attributes?.price?.currencyCode === "INR";
  const locale = isINR ? "en-IN" : "en-US";
  const symbol = isINR ? "₹" : "$";

  return (
    <Link
      to={`/dashboard/listings/${data._id}`}
      className="hover:cursor-pointer flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-700 bg-zinc-900 transition-colors duration-200"
    >
      <div className="w-full sm:w-35 h-35 flex-shrink-0 flex items-center justify-center bg-white rounded-md p-2 shadow-inner">
        <div className="block w-full h-full">
          <img
            src={data?.medias[0] || "https://i.sstatic.net/y9DpT.jpg"}
            alt={data.title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 py-1">
        <h2 className="text-base sm:text-2xl font-medium text-white group-hover:text-orange-400 group-hover:underline line-clamp-1 leading-snug">
          {data.title}
        </h2>

        <p className="line-clamp-2 mt-2 text-gray-400">{data.description}</p>

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div className="flex items-start no-underline text-gray-100">
            <span className="text-lg mt-1 font-medium text-gray-300 relative top-[-10px]">
              {symbol}
            </span>
            <span className="text-2xl font-semibold leading-none">
              {data.attributes.price.estimatedPrice.toLocaleString(locale)}
            </span>
          </div>

          {data.attributes.price.estimatedOriginalPrice >
            data.attributes.price.estimatedPrice && (
            <div className="flex text-md text-gray-400 relative top-[-5px]">
              <span className="line-through text-md">
                {symbol}{" "}
                {data.attributes.price.estimatedOriginalPrice.toLocaleString(
                  locale,
                )}
              </span>
              <span className="ml-2 text-gray-300">
                ({data.attributes.price.estimatedDiscountPercent}% off)
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductBox;
