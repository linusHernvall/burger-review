-- Add user_id column if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON posts;
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON posts;
DROP POLICY IF EXISTS "Allow users to update their own posts" ON posts;
DROP POLICY IF EXISTS "Allow users to delete their own posts" ON posts;

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read posts
CREATE POLICY "Allow public read access" ON posts
    FOR SELECT
    USING (true);

-- Only authenticated users can create posts
CREATE POLICY "Allow authenticated users to create posts" ON posts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Users can only update their own posts
CREATE POLICY "Allow users to update their own posts" ON posts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own posts
CREATE POLICY "Allow users to delete their own posts" ON posts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_post()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_post_created ON posts;

-- Create trigger
CREATE TRIGGER on_post_created
    BEFORE INSERT ON posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_post(); 