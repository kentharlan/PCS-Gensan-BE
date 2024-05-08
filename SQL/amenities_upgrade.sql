ALTER TABLE transactions 
ADD COLUMN extra_pillow SMALLINT DEFAULT 0,
ADD COLUMN extra_towel SMALLINT DEFAULT 0,
ADD COLUMN extra_small_bed SMALLINT DEFAULT 0,
ADD COLUMN extra_bed SMALLINT DEFAULT 0,
ADD COLUMN extra_person SMALLINT DEFAULT 0;

ALTER TABLE rates 
ADD COLUMN extra_pillow SMALLINT DEFAULT 20,
ADD COLUMN extra_towel SMALLINT DEFAULT 20,
ADD COLUMN extra_small_bed SMALLINT DEFAULT 200,
ADD COLUMN extra_bed SMALLINT DEFAULT 300,
ADD COLUMN extra_person SMALLINT DEFAULT 100;