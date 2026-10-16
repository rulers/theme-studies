# ソース解析と移行判断

調査元: https://github.com/okfocus/tumblr

基準コミット: `dfcfa2189ea399b1a558fd69c3c0c281a7baa8cd`（取得日: 2026-10-17）。元リポジトリの追跡ファイルは4つのHTMLのみで、package.json、README、LICENSEはありません。元ファイルはローカルの `reference/okfocus-tumblr/` に保存し、実行依存から外しています。

## 1. Cube

`cubetheme.html`はJavaScriptを使いません。`{block:Posts}`内の写真URLを6面に貼り、CSSのperspective / preserve-3d / translateZ / 36秒のkeyframesで回転させます。複数投稿で同じIDを繰り返し、Photoブロックの閉じタグも欠けています。移植ではclassとReactのkeyへ変更し、モバイル向け寸法と停止操作を追加しました。

## 2. OKFocus300

`okfocus300.html:376-402`がインラインのjQuery処理です。投稿クリックで次要素へ500msスクロールし、末尾の1.5画面前で `/page/N .post` を読み込み、HTMLを追加します。最後の投稿で `next().offset()` がないケース、取得失敗、終了判定への配慮がありません。Textブロックも二重に記述されています。

移植では投稿を1件ずつJSX表示し、次投稿ボタンと `scrollIntoView`、IntersectionObserverと有限データの終端判定へ置き換えました。元のページ全面クリックはリンク操作と競合するため専用ボタンに変更しています。配色反転は元同様に背景・文字色を切り替え、写真色そのものは反転しません。

## 3. OKMove

HTMLだけでは動作は完結せず、Tumblr CDNの `utxaocy/0jAm0w225/main.js` と `utxaocy/Arlm0w8bd/main.css` に依存します。HTTPSで取得して確認しました。JavaScriptのヘッダには nclud / BeerCamp / el vacio / OKFocus の由来が記されています。

外部JSでは各sectionを `-index * 1000px` のZ座標へ配置。スクロール位置を全体高で正規化して奥行きへ変換し、`(8 * current + destination) / 9` で補間します。前後ズーム、HUD、末尾ページ追加読込も含まれます。元コードは常時requestAnimationFrameを回し、グローバル変数やwindowイベントを利用します。

移植の `useDepthScroll.js` は同じ奥行き間隔・補間係数を使い、必要時だけフレームを要求し、アンマウント時にイベント・フレームを解除します。全件を最初に配置し、実通信によるページ追加は実装していません。元CDN CSSの完全再現ではなく、新しいレスポンシブ表示です。

## 4. OKVideo

`okvideo.html`は1679行。CSS、Tumblr投稿ブロック、Twitter用HTML生成、独自XHR / 無限スクロール、Disqus、旧Google Analytics、UA判定、外部okvideoプラグインをまとめたテンプレートです。`ffiwaju/xmFn6g3tr/okvideo.min.js` をHTTPSで取得し、YouTube / Vimeoのプレーヤーと背景配置、ミュート・ループ処理を確認しました。

移植ではホスト・IDを検証してHTTPS iframe URLへ変換し、背景をiframe / CSS、投稿を共通コンポーネント、表示追加をフックへ分離しました。元の即時自動再生は明示的な再生操作へ変更しています。旧ブラウザshim、jQuery、グローバルコールバック、旧API、広告計測コードは実行しません。

## Next.jsでの境界

`app/layout.jsx`とページはServer Component。操作を持つテーマはClient Componentにし、SSRでブラウザAPIを参照しません。表示は `.jsx`、処理は `hooks/*.js`、CSSは `app/globals.css`、データは `lib/posts.js` です。

公式ドキュメント: https://nextjs.org/docs/app/getting-started/server-and-client-components

## 検証の範囲

URL変換はNodeのテストで正常系・不正入力を確認します。Next.jsのproduction buildで4テーマの事前生成とSSR互換性を確認します。実投稿API、外部動画の再生、原作実サイトとのピクセル比較は別途確認が必要です。
