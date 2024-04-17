import React from "react";
import Select from "react-select";

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue 
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedValue !== prevState.selectedValue) {
      return {
        selectedValue: nextProps.selectedValue
      };
    }
    return null;
  }
  
  handleSelectChange = (selectedOption) => {
    const { handleSelectChange, id } = this.props;
    console.log(selectedOption.value);
    handleSelectChange(id, selectedOption.value);
    this.setState({ selectedValue: selectedOption.value }); 
  };

  render() {
    const { id, options, fontColor, backgroundColor, selectedColor, controlColor, myFontSize, hoverColor,
            selectedBackgroundColor, controlBackgroundColor, hoverBackgroundColor, width, menuPlacement } = this.props;
    const { selectedValue } = this.state;

    const styles = {
      option: (provided, state) => ({
        ...provided,
        whiteSpace: 'pre',
        fontFamily: state.isSelected ? 'var(--font-SpoqaHanSansNeo-Medium)' : 'var(--font-SpoqaHanSansNeo-Regular)',
        color: state.isSelected ? selectedColor : fontColor,
        backgroundColor: state.isSelected ? selectedBackgroundColor : backgroundColor,
        fontSize: myFontSize,

        '&:hover': {
          backgroundColor: hoverBackgroundColor,
          color: hoverColor
        }
      }),
      control: (provided, state) => ({
        ...provided,
        width: width,
        whiteSpace: 'pre',
        backgroundColor: controlBackgroundColor,
        color: controlColor,
        borderColor: state.isFocused ? 'var(--btn-default-color)' : 'rgba(0,0,0,0)',
        boxShadow: state.isFocused ? '1px 1px 5px var(--btn-shadow-color)' : '2px 2px 5px var(--btn-shadow-color)',
        '&:hover': {
          borderColor: state.isFocused ? 'var(--btn-default-color)' : 'rgba(0,0,0,0)'
        }
      }),
      placeholder: () => ({
        color: controlColor, 
        whiteSpace: 'pre',
        fontSize: myFontSize
      }),
      singleValue: (provided) => ({
        ...provided,
        whiteSpace: 'pre',
        color: controlColor, 
        fontSize: myFontSize
      }),
      indicatorSeparator: () => ({
        display: 'none' 
      })
    };

    return (
      <Select
        options={options}
        value={options.find(option => option.value === selectedValue)}
        onChange={this.handleSelectChange}
        styles={styles}
        id={id}
        menuPlacement={menuPlacement}
      />
    );
  }
}

export default CustomSelect;
