# Theme Studies — TypeScript

JavaScript版と同じ5テーマ・5種類のWebGLトランジションを持つ、独立したNext.jsアプリです。元のJavaScript版はリポジトリ直下に残しています。

[公開サイト](https://rulers.github.io/theme-studies/typescript/) / [Flowを開く](https://rulers.github.io/theme-studies/typescript/themes/move-v2/)

## 起動

Node.js 22.18以降を使用します。リポジトリ直下から:

```sh
cd typescript
npm ci
npm run dev
```

http://localhost:3032 を開きます。Flowは `/themes/move-v2` です。JavaScript版の開発サーバー（既定3000）と同時に起動できます。

## 検証

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npm run check
npm run build
npm start
```

`typecheck` はNext.jsの型を生成してから `tsc --noEmit` を実行します。テストもTypeScriptで記述し、Node.jsの組み込みTypeScriptサポートで実行します。テストとアプリの両方を型チェック対象にしています。

`check` はESLint・Prettier・型チェック・テストを順に実行します。自動修正は `npm run lint:fix`、整形は `npm run format`。ESLintのTypeScriptパーサーに合わせ、TypeScriptは6.0系を使用します。[共通の開発チェックとCI](../README.md#開発チェック)

## 型の構成

- `app/**/*.tsx` / `components/*.tsx`: JSX、props、非同期ルートparams。
- `lib/types.ts`: 投稿種別に応じた必須フィールドを持つ `Post` の判別可能なUnion型、テーマprops、描画状態。
- `hooks/*.ts`: DOM要素のref、コールバック、状態、Observerの型。
- `lib/webgl-transition.ts`: `TransitionRenderer` インターフェイスとWebGLリソースの型・nullチェック。
- `lib/post-texture.ts`: Canvas 2D、画像ロードのPromise、AbortSignal。
- `lib/themes.ts`: テーマIDのリテラル型。

`strict: true` / `allowJs: false`。アプリ・テストのソースは `.ts` / `.tsx` に統一しています。型エラーを無視する設定や `any` は使用していません。CSS・画像・GLSLの表現はJavaScript版と共通です。両版は独立したコピーなので、機能変更時はそれぞれ更新してください。

投稿データは `lib/posts.ts` のサンプル8件です。WebGLへの外部画像利用にはCORS許可が必要です。元テーマとの関係や機能の範囲は [親README](../README.md) と [Flowの解説](../docs/OKMOVE-V2.md) を参照してください。

ライセンス: [MIT](../LICENSE)。出典: [NOTICE.md](../NOTICE.md)。

## 確認結果

2026-10-17: strict型チェック、TypeScriptの6テスト、本番ビルドに成功。5テーマすべてのHTTP 200と、実ブラウザでFlowの `WEBGL ACTIVE`・スクロール途中の描画を確認しました。確認時のコンソールに警告・エラーはありません。JavaScript版の本番ビルドも成功しています。
