import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

const IndexScreen = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <View>
      <ScrollView>
        <Text>Hello {user.primaryEmailAddress?.emailAddress}</Text>
        <Text> {JSON.stringify(user, null, 2)}</Text>
      </ScrollView>
    </View>
  );
};

export default IndexScreen;
