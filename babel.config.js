module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/features': './features',
            '@/hooks': './hooks',
            '@/services': './services',
            '@/utils': './utils',
            '@/theme': './theme',
            '@/types': './types',
          },
        },
      ],
    ],
  };
};
