// Game class
class Game {
    constructor(timer,score, gamesPlayed) {
        this.$timer = timer
        this.$score = score
        this.$gamesPlayed = gamesPlayed
    }
    getTime() {
        return +(this.$timer.text())
    }
    setTime(time) {
        this.$timer.text(time)
    }
    getScore() {
        return +(this.$score.text())
    }
    setScore(score) {
        this.$score.text(score)
    }
    setGamesPlayed(amnt) {
        this.$gamesPlayed.text(amnt)
    }
    isGameOver() {
        return this.getTime() <= 0
    }
    static hide($ele) {
        $ele.hide()
    }
}
// Game class initialize
const game = new Game($('.timer > span'),$('.score'), $('#times-played'))
// $(function() {
    const $guessInput = $('#guess')
    const $result = $('.result')
    const $wrapper = $('.wrapper')


    // gets called every second and updates the ui
    const updateTimer = async () => {
        let time = game.getTime()
        time -= 1
        game.setTime(time)
        // stop timer when 0 is hit and end game
        if (game.isGameOver()) { 
            clearInterval(intervalID)
            // response object is not relevant {score, gamesPlayed}
            // makes a call to the server when game is over and updates session cookies
            await gameOver()
        }
    }
    
    // start inverval and store id
    let intervalID = setInterval(updateTimer,1000)
    // get current score casted to int


    // Makes an ajax call to our backend and responds with JSON object
    const guessAjaxCall = async guess => {
        try {
            const {data} = await axios.post('/guess', { guess })
            return data
        } catch (error) {
            throw new Error(`Something went wrong => message: ${error}`)
        }
    }

    const gameOver = async () => {
        try {
            let score = game.getScore()
            const {data} = await axios.post('/game-over', {score})
            Game.hide($wrapper)
            Game.hide($('.game-over'))
            game.setScore(data.score)
            game.setGamesPlayed(data.gamesPlayed)
            return data
        } catch (error) {
            throw new Error(`Something went wrong => message: ${error}`)
        }
    }


    // populate results text content
    const showResults = ({result, isDuplicate}, wordGuessed) => {
        let score = game.getScore()
        $result.text(result)

        if (result == 'ok') { score = score + wordGuessed.length }
        if (isDuplicate) {
            $result.text("Word already used")
        }
        game.setScore(score)
    }
    

    // Handles form submission
    const handleUserGuess = async e => {
        e.preventDefault() // prevent browser from redirecting to a new page
        let guess = $guessInput.val() // extract user guess

        if (guess.length >= 3) {
            response = await guessAjaxCall(guess)
            showResults(response, guess)
            $guessInput.val('') // reset input value
        } else {
            $result.text('Must be 3 or more letters')
        }
    }
    
    $('.word-form').on('submit', handleUserGuess)
// })

