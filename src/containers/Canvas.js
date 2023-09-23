import React, { useMemo, useRef, useState, useEffect } from "react";
import PolygonAnnotation from "components/PolygonAnnotation";
import { Stage, Layer, Image } from "react-konva";
import Button from "components/Button";
const videoSource = "./download.png";
const Canvas = ({updatePoints, enableDrawing}) => {
  const [image, setImage] = useState();
  const imageRef = useRef(null);
  const [points, setPoints] = useState([]);

  const [size, setSize] = useState({});

  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);

  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

const videoElement = useMemo(() => {
  const element = new window.Image();
  element.width = 1000;
  element.src = videoSource;

  element.onload = () => {
    const originalWidth = element.naturalWidth;
    const originalHeight = element.naturalHeight;

    // Calculate the new height based on the aspect ratio
    const newHeight = (originalHeight / originalWidth) * element.width;
    element.height = newHeight;
  };

  return element;
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [videoSource]);

  useEffect(() => {
    const onload = function () {
      setSize({
        width: videoElement.width,
        height: videoElement.height,
      });
      setImage(videoElement);
      imageRef.current = videoElement;
    };
    videoElement.addEventListener("load", onload);
    return () => {
      videoElement.removeEventListener("load", onload);
    };
  }, [videoElement]);

   useEffect(() => {
       updatePoints(points)
  }, [points]);




    const getMousePos = (stage) => {
  const mousePos = stage.getPointerPosition();
  const scaledMousePos = [
    Math.round(mousePos.x / stageScale),
    Math.round(mousePos.y / stageScale)
  ];
  return scaledMousePos;
};

  //drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };
  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  const handleMouseWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);

    const newPos = {
      x:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };

    setStagePosition(newPos);
  };

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [points, isPolyComplete, position]);
  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
  };
  const reset = () => {
    setPoints([]);
    setPolyComplete(false);
  };
  const handleGroupDragEnd = (e) => {
    //drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
      updatePoints(points);
    }
  };


  return (
      <div>
    <Stage
          width={size.width || 650}
          height={size.height || 302}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
        >
        <Layer scaleX={stageScale} scaleY={stageScale} x={stagePosition.x} y={stagePosition.y}>
        <Image
          ref={imageRef}
          image={image}
          x={stagePosition.x}
          y={stagePosition.y}
          width={size.width}
          height={size.height}
        />
      <PolygonAnnotation
        points={points}
        flattenedPoints={flattenedPoints}
        handlePointDragMove={handlePointDragMove}
        handleGroupDragEnd={handleGroupDragEnd}
        handleMouseOverStartPoint={handleMouseOverStartPoint}
        handleMouseOutStartPoint={handleMouseOutStartPoint}
        isFinished={isPolyComplete}
        stageScale={stageScale}
        x_offset={stagePosition.x}
        y_offset={stagePosition.y}
      />
    </Layer>
        </Stage>
        <div>
          <Button name="Undo" onClick={undo} />
          <Button name="Reset" onClick={reset} />
        </div>
        </div>
  );
};

export default Canvas;
