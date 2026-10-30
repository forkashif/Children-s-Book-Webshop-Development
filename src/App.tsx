import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.js';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext.js';
import { NoticeBanner } from './components/NoticeBanner.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';

import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { OrderTrackingPage } from './pages/OrderTrackingPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { PODCraftPage } from './pages/PODCraftPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { FAQPage } from './pages/FAQPage.js';
import { ShippingReturnsPage, PrivacyPolicyPage, TermsPage } from './pages/PolicyPages.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';

import type { Book, StoreSettings } from './types/store.js';

function AppContent() {
  const { isAuthenticated } = useAdminAuth();

  // Navigation state (supports hash routing / URL paths)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookSlug, setSelectedBookSlug] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Parse path and query params
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch books & store settings on mount
  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBooks(data);
      })
      .catch(console.error);

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  // Route: Book detail view helper
  const handleSelectBook = (slug: string) => {
    setSelectedBookSlug(slug);
    navigate(`/book/${slug}`);
  };

  // If user navigates directly to /book/:slug
  useEffect(() => {
    if (currentPath.startsWith('/book/')) {
      const slug = currentPath.replace('/book/', '');
      setSelectedBookSlug(slug);
    }
  }, [currentPath]);

  // Route: Order Confirmation URL parser
  useEffect(() => {
    if (currentPath === '/order-confirmation') {
      const params = new URLSearchParams(window.location.search);
      const ordId = params.get('order_id');
      if (ordId) setConfirmedOrderId(ordId);
    }
  }, [currentPath]);

  const activeBook = selectedBookSlug 
    ? books.find(b => b.slug === selectedBookSlug || b.id === selectedBookSlug) 
    : null;

  // Track page query params
  const searchParams = new URLSearchParams(window.location.search);
  const trackOrderId = searchParams.get('order_id') || '';
  const trackEmail = searchParams.get('email') || '';

  // Admin routing check
  if (currentPath.startsWith('/admin')) {
    if (isAuthenticated) {
      return <AdminDashboardPage onNavigateHome={() => navigate('/')} />;
    } else {
      return (
        <AdminLoginPage
          onLoginSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E2538] font-sans">
      
      {/* 1. Dismissible Top Announcement Banner */}
      {settings?.notice_banner_active !== false && (
        <NoticeBanner text={settings?.notice_banner_text} />
      )}

      {/* 2. Top Bar Contract Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
      />

      {/* 3. Slide-out Cart Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* 4. Main Page Body */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            books={books}
            onNavigate={navigate}
            onSelectBook={handleSelectBook}
          />
        )}

        {currentPath === '/shop' && (
          <ShopPage
            books={books}
            onSelectBook={handleSelectBook}
          />
        )}

        {currentPath.startsWith('/book/') && activeBook && (
          <ProductDetailPage
            book={activeBook}
            allBooks={books}
            onSelectBook={handleSelectBook}
            onNavigate={navigate}
          />
        )}

        {currentPath === '/cart' && (
          <CartPage onNavigate={navigate} />
        )}

        {currentPath === '/checkout' && (
          <CheckoutPage
            onOrderSuccess={(ordId) => {
              setConfirmedOrderId(ordId);
              navigate(`/order-confirmation?order_id=${ordId}`);
            }}
            onNavigate={navigate}
          />
        )}

        {currentPath === '/order-confirmation' && (
          <OrderConfirmationPage
            orderId={confirmedOrderId || 'ST-2026-9042'}
            onNavigate={navigate}
          />
        )}

        {currentPath === '/track' && (
          <OrderTrackingPage
            initialOrderId={trackOrderId}
            initialEmail={trackEmail}
          />
        )}

        {currentPath === '/about' && (
          <AboutPage onNavigate={navigate} />
        )}

        {currentPath === '/pod-craft' && (
          <PODCraftPage onNavigate={navigate} />
        )}

        {currentPath === '/contact' && (
          <ContactPage />
        )}

        {currentPath === '/faq' && (
          <FAQPage />
        )}

        {currentPath === '/shipping-returns' && (
          <ShippingReturnsPage />
        )}

        {currentPath === '/privacy' && (
          <PrivacyPolicyPage />
        )}

        {currentPath === '/terms' && (
          <TermsPage />
        )}
      </main>

      {/* 5. Storybook Brand Footer */}
      <Footer onNavigate={navigate} />

    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminAuthProvider>
  );
}
