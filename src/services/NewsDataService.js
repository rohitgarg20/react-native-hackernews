import {API_END_POINTS, BASE_URL} from '../constant/Constant';

const RECORDS_TO_FETCH = 20;

class NewsDataService {
  topStoriesIds = [];
  fetchedStoriesEndingIndex = 0;

  setNewsTopStoriesIds = ids => {
    this.topStoriesIds = [...ids];
  };

  updateFetchedStoriesIndex = () => {
    this.fetchedStoriesEndingIndex =
      this.fetchedStoriesEndingIndex + RECORDS_TO_FETCH;
  };

  fetchNewsDetailData = async () => {
    const idsToFetchDetail = this.topStoriesIds.slice(
      this.fetchedStoriesEndingIndex,
      this.fetchedStoriesEndingIndex + RECORDS_TO_FETCH,
    );
    this.updateFetchedStoriesIndex();
    const storiesDetail = await Promise.all(
      idsToFetchDetail.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          response => response.json(),
        ),
      ),
    );

    return storiesDetail;
  };

  fetchNewsListIds = async () => {
    try {
      const result = await fetch(`${BASE_URL}/${API_END_POINTS.GET_TOP_NEWS}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      });
      const newsIdsList = await result.json();
      this.setNewsTopStoriesIds(newsIdsList);
      console.log('responseData', newsIdsList);
      return await this.fetchNewsDetailData();
    } catch (err) {
      console.log('err in fetching new list ids', err);
    }
  };
}

export const newsDataService = new NewsDataService();
