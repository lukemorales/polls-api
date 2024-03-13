CREATE TABLE IF NOT EXISTS "poll_options" (
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"poll_id" varchar
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "poll_id_idx_on_poll_options" ON "poll_options" ("poll_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
