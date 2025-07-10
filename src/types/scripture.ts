export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
  created_at: string;
}

export interface OverlaySettings {
  textX: number;
  textY: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  textColor: string;
  backgroundColor?: string;
  backgroundOpacity: number;
  textAlign: 'left' | 'center' | 'right';
  maxWidth: number;
  padding: number;
  borderRadius: number;
}

export interface ScriptureOverlay {
  id: string;
  user_id: string;
  original_image_url: string;
  edited_image_url?: string;
  verse_id?: string;
  custom_verse_text?: string;
  overlay_settings: OverlaySettings;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoItem {
  name: string;
  url: string;
  created_at: string;
}