export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">TubeX</div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="text-slate-900">My Channels</a>
          <a href="#">Listings</a>
          <a href="#">Inquiries</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">Verified Seller</div>
          <div className="h-8 w-8 bg-slate-900 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <div className="bg-slate-900 rounded-3xl p-10 shadow-sm mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Manage and grow your YouTube listings</h1>
            <p className="text-slate-400 text-lg max-w-2xl">List your channel, verify ownership, and connect with qualified buyers.</p>
          </div>
          <button className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition shadow-sm whitespace-nowrap">
            + List a Channel
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-6">My YouTube Channels</h2>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-slate-400 mb-2">You don't have any active listings yet.</div>
          <button className="text-sm font-semibold text-slate-900 underline">Start verification to list a channel</button>
        </div>
      </main>
    </div>
  );
}
