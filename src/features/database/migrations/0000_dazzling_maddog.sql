CREATE TABLE IF NOT EXISTS "polls" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
