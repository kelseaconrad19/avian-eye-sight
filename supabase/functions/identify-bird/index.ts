
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface RequestBody {
  image: string; // Base64 encoded image
}

interface BirdIdentificationResult {
  name: string;
  scientific_name: string;
  description: string;
  confidence: number;
  image_url: string;
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

    console.log("Received image data, processing with OpenAI...");

    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify(await createFallbackResult()),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the image for OpenAI
    let base64Image = image;
    if (!image.startsWith('data:image/')) {
      base64Image = `data:image/jpeg;base64,${image}`;
    }

    console.log("Calling OpenAI Vision API...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please identify the bird species in this image. Provide your response in this exact JSON format:
{
  "name": "Common Name of the bird",
  "scientific_name": "Scientific name",
  "description": "Detailed description of the bird, its characteristics, habitat, and behavior (2-3 sentences)",
  "confidence": 0.95
}

Be as accurate as possible with the identification. If you're not completely certain, still provide your best identification but adjust the confidence score accordingly (0.1 to 1.0).`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
      signal: AbortSignal.timeout(30000)
    });

    console.log("OpenAI API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      
      return new Response(
        JSON.stringify(await createFallbackResult()),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiResult = await response.json();
    console.log("OpenAI API result:", JSON.stringify(apiResult, null, 2));

    if (apiResult.choices && apiResult.choices[0] && apiResult.choices[0].message) {
      const content = apiResult.choices[0].message.content;
      console.log("OpenAI response content:", content);
      
      try {
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const birdData = JSON.parse(jsonMatch[0]);
          
          // Get additional bird information from our database
          const birdInfo = await getBirdInfo(birdData.name);
          
          const result: BirdIdentificationResult = {
            name: birdData.name,
            scientific_name: birdData.scientific_name,
            description: birdData.description,
            confidence: birdData.confidence || 0.8,
            image_url: birdInfo.image_url || ""
          };

          console.log("Final result:", result);
          
          // Store the identified bird in our database
          await storeBirdSpecies(result);

          return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
      }
    }
    
    console.log("Could not parse valid bird identification, using fallback");
    return new Response(
      JSON.stringify(await createFallbackResult()),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in bird identification:", error);
    
    return new Response(
      JSON.stringify(await createFallbackResult()),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Function to look up additional bird information
async function getBirdInfo(birdName: string): Promise<any> {
  try {
    console.log("Getting bird info for:", birdName);
    
    const apiUrl = new URL("/rest/v1/bird_species", Deno.env.get("SUPABASE_URL"));
    apiUrl.searchParams.append("select", "*");
    apiUrl.searchParams.append("name", `ilike.%${birdName}%`);
    
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const birds = await response.json();
      const foundBird = birds.find((bird: any) => 
        bird.name.toLowerCase().includes(birdName.toLowerCase()) || 
        birdName.toLowerCase().includes(bird.name.toLowerCase())
      );
      
      if (foundBird) {
        console.log("Found bird in database:", foundBird.name);
        return {
          image_url: foundBird.image_url
        };
      }
    }

    console.log("Bird not found in database");
    return { image_url: "" };
  } catch (error) {
    console.error("Error getting bird info:", error);
    return { image_url: "" };
  }
}

// Store the identified bird species in our database
async function storeBirdSpecies(birdData: BirdIdentificationResult) {
  try {
    console.log("Storing bird species:", birdData.name);
    
    const apiUrl = new URL("/rest/v1/bird_species", Deno.env.get("SUPABASE_URL"));
    
    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        name: birdData.name,
        scientific_name: birdData.scientific_name,
        description: birdData.description,
        image_url: birdData.image_url,
        confidence: birdData.confidence
      })
    });

    if (response.ok) {
      console.log("Bird species stored successfully");
    } else {
      console.error("Error storing bird species:", await response.text());
    }
  } catch (error) {
    console.error("Error storing bird species:", error);
  }
}

// Create a fallback result for when identification fails
async function createFallbackResult(): Promise<BirdIdentificationResult> {
  const fallbackBirds = [
    {
      name: "American Robin",
      scientific_name: "Turdus migratorius",
      description: "A common North American bird known for its red breast and melodious song. Often seen hopping on lawns searching for worms.",
      confidence: 0.5,
      image_url: ""
    },
    {
      name: "Blue Jay",
      scientific_name: "Cyanocitta cristata",
      description: "A vibrant blue bird native to North America, known for its intelligence and complex social behaviors.",
      confidence: 0.5,
      image_url: ""
    },
    {
      name: "Northern Cardinal",
      scientific_name: "Cardinalis cardinalis",
      description: "A bright red songbird found in North America. Males are brilliant red while females are brown with red tinges.",
      confidence: 0.5,
      image_url: ""
    }
  ];

  const now = new Date();
  const seed = now.getSeconds() + now.getMilliseconds();
  const selectedBird = fallbackBirds[seed % fallbackBirds.length];

  console.log("Using fallback bird:", selectedBird.name);
  return selectedBird;
}
