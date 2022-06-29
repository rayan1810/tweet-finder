import React from "react";
import {
  Center,
  Input,
  Button,
  SearchIcon,
  ArrowForwardIcon,
  VStack,
  Box,
  ScrollView,
  Link,
  Heading,
} from "native-base";

export default function App() {
  const [tweetData, setTweetData] = React.useState();
  const [userID, setUserID] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [loadingNextButton, setLoadingNextButton] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState();
  function searchKeywordinData(data, key) {
    const results = data?.filter((tweet) => {
      return tweet.text.search(new RegExp(key, `gi`)) === -1 ? false : true;
    });

    return results;
  }
  async function fetchData() {
    setLoading(true);
    let tweets = await fetch("/api/find_user/" + userName)
      .then((response) => response.json())
      .then((data) => data)
      .then((userData) => {
        setUserID(userData.data.id);
        return fetch("/api/get_user_tweets/" + userData.data.id)
          .then((response) => response.json())
          .then((tweets) => tweets);
      });
    setTweetData(() => {
      setLoading(false);
      return tweets;
    });
  }
  async function fetchDataNextData() {
    setLoadingNextButton(true);
    let tweets = await fetch(
      "/api/get_user_tweets/" + userID + "/" + tweetData.meta.next_token
    )
      .then((response) => response.json())
      .then((tweets) => tweets);
    setTweetData(() => {
      setLoadingNextButton(false);
      return tweets;
    });
    if (tweetData) {
      if (tweetData.meta.next_token) {
        setShowNextPageButton(true);
      }
    }
  }
  React.useEffect(() => {
    setSearchResults(searchKeywordinData(tweetData?.data, query));
    if (tweetData) {
      if (tweetData.meta.next_token) {
        setShowNextPageButton(true);
      }
    }
  }, [tweetData]);
  const [showNextPageButton, setShowNextPageButton] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [query, setQuery] = React.useState("");
  return (
    <Box h="100vh">
      <Box px="6" bg="coolGray.800" flex="1" justifyContent={"center"}>
        <Heading fontSize="2xl" color="info.100">
          Tweet Finder
        </Heading>
      </Box>
      <Center h="90vh" bg="coolGray.100">
        <VStack space="6">
          <Input placeholder="@username" onChangeText={setUserName} />
          <Input placeholder="Search Query?" onChangeText={setQuery} />

          <Button
            colorScheme={"info"}
            size="sm"
            variant="solid"
            alignSelf={"center"}
            leftIcon={<SearchIcon />}
            rightIcon={<ArrowForwardIcon size="xs" />}
            onPress={fetchData}
            isLoading={loading}
          >
            Start Looking
          </Button>

          {/* <> */}
          {showNextPageButton && (
            <Button
              colorScheme={"info"}
              size="sm"
              variant="outline"
              alignSelf={"center"}
              leftIcon={<SearchIcon />}
              rightIcon={<ArrowForwardIcon size="xs" />}
              onPress={fetchDataNextData}
              isLoading={loadingNextButton}
            >
              Search More
            </Button>
          )}

          <Box w="300px" h="350px">
            <ScrollView>
              {searchResults?.map((val) => {
                return (
                  <Link
                    isExternal
                    href={`https://twitter.com/${userName}/status/${val.id}`}
                  >
                    <Box bg="coolGray.200" my="3" p="3" rounded="4">
                      {val.text}
                    </Box>
                  </Link>
                );
              })}
            </ScrollView>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
}
