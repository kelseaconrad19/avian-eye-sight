-- Create table for Bible verses
CREATE TABLE public.bible_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  version TEXT DEFAULT 'NIV',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for scripture overlays (saving overlay compositions)
CREATE TABLE public.scripture_overlays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_image_url TEXT NOT NULL,
  edited_image_url TEXT,
  verse_id UUID REFERENCES public.bible_verses(id),
  custom_verse_text TEXT,
  overlay_settings JSONB NOT NULL DEFAULT '{}',
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripture_overlays ENABLE ROW LEVEL SECURITY;

-- Bible verses policies (public read access)
CREATE POLICY "Bible verses are viewable by everyone" 
ON public.bible_verses 
FOR SELECT 
USING (true);

-- Scripture overlays policies (user-specific)
CREATE POLICY "Users can view their own overlays" 
ON public.scripture_overlays 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own overlays" 
ON public.scripture_overlays 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own overlays" 
ON public.scripture_overlays 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own overlays" 
ON public.scripture_overlays 
FOR DELETE 
USING (user_id = auth.uid());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_scripture_overlays_updated_at
BEFORE UPDATE ON public.scripture_overlays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some popular Bible verses
INSERT INTO public.bible_verses (book, chapter, verse, text, version) VALUES
('Philippians', 4, 13, 'I can do all this through him who gives me strength.', 'NIV'),
('Jeremiah', 29, 11, 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.', 'NIV'),
('Romans', 8, 28, 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', 'NIV'),
('Psalm', 23, 1, 'The Lord is my shepherd, I lack nothing.', 'NIV'),
('John', 3, 16, 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'NIV'),
('Proverbs', 3, 5, 'Trust in the Lord with all your heart and lean not on your own understanding.', 'NIV'),
('Isaiah', 40, 31, 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', 'NIV'),
('Matthew', 19, 26, 'Jesus looked at them and said, "With man this is impossible, but with God all things are possible."', 'NIV'),
('Psalm', 46, 10, 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.', 'NIV'),
('1 Corinthians', 13, 4, 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', 'NIV');

-- Create storage bucket for edited images
INSERT INTO storage.buckets (id, name, public) VALUES ('scripture-overlays', 'scripture-overlays', true);

-- Storage policies for scripture overlays
CREATE POLICY "Scripture overlay images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'scripture-overlays');

CREATE POLICY "Users can upload their own scripture overlays" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'scripture-overlays' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own scripture overlays" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'scripture-overlays' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own scripture overlays" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'scripture-overlays' AND auth.uid()::text = (storage.foldername(name))[1]);