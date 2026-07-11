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

## 現状の課題(2026/07/11)

- Github上の会話でレビューを出せないこと
    - `/review`だとactionsの中にしか出ない
- tomlとyamlの使い分けがあまり分かっていないこと
- PRメッセージの使い分けがまだであること
- おそらくコミット履歴を追えていないこと
- dispatch.yml（とtoml）を追加して@マークメンションでも会話できるようにする
- MCPをうまく使えていない
- そもそもjobに警告が出ていてpostがクリーンになっている

## 参考文献
[https://github.com/google-github-actions/run-gemini-cli](https://github.com/google-github-actions/run-gemini-cli)

