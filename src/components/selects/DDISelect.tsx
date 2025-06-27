import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useTranslation } from "react-i18next";

import countries from "../../assets/data/countries.json";

type DDISelectProps = {
  initialValue?: typeof INIT_COUNTRY;
  disabled?: boolean;
  value: string;
  error?: boolean;
  onChange: (value: any) => void;
  onBlur: (e: any) => void;
};

const INIT_COUNTRY = {
  code: "",
  label: "",
  phone: "",
  suggested: false,
};
export default function DDISelect({
  disabled,
  initialValue = INIT_COUNTRY,
  value,
  onChange,
  onBlur,
  error,
}: DDISelectProps) {
  const { t } = useTranslation("dashboard");
  const [ddiSelected, setDDISelected] = React.useState<any>(initialValue);
  const [currentValue, setCurrentValue] = React.useState<any>("");

  const countriesFiltered = React.useMemo(() => {
    if (!currentValue) return countries;

    console.log("currentValue", currentValue);
    console.log({
      test: countries.filter((c) => c.phone.includes(currentValue)),
    });

    return countries.filter((c) => c.phone.includes(currentValue));
  }, [countries, currentValue]);

  React.useEffect(() => {
    const country = countries.find((c) => c.phone === value);
    if (country) {
      setDDISelected(country);
    }
  }, [value]);

  const handleSelectedCountry = (value: any) => {
    onChange(value);
    setDDISelected(value);
  };
  return (
    <Autocomplete
      id="ddi"
      options={countriesFiltered}
      autoHighlight
      fullWidth
      disabled={disabled}
      value={ddiSelected}
      getOptionKey={(option) => `${option.label}-${option.phone}`}
      getOptionLabel={(option) => option.phone}
      onChange={(e, value) => handleSelectedCountry(value)}
      onBlur={onBlur}
      // isOptionEqualToValue={(option, value) => option.phone === value.phone}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 1, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          name="ddi"
          autoComplete="DDI"
          onChange={(e) => setCurrentValue(e.target.value)}
          error={error}
        />
      )}
    />
  );
}
