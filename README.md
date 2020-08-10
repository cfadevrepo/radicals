# Radicals

## THIS IS THE NEW MAIN REPO 

[iOS version on App Store](https://apps.apple.com/us/app/chinese-radicals-%E4%B8%AD%E6%96%87%E9%83%A8%E9%A6%96/id1102982148)

### Last Working Environment (Jessica Ng, 8/9/20)

Installed and set up dependencies using React Native's ~~[Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html)~~[Environment Setup](https://reactnative.dev/docs/environment-setup) for macOS, target iOS and Android.

iOS is working for **master** branch. 
Android is working **removing_RNCView_dependency** branch. 

- Mac mini (late 2012) running MacOS Mojave 10.14.6 
- XCode: 10.3
- Android Studio: 4.0
- node: 12.8.0
- npm: 6.10.2
- npx: 6.10.2
- yarn: 1.22.4
- react-native: 0.63.1
```$ npm view react-native version```
- react-native-cli: 2.0.1
```$ npm view react-native-cli version```


Was able to run from Xcode and Android Studio.

### Getting Started

If you haven't already, install [Xcode](https://developer.apple.com/xcode/), [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/).

Clone this repo and install the dependencies on the correct branch:

```
git clone https://github.com/cfadevrepo/radicals.git
cd Radicals
```

If running Android, switch branches to `removing_RNCView_dependency`. 

Install dependencies: 
`yarn`

Start the node server: 
`npx react-native start`

#### Running iOS:

Open `ios/Radicals.xcodeproj/` and run from Xcode on the master branch.

#### Running Android:

Open the `android` folder in Android Studio. Set up an AVD. Wait for files to be indexed and run. 
