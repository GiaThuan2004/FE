// src/mockBackend.js
let mockUsers = [];
let mockRecipes = [];
let favorites = [];
let mealPlan = {
  "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [],
  "Friday": [], "Saturday": [], "Sunday": []
};

// Hàm an toàn để tải dữ liệu từ localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.warn(`Lỗi phân tích dữ liệu từ localStorage cho ${key}:`, e.message);
    localStorage.removeItem(key);
    return defaultValue;
  }
};

// Tải dữ liệu từ db.json (giả định nhúng)
const initializeData = () => {
  const dbData = {
    recipes: [
      {
        id: 1,
        title: "Canh chua cá lóc",
        description: "Một món canh chua đặc trưng của miền Tây Nam Bộ, thơm ngon và bổ dưỡng.",
        category: "Món soup",
        cookingTime: 40,
        servings: 3,
        ingredients: ["Cá lóc 500g", "Cà chua 2 quả", "Dứa 1/4 quả", "Me chua 1 muỗng", "Rau om"],
        instructions: "1. Làm sạch cá, cắt khúc. 2. Nấu nước dùng với me, thêm cà chua và dứa. 3. Thả cá vào, nêm nếm gia vị, thêm rau om trước khi tắt bếp.",
        nutrition: { calories: 300, protein: 25, fat: 10, carbs: 15 },
        image: "https://example.com/canh-chua.jpg",
        rating: 4.2,
        comments: [],
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Bánh xèo giòn rụm",
        description: "Bánh xèo vàng giòn, ăn kèm rau sống và nước mắm chua ngọt.",
        category: "Món chính",
        cookingTime: 30,
        servings: 4,
        ingredients: ["Bột gạo 200g", "Nước cốt dừa 100ml", "Tôm 200g", "Đậu xanh", "Hành lá"],
        instructions: "1. Trộn bột với nước cốt dừa, để nghỉ 30 phút. 2. Nhồi đậu xanh, thêm tôm, chiên vàng trên chảo. 3. Rắc hành lá, gấp đôi bánh.",
        nutrition: { calories: 450, protein: 15, fat: 20, carbs: 55 },
        image: "https://example.com/banh-xeo.jpg",
        rating: 4.7,
        comments: [],
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
    ]
  };

  mockRecipes = loadFromLocalStorage('recipes', dbData.recipes);
  mockUsers = loadFromLocalStorage('users', mockUsers);
  favorites = loadFromLocalStorage('favorites', favorites);
  mealPlan = loadFromLocalStorage('mealPlan', mealPlan);
};

initializeData();

// Hàm mock API
const mockApi = {
  get: async (url) => {
    try {
      switch (url) {
        case '/recipes':
          console.log("Returning all recipes:", mockRecipes); // Debug log
          return { data: mockRecipes };
        case '/favorites':
          return { data: favorites };
        case '/mealPlan':
          return { data: mealPlan };
        case '/profile':
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (Object.keys(user).length > 0) return { data: user };
          throw new Error('Không có thông tin người dùng.');
        case '/recipes/:id':
          const id = parseInt(url.split('/').pop());
          console.log("Searching for recipe with id:", id, "in", mockRecipes); // Debug log
          if (isNaN(id)) throw new Error('ID không hợp lệ.');
          const recipe = mockRecipes.find(r => r.id === id);
          if (recipe) return { data: recipe };
          throw new Error(`Công thức với ID ${id} không tìm thấy.`);
        default:
          throw new Error('Endpoint không hỗ trợ.');
      }
    } catch (error) {
      console.warn(`Lỗi trong GET ${url}:`, error.message);
      throw error;
    }
  },

  post: async (url, data) => {
    try {
      switch (url) {
        case '/recipes':
          if (!data.title || !data.category || !data.cookingTime || !data.servings || !data.ingredients || !data.instructions) {
            throw new Error('Vui lòng cung cấp đầy đủ thông tin công thức.');
          }
          const newId = mockRecipes.length > 0 ? Math.max(...mockRecipes.map(r => r.id)) + 1 : 1;
          const newRecipe = { id: newId, ...data, createdAt: new Date().toISOString(), comments: [], isFavorite: false, rating: 0 };
          mockRecipes.push(newRecipe);
          console.log("Added new recipe:", newRecipe); // Debug log
          localStorage.setItem('recipes', JSON.stringify(mockRecipes));
          return { data: newRecipe };
        case '/recipes/:id':
          const recipeId = parseInt(url.split('/').pop());
          const recipeIndex = mockRecipes.findIndex(r => r.id === recipeId);
          if (recipeIndex === -1) throw new Error('Công thức không tìm thấy.');
          mockRecipes[recipeIndex] = { ...mockRecipes[recipeIndex], ...data, createdAt: new Date().toISOString() };
          console.log("Updated recipe with id:", recipeId, "to:", mockRecipes[recipeIndex]); // Debug log
          localStorage.setItem('recipes', JSON.stringify(mockRecipes));
          return { data: mockRecipes[recipeIndex] };
        // Các case khác giữ nguyên
        case '/auth/register':
          if (mockUsers.some(u => u.email === data.email)) throw new Error('Email đã tồn tại.');
          if (!data.email || !data.password || !data.name) throw new Error('Vui lòng điền đầy đủ thông tin.');
          const newUser = { email: data.email, password: data.password, name: data.name, avatar: 'default-avatar.jpg' };
          mockUsers.push(newUser);
          localStorage.setItem('users', JSON.stringify(mockUsers));
          return { data: { message: 'Đăng ký thành công', user: newUser } };
        case '/auth/login':
          const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
          if (!user) throw new Error('Email hoặc mật khẩu không đúng.');
          const accessToken = 'mock-token-' + Math.random().toString(36).substr(2);
          const response = { accessToken, email: user.email, name: user.name, avatar: user.avatar };
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify({ email: user.email, name: user.name, avatar: user.avatar }));
          return { data: response };
        case '/favorites':
          if (!data.favoriteIds || !Array.isArray(data.favoriteIds)) throw new Error('Danh sách ID yêu thích không hợp lệ.');
          favorites = mockRecipes.filter(r => data.favoriteIds.includes(r.id));
          localStorage.setItem('favorites', JSON.stringify(favorites));
          return { data: favorites };
        case '/profile':
          const currentUser = mockUsers.find(u => u.email === JSON.parse(localStorage.getItem('user') || '{}')?.email);
          if (currentUser) {
            Object.assign(currentUser, data);
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('users', JSON.stringify(mockUsers));
            return { data: { message: 'Cập nhật hồ sơ thành công', user: currentUser } };
          }
          throw new Error('Không tìm thấy người dùng để cập nhật.');
        case '/mealPlan':
          if (!data.day || !data.recipeId) throw new Error('Vui lòng cung cấp ngày và ID công thức.');
          const recipe = mockRecipes.find(r => r.id === data.recipeId);
          if (!recipe) throw new Error('Công thức không tồn tại.');
          if (!mealPlan[data.day]) throw new Error('Ngày không hợp lệ.');
          if (!mealPlan[data.day].some(r => r.id === data.recipeId)) {
            mealPlan[data.day].push(recipe);
            localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
            return { data: { message: 'Thêm kế hoạch thành công', plan: mealPlan[data.day] } };
          }
          throw new Error('Công thức đã tồn tại trong kế hoạch ngày này.');
        default:
          throw new Error('Endpoint không hỗ trợ.');
      }
    } catch (error) {
      console.warn(`Lỗi trong POST ${url}:`, error.message);
      throw error;
    }
  },

  // delete: async (url, data) => {
  //   try {
  //     switch (url) {
  //       case '/mealPlan':
  //         if (!data.day || !data.recipeId) throw new Error('Vui lòng cung cấp ngày và ID công thức để xóa.');
  //         const dayPlan = mealPlan[data.day] || [];
  //         const recipeIndex = dayPlan.findIndex(r => r.id === data.recipeId);
  //         if (recipeIndex !== -1) {
  //           dayPlan.splice(recipeIndex, 1);
  //           mealPlan[data.day] = dayPlan;
  //           localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  //           return { data: { message: 'Xóa kế hoạch thành công', plan: dayPlan } };
  //         }
  //         throw new Error('Công thức không tìm thấy trong kế hoạch.');
  //       case '/recipes/:id':
  //         const recipeId = parseInt(url.split('/').pop());
  //         const recipeIndex = mockRecipes.findIndex(r => r.id === recipeId);
  //         if (recipeIndex === -1) throw new Error('Công thức không tìm thấy.');
  //         mockRecipes.splice(recipeIndex, 1);
  //         localStorage.setItem('recipes', JSON.stringify(mockRecipes));
  //         return { data: { message: 'Xóa công thức thành công' } };
  //       default:
  //         throw new Error('Endpoint không hỗ trợ.');
  //     }
  //   } catch (error) {
  //     console.warn(`Lỗi trong DELETE ${url}:`, error.message);
  //     throw error;
  //   }
  // }
};

export default mockApi;