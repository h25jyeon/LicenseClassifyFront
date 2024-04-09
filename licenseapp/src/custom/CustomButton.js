import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import "../css/CustomButton.css";

class CustomButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      showText: false,
      letterIndex: 0,
    };
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
    this.showText();
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
    this.hideText();
  };

  handleOnClick = () => {
    const { handleOnClick } = this.props;
    if (handleOnClick) {
      handleOnClick();
    }
  };

  showText = () => {
    this.textTimer = setInterval(() => {
      this.setState((prevState) => ({
        letterIndex: prevState.letterIndex + 1,
        showText: true,
      }));
    }, 36);
  };

  hideText = () => {
    clearInterval(this.textTimer);
    this.setState({
      showText: false,
      letterIndex: 0,
    });
  };

  render() {
    const { icon: Icon, text } = this.props;
    const { hovered, showText, letterIndex } = this.state;

    const styles = {
      box: {},
      button: {
        display: "inline-block",
        height: '35px',
        boxShadow: "3px 3px 5px var(--btn-shadow-color)",
        cursor: "pointer",
        backgroundColor: "var(--btn-default-color)",
        color: "var(--btn-text-color)",
        fontFamily: "var(--font-SpoqaHanSansNeo-Medium)",
        textAlign: "left",
        position: 'relative',
      },
      buttonHover: {
        backgroundColor: "var(--btn-active-color)",
      },
      content: {
        position: 'absolute',
        left: '58%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: showText ? 1 : 0,
        transition: "opacity 0.2s ease",
        whiteSpace: 'nowrap',
      },
      letter: {
        textIndent:'3px',
      },
      icon: {
        fontSize: "20px",
        margin: "0px 0px 2px 2px",
      },
    };

    const displayText = text.slice(0, letterIndex);

    return (
      <Motion
        defaultStyle={{ width: 35, borderRadius : 100 }}
        style={{
          width: spring(hovered ? (text.length * 13) : 35, { stiffness: 300, damping: 20 }),
          borderRadius: spring(hovered ? 10 : 100, { stiffness: 500, damping: 27 }),
        }}
      >
        {(style) => (
          <div
            onClick={this.handleOnClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            style={styles.box}
          >
            <div
              className={hovered ? "customBtn active" : "customBtn"}
              style={{
                ...styles.button,
                width: `${style.width}px`,
                borderRadius: `${style.borderRadius}px`,
                ...(hovered && styles.buttonHover),
              }}
            >
              {Icon && <Icon style={styles.icon} />}
              <div style={{ ...styles.content }}>
                {displayText.split("").map((letter, index) => (
                  <span key={index} style={styles.letter}>
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Motion>
    );
  }
}

export default CustomButton;
