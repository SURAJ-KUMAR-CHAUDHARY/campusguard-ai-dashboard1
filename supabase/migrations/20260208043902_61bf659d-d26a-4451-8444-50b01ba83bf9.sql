
-- Create table for persisting quest completion status per user
CREATE TABLE public.user_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quest_id INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Enable RLS
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quests"
ON public.user_quests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
ON public.user_quests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
ON public.user_quests FOR UPDATE
USING (auth.uid() = user_id);
