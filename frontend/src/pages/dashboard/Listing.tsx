import {
  CheckIcon,
  ClipboardDocumentIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import ImageCropper from "../../layouts/ImageCropper";

interface ListingData {
  title: string;
  description: string;
  bulletPoints: string[];
  searchTerms: string[];
  suggestedCategory: string;
  specifications: { key: string; value: string }[];
  attributes: {
    brand: string;
    color: string;
    material: string;
    targetAudience: string;
    estimatedOriginalPriceINR: number;
    estimatedPriceINR: number;
    estimatedDiscountPercent: number;
  };
  medias: string[];
}

const CopyButton = ({
  textToCopy,
  label,
}: {
  textToCopy: string;
  label?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none transition-all"
      title="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-green-600" />
      ) : (
        <ClipboardDocumentIcon className="w-4 h-4" />
      )}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
};

const Listing = ()=>  {
  const { id } = useParams();
  const [data, setData] = useState<any | ListingData>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [mainImage, setMainImage] = useState<string>("https://unbredbombers.ca/wp-content/uploads/2018/05/no-image-1.jpg");

  useEffect(() => {
    console.log("hello");
    fetchListingDetails();
  }, []);

  async function fetchListingDetails(): Promise<any> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`);
      const data = await res.json();
      setData(data.data);
      setMainImage(data.data.medias[0])
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  if (loading) return <Loader />;

  return (
    <div className="mx-auto bg-white font-sans text-gray-900 overflow-scroll h-[100dvh]">
      {showCrop && <ImageCropper imageUrl={mainImage} onClose={()=> setShowCrop(false)} />}
      <div className="flex flex-col justify-between items-start mb-6 rounded-t-md text-md">
        <div className="flex justify-start p-4 bg-gray-50 border-b border-gray-300 w-full">
          <span className="font-semibold text-gray-700 mr-3">Category: </span>
          <span className="text-gray-600">{data.suggestedCategory}</span>
        </div>
        <div className="mt-2 md:mt-0 flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-300">
          <span className="font-semibold text-gray-700 ">
            Backend Search Terms:
          </span>
          <span className="text-gray-500 " title={data.searchTerms.join(" ")}>
            {data.searchTerms.join(" ")}
          </span>
          <CopyButton
            textToCopy={data.searchTerms.join(" ")}
            label="Copy Terms"
          />
        </div>
      </div>

      <main className="px-6">
        {/* TOP SECTION: Image + Buy Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Images */}
          <div className="md:col-span-5 flex gap-4">
            {/* <div className="flex flex-col gap-2 w-16">
            {data.medias.map((img, idx) => (
              <div key={idx} className="border border-gray-300 rounded p-1 cursor-pointer hover:border-cyan-600 hover:shadow-sm">
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-auto object-contain" />
              </div>
            ))}
          </div> */}
            <div className="relative flex-1 border border-gray-100 p-2 flex flex-col items-start justify-start">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-auto object-cover max-h-[500px]"
              />
              <button onClick={()=> setShowCrop(true)} className="absolute left-0 top-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm">
                 Crop Image
              </button>

              <div className="flex items-start justify-start gap-2">
                {data.medias.map((img: string, index: number) => {
                  return (
                    <img
                      onClick={() => setMainImage(img)}
                      className="w-20 h-20 border-3 cursor-pointer border-gray-500/20 rounded-[10px] object-cover"
                      src={img}
                      alt={`product_image_${index + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Bullets */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Title Area */}
            <div>
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl font-medium leading-tight text-gray-900">
                  {data.title}
                </h1>
                <CopyButton textToCopy={data.title} label="Copy" />
              </div>
              <a
                href="#"
                className="text-cyan-700 text-sm hover:underline hover:text-orange-600 mt-1 block"
              >
                Visit the {data.attributes.brand} Store
              </a>

              {/* Mock Ratings */}
              <div className="flex items-center gap-1 mt-2 border-b border-gray-200 pb-2">
                <div className="flex text-orange-400">
                  <StarIconSolid className="w-4 h-4" />
                  <StarIconSolid className="w-4 h-4" />
                  <StarIconSolid className="w-4 h-4" />
                  <StarIconSolid className="w-4 h-4" />
                  <StarIcon className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-cyan-700 text-sm hover:underline cursor-pointer">
                  4.0 ratings
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-red-600 font-light">
                  -{data.attributes.estimatedDiscountPercent}%
                </span>
                <span className="text-3xl font-medium text-gray-900">
                  <span className="text-sm align-top font-normal pr-1">₹</span>
                  {data.attributes.estimatedPriceINR.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                M.R.P.:{" "}
                <span className="line-through">
                  ₹
                  {data.attributes.estimatedOriginalPriceINR.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-900">
                Inclusive of all taxes
              </p>
            </div>

            {/* Quick Attributes */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-2">
              <div className="font-bold text-gray-700">Brand</div>
              <div className="text-gray-900">{data.attributes.brand}</div>
              <div className="font-bold text-gray-700">Colour</div>
              <div className="text-gray-900">{data.attributes.color}</div>
              <div className="font-bold text-gray-700">Material</div>
              <div className="text-gray-900">{data.attributes.material}</div>
              <div className="font-bold text-gray-700">Audience</div>
              <div className="text-gray-900">
                {data.attributes.targetAudience}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Bullet Points */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-base text-gray-900">
                  About this item
                </h2>
                <CopyButton
                  textToCopy={data.bulletPoints
                    .map((bp: any) => `• ${bp}`)
                    .join("\n")}
                  label="Copy Bullets"
                />
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-900">
                {data.bulletPoints.map((bullet: string, index: number) => (
                  <li key={index}>
                    {/* Highlighting the all-caps hook visually */}
                    <span className="font-bold">{bullet.split(":")[0]}:</span>
                    {bullet.substring(bullet.indexOf(":") + 1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 my-8" />

        {/* BOTTOM SECTION: Product Description & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Description Area */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Product Description
              </h2>
              <CopyButton textToCopy={data.description} label="Copy Desc" />
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Technical Specifications Area */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Technical Details
              </h2>
              <CopyButton
                textToCopy={data.specifications
                  .map((s: any) => `${s.key}\t${s.value}`)
                  .join("\n")}
                label="Copy Specs"
              />
            </div>
            <div className="border-t border-l border-gray-200 text-sm">
              {data.specifications.map((spec: any, index: number) => (
                <div
                  key={index}
                  className="flex border-b border-r border-gray-200"
                >
                  <div className="w-1/2 bg-gray-100 p-2 font-semibold text-gray-700">
                    {spec.key}
                  </div>
                  <div className="w-1/2 p-2 text-gray-900 bg-white">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


export default Listing;