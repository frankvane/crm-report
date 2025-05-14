import React from "react";

interface GuideLinesProps {
  x?: number;
  y?: number;
  xHighlight?: boolean;
  yHighlight?: boolean;
}

const GuideLines: React.FC<GuideLinesProps> = ({
  x,
  y,
  xHighlight,
  yHighlight,
}) => (
  <>
    {x !== undefined && (
      <div
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: 1,
          height: "100%",
          borderLeft: xHighlight ? "2px solid #0050b3" : "2px solid #ccc",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
    )}
    {y !== undefined && (
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          height: 1,
          width: "100%",
          borderTop: yHighlight ? "2px solid #0050b3" : "2px solid #ccc",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />
    )}
  </>
);

export default GuideLines;
