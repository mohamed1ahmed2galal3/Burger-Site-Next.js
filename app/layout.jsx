import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Last Burger | اطلب برجرك دلوقتي",
  description: "موقع Last Burger - اطلب أكلك المفضل بسهولة وسرعة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-zinc-950 min-h-screen text-white">
        <CartProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#fff",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "inherit",
              },
              success: {
                iconTheme: { primary: "#f97316", secondary: "#fff" },
              },
            }}
          />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
