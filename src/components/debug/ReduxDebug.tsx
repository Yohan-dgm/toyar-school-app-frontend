import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '@/state-store/store';

export const ReduxDebug: React.FC = () => {
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.app);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Debug Info</Text>
      <Text style={styles.text}>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Token: {token ? 'Present' : 'None'}</Text>
      <Text style={styles.text}>User Data:</Text>
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.text}>- ID: {user.id}</Text>
          <Text style={styles.text}>- Username: {user.username || 'Not set'}</Text>
          <Text style={styles.text}>- Full Name: {user.full_name || 'Not set'}</Text>
          <Text style={styles.text}>- Email: {user.email || 'Not set'}</Text>
        </View>
      ) : (
        <Text style={styles.text}>- No user data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
  userInfo: {
    marginLeft: 16,
  },
});
