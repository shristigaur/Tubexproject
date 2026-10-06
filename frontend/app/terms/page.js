import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | TubeX",
};

export default function TermsPage() {
  return (
    <main className="container-x max-w-[800px] py-16">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} className="mr-2" />
        Back to home
      </Link>
      
      <h1 className="display mt-8 text-4xl font-black">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-2xl font-bold">1. Account Usage</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Welcome to TubeX. By creating an account, you agree to provide accurate and complete information. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            TubeX reserves the right to suspend or terminate accounts that violate our terms or engage in fraudulent activities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Listing Rules for Buyers and Sellers</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Sellers must ensure they have full legal ownership of any YouTube channel listed on TubeX. Listings must accurately represent the channel's metrics, audience, and revenue without any artificial manipulation.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Buyers agree to perform their own due diligence before making an offer. All communication and transactions should remain on the platform to ensure a transparent deal flow.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Payments and Deals</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            TubeX acts as a marketplace to facilitate deals between buyers and sellers. We strongly recommend using secure escrow services for all high-value transactions.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Any fees charged by TubeX are clearly outlined during the listing and offer stages. Payments are non-refundable unless otherwise specified in the deal agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Prohibited Activity</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Users may not engage in spam, market manipulation, or harassment on TubeX. Selling stolen channels, botting subscribers, or selling channels that violate YouTube's Terms of Service is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. Limitation of Liability and Contact</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            TubeX is not responsible for the performance or legal standing of channels after a transfer is completed. Our liability is limited to the extent permitted by law.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            If you have questions about these terms, please contact us at support@tubex.com.
          </p>
        </section>
      </div>
    </main>
  );
}
