import { Button, Card, Image, Text } from '@rneui/themed';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Character } from '../types/character.type';

export const CharacterList = () => {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const getCharacter = async (page: number) => {
    setLoading(true);

    const response = await axios.get(
      `${process?.env?.EXPO_PUBLIC_MS_RICK as string}/character?page=${page}`
    );

    setCharacters(response.data.results as Character[]);
    setTotalPages(+response.data.info.pages || 1);

    setLoading(false);
  };

  const nextPage = () => {
    getCharacter(currentPage + 1);
    setCurrentPage((state) => state + 1);
  };

  const prevPage = () => {
    getCharacter(currentPage - 1);
    setCurrentPage((state) => state - 1);
  };

  useEffect(() => {
    setTimeout(() => getCharacter(currentPage), 3000);
  }, []);

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator size={75} />
      ) : (
        <>
          <Text style={{ textAlign: 'center' }}>
            Current page: {currentPage}
          </Text>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Button onPress={prevPage} disabled={currentPage === 1}>
              PrevPage
            </Button>
            <Button onPress={nextPage} disabled={currentPage === totalPages}>
              PrevPage
            </Button>
          </View>
          {characters.map((character, index) => (
            <Card key={index}>
              <Card.Title>{character?.name}</Card.Title>
              <Card.Image>
                <Image
                  source={{ uri: character?.image }}
                  style={{ width: 200, height: '100%' }}
                ></Image>
              </Card.Image>
            </Card>
          ))}
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Button>PrevPage</Button>
            <Button>PrevPage</Button>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CharacterList;
