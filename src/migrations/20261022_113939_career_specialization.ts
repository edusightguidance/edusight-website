import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "careers" ADD COLUMN "specialization_id" integer;
  ALTER TABLE "careers" ADD CONSTRAINT "careers_specialization_id_services_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "careers_specialization_idx" ON "careers" USING btree ("specialization_id");
  -- Pre-fill: link existing careers to a specialization (only where empty)
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'medicine-health-sciences' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Doctor (Medicine)', 'Veterinary Surgeon', 'Pharmacist / Pharmacologist', 'Biomedical Scientist', 'Genetic Counsellor', 'Physiotherapist', 'Nutritionist / Dietitian', 'Forensic Scientist');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'engineering-technology' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Civil Engineer', 'Mechanical Engineer', 'Aerospace Engineer', 'Robotics & Mechatronics Engineer', 'Environmental Engineer');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'computer-science-data-ai' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Software Engineer', 'Data Scientist / AI Specialist', 'Cybersecurity Analyst');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'business-finance-accounting' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Chartered Accountant', 'Financial Analyst / CFA', 'Investment Banker', 'Actuary', 'Management Consultant', 'Entrepreneur', 'Marketing & Brand Manager', 'Hospitality & Tourism Manager');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'law-public-policy' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Lawyer');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'psychology-social-sciences' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Clinical Psychologist', 'Psychologist / Counsellor', 'Teacher / Educator');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'design-architecture-creative-arts' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Architect', 'UX / Product Designer', 'Fashion Designer', 'Journalist / Media Producer');
  UPDATE "careers" SET "specialization_id" = (SELECT "id" FROM "services" WHERE "slug" = 'combination-careers' LIMIT 1) WHERE "specialization_id" IS NULL AND "title" IN ('Bioinformatician', 'Biomedical Engineer', 'Medical / Patent Lawyer', 'Health-tech Entrepreneur');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "careers" DROP CONSTRAINT "careers_specialization_id_services_id_fk";
  
  DROP INDEX "careers_specialization_idx";
  ALTER TABLE "careers" DROP COLUMN "specialization_id";`)
}
