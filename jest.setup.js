/* eslint-env jest */
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({ params: {} })),
    NavigationContainer: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) =>
        React.createElement(React.Fragment, null, children),
      Screen: ({ component: Component }) =>
        Component ? React.createElement(Component) : null,
    }),
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));
