import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { Layout } from "@/components/Layout";
import { CreateCategoryDialog } from "@/components/CreateCategoryDialog";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowRight, Trash2, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const { data: categories, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <section className="mb-12 text-center space-y-4 pt-10 pb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight"
        >
          Visualize Your Text Data
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Upload text entries, visualize frequency distributions, and normalize data by merging terms. 
          Simple, fast, and beautiful.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <CreateCategoryDialog />
        </motion.div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {categories?.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border">
              <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <PieChart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">Create your first analysis project to get started.</p>
            </div>
          ) : (
            categories?.map((category) => (
              <motion.div key={category.id} variants={item}>
                <Card className="group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border/50 rounded-2xl h-full flex flex-col overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                    <CardTitle className="font-display text-xl line-clamp-1">{category.name}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[2.5em]">
                      {category.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6 flex justify-between items-center border-t border-border/30 bg-card">
                    <div className="text-xs text-muted-foreground font-medium">
                      {category.createdAt && format(new Date(category.createdAt), "MMM d, yyyy")}
                    </div>
                    
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{category.name}" and all its data entries. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Link href={`/analysis/${category.id}`}>
                        <Button size="sm" className="rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Open <ArrowRight className="ml-2 w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </Layout>
  );
}
