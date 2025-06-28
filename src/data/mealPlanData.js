// // src/mealPlanData.js
// let mealPlan = {
//   "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [],
//   "Friday": [], "Saturday": [], "Sunday": []
// };

// // Khởi tạo dữ liệu từ localStorage nếu có
// if (localStorage.getItem('mealPlan')) {
//   mealPlan = JSON.parse(localStorage.getItem('mealPlan'));
// }

// // Hàm để lấy dữ liệu mealPlan
// export const getMealPlan = () => {
//   return { ...mealPlan }; // Trả về bản sao để tránh thay đổi trực tiếp
// };

// // Hàm để thêm công thức vào kế hoạch
// export const addRecipeToPlan = (day, recipeId, recipes) => {
//   if (!day || !recipeId) throw new Error('Vui lòng cung cấp ngày và ID công thức.');
//   const recipe = recipes.find(r => r.id === recipeId);
//   if (!recipe) throw new Error('Công thức không tồn tại.');
//   if (!mealPlan[day]) throw new Error('Ngày không hợp lệ.');
//   if (!mealPlan[day].some(r => r.id === recipeId)) {
//     mealPlan[day].push(recipe);
//     localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
//     return { message: 'Thêm kế hoạch thành công', plan: [...mealPlan[day]] };
//   }
//   throw new Error('Công thức đã tồn tại trong kế hoạch ngày này.');
// };

// // Hàm để xóa công thức khỏi kế hoạch
// export const deleteRecipeFromPlan = (day, recipeId) => {
//   if (!day || !recipeId) throw new Error('Vui lòng cung cấp ngày và ID công thức để xóa.');
//   const dayPlan = mealPlan[day];
//   const recipeIndex = dayPlan.findIndex(r => r.id === recipeId);
//   if (recipeIndex !== -1) {
//     dayPlan.splice(recipeIndex, 1);
//     mealPlan[day] = dayPlan;
//     localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
//     return { message: 'Xóa kế hoạch thành công', plan: [...dayPlan] };
//   }
//   throw new Error('Công thức không tìm thấy trong kế hoạch.');
// };