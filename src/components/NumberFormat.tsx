import { NumericFormat } from "react-number-format";

function NumberFormatCustom(props) {
  const { ref, onChange, decimalScale, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: parseInt(values.value),
          },
        });
      }}
      valueIsNumericString
      decimalScale={decimalScale || 8}
      allowLeadingZeros
      allowNegative={false}
      thousandSeparator={false}
      prefix="USDT "
    />
  );
}

export default NumberFormatCustom;
