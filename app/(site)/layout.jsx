import Navbar from "@/components/Navbar";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
