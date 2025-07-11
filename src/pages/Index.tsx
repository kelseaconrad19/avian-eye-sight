import { IdentifyPage } from "./IdentifyPage";
import { PageContainer } from "@/components/layout/PageContainer";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
const Index = () => {
  return <PageContainer className="max-w-5xl">
      <div className="relative mb-8 text-center mt-3">
        {/* Decorative leaf background */}
        <Leaf className="absolute -top-2 -right-4 h-24 w-24 text-leaf-500 opacity-20 rotate-12 hidden sm:block" />
        
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }}>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-700 mb-3">
            MamaBird Watch
          </h1>
          <p className="text-lg text-brand-600 font-body">
            Identify beautiful birds and track your sightings with love
          </p>
        </motion.div>
      </div>
      
      <IdentifyPage />
    </PageContainer>;
};
export default Index;