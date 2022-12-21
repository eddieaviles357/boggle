$(function() {
    const $guessInput = $('#guess')
    const $score = $('.score')
    const $highScore = $('#high-score')
    const $result = $('.result')
    const $timer = $('.timer > span')
    const $wrapper = $('.wrapper')
    const $gameOver = $('.game-over')
    const $timesPlayed = $('#times-played')
    // const $highScore = $('#high-score')

    const getScore = () => +($score.text())
    const getTime = () => +($timer.text())
    const updateElementText = ( $element, val ) => { $element.text(val) }
    const hideElement = $element => { $element.hide() }
    const isGameOver = () => getTime() <= 0
    const updateTimer = async () => {
        let time = getTime()
        time -= 1
        $timer.text(time)
        // stop timer when 0 is hit and end game
        if (isGameOver()) { 
            clearInterval(intervalID)
            let {score, gamesPlayed} = await gameOver()
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
            let score = getScore()
            const {data} = await axios.post('/game-over', {score})
            hideElement($wrapper)
            hideElement($gameOver)
            updateElementText($highScore, data.score)
            updateElementText($timesPlayed, data.gamesPlayed)
            return data
        } catch (error) {
            throw new Error(`Something went wrong => message: ${error}`)
        }
    }


    // populate results text content
    const showResults = ({result, isDuplicate}, wordGuessed) => {
        let score = getScore()
        $result.text(result)

        if (result == 'ok') { score = score + wordGuessed.length }
        if (isDuplicate) {
            $result.text("Word already used")
        }
        updateElementText($score, score)
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
})

