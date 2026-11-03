import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const categories = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
  'Drinks',
  'Healthy',
  'Italian',
  'Indian',
  'Vegan',
];

const initialRecipes = [
  {
    id: '1',
    name: 'Pancakes',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600',
    time: '20 min',
    servings: '2',
    calories: '250 kcal',
    difficulty: 'Easy',
    ingredients: ['1 cup flour', '1 egg', '1 cup milk', '2 tbsp sugar'],
    instructions: 'Mix all ingredients. Heat a pan. Pour the batter and cook both sides until golden brown. Serve warm.',
  },
  {
    id: '2',
    name: 'Vegetable Biryani',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600',
    time: '40 min',
    servings: '3',
    calories: '350 kcal',
    difficulty: 'Medium',
    ingredients: ['Rice', 'Mixed vegetables', 'Onion', 'Tomato', 'Biryani masala'],
    instructions: 'Cook vegetables with spices. Add soaked rice and water. Cook until rice is fluffy. Serve hot.',
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600',
    time: '30 min',
    servings: '2',
    calories: '400 kcal',
    difficulty: 'Medium',
    ingredients: ['Pizza base', 'Tomato sauce', 'Mozzarella', 'Basil'],
    instructions: 'Spread tomato sauce over the pizza base. Add mozzarella and basil. Bake until the cheese melts.',
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    time: '50 min',
    servings: '6',
    calories: '320 kcal',
    difficulty: 'Medium',
    ingredients: ['Flour', 'Cocoa powder', 'Sugar', 'Milk', 'Butter'],
    instructions: 'Mix the ingredients into a smooth batter. Pour into a cake tin and bake until cooked.',
  },
  {
    id: '5',
    name: 'Fresh Fruit Salad',
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600',
    time: '10 min',
    servings: '2',
    calories: '150 kcal',
    difficulty: 'Easy',
    ingredients: ['Apple', 'Banana', 'Papaya', 'Grapes', 'Honey'],
    instructions: 'Wash and chop all fruits. Mix in a bowl. Add honey and serve fresh.',
  },
  {
    id: '6',
    name: 'Masala Dosa',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
    time: '25 min',
    servings: '2',
    calories: '280 kcal',
    difficulty: 'Medium',
    ingredients: ['Dosa batter', 'Potatoes', 'Onion', 'Mustard seeds', 'Spices'],
    instructions: 'Prepare potato masala. Spread dosa batter on a hot pan. Add masala and fold. Serve with chutney.',
  },
  {
    id: '7',
    name: 'Fruit Smoothie',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=600',
    time: '5 min',
    servings: '1',
    calories: '180 kcal',
    difficulty: 'Easy',
    ingredients: ['Banana', 'Strawberries', 'Milk', 'Honey'],
    instructions: 'Add all ingredients to a blender. Blend until smooth and serve chilled.',
  },
  {
    id: '8',
    name: 'Veg Sandwich',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600',
    time: '10 min',
    servings: '2',
    calories: '220 kcal',
    difficulty: 'Easy',
    ingredients: ['Bread', 'Cucumber', 'Tomato', 'Cheese', 'Butter'],
    instructions: 'Spread butter on bread. Add vegetables and cheese. Toast and serve.',
  },
  {
    id: '9',
    name: 'Oatmeal Bowl',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600',
    time: '10 min',
    servings: '1',
    calories: '210 kcal',
    difficulty: 'Easy',
    ingredients: ['Oats', 'Milk', 'Banana', 'Chia seeds', 'Honey'],
    instructions: 'Cook oats with milk. Add banana, chia seeds and honey. Serve warm.',
  },
  {
    id: '10',
    name: 'Paneer Curry',
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
    time: '35 min',
    servings: '3',
    calories: '300 kcal',
    difficulty: 'Medium',
    ingredients: ['Paneer', 'Tomatoes', 'Onion', 'Cream', 'Spices'],
    instructions: 'Prepare onion tomato gravy. Add spices and paneer. Simmer until cooked and serve.',
  },
];

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Breakfast',
    image: '',
    time: '',
    servings: '',
    calories: '',
    difficulty: 'Easy',
    ingredients: '',
    instructions: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem('foodie_recipes');
      const savedFavorites = await AsyncStorage.getItem('foodie_favorites');

      if (savedRecipes) {
        setRecipes([...initialRecipes, ...JSON.parse(savedRecipes)]);
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.log('Loading error:', error);
    }
  };

  const saveRecipes = async (updatedRecipes) => {
    setRecipes(updatedRecipes);

    const customRecipes = updatedRecipes.filter(
      recipe => recipe.isCustom
    );

    await AsyncStorage.setItem(
      'foodie_recipes',
      JSON.stringify(customRecipes)
    );
  };

  const toggleFavorite = async (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(item => item !== id)
      : [...favorites, id];

    setFavorites(updated);

    await AsyncStorage.setItem(
      'foodie_favorites',
      JSON.stringify(updated)
    );
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      name: '',
      category: 'Breakfast',
      image: '',
      time: '',
      servings: '',
      calories: '',
      difficulty: 'Easy',
      ingredients: '',
      instructions: '',
    });

    setPage('add');
  };

  const openEditForm = (recipe) => {
    setEditingId(recipe.id);

    setForm({
      name: recipe.name,
      category: recipe.category,
      image: recipe.image,
      time: recipe.time,
      servings: recipe.servings,
      calories: recipe.calories,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions,
    });

    setPage('add');
  };

  const saveRecipe = async () => {
    if (
      !form.name.trim() ||
      !form.ingredients.trim() ||
      !form.instructions.trim()
    ) {
      Alert.alert('Missing information', 'Please fill in the recipe name, ingredients and instructions.');
      return;
    }

    const recipe = {
      ...form,
      id: editingId || Date.now().toString(),
      ingredients: form.ingredients
        .split('\n')
        .filter(item => item.trim()),
      isCustom: true,
    };

    let updated;

    if (editingId) {
      updated = recipes.map(item =>
        item.id === editingId ? recipe : item
      );
    } else {
      updated = [...recipes, recipe];
    }

    await saveRecipes(updated);
    setSelectedCategory('My Food');
    setPage('home');

    Alert.alert(
      'Success!',
      editingId ? 'Recipe updated successfully!' : 'Recipe added successfully!'
    );
  };

  const deleteRecipe = (id) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = recipes.filter(item => item.id !== id);
            await saveRecipes(updated);
            setFavorites(favorites.filter(item => item !== id));
            setSelectedRecipe(null);
            setPage('home');
          },
        },
      ]
    );
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (selectedCategory === 'My Food') return recipe.isCustom;
    if (selectedCategory === 'Favorites') return favorites.includes(recipe.id);
    if (selectedCategory === 'All') return true;

    return recipe.category === selectedCategory;
  });

  const RecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedRecipe(item);
        setPage('details');
      }}
      activeOpacity={0.85}
    >
      <View>
        <Image
          source={{
            uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
          }}
          style={styles.cardImage}
        />

        <TouchableOpacity
          style={styles.heart}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={{ fontSize: 21 }}>
            {favorites.includes(item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>

        <View style={styles.cardBottom}>
          <Text style={styles.smallText}>⏱ {item.time || '15 min'}</Text>
          <Text style={styles.smallText}>🔥 {item.calories || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHome = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>HELLO, FOOD LOVER 👋</Text>
          <Text style={styles.title}>What would you</Text>
          <Text style={styles.title}>
            like to <Text style={styles.orange}>cook?</Text>
          </Text>
        </View>

        <View style={styles.logo}>
          <Text style={{ fontSize: 27 }}>🍳</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <TextInput
          placeholder="Search delicious recipes..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      <Text style={styles.sectionTitle}>Explore Categories</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 22 }}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.category,
              selectedCategory === category && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => setSelectedCategory('My Food')}
          style={[
            styles.category,
            selectedCategory === 'My Food' && styles.activeCategory,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'My Food' && styles.activeCategoryText,
            ]}
          >
            My Food
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All'
            ? 'Popular Recipes'
            : selectedCategory === 'Favorites'
            ? 'My Favourites'
            : selectedCategory === 'My Food'
            ? 'My Recipes'
            : `${selectedCategory} Recipes`}
        </Text>

        <Text style={styles.recipeCount}>
          {filteredRecipes.length} recipes
        </Text>
      </View>

      {selectedCategory === 'My Food' && (
        <TouchableOpacity style={styles.addButton} onPress={openAddForm}>
          <Text style={styles.addButtonText}>＋ Add New Recipe</Text>
        </TouchableOpacity>
      )}

      {filteredRecipes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>🍽️</Text>
          <Text style={styles.emptyTitle}>Nothing here yet!</Text>
          <Text style={styles.emptyText}>
            Add your own delicious recipes.
          </Text>
        </View>
      ) : (
        <View style={styles.recipeGrid}>
          {filteredRecipes
            .filter(item =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(item => (
              <RecipeCard key={item.id} item={item} />
            ))}
        </View>
      )}
    </>
  );

  const [search, setSearch] = useState('');

  const renderDetails = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setPage('home')}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: selectedRecipe.image }}
        style={styles.detailImage}
      />

      <View style={styles.detailContent}>
        <View style={styles.sectionRow}>
          <Text style={styles.detailTitle}>{selectedRecipe.name}</Text>

          <TouchableOpacity
            onPress={() => toggleFavorite(selectedRecipe.id)}
          >
            <Text style={{ fontSize: 28 }}>
              {favorites.includes(selectedRecipe.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.detailCategory}>
          {selectedRecipe.category}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={styles.statValue}>{selectedRecipe.time}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🍽️</Text>
            <Text style={styles.statValue}>{selectedRecipe.servings}</Text>
            <Text style={styles.statLabel}>Servings</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{selectedRecipe.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{selectedRecipe.difficulty}</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
        </View>

        <Text style={styles.detailHeading}>Ingredients</Text>

        {selectedRecipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            ✓  {ingredient}
          </Text>
        ))}

        <Text style={styles.detailHeading}>Instructions</Text>

        <Text style={styles.instructions}>
          {selectedRecipe.instructions}
        </Text>

        {selectedRecipe.isCustom && (
          <View style={styles.editRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditForm(selectedRecipe)}
            >
              <Text style={styles.buttonText}>✏️ Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRecipe(selectedRecipe.id)}
            >
              <Text style={styles.buttonText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setPage('home')}
        >
          <Text style={styles.backText}>← Back to My Food</Text>
        </TouchableOpacity>

        <Text style={styles.formTitle}>
          {editingId ? 'Edit Recipe ✏️' : 'Create Recipe 🍳'}
        </Text>

        <Text style={styles.formSubtitle}>
          Share your favourite recipe with the world!
        </Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.previewImage} />
          ) : (
            <>
              <Text style={{ fontSize: 35 }}>📷</Text>
              <Text style={styles.imagePickerText}>Upload Recipe Image</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Recipe Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter recipe name"
          value={form.name}
          onChangeText={text => setForm({ ...form, name: text })}
        />

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.filter(c => c !== 'All').map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.category,
                form.category === category && styles.activeCategory,
              ]}
              onPress={() => setForm({ ...form, category })}
            >
              <Text
                style={[
                  styles.categoryText,
                  form.category === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Preparation Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 30 min"
          value={form.time}
          onChangeText={text => setForm({ ...form, time: text })}
        />

        <Text style={styles.label}>Servings</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 2"
          value={form.servings}
          onChangeText={text => setForm({ ...form, servings: text })}
        />

        <Text style={styles.label}>Calories</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 250 kcal"
          value={form.calories}
          onChangeText={text => setForm({ ...form, calories: text })}
        />

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.difficultyRow}>
          {['Easy', 'Medium', 'Hard'].map(level => (
            <TouchableOpacity
              key={level}
              onPress={() => setForm({ ...form, difficulty: level })}
              style={[
                styles.difficulty,
                form.difficulty === level && styles.activeCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  form.difficulty === level && styles.activeCategoryText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Ingredients * (one per line)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder={'1 cup flour\n2 eggs\n1 cup milk'}
          multiline
          value={form.ingredients}
          onChangeText={text => setForm({ ...form, ingredients: text })}
        />

        <Text style={styles.label}>Step-by-step Instructions *</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Write your cooking instructions..."
          multiline
          value={form.instructions}
          onChangeText={text => setForm({ ...form, instructions: text })}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
          <Text style={styles.saveButtonText}>
            {editingId ? 'Update Recipe' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F3" />

      {page === 'home' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {renderHome()}
        </ScrollView>
      )}

      {page === 'details' && selectedRecipe && renderDetails()}

      {page === 'add' && renderForm()}

      {page === 'home' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              setSelectedCategory('All');
              setSearch('');
            }}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setSelectedCategory('Favorites')}
          >
            <Text style={styles.navIcon}>❤️</Text>
            <Text style={styles.navText}>Favourites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setSelectedCategory('My Food')}
          >
            <Text style={styles.navIcon}>👩‍🍳</Text>
            <Text style={styles.navText}>My Food</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 11,
    color: '#999',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#292321',
  },
  orange: {
    color: '#F47B35',
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#FFE8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 28,
    height: 52,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#292321',
    marginBottom: 15,
  },
  category: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginRight: 9,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#F1E8DF',
  },
  activeCategory: {
    backgroundColor: '#F47B35',
    borderColor: '#F47B35',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  recipeCount: {
    color: '#999',
    fontSize: 12,
  },
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    overflow: 'hidden',
    marginBottom: 17,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 125,
    backgroundColor: '#F0E5DC',
  },
  heart: {
    position: 'absolute',
    right: 9,
    top: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 11,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#292321',
  },
  cardCategory: {
    color: '#F47B35',
    fontSize: 11,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  smallText: {
    color: '#888',
    fontSize: 9,
  },
  addButton: {
    backgroundColor: '#292321',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 55,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },
  emptyText: {
    color: '#999',
    marginTop: 7,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderColor: '#F2EAE2',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 21,
  },
  navText: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
    fontWeight: '600',
  },
  backButton: {
    padding: 18,
    paddingLeft: 20,
  },
  backText: {
    fontSize: 16,
    color: '#F47B35',
    fontWeight: '700',
  },
  detailImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#F0E5DC',
  },
  detailContent: {
    padding: 22,
    paddingBottom: 50,
  },
  detailTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#292321',
    flex: 1,
  },
  detailCategory: {
    color: '#F47B35',
    marginTop: 5,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 25,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    width: '23%',
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 7,
    color: '#292321',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  detailHeading: {
    fontSize: 21,
    fontWeight: '800',
    marginTop: 22,
    marginBottom: 13,
    color: '#292321',
  },
  ingredient: {
    fontSize: 15,
    color: '#555',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 15,
    lineHeight: 25,
    color: '#555',
  },
  editRow: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#F47B35',
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#D94C4C',
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#292321',
    paddingHorizontal: 20,
  },
  formSubtitle: {
    color: '#999',
    marginHorizontal: 20,
    marginTop: 7,
    marginBottom: 20,
  },
  imagePicker: {
    height: 155,
    marginHorizontal: 20,
    backgroundColor: '#FFE9D9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#F47B35',
    fontWeight: '700',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    color: '#292321',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#F0E5DC',
  },
  multiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  difficultyRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
  },
  difficulty: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1E8DF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: '#F47B35',
    padding: 17,
    borderRadius: 14,
    margin: 20,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 50,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});