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
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@maisonderenard.com");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        if (userRepository.findByUsername("customer").isEmpty()) {
            User customer = new User();
            customer.setUsername("customer");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setEmail("customer@maisonderenard.com");
            customer.setRole(Role.CUSTOMER);
            userRepository.save(customer);
        }

        if (categoryRepository.count() > 0) {
            return;
        }

        Category women = new Category(null, "Women",
                "Maison de Renard's womenswear celebrates elegance and grace through the finest craftsmanship and exceptional materials. From sumptuous cashmeres and delicate silks to exclusive wools with a whisper of sheen, each creation is thoughtfully designed to drape and move with effortless refinement. Every detail is meticulously considered, offering a sensorial experience and a signature sophistication that is uniquely Maison de Renard.");
        Category men = new Category(null, "Men",
                "Born from a heritage of craftsmanship, Maison de Renard's menswear embodies timeless sophistication through impeccable tailoring and noble materials. From the finest merino wools and cashmeres to silks of understated brilliance, each piece reflects the Maison's devotion to quiet luxury. Every garment is shaped with masterful precision, offering an effortless elegance and tactile refinement that are unmistakably Maison de Renard.");
        Category gifts = new Category(null, "Gifts",
                "Maison de Renard's curated selection of gifts embodies timeless elegance and understated luxury. From exquisitely crafted scarves and cashmere accessories to refined leather pieces and delicate silks, each item is designed to delight the senses and leave a lasting impression. Thoughtfully presented, these treasures reflect the Maison's dedication to artistry, making every gift a gesture of refined taste and enduring sophistication.");
        Category essentials = new Category(null, "Essentials",
                "Timeless wardrobe staples for everyday elegance.");
        Category fallWinter = new Category(null, "Fall/Winter 2025",
                "Discover our latest Fall/Winter collection featuring timeless pieces crafted from the finest materials.");
        Category specialOffers = new Category(null, "Special Offers",
                "Exclusive selections at exceptional value — timeless luxury made accessible for a limited time.");

        categoryRepository.save(women);
        categoryRepository.save(men);
        categoryRepository.save(gifts);
        categoryRepository.save(essentials);
        categoryRepository.save(fallWinter);
        categoryRepository.save(specialOffers);

        // MEN
        createProduct("Dark Brown Leather Bomber Jacket", "Impeccably crafted dark brown leather bomber with suede collar and signature hardware.",
                3299.99, 8, "https://media.loropiana.com/HYBRIS/FAN/FAN8548/9B6B1260-002B-4577-B65F-62B40F19D69E/FAN8548_W13K_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAN/FAN8548/62682E7B-E1AA-4FEC-BB4A-2229915152DF/FAN8548_W13K_MEDIUM.jpg", men);
        createProduct("Olive Cotton Five-Pocket Trousers", "Refined Italian craftsmanship meets everyday versatility in these olive cotton five-pocket trousers.",
                899.99, 14, "https://media.loropiana.com/HYBRIS/FAQ/FAQ3218/60DA4312-63A0-4E89-8136-A429B6BD17FD/FAQ3218_51FU_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ3218/51FU/L3/805ADE5C-7C68-445A-B04A-15BE848F0EB2_FAQ3218_51FU_MEDIUM.jpg", men);
        createProduct("Sand Belted Linen Trench Coat", "Timeless sophistication in a sand-toned belted linen trench with suede collar trim.",
                2499.99, 8, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/FR/0A5B70EE-C44C-4F05-BE90-CB05C25E16CD_FAP8313_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/L3/E63DA3BC-DC20-48C8-A3F0-1420880E3E3D_FAP8313_W000_MEDIUM.jpg", men);
        createProduct("Light Blue Denim Bermuda Shorts", "Refined summer ease in light blue denim bermuda shorts with pleated front.",
                599.99, 20, "https://media.loropiana.com/HYBRIS/FAQ/FAQ1952/50AAB887-C358-4924-B2CF-F18D0E188BBD/FAQ1952_51CL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ1952/F79EE42A-DFEE-4695-84EA-686EE89C7DC8/FAQ1952_51CL_MEDIUM.jpg", men);
        createProduct("Navy Storm System® Coat", "Sophisticated protection in a navy Storm System® coat with concealed button closure.",
                2799.99, 10, "https://media.loropiana.com/HYBRIS/FAL/FAL2899/208D2585-554A-4F4E-822B-5CA46087C9F6/FAL2899_HC54_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAL/FAL2899/70C2796E-C045-4FE9-A65E-3F6CDD3F7742/FAL2899_HC54_MEDIUM.jpg", men);
        createProduct("Blush Pink Cotton T-Shirt", "Understated luxury in a blush pink cotton t-shirt crafted from the finest Egyptian cotton.",
                349.99, 25, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7755/F6ZL/FR/1396705C-7DFD-4FF7-949E-EBCA51419832_FAP7755_F6ZL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7755/F6ZL/L2/D54DE65F-49BD-452C-B4FC-BE8E5E5123EA_FAP7755_F6ZL_MEDIUM.jpg", men);
        createProduct("Navy Denim Field Jacket", "Contemporary elegance in a structured navy denim field jacket with refined button detailing.",
                1499.99, 10, "https://media.loropiana.com/HYBRIS/FAP/FAP3985/F2CB94E8-ED91-4C0E-A437-D81F149CD0CC/FAP3985_W1CV_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP3985/DA8EAEA5-D8AA-4A1B-A05D-52F3367DF763/FAP3985_W1CV_MEDIUM.jpg?sw=500&sh=700", men);
        createProduct("Dark Khaki Pleated Wool Trousers", "Impeccably tailored dark khaki pleated wool trousers with a relaxed yet refined silhouette.",
                999.99, 14, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/FR/BA411C4C-6E41-4755-8297-DB5FD04F2AAD_FAO3129_H0TM_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/L4/12518492-58D7-487B-AD6F-CD9EB81B5B06_FAO3129_H0TM_MEDIUM.jpg", men);
        createProduct("Storm Blue Windmate Gilet", "Technical precision meets understated luxury in this storm blue windmate gilet.",
                1199.99, 12, "https://media.loropiana.com/HYBRIS/FAN/FAN1935/8CDAE738-7C09-44FE-97DB-908E07252E6F/FAN1935_W0ZP_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAN/FAN1935/AD3292E4-9C35-4C75-8F59-8323D35AABBC/FAN1935_W0ZP_MEDIUM.jpg", men);
        createProduct("Navy Denim Boat Shoes", "Classic Italian boat shoes in navy denim with leather lining and rubber sole.",
                799.99, 16, "https://media.loropiana.com/HYBRIS/FAF/FAF6689/13481E0A-E9E1-41D1-B249-965BBE4C68A1/FAF6689_D0VN_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAF/FAF6689/E6BEB6A1-CAB7-40C1-B4E0-4CA5028B2793/FAF6689_D0VN_MEDIUM.jpg", men);
        createProduct("Beige Double-Breasted Linen Blazer", "Refined summer elegance in a beige double-breasted linen blazer with gold button detailing.",
                1899.99, 12, "https://media.loropiana.com/HYBRIS/FAF/FAF6689/13481E0A-E9E1-41D1-B249-965BBE4C68A1/FAF6689_D0VN_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAF/FAF6689/E6BEB6A1-CAB7-40C1-B4E0-4CA5028B2793/FAF6689_D0VN_MEDIUM.jpg", men);
        createProduct("Brown Suede Sneakers", "Italian craftsmanship meets casual refinement in these brown suede sneakers with rubber sole.",
                899.99, 18, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ1948/F6ZL/FR/BDA09968-DE7C-4295-B02A-B1DA428FDF04_FAQ1948_F6ZL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ1948/951BA743-3562-47A6-8C52-C2A690CC6BFD/FAQ1948_F6ZL_MEDIUM.jpg", men);

        // WOMEN
        createProduct("Camel Single-Breasted Wool Coat", "Understated elegance in a camel single-breasted wool coat with patch pockets.",
                2999.99, 8, "https://media.loropiana.com/HYBRIS/FAP/FAP6989/1C3AE6AF-8B03-481B-8852-E012A9B3587B/FAP6989_D983_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6989/D983/L3/45044753-BF4E-4866-9607-F1E1DB0D46C2_FAP6989_D983_MEDIUM.jpg", women);
        createProduct("Black Shearling Hooded Coat", "Sumptuous black shearling hooded coat with button closure and deep pockets.",
                4999.99, 6, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/FR/0B635099-D96A-4C7D-90A2-3AD87FFCA794_FAP7344_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/L2/78411282-CCEE-4178-8430-84F084F7C3C3_FAP7344_W000_MEDIUM.jpg", women);
        createProduct("Ivory Canvas Zip Wallet", "Refined everyday elegance in an ivory canvas zip wallet with leather trim.",
                499.99, 20, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/FR/0F5A2C39-4493-41BF-B4D9-ADF97DE6F62A_FAP9525_B4NE_MEDIUM.jpg,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/D1/AFDD34E5-34DB-4074-9F94-B40510D5D77B_FAP9525_B4NE_MEDIUM.jpg", women);
        createProduct("Burgundy Suede Overshirt", "Refined casual elegance in a burgundy suede overshirt with patch pockets.",
                1699.99, 10, "https://media.loropiana.com/HYBRIS/FAQ/FAQ4076/F2D51C67-432D-4D3D-99A3-FF9360CCD0B7/FAQ4076_HF55_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ4076/5E0C1954-B0E1-4834-AE42-F986B20F83FF/FAQ4076_HF55_MEDIUM.jpg", women);
        createProduct("Lavender Bouclé Belted Dress", "Timeless femininity in a lavender bouclé belted dress with button-through front.",
                2199.99, 10, "https://media.loropiana.com/HYBRIS/FAP/FAP7706/62D500E4-3867-49F7-9F87-DB65F42C8C4C/FAP7706_402F_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP7706/0C3C5D7C-F21E-4425-A037-3FE7282B0FC2/FAP7706_402F_MEDIUM.jpg", women);
        createProduct("White Hooded Ski Jacket", "Performance meets luxury in a white hooded ski jacket with Storm System® technology.",
                2799.99, 8, "https://media.loropiana.com/HYBRIS/FAQ/FAQ2840/39EC2545-707B-45EB-B6C7-F2CE64F3465A/FAQ2840_A014_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ2840/E4AD1C7A-8374-4671-8513-40223E6390C3/FAQ2840_A014_MEDIUM.jpg", women);
        createProduct("Blush Pink Suede Sneakers", "Effortless femininity in blush pink suede sneakers with gum rubber sole.",
                799.99, 14, "https://media.loropiana.com/HYBRIS/FAO/FAO1547/7BD61623-C8BF-4750-98C7-EED83409B7A4/FAO1547_30IH_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO1547/6B57CCB5-9D79-48C7-8F1F-16CF30574A5D/FAO1547_30IH_MEDIUM.jpg", women);
        createProduct("Rust Double-Breasted Wool Coat", "Striking silhouette in a rust double-breasted wool coat with collarless neckline.",
                3299.99, 6, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6998/L0BH/FR/BBE70D89-4B48-4EEF-AFF2-357E71668529_FAP6998_L0BH_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP6998/40FAD9AC-7CA1-43E7-9A45-3EAD89C60694/FAP6998_L0BH_MEDIUM.jpg", women);
        createProduct("Red Ski Goggles", "Premium alpine ski goggles with red mirrored lens and adjustable strap.",
                599.99, 15, "https://media.loropiana.com/HYBRIS/FAO/FAO9479/DF4C0BDA-5359-4DEA-9C2A-42F9ACE59678/FAO9479_30H7_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO9479/DE7458B6-8709-4F00-9CE5-FB2F2A4403EE/FAO9479_30H7_MEDIUM.jpg", women);
        createProduct("Ivory Cable-Knit Midi Skirt", "Luxurious texture in an ivory cable-knit midi skirt with elasticated waistband.",
                1299.99, 12, "https://media.loropiana.com/HYBRIS/FAQ/FAQ0960/CC0DDF9D-3414-4D93-88C8-F9D1548EEE8E/FAQ0960_1232_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ0960/0F700CDC-02ED-4CB1-B16B-4678D5105DD0/FAQ0960_1232_MEDIUM.jpg", women);
        createProduct("White Storm System® Ski Pants", "Technical excellence in white Storm System® ski pants with leather trim detailing.",
                2299.99, 8, "https://media.loropiana.com/HYBRIS/FAQ/FAQ2737/28002A84-A27E-4229-9086-326B109373DC/FAQ2737_A014_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ2737/3DAC5BFB-C1B8-41F4-BD66-15A3DBE5072F/FAQ2737_A014_MEDIUM.jpg", women);
        createProduct("Cognac Mini Leather Bag", "Exquisitely crafted cognac mini leather bag with top handle and detachable strap.",
                1899.99, 10, "https://media.loropiana.com/HYBRIS/FAO/FAO0815/39CD89D9-E822-442A-966F-CB3452A8424B/FAO0815_H0YE_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO0815/FC7CD8B2-825C-4F7D-A2AA-4E8465A97982/FAO0815_H0YE_MEDIUM.jpg", women);

        // GIFTS
        createProduct("Dark Grey Leather Clutch", "Sophisticated dark grey grained leather clutch with top handle.",
                899.99, 15, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP5328/804M/FR/373700F6-6FA0-4E8D-8842-D62BF7C00109_FAP5328_804M_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP5328/3555E622-1314-4BBB-9E4E-D7B93E5162EE/FAP5328_804M_MEDIUM.jpg", gifts);
        createProduct("Navy Ribbed Cashmere Beanie", "Luxuriously soft navy ribbed cashmere beanie with signature fold-over cuff.",
                399.99, 25, "https://media.loropiana.com/HYBRIS/FAI/FAI3766/46010BEF-4C33-4760-A3A7-645D55A075D2/FAI3766_W948_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAI/FAI3766/C9575477-26DC-4A48-98E3-C0516C26E7AB/FAI3766_W948_MEDIUM.jpg", gifts);
        createProduct("Ivory Leather Baby Stroller", "The ultimate luxury gift — an ivory leather baby stroller with signature detailing.",
                8999.99, 3, "https://media.loropiana.com/HYBRIS/FAP/FAP9247/49DE50DE-1B8B-4FC5-BE04-4576AB1CCDAE/FAP9247_H16T_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP9247/357864A3-1B5F-45C8-AF4B-1489CEDA0B17/FAP9247_H16T_MEDIUM.jpg", gifts);
        createProduct("Black Suede Mule Slippers", "Handcrafted black suede mule slippers with cognac leather lining.",
                699.99, 18, "https://media.loropiana.com/HYBRIS/FAP/FAP4031/09F026E9-BFB8-40EB-8819-4FBFA6CA66D9/FAP4031_W000_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP4031/F4D5E040-64C2-44BB-BDEF-AD86D04787C3/FAP4031_W000_MEDIUM.jpg", gifts);
        createProduct("Taupe Leather Belt", "Classic Italian craftsmanship in a taupe leather belt with silver buckle.",
                349.99, 30, "https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/10AD4A54-8C76-4FBF-AA30-78DF6A278E31/FAQ0922_H0WX_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/322578EB-3093-4E77-80B7-6D17E3A7571C/FAQ0922_H0WX_MEDIUM.jpg", gifts);
        createProduct("Charcoal Cashmere Throw", "Sumptuous charcoal cashmere throw with fringed edges for ultimate warmth.",
                1299.99, 15, "https://media.loropiana.com/HYBRIS/FAQ/FAQ2934/F3050CDE-D8A8-4E21-B96E-4620FCE2F28A/FAQ2934_A193_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ2934/CC91B96D-E980-49B9-89CB-713771649C0A/FAQ2934_A193_MEDIUM.jpg", gifts);
        createProduct("Rose Gold Acetate Sunglasses", "Refined elegance in rose gold acetate sunglasses with cognac lenses.",
                499.99, 20, "https://media.loropiana.com/HYBRIS/FAP/FAP4796/4ECE8D74-7AB3-4521-8B6B-8742E6DE9E78/FAP4796_706F_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAP/FAP4796/16D13ADD-253C-430F-9A58-65AE8780D677/FAP4796_706F_MEDIUM.jpg", gifts);
        createProduct("Ivory Wool Field Jacket", "Refined casual elegance in an ivory wool field jacket with velvet collar.",
                1799.99, 10, "https://media.loropiana.com/HYBRIS/FAN/FAN9452/2C3D2BF9-E6F3-44D3-BF38-4751028E6965/FAN9452_F5U8_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAN/FAN9452/F3792F2F-DF66-46EE-A7D9-C3C3BD8C7173/FAN9452_F5U8_MEDIUM.jpg", gifts);
        createProduct("Dark Brown Cashmere Tie", "Understated luxury in a dark brown cashmere tie with refined texture.",
                299.99, 25, "https://media.loropiana.com/HYBRIS/FAE/FAE8124/D6A8DB15-3F11-4738-AA75-9FF57F8C5199/FAE8124_8000_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAE/FAE8124/BE60ED95-1B12-4CAC-AE9F-0B38CEAB124C/FAE8124_8000_MEDIUM.jpg", gifts);
        createProduct("Black Technical Backpack", "Refined utility in a black technical backpack with multiple compartments and leather trim.",
                1199.99, 12, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/FR/CDADC9E6-ABD1-4138-9949-27CB0D7B5618_FAO3774_M006_MEDIUM.jpg?sw=680&sh=952,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/L1/AFF88145-E7A8-4A8A-B621-93CC301C5598_FAO3774_M006_MEDIUM.jpg", gifts);
        createProduct("Dark Brown Suede Fedora Hat", "Iconic dark brown suede fedora hat with grosgrain ribbon trim.",
                599.99, 12, "https://media.loropiana.com/HYBRIS/FAQ/FAQ2351/6DCB9F85-ADEA-4257-98A9-3A09476C4C3A/FAQ2351_D05S_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ2351/484C9855-22E8-46F5-B78D-5BA51B637F7B/FAQ2351_D05S_MEDIUM.jpg", gifts);
        createProduct("Black Suede Loafers", "Handcrafted Italian black suede loafers with white rubber sole.",
                999.99, 16, "https://media.loropiana.com/HYBRIS/FAO/FAO8041/DD50627D-1494-4C61-97C0-F34E349E547F/FAO8041_F7A8_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO8041/4AA0E11D-CF3A-4A41-AE60-82F4D5D6CF31/FAO8041_F7A8_MEDIUM.jpg", gifts);

        // ESSENTIALS
        createProduct("Essential Cable Knit Sweater", "Handcrafted from the finest Italian cashmere with intricate cable knit detailing.",
                1299.99, 10, "https://media.loropiana.com/HYBRIS/FAQ/FAQ3218/60DA4312-63A0-4E89-8136-A429B6BD17FD/FAQ3218_51FU_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ3218/51FU/L3/805ADE5C-7C68-445A-B04A-15BE848F0EB2_FAQ3218_51FU_MEDIUM.jpg", essentials);
        createProduct("Essential Merino Turtleneck", "Essential sophistication in a refined merino wool turtleneck with ribbed detailing.",
                699.99, 18, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/FR/0A5B70EE-C44C-4F05-BE90-CB05C25E16CD_FAP8313_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP8313/W000/L3/E63DA3BC-DC20-48C8-A3F0-1420880E3E3D_FAP8313_W000_MEDIUM.jpg", essentials);
        createProduct("Essential Cashmere Trousers", "Impeccably tailored trousers in a luxurious cashmere blend for ultimate comfort.",
                1199.99, 14, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/FR/BA411C4C-6E41-4755-8297-DB5FD04F2AAD_FAO3129_H0TM_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3129/H0TM/L4/12518492-58D7-487B-AD6F-CD9EB81B5B06_FAO3129_H0TM_MEDIUM.jpg", essentials);
        createProduct("Essential Cashmere Scarf", "Luxuriously soft cashmere scarf in classic neutral tones.",
                599.99, 22, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAQ/FAQ1948/F6ZL/FR/BDA09968-DE7C-4295-B02A-B1DA428FDF04_FAQ1948_F6ZL_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAQ/FAQ1948/951BA743-3562-47A6-8C52-C2A690CC6BFD/FAQ1948_F6ZL_MEDIUM.jpg", essentials);
        createProduct("Essential Cashmere Polo", "Refined elegance in a soft cashmere polo with ribbed collar and cuffs.",
                1199.99, 12, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/FR/0B635099-D96A-4C7D-90A2-3AD87FFCA794_FAP7344_W000_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP7344/W000/L2/78411282-CCEE-4178-8430-84F084F7C3C3_FAP7344_W000_MEDIUM.jpg", essentials);
        createProduct("Essential Wool Turtleneck", "Essential layering piece in ultra-fine merino wool with clean silhouette.",
                699.99, 20, "https://media.loropiana.com/HYBRIS/FAP/FAP7706/62D500E4-3867-49F7-9F87-DB65F42C8C4C/FAP7706_402F_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/HYBRIS/FAP/FAP7706/0C3C5D7C-F21E-4425-A037-3FE7282B0FC2/FAP7706_402F_MEDIUM.jpg", essentials);
        createProduct("Essential Palazzo Pants", "Flowing elegance in wide-leg cashmere blend palazzo pants.",
                1499.99, 12, "https://media.loropiana.com/HYBRIS/FAP/FAP6989/1C3AE6AF-8B03-481B-8852-E012A9B3587B/FAP6989_D983_MEDIUM.jpg?sw=500&sh=700,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP6989/D983/L3/45044753-BF4E-4866-9607-F1E1DB0D46C2_FAP6989_D983_MEDIUM.jpg", essentials);
        createProduct("Essential Knit Beanie", "Luxuriously soft cashmere beanie with ribbed knit.",
                299.99, 30, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/FR/0F5A2C39-4493-41BF-B4D9-ADF97DE6F62A_FAP9525_B4NE_MEDIUM.jpg,https://media.loropiana.com/PRODUCTS/HYBRIS/FAP/FAP9525/B4NE/D1/AFDD34E5-34DB-4074-9F94-B40510D5D77B_FAP9525_B4NE_MEDIUM.jpg", essentials);
        createProduct("Essential Soft Scarf", "Luxuriously soft cashmere scarf in timeless neutral tones.",
                599.99, 15, "https://media.loropiana.com/HYBRIS/FAI/FAI3766/46010BEF-4C33-4760-A3A7-645D55A075D2/FAI3766_W948_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAI/FAI3766/C9575477-26DC-4A48-98E3-C0516C26E7AB/FAI3766_W948_MEDIUM.jpg", essentials);
        createProduct("Essential Leather Wallet", "Handcrafted Italian leather wallet with multiple card slots and refined details.",
                299.99, 25, "https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/FR/CDADC9E6-ABD1-4138-9949-27CB0D7B5618_FAO3774_M006_MEDIUM.jpg?sw=680&sh=952,https://media.loropiana.com/PRODUCTS/HYBRIS/FAO/FAO3774/M006/L1/AFF88145-E7A8-4A8A-B621-93CC301C5598_FAO3774_M006_MEDIUM.jpg", essentials);
        createProduct("Essential Cashmere Gloves", "Lined cashmere gloves with leather palm patches for warmth and elegance.",
                399.99, 30, "https://media.loropiana.com/HYBRIS/FAO/FAO8041/DD50627D-1494-4C61-97C0-F34E349E547F/FAO8041_F7A8_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAO/FAO8041/4AA0E11D-CF3A-4A41-AE60-82F4D5D6CF31/FAO8041_F7A8_MEDIUM.jpg", essentials);
        createProduct("Essential Winter Beanie", "Luxuriously soft cashmere beanie with ribbed knit detailing.",
                499.99, 15, "https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/10AD4A54-8C76-4FBF-AA30-78DF6A278E31/FAQ0922_H0WX_MEDIUM.jpg,https://media.loropiana.com/HYBRIS/FAQ/FAQ0922/322578EB-3093-4E77-80B7-6D17E3A7571C/FAQ0922_H0WX_MEDIUM.jpg", essentials);

        System.out.println("✅ Data initialization completed!");
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
