$(function() {
    const $guessInput = $('#guess')
    const $score = $('.score')
    const $result = $('.result')
    // Makes an ajax call to our backend and responds with JSON object
    const makeAjaxCall = async guess => {
        try {
            const {data} = await axios.post('/guess', { guess })
            return data.result
        } catch (error) {
            throw new Error(`Somthing went wrong => message: ${error}`)
        }
    }
    // populate results text content
    const showResults = (rslts, wordGuessed) => {
        score = +($score.text()) // get score and cast to int
        $result.text(rslts)

        if (rslts == 'ok'){
            score = score + wordGuessed.length
        }
        $score.text(score)
    }
    
    // Handles form submission
    const handleUserGuess = async e => {
        e.preventDefault() // prevent browser from redirecting to a new page
        guess = $guessInput.val() // extract user guess

        if (guess.length >= 3) {
            response = await makeAjaxCall(guess)
            showResults(response, guess)
            $guessInput.val('') // reset input value
        } else {
            $result.text('Must be 3 or more letters')
        }

    }
    
    $('.word-form').on('submit', handleUserGuess)

    
})

