import { useReducer,useEffect, useState } from "react";
import { apiGet } from "./config";


function showsReducer(prevSate,action) {
switch(action.type) {
case 'ADD' : {
return[...prevSate,action.showId]
}

case 'REMOVE':{
return prevSate.filter((showId) => showId !== action.showId);
}
default: return prevSate;
}
}

function usePersistedReducer(reducer,initialSate, key) {   
const[state,dispatch] = useReducer(reducer,initialSate, (initial) =>{

const presisted = localStorage.getItem(key);
return presisted ? JSON.parse(presisted) : initial;
});

useEffect(() => {
localStorage.setItem(key, JSON.stringify(state))
},[state,key]);

return [state,dispatch];
}

export  function useShows(key = 'shows') {
    return usePersistedReducer(showsReducer, [],key);
};


export function useLastQuery(key = 'LastQuery'){

const [input, setInput] = useState( () => {
const presisted = sessionStorage.getItem(key);

return presisted ? JSON.parse(presisted) : "";
});
 

const setPersistedInput = (newSate) =>{
  setInput(newSate);  
  sessionStorage.setItem(key,JSON.stringify(newSate))
}
return [input,setPersistedInput];
}




const reducer = (prevState,action) =>{
    switch(action.type){
    
   case'FETCH_SUCCESS':{
      return{isLoading:false, error:null, show:action.show}
   }
   
   case'FETCH_FAILED':{
      return{...prevState,isLoading:false,error:action.error}
   }
      
    default:return prevState;
    }
  };


export function useShow(showId){
    const [state,dispatch] = useReducer
(reducer,{
    show:null,
    isLoading:true,
    error:null
}
);

useEffect(() => {
let isMounted = true; 

apiGet(`/shows/${showId}?embed[]=seasons&embed[]=cast`)
.then(resutls =>{
    if(isMounted){
    dispatch({type: 'FETCH_SUCCESS',show:resutls}) 

}
})
.catch(err => {
    if(isMounted){
    dispatch({type: 'FETCH_FAILED',error:err.massage}) 
}
});

return () =>{
    isMounted = false;
}

}, [showId]);

return state;
}