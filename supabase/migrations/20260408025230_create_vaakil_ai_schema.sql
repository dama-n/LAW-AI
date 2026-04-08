/*
  # Vaakil AI - Complete Database Schema
  
  ## Overview
  This migration creates the complete database structure for Vaakil AI, 
  a legal AI SaaS platform for document drafting, legal research, and AI assistance.
  
  ## New Tables
  
  ### 1. profiles
  Extended user information and preferences
  - id (uuid, references auth.users)
  - full_name (text)
  - company_name (text, optional)
  - role (text: lawyer, individual, law_firm)
  - jurisdiction (text: state/country)
  - language_preference (text: en, hi)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### 2. subscriptions
  User subscription and payment tracking
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - plan (text: free, pro, team)
  - status (text: active, cancelled, expired)
  - queries_used (integer)
  - queries_limit (integer)
  - current_period_start (timestamptz)
  - current_period_end (timestamptz)
  - stripe_customer_id (text, optional)
  - stripe_subscription_id (text, optional)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### 3. chat_conversations
  AI chat conversation sessions
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - title (text)
  - jurisdiction (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### 4. chat_messages
  Individual messages in conversations
  - id (uuid, primary key)
  - conversation_id (uuid, references chat_conversations)
  - role (text: user, assistant)
  - content (text)
  - metadata (jsonb, optional: sources, citations)
  - created_at (timestamptz)
  
  ### 5. documents
  User-uploaded and generated documents
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - title (text)
  - type (text: contract, nda, agreement, analysis, custom)
  - file_url (text, optional)
  - content (text)
  - analysis_result (jsonb, optional: risks, suggestions, clauses)
  - status (text: draft, analyzing, completed)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### 6. legal_templates
  Pre-built legal document templates
  - id (uuid, primary key)
  - title (text)
  - description (text)
  - category (text: contract, agreement, notice, petition)
  - jurisdiction (text)
  - content (text, template with variables)
  - variables (jsonb, array of required variables)
  - is_public (boolean)
  - usage_count (integer)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  
  ### 7. document_generations
  Track document generation history
  - id (uuid, primary key)
  - user_id (uuid, references auth.users)
  - template_id (uuid, references legal_templates, optional)
  - document_id (uuid, references documents)
  - input_data (jsonb)
  - created_at (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Public templates visible to all authenticated users
  - Admin role can manage templates
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  company_name text,
  role text NOT NULL DEFAULT 'individual' CHECK (role IN ('lawyer', 'individual', 'law_firm', 'student')),
  jurisdiction text DEFAULT 'India',
  language_preference text DEFAULT 'en' CHECK (language_preference IN ('en', 'hi')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  queries_used integer DEFAULT 0,
  queries_limit integer DEFAULT 10,
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '30 days'),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Conversation',
  jurisdiction text DEFAULT 'India',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON chat_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON chat_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON chat_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own conversations"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'custom' CHECK (type IN ('contract', 'nda', 'agreement', 'notice', 'petition', 'analysis', 'custom')),
  file_url text,
  content text NOT NULL DEFAULT '',
  analysis_result jsonb DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create legal_templates table
CREATE TABLE IF NOT EXISTS legal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('contract', 'agreement', 'notice', 'petition', 'deed', 'affidavit', 'power_of_attorney', 'other')),
  jurisdiction text DEFAULT 'India',
  content text NOT NULL,
  variables jsonb DEFAULT '[]',
  is_public boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE legal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public templates"
  ON legal_templates FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Create document_generations table
CREATE TABLE IF NOT EXISTS document_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES legal_templates(id) ON DELETE SET NULL,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  input_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE document_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON document_generations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON document_generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_templates_category ON legal_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON legal_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON document_generations(user_id);

-- Insert sample legal templates
INSERT INTO legal_templates (title, description, category, jurisdiction, content, variables) VALUES
(
  'Non-Disclosure Agreement (NDA)',
  'A standard mutual non-disclosure agreement suitable for business partnerships and collaborations',
  'agreement',
  'India',
  'NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{date}} ("Effective Date")

BETWEEN:
{{party1_name}}, having its registered office at {{party1_address}} (hereinafter referred to as "First Party")

AND

{{party2_name}}, having its registered office at {{party2_address}} (hereinafter referred to as "Second Party")

WHEREAS the parties wish to explore a business opportunity of mutual interest and benefit, and in connection with this opportunity, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
   "Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly in writing, orally or by inspection of tangible objects.

2. NON-DISCLOSURE
   Each party agrees not to use the Confidential Information for any purpose except as may be reasonably necessary for {{purpose}}.

3. TERM
   This Agreement shall remain in effect for a period of {{duration}} from the Effective Date.

4. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

______________________          ______________________
{{party1_name}}                 {{party2_name}}
First Party                     Second Party',
  '["date", "party1_name", "party1_address", "party2_name", "party2_address", "purpose", "duration"]'
),
(
  'Employment Agreement',
  'Standard employment contract for hiring employees in India',
  'contract',
  'India',
  'EMPLOYMENT AGREEMENT

This Employment Agreement is made on {{date}}

BETWEEN:
{{company_name}}, a company incorporated under the Companies Act, having its registered office at {{company_address}} (hereinafter referred to as "the Employer")

AND

{{employee_name}}, residing at {{employee_address}} (hereinafter referred to as "the Employee")

1. EMPLOYMENT
   The Employer hereby employs the Employee as {{position}} and the Employee accepts such employment.

2. COMMENCEMENT DATE
   The employment shall commence on {{start_date}}.

3. SALARY
   The Employee shall be paid a monthly salary of INR {{salary}} ({{salary_words}}).

4. PROBATION PERIOD
   The Employee shall be on probation for a period of {{probation_period}} months.

5. DUTIES AND RESPONSIBILITIES
   {{job_description}}

6. WORKING HOURS
   The normal working hours shall be {{working_hours}} hours per week.

7. TERMINATION
   Either party may terminate this agreement by giving {{notice_period}} notice in writing.

8. CONFIDENTIALITY
   The Employee agrees to maintain confidentiality of all proprietary information of the Employer.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF the parties have executed this Agreement.

______________________          ______________________
For {{company_name}}            {{employee_name}}
Employer                        Employee',
  '["date", "company_name", "company_address", "employee_name", "employee_address", "position", "start_date", "salary", "salary_words", "probation_period", "job_description", "working_hours", "notice_period"]'
),
(
  'Rent Agreement',
  'Residential property rental agreement as per Indian law',
  'agreement',
  'India',
  'RENT AGREEMENT

This Rent Agreement is made on {{date}}

BETWEEN:
{{landlord_name}}, residing at {{landlord_address}}, PAN: {{landlord_pan}} (hereinafter referred to as "the Landlord")

AND

{{tenant_name}}, residing at {{tenant_address}}, PAN: {{tenant_pan}} (hereinafter referred to as "the Tenant")

WHEREAS the Landlord is the lawful owner of the property situated at {{property_address}} (hereinafter referred to as "the Premises").

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. TERM
   The tenancy shall be for a period of {{duration}} months commencing from {{start_date}}.

2. RENT
   The monthly rent shall be INR {{rent_amount}} ({{rent_words}}) payable on or before the {{payment_date}} of each month.

3. SECURITY DEPOSIT
   The Tenant has paid INR {{deposit_amount}} ({{deposit_words}}) as security deposit.

4. MAINTENANCE
   The Tenant shall maintain the Premises in good condition and shall be responsible for minor repairs.

5. USE OF PREMISES
   The Premises shall be used solely for residential purposes.

6. TERMINATION
   Either party may terminate this agreement by giving {{notice_period}} months notice in writing.

7. UTILITIES
   {{utilities_clause}}

8. FURNISHINGS
   {{furnishing_details}}

IN WITNESS WHEREOF the parties have signed this Agreement.

______________________          ______________________
{{landlord_name}}               {{tenant_name}}
Landlord                        Tenant

WITNESSES:
1. ____________________
   Name:
   Address:

2. ____________________
   Name:
   Address:',
  '["date", "landlord_name", "landlord_address", "landlord_pan", "tenant_name", "tenant_address", "tenant_pan", "property_address", "duration", "start_date", "rent_amount", "rent_words", "payment_date", "deposit_amount", "deposit_words", "notice_period", "utilities_clause", "furnishing_details"]'
);

-- Function to automatically create subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, queries_limit)
  VALUES (NEW.id, 'free', 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
