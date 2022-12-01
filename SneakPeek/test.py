import unittest
import scrape

class Test(unittest.TestCase):
    """
    Test for store class method execution
    """

    # TEST STOCKX SCRAPE SUCCESS
    def test_stockx_success(self):

        self.assertEqual(scrape.scrape_stockx_data_for_specific_shoe('adidas Campus 80s South Park Towelie')['shoe_name'], 'adidas Campus 80s South Park Towelie')
        self.assertEqual(scrape.scrape_stockx_data_for_specific_shoe('adidas Campus 80s South Park Towelie')['description'], 'adidas-Campus-80s-South-Park-Towelie')
        self.assertEqual(scrape.scrape_stockx_data_for_specific_shoe('adidas Campus 80s South Park Towelie')['brand'], 'adidas')
        self.assertEqual(scrape.scrape_stockx_data_for_specific_shoe('adidas Campus 80s South Park Towelie')['retail'], 100)

    # TEST INSERT INTO DB
    def test_insert_success(self):

        self.assertTrue(scrape.insert_to_db(scrape.scrape_stockx_data_for_specific_shoe('adidas Campus 80s South Park Towelie')))

    # TEST GOAT SCRAPE SUCCESS
    def test_goat_success(self):

        self.assertEqual(scrape.scrape_goat_data_for_specific_shoe('Jordan 4 Retro SE')['shoe_name'], 'Jordan 4 Retro SE')
        self.assertEqual(scrape.scrape_goat_data_for_specific_shoe('Jordan 4 Retro SE')['description'], 'Air Jordan 4 Retro SE Craft')
        self.assertEqual(scrape.scrape_goat_data_for_specific_shoe('Jordan 4 Retro SE')['color_way'], 'grey')
        self.assertEqual(scrape.scrape_goat_data_for_specific_shoe('Jordan 4 Retro SE')['retail'], 0.0)

    def test_get_shoes_to_scrape(self):
        self.assertEqual(scrape._get_all_shoe_names()[3], 'Jordan 3 Retro')
        self.assertEqual(scrape._get_all_shoe_names()[10], 'Jordan 4 Retro Military Black')
        self.assertEqual(len(scrape._get_all_shoe_names()), 13)

