-- Enable RLS on all user-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- For Stack Auth, we'll use application-level security instead of database RLS
-- since Stack Auth manages authentication at the application layer.
-- We'll keep the tables without RLS for now and implement security in the API layer.

-- Note: If you want to use RLS with Stack Auth, you would need to:
-- 1. Set up a custom auth context in PostgreSQL
-- 2. Create a way to pass the authenticated user ID to database queries
-- 3. Use that context in RLS policies

-- For now, we'll disable RLS and implement security at the application level
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotas DISABLE ROW LEVEL SECURITY;
ALTER TABLE generations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Create a function to handle Stack Auth user creation
-- This function will be called by a webhook or trigger when a user signs up
CREATE OR REPLACE FUNCTION create_user_with_quotas(
  user_id uuid,
  user_email text,
  user_name text DEFAULT NULL
) 
RETURNS void AS $$
BEGIN
  -- Insert user record
  INSERT INTO users (id, email, name) 
  VALUES (user_id, user_email, user_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = now();
  
  -- Create default quotas for each generation type
  INSERT INTO quotas (user_id, generation_type, daily_limit, monthly_limit) 
  VALUES 
    (user_id, 'IMAGE', 10, 250),
    (user_id, 'VIDEO', 2, 20),
    (user_id, 'MUSIC', 3, 30)
  ON CONFLICT DO NOTHING;
  
  -- Create initial usage tracking records
  INSERT INTO user_usage (user_id, type, count, last_used)
  VALUES 
    (user_id, 'IMAGE', 0, now()),
    (user_id, 'VIDEO', 0, now()),
    (user_id, 'MUSIC', 0, now())
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can generate content (quota check)
CREATE OR REPLACE FUNCTION check_generation_quota(
  user_id uuid,
  gen_type generation_type
) 
RETURNS boolean AS $$
DECLARE
  quota_record quotas%ROWTYPE;
BEGIN
  -- Get quota record for user and generation type
  SELECT * INTO quota_record 
  FROM quotas 
  WHERE user_id = check_generation_quota.user_id 
    AND generation_type = gen_type;
  
  -- Check if quota exists
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check daily and monthly limits
  IF quota_record.daily_used >= quota_record.daily_limit OR 
     quota_record.monthly_used >= quota_record.monthly_limit THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment usage after successful generation
CREATE OR REPLACE FUNCTION increment_usage(
  user_id uuid,
  gen_type generation_type
) 
RETURNS void AS $$
BEGIN
  -- Update quota usage
  UPDATE quotas 
  SET daily_used = daily_used + 1,
      monthly_used = monthly_used + 1
  WHERE user_id = increment_usage.user_id 
    AND generation_type = gen_type;
  
  -- Update user usage stats
  UPDATE user_usage 
  SET count = count + 1,
      last_used = now()
  WHERE user_id = increment_usage.user_id 
    AND type = gen_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset daily quotas (to be called by scheduled job)
CREATE OR REPLACE FUNCTION reset_daily_quotas() 
RETURNS void AS $$
BEGIN
  UPDATE quotas 
  SET daily_used = 0,
      last_reset = now()
  WHERE DATE(last_reset) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset monthly quotas (to be called by scheduled job)
CREATE OR REPLACE FUNCTION reset_monthly_quotas() 
RETURNS void AS $$
BEGIN
  UPDATE quotas 
  SET monthly_used = 0,
      last_reset = now()
  WHERE DATE_TRUNC('month', last_reset) < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log function
CREATE OR REPLACE FUNCTION log_action(
  user_id uuid,
  action_name text,
  input_data text,
  status_result text,
  user_ip text DEFAULT NULL,
  system_info text DEFAULT NULL
) 
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, input, status, ip, system)
  VALUES (user_id, action_name, input_data, status_result, user_ip, system_info);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;