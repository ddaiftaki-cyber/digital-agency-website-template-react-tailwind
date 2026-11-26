import { lazy, Suspense, useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import BackToTop from "@/components/back-to-top";
import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "sonner";
import Loading from "@/components/loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface SiteConfig {
  brandName: string;
  primaryColor: string;
  price: string;
  pixelId: string;
  heroTitle: string;
  heroSubtitle: string;
  features: string[];
}

const defaultConfig: SiteConfig = {
  brandName: "Projex Agency",
  primaryColor: "#2563eb",
  price: "",
  pixelId: "",
  heroTitle: "",
  heroSubtitle: "",
  features: [],
};

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);
export const useSiteConfig = () => useContext(SiteConfigContext);

const Header = lazy(() => import("@/components/layout/header"));
const Footer = lazy(() => import("@/components/layout/footer"));
const HeaderLayout2 = lazy(() => import("@/components/layout/header-layout-2"));
const FooterLayout2 = lazy(() => import("@/components/layout/footer-layout-2"));
const Home = lazy(() => import("./pages/home"));
const HomeSEOAgency = lazy(() => import("./pages/home-seo-agency"));
const HomeConsulting = lazy(() => import("./pages/home-consulting"));
const Projects = lazy(() => import("./pages/projects"));
const Blog = lazy(() => import("./pages/blog"));
const SinglePost = lazy(() => import("./pages/single-post"));
const SingleProject = lazy(() => import("./pages/single-project"));
const About = lazy(() => import("./pages/about"));
const Services = lazy(() => import("./pages/services"));
const Pricing = lazy(() => import("./pages/pricing"));
const Contact = lazy(() => import("./pages/contact"));
const NotFound = lazy(() => import("./pages/not-found"));

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    fetch("/site-config.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === "object") {
          const merged: SiteConfig = {
            brandName: data.brandName || defaultConfig.brandName,
            primaryColor: data.primaryColor || defaultConfig.primaryColor,
            price: data.price || "",
            pixelId: data.pixelId || "",
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
            features: Array.isArray(data.features) ? data.features : [],
          };
          setSiteConfig(merged);
          if (merged.brandName) {
            document.title = merged.brandName;
          }
          if (merged.primaryColor) {
            document.documentElement.style.setProperty("--primary", merged.primaryColor);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SiteConfigContext.Provider value={siteConfig}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading />}>
          {location.pathname === "/consulting" ? <HeaderLayout2 /> : <Header />}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index element={<Home />} />
              <Route path="/seo-agency" element={<HomeSEOAgency />} />
              <Route path="/consulting" element={<HomeConsulting />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/single-post" element={<SinglePost />} />
              <Route path="/single-project" element={<SingleProject />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          {location.pathname === "/consulting" ? <FooterLayout2 /> : <Footer />}
          <Toaster richColors />
          <BackToTop />
          <ScrollToTop />
        </Suspense>
      </QueryClientProvider>
    </SiteConfigContext.Provider>
  );
}

export default App;
