import TimePicker from "src/components/shared/TimePicker";

export default function TimePickerRetraction({
  decrementMinutes,
  incrementMinutes,
  valueRetraction,
}) {
  return (
    <div style={{ position: "relative" }}>
      <TimePicker
        decrementMinutes={decrementMinutes}
        incrementMinutes={incrementMinutes}
        value={valueRetraction}
      />
    </div>
  );
}
