// import Svg, {
//   Circle,
//   Ellipse,
//   G,
//   TSpan,
//   TextPath,
//   Path,
//   Polygon,
//   Polyline,
//   Line,
//   Rect,
//   Use,
//   Image,
//   Symbol,
//   Defs,
//   LinearGradient,
//   RadialGradient,
//   Stop,
//   ClipPath,
//   Pattern,
//   Mask,
//   SvgXML,
// } from 'react-native-svg';

import React, { Component } from 'react';
import { StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Dimensions,
  NativeModules,
  Platform } from 'react-native';

import NavigationBar from 'react-native-navbar';
import Sound from 'react-native-sound';
import { RFPercentage } from "react-native-responsive-fontsize";
import { WebView } from 'react-native-webview';

// Original from Oliver
import CharacterView from 'react-native-character-view-2'
const CharacterViewManager = NativeModules.RNCharacterViewManager;

// import { requireNativeComponent } from 'react-native';
// const CharacterView = requireNativeComponent('CharacterView');
import AndroidCharacterView from './CharacterView'
//import { FlatList } from 'react-native-gesture-handler';

var DeckStore = require('../stores/DeckStore');
var ProgressBar = require('./ProgressBar');

var SVGData = require('../stores/SVGData');

class Learn extends Component {
  constructor(props) {
    super(props);
    this._animateStrokes = this._animateStrokes.bind(this);
    this._playRecording = this._playRecording.bind(this);
    this.onScrollAnimationEnd = this.onScrollAnimationEnd.bind(this);
    const { rawPinyin, tone } = this.props.character;
    this.sound = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE);
    this.state = { character: this.props.character, playing: false, deckData: this.props.deck.questions.map(createDefinitionRow) };
  }

  componentDidMount() {
    //console.log("mounted");
    setTimeout(this._playRecording, 400);
    //console.log("recording played?");
    setTimeout(() => { this._animateStrokes() }, 400);
    this._isMounted = true; //sort of an antipattern
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _animateStrokes() {
    if ( Platform.OS === 'ios') {
      CharacterViewManager.animateStrokes();
    }
  }

  _playRecording() {
    // this.sound.stop();
    if (this.state.playing) return
    this.setState({ playing: true })
    this.sound.play((success) => {
      //console.log("SOUND FILE: ", this.sound)
      if (this._isMounted)
        this.setState({ playing: false })
    });
  }

  onScrollAnimationEnd(e) {
    e.stopPropagation();
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const i = Math.max(0, Math.round(contentOffset.x/layoutMeasurement.width)); //changed from floor to round
    //const i = this.state.character.rank-1
    //console.log(e.nativeEvent)
    // console.log("Rank: ", this.state.character.rank)
    // console.log("i: ", i)
    if (this.props.deck.questions[i] == this.state.character && this.state.character.rank !== 25){
      return;
    }

    this.setState({
      character: this.props.deck.questions[i]
    }, () => {
      setTimeout(() => { this._animateStrokes() }, 100);
      const { rawPinyin, tone } = this.state.character;
      this.sound = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE, (error) => {
        //console.log("SOUND FILE: ", this.sound)
        if (error) {
          //console.log('failed to load the sound', error);
        } else { // loaded successfully
          setTimeout(this._playRecording, 100);
          this._isMounted = true; //sort of an antipattern
        }
      });
    })
  }

  _renderItem({item, index}){ // Passing as object from here
    return (
      <View key={index}>
          {item}
      </View>
    )
  }

  render() { 
    const { meaning, pinyin, character } = this.state.character;

    let leftButton = <TouchableHighlight
      onPress={() => this.props.navigator.pop()}
      underlayColor={'transparent'}>
      <View style={styles.closeButton}>
          <Text style={{ fontSize: 25, color: '#333' }}>
            x
          </Text>
      </View>
    </TouchableHighlight>


    let progress = DeckStore.getProgressOfDeck(this.props.deck.name);
    let color;
		if (progress < 20)
    	color = '#aaa';
    else if (progress < 70)
    	color = '#de4e51';
		else if (progress < 90)
			color = '#fbb72f';
		else if (progress < 100)
			color = '#5ebd56';
		else
			color = '#00ee00';
    let rightButton =
    <View style={styles.percentageView}>
        <Text style={{
          color: color,
          fontSize: 16,
          fontWeight: '500',
          alignSelf: 'center'
        }}>{progress + '%'}</Text>
    </View>

    var titleConfig = {
      title: this.props.deck.name+' ('+this.state.character.rank+'/'+this.props.deck.total+')',
      tintColor: '#000'
    };

    let deck = this.props.deck;

    // need to store?
    function get_svg() {
      var svg_text = `
      <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <g transform="scale(1, -1) translate(0, -900)">
        <style type="text/css">
      `;
      var c = character;
      var l = SVGData[c].strokes.length;
      var i;

      for (i = 0; i < l; i++) {
        svg_text += `
        @keyframes keyframes` + i + ` {
              from {
                stroke: blue;
                stroke-dashoffset: 1051;
                stroke-width: 128;
              }
              77% {
                animation-timing-function: step-end;
                stroke: blue;
                stroke-dashoffset: 0;
                stroke-width: 128;
              }
              to {
                stroke: black;
                stroke-width: 1024;
              }
            }
            #make-me-a-hanzi-animation-` + i + ` {
              animation: keyframes`+ i +` 1.1053059895833333s both;
              animation-delay: `+ i +`s;
              animation-timing-function: linear;
            }

        `
      }

    svg_text += '</style>\n\n';

      for (i = 0; i < l; i++) {
        svg_text += '<path d="' + SVGData[c].strokes[i]
        + '" fill="lightgray"></path>\n\n';
      }


      for (i = 0; i < l; i++) {
        svg_text += '<clipPath id="make-me-a-hanzi-clip-' + i + '">\n'
        + '<path d="' + SVGData[c].strokes[i]
        + '"></path>\n</clipPath>\n';
        svg_text += '<path clip-path="url(#make-me-a-hanzi-clip-' + i
        + '" d="';

        var m;
        for (m = 0; m < SVGData[c].medians[i].length; m++) {
           if (m == 0) {
            svg_text+='M ' + SVGData[c].medians[i][m][0] + ' '
            + SVGData[c].medians[i][m][1];
           } else {
            svg_text+=' L ' + SVGData[c].medians[i][m][0] + ' '
            + SVGData[c].medians[i][m][1];
           }
        }


        svg_text += `" fill="none" id="make-me-a-hanzi-animation-` + i
        +`"stroke-dasharray="923 1846" stroke-linecap="round"></path>\n\n`;
      }

      svg_text += '</g>\n</svg>';

      svg_text2 = `
      `;
      return svg_text;
    }

    /*function get_svg() {
      //return character;
      return SVGData["å…¥"].strokes[0];
    }*/

// const deckData = deck.questions.map(createDefinitionRow);

if (Platform.OS === 'android') {
    return (
      <View style={styles.container} >
          <NavigationBar
            title={titleConfig}
            leftButton={leftButton}
            rightButton={rightButton}
            tintColor={'#f5f5f5'}
            style={styles.navBar} />
          <ProgressBar progress={progress} />

          <FlatList
            horizontal={true}
            initialScrollIndex={this.state.character.rank-1}
            showsHorizontalScrollIndicator={false}
            data={this.state.deckData}
            renderItem={this._renderItem}
            style={styles.scrollView}
            initialNumToRender={this.state.deckData.length}
            maxToRenderPerBatch={this.state.deckData.length}
            onMomentumScrollEnd={this.onScrollAnimationEnd}
            pagingEnabled={true}
            decelerationRate={0}  
            onEndReachedThreshold={0}          
            >
          </FlatList>

          <AndroidCharacterView
          style={styles.wordView}
          data={get_svg()}
          quiz={false}
          />
      </View>
    )
  } else {
    return(
      <View style={styles.container} >
          <NavigationBar
            title={titleConfig}
            leftButton={leftButton}
            rightButton={rightButton}
            tintColor={'#f5f5f5'}
            style={styles.navBar} />
          <ProgressBar progress={progress} />

          <FlatList
            horizontal={true}
            initialScrollIndex={this.state.character.rank-1}
            data={deck.questions.map(createDefinitionRow)}
            renderItem={this._renderItem}
            pagingEnabled={true}
            onMomentumScrollEnd={this.onScrollAnimationEnd}
            style={styles.scrollView}>
          </FlatList>

          <View style={styles.wordView}>
            <CharacterView
              character={character}
              ref="characterView"
              backgroundColor="transparent"
              style={{flex: 1}} />
          </View>
      </View>
    )
   }
  }
}
//issue is in Definition and the map function called from FlatList
//for some reason, it appears to be mapping the elements out of order and twice when you get further down the list
const createDefinitionRow = (character, i) => <Definition key={i} character={character} />;

