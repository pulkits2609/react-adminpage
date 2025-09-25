//we use the useState because : 
// Think of it as a box that holds a value for your component — like variables, but React keeps track of them so when they change, your component re-renders.


//why we use the useState
// This is like telling React:
// “Hey, after rendering, run this extra code (like fetching data, setting up timers, or logging).”

// It’s mainly for side effects — things outside the normal rendering, like API calls.

//⚡ If you don’t use useEffect, your API call will run every single time React re-renders the component, which can cause infinite loops 🔄.

import React, { useState , useEffect} from 'react';

function ApiGet(){
    //first we create a variable to hold the data
    const [name,setName] = useState(null);

    //useEffect runs after the component is first rendered
    useEffect(()=>{
        fetch("http://localhost:4000")
        .then((response)=>{
            if(!response.ok){
                throw new Error("Response was not ok")
            }
            return response.json() //this converts response to json
        })
        .then((result)=>{
            setName(result.message);
        });
    },[]); //[] means to run only once when the component loads

    //now we render the data
    return(
        <div><h1>{name}</h1></div>
    )
}

export default ApiGet