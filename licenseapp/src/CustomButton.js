import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import "./CustomButton.css";

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
    }, 40);
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
        borderRadius: `${hovered ? 10 : 100}px`,
        boxShadow: "3px 3px 5px var(--btn-shadow-color)",
        cursor: "pointer",
        backgroundColor: "var(--btn-default-color)",
        padding: "3px 10px",
        marginLeft: "20px",
        color: "var(--btn-text-color)",
        fontFamily: "var(--font-SpoqaHanSansNeo-Medium)",
        fontSize: "30px",
        textAlign: "left",
        lineHeight: "25px",
        textIndent: "-4px",
      },
      buttonHover: {
        backgroundColor: "var(--btn-active-color)",
      },
      content: {
        display: `${hovered ? 'inline-block' : 'none'}`,
        marginLeft: '10px',
        opacity: showText ? 1 : 0,
        transition: "opacity 0.2s ease",
      },
      letter: {
        display: "inline-block",
        marginLeft: '3px',
      },
      icon: {
        fontSize: "20px",
        margin: "3px 0px 2px 2px",
      },
    };

    const displayText = text.slice(0, letterIndex);

    return (
      <Motion
        defaultStyle={{ width: 35 }}
        style={{
          width: spring(hovered ? (text.length * 10 + 35) : 35, { stiffness: 300, damping: 20 }),
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
                ...(hovered && styles.buttonHover),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          </div>
        )}
      </Motion>
    );
  }
}

export default CustomButton;
