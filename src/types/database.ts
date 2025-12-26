// Database types for Supabase
// These can be auto-generated using: npx supabase gen types typescript

export interface Database {
  public: {
    Tables: {
      trainees: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          organization: string | null;
          role: 'trainee' | 'instructor' | 'admin';
          license_info: Record<string, any>;
          preferences: TraineePreferences;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trainees']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trainees']['Insert']>;
      };
      character_profiles: {
        Row: {
          id: string;
          name: string;
          age: number | null;
          gender: string | null;
          occupation: string | null;
          background_story: string | null;
          psychological_profile: PsychologicalProfile;
          inworld_character_id: string | null;
          inworld_workspace: string | null;
          voice_config: VoiceConfig;
          is_template: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['character_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['character_profiles']['Insert']>;
      };
      couple_profiles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          relationship_context: RelationshipContext;
          partner_a_id: string;
          partner_b_id: string;
          inworld_scene_id: string | null;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          tags: string[];
          is_template: boolean;
          is_public: boolean;
          scenario_config: ScenarioConfig;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['couple_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['couple_profiles']['Insert']>;
      };
      memories: {
        Row: {
          id: string;
          character_id: string | null;
          couple_id: string | null;
          memory_type: MemoryType;
          title: string;
          content: string;
          memory_metadata: MemoryMetadata;
          occurred_at: string | null;
          session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['memories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['memories']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          trainee_id: string;
          couple_id: string;
          session_number: number;
          status: SessionStatus;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          inworld_state: string | null;
          inworld_session_id: string | null;
          session_config: SessionConfig;
          current_state: SessionState;
          outcomes: SessionOutcomes;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'session_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      session_events: {
        Row: {
          id: string;
          session_id: string;
          event_type: EventType;
          actor: Actor;
          content: string | null;
          audio_url: string | null;
          event_metadata: EventMetadata;
          sequence_number: number;
          duration_ms: number | null;
          latency_ms: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['session_events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['session_events']['Insert']>;
      };
      trainee_progress: {
        Row: {
          id: string;
          trainee_id: string;
          couple_id: string;
          total_sessions: number;
          total_duration_seconds: number;
          skill_assessments: SkillAssessments;
          instructor_notes: string | null;
          self_reflection: string | null;
          last_session_id: string | null;
          last_session_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['trainee_progress']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['trainee_progress']['Insert']>;
      };
    };
    Views: {
      couple_profiles_detailed: {
        Row: Database['public']['Tables']['couple_profiles']['Row'] & {
          partner_a: Database['public']['Tables']['character_profiles']['Row'];
          partner_b: Database['public']['Tables']['character_profiles']['Row'];
        };
      };
      session_summaries: {
        Row: {
          id: string;
          trainee_id: string;
          couple_id: string;
          couple_name: string;
          session_number: number;
          status: SessionStatus;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          outcomes: SessionOutcomes;
          event_count: number;
        };
      };
    };
  };
}

// Supporting Types

export interface TraineePreferences {
  defaultDifficulty: 'beginner' | 'intermediate' | 'advanced';
  audioEnabled: boolean;
  showTranscript: boolean;
}

export interface PsychologicalProfile {
  personalityTraits: {
    attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'disorganized' | null;
    communicationStyle: string | null;
    conflictStyle: string | null;
    bigFive: {
      openness: number | null;
      conscientiousness: number | null;
      extraversion: number | null;
      agreeableness: number | null;
      neuroticism: number | null;
    };
  };
  emotionalPatterns: {
    triggers: string[];
    copingMechanisms: string[];
    emotionalRegulation: string | null;
    primaryEmotions: string[];
    avoidedEmotions: string[];
  };
  behavioralPatterns: {
    defenseMechanisms: string[];
    relationshipBehaviors: string[];
    conflictBehaviors: string[];
    intimacyPatterns: string[];
  };
  familyOfOrigin: {
    parentalRelationship: string | null;
    siblingDynamics: string | null;
    childhoodExperiences: string[];
    modeledBehaviors: string[];
  };
}

export interface VoiceConfig {
  voiceId: string | null;
  pitch: number;
  speed: number;
  emotion: string;
}

export interface RelationshipContext {
  relationshipDurationYears: number | null;
  relationshipStage: string | null;
  presentingIssues: string[];
  triggeringEvent: string | null;
  strengthsAsCouple: string[];
  communicationPatterns: string[];
  conflictCycle: string | null;
}

export interface ScenarioConfig {
  triggers: Array<{
    name: string;
    condition: string;
    effect: string;
  }>;
  breakthroughConditions: string[];
  escalationThresholds: Array<{
    level: number;
    behavior: string;
  }>;
  therapeuticGoals: string[];
}

export type MemoryType =
  | 'individual_history'
  | 'individual_trauma'
  | 'shared_positive'
  | 'shared_negative'
  | 'relationship_milestone'
  | 'family_event'
  | 'therapy_session';

export interface MemoryMetadata {
  emotionalValence: number;
  importance: number;
  triggers: string[];
  associatedEmotions: string[];
  perspectiveOwner: string | null;
}

export type SessionStatus = 'scheduled' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface SessionConfig {
  scenarioType: string | null;
  objectives: string[];
  focusAreas: string[];
}

export interface SessionState {
  phase: 'opening' | 'exploration' | 'working' | 'closing';
  emotionalTemperature: number;
  activeTopics: string[];
  lastSpeaker: string | null;
  interventionCount: number;
}

export interface SessionOutcomes {
  summary: string | null;
  breakthroughs: string[];
  challenges: string[];
  homeworkAssigned: string[];
  nextSessionFocus: string[];
}

export type EventType =
  | 'trainee_message'
  | 'partner_a_response'
  | 'partner_b_response'
  | 'couple_interaction'
  | 'intervention'
  | 'state_change'
  | 'system_event';

export type Actor = 'trainee' | 'partner_a' | 'partner_b' | 'system';

export interface EventMetadata {
  interventionType: string | null;
  therapeuticTechnique: string | null;
  emotionalState: string | null;
  triggerActivated: string | null;
  transcriptionConfidence: number | null;
}

export interface SkillAssessments {
  empathy: number | null;
  activeListening: number | null;
  interventionTiming: number | null;
  conflictDeescalation: number | null;
  emotionalValidation: number | null;
  boundaryManagement: number | null;
}
