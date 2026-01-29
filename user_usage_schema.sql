-- Create user_usage table to track daily message limits
CREATE TABLE IF NOT EXISTS user_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  messages_sent_today integer default 0 not null,
  last_reset_date date default current_date not null,
  is_subscribed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);

-- Enable RLS
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own usage" ON user_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON user_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON user_usage;

-- Create RLS policies
CREATE POLICY "Users can view their own usage" ON user_usage
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own usage" ON user_usage
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own usage" ON user_usage
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Function to check and reset daily count if needed
CREATE OR REPLACE FUNCTION check_and_reset_daily_usage(p_user_id uuid)
RETURNS TABLE(messages_sent integer, is_subscribed boolean, needs_reset boolean) AS $$
DECLARE
  v_usage RECORD;
  v_needs_reset boolean := false;
BEGIN
  -- Get or create user usage record
  INSERT INTO user_usage (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current usage
  SELECT * INTO v_usage
  FROM user_usage
  WHERE user_id = p_user_id;
  
  -- Check if we need to reset (new day)
  IF v_usage.last_reset_date < current_date THEN
    v_needs_reset := true;
    
    -- Reset the count
    UPDATE user_usage
    SET messages_sent_today = 0,
        last_reset_date = current_date,
        updated_at = now()
    WHERE user_id = p_user_id;
    
    RETURN QUERY SELECT 0, v_usage.is_subscribed, v_needs_reset;
  ELSE
    RETURN QUERY SELECT v_usage.messages_sent_today, v_usage.is_subscribed, v_needs_reset;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  v_new_count integer;
BEGIN
  UPDATE user_usage
  SET messages_sent_today = messages_sent_today + 1,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING messages_sent_today INTO v_new_count;
  
  RETURN v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
