import React from 'react';
import cx from 'classnames';
import { path as d3Path } from 'd3-path';
import type { SharedLinkProps, AccessorProps, AddSVGProps } from '../../../types';
import { getY, getX, getSource, getTarget } from '../../../util/accessors';

export function pathHorizontalCurve<Link, Node>({
  source,
  target,
  x,
  y,
  percent,
}: Required<AccessorProps<Link, Node>> & { percent: number }) {
  return (link: Link) => {
    const sourceData = source(link);
    const targetData = target(link);

    const sx = x(sourceData);
    const sy = y(sourceData);
    const tx = x(targetData);
    const ty = y(targetData);

    const dx = tx - sx;
    const dy = ty - sy;
    const ix = percent * (dx + dy);
    const iy = percent * (dy - dx);

    const path = d3Path();
    path.moveTo(sx, sy);
    path.bezierCurveTo(sx + ix, sy + iy, tx + iy, ty - ix, tx, ty);

    return path.toString();
  };
}

export type LinkHorizontalCurveProps<Link, Node> = AccessorProps<Link, Node> &
  SharedLinkProps<Link> & {
    percent?: number;
  };

export default function LinkHorizontalCurve<Link, Node>({
  className,
  children,
  data,
  innerRef,
  path,
  percent = 0.2,
  x = getY, // note this returns a y value
  y = getX, // note this returns an x value
  source = getSource,
  target = getTarget,
  ...restProps
}: AddSVGProps<LinkHorizontalCurveProps<Link, Node>, SVGPathElement>) {
  const pathGen = path || pathHorizontalCurve({ source, target, x, y, percent });
  if (children) return <>{children({ path: pathGen })}</>;
  return (
    <path
      ref={innerRef}
      className={cx('visx-link visx-link-horizontal-curve', className)}
      d={pathGen(data) || ''}
      {...restProps}
    />
  );
}
