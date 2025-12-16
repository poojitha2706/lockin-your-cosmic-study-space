-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'private')),
  code TEXT UNIQUE,
  max_participants INTEGER NOT NULL DEFAULT 10,
  participant_count INTEGER NOT NULL DEFAULT 0,
  host_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Anyone can view all rooms (needed for code lookups)
CREATE POLICY "Rooms are viewable by everyone"
ON public.rooms
FOR SELECT
USING (true);

-- Anyone can create rooms
CREATE POLICY "Anyone can create rooms"
ON public.rooms
FOR INSERT
WITH CHECK (true);

-- Room host can update their rooms
CREATE POLICY "Host can update their rooms"
ON public.rooms
FOR UPDATE
USING (true);

-- Room host can delete their rooms
CREATE POLICY "Host can delete their rooms"
ON public.rooms
FOR DELETE
USING (host_id = auth.uid() OR host_id IS NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for code lookups
CREATE INDEX idx_rooms_code ON public.rooms(code) WHERE code IS NOT NULL;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;