import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_testimonials_source" AS ENUM('website', 'google', 'linkedin', 'facebook', 'instagram', 'other');
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_image_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar DEFAULT 'Bhavana Sood',
  	"version_featured" boolean,
  	"version_reading_minutes" numeric,
  	"version_slug" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "socials_instagram" SET DEFAULT 'https://www.instagram.com/edu.sight/';
  ALTER TABLE "site_settings" ALTER COLUMN "socials_facebook" SET DEFAULT 'https://www.facebook.com/EduSightAE/';
  ALTER TABLE "posts" ADD COLUMN "author" varchar DEFAULT 'Bhavana Sood';
  ALTER TABLE "posts" ADD COLUMN "featured" boolean;
  ALTER TABLE "posts" ADD COLUMN "reading_minutes" numeric;
  ALTER TABLE "posts" ADD COLUMN "_status" "enum_posts_status" DEFAULT 'draft';
  ALTER TABLE "testimonials" ADD COLUMN "status" "enum_testimonials_status" DEFAULT 'approved' NOT NULL;
  ALTER TABLE "testimonials" ADD COLUMN "source" "enum_testimonials_source" DEFAULT 'website' NOT NULL;
  ALTER TABLE "testimonials" ADD COLUMN "rating" numeric;
  ALTER TABLE "testimonials" ADD COLUMN "date" timestamp(3) with time zone;
  ALTER TABLE "testimonials" ADD COLUMN "service_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "source_url" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "screenshot_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "featured" boolean;
  ALTER TABLE "testimonials" ADD COLUMN "verified" boolean;
  ALTER TABLE "testimonials" ADD COLUMN "email" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "user_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "consent" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "review_requested_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "google_review_link" varchar;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_screenshot_id_media_id_fk" FOREIGN KEY ("screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "testimonials_service_idx" ON "testimonials" USING btree ("service_id");
  CREATE INDEX "testimonials_screenshot_idx" ON "testimonials" USING btree ("screenshot_id");
  CREATE INDEX "testimonials_user_idx" ON "testimonials" USING btree ("user_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  -- Data migration: keep everything edited in the admin before this upgrade.
  UPDATE "posts" SET "_status" = CASE WHEN "published" THEN 'published'::"enum_posts_status" ELSE 'draft'::"enum_posts_status" END;
  UPDATE "testimonials" SET "status" = CASE WHEN "published" THEN 'approved'::"enum_testimonials_status" ELSE 'pending'::"enum_testimonials_status" END, "date" = COALESCE("date", "created_at"), "source" = 'other';
  INSERT INTO "categories" ("title", "slug", "order") VALUES
    ('Guides', 'guides', 1), ('Myth busters', 'myth-busters', 2), ('Parenting', 'parenting', 3),
    ('Careers', 'careers', 4), ('Universities', 'universities', 5), ('Curriculum', 'curriculum', 6),
    ('Well-being', 'well-being', 7), ('Events & webinars', 'events', 8), ('News', 'news', 9)
    ON CONFLICT DO NOTHING;
  INSERT INTO "posts_rels" ("order", "parent_id", "path", "categories_id")
    SELECT 1, p."id", 'categories', c."id" FROM "posts" p JOIN "categories" c ON c."slug" =
      CASE p."category"::text WHEN 'guide' THEN 'guides' WHEN 'myth' THEN 'myth-busters' WHEN 'parenting' THEN 'parenting'
        WHEN 'event' THEN 'events' WHEN 'news' THEN 'news' END;
  ALTER TABLE "posts" DROP COLUMN "category";
  ALTER TABLE "posts" DROP COLUMN "published";
  ALTER TABLE "testimonials" DROP COLUMN "published";
  DROP TYPE "public"."enum_posts_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_category" AS ENUM('guide', 'myth', 'parenting', 'event', 'news');
  ALTER TABLE "posts_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_service_id_services_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_screenshot_id_media_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_user_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  DROP INDEX "posts__status_idx";
  DROP INDEX "testimonials_service_idx";
  DROP INDEX "testimonials_screenshot_idx";
  DROP INDEX "testimonials_user_idx";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "socials_instagram" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "socials_facebook" DROP DEFAULT;
  ALTER TABLE "posts" ADD COLUMN "category" "enum_posts_category" DEFAULT 'guide';
  ALTER TABLE "posts" ADD COLUMN "published" boolean DEFAULT true;
  ALTER TABLE "testimonials" ADD COLUMN "published" boolean DEFAULT true;
  ALTER TABLE "posts" DROP COLUMN "author";
  ALTER TABLE "posts" DROP COLUMN "featured";
  ALTER TABLE "posts" DROP COLUMN "reading_minutes";
  ALTER TABLE "posts" DROP COLUMN "_status";
  ALTER TABLE "testimonials" DROP COLUMN "status";
  ALTER TABLE "testimonials" DROP COLUMN "source";
  ALTER TABLE "testimonials" DROP COLUMN "rating";
  ALTER TABLE "testimonials" DROP COLUMN "date";
  ALTER TABLE "testimonials" DROP COLUMN "service_id";
  ALTER TABLE "testimonials" DROP COLUMN "source_url";
  ALTER TABLE "testimonials" DROP COLUMN "screenshot_id";
  ALTER TABLE "testimonials" DROP COLUMN "featured";
  ALTER TABLE "testimonials" DROP COLUMN "verified";
  ALTER TABLE "testimonials" DROP COLUMN "email";
  ALTER TABLE "testimonials" DROP COLUMN "user_id";
  ALTER TABLE "testimonials" DROP COLUMN "consent";
  ALTER TABLE "users" DROP COLUMN "review_requested_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";
  ALTER TABLE "site_settings" DROP COLUMN "google_review_link";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_testimonials_source";`)
}
