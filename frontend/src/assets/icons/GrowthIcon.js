import * as React from "react";
import Svg, { Path } from "react-native-svg";

function GrowthIcon(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z"
        fill="#28A745"
      />
    </Svg>
  );
}

export default GrowthIcon; 