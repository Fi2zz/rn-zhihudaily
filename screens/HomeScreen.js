import React from 'react';
import {
    StyleSheet, Text, View, ScrollView, Image, AppRegistry, ListView,
    FlatList,
    RecyclerViewBackedScrollView,
    StatusBar,
    ActivityIndicator,
    SectionList,
    TouchableHighlight
} from 'react-native';

import Swiper from 'react-native-swiper';


import {latest, history} from "../api/request";




function formatDate(date) {
    const mapping = {
        year: parseInt(date.substring(0, 4)),
        month: parseInt(date.substring(4, 6)) - 1,
        date: parseInt(date.substring(6, 8))
    };
    const d = new Date(mapping.year, mapping.month, mapping.date);
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const padding = n => n > 9 ? `${n}` : `0${n}`;
    return `${d.getFullYear()}年${padding(d.getMonth() + 1)}月${d.getDate()}日  星期${days[d.getDay()]}`
}


export default class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            topStories: [],
            date: null,
            covers: [],
            story: [],
            loadingStoryList: false,
            requestFail: {}
        }
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        const date = this.state.date;
        this.setState({
            loadingStoryList: true
        });
        const fetched = date ? history(date) : latest();
        fetched.then(res => {
            const currStoryList = this.state.story;
            currStoryList.push({
                title: formatDate(res.date),
                data: res.stories.map(item => ({image: item.images[0], title: item.title, id: item.id}))
            });
            const newState = {
                date: res.date,
                story: currStoryList,
                loading: false,
                loadingStoryList: false
            };
            if (!date) {
                newState["covers"] = res.top_stories
            }
            this.setState(newState);
        }).catch(err => {

            this.setState({
                requestFail: err
            })

            // alert(err)

        });
    }

    render() {
        if (this.state.loading) {
            return <View style={styles.errorContainer}>
                <ActivityIndicator animating={true} size="large" color="#fff"/>
                <Text>{Object.keys(this.state.requestFail).join("-")}</Text>
            </View>


        }
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle={'light-content'}
                    style={styles.statusBar}
                />
                <SectionList
                    style={styles.sectionList}
                    ListHeaderComponent={this.coverSwiper.bind(this)}
                    sections={this.state.story}
                    renderItem={({item}) => this.storyItem(item)}
                    keyExtractor={(item, index) => index}
                    stickySectionHeadersEnabled={true}
                    onEndReached={this.fetchData.bind(this)}
                    onEndReachedThreshold={0.1}
                    renderSectionFooter={() => this.state.loadingStoryList ?
                        <ActivityIndicator animating={true}/> : null}
                    renderSectionHeader={({section}) => <Text style={styles.storySectionTitle}>{section.title}</Text>}
                />
            </View>
        );
    }

    coverSwiper() {
        return (<Swiper style={styles.swiperWrap}>
            {
                this.state.covers.map(item => {
                    return (
                        <TouchableHighlight
                            key={item.id}
                            style={styles.swiperSlide}
                            onPress={() => this.goToRoute("Article", item)}>
                            <View style={styles.swiperSlide}>
                                <Image
                                    source={{uri: item.image}}
                                    style={styles.swiperImage}/>
                                <Text style={styles.swiperSlideContent}>{item.title}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                })
            }
        </Swiper>)
    }


    storyItem(item) {
        return <TouchableHighlight
            onPress={() => this.goToRoute("Article", item)}
            underlayColor={'rgba(0,0,0,.2)'}
            style={styles.storyToucheHighlight}>
            <View style={styles.storyListItem}>
                <Image source={{uri: item.image}} style={styles.storyListItemImage}/>
                <Text style={styles.storyListItemContent}>{item.title}</Text>
            </View>
        </TouchableHighlight>
    }


    goToRoute(name, data) {
        this.props.navigation.navigate(name, {
            title: data.title,
            id: data.id,
            cover: data.image
        })
    };

}


const styles = StyleSheet.create({
    errorContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#028fd6",
        flex: 1,
    },
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        backgroundColor: "#028fd6",

    },
    text: {
        color: "#fff"
    },
    sectionList: {
        backgroundColor: "#fff"
    },
    statusBar: {
        height: 20,
        // color: '#fff'
    },
    swiperWrap: {
        flex: 1,
        height: 240,
        backgroundColor: "#000",
        // overflow: "hidden"
    },
    swiperSlide: {
        flex: 1,
        height: 240,
        position: "relative",
        // justifyContent: "flex-start",
        display: "flex",
        backgroundColor: "#028fd6"
    },
    swiperSlideContent: {
        position: "absolute",
        bottom: 10,
        flex: 1,
        fontSize: 14,
        paddingLeft: 8,
        paddingRight: 8
    },
    swiperImage: {
        flex: 1,
        height: 240,
        display: "flex"
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#fff",
        display: "flex"
    },
    flatList: {
        flex: 1,
        display: "flex"
    },
    storyListItem: {
        flex: 1,

    }
    ,
    storyListItemImage: {
        width: 60,
        height: 60,
        position: "absolute",
        top: 0,
        left: 12,
        bottom: 0
    },
    storyListItemContent: {
        position: "absolute",
        left: 84,
        top: 0,
        bottom: 0,
        right: 12,
        fontSize: 16,
        lineHeight: 22
    },
    storyViewList: {
        paddingTop: 12,
        flex: 1,
        marginBottom: 12
    },
    storySectionTitle: {
        justifyContent: "center",
        alignItems: "center",
        height: 64,
        lineHeight: 64,
        flex: 1,
        textAlign: "center",
        backgroundColor: "#028fd6",
        color: '#fff',
        fontSize: 16,
        marginBottom: 12
    },
    storyToucheHighlight: {
        display: "flex",
        flex: 1,
        height: 68,
        paddingTop: 4,
        position: "relative",
        // alignItems:"center",
        // justifyContent:"flex-start"

    }

});
