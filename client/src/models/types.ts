import { CSSProperties, ReactNode, ElementType } from 'react';

export type ResponsiveValue<T> = T | T[];

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface BaseStackProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  classPrefix?: string;
  direction?: ResponsiveValue<FlexDirection>;
  align?: ResponsiveValue<AlignItems>;
  justify?: ResponsiveValue<JustifyContent>;
  wrap?: ResponsiveValue<FlexWrap>;
  spacing?: number | string;
  divider?: ReactNode;
  style?: CSSProperties;
}

export interface StackProps extends BaseStackProps {
  direction?: ResponsiveValue<FlexDirection>;
}

export interface HStackProps extends Omit<BaseStackProps, 'direction'> {
  reverse?: boolean;
  align?: ResponsiveValue<AlignItems>;
}

export interface VStackProps extends Omit<BaseStackProps, 'direction'> {
  reverse?: boolean;
  align?: ResponsiveValue<AlignItems>;
}
