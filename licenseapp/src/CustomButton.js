import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import "./CustomButton.css";

class CustomButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      showText: false, 
    };
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handleOnClick = () => {
    const { handleOnClick } = this.props;
    if (handleOnClick) {
      handleOnClick();
    }
  };
  
  componentDidMount() {
    // 컴포넌트가 마운트되면 0.5초 후에 텍스트를 보이게 설정
    setTimeout(() => {
      this.setState({ showText: true });
    }, 500);
  }

  render() {
    const { icon, text } = this.props;
    const { hovered, showText } = this.state;

    const styles = {
        box: {
        },
        button: {
            display: 'inline-block',
            width: "30px",
            height: "30px",
            borderRadius: `${hovered ? 10 : 100}px`,
            boxShadow: "3px 3px 5px var(--btn-shadow-color)",
            cursor: "pointer",
            padding: "0 10px",
            backgroundColor: "var(--btn-default-color)",
            padding: "3px 10px",
            marginLeft: "20px",
            color: "var(--btn-text-color)",
            fontFamily: "var(--font-SpoqaHanSansNeo-Medium)",
            fontSize: "30px",
            textAlign: "right",
            lineHeight: "25px",
            textIndent: "-4px",
            //transform: `translateX(${hovered ? 70 : 0}px)`, // hover 상태에 따라 오른쪽으로 이동
            //transition: "transform 0.3s ease", // 트랜지션 효과 추가
        },
        buttonHover: {
            backgroundColor: "var(--btn-active-color)",
        },
        content: {
            display: 'inline-block',
        },
        letter: {
          display: 'inline-block',
          transition: "opacity 0.5s ease", // 글자 나타내는 애니메이션
          opacity: showText ? 1 : 0, // showText 상태에 따라 보이거나 안 보이도록 설정
          transform: `translateY(${showText ? 0 : 20}px)`, // 텍스트가 나타날 때 약간의 이동 효과 추가
        },
    };

    // 텍스트를 한 글자씩 나누어서 배열로 만듭니다.
    const letters = text.split("");
    return (
      <Motion
        defaultStyle={{ width: 30 }} // 초기 가로 사이즈
        style={{ 
          width: spring(hovered ? 150 : 30) // 가로 사이즈 변경
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
                style={{ ...styles.button, width: `${style.width}px`, ...(hovered && styles.buttonHover) }} // 스타일 객체와 Motion의 가로 사이즈를 결합
                >
                {icon}
            </div>
            {hovered && 
              <Motion
                defaultStyle={{ opacity: 0 }}
                style={{ opacity: spring(1) }}
              >
                {(style) => (
                  <div style={{ ...styles.content, opacity: style.opacity }}>
                    {letters.map((letter, index) => (
                      <span key={index} style={styles.letter}>{letter}</span>
                    ))}
                  </div>
                )}
              </Motion>
            }
          </div>
        )}
      </Motion>
    );
  }
}

export default CustomButton;
