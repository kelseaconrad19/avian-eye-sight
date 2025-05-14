
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const BIRD_API_ENDPOINT = "https://api.inaturalist.org/v1/identifications";

interface RequestBody {
  image: string; // Base64 encoded image
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image } = await req.json() as RequestBody;
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For now, we'll use a more sophisticated mock service
    // In a real implementation, you would send the image to a specialized API
    const birdData = await identifyBirdFromImage(image);

    return new Response(
      JSON.stringify(birdData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// This is a more sophisticated mock identification that would be replaced 
// with a real API call to a bird identification service
async function identifyBirdFromImage(imageBase64: string): Promise<any> {
  // In a real implementation, you would call an external API here
  const birds = [
    {
      name: "European Robin",
      scientific_name: "Erithacus rubecula",
      description: "A small insectivorous passerine bird that belongs to the chat subfamily of the Old World flycatcher family. It's known for its orange-red breast.",
      confidence: 0.92,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Erithacus_rubecula_with_cocked_head.jpg"
    },
    {
      name: "Eurasian Chaffinch",
      scientific_name: "Fringilla coelebs",
      description: "A common and widespread small passerine bird in the finch family. The male is brightly colored with a blue-grey cap and rust-red underparts.",
      confidence: 0.89,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Chaffinch_%28Fringilla_coelebs%29.jpg"
    },
    {
      name: "Great Tit",
      scientific_name: "Parus major",
      description: "A passerine bird in the tit family Paridae. It's a widespread and common species throughout Europe, the Middle East, Central Asia and east across the Palearctic.",
      confidence: 0.87,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Great_tit_side-on.jpg"
    },
    {
      name: "Barn Swallow",
      scientific_name: "Hirundo rustica",
      description: "The most widespread species of swallow in the world. It's known for its distinctive forked tail and curved, pointed wings.",
      confidence: 0.78,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Barn_Swallow_%28Hirundo_rustica%29_%2816260846630%29.jpg"
    },
    {
      name: "Common Blackbird",
      scientific_name: "Turdus merula",
      description: "A species of true thrush. It's one of the most common birds in Europe, with males being entirely black with an orange-yellow beak.",
      confidence: 0.85,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Common_Blackbird.jpg"
    }
  ];

  // Get the first few characters of the image to create deterministic but seemingly random identification
  // This simulates that the same image will get the same identification
  const seed = imageBase64.slice(0, 10).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const selectedBird = birds[seed % birds.length];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return selectedBird;
}
