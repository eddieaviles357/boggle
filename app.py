from boggle import Boggle
from flask import Flask, session, request, render_template, jsonify
# from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "SecretPhrase"
# app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
# debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route("/")
def home():
    """ Initialize game """

    game_board = session["game_board"] = boggle_game.make_board()
    # games played
    times_played = session["played"] = session.get("played", 0)
    # highest score
    high_score = session["high_score"] = session.get("high_score", 0)
    # duplicate words
    session["words_used"] = {}
    return render_template("index.html",
                           game_board=game_board,
                           high_score=high_score,
                           times_played=times_played)


@app.route("/guess")
def word_guessed():
    """ Checks guessed word if it is valid """
    # get user guess
    user_guess = request.args.get("guess", "MAN")
    # get board cookie from client
    board = session["game_board"]
    # is the word valid
    result = boggle_game.check_valid_word(board, user_guess)

    # get duplicate words
    duplicates = session["words_used"]
    is_word_used = user_guess in duplicates
    # valid word is dulicate will be used on client side so score won't get updated
    if is_word_used:
        result = 'duplicate'

    duplicates[user_guess] = True
    session["words_used"] = duplicates

    # send json over to client with result of word submitted
    return jsonify({"result": result, "isDuplicate": is_word_used})


@app.route("/game-over", methods=["POST"])
def game_over():
    """ Update session played amount and high score """
    # played one game so we add one and update session
    times_played = session["played"] + 1
    session["played"] = times_played
    # get high score
    high_score = max(session["high_score"], request.json["score"])
    session["high_score"] = high_score

    return jsonify({"gamesPlayed": times_played, "score": high_score})
