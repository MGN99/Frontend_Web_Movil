import axios, { AxiosError } from 'axios';
import { Questionnaire } from '../../src/types/QuestionnaireTypes';

const MS_QUESTIONNAIRE_URL = 'http://192.168.1.85:3002';
const QUESTIONNAIRE_ENDPOINT = 'questionnaire/';

export const GetQuestionnaireList = async (): Promise<Questionnaire[]> => {
    try {
        const response = await axios.get(`${MS_QUESTIONNAIRE_URL}/${QUESTIONNAIRE_ENDPOINT}`, {
            headers: {
                'User-Agent': 'rest-client',
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error fetching questionnaires:', axiosError.response ? axiosError.response.data : axiosError.message);
        throw axiosError;
    }
};