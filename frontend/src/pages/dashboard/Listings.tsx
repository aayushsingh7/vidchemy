import { useEffect, useState } from "react";
import ProductBox from "../../components/ProductBox";
import Loader from "../../components/Loader";
import { useGuestAccount } from "../../hooks/useGuestAccount";
import { useToast } from "../../hooks/useToast";

const Listings = () => {
  const guestId = useGuestAccount();
  const [listings, setListings] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    if (!guestId) return;
    fetchListings();
  }, [guestId]);

  async function fetchListings() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/listings?userId=${guestId}&offset=0`,
      );
      const data = await res.json();
      setListings(data.data.listings);
    } catch (err) {
      toast.error("Oops! something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <main className="font-inter flex-1 overflow-y-auto px-6 text-gray-300 w-full bg-gray-900 h-[100dvh]">
      <h2 className="text-2xl h-16 font-semibold text-white flex items-center gap-3">
        Listings
      </h2>

      <div>
        {listings.map((data: any) => {
          return <ProductBox data={data} />;
        })}
      </div>
    </main>
  );
};

export default Listings;
