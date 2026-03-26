from django.core.management.base import BaseCommand
from apps.adminside.product.models import Product, Brand, Size
from apps.accounts.models import UserModel


PRODUCTS = [
    {
        "name":        "Nike Air Force 1 '07",
        "description": "Classic Nike Air Force 1 sneakers with premium leather and everyday comfort.",
        "price":       4999.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/692cdb67-6709-4e93-953d-e6157edc3b13/AIR+FORCE+1+%2707.png",
        "stock":       25,
        "sizes":       [7, 8, 9, 10],
    },
    {
        "name":        "C1TY Premium CORDURA",
        "description": "Durable Nike sneakers made with strong CORDURA fabric designed for city lifestyle.",
        "price":       9695.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_410,c_limit/e34f45c2-765d-4cdb-b3bf-7599b664ec0b/c1ty-cordura-shoes-z3Zzlm.png",
        "stock":       18,
        "sizes":       [6, 7, 8, 9],
    },
    {
        "name":        "Dunk Low Retro Limited",
        "description": "Limited edition Nike Dunk Low sneakers with iconic street style design.",
        "price":       11895.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/d9eaab9f-5089-47b5-9095-df566497c83e/NIKE+DUNK+LOW+RETRO+LTD+HWN.png",
        "stock":       14,
        "sizes":       [7, 8, 9, 10],
    },
    {
        "name":        "Air Force 1 '07 RealTree",
        "description": "Special edition Nike Air Force sneakers with unique Realtree design.",
        "price":       5547.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/3071147b-8e3a-41aa-aed1-2620466e58f6/BLAZER+MID+%2777+VNTG.png",
        "stock":       12,
        "sizes":       [7, 8, 9],
    },
    {
        "name":        "Nike Dunk Low",
        "description": "Classic Nike Dunk Low sneakers with comfortable fit and modern style.",
        "price":       9777.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/d6594cec-e218-454d-9b19-18769a8496ce/WMNS+NIKE+DUNK+LOW.png",
        "stock":       21,
        "sizes":       [7, 8, 9, 10],
    },
    {
        "name":        "Jordan 1 Retro High OG Pro Green",
        "description": "Stylish Air Jordan sneakers featuring high-top design and premium materials.",
        "price":       6495.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/22e7e283-71b8-49fd-bd58-3d8ad841be5b/FORCE+1+LOW+EASYON+LV8+4+%28PS%29.png",
        "stock":       11,
        "sizes":       [8, 9, 10],
    },
    {
        "name":        "Air Jordan I High G",
        "description": "Premium Air Jordan sneakers offering performance and luxury style.",
        "price":       16995.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/571d610c-04b0-440b-a5d0-fb532b67f9bb/AIR+JORDAN+4+RETRO+SP.png",
        "stock":       9,
        "sizes":       [8, 9, 10],
    },
    {
        "name":        "Phantom and Midnight Navy",
        "description": "Nike sneakers designed with elegant phantom and navy color style.",
        "price":       13995.0,
        "brand":       "Nike",
        "image":       "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/49df8bf2-7ceb-4942-9aa6-0526512fd139/WMNS+NIKE+FIELD+GENERAL.png",
        "stock":       13,
        "sizes":       [7, 8, 9],
    },
    {
        "name":        "991v2 Grounded Pastels",
        "description": "Stylish Adidas sneakers featuring modern comfort and classic street fashion.",
        "price":       10567.0,
        "brand":       "Adidas",
        "image":       "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/b0b6d4a107ad4e84b3baaf8700866f07_9366/Campus_00s_Shoes_Green_H03472_01_standard.jpg",
        "stock":       19,
        "sizes":       [8, 9, 10],
    },
    {
        "name":        "Tokyo",
        "description": "Lightweight Adidas Tokyo sneakers inspired by retro running shoes.",
        "price":       11248.0,
        "brand":       "Adidas",
        "image":       "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6ac33c007386424986d557ff0502a44c_9366/Tokyo_Shoes_Silver_JQ0593_01_00_standard.jpg",
        "stock":       16,
        "sizes":       [7, 8, 9],
    },
    {
        "name":        "Samba",
        "description": "Iconic Adidas Samba sneakers known for timeless style and comfort.",
        "price":       10999.0,
        "brand":       "Adidas",
        "image":       "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/fde11872584f4f5983eb55046483ba34_9366/Samba_OG_Shoes_White_JI3205_01_00_standard.jpg",
        "stock":       30,
        "sizes":       [6, 7, 8, 9, 10],
    },
    {
        "name":        "Samba OG Shoes",
        "description": "Premium Adidas Samba OG sneakers with iconic three stripe design.",
        "price":       10999.0,
        "brand":       "Adidas",
        "image":       "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/ed0d15212f744f6ab1fe9b231942d26e_9366/SAMBA_OG_SHOES_Silver_JR0035_01_00_standard.jpg",
        "stock":       24,
        "sizes":       [6, 7, 8, 9, 10],
    },
    {
        "name":        "9060",
        "description": "Modern New Balance 9060 sneakers combining comfort with futuristic design.",
        "price":       9060.0,
        "brand":       "New Balance",
        "image":       "https://nb.scene7.com/is/image/NB/u9060ccc_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440",
        "stock":       20,
        "sizes":       [8, 9, 10],
    },
    {
        "name":        "T500",
        "description": "Classic tennis inspired sneakers with lightweight cushioning and style.",
        "price":       9480.0,
        "brand":       "New Balance",
        "image":       "https://nb.scene7.com/is/image/NB/uadwggr_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440",
        "stock":       22,
        "sizes":       [7, 8, 9],
    },
    {
        "name":        "574",
        "description": "Classic New Balance 574 sneakers offering comfort and everyday style.",
        "price":       5547.0,
        "brand":       "New Balance",
        "image":       "https://nb.scene7.com/is/image/NB/u574spr_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440",
        "stock":       26,
        "sizes":       [7, 8, 9],
    },
    {
        "name":        "Palermo Classic Comfort Low Boot Sneakers",
        "description": "Classic Puma Palermo sneakers with vintage football inspired design.",
        "price":       5599.0,
        "brand":       "Puma",
        "image":       "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/402693/06/sv01/fnd/IND/fmt/png/Palermo-Classic-Comfort-Low-Boot-Sneakers",
        "stock":       18,
        "sizes":       [6, 7, 8, 9],
    },
    {
        "name":        "Palermo Squid Game Leather Sneakers",
        "description": "Limited edition Puma sneakers inspired by the Squid Game theme.",
        "price":       10999.0,
        "brand":       "Puma",
        "image":       "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/403859/01/fnd/IND/fmt/png/Palermo-Squid-Game-Leather-Sneakers",
        "stock":       10,
        "sizes":       [7, 8, 9],
    },
    {
        "name":        "Speedcat Metallic Sneakers",
        "description": "Sporty Puma Speedcat sneakers with sleek metallic finish.",
        "price":       9999.0,
        "brand":       "Puma",
        "image":       "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/403689/02/sv01/fnd/IND/fmt/png/Speedcat-Metallic-Sneakers",
        "stock":       20,
        "sizes":       [7, 8, 9, 10],
    },
    {
        "name":        "Speedcat OG Sneakers",
        "description": "Classic Puma Speedcat sneakers inspired by motorsport heritage.",
        "price":       9999.0,
        "brand":       "Puma",
        "image":       "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/398846/01/sv01/fnd/IND/fmt/png/Speedcat-OG-Sneakers",
        "stock":       22,
        "sizes":       [7, 8, 9, 10],
    },
    {
        "name":        "Speedcat Plus Quilted Sneakers",
        "description": "Comfortable Puma Speedcat sneakers with quilted design finish.",
        "price":       5599.0,
        "brand":       "Puma",
        "image":       "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/403429/03/sv01/fnd/IND/fmt/png/Speedcat-Plus-Quilted-Sneakers",
        "stock":       19,
        "sizes":       [6, 7, 8, 9],
    },
]


