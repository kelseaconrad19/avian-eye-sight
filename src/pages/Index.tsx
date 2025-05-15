
import { IdentifyPage } from "./IdentifyPage";
import { PageContainer } from "@/components/layout/PageContainer";

const Index = () => {
  return (
    <PageContainer className="max-w-5xl">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-maroon-700 mb-2">Welcome to BirdWatch</h1>
        <p className="text-maroon-600">Identify beautiful birds and track your sightings</p>
      </div>
      <IdentifyPage />
    </PageContainer>
  );
};

export default Index;
