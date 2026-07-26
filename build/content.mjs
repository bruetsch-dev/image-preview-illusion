/* All site copy, both locales in one place so they cannot drift apart.
   Japanese first-class: the 長押しで変化 trend is the primary market. */

export const SITE = {
  name: "Tap Me Studio",
  domain: "https://tapmestudio.com",
  email: "hello@tapmestudio.com",
  x: "https://x.com/",
  /* Fill these in before going live. Empty strings keep every ad slot
     collapsed, so the site ships fine without them. */
  ads: {
    client: "",          // e.g. "ca-pub-0000000000000000"
    slotInline: "",      // responsive unit under the editor
    slotArticle: ""      // responsive unit inside long-form pages
  },
  analyticsId: ""        // e.g. "G-XXXXXXXXXX"
};

export const LOCALES = ["en", "ja"];

export const UI = {
  en: {
    dir: "ltr",
    langName: "English",
    otherLangName: "日本語",
    skip: "Skip to the editor",
    nav: { home: "Maker", editor: "Editor", howto: "How-to", faq: "FAQ", blog: "Blog", about: "About" },
    footer: {
      product: "Product",
      company: "Company",
      contact: "Contact",
      contactLine: "Questions, bugs, or a picture that won't cooperate:",
      rights: "Made for the tap-and-hold trend on X. Not affiliated with X Corp.",
      privacy: "Privacy",
      terms: "Terms"
    },
    adLabel: "Advertisement",
    consent: {
      title: "Cookies",
      body: "We'd like to use cookies for traffic statistics and advertising. The image editor works either way, and your pictures never leave your device.",
      accept: "Accept",
      reject: "Reject non-essential",
      more: "Privacy policy"
    }
  },
  ja: {
    dir: "ltr",
    langName: "日本語",
    otherLangName: "English",
    skip: "エディターへ移動",
    nav: { home: "作成", editor: "エディター", howto: "使い方", faq: "よくある質問", blog: "ブログ", about: "運営者" },
    footer: {
      product: "プロダクト",
      company: "運営情報",
      contact: "お問い合わせ",
      contactLine: "ご質問・不具合・うまくいかない画像について:",
      rights: "X の「長押しで変化」トレンド向けに作りました。X Corp. とは無関係です。",
      privacy: "プライバシー",
      terms: "利用規約"
    },
    adLabel: "広告",
    consent: {
      title: "Cookie について",
      body: "アクセス解析と広告のために Cookie を使用したいと考えています。どちらを選んでもエディターは通常どおり動作し、画像が端末から送信されることはありません。",
      accept: "同意する",
      reject: "必須のみ",
      more: "プライバシーポリシー"
    }
  }
};

/* ---------- Landing page ---------------------------------------------- */

