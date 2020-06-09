import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./index.css";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function translateY(value) {
//   return `translateY(${value}px)`;
// }

function DynamicBarChart(props) {
  const [dataQueue, setDataQueue] = useState([]);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [highestValue, setHighestValue] = useState(0);
  const [currentValues, setCurrentValues] = useState({});
  // const [firstRun, setFirstRun] = useState(false);
  const [afterClick, setAfterClick] = useState(false);
  let iterationTimeoutHolder = null;

  function start() {
    if (activeItemIdx > 1) {
      return;
    }
    if (props.onRunStart) {
      props.onRunStart();
    }
    nextStep(true);
  }

  function setNextValues() {
    if (!dataQueue || !dataQueue.name) {
      iterationTimeoutHolder = null;
      if (props.onRunEnd) {
        props.onRunEnd();
      }
      return;
    }

    const roundData = dataQueue.values;
    const nextValues = {};
    let highestValue = 0;
    roundData.map((c) => {
      nextValues[c.id] = {
        ...c,
        color: c.color || (currentValues[c.id] || {}).color || getRandomColor(),
      };

      if (Math.abs(c.value) > highestValue) {
        highestValue = Math.abs(c.value);
      }

      return c;
    });

    setCurrentValues(nextValues);
    setHighestValue(highestValue);
    setActiveItemIdx(activeItemIdx + 1);
  }

  function nextStep(firstRun = false) {
    // setFirstRun(firstRun);
    setNextValues();
  }

  useEffect(() => {
    setDataQueue(props.data);
  });

  useEffect(() => {
    if (props.startAutomatically) {
      start();
    } else {
      setNextValues();
    }
  }, [dataQueue]);

  useEffect(() => {
    if (props.startAutomatically || afterClick) {
      iterationTimeoutHolder = window.setTimeout(
        nextStep,
        props.iterationTimeout
      );
    }

    return () => {
      if (iterationTimeoutHolder) {
        window.clearTimeout(iterationTimeoutHolder);
      }
    };
  }, [activeItemIdx, afterClick]);

  const keys = Object.keys(currentValues);

  const {
    barGapSize,
    barHeight,
    baseline,
    iterationTimeout,
    chartWrapperStyles,
    mainWrapperStyles,
    // iterationTitleStyles,
    labelStyles,
    baselineStyles,
    // showTitle,
    // showDottedLine,
    showAvatar,
  } = props;
  const maxValue = highestValue / 0.85;
  const sortedCurrentValues = keys.sort(
    (a, b) => currentValues[b].value - currentValues[a].value
  );
  const hasBaseline = baseline !== null && !isNaN(baseline);

  const chartBar = classnames({
    [styles.chartBars]: true,
    [styles.withBaseline]: hasBaseline,
  });

  const barWrapper = classnames({
    [styles.barWrapper]: true,
    [styles.behindBaseline]: hasBaseline,
  });
  const textSize = barHeight <= 10 ? 14 : barHeight > 40 ? 40 : barHeight - 3;

  return (
    <div className={styles.liveChart} style={mainWrapperStyles}>
      {
        <React.Fragment>
          <section className={styles.chart} style={chartWrapperStyles}>
            {hasBaseline && (
              <div className={styles.baseline} style={baselineStyles}>
                <span>{baseline}</span>
              </div>
            )}
            <div
              className={chartBar}
              style={{ height: (barHeight + barGapSize) * keys.length }}
            >
              {sortedCurrentValues.map((key, idx) => {
                const currentValueData = currentValues[key];
                const value = hasBaseline
                  ? (currentValueData.value || baseline) - baseline
                  : currentValueData.value;
                let width = Math.abs((value / maxValue) * 100);
                let behindbaseline = false;
                if (hasBaseline && currentValueData.value < baseline) {
                  behindbaseline = true;
                }

                if (hasBaseline) {
                  width = width / 2;
                }

                let widthStr;
                if (isNaN(width) || !width) {
                  widthStr = "1px";
                } else {
                  widthStr = `${width}%`;
                }

                const avatarHeight = barHeight;// barHeight - 2;

                // 计算颜色范围长度
                const allLength = currentValueData.value;
                let point1 = 0;
                let point2 = 0;
                let point3 = 0;

                if (allLength < 120) {
                  point1 = "100%";
                } else if (120 <= allLength && allLength < 360) {
                  point1 = (120 / allLength) * 100 + "%";
                  point2 = ((allLength - 120) / allLength) * 100 + "%";
                } else {
                  point1 = (120 / allLength) * 100 + "%";
                  point2 = (240 / allLength) * 100 + "%";
                  point3 = ((allLength - 360) / allLength) * 100 + "%";
                }

                let barWidth = 0;
                const barItem = document.getElementById(`bar_${key}`);
                if (barItem) {
                  barWidth = barItem.offsetWidth;
                }

                let userName = currentValueData.label
                  ? currentValueData.label.substr(
                      currentValueData.label.length - 2,
                      currentValueData.label.length + 1
                    )
                  : "";

                return (
                  <div
                    className={barWrapper}
                    style={{
                      top: (barHeight + barGapSize) * idx,
                      transitionDuration: iterationTimeout / 1000,
                    }}
                    key={`bar_${key}`}
                  >
                    <label style={labelStyles}>
                      <span
                        style={{ fontSize: textSize + "px", color: "#999" }}
                      >
                        {idx + 4}
                      </span>
                      <div
                        className={styles.avatarBox}
                        style={{
                          borderRadius: "50%",
                          width: avatarHeight + "px",
                          height: avatarHeight + "px",
                        }}
                      >
                        {!currentValueData.avatar && showAvatar && (
                          <span
                            className={styles.avatar}
                            style={{
                              backgroundColor: "#ccc",
                              width: avatarHeight + 15 + "px",
                              height: avatarHeight + 15 + "px",
                              fontSize: textSize / 2 + "px",
                              color: "#fff",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {userName}
                          </span>
                        )}
                        {currentValueData.avatar && showAvatar && (
                          <img
                            src={currentValueData.avatar}
                            alt=""
                            style={{
                              borderRadius: "50%",
                              width: avatarHeight + 15 + "px",
                              height: avatarHeight + 15 + "px",
                            }}
                          />
                        )}
                      </div>
                    </label>

                    <div
                      id="allWidth"
                      className={styles.barBack}
                      style={{
                        height: barHeight,
                      }}
                    >
                      <div
                        className={styles.bar}
                        id={`bar_${key}`}
                        style={{
                          height: barHeight,
                          width: widthStr,
                          // background: "transparent",
                        }}
                      >
                        <div
                          className={styles.colorCover1}
                          style={{ width: point1 }}
                        ></div>
                        {currentValueData.value > 120 && (
                          <div
                            className={styles.colorCover2}
                            style={{ width: point2 }}
                          >
                            <div className={styles.shadowColor2}></div>
                          </div>
                        )}
                        {currentValueData.value > 360 && (
                          <div
                            className={styles.colorCover3}
                            style={{ width: point3 }}
                          >
                            <div className={styles.shadowColor3}></div>
                          </div>
                        )}

                        {barWidth >= 50 && (
                          <div
                            className={styles.flame}
                            style={{
                              height: barHeight + "px",
                              fontSize:
                                barWidth <= 120 ? textSize / 2 + "px" : textSize - 4  + "px",
                            }}
                          >
                            {currentValueData.label || ""}
                          </div>
                        )}
                      </div>
                      <div className={styles.remain}>
                        <span
                          className={styles.value}
                          style={{
                            fontSize: barHeight <= 14 ? textSize / 2 + "px" : textSize - 4 + 'px',
                            height: barHeight,
                            lineHeight: barHeight + "px",
                          }}
                        >
                          {"-" + currentValueData.value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </React.Fragment>
      }
      {props.showStartButton && (
        <button
          className={styles.startButton}
          onClick={() => setAfterClick(true)}
          style={props.startButtonStyles}
        >
          {props.startButtonText}
        </button>
      )}
    </div>
  );
}

DynamicBarChart.propTypes = {
  startAutomatically: PropTypes.bool,
  // showTitle: PropTypes.bool,
  iterationTimeout: PropTypes.number,
  data: PropTypes.object,
  startRunningTimeout: PropTypes.number,
  barHeight: PropTypes.number,
  barGapSize: PropTypes.number,
  baseline: PropTypes.number,
  showStartButton: PropTypes.bool,
  startButtonText: PropTypes.string,
  mainWrapperStyles: PropTypes.object,
  chartWrapperStyles: PropTypes.object,
  baselineStyles: PropTypes.object,
  // iterationTitleStyles: PropTypes.object,
  labelStyles: PropTypes.object,
  startButtonStyles: PropTypes.object,
  onRunStart: PropTypes.func,
  onRunEnd: PropTypes.func,
  // showDottedLine: PropTypes.bool,
  showAvatar: PropTypes.bool,
};

DynamicBarChart.defaultProps = {
  startAutomatically: true,
  // showTitle: true,
  iterationTimeout: 200,
  data: [],
  startRunningTimeout: 0,
  barHeight: 50,
  barGapSize: 20,
  baseline: null,
  showStartButton: false,
  startButtonText: "Start",
  mainWrapperStyles: {},
  chartWrapperStyles: {},
  baselineStyles: {},
  // iterationTitleStyles: {},
  labelStyles: {},
  startButtonStyles: {},
  onRunStart: null,
  onRunEnd: null,
  // showDottedLine: true,
  showAvatar: true,
};

export { DynamicBarChart };