class Definition extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { character, pinyin, meaning } = this.props.character;
    return (
      <View style={styles.meaningView}>
        <Text style={styles.character}>
          {character}
        </Text>
        <Text style={styles.pinyin}>
          {pinyin}
        </Text>
        <Text style={styles.meaning}>
          {meaning}
        </Text>
      </View>
    )
  }
}

var screen = Dimensions.get('window');
const NAV_BAR_COLOR = '#F4F4F4';
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  navBar: {
    backgroundColor: NAV_BAR_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  scrollView: {
    backgroundColor: '#fff',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  meaningView: {
    flex: 1,
    width: screen.width,
    justifyContent: 'center',
    backgroundColor: '#fff',
    // backgroundColor: '#ddd'
  },
  wordView: {
    height: screen.width,
    // backgroundColor: '#ddd',
    // marginVertical: 10,
  },
  character: {
    fontSize: RFPercentage(5),
    textAlign: 'center',
    fontFamily: 'UKaiCN',
    color: '#111111'
  },
  pinyin: {
    fontSize: RFPercentage(3),
    fontFamily: 'Roboto',
    padding: 10,
    textAlign: 'center',
    color: '#555'
  },
  meaning: {
    fontSize: RFPercentage(3),
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: '#555'
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 44,
    flex: 1
  },
  percentageView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  percentage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22
    // width: 44,
    // flex: 1
  }
})

module.exports = Learn;