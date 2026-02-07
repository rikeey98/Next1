export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type MicroActionStatus = 'pending' | 'running' | 'paused' | 'completed' | 'abandoned'
export type MicroActionEventType = 'start' | 'pause' | 'resume' | 'complete' | 'abandon' | 'extend'

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          completed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          timezone: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      anchors: {
        Row: {
          id: string
          user_id: string
          text: string
          tags: string[]
          pinned: boolean
          sort_order: number
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          tags?: string[]
          pinned?: boolean
          sort_order?: number
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          tags?: string[]
          pinned?: boolean
          sort_order?: number
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          purpose: string | null
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          purpose?: string | null
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          purpose?: string | null
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      micro_actions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          text: string
          duration_seconds: number
          status: MicroActionStatus
          completion_rate: number | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          text: string
          duration_seconds?: number
          status?: MicroActionStatus
          completion_rate?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          text?: string
          duration_seconds?: number
          status?: MicroActionStatus
          completion_rate?: number | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      micro_action_events: {
        Row: {
          id: string
          user_id: string
          micro_action_id: string
          event_type: MicroActionEventType
          meta: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          micro_action_id: string
          event_type: MicroActionEventType
          meta?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          micro_action_id?: string
          event_type?: MicroActionEventType
          meta?: Json
          created_at?: string
        }
        Relationships: []
      }
      daily_state: {
        Row: {
          id: string
          user_id: string
          date: string
          selected_anchor_id: string | null
          tomorrow_first_action_text: string | null
          tomorrow_first_action_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          selected_anchor_id?: string | null
          tomorrow_first_action_text?: string | null
          tomorrow_first_action_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          selected_anchor_id?: string | null
          tomorrow_first_action_text?: string | null
          tomorrow_first_action_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          id: string
          user_id: string
          date: string
          most_me: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          most_me: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          most_me?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      energy_logs: {
        Row: {
          id: string
          user_id: string
          logged_at: string
          level: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          logged_at?: string
          level: number
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          logged_at?: string
          level?: number
          note?: string | null
          created_at?: string
        }
        Relationships: []
      }
      notification_prefs: {
        Row: {
          user_id: string
          morning_enabled: boolean
          morning_time: string
          night_enabled: boolean
          night_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          morning_enabled?: boolean
          morning_time?: string
          night_enabled?: boolean
          night_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          morning_enabled?: boolean
          morning_time?: string
          night_enabled?: boolean
          night_time?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      micro_action_status: MicroActionStatus
      micro_action_event_type: MicroActionEventType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Todo = Database['public']['Tables']['todos']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Anchor = Database['public']['Tables']['anchors']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type MicroAction = Database['public']['Tables']['micro_actions']['Row']
export type MicroActionEvent = Database['public']['Tables']['micro_action_events']['Row']
export type DailyState = Database['public']['Tables']['daily_state']['Row']
export type Reflection = Database['public']['Tables']['reflections']['Row']
export type EnergyLog = Database['public']['Tables']['energy_logs']['Row']
export type NotificationPrefs = Database['public']['Tables']['notification_prefs']['Row']
