import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_awards_kind" AS ENUM('award', 'speaking', 'recognition');
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"organisation" varchar,
  	"year" varchar,
  	"kind" "enum_awards_kind" DEFAULT 'award',
  	"image_id" integer,
  	"note" varchar,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "about_awards" DISABLE ROW LEVEL SECURITY;
  -- Move the existing About-page awards into the new Awards collection (keeps any edits made in admin).
  INSERT INTO "awards" ("title", "organisation", "year", "kind", "order")
    SELECT
      CASE WHEN position(' — ' in "title") > 0 THEN split_part("title", ' — ', 1) ELSE "title" END,
      CASE WHEN position(' — ' in "title") > 0 THEN split_part("title", ' — ', 2) END,
      "year",
      CASE WHEN "title" ILIKE '%speaker%' THEN 'speaking'::"enum_awards_kind" ELSE 'award'::"enum_awards_kind" END,
      "_order"
    FROM "about_awards";
  DROP TABLE "about_awards" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "awards_id" integer;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_rels" ADD CONSTRAINT "awards_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards_rels" ADD CONSTRAINT "awards_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE INDEX "awards_rels_order_idx" ON "awards_rels" USING btree ("order");
  CREATE INDEX "awards_rels_parent_idx" ON "awards_rels" USING btree ("parent_id");
  CREATE INDEX "awards_rels_path_idx" ON "awards_rels" USING btree ("path");
  CREATE INDEX "awards_rels_media_id_idx" ON "awards_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"year" varchar
  );
  
  ALTER TABLE "awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "awards_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "awards_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_awards_fk";
  
  DROP INDEX "payload_locked_documents_rels_awards_id_idx";
  ALTER TABLE "about_awards" ADD CONSTRAINT "about_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_awards_order_idx" ON "about_awards" USING btree ("_order");
  CREATE INDEX "about_awards_parent_id_idx" ON "about_awards" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "awards_id";
  DROP TYPE "public"."enum_awards_kind";`)
}
