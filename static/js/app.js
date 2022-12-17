$(function() {
    const $guessInput = $('#guess')[0] // user guess input field
    
    const makeAjaxCall = async (guess) => {
        try {
            res = await axios.post('/guess', { guess }) // submit guess to backend
            console.log(res.data.result)
        } catch (error) {
            throw new Error(`Somthing went wrong => message: ${error}`)
        }
    }
    
    const handleUserGuess = (e) => {
        e.preventDefault() // prevent browser from redirecting to a new page
        guess = $guessInput.value // extract user guess
        $guessInput.value = '' // reset input value
    
        makeAjaxCall(guess)
    }
    
    $('.word-form').on('submit', handleUserGuess)

})

