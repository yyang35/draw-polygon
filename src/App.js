import "./App.css";
import Canvas from "containers/Canvas";
import React,  {useState} from "react";

function App() {

    const [points, setPoints] = useState([]);
    const [enableDrawing, setEnableDrawing] = useState(false)

    const updatePoints = (newNumber) => {
        setPoints(newNumber);
    };

    const handleEnableDrawing =() => {
        console.log(enableDrawing)
        setEnableDrawing((enableDrawing) => (!enableDrawing))
    }

  return (
    <div className="App">
    <h3 className="header">Fix and Label Masked Cell on Omnipose <button id="mode-toggle" className="modeButton">Mode</button></h3>

    <div class="mainContainer">

        <div className="row">
        Need to drage to draw the ployn, Need to drage to draw the ployn, Need to drage to draw the ployn, Need to drage
        to draw the ployn, Need to drage to draw the ployn,Need to drage to draw the ployn, Need to drage to draw the
        </div>

        <div class="columnLeft">
        <h4 class="title">
        Workspace: Drawing Polygon
         <button class="switch" onClick={handleEnableDrawing}>
            {enableDrawing? 'Disable':'Enable'}
         </button>
          <button className="switch" onClick={handleEnableDrawing}>
             Undo
          </button>
           <button className="switch" onClick={handleEnableDrawing}>
              Clear
           </button>
        </h4>
          <Canvas updatePoints={updatePoints} enableDrawing={enableDrawing}/>
        </div>

        <div class="columnRight">
        <h4 className="title">Masks Overview</h4>
         <div className="normalContainer">
         <div style={{ height: '250px' }}>{JSON.stringify(points)}</div>
         <div>
         </div>
          </div>
        </div>

         <div className="columnRight">
        <h4 className="title">Data & Label</h4>
         <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(points)}</pre>
         <input id="numberInput" type="number" placeholder="Enter cell label" />
         <button>Fill Polygon</button>
        </div>



    </div>
    </div>
  );
}

export default App;
