import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_audience" AS ENUM('Students', 'Parents', 'Schools', 'Graduates');
  CREATE TYPE "public"."enum_services_kind" AS ENUM('service', 'specialization');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('compass', 'book', 'cap', 'globe', 'heart', 'users', 'spark', 'chart', 'stethoscope', 'cog', 'scale', 'palette', 'brain', 'briefcase', 'leaf', 'school');
  CREATE TYPE "public"."enum_careers_riasec" AS ENUM('R', 'I', 'A', 'S', 'E', 'C');
  CREATE TYPE "public"."enum_careers_stream" AS ENUM('bio', 'eng', 'com', 'hum', 'combo');
  CREATE TYPE "public"."enum_careers_outlook" AS ENUM('hot', 'growing', 'stable');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('guide', 'myth', 'parenting', 'event', 'news');
  CREATE TYPE "public"."enum_books_format" AS ENUM('ebook', 'print', 'both');
  CREATE TYPE "public"."enum_products_kind" AS ENUM('assessment', 'explorer', 'booking');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'refunded', 'cancelled');
  CREATE TYPE "public"."enum_attempts_status" AS ENUM('not_started', 'in_progress', 'submitted', 'approved', 'sent');
  CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'editor', 'student', 'parent', 'teacher');
  CREATE TYPE "public"."enum_users_consent_status" AS ENUM('not_required', 'pending', 'granted');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'converted', 'closed');
  CREATE TABLE "services_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "services_audience" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_audience",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"kind" "enum_services_kind" DEFAULT 'service' NOT NULL,
  	"tagline" varchar,
  	"summary" varchar NOT NULL,
  	"icon" "enum_services_icon" DEFAULT 'compass',
  	"image_id" integer,
  	"body" jsonb,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 10,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "careers_riasec" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_careers_riasec",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"stream" "enum_careers_stream" NOT NULL,
  	"summary" varchar NOT NULL,
  	"day_to_day" varchar,
  	"subjects" varchar,
  	"routes" varchar,
  	"entry_tests" varchar,
  	"skills" varchar,
  	"outlook" "enum_careers_outlook" DEFAULT 'growing',
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_posts_category" DEFAULT 'guide',
  	"excerpt" varchar NOT NULL,
  	"image_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"detail" varchar,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" jsonb,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "books" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"cover_id" integer,
  	"cover_color" varchar DEFAULT '#16163F',
  	"description" varchar NOT NULL,
  	"audience" varchar,
  	"price" numeric DEFAULT 0 NOT NULL,
  	"format" "enum_books_format" DEFAULT 'ebook',
  	"ebook_file_id" integer,
  	"external_link" varchar,
  	"coming_soon" boolean,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"kind" "enum_products_kind" DEFAULT 'assessment' NOT NULL,
  	"tagline" varchar,
  	"summary" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"compare_at" numeric,
  	"access_months" numeric DEFAULT 12,
  	"includes_explorer" boolean,
  	"featured" boolean,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tests_id" integer
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"user_id" integer NOT NULL,
  	"product_id" integer,
  	"book_id" integer,
  	"item_title" varchar,
  	"amount" numeric,
  	"status" "enum_orders_status" DEFAULT 'pending',
  	"shipping_address" varchar,
  	"stripe_session_id" varchar,
  	"paid_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "private_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tests_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "tests_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"dimension" varchar NOT NULL
  );
  
  CREATE TABLE "tests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"intro" varchar,
  	"minutes" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attempts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"status" "enum_attempts_status" DEFAULT 'not_started',
  	"user_id" integer NOT NULL,
  	"test_id" integer NOT NULL,
  	"order_id" integer,
  	"score_summary" varchar,
  	"recommendations" varchar,
  	"counsellor_notes" varchar,
  	"report_id" integer,
  	"answers" jsonb,
  	"scores" jsonb,
  	"started_at" timestamp(3) with time zone,
  	"submitted_at" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'student' NOT NULL,
  	"phone" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"grade" varchar,
  	"school" varchar,
  	"curriculum" varchar,
  	"subjects" varchar,
  	"hobbies" varchar,
  	"dream" varchar,
  	"parent_name" varchar,
  	"parent_email" varchar,
  	"consent_status" "enum_users_consent_status" DEFAULT 'not_required',
  	"consent_at" timestamp(3) with time zone,
  	"consent_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"careers_id" integer
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"grade" varchar,
  	"topic" varchar,
  	"message" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"careers_id" integer,
  	"posts_id" integer,
  	"testimonials_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"books_id" integer,
  	"products_id" integer,
  	"orders_id" integer,
  	"private_files_id" integer,
  	"tests_id" integer,
  	"attempts_id" integer,
  	"users_id" integer,
  	"inquiries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Career & education guidance · Dubai',
  	"heading" varchar DEFAULT 'Choose your future with',
  	"highlight" varchar DEFAULT 'clarity',
  	"subheading" varchar DEFAULT 'Psychometric assessments, subject choices, careers and university admissions — guided one-to-one by a counselling psychologist with 12+ years of experience.',
  	"method_title" varchar DEFAULT 'The EDUSIGHT way',
  	"cta_title" varchar DEFAULT 'Not sure where to start?',
  	"cta_text" varchar DEFAULT 'A 20-minute call is enough to map out the next step for your child. No pressure, no jargon.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"headline" varchar DEFAULT 'Hi, I’m Bhavana.',
  	"role" varchar DEFAULT 'Counselling Psychologist & Career Advisor · Founder, EDUSIGHT',
  	"intro" varchar,
  	"story" varchar,
  	"approach" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"announcement" varchar,
  	"announcement_link" varchar,
  	"phone" varchar DEFAULT '+971 50 451 8940',
  	"whatsapp" varchar DEFAULT '971504518940',
  	"email" varchar DEFAULT 'edusightguidance@gmail.com',
  	"address" varchar DEFAULT 'Dubai, United Arab Emirates',
  	"licence" varchar DEFAULT 'Licensed by the Department of Economy & Tourism, Dubai',
  	"socials_instagram" varchar,
  	"socials_facebook" varchar,
  	"socials_linkedin" varchar DEFAULT 'https://www.linkedin.com/in/bhavanasood/',
  	"socials_youtube" varchar,
  	"booking_link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "services_points" ADD CONSTRAINT "services_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_audience" ADD CONSTRAINT "services_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_riasec" ADD CONSTRAINT "careers_riasec_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_ebook_file_id_private_files_id_fk" FOREIGN KEY ("ebook_file_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_features" ADD CONSTRAINT "products_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_tests_fk" FOREIGN KEY ("tests_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "private_files" ADD CONSTRAINT "private_files_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tests_dimensions" ADD CONSTRAINT "tests_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tests_questions" ADD CONSTRAINT "tests_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attempts" ADD CONSTRAINT "attempts_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attempts" ADD CONSTRAINT "attempts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attempts" ADD CONSTRAINT "attempts_report_id_private_files_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."private_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_files_fk" FOREIGN KEY ("private_files_id") REFERENCES "public"."private_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tests_fk" FOREIGN KEY ("tests_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attempts_fk" FOREIGN KEY ("attempts_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stats" ADD CONSTRAINT "homepage_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_method" ADD CONSTRAINT "homepage_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_expertise" ADD CONSTRAINT "about_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_awards" ADD CONSTRAINT "about_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_points_order_idx" ON "services_points" USING btree ("_order");
  CREATE INDEX "services_points_parent_id_idx" ON "services_points" USING btree ("_parent_id");
  CREATE INDEX "services_audience_order_idx" ON "services_audience" USING btree ("order");
  CREATE INDEX "services_audience_parent_idx" ON "services_audience" USING btree ("parent_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "careers_riasec_order_idx" ON "careers_riasec" USING btree ("order");
  CREATE INDEX "careers_riasec_parent_idx" ON "careers_riasec" USING btree ("parent_id");
  CREATE UNIQUE INDEX "careers_slug_idx" ON "careers" USING btree ("slug");
  CREATE INDEX "careers_updated_at_idx" ON "careers" USING btree ("updated_at");
  CREATE INDEX "careers_created_at_idx" ON "careers" USING btree ("created_at");
  CREATE INDEX "posts_image_idx" ON "posts" USING btree ("image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "books_cover_idx" ON "books" USING btree ("cover_id");
  CREATE INDEX "books_ebook_file_idx" ON "books" USING btree ("ebook_file_id");
  CREATE UNIQUE INDEX "books_slug_idx" ON "books" USING btree ("slug");
  CREATE INDEX "books_updated_at_idx" ON "books" USING btree ("updated_at");
  CREATE INDEX "books_created_at_idx" ON "books" USING btree ("created_at");
  CREATE INDEX "products_features_order_idx" ON "products_features" USING btree ("_order");
  CREATE INDEX "products_features_parent_id_idx" ON "products_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_tests_id_idx" ON "products_rels" USING btree ("tests_id");
  CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");
  CREATE INDEX "orders_product_idx" ON "orders" USING btree ("product_id");
  CREATE INDEX "orders_book_idx" ON "orders" USING btree ("book_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "private_files_owner_idx" ON "private_files" USING btree ("owner_id");
  CREATE INDEX "private_files_updated_at_idx" ON "private_files" USING btree ("updated_at");
  CREATE INDEX "private_files_created_at_idx" ON "private_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "private_files_filename_idx" ON "private_files" USING btree ("filename");
  CREATE INDEX "tests_dimensions_order_idx" ON "tests_dimensions" USING btree ("_order");
  CREATE INDEX "tests_dimensions_parent_id_idx" ON "tests_dimensions" USING btree ("_parent_id");
  CREATE INDEX "tests_questions_order_idx" ON "tests_questions" USING btree ("_order");
  CREATE INDEX "tests_questions_parent_id_idx" ON "tests_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tests_code_idx" ON "tests" USING btree ("code");
  CREATE INDEX "tests_updated_at_idx" ON "tests" USING btree ("updated_at");
  CREATE INDEX "tests_created_at_idx" ON "tests" USING btree ("created_at");
  CREATE INDEX "attempts_user_idx" ON "attempts" USING btree ("user_id");
  CREATE INDEX "attempts_test_idx" ON "attempts" USING btree ("test_id");
  CREATE INDEX "attempts_order_idx" ON "attempts" USING btree ("order_id");
  CREATE INDEX "attempts_report_idx" ON "attempts" USING btree ("report_id");
  CREATE INDEX "attempts_updated_at_idx" ON "attempts" USING btree ("updated_at");
  CREATE INDEX "attempts_created_at_idx" ON "attempts" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_careers_id_idx" ON "users_rels" USING btree ("careers_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_careers_id_idx" ON "payload_locked_documents_rels" USING btree ("careers_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_books_id_idx" ON "payload_locked_documents_rels" USING btree ("books_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_private_files_id_idx" ON "payload_locked_documents_rels" USING btree ("private_files_id");
  CREATE INDEX "payload_locked_documents_rels_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("tests_id");
  CREATE INDEX "payload_locked_documents_rels_attempts_id_idx" ON "payload_locked_documents_rels" USING btree ("attempts_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_stats_order_idx" ON "homepage_stats" USING btree ("_order");
  CREATE INDEX "homepage_stats_parent_id_idx" ON "homepage_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_method_order_idx" ON "homepage_method" USING btree ("_order");
  CREATE INDEX "homepage_method_parent_id_idx" ON "homepage_method" USING btree ("_parent_id");
  CREATE INDEX "about_expertise_order_idx" ON "about_expertise" USING btree ("_order");
  CREATE INDEX "about_expertise_parent_id_idx" ON "about_expertise" USING btree ("_parent_id");
  CREATE INDEX "about_awards_order_idx" ON "about_awards" USING btree ("_order");
  CREATE INDEX "about_awards_parent_id_idx" ON "about_awards" USING btree ("_parent_id");
  CREATE INDEX "about_photo_idx" ON "about" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_points" CASCADE;
  DROP TABLE "services_audience" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "careers_riasec" CASCADE;
  DROP TABLE "careers" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "books" CASCADE;
  DROP TABLE "products_features" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "private_files" CASCADE;
  DROP TABLE "tests_dimensions" CASCADE;
  DROP TABLE "tests_questions" CASCADE;
  DROP TABLE "tests" CASCADE;
  DROP TABLE "attempts" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_stats" CASCADE;
  DROP TABLE "homepage_method" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "about_expertise" CASCADE;
  DROP TABLE "about_awards" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_services_audience";
  DROP TYPE "public"."enum_services_kind";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_careers_riasec";
  DROP TYPE "public"."enum_careers_stream";
  DROP TYPE "public"."enum_careers_outlook";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_books_format";
  DROP TYPE "public"."enum_products_kind";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_attempts_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_consent_status";
  DROP TYPE "public"."enum_inquiries_status";`)
}
