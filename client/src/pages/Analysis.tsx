import { useRoute } from "wouter";
import { useCategory, useCategoryDistribution } from "@/hooks/use-categories";
import { Layout } from "@/components/Layout";
import { DistributionChart } from "@/components/DistributionChart";
import { AddDataPanel } from "@/components/AddDataPanel";
import { MergeTermsPanel } from "@/components/MergeTermsPanel";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Analysis() {
  const [, params] = useRoute("/analysis/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: category, isLoading: isLoadingCategory } = useCategory(id);
  const { data: distribution, isLoading: isLoadingDist } = useCategoryDistribution(id);

  if (isLoadingCategory) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Category not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/50"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-1 text-lg">{category.description}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-md">
            ID: #{category.id}
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <DistributionChart data={distribution} isLoading={isLoadingDist} />
          </motion.div>

          {/* Right Column: Tools */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 flex flex-col"
          >
            <div className="flex-none">
              <AddDataPanel categoryId={id} />
            </div>
            <div className="flex-1">
              <MergeTermsPanel categoryId={id} />
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
