import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import logo from './robo.png';

// Set local storage key and load saved responses (if there are any)
const LOCAL_STORAGE_KEY = 'ai.responses';
let storedResponses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
if (!storedResponses) storedResponses = [];

const App = () => {
    //State for storing responses from API
    const [responses, setResponses] = useState(storedResponses);

    //click handler for submit button
    const handleSubmit = async e => {
        e.preventDefault();
        if (e.target.textInput.value) {
            const prompt = e.target.textInput.value;
            e.target.textInput.value = '';

            //body for API post request
            const data = JSON.stringify({
                "prompt": prompt,
                "max_tokens": 2000,
                "temperature": 1,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
              });
              
              //axious config object API post request
              const config = {
                method: 'post',
                url: `https://api.openai.com/v1/engines/text-curie-001/completions`,
                headers: { 
                  'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`, 
                  'Content-Type': 'application/json'
                },
                data : data
              };

              //API post call
              axios(config)
                .then(function (response) {
                //add new response to responses state
                setResponses(prev => 
                    [
                        {
                            prompt, 
                            response: response.data.choices[0].text
                        }, 
                        ...prev
                    ]) 
            })
            .catch(function (error) {
                console.log(error);
            });
        } else {
            return;
        }
    }

    //store new responses in local storage when responses state changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
    }, [responses]);
    
    //clear responses click handler
    const clearResponses = () => setResponses([]);


    return (
        <div id='mainContainer'>
          <div id='h1Container'>
          <img id='logo' src={logo} />
            <h1>Robo Talk</h1>
          </div>
            <p id='intro'> Ask OpenAI's artificial intelligence anything! Suggestions include: Ideas for business ventures, short stories or poems, or just have a conversation with it. Have fun!</p>
            <form onSubmit={handleSubmit} id='inputForm'>
                <input type='textarea' id='textInput' placeholder='Enter prompt here!'/>
                <input type='submit'  id='submitButton' />
            </form>
            {responses.length > 0 &&
                <div id="responseContainer">
                    {responses.map(e => {
                        return (
                            <div key={uuidv4()} className="responses">
                                <p className="promptP"><strong>PROMPT:</strong> {e.prompt}</p>
                                <br />
                                <p className='responseP'><strong>RESPONSE:</strong> {e.response}</p>
                            </div>
                        )
                    })} 
                    <button onClick={clearResponses}>Clear</button>   
                </div>
            }
        </div>
    )
}

export { App };