export const HOME = {
  en: {
    title: "Free Tap and Hold Image Maker for X",
    description:
      "Upload a picture, choose what stays hidden, and get a PNG that changes when people tap and hold it on X. Free, no signup, runs entirely in your browser.",
    heroEyebrow: "Free, no signup",
    heroTitle: ["Tap and hold", "image maker for X"],
    heroBody:
      "Upload a picture, choose what stays hidden, and download a PNG that looks blank in the X timeline and shows the full image when someone taps and holds it.",
    heroCta: "Open the editor",
    heroNote: "Runs in your browser. Your picture is never uploaded.",
    demoHidden: "Timeline",
    demoRevealed: "Revealed",
    demoHint: "Hold to reveal",
    editorEyebrow: "Editor",
    editorTitle: "Make your image",
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps",
    steps: [
      {
        h: "Upload a picture",
        p: "Drop in a PNG or JPG. The file is processed in your browser and never sent to a server."
      },
      {
        h: "Choose what stays visible",
        p: "Hide the whole image, keep the dark parts visible, or paint the areas that should stay visible in the thumbnail."
      },
      {
        h: "Download and post",
        p: "Save the PNG and attach it to a post on X. Keep it under 5 MB — above that, X serves a compressed copy and the image will not change."
      }
    ],
    whyEyebrow: "Details",
    whyTitle: "What this tool does differently",
    why: [
      {
        h: "Accurate timeline preview",
        p: "The preview does not just scale your image down. It composites it over the feed background, resizes it the way X does, and applies JPEG compression, so the preview matches what gets posted."
      },
      {
        h: "PNG-8 export",
        p: "Exports use a 256-colour palette with a transparency chunk instead of full RGBA. Typical files are 40 to 90 KB rather than several megabytes, which keeps them under X's 5 MB limit."
      },
      {
        h: "Two methods",
        p: "Hide & reveal uses the feed's downscaling. Two-image swap calculates per-pixel transparency so one file displays as two different images. Both are included."
      }
    ],
    faqTitle: "Common questions",
    faqMore: "Read every question",
    howtoMore: "Read the full guide"
  },
  ja: {
    title: "無料の「長押しで変化」画像メーカー（X / Twitter）",
    description:
      "画像をアップロードして隠す範囲を選ぶだけで、X で長押しすると変化する PNG が作れます。無料・登録不要・ブラウザ内で完結します。",
    heroEyebrow: "無料・登録不要",
    heroTitle: ["長押しで変化する", "画像メーカー"],
    heroBody:
      "画像をアップロードして隠す範囲を選ぶと、X のタイムラインでは空白に見え、長押しすると全体が表示される PNG をダウンロードできます。",
    heroCta: "エディターを開く",
    heroNote: "ブラウザ内で処理され、画像がアップロードされることはありません。",
    demoHidden: "タイムライン",
    demoRevealed: "表示",
    demoHint: "長押しで表示",
    editorEyebrow: "エディター",
    editorTitle: "画像を作成",
    stepsEyebrow: "使い方",
    stepsTitle: "3 ステップ",
    steps: [
      {
        h: "画像をアップロード",
        p: "PNG または JPG をドロップします。ブラウザ内で処理され、サーバーには送信されません。"
      },
      {
        h: "見せる部分を選ぶ",
        p: "全体を隠す、暗い部分を残す、サムネイルに残す範囲を手描きで塗る、の 3 通りから選べます。"
      },
      {
        h: "保存して投稿",
        p: "PNG を保存して X の投稿に添付します。5 MB を超えると X が圧縮版を配信するため、変化しません。"
      }
    ],
    whyEyebrow: "詳細",
    whyTitle: "このツールの特徴",
    why: [
      {
        h: "正確なタイムラインプレビュー",
        p: "単に縮小するのではなく、フィードの背景に合成し、X と同じ方法でリサイズし、JPEG 圧縮をかけます。プレビューが投稿結果と一致します。"
      },
      {
        h: "PNG-8 で書き出し",
        p: "RGBA ではなく 256 色パレットと透過チャンクを使用します。ファイルは通常 40〜90 KB に収まり、X の 5 MB 上限を下回ります。"
      },
      {
        h: "2 つの方式",
        p: "「隠して見せる」はフィードの縮小処理を利用します。「2 枚入れ替え」はピクセルごとの透明度を計算し、1 枚のファイルを 2 枚の画像として表示します。両方に対応しています。"
      }
    ],
    faqTitle: "よくある質問",
    faqMore: "すべての質問を見る",
    howtoMore: "詳しいガイドを読む"
  }
};

/* ---------- FAQ -------------------------------------------------------- */

