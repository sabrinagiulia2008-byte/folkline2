import React from 'react';

export const SafeAreaProvider = ({ children }) => <>{children}</>;
export const SafeAreaView = ({ children, style }) => <div style={style}>{children}</div>;
export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });