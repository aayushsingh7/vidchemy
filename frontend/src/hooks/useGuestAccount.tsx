import { useEffect, useState } from "react";

export const useGuestAccount = () => {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let currentId = localStorage.getItem("vidchemy_guest_id");
    if (!currentId) {
      currentId = `guest_${crypto.randomUUID()}`;
      localStorage.setItem("vidchemy_guest_id", currentId);
    }

    setGuestId(currentId);
  }, []);

  return guestId;
};
