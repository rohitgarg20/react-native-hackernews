import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {NewsListComponent} from './src/components/NewsListComponent';

const fetchTS = async cb => {
  const result = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json',
    {
      method: 'GET',
      headers: {Accept: 'application/json', 'Content-type': 'application/json'},
    },
  );
  const json = await result.json();
  const stories = await Promise.all(
    json.map(async id => {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      );
      const comments = res.json();
      return comments;
    }),
  );
  cb(stories);
};

export default function App() {
  // const [ts, setTS] = useState();

  // useEffect(() => {
  //   fetchTS(stories => {setTS(stories);});
  // });

  if (true) {
    return (
      <View style={{flex: 1}}>
        {/* <ScrollView>
        {ts.map(s => (
          <View style={{ padding: 4, }}>
            <Text>{s.title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              <Text>{`${s.score} point(s)`}</Text>
              <Text>{` by ${s.by}`}</Text>
              <Text>{` ${s.time} hour /minutes ago`}</Text>
              <TouchableOpacity
                onPress={async () => {
                  if (s.kids) {
                    const comments = await Promise.all(
                      s.kids.map(async id => {
                        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`,);
                        const comments = res.json();
                        return comments;
                      }),
                    );
                  }
                }}>
                <Text>{` ${s.descendants} comment(s)`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        </ScrollView> */}
        <NewsListComponent />
      </View>
    );
  } else {
    return null;
  }
}