export const FAQ = {
  en: {
    title: "Frequently asked questions",
    description: "Why a tap-and-hold image sometimes doesn't change, what X does to your file, and how this maker handles it.",
    intro: "Most problems have the same cause: X served the compressed copy instead of your original file. These answers cover why that happens and what to do about it.",
    items: [
      {
        q: "Why doesn't my image change when I tap and hold?",
        a: "The reveal only works when X serves the original PNG instead of its compressed copy. That fails for three common reasons: the file is over 5 MB, the long side is far beyond 2432 px, or the app re-encoded it because it was uploaded from a client that strips transparency. Export again at a smaller size and check the file size the editor reports before posting."
      },
      {
        q: "Is this really free?",
        a: "Yes. No account, no watermark, no export limit, no paid tier. The site carries advertising, which is what pays for the domain and hosting."
      },
      {
        q: "Are my pictures uploaded anywhere?",
        a: "No. The file is read into a canvas element in your own browser and every pixel operation happens there. There is no upload endpoint in this app — you can watch the network tab while you work and see nothing leave."
      },
      {
        q: "Does it work on Android and on desktop?",
        a: "Making one works in any modern browser, on a phone or a computer. Viewing the effect is a different matter: it depends on the X client. The official iOS app is the most reliable. Android and the web client sometimes show the compressed copy in both states, which means no change."
      },
      {
        q: "What is the difference between the two modes?",
        a: "Hide & reveal takes one picture and dithers it so that shrinking it averages the image into the background — it looks blank in the feed and returns when opened. Two-image swap takes two pictures and solves the per-pixel transparency so the file reads as the first picture over a light background and the second over a dark one."
      },
      {
        q: "Why does my two-image swap look washed out?",
        a: "That is a hard limit of the technique, not a bug. Composited over white and over black, the same file can only differ by one brightness value per pixel — so two arbitrary colour images are impossible. Pick a light first picture and a dark second one, and the result gets much closer."
      },
      {
        q: "Can I use it for commercial work?",
        a: "Yes. The images you make are yours. This tool claims no rights over anything you create with it."
      },
      {
        q: "Will it keep working?",
        a: "Nobody can promise that. X changes its image pipeline without notice, and every tool in this category breaks when it does. Test a post from a private account before you rely on one."
      }
    ]
  },
  ja: {
    title: "よくある質問",
    description: "長押しで変化しない原因、X がファイルに対して行う処理、このツールでの対処方法をまとめています。",
    intro: "うまくいかない原因のほとんどは同じです。X が元ファイルではなく圧縮版を配信した、という点にあります。以下で原因と対処をまとめます。",
    items: [
      {
        q: "長押ししても変化しません",
        a: "この効果は、X が圧縮版ではなく元の PNG を配信したときにだけ働きます。失敗する原因は主に 3 つです。ファイルが 5 MB を超えている、長辺が 2432 px を大きく超えている、透過を削除するクライアントから投稿したために再エンコードされた、のいずれかです。小さいサイズで書き出し直し、投稿前にエディターが表示するファイルサイズを確認してください。"
      },
      {
        q: "本当に無料ですか",
        a: "はい。アカウント登録もウォーターマークも書き出し制限も有料プランもありません。サイトには広告を掲載しており、それがドメインとサーバーの費用に充てられています。"
      },
      {
        q: "画像はどこかにアップロードされますか",
        a: "いいえ。ファイルはお使いのブラウザ内の canvas 要素に読み込まれ、すべてのピクセル処理はそこで完結します。このアプリにはアップロード先が存在しません。作業中にネットワークタブを開けば、何も送信されていないことを確認できます。"
      },
      {
        q: "Android やパソコンでも使えますか",
        a: "作成はスマートフォンでもパソコンでも、最新のブラウザであれば動作します。効果の表示側は事情が異なり、X のクライアントに依存します。公式 iOS アプリが最も確実です。Android や Web 版では両方の状態で圧縮版が表示され、変化しないことがあります。"
      },
      {
        q: "2 つのモードの違いは何ですか",
        a: "「隠して見せる」は 1 枚の画像にディザをかけ、縮小されると背景に溶け込むようにします。フィードでは空白に見え、開くと戻ります。「2 枚入れ替え」は 2 枚の画像からピクセルごとの透明度を計算し、明るい背景では 1 枚目、暗い背景では 2 枚目として見えるファイルを作ります。"
      },
      {
        q: "2 枚入れ替えの色が薄くなります",
        a: "これは不具合ではなく、手法自体の限界です。白と黒に合成したとき、同じファイルは 1 ピクセルあたり明るさ 1 つ分しか差を作れないため、任意の 2 枚のカラー画像は原理的に表現できません。1 枚目に明るい画像、2 枚目に暗い画像を選ぶと、かなり近づきます。"
      },
      {
        q: "商用利用はできますか",
        a: "はい。作成した画像はあなたのものです。本ツールは作成物に対して一切の権利を主張しません。"
      },
      {
        q: "今後も使えますか",
        a: "お約束はできません。X は画像処理の仕組みを予告なく変更し、そのたびにこの種のツールは動かなくなります。本番で使う前に、非公開アカウントから一度テスト投稿することをおすすめします。"
      }
    ]
  }
};

