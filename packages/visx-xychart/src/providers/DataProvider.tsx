/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScaleConfig, ScaleConfigToD3Scale } from '@visx/scale';
import { scaleLinear } from '@visx/scale';
import React, { useContext, useMemo } from 'react';
import createOrdinalScale from '@visx/scale/lib/scales/ordinal';
import type { AxisScaleOutput } from '@visx/axis';
import type { ResizeObserverPolyfill } from '@visx/responsive/lib/types';

import type { AxisScale, DataContextType, XYChartTheme } from '../types';
import ThemeContext from '../context/ThemeContext';
import DataContext from '../context/DataContext';
import useDataRegistry from '../hooks/useDataRegistry';
import type { Dimensions } from '../hooks/useDimensions';
import useDimensions from '../hooks/useDimensions';
import useScales from '../hooks/useScales';
import isDiscreteScale from '../utils/isDiscreteScale';

/** Props that can be passed to initialize/update the provider config. */
export type DataProviderProps<
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
> = {
  /* Optionally define the initial dimensions. */
  initialDimensions?: Partial<Dimensions>;
  /* Optional chart theme provided by DataProvider, overrides any theme already available in context. */
  theme?: XYChartTheme;
  /* x-scale configuration whose shape depends on scale type. */
  xScale: XScaleConfig;
  /* y-scale configuration whose shape depends on scale type. */
  yScale: YScaleConfig;
  /* Any React children. */
  children: React.ReactNode;
  /* Determines whether Series will be plotted horizontally (e.g., horizontal bars). By default this will try to be inferred based on scale types. */
  horizontal?: boolean | 'auto';
  /**
   * Optionally set the resizeObserverPolyfill context, which will be available to
   * ParentSize, Tooltip, and AnnotationLabel components.
   */
  resizeObserverPolyfill?: ResizeObserverPolyfill;
};

export default function DataProvider<
  XScaleConfig extends ScaleConfig<AxisScaleOutput>,
  YScaleConfig extends ScaleConfig<AxisScaleOutput>,
  Datum extends object,
>({
  initialDimensions,
  theme: propsTheme,
  xScale: xScaleConfig,
  yScale: yScaleConfig,
  children,
  horizontal: initialHorizontal = 'auto',
  resizeObserverPolyfill,
}: DataProviderProps<XScaleConfig, YScaleConfig>) {
  // `DataProvider` provides a theme so that `ThemeProvider` is not strictly needed.
  // `props.theme` takes precedent over `context.theme`, which has a default even if
  // a ThemeProvider is not present.
  const contextTheme = useContext(ThemeContext);
  const theme = propsTheme || contextTheme;
  const [{ width, height, margin }, setDimensions] = useDimensions(initialDimensions);
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  type XScale = ScaleConfigToD3Scale<XScaleConfig, AxisScaleOutput, any, any>;
  type YScale = ScaleConfigToD3Scale<YScaleConfig, AxisScaleOutput, any, any>;

  const dataRegistry = useDataRegistry<XScale, YScale, Datum>();

  const { xScale, yScale }: { xScale?: XScale; yScale?: YScale } = useScales({
    dataRegistry,
    xScaleConfig,
    yScaleConfig,
    xRange: [margin.left, Math.max(0, width - margin.right)],
    yRange: [Math.max(0, height - margin.bottom), margin.top],
  });

  const registryKeys = dataRegistry.keys();

  const colorScale = useMemo(
    () =>
      createOrdinalScale({
        domain: registryKeys,
        range: theme.colors,
      }),
    [registryKeys, theme.colors],
  );

  const horizontal =
    initialHorizontal === 'auto'
      ? isDiscreteScale(yScaleConfig) || yScaleConfig.type === 'time' || yScaleConfig.type === 'utc'
      : initialHorizontal;

  const value: DataContextType<AxisScale, AxisScale, Datum> = useMemo(
    () => ({
      dataRegistry,
      registerData: dataRegistry.registerData,
      unregisterData: dataRegistry.unregisterData,
      xScale: xScale || scaleLinear(),
      yScale: yScale || scaleLinear(),
      colorScale,
      theme,
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      setDimensions,
      horizontal,
      resizeObserverPolyfill,
    }),
    // everything here should be memoized between renders
    // to avoid child re-renders
    [
      colorScale,
      dataRegistry,
      height,
      horizontal,
      innerHeight,
      innerWidth,
      margin,
      setDimensions,
      theme,
      width,
      xScale,
      yScale,
      resizeObserverPolyfill,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
