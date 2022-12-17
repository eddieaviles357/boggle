from boggle import Boggle
from flask import Flask, session, request, redirect, render_template, jsonify
# from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SecretPhrase'
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
# debug = DebugToolbarExtension(app)

boggle_game = Boggle()

# @app.before_request
# def print_cookies():
#     print('****************')
#     print('COOKIES', session.get('game_board'))
#     print('COOKIES', session.get('played'))
#     print('****************')


@app.route("/")
def home():
    """ Initialize game board and times played """
    session['game_board'] = boggle_game.make_board()
    session['played'] = session.get('played', 0) + 1
    return render_template("index.html", game_board=session['game_board'])


@app.route("/guess", methods=["POST"])
def word_guessed():
    """ Checks guessed word if it is valid """

    # get user guess
    user_guess = request.json['guess']
    # get board cookie from client
    board = session['game_board']
    # is the word valid
    result = boggle_game.check_valid_word(board, user_guess)
    # send json over to client with result of word submitted
    return jsonify({"result": result})
