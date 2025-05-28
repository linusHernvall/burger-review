-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read posts (public access)
CREATE POLICY "Allow public read access" ON posts
    FOR SELECT
    USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Allow authenticated users to create posts" ON posts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow users to update their own posts
CREATE POLICY "Allow users to update their own posts" ON posts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Allow users to delete their own posts" ON posts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Add user_id column if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Set up trigger to automatically set user_id on insert
CREATE OR REPLACE FUNCTION public.handle_new_post()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_created
    BEFORE INSERT ON posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_post(); 