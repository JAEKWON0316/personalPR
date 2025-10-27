// eslint.config.js
module.exports = (() => {
    const { FlatCompat } = require('@eslint/eslintrc');
    const compat = new FlatCompat({
      baseDirectory: __dirname,
    });
  
    return [
      // 🔥 여기에 무시할 경로 추가
      {
        ignores: [
          '.next/**/*', // 빌드 결과물 무시
          'node_modules/**/*', // 외부 라이브러리 무시
          'dist/**/*', // 혹시 dist 폴더 사용 중이라면
        ],
      },
      ...compat.extends('next/core-web-vitals'),
    ];
  })();
  