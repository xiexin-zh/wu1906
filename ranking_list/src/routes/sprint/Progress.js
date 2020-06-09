import React, { useState } from "react";
import styles from "./index.scss";
const Progress = ({ done }) => {
  const [style, setStyle] = useState({});
	const [userStyle, setUserStyle] = useState({});
  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: done === 0 ? 0 : `${done}%`,
    };
		setStyle(newStyle);
		
		const nStyle = {
      opacity: 1,
			width: done === 0 ? 0 : `${done}%`,
			justifyContent: done === 0 ? 'center' : 'flex-end',
			paddingLeft:  done === 0 ? '7px' : 0,
    };
		setUserStyle(nStyle);
  }, 200);

  return (
    <>
      <div className={styles.userContent}>
        <div className={styles.progressUser} style={userStyle}>
          <img
            src={require("../../assets/user.png")}
            style={{ width: "20px", height: "20px" }}
            alt=""
          />
        </div>
      </div>
      <div className={styles.progress}>
        <div className={styles.progressDone} style={style}>
          {done <= 14 ? "" : `${done}%`}
        </div>
      </div>
    </>
  );
};

export default Progress;
