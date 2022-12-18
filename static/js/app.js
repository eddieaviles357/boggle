$(function() {
    const $guessInput = $('#guess')[0] // user guess input field

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
    const showResults = rslts => {
        // $result.value = rslts
        $('#result').html(rslts)
    }
    
    // Handles form submission
    const handleUserGuess = async e => {
        e.preventDefault() // prevent browser from redirecting to a new page
        guess = $guessInput.value // extract user guess
        $guessInput.value = '' // reset input value
    
        response = await makeAjaxCall(guess)
        showResults(response)
    }
    
    $('.word-form').on('submit', handleUserGuess)

    
})

