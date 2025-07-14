import React from "react";
// import ReactDOM from "react-dom/client";
import Todoitem from "./components/todo";

const App : React.FC = () => {
 return(

 <div>
  <h1>My TODO LIST</h1>
  <ol>
<Todoitem title = "Do react" task ="DONE"/>
<Todoitem title = "SLEEP" task= "Done"/>
 </ol>
  </div>
)
}

export default App;
