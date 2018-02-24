import React from 'react';
import {
    StyleSheet, Text, View,
    ScrollView,
    Image,
    WebView,
    Dimensions,
    StatusBar,
    Button,
    TouchableHighlight
} from 'react-native';
import {article} from "../api/request";


export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            content: null,
            css: null,
            shareURL: '',
            webViewHeight: Dimensions.get('window').height,
            currentScrollPosition: 0
        }
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        this.fetch()
    }

    fetch() {
        function createCssLink(list) {
            const cssList = list.map(item => `<link href="${item}" rel="stylesheet"/>`);
            return cssList.join(" ")
        }

        article(this.state.id).then(res => {
            this.setState({
                content: res.body,
                css: createCssLink(["http://daily.zhihu.com/css/share.css?v=5956a", ...res.css]),
                cover: res.image,
                shareURL: res.share_url
            })
        })

    }

    getWebViewContentHeight(event) {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (!data.type) {
                return
            }
            const params = data.params;
            switch (data.type) {
                case 'scrollToTop':
                    if (this.props.scrollToTop) {
                        this.props.scrollToTop()
                    }
                    break;
                case 'changeWebViewHeight':
                    this.setState({
                        webViewHeight: params.height
                    });
                    break;
                default:
                    break
            }
        } catch (error) {
            console.warn('webview onMessage error: ' + error.message)
        }

    }


    injectGetWebViewHTMLContentHeight() {


        const getHeight = function () {
            let height = 0;
            if (document.documentElement.clientHeight > document.body.clientHeight) {
                height = document.documentElement.clientHeight
            } else {
                height = document.body.clientHeight
            }
            const action = {type: 'changeWebViewHeight', params: {height: height}};
            window.postMessage(JSON.stringify(action))
        };
        return `(${String(getHeight)})()`//'(' + String(getHeightFunc) + ')();'


    }


    createHTMLContent() {
        const {content, css} = this.state;
        return (

            `<html>
				<head>
					<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
                    ${css}
                    <style>.headline{ display: none;}</style>
				</head>
				<body>${content}</body>
			</html>`
        );
    }

    getPositionWhenScrolling(event) {
        const position = event.nativeEvent.contentOffset.y;
        if (position === 0) {

            this.setState({
                currentScrollPosition: position
            })
        }


    }

    getScrollPosition(event) {
        const position = event.nativeEvent.contentOffset.y;
        this.setState({
            currentScrollPosition: position
        })
    }

    setHiddenBarStyle() {
        return {
            height: this.state.currentScrollPosition > 20 ? 20 : 0,
            backgroundColor: "#fff",
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9,
            color: '#fff'
        }
    }

    setStatusBarStyle() {
        return this.state.currentScrollPosition > 20 ? 'dark-content' : 'light-content'
    }

    render() {
        return <View style={styles.container}>
            <StatusBar barStyle={this.setStatusBarStyle()}
                       animated={true}/>
            <Text style={this.setHiddenBarStyle()}/>
            <ScrollView
                canCancelContentTouches={true}
                scrollsToTop={false}
                bounces={false}
                onMomentumScrollBegin={this.getScrollPosition.bind(this)}
                onMomentumScrollEnd={this.getScrollPosition.bind(this)}
                onScroll={this.getPositionWhenScrolling.bind(this)}
                bouncesZoom={true}>
                <View style={styles.coverView}>
                    <Image source={require("../assets/cover-mask.png")} style={styles.coverMask}/>
                    <Image source={{uri: this.state.cover}} style={{height: 220}}/>
                    <Text style={styles.coverTitle}>{this.state.title}</Text>
                </View>
                <WebView
                    style={{height: this.state.webViewHeight, marginBottom: 48}}
                    source={{html: this.createHTMLContent()}}
                    onMessage={(ev) => this.getWebViewContentHeight(ev)}
                    injectedJavaScript={this.injectGetWebViewHTMLContentHeight()}
                />
            </ScrollView>

            <View style={styles.bottomAction}>
                <TouchableHighlight onPress={() => this.props.navigation.goBack()}

                                    style={styles.bottomGoBack}

                >
                    <Text

                        style={{
                            lineHeight: 44,
                            height: 44,
                            width: 44,
                            fontSize: 14,
                            textAlign: "center"
                        }}

                    >返回</Text>
                </TouchableHighlight>
            </View>


        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        height: Dimensions.get('window').height,
    },
    bottomGoBack: {
        width: 44,
        height: 44,
        flex: 1,
        // lineHeight:44,
        // fontSize:16,
        // textAlign:"center"
    },
    bottomAction: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: 44,
        flex: 1,
        // alignItems:"center",

        justifyContent: "flex-start",
        display: "flex",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#f6f6f6"


    },
    coverView: {
        height: 224,
        flex: 1,
        position: "relative",
        borderBottomWidth: 4,
        borderBottomColor: "#f6f6f6"
    },
    coverMask: {
        flex: 1,
        height: 220,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2

    },
    coverTitle: {
        fontSize: 20,
        fontWeight: "bold",
        position: "absolute",
        bottom: 12,
        left: 12,
        right: 12,
        zIndex: 3,
        color: '#fff',
        lineHeight: 24
    },

    webView: {
        flex: 1,
    },


});

