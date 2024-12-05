import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GetQuestionnaireList } from '../../src/services/GetQuestionnaireList';
import { Questionnaire } from '../../src/types/QuestionnaireTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigation';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar @expo/vector-icons

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
            setRefreshing(false); 
        }
    };

    useEffect(() => {
        fetchQuestionnaires();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchQuestionnaires(); 
    };

    const handlePress = (questionnaire: Questionnaire) => {
        navigation.navigate('QuestionnaireDetailScreen', { questionnaire });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="black"  />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lista de Cuestionarios</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#0000ff']}
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
        </View>
    );
};

const styles = StyleSheet.create({

    
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        marginTop: 38,
        
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        
    },
    contentContainer: {
        flexGrow: 1,
        padding: 20,
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
