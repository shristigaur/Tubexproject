export default function ExploreChannelsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">TubeX</div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="text-slate-900">Marketplace</a>
          <a href="#">Saved</a>
          <a href="#">Messages</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">Verification Pending</div>
          <div className="h-8 w-8 bg-slate-900 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Discover YouTube channels built for your next opportunity.</h1>
          <p className="text-slate-500 text-lg max-w-2xl">Explore verified channels, compare audience metrics, revenue, category, and asking price in one secure marketplace.</p>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore YouTube Channels</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-medium text-blue-600 mb-2">Gaming</div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Epic Gamer TV</h3>
            <div className="text-slate-500 text-sm mb-4">United States</div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-slate-400 font-medium">SUBSCRIBERS</div>
                <div className="font-semibold text-slate-900">1.2M</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">REVENUE</div>
                <div className="font-semibold text-slate-900">$4,500/mo</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="font-bold text-lg text-slate-900">$120,000</div>
              <button className="text-sm font-semibold text-slate-900 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200">View Details</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
