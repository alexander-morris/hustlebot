import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ChatIcon(props) {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
        fill="#4285F4"
      />
    </Svg>
  );
}

export default ChatIcon; 