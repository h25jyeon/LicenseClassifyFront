import React from "react";
import Select from "react-select";

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue 
    };
  }
  
  handleSelectChange = (selectedOption) => {
    const { handleSelectChange, id } = this.props;
    handleSelectChange(id, selectedOption.value);
    this.setState({ selectedValue: selectedOption.value }); 
  };

  render() {
    const { id, options, fontColor, backgroundColor, selectedColor, controlColor, myFontSize, hoverColor,
            selectedBackgroundColor, controlBackgroundColor, hoverBackgroundColor, width } = this.props;
    const { selectedValue } = this.state;

    

    const styles = {
      option: (provided, state) => ({
        ...provided,
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
        fontSize: myFontSize
      }),
      singleValue: (provided) => ({
        ...provided,
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
      />
    );
  }
}

export default CustomSelect;
