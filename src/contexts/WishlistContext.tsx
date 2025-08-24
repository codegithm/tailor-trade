
import { createContext, useContext, useState, ReactNode } from "react";

interface WishlistContextType {
  wishlistItems: string[];
  addToWishlist: (designId: string) => void;
  removeFromWishlist: (designId: string) => void;
  isInWishlist: (designId: string) => boolean;
  toggleWishlist: (designId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const addToWishlist = (designId: string) => {
    setWishlistItems(prev => [...prev, designId]);
  };

  const removeFromWishlist = (designId: string) => {
    setWishlistItems(prev => prev.filter(id => id !== designId));
  };

  const isInWishlist = (designId: string) => {
    return wishlistItems.includes(designId);
  };

  const toggleWishlist = (designId: string) => {
    if (isInWishlist(designId)) {
      removeFromWishlist(designId);
    } else {
      addToWishlist(designId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
