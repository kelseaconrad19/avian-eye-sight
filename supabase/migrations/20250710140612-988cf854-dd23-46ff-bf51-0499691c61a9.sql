-- Update RLS policies for bird_species to allow authenticated users to insert
DROP POLICY "Allow administrators to modify bird species" ON public.bird_species;

-- Create new policies that allow authenticated users to insert bird species
CREATE POLICY "Allow authenticated users to insert bird species" 
ON public.bird_species 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow administrators to update bird species" 
ON public.bird_species 
FOR UPDATE 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Allow administrators to delete bird species" 
ON public.bird_species 
FOR DELETE 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);