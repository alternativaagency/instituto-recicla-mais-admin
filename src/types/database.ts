export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type City = {
  id: number;
  cityname: string;
  slug: string;
  state: string;
  longitude: number | null;
  latitude: number | null;
  jobsdone: number | null;
  trashrecycledkg: number | null;
  description: string | null;
  images: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};
export type Faq = { id: number; title: string; answer: string; sort_order: number | null };
export type TransparencyDocument = { id: number; title: string; category: string; year: number; file_url: string; published_at: string | null };
export type AuthorizedUser = { id: string; user_id: string | null; email: string; role: string; is_active: boolean; created_at: string | null; updated_at: string | null };
export type MediaAsset = { id: number; title: string; media_type: "image" | "video"; storage_path: string; page_key: string; alt_text: string | null; caption: string | null; sort_order: number; is_published: boolean; created_at: string | null };

export type Database = {
  public: {
    Tables: {
      cities: Table<City, Omit<City, "id" | "created_at" | "updated_at"> & { id?: number }, Partial<Omit<City, "id" | "created_at">>>;
      faqs: Table<Faq, Omit<Faq, "id"> & { id?: number }, Partial<Omit<Faq, "id">>>;
      transparency_documents: Table<TransparencyDocument, Omit<TransparencyDocument, "id"> & { id?: number }, Partial<Omit<TransparencyDocument, "id">>>;
      authorized_users: Table<AuthorizedUser>;
      media_assets: Table<MediaAsset>;
    };
    Views: Record<string, never>;
    Functions: {
      claim_authorized_user: { Args: Record<string, never>; Returns: boolean };
      is_authorized: { Args: Record<string, never>; Returns: boolean };
      can_edit_content: { Args: Record<string, never>; Returns: boolean };
      can_delete_content: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
