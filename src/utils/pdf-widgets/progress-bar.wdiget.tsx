export const ProgressBar = (value: number) => {
  const valueInPercent = value * 100;
  let barColor = '';

  if (valueInPercent < 30) barColor = '#C85412';
  else if (valueInPercent >= 30 && valueInPercent <= 70) barColor = '#FDD100';
  else barColor = '#C4D600';

  return (
    <div
      style={{
        border: '1px solid #ccc',
        position: 'relative',
        overflow: 'hidden',
        height: '26px',
        borderRadius: '2px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          lineHeight: '24px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {`${valueInPercent.toLocaleString()} %`}
      </div>
      <div
        style={{
          height: '100%',
          backgroundColor: barColor,
          width: `${valueInPercent}%`,
          borderRadius: '2px',
        }}
      />
    </div>
  );
};
