-- Add subscription fields to profiles table for Paymob
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS paymob_customer_id TEXT,
ADD COLUMN IF NOT EXISTS paymob_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS daily_question_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_question_reset TIMESTAMPTZ DEFAULT NOW();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_paymob_customer_id ON profiles(paymob_customer_id);

-- Create payments table for Paymob
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  paymob_transaction_id TEXT UNIQUE NOT NULL,
  paymob_order_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in piasters (EGP cents)
  currency TEXT DEFAULT 'EGP',
  status TEXT NOT NULL,
  subscription_tier TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  payment_method TEXT, -- card, wallet, installments, fawry
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indices for payments table
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_paymob_order_id ON payments(paymob_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

-- Create policy for users to view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for admins to view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payments table
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment daily question count with automatic reset
CREATE OR REPLACE FUNCTION increment_daily_questions(user_id UUID)
RETURNS void AS $$
DECLARE
  last_reset TIMESTAMPTZ;
BEGIN
  -- Get the last reset time
  SELECT last_question_reset INTO last_reset
  FROM profiles
  WHERE id = user_id;

  -- Check if we need to reset (more than 24 hours since last reset)
  IF last_reset IS NULL OR (NOW() - last_reset) > INTERVAL '24 hours' THEN
    -- Reset the count
    UPDATE profiles
    SET daily_question_count = 1,
        last_question_reset = NOW()
    WHERE id = user_id;
  ELSE
    -- Just increment
    UPDATE profiles
    SET daily_question_count = daily_question_count + 1
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to manually reset daily question counts (for testing or admin use)
CREATE OR REPLACE FUNCTION reset_daily_questions()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET daily_question_count = 0,
      last_question_reset = NOW()
  WHERE (NOW() - last_question_reset) > INTERVAL '24 hours'
     OR last_question_reset IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
