package com.example.maisonderenard.config.initialization;

import com.example.maisonderenard.model.domain.Category;
import com.example.maisonderenard.model.domain.Product;
import com.example.maisonderenard.model.domain.User;
import com.example.maisonderenard.model.enums.Role;
import com.example.maisonderenard.repository.CategoryRepository;
import com.example.maisonderenard.repository.ProductRepository;
import com.example.maisonderenard.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        // Check if data already exists
        if (categoryRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Categories
        Category women = new Category(
                null,
                "Women",
                "Maison de Renard's womenswear celebrates elegance and grace through the finest craftsmanship and exceptional materials. From sumptuous cashmeres and delicate silks to exclusive wools with a whisper of sheen, each creation is thoughtfully designed to drape and move with effortless refinement. Every detail is meticulously considered, offering a sensorial experience and a signature sophistication that is uniquely Maison de Renard."
        );

        Category men = new Category(
                null,
                "Men",
                "Born from a heritage of craftsmanship, Maison de Renard's menswear embodies timeless sophistication through impeccable tailoring and noble materials. From the finest merino wools and cashmeres to silks of understated brilliance, each piece reflects the Maison's devotion to quiet luxury. Every garment is shaped with masterful precision, offering an effortless elegance and tactile refinement that are unmistakably Maison de Renard."
        );

        Category gifts = new Category(
                null,
                "Gifts",
                "Maison de Renard's curated selection of gifts embodies timeless elegance and understated luxury. From exquisitely crafted scarves and cashmere accessories to refined leather pieces and delicate silks, each item is designed to delight the senses and leave a lasting impression. Thoughtfully presented, these treasures reflect the Maison's dedication to artistry, making every gift a gesture of refined taste and enduring sophistication."
        );

        Category essentials = new Category(
                null,
                "Essentials",
                "Timeless wardrobe staples for everyday elegance."
        );

        categoryRepository.save(women);
        categoryRepository.save(men);
        categoryRepository.save(gifts);
        categoryRepository.save(essentials);

        // 2. Create Admin User
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@maisonderenard.com");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        // 3. Create Customer User (for testing)
        User customer = new User();
        customer.setUsername("customer");
        customer.setPassword(passwordEncoder.encode("customer123"));
        customer.setEmail("customer@maisonderenard.com");
        customer.setRole(Role.CUSTOMER);
        userRepository.save(customer);

        // 4. Create MEN Products (12 products)
        createProduct("Cable Knit Cashmere Sweater", "Handcrafted from the finest Italian cashmere with intricate cable knit detailing.",
                1299.99, 10,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ3218/60DA4312-63A0-4E89-8136-A429B6BD17FD/FAQ3218_51FU_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ3218/51FU/L3/805ADE5C-7C68-445A-B04A-15BE848F0EB2_FAQ3218_51FU_MEDIUM.jpg",
                men);

        createProduct("Merino Wool Polo Shirt", "Contemporary elegance in a refined merino wool polo with contrasting stripe details.",
                599.99, 15,
                "https://media.loropiana.com/HYBRIS/FAP/FAP3985/F2CB94E8-ED91-4C0E-A437-D81F149CD0CC/FAP3985_W1CV_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP3985/DA8EAEA5-D8AA-4A1B-A05D-52F3367DF763/FAP3985_W1CV_MEDIUM.jpg?sw=500&sh=700",
                men);

        createProduct("Cashmere Overcoat", "Timeless sophistication in a luxuriously soft cashmere overcoat with impeccable tailoring.",
                3499.99, 8,
                "https://media.loropiana.com/HYBRIS/FAN/FAN1935/8CDAE738-7C09-44FE-97DB-908E07252E6F/FAN1935_W0ZP_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAN/FAN1935/AD3292E4-9C35-4C75-8F59-8323D35AABBC/FAN1935_W0ZP_MEDIUM.jpg",
                men);

        createProduct("Suede Field Jacket", "Refined utility meets elegant design in this premium suede field jacket.",
                2899.99, 12,
                "https://media.loropiana.com/HYBRIS/FAN/FAN8548/9B6B1260-002B-4577-B65F-62B40F19D69E/FAN8548_W13K_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAN/FAN8548/62682E7B-E1AA-4FEC-BB4A-2229915152DF/FAN8548_W13K_MEDIUM.jpg",
                men);

        createProduct("Lightweight Cashmere Cardigan", "Effortless elegance in a feather-light cashmere cardigan perfect for layering.",
                1499.99, 20,
                "https://media.loropiana.com/HYBRIS/FAL/FAL2899/208D2585-554A-4F4E-822B-5CA46087C9F6/FAL2899_HC54_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAL/FAL2899/70C2796E-C045-4FE9-A65E-3F6CDD3F7742/FAL2899_HC54_MEDIUM.jpg",
                men);

        createProduct("Merino Wool Turtleneck", "Essential sophistication in a refined merino wool turtleneck with ribbed detailing.",
                699.99, 18,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/FR/0A5B70EE-C44C-4F05-BE90-CB05C25E16CD_FAP8313_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/L3/E63DA3BC-DC20-48C8-A3F0-1420880E3E3D_FAP8313_W000_MEDIUM.jpg",
                men);

        createProduct("Cashmere Blend Trousers", "Impeccably tailored trousers in a luxurious cashmere blend for ultimate comfort.",
                1199.99, 14,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/FR/BA411C4C-6E41-4755-8297-DB5FD04F2AAD_FAO3129_H0TM_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/L4/12518492-58D7-487B-AD6F-CD9EB81B5B06_FAO3129_H0TM_MEDIUM.jpg",
                men);

        createProduct("Silk Pocket Square", "Refined elegance in a hand-rolled silk pocket square with signature pattern.",
                149.99, 30,
                "https://media.loropiana.com/HYBRIS/FAN/FAN1988/6D618591-D8E3-4F42-BE51-C403A3C5FB55/FAN1988_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAN/FAN1988/70F1C8D1-F1E8-42BE-B11B-8E5C5E515FF6/FAN1988_W000_MEDIUM.jpg",
                men);

        createProduct("Leather Belt with Silver Buckle", "Timeless accessory crafted from premium Italian leather with polished silver hardware.",
                399.99, 25,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7755/F6ZL/FR/1396705C-7DFD-4FF7-949E-EBCA51419832_FAP7755_F6ZL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7755/F6ZL/L2/D54DE65F-49BD-452C-B4FC-BE8E5E5123EA_FAP7755_F6ZL_MEDIUM.jpg",
                men);

        createProduct("Cashmere Scarf", "Luxuriously soft cashmere scarf in classic neutral tones.",
                599.99, 22,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ1948/F6ZL/FR/BDA09968-DE7C-4295-B02A-B1DA428FDF04_FAQ1948_F6ZL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ1948/951BA743-3562-47A6-8C52-C2A690CC6BFD/FAQ1948_F6ZL_MEDIUM.jpg",
                men);

        createProduct("Suede Loafers", "Handcrafted Italian suede loafers with leather lining and rubber sole.",
                899.99, 16,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ1952/50AAB887-C358-4924-B2CF-F18D0E188BBD/FAQ1952_51CL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ1952/F79EE42A-DFEE-4695-84EA-686EE89C7DC8/FAQ1952_51CL_MEDIUM.jpg",
                men);

        createProduct("Merino Wool Blazer", "Sophisticated tailoring in a lightweight merino wool blazer with modern silhouette.",
                1999.99, 10,
                "https://media.loropiana.com/HYBRIS/FAF/FAF6689/13481E0A-E9E1-41D1-B249-965BBE4C68A1/FAF6689_D0VN_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAF/FAF6689/E6BEB6A1-CAB7-40C1-B4E0-4CA5028B2793/FAF6689_D0VN_MEDIUM.jpg",
                men);

        // 5. Create WOMEN Products (12 products)
        createProduct("Cashmere Polo Sweater", "Refined elegance in a soft cashmere polo with ribbed collar and cuffs.",
                1199.99, 12,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/FR/0B635099-D96A-4C7D-90A2-3AD87FFCA794_FAP7344_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/L2/78411282-CCEE-4178-8430-84F084F7C3C3_FAP7344_W000_MEDIUM.jpg",
                women);

        createProduct("Ski Salopettes", "Technical elegance in premium ski salopettes with adjustable straps and thermal lining.",
                1799.99, 8,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ4076/F2D51C67-432D-4D3D-99A3-FF9360CCD0B7/FAQ4076_HF55_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ4076/5E0C1954-B0E1-4834-AE42-F986B20F83FF/FAQ4076_HF55_MEDIUM.jpg",
                women);

        createProduct("Cashmere Trench Coat", "Timeless sophistication in a double-breasted cashmere trench with belted waist.",
                3299.99, 6,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ2737/28002A84-A27E-4229-9086-326B109373DC/FAQ2737_A014_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ2737/3DAC5BFB-C1B8-41F4-BD66-15A3DBE5072F/FAQ2737_A014_MEDIUM.jpg",
                women);

        createProduct("Ribbed Cashmere Cardigan", "Cozy elegance in a ribbed cashmere cardigan with horn button closure.",
                1399.99, 14,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ2840/39EC2545-707B-45EB-B6C7-F2CE64F3465A/FAQ2840_A014_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ2840/E4AD1C7A-8374-4671-8513-40223E6390C3/FAQ2840_A014_MEDIUM.jpg",
                women);

        createProduct("Silk Blend Dress", "Elegant evening dress with impeccable draping and subtle sheen.",
                2199.99, 10,
                "https://media.loropiana.com/HYBRIS/FAO/FAO9479/DF4C0BDA-5359-4DEA-9C2A-42F9ACE59678/FAO9479_30H7_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO9479/DE7458B6-8709-4F00-9CE5-FB2F2A4403EE/FAO9479_30H7_MEDIUM.jpg",
                women);

        createProduct("Cashmere Wrap Coat", "Luxuriously soft wrap coat with wide lapels and tie belt.",
                2999.99, 8,
                "https://media.loropiana.com/HYBRIS/FAO/FAO0815/39CD89D9-E822-442A-966F-CB3452A8424B/FAO0815_H0YE_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO0815/FC7CD8B2-825C-4F7D-A2AA-4E8465A97982/FAO0815_H0YE_MEDIUM.jpg",
                women);

        createProduct("Merino Wool Turtleneck", "Essential layering piece in ultra-fine merino wool with clean silhouette.",
                699.99, 20,
                "https://media.loropiana.com/HYBRIS/FAP/FAP7706/62D500E4-3867-49F7-9F87-DB65F42C8C4C/FAP7706_402F_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP7706/0C3C5D7C-F21E-4425-A037-3FE7282B0FC2/FAP7706_402F_MEDIUM.jpg",
                women);

        createProduct("Cashmere Palazzo Pants", "Flowing elegance in wide-leg cashmere blend palazzo pants.",
                1499.99, 12,
                "https://media.loropiana.com/HYBRIS/FAP/FAP6989/1C3AE6AF-8B03-481B-8852-E012A9B3587B/FAP6989_D983_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6989/D983/L3/45044753-BF4E-4866-9607-F1E1DB0D46C2_FAP6989_D983_MEDIUM.jpg",
                women);

        createProduct("Silk Scarf", "Hand-rolled silk scarf with exclusive Maison print.",
                399.99, 25,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6998/L0BH/FR/BBE70D89-4B48-4EEF-AFF2-357E71668529_FAP6998_L0BH_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP6998/40FAD9AC-7CA1-43E7-9A45-3EAD89C60694/FAP6998_L0BH_MEDIUM.jpg",
                women);

        createProduct("Cashmere Beanie", "Luxuriously soft cashmere beanie with ribbed knit.",
                299.99, 30,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/FR/0F5A2C39-4493-41BF-B4D9-ADF97DE6F62A_FAP9525_B4NE_MEDIUM.jpg,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/D1/AFDD34E5-34DB-4074-9F94-B40510D5D77B_FAP9525_B4NE_MEDIUM.jpg",
                women);

        createProduct("Suede Ankle Boots", "Italian crafted ankle boots in premium suede with leather lining.",
                1199.99, 14,
                "https://media.loropiana.com/HYBRIS/FAO/FAO1547/7BD61623-C8BF-4750-98C7-EED83409B7A4/FAO1547_30IH_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO1547/6B57CCB5-9D79-48C7-8F1F-16CF30574A5D/FAO1547_30IH_MEDIUM.jpg",
                women);

        createProduct("Cashmere Shawl", "Oversized cashmere shawl perfect for elegant layering.",
                899.99, 18,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ0960/CC0DDF9D-3414-4D93-88C8-F9D1548EEE8E/FAQ0960_1232_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ0960/0F700CDC-02ED-4CB1-B16B-4678D5105DD0/FAQ0960_1232_MEDIUM.jpg",
                women);

        // 6. Create GIFTS Products (12 products)
        createProduct("Cashmere Scarf", "Luxuriously soft cashmere scarf in timeless neutral tones.",
                599.99, 15,
                "https://media.loropiana.com/HYBRIS/FAI/FAI3766/46010BEF-4C33-4760-A3A7-645D55A075D2/FAI3766_W948_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAI/FAI3766/C9575477-26DC-4A48-98E3-C0516C26E7AB/FAI3766_W948_MEDIUM.jpg",
                gifts);

        createProduct("Cashmere Throw Blanket", "Sumptuous cashmere throw perfect for elegant layering and comfort.",
                899.99, 12,
                "https://media.loropiana.com/HYBRIS/FAP/FAP4031/09F026E9-BFB8-40EB-8819-4FBFA6CA66D9/FAP4031_W000_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP4031/F4D5E040-64C2-44BB-BDEF-AD86D04787C3/FAP4031_W000_MEDIUM.jpg",
                gifts);

        createProduct("Leather Wallet", "Handcrafted Italian leather wallet with multiple card slots and refined details.",
                299.99, 25,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/FR/CDADC9E6-ABD1-4138-9949-27CB0D7B5618_FAO3774_M006_MEDIUM.jpg?sw=680&sh=952,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/L1/AFF88145-E7A8-4A8A-B621-93CC301C5598_FAO3774_M006_MEDIUM.jpg",
                gifts);

        createProduct("Leather Backpack", "Sophisticated leather backpack with laptop compartment and adjustable straps.",
                1299.99, 10,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP5328/804M/FR/373700F6-6FA0-4E8D-8842-D62BF7C00109_FAP5328_804M_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP5328/3555E622-1314-4BBB-9E4E-D7B93E5162EE/FAP5328_804M_MEDIUM.jpg",
                gifts);

        createProduct("Cashmere Travel Set", "Complete travel set including eye mask, socks, and blanket in premium cashmere.",
                1499.99, 8,
                "https://media.loropiana.com/HYBRIS/FAP/FAP4796/4ECE8D74-7AB3-4521-8B6B-8742E6DE9E78/FAP4796_706F_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP4796/16D13ADD-253C-430F-9A58-65AE8780D677/FAP4796_706F_MEDIUM.jpg",
                gifts);

        createProduct("Cashmere Gloves", "Lined cashmere gloves with leather palm patches for warmth and elegance.",
                399.99, 30,
                "https://media.loropiana.com/HYBRIS/FAO/FAO8041/DD50627D-1494-4C61-97C0-F34E349E547F/FAO8041_F7A8_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO8041/4AA0E11D-CF3A-4A41-AE60-82F4D5D6CF31/FAO8041_F7A8_MEDIUM.jpg",
                gifts);

        createProduct("Silk Tie Collection", "Curated set of premium silk ties in complementary patterns and colors.",
                349.99, 20,
                "https://media.loropiana.com/HYBRIS/FAE/FAE8124/D6A8DB15-3F11-4738-AA75-9FF57F8C5199/FAE8124_8000_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAE/FAE8124/BE60ED95-1B12-4CAC-AE9F-0B38CEAB124C/FAE8124_8000_MEDIUM.jpg",
                gifts);

        createProduct("Cashmere Beanie", "Luxuriously soft cashmere beanie with ribbed knit detailing.",
                499.99, 15,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/10AD4A54-8C76-4FBF-AA30-78DF6A278E31/FAQ0922_H0WX_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/322578EB-3093-4E77-80B7-6D17E3A7571C/FAQ0922_H0WX_MEDIUM.jpg",
                gifts);

        createProduct("Leather Journal", "Premium leather-bound journal with hand-stitched binding and quality paper.",
                249.99, 25,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ2351/6DCB9F85-ADEA-4257-98A9-3A09476C4C3A/FAQ2351_D05S_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ2351/484C9855-22E8-46F5-B78D-5BA51B637F7B/FAQ2351_D05S_MEDIUM.jpg",
                gifts);

        createProduct("Cashmere Socks Set", "Elegant cashmere sock collection in curated neutral and seasonal tones.",
                699.99, 12,
                "https://media.loropiana.com/HYBRIS/FAP/FAP9247/49DE50DE-1B8B-4FC5-BE04-4576AB1CCDAE/FAP9247_H16T_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP9247/357864A3-1B5F-45C8-AF4B-1489CEDA0B17/FAP9247_H16T_MEDIUM.jpg",
                gifts);

        createProduct("Suede Slippers", "Handcrafted Italian suede slippers with sheepskin lining for ultimate comfort.",
                1899.99, 8,
                "https://media.loropiana.com/HYBRIS/FAN/FAN9452/2C3D2BF9-E6F3-44D3-BF38-4751028E6965/FAN9452_F5U8_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAN/FAN9452/F3792F2F-DF66-46EE-A7D9-C3C3BD8C7173/FAN9452_F5U8_MEDIUM.jpg",
                gifts);

        createProduct("Leather Travel Case", "Exquisitely crafted travel case in premium leather with signature monogram.",
                599.99, 18,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ2934/F3050CDE-D8A8-4E21-B96E-4620FCE2F28A/FAQ2934_A193_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ2934/CC91B96D-E980-49B9-89CB-713771649C0A/FAQ2934_A193_MEDIUM.jpg",
                gifts);

        // 7. Create ESSENTIALS Products (12 products - RENAMED FOR UNIQUENESS)

        // 4 from Men (renamed)
        createProduct("Essential Cable Knit Sweater", "Handcrafted from the finest Italian cashmere with intricate cable knit detailing.",
                1299.99, 10,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ3218/60DA4312-63A0-4E89-8136-A429B6BD17FD/FAQ3218_51FU_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ3218/51FU/L3/805ADE5C-7C68-445A-B04A-15BE848F0EB2_FAQ3218_51FU_MEDIUM.jpg",
                essentials);

        createProduct("Essential Merino Turtleneck", "Essential sophistication in a refined merino wool turtleneck with ribbed detailing.",
                699.99, 18,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/FR/0A5B70EE-C44C-4F05-BE90-CB05C25E16CD_FAP8313_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/L3/E63DA3BC-DC20-48C8-A3F0-1420880E3E3D_FAP8313_W000_MEDIUM.jpg",
                essentials);

        createProduct("Essential Cashmere Trousers", "Impeccably tailored trousers in a luxurious cashmere blend for ultimate comfort.",
                1199.99, 14,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/FR/BA411C4C-6E41-4755-8297-DB5FD04F2AAD_FAO3129_H0TM_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/L4/12518492-58D7-487B-AD6F-CD9EB81B5B06_FAO3129_H0TM_MEDIUM.jpg",
                essentials);

        createProduct("Essential Cashmere Scarf", "Luxuriously soft cashmere scarf in classic neutral tones.",
                599.99, 22,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ1948/F6ZL/FR/BDA09968-DE7C-4295-B02A-B1DA428FDF04_FAQ1948_F6ZL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ1948/951BA743-3562-47A6-8C52-C2A690CC6BFD/FAQ1948_F6ZL_MEDIUM.jpg",
                essentials);

        // 4 from Women (renamed)
        createProduct("Essential Cashmere Polo", "Refined elegance in a soft cashmere polo with ribbed collar and cuffs.",
                1199.99, 12,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/FR/0B635099-D96A-4C7D-90A2-3AD87FFCA794_FAP7344_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/L2/78411282-CCEE-4178-8430-84F084F7C3C3_FAP7344_W000_MEDIUM.jpg",
                essentials);

        createProduct("Essential Wool Turtleneck", "Essential layering piece in ultra-fine merino wool with clean silhouette.",
                699.99, 20,
                "https://media.loropiana.com/HYBRIS/FAP/FAP7706/62D500E4-3867-49F7-9F87-DB65F42C8C4C/FAP7706_402F_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP7706/0C3C5D7C-F21E-4425-A037-3FE7282B0FC2/FAP7706_402F_MEDIUM.jpg",
                essentials);

        createProduct("Essential Palazzo Pants", "Flowing elegance in wide-leg cashmere blend palazzo pants.",
                1499.99, 12,
                "https://media.loropiana.com/HYBRIS/FAP/FAP6989/1C3AE6AF-8B03-481B-8852-E012A9B3587B/FAP6989_D983_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6989/D983/L3/45044753-BF4E-4866-9607-F1E1DB0D46C2_FAP6989_D983_MEDIUM.jpg",
                essentials);

        createProduct("Essential Knit Beanie", "Luxuriously soft cashmere beanie with ribbed knit.",
                299.99, 30,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/FR/0F5A2C39-4493-41BF-B4D9-ADF97DE6F62A_FAP9525_B4NE_MEDIUM.jpg,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/D1/AFDD34E5-34DB-4074-9F94-B40510D5D77B_FAP9525_B4NE_MEDIUM.jpg",
                essentials);

        // 4 from Gifts (renamed)
        createProduct("Essential Soft Scarf", "Luxuriously soft cashmere scarf in timeless neutral tones.",
                599.99, 15,
                "https://media.loropiana.com/HYBRIS/FAI/FAI3766/46010BEF-4C33-4760-A3A7-645D55A075D2/FAI3766_W948_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAI/FAI3766/C9575477-26DC-4A48-98E3-C0516C26E7AB/FAI3766_W948_MEDIUM.jpg",
                essentials);

        createProduct("Essential Leather Wallet", "Handcrafted Italian leather wallet with multiple card slots and refined details.",
                299.99, 25,
                "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/FR/CDADC9E6-ABD1-4138-9949-27CB0D7B5618_FAO3774_M006_MEDIUM.jpg?sw=680&sh=952,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/L1/AFF88145-E7A8-4A8A-B621-93CC301C5598_FAO3774_M006_MEDIUM.jpg",
                essentials);

        createProduct("Essential Cashmere Gloves", "Lined cashmere gloves with leather palm patches for warmth and elegance.",
                399.99, 30,
                "https://media.loropiana.com/HYBRIS/FAO/FAO8041/DD50627D-1494-4C61-97C0-F34E349E547F/FAO8041_F7A8_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO8041/4AA0E11D-CF3A-4A41-AE60-82F4D5D6CF31/FAO8041_F7A8_MEDIUM.jpg",
                essentials);

        createProduct("Essential Winter Beanie", "Luxuriously soft cashmere beanie with ribbed knit detailing.",
                499.99, 15,
                "https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/10AD4A54-8C76-4FBF-AA30-78DF6A278E31/FAQ0922_H0WX_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/322578EB-3093-4E77-80B7-6D17E3A7571C/FAQ0922_H0WX_MEDIUM.jpg",
                essentials);

        System.out.println("✅ Data initialization completed!");
        System.out.println("📦 Created 12 Men products");
        System.out.println("📦 Created 12 Women products");
        System.out.println("📦 Created 12 Gifts products");
        System.out.println("📦 Created 12 Essentials products (with unique names)");
        System.out.println("👤 Admin User - Username: admin, Password: admin123");
        System.out.println("👤 Customer User - Username: customer, Password: customer123");
    }

    private void createProduct(String name, String description, Double price, Integer quantity, String imageUrl, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setImageUrl(imageUrl);
        product.setCategory(category);
        productRepository.save(product);
    }
}