/* ---------- How-to ------------------------------------------------------ */

export const HOWTO = {
  en: {
    title: "How to make a tap-and-hold image for X",
    description: "A step-by-step guide to building an image that hides in the X timeline and reveals itself when someone taps and holds it.",
    intro:
      "The format is called 長押しで変化 in Japanese. The mechanism is straightforward: X shows two different files for the same post, and you can make those two files look like two different pictures.",
    sections: [
      {
        h: "What actually happens on X",
        p: [
          "When you attach an image to a post, X keeps your original and generates a smaller, recompressed copy for the timeline. The feed shows the copy. Tapping and holding, or opening the image, makes the client fetch the original.",
          "Two things differ between those two views, and both are exploitable. The copy is scaled down and pushed through JPEG, which destroys anything encoded at a one-pixel scale. And the timeline composites your image over a light background while the opened view sits on black, which changes how transparency reads."
        ]
      },
      {
        h: "Method one: hide and reveal",
        p: [
          "Take one picture and make every second pixel transparent in a checkerboard. At full size you see the picture, dimmed but complete. Scaled down, each pair of pixels averages together — image plus background — and the result is close enough to the background that the frame looks empty.",
          "This is what the Hide & reveal mode does. Every pixel keeps its own colour — the checker alone does the hiding, so there is no reason to wash the picture out. A 256-colour palette is then built from the image itself, which lets the file export as PNG-8 and stay small enough for X to serve the original.",
          "Two extra passes clean up the result. Near-white background connected to the border is made fully transparent rather than checkered, so a studio backdrop disappears instead of showing as grey haze. And in \"keep dark parts\" mode, dark regions too small to be part of the subject are dropped, because at thumbnail size they only read as noise."
        ]
      },
      {
        h: "Method two: two-image swap",
        p: [
          "This one uses transparency rather than scale. For each pixel you solve for a colour and an alpha such that compositing over white gives you picture A and compositing over black gives you picture B.",
          "There is a catch worth knowing before you try it. Subtracting the two equations shows the composites can only ever differ by one achromatic number per pixel, so two arbitrary colour images are mathematically impossible. The solve therefore runs on brightness, which both pictures reproduce exactly, and the revealed image keeps its own colour on top. Choose a light picture for the timeline and a dark one for the reveal."
        ]
      },
      {
        h: "Getting it to actually work",
        p: [
          "Keep the export under 5 MB. This is the single most common failure. Above it, X stops serving your original and both views show the same compressed copy.",
          "Post from the official app or the web uploader. Some third-party clients re-encode images and strip the alpha channel, which removes the effect before it ever reaches X.",
          "Test from a private account first. Every tool in this category depends on undocumented behaviour that can change overnight."
        ]
      },
      {
        h: "Ideas that work well",
        p: [
          "Artwork reveals, where the timeline shows a blank canvas and the hold shows the finished piece. Jokes, where the setup is visible and the punchline is hidden. Before-and-after comparisons, which work better with two-image swap than with the dither method."
        ]
      }
    ]
  },
  ja: {
    title: "X で「長押しで変化」する画像の作り方",
    description: "X のタイムラインでは隠れていて、長押しすると現れる画像を作る手順を解説します。",
    intro:
      "「長押しで変化」と呼ばれる形式の仕組みは単純です。X は同じ投稿に対して 2 つの異なるファイルを表示しており、その 2 つを別の画像に見せることができます。",
    sections: [
      {
        h: "X の内部で起きていること",
        p: [
          "投稿に画像を添付すると、X は元ファイルを保持したまま、タイムライン用に縮小・再圧縮したコピーを生成します。フィードに表示されるのはコピーです。長押ししたり画像を開いたりすると、クライアントが元ファイルを取得します。",
          "この 2 つの表示には差が 2 つあり、どちらも利用できます。コピーは縮小され JPEG を通るため、1 ピクセル単位で埋め込まれた情報は消えます。またタイムラインは明るい背景に合成されるのに対し、開いた表示は黒背景であり、透過の見え方が変わります。"
        ]
      },
      {
        h: "方法 1: 隠して見せる",
        p: [
          "1 枚の画像を用意し、市松模様状に 1 ピクセルおきに透明にします。原寸では、やや淡いものの絵がそのまま見えます。縮小されると隣り合うピクセルが平均化され、画像と背景が混ざり、背景に十分近づくためフレームは空白に見えます。",
          "これが「隠して見せる」モードの処理です。各ピクセルは元の色をそのまま保ちます。隠す働きは市松模様が担っているため、画像を淡くする必要がありません。その後、画像自体から 256 色のパレットを作成し、PNG-8 として書き出すことで、X が元ファイルを配信できるファイルサイズに収めています。",
          "仕上げに 2 つの処理が入ります。枠に接した白に近い背景は市松模様ではなく完全な透明にするため、白背景は灰色のもやではなく消えます。また「暗い部分を残す」では、被写体の一部とは考えにくい小さな暗い領域を除去します。サムネイルサイズではノイズにしか見えないためです。"
        ]
      },
      {
        h: "方法 2: 2 枚入れ替え",
        p: [
          "こちらは縮小ではなく透過を利用します。各ピクセルについて、白に合成すると画像 A、黒に合成すると画像 B になるような色と不透明度を求めます。",
          "試す前に知っておくべき制約があります。2 つの式を引き算すると、2 つの合成結果はピクセルあたり 1 つの無彩色の値でしか差を作れないことが分かります。つまり任意の 2 枚のカラー画像は数学的に不可能です。そのため計算は明るさに対して行い、これは両方の画像が正確に再現できます。現れる側の画像はその上に自身の色を保ちます。タイムライン側には明るい画像を、現れる側には暗い画像を選んでください。"
        ]
      },
      {
        h: "確実に動かすために",
        p: [
          "書き出しを 5 MB 未満に保ってください。失敗の原因として最も多いのがこれです。超えると X は元ファイルを配信しなくなり、どちらの表示も同じ圧縮版になります。",
          "公式アプリまたは Web からアップロードしてください。一部のサードパーティクライアントは画像を再エンコードしてアルファチャンネルを削除するため、X に届く前に効果が失われます。",
          "まず非公開アカウントでテストしてください。この種のツールはすべて、いつ変わってもおかしくない非公開の挙動に依存しています。"
        ]
      },
      {
        h: "相性のよい使い方",
        p: [
          "イラストの完成公開（タイムラインでは白紙、長押しで完成品）、オチを隠す投稿（前振りだけ見せて答えを隠す）、そしてビフォーアフター（ディザ方式より 2 枚入れ替えのほうが向いています）。"
        ]
      }
    ]
  }
};

