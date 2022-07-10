import React, {Component} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {newsDataService} from '../services/NewsDataService';
import { getRelativeTime } from '../utils/DateUtils';

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: '#b9b9b9',
    padding: 5,
    backgroundColor: '#e6e7ec',
  },
  newsListContainer: {
    padding: 10,
  },
  itemSeperator: {
    paddingBottom: 20,
  },
  boldTitle: {
    fontSize: 24,
    color: 'black',
    fontWeight: '700',
  },
  absolutePosition: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export class NewsListComponent extends Component {
  state = {
    newsList: [],
    isFetchingData: true,
  };

  componentDidMount() {
    newsDataService.fetchNewsListIds().then(topNewsList => {
      console.log('topNewsListtopNewsList', topNewsList);
      this.setState({
        newsList: [...topNewsList],
        isFetchingData: false,
      });
    });
  }

  renderNewsCard = ({item, index}) => {
    const {by = '', title, score, time, descendants = 0} = item || {};
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.boldTitle} numberOfLines={1} ellipsizeMode={'tail'}>
          {title}
        </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <Text>{`${score} point(s)`}</Text>
          <Text>{` by ${by}`}</Text>
        </View>
        <Text>{`${getRelativeTime(new Date(time * 1000))} ago`}</Text>
        <TouchableOpacity>
          <Text>{`${descendants} comment(s)`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderListFooterComponent = () => {
    const {newsList} = this.state;
    const {topStoriesIds} = newsDataService;

    if (newsList?.length === 0 || topStoriesIds.length === newsList.length) {
      return null;
    }

    return (
      <View>
        <ActivityIndicator size={'large'} color={'#0029FF'} />
      </View>
    );
  };

  loadMoreData = () => {
    const {newsList} = this.state;
    const {topStoriesIds} = newsDataService;
    if (newsList?.length === 0 || topStoriesIds.length === newsList.length) {
        console.log('inside if is called')
      return null;
    } else {
        console.log('inside else if is called')
      newsDataService.fetchNewsDetailData().then(topNewsList => {
        this.setState({
          newsList: [...newsList, ...topNewsList],
        });
      });
    }
  };

  getKeyExtractor = (item, index) => {
    const {_id} = item;
    return _id || index;
  };

  renderFetchingView = () => {
    return (
      <View style={styles.absolutePosition}>
        <ActivityIndicator size={'large'} color={'#0029FF'} />
      </View>
    );
  };

  render() {
    const {newsList, isFetchingData} = this.state;
    if (isFetchingData) {
      return this.renderFetchingView();
    }
    return (
      <FlatList
        data={newsList}
        renderItem={this.renderNewsCard}
        contentContainerStyle={styles.newsListContainer}
        ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
        onEndReached={this.loadMoreData}
        onEndReachedThreshold={0.001}
        ListFooterComponent={this.renderListFooterComponent}
        keyExtractor={this.getKeyExtractor}
      />
    );
  }
}
