import React from "react";

interface todoitemprop{
   
        title: string,
        task: string,
    };


const Todoitem : React.FC<todoitemprop> = (props) =>{
    return (
        <li>
        <h2>this is my title </h2>{props.title}
        <h2>this is my task</h2>{props.task}
        
        
        </li>
        

    )
}

export default Todoitem;