/* ---------- Blog --------------------------------------------------------- */

export const BLOG = {
  en: {
    title: "Blog",
    description: "Notes on the tap-and-hold trend on X, and on what its image pipeline does to your files.",
    intro: "Short pieces about the trend, the technique, and the things that break it.",
    posts: [
      {
        slug: "why-tap-and-hold-images-stop-working",
        date: "2026-07-22",
        title: "Why tap-and-hold images stop working",
        summary: "Five reasons the reveal fails, in the order you should check them.",
        body: [
          {
            h: null,
            p: [
              "A tap-and-hold image that doesn't change is almost never a problem with how it was made. It is a problem with what X did to it afterwards. Here are the causes, roughly in order of how often they come up."
            ]
          },
          {
            h: "The file is over 5 MB",
            p: [
              "This is the big one. Past roughly five megabytes, X stops serving your original and hands the compressed copy to both views. Both states then look identical, which reads as \"the effect doesn't work\" even though the file is fine.",
              "Fix it by exporting at a smaller size. Dropping from 2432 px to 1946 px usually cuts the file by a third with no visible loss, because the effect lives in the pixel pattern rather than in resolution."
            ]
          },
          {
            h: "The upload path re-encoded it",
            p: [
              "Some third-party clients and scheduling tools convert images to JPEG before upload. JPEG has no alpha channel, so the transparency the effect depends on is gone before X ever sees the file. Post from the official app or the web uploader."
            ]
          },
          {
            h: "The viewer is on the wrong client",
            p: [
              "Making the image is platform-independent. Seeing it is not. The official iOS app reliably fetches the original on a long press. Android has been inconsistent, and the web client often shows the compressed copy in both states. If it works for you and not for a friend, this is usually why."
            ]
          },
          {
            h: "The picture was a bad candidate",
            p: [
              "Very dark images have little room to hide, because the dither has to average toward a light background and a dark picture simply doesn't get there. Very flat images have the opposite problem: nothing survives the reveal. High-contrast art with clear shapes works best."
            ]
          },
          {
            h: "X changed something",
            p: [
              "This whole category depends on undocumented behaviour. Compression settings, size thresholds and the long-press gesture itself have all shifted before, and will again. When a technique that worked last month stops working for everyone at once, this is why."
            ]
          }
        ]
      }
    ]
  },
  ja: {
    title: "ブログ",
    description: "X の「長押しで変化」トレンドと、X の画像処理がファイルに与える影響についてのメモ。",
    intro: "トレンドと技術、そしてそれを壊す要因についての短い記事です。",
    posts: [
      {
        slug: "why-tap-and-hold-images-stop-working",
        date: "2026-07-22",
        title: "長押しで変化しなくなる 5 つの原因",
        summary: "確認すべき順に、変化が起きない理由をまとめました。",
        body: [
          {
            h: null,
            p: [
              "長押ししても変化しない画像は、作り方に問題があることはほとんどありません。問題は、その後 X がそのファイルに何をしたかにあります。よくある順に原因を挙げます。"
            ]
          },
          {
            h: "ファイルが 5 MB を超えている",
            p: [
              "これが最大の原因です。おおよそ 5 MB を超えると、X は元ファイルの配信をやめ、どちらの表示にも圧縮版を渡します。両方の状態が同じ見た目になるため、ファイル自体には問題がなくても「効果が出ない」と見えてしまいます。",
              "小さいサイズで書き出せば解決します。2432 px から 1946 px に下げるだけで、見た目を損なわずにファイルサイズが 3 分の 1 ほど減ります。効果は解像度ではなくピクセルの並びに宿っているためです。"
            ]
          },
          {
            h: "アップロード経路で再エンコードされた",
            p: [
              "一部のサードパーティクライアントや予約投稿ツールは、アップロード前に画像を JPEG へ変換します。JPEG にはアルファチャンネルがないため、効果の前提となる透過は X に届く前に失われます。公式アプリまたは Web からアップロードしてください。"
            ]
          },
          {
            h: "見る側のクライアントが対応していない",
            p: [
              "作成はプラットフォームを選びませんが、表示はそうではありません。公式 iOS アプリは長押しで確実に元ファイルを取得します。Android は挙動が安定せず、Web 版は両方の状態で圧縮版を表示することが多くあります。自分では動くのに友人の環境では動かない場合、たいていこれが原因です。"
            ]
          },
          {
            h: "元の画像が向いていない",
            p: [
              "極端に暗い画像は隠す余地がほとんどありません。ディザは明るい背景へ向けて平均化される必要があり、暗い画像ではそこまで届かないためです。逆に平坦すぎる画像は、現れたときに見るものが残りません。形がはっきりした高コントラストの絵が最も向いています。"
            ]
          },
          {
            h: "X 側が仕様を変えた",
            p: [
              "この分野全体が、公開されていない挙動に依存しています。圧縮設定、サイズのしきい値、長押しのジェスチャー自体も、これまで何度か変わってきましたし、今後も変わります。先月まで動いていた手法が全員同時に動かなくなったときは、これが理由です。"
            ]
          }
        ]
      }
    ]
  }
};

