import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GetQuestionnaireList } from '../../src/services/GetQuestionnaireList';
import { Questionnaire } from '../../src/types/QuestionnaireTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigation';

type QuestionnaireListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'QuestionnaireList'
>;

const QuestionnaireListScreen = () => {
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<QuestionnaireListScreenNavigationProp>();

    const fetchQuestionnaires = async () => {
        try {
            const data = await GetQuestionnaireList();
            setQuestionnaires(data);
        } catch (err) {
            setError('Error fetching questionnaires');
        } finally {
            setLoading(false);
            setRefreshing(false); // Stop the refresh animation
        }
    };

    useEffect(() => {
        fetchQuestionnaires();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchQuestionnaires(); // Re-fetch the data
    };

    const handlePress = (questionnaire: Questionnaire) => {
        navigation.navigate('QuestionnaireDetailScreen', { questionnaire });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#0000ff']} // Customize pull-to-refresh color
                />
            }
        >
            {questionnaires.map((questionnaire) => (
                <TouchableOpacity 
                    key={questionnaire._id} 
                    style={styles.questionnaireCard} 
                    onPress={() => handlePress(questionnaire)}
                >
                    <Text style={styles.title}>{questionnaire.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    questionnaireCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default QuestionnaireListScreen;
