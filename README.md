# GS-Visualizer

音楽に反応して進化する **Gray-Scott 反応拡散ビジュアライザー** です。  
元の Gray-Scott Visualizer の見た目を保ちながら、内部に **Turing Audio Reservoir** を追加し、音の瞬間的な大きさだけでなく、直前までの音楽の流れを模様へ反映します。

📱 **PWA対応** — iPhone / Android / PC でブラウザから開き、ホーム画面へ追加してアプリのように使用できます。

---

## 特長
- 🎶 **音楽入力対応** — ローカルの音楽ファイル／フォルダを読み込み、LOW / MID / HIGH / ONSET を解析
- 🌊 **Gray-Scott リアルタイム生成** — 500×500 の反応拡散パターンが連続的に進化
- 🧠 **Turing Audio Reservoir** — 96×96 の隠れた Gray-Scott 系が音楽の短い履歴を保持し、表示側の生成条件へ反映
- ✣ **上下左右対称** — 表示中の U / V フィールドを毎フレーム同期し、厳密な4方向対称を維持
- 📱 **PWA対応** — GitHub Pages からインストール可能
- 🌙 **Wake Lock対応** — 再生中の画面暗転を防止
- 🎧 **Media Session対応** — 通知バー・ロック画面・イヤホンボタンから PLAY / PAUSE / NEXT / PREVIOUS を操作可能
- ☎️ **モバイル割り込み復帰** — 電話着信やアプリ切替後の再生復帰を考慮。手動 PAUSE とは区別して処理
- 🖼️ **インタラクティブ** — キャンバスをクリックすると一時的にフィード／キル値を変調

---

## インストール方法（PWA）
1. GitHub Pages のデモページを開く  
   👉 https://masato-nasu.github.io/GS-Visualizer/
2. **PC (Chrome / Edge)**：URLバーの「インストール」アイコンをクリック
3. **Android (Chrome)**：メニュー「⋮」→「インストール」または「ホーム画面に追加」
4. **iPhone / iPad (Safari)**：共有ボタン →「ホーム画面に追加」

---

## 使い方
1. **SELECT MUSIC FOLDER / FILES** から音楽を読み込みます
   - **PC / Android**：フォルダを選択
   - **iPhone / iPad**：ファイルアプリから複数の音楽ファイルを選択
2. **PLAY** で再生開始
3. **PAUSE / NEXT / PREVIOUS** で操作
4. 音楽に応じて Gray-Scott パターンの生成条件と局所反応が変化します
5. キャンバスをクリックするとパターンに一時的な変調を加えられます

---

## 音楽への反応

音楽から取得した **LOW / MID / HIGH / ONSET** は、そのまま画面へ描画するのではなく、まず 96×96 の **Turing Audio Reservoir** へ入力されます。

```
Music
  ↓
LOW / MID / HIGH / ONSET
  ↓
96×96 Turing Audio Reservoir
  ↓
F / K modulation + symmetric local perturbation
  ↓
500×500 Gray-Scott pattern
```

この構造により、単純なイコライザーではなく、**直前までの音楽の状態を含んだ反応**を目指しています。

詳細は [ENGINE.md](./ENGINE.md) を参照してください。

---

## モバイルでの再生について
- Wake Lock に対応していますが、OSやブラウザの仕様により **完全なバックグラウンド再生を保証するものではありません**
- 電話着信や他アプリへの切り替えなどで一時停止された場合、画面復帰時に再開を試みます
- iOS などでユーザー操作が再度必要な場合は、現在の曲を保持したまま **TAP PLAY TO RESUME** と表示します
- 手動で **PAUSE** した場合は自動再開しません

---

## デモページ

https://masato-nasu.github.io/GS-Visualizer/

---

## 開発環境
- HTML / CSS / JavaScript
- Web Audio API
- Gray-Scott reaction-diffusion model
- Service Worker / Web App Manifest
- Wake Lock API
- Media Session API

---

## ライセンス

MIT License

---

# GS-Visualizer

A **music-reactive Gray-Scott reaction-diffusion visualizer**.

It preserves the visual character of the original Gray-Scott Visualizer while adding a hidden **Turing Audio Reservoir**. Instead of reacting only to the current loudness or FFT frame, the visible pattern is influenced by a short history of the music.

📱 **PWA Support** — Works in a browser and can be installed on iPhone, Android, and desktop.

---

## Features
- 🎶 **Music Input** — Load local audio files or folders and analyse LOW / MID / HIGH / ONSET
- 🌊 **Real-Time Gray-Scott** — A 500×500 reaction-diffusion field evolves continuously
- 🧠 **Turing Audio Reservoir** — A hidden 96×96 Gray-Scott system carries short-term musical history
- ✣ **Exact Four-Way Symmetry** — The visible U / V fields are synchronized every frame to preserve horizontal and vertical mirror symmetry
- 📱 **PWA Support** — Installable from GitHub Pages
- 🌙 **Wake Lock** — Helps keep the screen awake during playback
- 🎧 **Media Session** — PLAY / PAUSE / NEXT / PREVIOUS from notifications, lock screen, and supported headset controls
- ☎️ **Mobile Interruption Recovery** — Designed to recover after phone / OS interruptions without confusing them with a manual pause
- 🖼️ **Interactive** — Click the canvas to apply a temporary feed / kill modulation

---

## Installation (PWA)
1. Open the GitHub Pages demo  
   👉 https://masato-nasu.github.io/GS-Visualizer/
2. **PC (Chrome / Edge)**: use the install icon in the address bar
3. **Android (Chrome)**: menu “⋮” → “Install” or “Add to Home screen”
4. **iPhone / iPad (Safari)**: Share → “Add to Home Screen”

---

## Usage
1. Use **SELECT MUSIC FOLDER / FILES** to load music
   - **PC / Android**: choose a folder
   - **iPhone / iPad**: select multiple files from the Files app
2. Press **PLAY**
3. Use **PAUSE / NEXT / PREVIOUS** for playback control
4. The music changes the Gray-Scott generative conditions and symmetric local perturbations
5. Click the canvas to apply a temporary modulation

---

## How the music response works

```
Music
  ↓
LOW / MID / HIGH / ONSET
  ↓
96×96 Turing Audio Reservoir
  ↓
F / K modulation + symmetric local perturbation
  ↓
500×500 Gray-Scott pattern
```

The reservoir gives the visual response a short temporal memory rather than behaving like a direct equalizer.

See [ENGINE.md](./ENGINE.md) for the implementation details.

---

## Mobile playback limitations
- Full background playback cannot be guaranteed because browser and OS behaviour varies
- Wake Lock helps while the page remains active
- After a phone call or app interruption, the app attempts to resume when it returns to the foreground
- Some iOS paths require a fresh user gesture; in that case the current track is preserved and the display asks for **TAP PLAY TO RESUME**
- A manual **PAUSE** is never treated as an interruption

---

## Demo Page

https://masato-nasu.github.io/GS-Visualizer/

---

## Tech Stack
- HTML / CSS / JavaScript
- Web Audio API
- Gray-Scott reaction-diffusion model
- Service Worker / Web App Manifest
- Wake Lock API
- Media Session API

---

## License

MIT License