/* ---------- About / legal ------------------------------------------------ */

export const ABOUT = {
  en: {
    title: "About",
    description: "Who makes Tap Me Studio and how it works.",
    body: [
      {
        h: "What this is",
        p: [
          "Tap Me Studio makes images for the tap-and-hold format on X. It began as a set of tests against X's image pipeline and became a tool once the results were consistent enough to be useful.",
          "It does one thing, and the preview is built to match what actually gets posted."
        ]
      },
      {
        h: "How it is built",
        p: [
          "Everything runs client-side. Your image is loaded into a canvas element, all pixel processing happens in your browser, and the PNG is assembled there as well. The palette and transparency chunk are written directly rather than through the browser's encoder, which is what keeps file sizes low enough for X to serve the original.",
          "There is no upload endpoint, no account system and no image storage. This is a property of how the tool is built, not a policy."
        ]
      },
      {
        h: "How it pays for itself",
        p: [
          "Advertising on the surrounding pages. The editor is free and unlimited, with no watermark and no features reserved for a paid tier."
        ]
      }
    ]
  },
  ja: {
    title: "運営者情報",
    description: "Tap Me Studio の運営者と仕組みについて。",
    body: [
      {
        h: "このサイトについて",
        p: [
          "Tap Me Studio は、X の「長押しで変化」形式の画像を作成するツールです。X の画像処理に対する検証から始まり、結果が安定した段階でツールとして公開しました。",
          "機能はひとつに絞っています。プレビューは実際の投稿結果と一致するように作られています。"
        ]
      },
      {
        h: "技術的な仕組み",
        p: [
          "すべてクライアントサイドで動作します。画像は canvas 要素に読み込まれ、ピクセル処理も PNG の組み立てもブラウザ内で完結します。パレットと透過チャンクはブラウザのエンコーダーを介さず直接書き出しており、これにより X が元ファイルを配信できるファイルサイズに収まります。",
          "アップロード先もアカウント機能も画像の保存もありません。これは方針ではなく、ツールの構造によるものです。"
        ]
      },
      {
        h: "運営費について",
        p: [
          "周辺ページに掲載している広告でまかなっています。エディターは無料・無制限・ウォーターマークなしで、有料プラン限定の機能もありません。"
        ]
      }
    ]
  }
};

