import type { DefaultThresholdInput, D3Scale } from '../types/Scale';
import type { StringLike } from '../types/Base';
import type { ScaleConfigWithoutType } from '../types/ScaleConfig';

export default function applyAlign<
  Output,
  DiscreteInput extends StringLike,
  ThresholdInput extends DefaultThresholdInput,
>(
  scale: D3Scale<Output, DiscreteInput, ThresholdInput>,
  config: ScaleConfigWithoutType<Output, DiscreteInput, ThresholdInput>,
) {
  if ('align' in scale && 'align' in config && typeof config.align !== 'undefined') {
    scale.align(config.align);
  }
}