class Command(BaseCommand):
    help = "Seed database with product data"

    def handle(self, *args, **kwargs):
        self.stdout.write(" Starting seed...")

        self.seed_sizes()
        self.seed_brands()
        self.seed_products()
        self.seed_users()

        self.stdout.write(self.style.SUCCESS("\n🎉 Seeding complete!"))

    # ── Sizes ────────
    def seed_sizes(self):
        all_sizes = set()
        for p in PRODUCTS:
            all_sizes.update(p["sizes"])

        for s in sorted(all_sizes):
            Size.objects.get_or_create(size=s)

        self.stdout.write(f"Sizes ready: {sorted(all_sizes)}")

    # ── Brands ─────────
    def seed_brands(self):
        brand_names = set(p["brand"] for p in PRODUCTS)
        for name in brand_names:
            Brand.objects.get_or_create(name=name)
        self.stdout.write(f"Brands ready: {sorted(brand_names)}")

    # ── Products ────────
    def seed_products(self):
        created_count = 0
        skipped_count = 0

        for data in PRODUCTS:
            brand = Brand.objects.get(name=data["brand"])

            product, created = Product.objects.get_or_create(
                name  = data["name"],
                brand = brand,
                defaults = {
                    "description": data["description"],
                    "price":       data["price"],
                    "image":       data["image"],
                    "stock":       data["stock"],
                }
            )

            if created:
                sizes = Size.objects.filter(size__in=data["sizes"])
                product.sizes.set(sizes)
                self.stdout.write(f"Created: {product.name} ({data['brand']})")
                created_count += 1
            else:
                self.stdout.write(f"Exists:  {product.name} ({data['brand']})")
                skipped_count += 1

        self.stdout.write(
            f"\n  Products — Created: {created_count} | Skipped: {skipped_count}"
        )

    # ── Users ───────
    def seed_users(self):
        # Admin
        if not UserModel.objects.filter(username="admin").exists():
            UserModel.objects.create_superuser(
                username = "admin",
                email    = "admin@shoecart.com",
                password = "admin123",
            )
            self.stdout.write("  ✅ Admin: admin@shoecart.com / admin123")
        else:
            self.stdout.write("  ⚠️  Admin already exists")

        # Test user
        if not UserModel.objects.filter(username="inshad").exists():
            UserModel.objects.create_user(
                username = "inshad",
                email    = "inshd@gmail.com",
                password = "test123",
                role     = "admin",
            )
            self.stdout.write(" Test user: test@shoecart.com / test123")
        else:
            self.stdout.write(" Test user already exists")