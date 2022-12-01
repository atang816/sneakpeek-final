# scrape for all model
import string
import time
import base64
import json
from bs4 import BeautifulSoup
import requests
import psycopg2
from config import config


def scrape_stockx_data_for_specific_shoe(searched_shoe: str):
    url = f'https://stockx.com/api/browse?_search={searched_shoe}'

    headers = {
        'accept': 'application/json',
        'accept-encoding': 'utf-8',
        'accept-language': 'en-GB,en;q=0.9',
        'app-platform': 'Iron',
        'referer': 'https://stockx.com/en-gb',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.62 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
    }

    html = requests.get(url=url, headers=headers)
    output = json.loads(html.text)
    shoe_list = output['Products']

    for shoe in shoe_list:
        shoe_dict = dict(
            shoe_name=searched_shoe,
            url=shoe['media']['imageUrl'],
            description=shoe['shortDescription'],
            brand=shoe['brand'],
            gender=shoe['gender'],
            color_way=shoe['colorway'],
            condition=shoe['condition'],
            retail=shoe['retailPrice'],
            lowest_asked=shoe['market']['lowestAsk'],
            annual_high=shoe['market']['annualHigh'],
            annual_low=shoe['market']['annualLow'],
            deadstock_range_high=shoe['market']['deadstockRangeHigh'],
            deadstock_range_low=shoe['market']['deadstockRangeLow'],
            shoe_image_url=shoe["media"]["imageUrl"],
            last_sale=shoe['market']['lastSale'],
            last_sale_date=shoe['market']['lastSaleDate'],
            redirect_url=f'stockx.com/{shoe["urlKey"]}'

        )
        insert_to_db(shoe_dict)


def scrape_goat_data_for_specific_shoe(query):
    url = f"https://ac.cnstrc.com/search/{query}?c=ciojs-client-2.29.2&key=key_XT7bjdbvjgECO5d8&i=c471ae65-6195-427f-b9ff-45fa149d2d8c&s=15&num_results_per_page=25&_dt=1661714126100"

    html = requests.get(url=url)
    output = json.loads(html.text)
    shoe_list = output['response']['results']
    for shoe in shoe_list:
        if shoe['data']['category'] != 'shoes':
            continue

        shoe_dict = dict(
            shoe_name=query,
            url=shoe['data']['image_url'],
            description=shoe['value'].replace("'", ''),
            color_way=shoe['data']['color'],
            condition=shoe['data']['product_condition'] if 'product_condition' in shoe['data'] else None,
            retail=(float(shoe['data']['retail_price_cents']) / 100) if 'retail_price_cents' in shoe['data'] else None,
            lowest_price=(float(shoe['data']['lowest_price_cents']) / 100) if 'lowest_price_cents' in shoe['data'] else None,
            redirect_url=f'goat.com/sneakers/{shoe["data"]["slug"]}'
        )

        scrape_goat_data_by_size(shoe['data']['slug'], shoe_dict)
        insert_goat_data_to_db(shoe_dict)


# SEARCHING FOR SHOE SIZES ON GOAT
def scrape_goat_data_by_size(shoe_slug, shoe_dict) -> dict:

    build_id = get_build_id()

    url = f'https://www.goat.com/_next/data/{build_id}/en-us/sneakers/{shoe_slug}.json?pageSlug=sneakers&productSlug={shoe_slug}'

    result = requests.get(url)
    output = json.loads(result.text)
    offers = output['pageProps']['offers']['offerData']

    size_prices = {float(offers[i]['size']) : float(offers[i]['price']) for i in range(len(offers))}
    shoe_dict.update({'size_prices': size_prices})
    return shoe_dict

# connect to db and insert data
def insert_goat_data_to_db(shoe: dict):
    """
    :param shoe:
    :return:
    """
    sql = """INSERT INTO shoe_data_goat (shoe_name, description, url, retail, lowest_asked, size, size_price, redirect_url,
    condition, color_way) 
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING data_instance_id;"""
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        for shoe_size in shoe['size_prices']:
            execute = cur.execute(sql, (shoe['shoe_name'], shoe['description'], shoe['url'],
                                        shoe['retail'], shoe['lowest_price'],
                                        shoe_size, shoe['size_prices'][shoe_size], shoe['redirect_url'],
                                        shoe['condition'], shoe['color_way']))

        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return True


# connect to db and insert data
def insert_to_db(shoe: dict):
    """
    :param shoe:
    :return:
    """
    sql = """INSERT INTO shoe_data (shoe_name, url, redirect_url, description, brand, gender, color_way, condition, retail, lowest_asked, annual_high,
    annual_low, deadstock_range_high, deadstock_range_low, last_sale, last_sale_date) 
    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING data_instance_id;"""
    sql_2 = """ UPDATE sp_shoe SET image=%s, url=%s WHERE shoe_name=%s
    """
    conn = None
    shoes_id = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        execute = cur.execute(sql, (shoe['shoe_name'], shoe['url'],shoe['redirect_url'], shoe['description'], shoe['brand'], shoe['gender'],
                                    shoe['color_way'], shoe['condition'], shoe['retail'], shoe['lowest_asked'],
                                    shoe['annual_high'], shoe['annual_low'], shoe['deadstock_range_high'],
                                    shoe['deadstock_range_low'], shoe['last_sale'], shoe['last_sale_date']))
        # execute UPDATE
        base64_image = base64.b64encode(requests.get(shoe['shoe_image_url']).content)
        execute_2 = cur.execute(sql_2, (base64_image, shoe['url'], shoe['shoe_name']))
        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


# ADRIAN PART
def _get_all_shoe_names() -> list:
    """ connect to db to fetch goat specific url
    ex: select goat_url from sp_shoe where shoe_name = ''
    :return:
    """
    sql = """SELECT shoe_name FROM sp_shoe"""
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        execute = cur.execute(sql)
        # commit the changes to the database
        response = [r[0] for r in cur.fetchall()]
        # close communication with the database
        cur.close()
        return response
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

def get_build_id():
    url = f"https://www.goat.com/brand/air-jordan"

    result = requests.get(url)
    soup = BeautifulSoup(result.content, "html.parser")
    script = soup.find('script', {'id': '__NEXT_DATA__'})
    script_text = script.text
    index_of_build = script_text.index('buildId')
    build_id = script_text[index_of_build+9: index_of_build+32].strip(string.punctuation)

    return build_id


def run_scrape():
    """
    :return:
    """
    # clear_data_from_database()
    shoe_query_list = _get_all_shoe_names()
    for shoe in shoe_query_list:
        scrape_stockx_data_for_specific_shoe(shoe)
        scrape_goat_data_for_specific_shoe(shoe)
        time.sleep(60)


if __name__ == '__main__':
    run_scrape()
    print("Finished")