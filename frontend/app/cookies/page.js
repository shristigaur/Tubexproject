import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | TubeX",
};

export default function CookiesPage() {
  return (
    <main className="container-x max-w-[800px] py-16">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} className="mr-2" />
        Back to home
      </Link>
      
      <h1 className="display mt-8 text-4xl font-black">Cookie Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-2xl font-bold">1. What Are Cookies?</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites function properly, enhance the user experience, and provide analytical information to the site owners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. How TubeX Uses Cookies</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            TubeX uses cookies primarily for essential platform functionalities. These include keeping you logged in securely, managing your session during checkout or listing creation, and ensuring cross-site request forgery (CSRF) protection.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Without these essential cookies, our marketplace cannot function properly, and you would not be able to authenticate or perform secure transactions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Analytical and Performance Cookies</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            We may use performance cookies to understand how users interact with our platform. This helps us identify popular features, fix errors, and optimize the overall speed and usability of TubeX.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. How to Manage Cookies</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Most web browsers allow you to control cookies through their settings preferences. You can choose to block all cookies or receive a warning before a cookie is stored. However, please note that blocking essential cookies will prevent you from logging into TubeX.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            For more information on managing your browser settings, please refer to your browser's official documentation. If you have any further questions, you can contact us at support@tubex.com.
          </p>
        </section>
      </div>
    </main>
  );
}
