import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | TubeX",
};

export default function PrivacyPage() {
  return (
    <main className="container-x max-w-[800px] py-16">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} className="mr-2" />
        Back to home
      </Link>
      
      <h1 className="display mt-8 text-4xl font-black">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-2xl font-bold">1. Data We Collect</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            When you use TubeX, we collect personal information you provide to us, such as your name, email address, and Google sign-in data. We also collect information about your channel listings and transaction history.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Additionally, we may collect technical data such as IP addresses and browser information to ensure the security and functionality of our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            We use your data to provide, improve, and secure our services. This includes facilitating transactions between buyers and sellers, verifying user identities, and sending important account notifications.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            We do not sell your personal data to third parties. Your channel performance data is only shared with potential buyers as per your listing settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Data Security</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. We use secure encryption for sensitive data such as authentication tokens.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Your User Rights</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            You have the right to access, update, or delete your personal information at any time. You can manage your data preferences through your account settings or by contacting our support team.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. Contact Information</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            If you have any questions or concerns regarding our privacy practices or how we handle your data, please reach out to us at support@tubex.com.
          </p>
        </section>
      </div>
    </main>
  );
}
