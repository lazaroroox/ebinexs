import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useTranslation } from "react-i18next";

import countries from "../../assets/data/countries.json";

type Country = {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
};

type NationalitySelectProps = {
  disabled?: boolean;
  value: string;
  onChange: (value: any) => void;
  onBlue: (e: any) => void;
};

const INIT_COUNTRY = {
  code: "",
  label: "",
  phone: "",
  suggested: false,
};
export default function NationalitySelect({
  disabled,
  value,
  onChange,
  onBlue,
}: NationalitySelectProps) {
  const { t } = useTranslation("dashboard");
  const [countrySelected, setNationalitySelected] =
    React.useState<any>(INIT_COUNTRY);

  React.useEffect(() => {
    const country = countries.find((c) => c.label === value);
    if (country) {
      setNationalitySelected(country);
    }
  }, []);

  const handleSelectedCountry = (value: any) => {
    onChange(value);
    setNationalitySelected(value);
  };
  return (
    <Autocomplete
      id="nationality"
      options={countries}
      autoHighlight
      disabled={disabled}
      value={countrySelected}
      getOptionLabel={(option) => option.label}
      onChange={(e, value) => handleSelectedCountry(value)}
      onBlur={onBlue}
      isOptionEqualToValue={(option, value) => option.lebel === value.lebel}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
