const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Service = require('../models/service.model');

// Tạo dữ liệu mẫu
const createTestData = async () => {
    try {
        // Xóa tất cả dữ liệu cũ
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Service.deleteMany({});

        // Danh sách tên Category và Subcategory
        const categoriesData = [
            {
                name: "Mỹ phẩm dưỡng da",
                description: "Các sản phẩm chăm sóc da mặt",
                subCategories: [
                    { name: "Kem dưỡng da", description: "Kem dưỡng da dành cho mọi loại da" },
                    { name: "Serum dưỡng da", description: "Serum dành cho da dầu và da khô" },
                    { name: "Mặt nạ", description: "Mặt nạ chăm sóc da tự nhiên" }
                ]
            },
            {
                name: "Mỹ phẩm trang điểm",
                description: "Sản phẩm trang điểm cho phái nữ",
                subCategories: [
                    { name: "Son môi", description: "Các loại son dưỡng và son màu" },
                    { name: "Phấn nền", description: "Phấn nền che khuyết điểm" },
                    { name: "Kẻ mắt", description: "Bút kẻ mắt và mascara" }
                ]
            },
            {
                name: "Dịch vụ chăm sóc da",
                description: "Dịch vụ chăm sóc da mặt và body",
                subCategories: [
                    { name: "Chăm sóc da mặt", description: "Dịch vụ chăm sóc da mặt cao cấp" },
                    { name: "Chăm sóc da body", description: "Dịch vụ chăm sóc da toàn thân" },
                ]
            },
            {
                name: "Dịch vụ spa thư giãn",
                description: "Các liệu trình spa thư giãn cơ thể",
                subCategories: [
                    { name: "Massage thư giãn", description: "Massage thư giãn chuyên nghiệp" },
                    { name: "Tắm trắng", description: "Liệu pháp tắm trắng an toàn" }
                ]
            },
            {
                name: "Mỹ phẩm chăm sóc tóc",
                description: "Các sản phẩm chăm sóc tóc và da đầu",
                subCategories: [
                    { name: "Dầu gội", description: "Dầu gội thảo mộc và hóa học" },
                    { name: "Dầu xả", description: "Dầu xả mềm mượt tóc" },
                    { name: "Serum tóc", description: "Serum chăm sóc tóc khô và hư tổn" }
                ]
            },
            {
                name: "Dịch vụ làm đẹp",
                description: "Dịch vụ chăm sóc sắc đẹp tại salon",
                subCategories: [
                    { name: "Làm móng", description: "Dịch vụ chăm sóc móng tay, móng chân" },
                    { name: "Làm tóc", description: "Uốn, duỗi và nhuộm tóc" },
                    { name: "Trang điểm", description: "Dịch vụ trang điểm dự tiệc và cô dâu" }
                ]
            },
            {
                name: "Chăm sóc da toàn thân",
                description: "Sản phẩm và dịch vụ chăm sóc da toàn thân",
                subCategories: [
                    { name: "Dưỡng ẩm body", description: "Kem dưỡng ẩm dành cho da toàn thân" },
                    { name: "Chống nắng body", description: "Kem chống nắng cho da cơ thể" },
                    { name: "Tẩy tế bào chết body", description: "Sản phẩm tẩy tế bào chết toàn thân" }
                ]
            },
            {
                name: "Mỹ phẩm chăm sóc môi",
                description: "Sản phẩm dưỡng và trang điểm môi",
                subCategories: [
                    { name: "Son dưỡng", description: "Son dưỡng ẩm và chống nắng cho môi" },
                    { name: "Tẩy tế bào chết môi", description: "Sản phẩm tẩy da chết cho môi" },
                    { name: "Mặt nạ môi", description: "Mặt nạ dưỡng môi qua đêm" }
                ]
            },
            {
                name: "Dịch vụ chăm sóc móng",
                description: "Các dịch vụ làm đẹp và chăm sóc móng",
                subCategories: [
                    { name: "Sơn gel", description: "Dịch vụ sơn gel chuyên nghiệp" },
                    { name: "Cắt móng và làm sạch", description: "Dịch vụ chăm sóc móng tay và móng chân" },
                    { name: "Vẽ móng nghệ thuật", description: "Dịch vụ vẽ móng với các mẫu nghệ thuật" }
                ]
            },
            {
                name: "Dịch vụ triệt lông",
                description: "Các liệu trình triệt lông an toàn",
                subCategories: [
                    { name: "Triệt lông mặt", description: "Dịch vụ triệt lông mặt bằng công nghệ cao" },
                    { name: "Triệt lông tay chân", description: "Triệt lông vùng tay chân" },
                    { name: "Triệt lông toàn thân", description: "Liệu trình triệt lông toàn thân" }
                ]
            }
        ];

        // Tạo categories và subcategories
        let categoryIds = [];
        for (let categoryData of categoriesData) {
            const { subCategories, ...categoryFields } = categoryData;

            const category = new Category({
                ...categoryFields,
                subCategory: subCategories
            });
            const savedCategory = await category.save();
            categoryIds.push(savedCategory._id);
        }

        const categories = await Category.find();

        // Dữ liệu mẫu cho sản phẩm
        const productNames = [
            "Kem dưỡng trắng da", "Serum vitamin C", "Mặt nạ đất sét", "Son lì dưỡng ẩm",
            "Phấn nền chống nắng", "Bút kẻ mắt nước", "Tẩy trang dịu nhẹ", "Dầu gội thảo mộc",
            "Serum trị mụn", "Kem chống nắng SPF50",
            "Toner làm sạch sâu", "Gel rửa mặt dịu nhẹ", "Sữa tắm dưỡng ẩm", "Dầu xả phục hồi tóc hư tổn",
            "Xịt khoáng cấp ẩm", "Kem dưỡng ban đêm", "Son bóng dưỡng môi", "Kem che khuyết điểm",
            "Tinh chất dưỡng tóc", "Mặt nạ ngủ dưỡng ẩm", "Kem trị thâm mắt", "Serum dưỡng mi",
            "Sáp tẩy tế bào chết môi", "Dầu dưỡng tóc argan", "Bột rửa mặt thảo dược",
            "Kem nền mỏng nhẹ", "Son dưỡng môi có màu", "Mặt nạ giấy dưỡng da", "Dầu dưỡng móng tay",
            "Serum dưỡng da tay", "Kem dưỡng da tay chống nắng", "Tẩy tế bào chết body",
            "Xịt chống nắng toàn thân", "Mặt nạ tẩy tế bào chết", "Tinh chất chống lão hóa",
            "Gel dưỡng ẩm không dầu", "Nước hoa hồng cấp ẩm", "Kem chống nắng cho da nhạy cảm",
            "Xịt dưỡng tóc bóng mượt", "Tinh dầu trị mụn", "Serum làm dịu da", "Sữa rửa mặt ngừa mụn",
            "Mặt nạ thải độc", "Serum dưỡng da chống oxy hóa"
        ];

        const start = new Date(2026, 0, 1);
        const end = new Date(2026, 11, 31);

        const products = [];
        for (let i = 0; i < 50; i++) {
            // Chọn ngẫu nhiên Category
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            // Chọn ngẫu nhiên Subcategory từ Category
            let randomSubCategory = null;
            if (randomCategory.subCategory.length > 0) {
                randomSubCategory = randomCategory.subCategory[Math.floor(Math.random() * randomCategory.subCategory.length)];
            }

            const totalPrice = Math.floor(Math.random() * 100) * 1000;
            const ranStock1 = Math.floor(Math.random() * 100) + 1
            const ranStock2 = Math.floor(Math.random() * 100) + 1

            const product = new Product({
                name: productNames[i % productNames.length],
                description: `Sản phẩm ${i + 1} giúp chăm sóc da hiệu quả`,
                price: totalPrice,
                stock: ranStock1 + ranStock2,
                categoryId: randomCategory._id,
                subCategoryId: randomSubCategory ? randomSubCategory._id : null,
                category: randomCategory.name,
                subCategory: randomSubCategory ? randomSubCategory.name : null,
                variants: [
                    { volume: "50ml", price: totalPrice, stock: ranStock1 },
                    { volume: "100ml", price: (totalPrice * 2), stock: ranStock2 },
                ],
                ingredients: [
                    { name: "Aloe Vera", percentage: 10 },
                    { name: "Vitamin C", percentage: 5 }
                ],
                expiryDate: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
                benefits: ["Dưỡng ẩm", "Làm sáng da"],
                images: ["https://saigon.incom.vn/wp-content/uploads/2021/11/Screen-Shot-2021-11-08-at-00.05.44.png"]
            });
            products.push(product);
        }

        // Lưu sản phẩm vào DB
        await Product.insertMany(products);

        // Dữ liệu mẫu cho dịch vụ
        const serviceNames = [
            "Dịch vụ chăm sóc da mặt",
            "Liệu trình tắm trắng",
            "Massage toàn thân",
            "Chăm sóc da body",
            "Liệu trình spa thư giãn",
            "Gội đầu dưỡng sinh",
            "Liệu trình trị mụn chuyên sâu",
            "Chăm sóc da tái tạo collagen",
            "Dịch vụ tẩy tế bào chết toàn thân",
            "Chăm sóc tóc phục hồi keratin",
            "Liệu trình giảm mỡ bụng",
            "Chăm sóc móng tay, chân",
            "Massage trị liệu đau vai gáy",
            "Liệu trình xông hơi detox",
            "Chăm sóc da chống lão hóa"
        ];

        const services = [];
        for (let i = 0; i < 15; i++) {
            // Chọn ngẫu nhiên Category
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            // Chọn ngẫu nhiên Subcategory từ Category
            let randomSubCategory = null;
            if (randomCategory.subCategory.length > 0) {
                randomSubCategory = randomCategory.subCategory[Math.floor(Math.random() * randomCategory.subCategory.length)];
            }

            const service = new Service({
                name: serviceNames[i % serviceNames.length],
                description: `Dịch vụ ${i + 1} giúp thư giãn và chăm sóc cơ thể`,
                price: Math.floor(Math.random() * 100) * 1000,
                categoryId: randomCategory._id,
                subCategoryId: randomSubCategory ? randomSubCategory._id : null,
                category: randomCategory.name,
                subCategory: randomSubCategory ? randomSubCategory.name : null,
                images: ["https://saigon.incom.vn/wp-content/uploads/2021/11/Screen-Shot-2021-11-08-at-00.05.44.png"]
            });
            services.push(service);
        }

        // Lưu dịch vụ vào DB
        await Service.insertMany(services);

        console.log('Dữ liệu test đã được tạo thành công!');
        process.exit(0);
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        process.exit(1);
    }
};

// Chạy script tạo dữ liệu
module.exports = createTestData