export const PRIVACY = {
  en: {
    title: "Privacy policy",
    description: "What this site stores, what it doesn't, and who else is involved.",
    updated: "Last updated: 25 July 2026",
    body: [
      {
        h: "Your images",
        p: [
          "Your pictures are never uploaded. They are read into a canvas element in your browser, processed there, and discarded when you close the tab. This site has no image storage and no upload endpoint."
        ]
      },
      {
        h: "What is collected",
        p: [
          "If you accept cookies, this site uses Google Analytics to count visits and see which pages people read. That records a truncated IP address, your approximate region, your browser and the pages you view. It does not record anything about the pictures you process.",
          "If you decline, no analytics and no advertising cookies are set, and the editor works exactly the same."
        ]
      },
      {
        h: "Advertising",
        p: [
          "This site carries advertising from Google AdSense. With your consent, Google and its partners may set cookies to measure and personalise ads. Without consent, ads are either not shown or shown without personalisation, depending on your region.",
          "You can review and change your choice at any time from the link in the footer."
        ]
      },
      {
        h: "Hosting and logs",
        p: [
          "The site is served as static files. The hosting provider keeps standard server logs, including IP addresses, for a short period for security and abuse handling. Those logs are not used for profiling."
        ]
      },
      {
        h: "Your rights",
        p: [
          "Under the GDPR you can ask what data relates to you, ask for it to be corrected or deleted, and object to processing. Because this site stores no accounts and no images, there is usually nothing to return beyond analytics records. Write to the contact address and it will be handled."
        ]
      }
    ]
  },
  ja: {
    title: "プライバシーポリシー",
    description: "当サイトが保存するもの、保存しないもの、および関係する第三者について。",
    updated: "最終更新: 2026年7月25日",
    body: [
      {
        h: "画像の取り扱い",
        p: [
          "画像がアップロードされることはありません。ブラウザ内の canvas 要素に読み込まれ、そこで処理され、タブを閉じると破棄されます。当サイトに画像の保存領域やアップロード先は存在しません。"
        ]
      },
      {
        h: "取得する情報",
        p: [
          "Cookie に同意いただいた場合、当サイトは Google アナリティクスを使用して訪問数と閲覧ページを計測します。短縮された IP アドレス、おおよその地域、ブラウザ、閲覧ページが記録されます。処理した画像に関する情報は一切記録されません。",
          "同意されない場合、解析用および広告用の Cookie は設定されません。エディターの動作はまったく同じです。"
        ]
      },
      {
        h: "広告について",
        p: [
          "当サイトは Google AdSense による広告を掲載しています。ご同意いただいた場合、Google および提携事業者が広告の効果測定とパーソナライズのために Cookie を設定することがあります。同意がない場合、お住まいの地域に応じて、広告は表示されないかパーソナライズなしで表示されます。",
          "選択はフッターのリンクからいつでも確認・変更できます。"
        ]
      },
      {
        h: "ホスティングとログ",
        p: [
          "当サイトは静的ファイルとして配信されています。ホスティング事業者は、セキュリティおよび不正利用対応のため、IP アドレスを含む標準的なサーバーログを短期間保持します。これらのログがプロファイリングに使用されることはありません。"
        ]
      },
      {
        h: "利用者の権利",
        p: [
          "GDPR に基づき、ご自身に関するデータの開示、訂正、削除を求めること、および処理に異議を申し立てることができます。当サイトはアカウントも画像も保存していないため、解析記録以外にお返しできるものは通常ありません。お問い合わせ先までご連絡ください。"
        ]
      }
    ]
  }
};

