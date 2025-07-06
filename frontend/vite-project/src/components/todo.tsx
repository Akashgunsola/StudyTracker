import React from "react";

interface todoitemprop{
   
        title: string,
        task: string,
    };


const Todoitem : React.FC<todoitemprop> = (props) =>{
    return (
        <li>
        {props.task}
        {props.title}
        
        </li>
        

    )
}

export default Todoitem;