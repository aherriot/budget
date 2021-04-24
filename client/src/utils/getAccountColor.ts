/**
 *
 * @param val A number from 0 to 1
 * @return string hsl value that works well when paired with other outputs
 * If you pass invoke this with uniformly distributed values, it will give you a visually pleasing colour
 */
// function getAccountColor(val: number): string {
//   // hue slowly rises towards 1
//   // const hue = Math.floor(val * 200 + 200) % 360;
//   const hue = Math.floor(val * 360) % 360;

//   // saturation is a quadratic function that bottoms out in the middle
//   // const saturation = 150 * ((val - 0.3) * (val - 0.3)) + 28;
//   // const saturation = 70;
//   const saturation = (val % 0.01) * 10000 + 10;
//   // console.log(val.toFixed(2), saturation.toFixed(2));
//   // lightness slowly descends
//   // const light = 60 - val * 10;
//   const light = (val % 0.025) * 2000 + 40;
//   console.log(`${val}, ${hue}, ${saturation}, ${light}`);

//   return `hsl(${hue}, ${saturation.toFixed(1)}%, ${light.toFixed(1)}%)`;
// }

// function getAccountColor2(index: number, total: number): string {
//   const val = index / Math.max(1, total - 1);
//   const halfGap = (1 / Math.max(1, total)) * 4;

//   // hue slowly rises towards 1
//   // const hue = Math.floor(val * 200 + 200) % 360;
//   const hue = Math.floor(val * 300) % 360;

//   // saturation is a quadratic function that bottoms out in the middle
//   // const saturation = 150 * ((val - 0.3) * (val - 0.3)) + 28;
//   // const saturation = 70;
//   const saturation = (val % halfGap) * 25 * total + 30;
//   // console.log(val.toFixed(2), saturation.toFixed(2));
//   // lightness slowly descends
//   // const light = 60 - val * 10;
//   // const light = (val % gap) * 2000 + 40;
//   const light = (val % halfGap) * 10 * total + 40;

//   // console.log(`${val}, ${hue}, ${saturation}, ${light}`);
//   // console.log(val, saturation.toFixed(1), halfGap);
//   return `hsl(${hue}, ${saturation.toFixed(1)}%, ${light.toFixed(1)}%)`;
// }

function getAccountColor(index: number, total: number): string {
  const val = index / Math.max(1, total - 1);
  const lowSat = index % 2 === 0;
  const lowLightness = index % 4 <= 1;

  // hue slowly rises towards 1
  // const hue = Math.floor(val * 200 + 200) % 360;
  const hue = Math.floor(val * 200) % 360;

  const saturation = lowSat ? 50 : 75;
  const light = lowLightness ? 40 : 60;
  // console.log(`${val}, ${hue}, ${saturation}, ${light}`);
  // console.log(val, saturation.toFixed(1), halfGap);
  return `hsl(${hue}, ${saturation.toFixed(1)}%, ${light.toFixed(1)}%)`;
}

export default getAccountColor;
