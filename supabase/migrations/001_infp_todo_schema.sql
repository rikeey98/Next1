-- INFP TODO Schema Migration
-- Run this in Supabase Dashboard SQL Editor

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE micro_action_status AS ENUM ('pending', 'running', 'paused', 'completed', 'abandoned');
CREATE TYPE micro_action_event_type AS ENUM ('start', 'pause', 'resume', 'complete', 'abandon', 'extend');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ANCHORS (정체성 앵커)
-- ============================================================
CREATE TABLE anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_anchors_user ON anchors(user_id);
ALTER TABLE anchors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own anchors" ON anchors FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- TASKS (상위 목표/과제)
-- ============================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  purpose TEXT,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_user ON tasks(user_id);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- MICRO_ACTIONS (2분 마이크로 행동)
-- ============================================================
CREATE TABLE micro_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 120,
  status micro_action_status NOT NULL DEFAULT 'pending',
  completion_rate INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_micro_actions_user ON micro_actions(user_id);
CREATE INDEX idx_micro_actions_created ON micro_actions(user_id, created_at);
ALTER TABLE micro_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own micro_actions" ON micro_actions FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- MICRO_ACTION_EVENTS (타이머 이벤트 로그)
-- ============================================================
CREATE TABLE micro_action_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  micro_action_id UUID NOT NULL REFERENCES micro_actions(id) ON DELETE CASCADE,
  event_type micro_action_event_type NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_micro_action_events_action ON micro_action_events(micro_action_id);
ALTER TABLE micro_action_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own events" ON micro_action_events FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- DAILY_STATE (일별 상태)
-- ============================================================
CREATE TABLE daily_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  selected_anchor_id UUID REFERENCES anchors(id) ON DELETE SET NULL,
  tomorrow_first_action_text TEXT,
  tomorrow_first_action_id UUID REFERENCES micro_actions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_state_user_date ON daily_state(user_id, date);
ALTER TABLE daily_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own daily_state" ON daily_state FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- REFLECTIONS (밤 회고)
-- ============================================================
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  most_me TEXT NOT NULL CHECK (char_length(most_me) <= 140),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_reflections_user_date ON reflections(user_id, date);
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reflections" ON reflections FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- ENERGY_LOGS (에너지 체크)
-- ============================================================
CREATE TABLE energy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_energy_logs_user ON energy_logs(user_id, logged_at);
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own energy_logs" ON energy_logs FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- NOTIFICATION_PREFS (알림 설정)
-- ============================================================
CREATE TABLE notification_prefs (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  morning_enabled BOOLEAN NOT NULL DEFAULT true,
  morning_time TIME NOT NULL DEFAULT '07:00',
  night_enabled BOOLEAN NOT NULL DEFAULT true,
  night_time TIME NOT NULL DEFAULT '22:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notification_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notification_prefs" ON notification_prefs FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON anchors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON micro_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON daily_state FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON notification_prefs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
