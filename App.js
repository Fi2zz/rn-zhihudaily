import HomeScreen from './screens/HomeScreen';
import ArticleScreen from './screens/ArticleScreen';
import {StackNavigator} from 'react-navigation';

const routeMap = {
    Home: {
        screen: HomeScreen,
    },
    Article: {
        screen: ArticleScreen,
    }
};


const initRoute = {
    initialRouteName: 'Home',
};

const options = {
    ...initRoute,
    navigationOptions: {}
};
export default StackNavigator(routeMap, options)


