import React, { useState } from "react";
import { Line, Circle, Group } from "react-konva";
import { minMax, dragBoundFunc } from "utils";
/**
 *
 * @param {minMaxX} props
 * minMaxX[0]=>minX
 * minMaxX[1]=>maxX
 *
 */
const PolygonAnnotation = (props) => {
  const {
    points,
    flattenedPoints,
    isFinished,
    handlePointDragMove,
    handleGroupDragEnd,
    handleMouseOverStartPoint,
    handleMouseOutStartPoint,
    stageScale,
  } = props;
  const vertexRadius = 3 /stageScale;;

  const [stage, setStage] = useState();
  const handleGroupMouseOver = (e) => {
    if (!isFinished) return;
    e.target.getStage().container().style.cursor = "move";
    setStage(e.target.getStage());
  };
  const handleGroupMouseOut = (e) => {
    e.target.getStage().container().style.cursor = "default";
  };
  const [minMaxX, setMinMaxX] = useState([0, 0]); //min and max in x axis
  const [minMaxY, setMinMaxY] = useState([0, 0]); //min and max in y axis
  const handleGroupDragStart = (e) => {
    let arrX = points.map((p) => p[0]);
    let arrY = points.map((p) => p[1]);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  };
  const groupDragBound = (pos) => {
    let { x , y} = pos / stageScale;
    const sw = stage.width();
    const sh = stage.height();
    if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
    if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
    return { x, y };
  };

  return (
    <Group
      name="polygon"
      draggable={isFinished}
      onDragStart={handleGroupDragStart}
      onDragEnd={handleGroupDragEnd}
      dragBoundFunc={groupDragBound}
      onMouseOver={handleGroupMouseOver}
      onMouseOut={handleGroupMouseOut}
    >
      <Line
        points={flattenedPoints}
        stroke="#00F1FF"
        strokeWidth={1/stageScale}
        closed={isFinished}
        fill="rgb(140,30,255,0.1)"
      />
      {points.map((point, index) => {
        const x = point[0] ;
        const y = point[1];
        const startPointAttr =
          index === 0
            ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
              }
            : null;
        return (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={vertexRadius}
            fill="#FF019A"
            stroke="#00F1FF"
            strokeWidth={1/stageScale}
            draggable
            onDragMove={handlePointDragMove}
            dragBoundFunc={(pos) =>
              dragBoundFunc(stage.width(), stage.height(), vertexRadius, pos)
            }
            {...startPointAttr}
          />
        );
      })}
    </Group>
  );
};

export default PolygonAnnotation;
