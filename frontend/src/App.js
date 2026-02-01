import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { ListingDetailPage } from "@/pages/ListingDetailPage";
import { SellPage } from "@/pages/SellPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { AdminPage } from "@/pages/AdminPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
