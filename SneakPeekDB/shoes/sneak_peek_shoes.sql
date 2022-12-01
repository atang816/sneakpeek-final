CREATE TABLE IF NOT EXISTS sp_shoe(
  sp_shoe_id SERIAL,
  shoe_name text NOT NULL, --we need to create a standard for the name of shoe
  url text,
  image bytea,

  CONSTRAINT sp_shoe_pkey
        PRIMARY KEY (sp_shoe_id, shoe_name)
);


CREATE TABLE IF NOT EXISTS shoe_data(
  data_instance_id SERIAL,
  shoe_name text NOT NULL,
  url text NOT NULL,
  redirect_url text,
  description text,
  brand text,
  retail money,
  lowest_asked money,
  annual_high money,
  annual_low money,
  deadstock_range_high money,
  deadstock_range_low money,
  gender text, -- M, F, Y
  color_way text,
  condition text,
  last_sale money,
  last_sale_date text,
  scrape_date DATE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT sp_shoe_data_pkey
        PRIMARY KEY (data_instance_id, shoe_name)

);

CREATE TABLE IF NOT EXISTS shoe_data_goat(
  data_instance_id SERIAL,
  shoe_name text NOT NULL,
  description text,
  url text,
  retail money,
  size_price money,
  size float,
  lowest_asked money,
  scrape_date DATE DEFAULT CURRENT_TIMESTAMP,
  redirect_url text,
  condition text,
  color_way text,


  CONSTRAINT sp_shoe_data_goat_pkey
        PRIMARY KEY (data_instance_id, shoe_name)
);

CREATE TABLE IF NOT EXISTS shoe_size_price(
  shoe_name text NOT NULL,
  size NUMERIC(3,1),
  retail money,

  CONSTRAINT sp_shoe_size_price
        PRIMARY KEY (shoe_name)
);

