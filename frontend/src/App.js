import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PremiumNavbar } from "@/components/PremiumNavbar";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { PremiumHomePage } from "@/pages/PremiumHomePage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { ListingDetailPage } from "@/pages/ListingDetailPage";
import { SellPage } from "@/pages/SellPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { AdminPage } from "@/pages/AdminPage";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

function AppContent() {
  const { theme } = useTheme();
  const isPremium = theme === 'premium';

  return (
    <>
      {isPremium ? <PremiumNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={isPremium ? <PremiumHomePage /> : <HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <ThemeSwitcher />
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CurrencyProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
