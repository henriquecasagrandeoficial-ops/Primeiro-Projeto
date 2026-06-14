import { Heart, MessageSquare, Package, Star, Vote } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import { useProducts } from "@/hooks/useProducts";
import { useVotes } from "@/hooks/useVotes";
import { useAppStore } from "@/store/appStore";
import type { ProductCategory, ProductStatus } from "@/types";

const categoryList: ProductCategory[] = ["Bolos", "Doces", "Sobremesas", "Salgados"];
const statusList: ProductStatus[] = ["available", "sold_out", "inactive"];
const colors = ["#6b3f23", "#c79a4b", "#e8b9ad"];
const chartGrid = "#e9dcc7";
const chartAxis = "#8a7359";

export function AdminDashboard() {
  const { data: products = [] } = useProducts();
  const { data: votes = [] } = useVotes();
  const { data: feedbacks = [] } = useFeedbacks();
  const favoriteProductIds = useAppStore((state) => state.favoriteProductIds);

  const totalVotes = votes
    .flatMap((vote) => vote.options)
    .reduce((sum, option) => sum + option.votes, 0);
  const topOption = votes
    .flatMap((vote) => vote.options)
    .sort((a, b) => b.votes - a.votes)[0];
  const categoryData = categoryList.map((category) => ({
    name: category,
    produtos: products.filter((product) => product.category === category).length,
  }));
  const statusData = statusList.map((status) => ({
    name:
      status === "available"
        ? "Disponível"
        : status === "sold_out"
          ? "Esgotado"
          : "Inativo",
    value: products.filter((product) => product.status === status).length,
  }));
  const topViewedProducts = [...products]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard Administrativo"
        description="Visão consolidada dos produtos, votações e feedbacks da doceria."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total de produtos" value={products.length} icon={<Package />} />
        <StatCard
          title="Produtos ativos"
          value={products.filter((product) => product.status === "available").length}
          icon={<Star />}
        />
        <StatCard title="Total de votos" value={totalVotes} icon={<Vote />} />
        <StatCard
          title="Feedbacks recebidos"
          value={feedbacks.length}
          icon={<MessageSquare />}
        />
        <StatCard
          title="Mais votado"
          value={topOption?.productName ?? "-"}
          icon={<Vote />}
          helper={`${topOption?.votes ?? 0} votos`}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard title="Produtos favoritos" value={favoriteProductIds.length} icon={<Heart />} />
        <StatCard
          title="Visualizações registradas"
          value={products.reduce((sum, product) => sum + (product.views ?? 0), 0)}
          icon={<Star />}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produtos por categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                <XAxis dataKey="name" stroke={chartAxis} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke={chartAxis} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(199,154,75,0.1)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e9dcc7",
                    boxShadow: "0 10px 30px -14px rgba(58,36,18,0.18)",
                  }}
                />
                <Bar dataKey="produtos" fill="#6b3f23" radius={[8, 8, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos produtos</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={108} paddingAngle={3} label>
                  {statusData.map((item, index) => (
                    <Cell key={item.name} fill={colors[index % colors.length]} stroke="#fffdfa" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e9dcc7",
                    boxShadow: "0 10px 30px -14px rgba(58,36,18,0.18)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos mais visualizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topViewedProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-semibold">
                    {index + 1}. {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <strong className="text-primary">
                  {product.views ?? 0} views
                </strong>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
