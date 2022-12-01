ALTER TABLE shoe_data
ADD COLUMN last_sale money,
ADD COLUMN scrape_date DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN last_sale_date text;