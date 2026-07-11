# Gemini CLI周り

2026/07/10作成

## Gemini CLI PR review

1. `.github/workflows/gemini-pr-review.yml`を作成
    (自力じゃなくてもコマンドで公式のものを設定可能)
2. 対象のGitHubリポジトリを開く
3. 上部メニューの Settings タブをクリック
4. 左サイドバーの Secrets and variables をクリック → Actions を選択
5. Secrets タブが選ばれていることを確認
6. New repository secret ボタンをクリック
7. `Name: GEMINI_API_KEY`と`Secret: Google AI Studioで取得したAPIキー`を貼り付け
8. Add secret をクリックして保存

`/setup-github`をGemini CLI上で実行すると
大量のyamlとtomlが生成されてそれで制御できるらしい

また、[gemini-dispatch.yml](https://github.com/google-github-actions/run-gemini-cli/blob/main/examples/workflows/gemini-dispatch/gemini-dispatch.yml)
を参考にすると、`@gemini-cli`の細かい動作も指定できる

## 開発の手応え

skillsなしでもいい感じだった

## 参考文献
[https://github.com/google-github-actions/run-gemini-cli](https://github.com/google-github-actions/run-gemini-cli)

