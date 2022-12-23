from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """ set up testing """
        self.client = app.test_client()
        app.config.update({
            "TESTING": True,
        })
        self.URL = "http://127.0.0.1:5000/"
        self.boggle_game = Boggle()

    def test_home(self):
        """ Test home page with session """
        # update session
        with self.client.session_transaction() as change_session:
            change_session["played"] = 1
            change_session["high_score"] = 3
            change_session['game_board'] = [["Y", "X", "Q", "V", "C"],
                                            ["O", "B", "D", "K", "L"],
                                            ["W", "O", "M", "A", "N"],
                                            ["Z", "W", "M", "A", "N"],
                                            ["D", "Z", "M", "A", "F"]]
        resp = self.client.get(self.URL)  # hit home page route
        self.assertEqual(resp.status_code, 200)  # success
        html = resp.get_data(as_text=True)
        # should display 3 from session
        self.assertIn('<span id="high-score">3</span>', html)
        # should display 1 from session
        self.assertIn('<span id="times-played">1</span>', html)

    def test_word_guessed(self):
        """ Test for guess route """
        with self.client:
            with self.client.session_transaction() as change_session:
                change_session["played"] = 1
                change_session["high_score"] = 3
                change_session["words_used"] = {"MAN": True}
                change_session["game_board"] = [["Y", "X", "Q", "V", "C"],
                                                ["O", "B", "D", "K", "L"],
                                                ["W", "O", "M", "A", "N"],
                                                ["Z", "W", "M", "A", "N"],
                                                ["D", "Z", "M", "A", "F"]]

        # send a POST request with json data

            resp = self.client.get(f"{self.URL}guess", data={"guess": "MAN"})

            self.assertEqual(resp.json, {
                "isDuplicate": True,
                "result": "duplicate"
            })
            self.assertEqual(resp.content_type, 'application/json')
            print('=>>>>', resp.json)

    def test_game_over(self):
        """ Test for game-over route """
        with self.client.session_transaction() as change_session:
            change_session["played"] = 9
            change_session["high_score"] = 3
            change_session["words_used"] = {"testing": True}
            change_session['game_board'] = [["Y", "X", "Q", "V", "C"],
                                            ["O", "B", "D", "K", "L"],
                                            ["W", "O", "M", "A", "N"],
                                            ["Z", "W", "M", "A", "N"],
                                            ["D", "Z", "M", "A", "F"]]
        resp = self.client.post(f"/game-over", json={"score": 9})
        html = resp.get_data(as_text=True)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json, {"gamesPlayed": 10, "score": 9})