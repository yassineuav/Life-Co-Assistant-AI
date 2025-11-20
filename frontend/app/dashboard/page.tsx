export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold mb-2">Quick actions</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <a className="px-3 py-2 bg-blue-100 rounded" href="/fridge">Add pantry items</a>
            <a className="px-3 py-2 bg-green-100 rounded" href="/meals/suggest">Generate meals</a>
            <a className="px-3 py-2 bg-purple-100 rounded" href="/meals/plan">View plan</a>
          </div>
        </div>
        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold mb-2">This week</h2>
          <p className="text-sm text-gray-600">Keep adding pantry items and we will build your plan.</p>
        </div>
      </div>
    </section>
  )
}
