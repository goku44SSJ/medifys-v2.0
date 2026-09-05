import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search, ShoppingCart, Truck, Sparkles, Package } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Form";
import { useStore } from "@/store/useStore";
import { pharmacyProviders, priceHistory } from "@/lib/mock-data";

export function Pharmacy() {
  const [query, setQuery] = useState("Paracetamol 500mg");
  const [searched, setSearched] = useState("Paracetamol 500mg");
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);

  const bestPrice = Math.min(...pharmacyProviders.filter((p) => p.inStock).map((p) => p.price));

  function search(e: React.FormEvent) {
    e.preventDefault();
    setSearched(query);
    toast.success(`Showing prices for "${query}"`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Pharmacy</h2>
          <p className="text-ink-500 dark:text-ink-400">Compare medicine prices across providers.</p>
        </div>
        {cart.length > 0 && (
          <Badge tone="vital">
            <ShoppingCart size={12} /> {cart.length} in cart
          </Badge>
        )}
      </div>

      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search a medicine…" />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div>
        <p className="mb-3 text-sm text-ink-500 dark:text-ink-400">
          Comparing <span className="font-medium text-ink-900 dark:text-ink-50">{searched}</span> across {pharmacyProviders.length} providers
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pharmacyProviders.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={p.price === bestPrice && p.inStock ? "ring-2 ring-clover-500" : ""}>
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{p.name}</p>
                    {p.price === bestPrice && p.inStock && (
                      <Badge tone="clover">
                        <Sparkles size={11} /> Best price
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">
                      ₹{p.price}
                      {p.discountPct > 0 && <span className="ml-2 text-sm font-normal text-clover-600">-{p.discountPct}%</span>}
                    </p>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-ink-400">
                    <Truck size={12} /> {p.deliveryEta}
                  </p>
                  <Badge tone={p.inStock ? "neutral" : "coral"}>
                    <Package size={11} /> {p.inStock ? "In stock" : "Out of stock"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast(`Viewing ${p.name}`)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={!p.inStock}
                      onClick={() => {
                        addToCart({ medicineName: searched, providerName: p.name, price: p.price });
                        toast.success(`Added ${searched} to cart`, { description: `From ${p.name}` });
                      }}
                    >
                      Add to cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent>
          <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Price history — {searched}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip formatter={(v: number) => [`₹${v}`, "Price"]} />
              <Line type="monotone" dataKey="price" stroke="#3F79D6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
