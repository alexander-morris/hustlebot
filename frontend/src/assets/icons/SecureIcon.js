import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SecureIcon(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
        fill="#FFC107"
      />
    </Svg>
  );
}

export default SecureIcon; 