export const TERMS = {
  en: {
    title: "Terms of use",
    description: "The short version: the images are yours, the tool comes as-is.",
    updated: "Last updated: 25 July 2026",
    body: [
      {
        h: "Your work",
        p: [
          "The images you create belong to you. This site claims no rights over them and stores no copies. You are responsible for holding the rights to whatever you put into the editor."
        ]
      },
      {
        h: "No warranty",
        p: [
          "This tool is provided as-is. The previews model X's image pipeline; they do not have access to it. X can change compression, size limits, cropping and the long-press gesture at any time, and when it does, images made here may stop working. Test before you rely on a result."
        ]
      },
      {
        h: "Acceptable use",
        p: [
          "Do not use this tool to create content that is illegal, that harasses someone, or that hides material a viewer would be harmed by seeing unexpectedly. The hidden-image format makes deception easy; do not use it that way."
        ]
      },
      {
        h: "Liability",
        p: [
          "To the extent permitted by law, no liability is accepted for lost work, failed posts, or any consequence of using an image made here. That said, if something is broken, report it and it will be looked at."
        ]
      },
      {
        h: "Trademarks",
        p: [
          "X and the X logo are trademarks of X Corp. This site is not affiliated with, endorsed by, or connected to X Corp."
        ]
      }
    ]
  },
  ja: {
    title: "利用規約",
    description: "要点: 作成した画像はあなたのもの、ツールは現状有姿での提供です。",
    updated: "最終更新: 2026年7月25日",
    body: [
      {
        h: "作成物について",
        p: [
          "作成した画像はあなたに帰属します。当サイトはそれらに対する権利を主張せず、複製も保存しません。エディターに入力する素材の権利については、利用者ご自身が責任を負うものとします。"
        ]
      },
      {
        h: "無保証",
        p: [
          "本ツールは現状有姿で提供されます。プレビューは X の画像処理を模擬したものであり、実際の処理にアクセスしているわけではありません。X は圧縮、サイズ上限、トリミング、長押しの挙動をいつでも変更でき、その際に当サイトで作成した画像が機能しなくなる可能性があります。結果に依存する前に必ずテストしてください。"
        ]
      },
      {
        h: "禁止事項",
        p: [
          "違法な内容、他者を害する内容、および予期せず目にした閲覧者に害を及ぼす素材を隠す目的で本ツールを使用しないでください。隠し画像という形式は欺瞞を容易にします。そのような用途に用いないでください。"
        ]
      },
      {
        h: "責任の制限",
        p: [
          "法律で認められる範囲において、作業内容の消失、投稿の失敗、当サイトで作成した画像の使用に起因するいかなる結果についても責任を負いません。ただし、不具合があればご報告ください。確認いたします。"
        ]
      },
      {
        h: "商標について",
        p: [
          "X および X ロゴは X Corp. の商標です。当サイトは X Corp. と提携、推奨、関連するものではありません。"
        ]
      }
    ]
  }
};
