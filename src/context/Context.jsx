import { createContext, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const[input,setinput]=useState("");
    const[recentprompt,setrecentprompt]=useState("");
    const[prevprompt,setprevprompt]=useState([]);
    const[showresult,setshowresult]=useState(false);
    const[loading,setloading]=useState(false);
    const[resultData,setresultData]=useState("");

    const delayPara = (index,nextWord)=>{
        setTimeout(function (){
            setresultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = ()=>{
        setloading(false)
        setshowresult(false)
    }
 
const onSent = async (prompt) =>{
    setresultData("")
    setloading(true)
    setshowresult(true)
    let response;
    if(prompt !== undefined){
        response=await run(prompt)
        setrecentprompt(prompt)
    } 
    else{
        setprevprompt(prev=>[...prev,input])
        setrecentprompt(input)
        response=await run(input)
    }
    let responseArray = response.split("**");
    let newResponse="";
    for(let i=0 ; i < responseArray.length; i++)
    {
        if(i==0 || i%2 !==1){
            newResponse += responseArray[i];
        }else{
            newResponse +="<b>"+responseArray[i]+"</b>";
        }
    }
    let newResponse2=newResponse.split("*").join("</br>")
    let newResponseArray = newResponse2.split(" ");
    for(let i=0; i<newResponseArray.length;i++)
    {
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")
    }
    setloading(false)
    setinput("")
}

// onSent("What is react JS")
    const Contextvalue ={
        prevprompt,
        setprevprompt,
        onSent,
        setrecentprompt,
        recentprompt,
        showresult,
        loading,
        resultData,
        input,
        setinput,
        newChat
    }

    return(
        <Context.Provider value={Contextvalue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;