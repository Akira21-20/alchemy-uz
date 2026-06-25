from models import db, Element, Combination

ELEMENTS_DATA = [
    # (name_uz, name_en, emoji, description, category, is_base)
    # === ASOSIY ELEMENTLAR (Boshlang'ich) ===
    ("Havo", "Air", "🌬️", "Hammasi boshlangan joy", "asosiy", True),
    ("Yer", "Earth", "🌍", "Sayyoramizning poydevori", "asosiy", True),
    ("Olov", "Fire", "🔥", "Issiqlik va yorug'lik manbai", "asosiy", True),
    ("Suv", "Water", "💧", "Hayot manbai", "asosiy", True),

    # === TABIAT ===
    ("Bug'", "Steam", "♨️", "Isitilgan suv bug'i", "tabiat", False),
    ("Lava", "Lava", "🌋", "Yer ostidagi eritilgan tosh", "tabiat", False),
    ("Tosh", "Stone", "🪨", "Qattiq tabiat elementi", "tabiat", False),
    ("Qum", "Sand", "🏖️", "Mayda tosh bo'laklari", "tabiat", False),
    ("Loy", "Mud", "🟤", "Nam yer aralashmasi", "tabiat", False),
    ("Bulut", "Cloud", "☁️", "Suv bug'i va havo aralashmasi", "tabiat", False),
    ("Chang", "Dust", "🌫️", "Mayda zarrachalar", "tabiat", False),
    ("Tuproq", "Soil", "🌱", "O'sish uchun tuproq", "tabiat", False),
    ("Tog'", "Mountain", "⛰️", "Ulug'vor tabiat", "tabiat", False),
    ("Okean", "Ocean", "🌊", "Katta suv havzasi", "tabiat", False),
    ("Dengiz", "Sea", "🌊", "Katta sho'rvodir", "tabiat", False),
    ("Ko'l", "Lake", "🏞️", "Tinch suv havzasi", "tabiat", False),
    ("Daryo", "River", "🏞️", "Oqib boruvchi suv", "tabiat", False),
    ("Buz", "Ice", "🧊", "Muzgan suv", "tabiat", False),
    ("Qor", "Snow", "❄️", "Muzgan bulutlar", "tabiat", False),
    ("Muzlik", "Glacier", "🏔️", "Katta muz qatlami", "tabiat", False),
    ("Shamol", "Wind", "💨", "Havo oqimi", "tabiat", False),
    ("Bo'ron", "Storm", "⛈️", "Kuchli shamol va yomg'ir", "tabiat", False),
    ("Chaqimoq", "Lightning", "⚡", "Osmondan keluvchi elektr energiyasi", "tabiat", False),
    ("Kamalak", "Rainbow", "🌈", "Yomg'irdan keyin paydo bo'ladi", "tabiat", False),
    ("Quyosh", "Sun", "☀️", "Yorug'lik va issiqlik manbai", "tabiat", False),
    ("Oy", "Moon", "🌙", "Tungi yorug'lik", "tabiat", False),
    ("Yulduz", "Star", "⭐", "Tungi osmon yorug'ligi", "tabiat", False),
    ("Kosmos", "Space", "🌌", "Cheksiz fazolik", "tabiat", False),
    ("Atmosfera", "Atmosphere", "🌍", "Saytaning havo qatlami", "tabiat", False),
    ("Energiya", "Energy", "⚡", "Harakatga kuch beruvchi", "tabiat", False),
    ("Bosim", "Pressure", "🔽", "Yuqori bosim kuchi", "tabiat", False),
    ("Isiqlik", "Heat", "🌡️", "Yuqori harorat", "tabiat", False),
    ("Sovuq", "Cold", "🥶", "Past harorat", "tabiat", False),
    ("Tutun", "Smoke", "💨", "Yonish mahsuloti", "tabiat", False),
    ("Yomg'ir", "Rain", "🌧️", "Suv tomchilari", "tabiat", False),
    ("Shafaq", "Aurora", "🌌", "Shimoliy yorug'lik", "tabiat", False),
    ("Zilzila", "Earthquake", "💥", "Yer silkinishi", "tabiat", False),
    ("Tornado", "Tornado", "🌪️", "Havodagi burilish", "tabiat", False),
    ("Vulqon", "Volcano", "🌋", "Lava oqadigan tog'", "tabiat", False),
    ("Geyzer", "Geyser", "♨️", "Bug' chiqadigan teshik", "tabiat", False),
    ("Tuman", "Mist", "🌫️", "Yer ustidagi bug'", "tabiat", False),
    ("Buzqargan", "Avalanche", "🏔️", "Qor bo'roni", "tabiat", False),

    # === O'SIMLIKLAR ===
    ("O'simlik", "Plant", "🌿", "Yashil o'simlik", "osimlik", False),
    ("Daraxt", "Tree", "🌳", "Katta o'simlik", "osimlik", False),
    ("G'unazor", "Grass", "🌱", "Qisqa o'simlik", "osimlik", False),
    ("Gul", "Flower", "🌸", "Chiroyli o'simlik", "osimlik", False),
    ("Paxta", "Cotton", "☁️", "Yumshoq tolalar", "osimlik", False),
    ("Banan", "Banana", "🍌", "Sariq meva", "osimlik", False),
    ("Olma", "Apple", "🍎", "Qizil meva", "osimlik", False),
    ("Uzum", "Grape", "🍇", "Mayda mevalar", "osimlik", False),
    ("Pomidor", "Tomato", "🍅", "Qizil sabzavot", "osimlik", False),
    ("Kartoshka", "Potato", "🥔", "Yer osti mevasi", "osimlik", False),
    ("Makkajo'xori", "Corn", "🌽", "Sariq donalar", "osimlik", False),
    ("Bug'doy", "Wheat", "🌾", "Don ekinlari", "osimlik", False),
    ("Palma", "Palm", "🌴", "Issiq iqlim daraxti", "osimlik", False),
    ("Qamish", "Bamboo", "🎋", "Tez o'sadigan o'simlik", "osimlik", False),
    ("Meva", "Fruit", "🍎", "Shirin mevalar", "osimlik", False),
    ("Yos", "Moss", "🟢", "Nam toshlarda o'sadi", "osimlik", False),
    ("O'rmon", "Forest", "🌲", "Ko'p daraxtlar joyi", "osimlik", False),
    ("Lianalar", "Vine", "🌿", "Kalashuvchi o'simlik", "osimlik", False),
    ("Don", "Seed", "🌱", "Yangi o'simlik boshlanishi", "osimlik", False),
    ("Qo'ziyorin", "Mushroom", "🍄", "Zamburug'", "osimlik", False),
    ("Somon", "Hay", "🌾", "Quritilgan o'simlik", "osimlik", False),
    ("Kaktus", "Cactus", "🌵", "Cho'l o'simligi", "osimlik", False),
    ("Lavanda", "Lavender", "💜", "Xushbo'y o'simlik", "osimlik", False),
    ("Aloe", "Aloe", "🪴", "Davolash o'simligi", "osimlik", False),
    ("Yalpiz", "Mint", "🌿", "Salqin ta'mli o'simlik", "osimlik", False),
    ("Kungaboqar", "Sunflower", "🌻", "Quyoshga qaraydigan gul", "osimlik", False),
    ("Qizilgul", "Rose", "🌹", "Chiroyli qizil gul", "osimlik", False),

    # === JONLILAR ===
    ("Jon", "Life", "🧬", "Hayot boshlanishi", "jonli", False),
    ("Inson", "Human", "👤", "Aqlli mavjudot", "jonli", False),
    ("Hayvon", "Animal", "🐾", "Harakatlanuvchi jonli", "jonli", False),
    ("Baliq", "Fish", "🐟", "Suvda yashovchi", "jonli", False),
    ("Qush", "Bird", "🐦", "Uchuvchi jonli", "jonli", False),
    ("Hasharot", "Insect", "🐛", "Kichik jonli", "jonli", False),
    ("It", "Dog", "🐕", "Sadoqatli do'st", "jonli", False),
    ("Mushuk", "Cat", "🐱", "Mustaqil hayvon", "jonli", False),
    ("Ot", "Horse", "🐎", "Tez yuguruvchi", "jonli", False),
    ("Sigir", "Cow", "🐄", "Sut beruvchi", "jonli", False),
    ("Qo'y", "Sheep", "🐑", "Yun beruvchi", "jonli", False),
    ("Cho'chqa", "Pig", "🐷", "Bo'g'irsov", "jonli", False),
    ("Tovuq", "Chicken", "🐔", "Tuxum beruvchi", "jonli", False),
    ("O'rdak", "Duck", "🦆", "Suv qushi", "jonli", False),
    ("Qurbaqa", "Frog", "🐸", "Suv va quruqda yashaydi", "jonli", False),
    ("Kapalak", "Butterfly", "🦋", "Chiroyli hasharot", "jonli", False),
    ("Ari", "Bee", "🐝", "Asal yasovchi", "jonli", False),
    ("Chumoli", "Ant", "🐜", "Kichik lekin kuchli", "jonli", False),
    ("O'rgimchak", "Spider", "🕷️", "To'р туfadigan", "jonli", False),
    ("Yilanchiq", "Lizard", "🦎", "Sovuq qonli", "jonli", False),
    ("Ilon", "Snake", "🐍", "Oyoqsiz hayvon", "jonli", False),
    ("Toshbaqa", "Turtle", "🐢", "Muzli hayvon", "jonli", False),
    ("Delfin", "Dolphin", "🐬", "Aqlli suv hayvoni", "jonli", False),
    ("Kit", "Whale", "🐋", "Eng katta hayvon", "jonli", False),
    ("Sher", "Lion", "🦁", "Hayvonlar qiroli", "jonli", False),
    ("Fil", "Elephant", "🐘", "Eng katta quruq hayvoni", "jonli", False),
    ("Ayiq", "Bear", "🐻", "Katta kuchli hayvon", "jonli", False),
    ("Bo'ri", "Wolf", "🐺", "Guruhda yashaydi", "jonli", False),
    ("Tulk", "Fox", "🦊", "Zakovatli hayvon", "jonli", False),
    ("Qarg'a", "Crow", "🐦‍⬛", "Qora qush", "jonli", False),
    ("Baliqchi qush", "Eagle", "🦅", "Kuchli qush", "jonli", False),
    ("Nayro", "Owl", "🦉", "Tungi qush", "jonli", False),
    ("Pingvin", "Penguin", "🐧", "Ucha olmaydigan qush", "jonli", False),
    ("Timsoh", "Crocodile", "🐊", "Suv hayvoni", "jonli", False),
    ("Ko'rshapalak", "Bat", "🦇", "Tungi uchuvchi", "jonli", False),
    ("Qisqichbaqa", "Crab", "🦀", "Qisqichbaqa", "jonli", False),
    ("Sakkizoyoq", "Octopus", "🐙", "Sakkiz qo'lli", "jonli", False),
    ("Shilliqqurt", "Snail", "🐌", "Uy bilan yuradigan", "jonli", False),
    ("Makon", "Worm", "🪱", "Yer ostida yashaydi", "jonli", False),
    ("Bakteriya", "Bacteria", "🦠", "Mikroskopik jonli", "jonli", False),
    ("Tovus", "Peacock", "🦚", "Chiroyli qush", "jonli", False),
    ("Kangu", "Kangaroo", "🦘", "Sakraydigan hayvon", "jonli", False),
    ("Zirafa", "Giraffe", "🦒", "Bo'yi uzun hayvon", "jonli", False),
    ("Koala", "Koala", "🐨", "Daraxtda yashaydi", "jonli", False),
    ("Panda", "Panda", "🐼", "Qora-oq ayi", "jonli", False),
    ("Tikon", "Rhino", "🦏", "Bitta shoxli", "jonli", False),
    ("Gippopotam", "Hippopotamus", "🦛", "Suvda yashaydi", "jonli", False),
    ("Omar", "Lobster", "🦞", "Dengiz qisqichbaqasi", "jonli", False),
    ("Meduza", "Jellyfish", "🎐", "Shaffof dengiz", "jonli", False),
    ("Yulduz baliq", "Starfish", "⭐", "Dengiz yulduzi", "jonli", False),
    ("Sincap", "Squirrel", "🐿️", "Yong'oq yeydigan", "jonli", False),
    ("Kapkan", "Raccoon", "🦝", "Tungi hayvon", "jonli", False),
    ("Yovvoyi mushuk", "Wild Cat", "🐈", "Yovvoyi", "jonli", False),
    ("Chita", "Cheetah", "🐆", "Eng tez yuguruvchi", "jonli", False),
    ("Yovvoyi ot", "Zebra", "🦓", "Chiziqli ot", "jonli", False),
    ("Tuyug", "Camel", "🐫", "Cho'l hayvoni", "jonli", False),
    ("Bug'oi", "Bull", "🐂", "Kuchli hayvon", "jonli", False),
    ("Echki", "Goat", "🐐", "Saqich yeydigan", "jonli", False),
    ("Tutaloq", "Caterpillar", "🐛", "Hasharot lichinkasi", "jonli", False),
    ("Chayon", "Scorpion", "🦂", "Zaharli", "jonli", False),
    ("Dengiz ot", "Seahorse", "🐴", "Suv ot", "jonli", False),
    ("Kalmar", "Squid", "🦑", "Sakkizoyoqga o'xshash", "jonli", False),

    # === INSON VA UNSURLAR ===
    ("Skelet", "Skeleton", "💀", "Inson suyaklari", "inson", False),
    ("Qon", "Blood", "🩸", "Hayot suyuqligi", "inson", False),
    ("Yurak", "Heart", "❤️", "Qonni haydaydi", "inson", False),
    ("Miya", "Brain", "🧠", "Aql markazi", "inson", False),

    # === OVQAT ===
    ("Non", "Bread", "🍞", "Asosiy oziq-ovqat", "ovqat", False),
    ("Tuxum", "Egg", "🥚", "Tovuq tuxumi", "ovqat", False),
    ("Sut", "Milk", "🥛", "Sigir sutidan", "ovqat", False),
    ("Asal", "Honey", "🍯", "Ari asali", "ovqat", False),
    ("Shakar", "Sugar", "🍬", "Shirin modda", "ovqat", False),
    ("Tuz", "Salt", "🧂", "Dengiz suvidan", "ovqat", False),
    ("Yog'", "Oil", "🫒", "O'simlik moyi", "ovqat", False),
    ("Pishloq", "Cheese", "🧀", "Sutdan tayyorlanadi", "ovqat", False),
    ("Go'sht", "Meat", "🥩", "Hayvon go'shti", "ovqat", False),
    ("Sushi", "Sushi", "🍣", "Tayyor ovqat", "ovqat", False),
    ("Tort", "Cake", "🎂", "Shirin pishiriq", "ovqat", False),
    ("Shokolad", "Chocolate", "🍫", "Shirin ta'm", "ovqat", False),
    ("Muzqaymoq", "Ice Cream", "🍦", "Sovuq shirinlik", "ovqat", False),
    ("Pizza", "Pizza", "🍕", "Italyan taomi", "ovqat", False),
    ("Kofe", "Coffee", "☕", "Ichimlik", "ovqat", False),
    ("Choy", "Tea", "🍵", "Issiq ichimlik", "ovqat", False),
    ("Sharob", "Wine", "🍷", "Uzumdan tayyorlangan", "ovqat", False),
    ("Pivo", "Beer", "🍺", "Bug'doydan tayyorlangan", "ovqat", False),
    ("Sharbat", "Juice", "🧃", "Meva sharbati", "ovqat", False),
    ("Xamir", "Dough", "🫓", "Pishirish uchun", "ovqat", False),
    ("Makaron", "Pasta", "🍝", "Italyan taomi", "ovqat", False),
    ("Guruch", "Rice", "🍚", "Asosiy oziq-ovqat", "ovqat", False),
    ("Sho'rva", "Soup", "🍜", "Issiq ovqat", "ovqat", False),
    ("Salat", "Salad", "🥗", "Sovuq ovqat", "ovqat", False),
    ("Sendvich", "Sandwich", "🥪", "Tez ovqat", "ovqat", False),
    ("Hamburger", "Hamburger", "🍔", "Go'shtli sendvich", "ovqat", False),
    ("Fries", "French Fries", "🍟", "Qovurilgan", "ovqat", False),
    ("Hotdog", "Hot Dog", "🌭", "Achchiq taom", "ovqat", False),
    ("Popkorn", "Popcorn", "🍿", "Makaron mahsuloti", "ovqat", False),

    # === QURILISH ===
    ("G'isht", "Brick", "🧱", "Qurilish materiali", "qurilish", False),
    ("Uy", "House", "🏠", "Yashash joyi", "qurilish", False),
    ("Deraza", "Window", "🪟", "Yorug'lik o'tkazuvchi", "qurilish", False),
    ("Eshik", "Door", "🚪", "Kirish joyi", "qurilish", False),
    ("Tom", "Roof", "🏠", "Uy yuqorisi", "qurilish", False),
    ("Poydevor", "Foundation", "🏗️", "Uy asosi", "qurilish", False),
    ("Zinapoya", "Stairs", "🪜", "Yuqoriga chiqish", "qurilish", False),
    ("Ko'prik", "Bridge", "🌉", "Daryo ustidan o'tish", "qurilish", False),
    ("Minor", "Tower", "🗼", "Yuqori bino", "qurilish", False),
    ("Qala", "Castle", "🏰", "Buyuk bino", "qurilish", False),
    ("Masjid", "Mosque", "🕌", "Ibodat joyi", "qurilish", False),
    ("Maktab", "School", "🏫", "Ta'lim joyi", "qurilish", False),
    ("Zavod", "Factory", "🏭", "Ishlab chiqarish", "qurilish", False),
    ("Shahar", "City", "🏙️", "Katta aholi punkti", "qurilish", False),
    ("Qishloq", "Village", "🏘️", "Kichik aholi punkti", "qurilish", False),
    ("Devor", "Wall", "🧱", "Uy devori", "qurilish", False),
    ("Beton", "Concrete", "🏗️", "Qurilish aralashmasi", "qurilish", False),

    # === ASBOB-USKUNALAR ===
    ("Asbob", "Tool", "🔧", "Ishlash uchun asbob", "asbob", False),
    ("Pichoq", "Blade", "🔪", "Kesish uchun", "asbob", False),
    ("Ketmon", "Axe", "🪓", "Daraxt kesish", "asbob", False),
    ("Arra", "Saw", "🪚", "Tosh va yog'och kesish", "asbob", False),
    ("Kalit", "Key", "🔑", "Eshik ochish", "asbob", False),
    ("Qulf", "Lock", "🔒", "Eshikni qulflash", "asbob", False),
    ("Zanjir", "Chain", "🔗", "Bog'lash uchun", "asbob", False),
    ("Kilich", "Sword", "⚔️", "Jang uchun", "asbob", False),
    ("Qalqon", "Shield", "🛡️", "Himoya uchun", "asbob", False),
    ("To'p", "Cannon", "💣", "Otish uchun", "asbob", False),
    ("Miltiq", "Gun", "🔫", "Ov uchun", "asbob", False),
    ("Kran", "Crane", "🏗️", "Og'ir narsalarni ko'tarish", "asbob", False),
    ("Traktor", "Tractor", "🚜", "Dehqonchilik uchun", "asbob", False),
    ("Avtomobil", "Car", "🚗", "Transport vositasi", "asbob", False),
    ("Poyezd", "Train", "🚂", "Temir yo'l transporti", "asbob", False),
    ("Kema", "Boat", "⛵", "Suv transporti", "asbob", False),
    ("Samolyot", "Airplane", "✈️", "Havo transporti", "asbob", False),
    ("Roketa", "Rocket", "🚀", "Kosmosga uchish", "asbob", False),
    ("Velosiped", "Bicycle", "🚲", "Oyoq bilan haydash", "asbob", False),
    ("Mototsikl", "Motorcycle", "🏍️", "Tez transport", "asbob", False),

    # === TEXNOLOGIYA ===
    ("Elektr", "Electricity", "⚡", "Zaryad oqimi", "texnologiya", False),
    ("Kompyuter", "Computer", "💻", "Hisoblash qurilmasi", "texnologiya", False),
    ("Telefon", "Phone", "📱", "Aloqa vositasi", "texnologiya", False),
    ("Internet", "Internet", "🌐", "Global tarmoq", "texnologiya", False),
    ("Lampanoch", "Light Bulb", "💡", "Yorug'lik manbai", "texnologiya", False),
    ("Generator", "Generator", "⚙️", "Elektr ishlab chiqaradi", "texnologiya", False),
    ("Motor", "Motor", "⚙️", "Harakatga kuch beradi", "texnologiya", False),
    ("Robot", "Robot", "🤖", "Avtomatik qurilma", "texnologiya", False),
    ("Dron", "Drone", "🚁", "Uchuvchi qurilma", "texnologiya", False),
    ("Kamera", "Camera", "📷", "Rasm olish", "texnologiya", False),

    # === TIBBIYOT ===
    ("Dori", "Medicine", "💊", "Davolash uchun", "tibbiyot", False),
    ("Doktor", "Doctor", "👨‍⚕️", "Davolash mutaxassisi", "tibbiyot", False),

    # === KIMYO ===
    ("Kislorod", "Oxygen", "O", "Nafas olish uchun", "kimyo", False),
    ("Vodorod", "Hydrogen", "H", "Eng yengil element", "kimyo", False),
    ("Temir", "Iron", "⚙️", "Metall element", "kimyo", False),
    ("Oltin", "Gold", "🥇", "Qimmatbaho metall", "kimyo", False),
    ("Kumush", "Silver", "🥈", "Qimmatbaho metall", "kimyo", False),
    ("Mis", "Copper", "🟤", "Elektr o'tkazuvchi", "kimyo", False),
    ("Shisha", "Glass", "🪟", "Shaffof modda", "kimyo", False),
    ("Kukun", "Gunpowder", "💥", "Portlatish uchun", "kimyo", False),
    ("Qog'oz", "Paper", "📄", "Yozish uchun", "kimyo", False),
    ("Bo'yoq", "Paint", "🎨", "Rang berish uchun", "kimyo", False),
    ("Kauchuk", "Rubber", "🧤", "Egiluvchan modda", "kimyo", False),
    ("Ko'mir", "Coal", "⬛", "Yonish moddasi", "kimyo", False),
    ("Neft", "Petroleum", "🛢️", "Yonilg'i moddasi", "kimyo", False),
    ("Plastmassa", "Plastic", "♻️", "Sun'iy modda", "kimyo", False),
    ("Portlash", "Explosion", "💥", "Kuchli portlash", "kimyo", False),
    ("Kislota", "Acid", "🧪", "Kislotali modda", "kimyo", False),

    # === SAN'AT ===
    ("Rasm", "Painting", "🖼️", "San'at asari", "sanat", False),
    ("Musiqa", "Music", "🎵", "Ovoz san'ati", "sanat", False),
    ("Noutbuk", "Book", "📖", "Bilim manbai", "sanat", False),
    ("Qalam", "Pencil", "✏️", "Yozish uchun", "sanat", False),
    ("Rassom", "Painter", "🎨", "Rasm chizuvchi", "sanat", False),
    ("Guitar", "Guitar", "🎸", "Cholg'u asbobi", "sanat", False),
    ("Piyano", "Piano", "🎹", "Katta cholg'u", "sanat", False),
    ("Barabon", "Drum", "🥁", "Urish asbobi", "sanat", False),
    ("Trompet", "Trumpet", "🎺", "Nafas asbobi", "sanat", False),

    # === KOSMOS ===
    ("Sayyora", "Planet", "🪐", "Quyosh atrofida aylanadi", "kosmos", False),
    ("Quyosh tizimi", "Solar System", "☀️", "Quyosh va sayyoralar", "kosmos", False),
    ("Galaktika", "Galaxy", "🌌", "Yulduzlar guruhi", "kosmos", False),

    # === ZAMON ===
    ("Vaqt", "Time", "⏳", "O'tib boruvchi", "zamon", False),
    ("Tun", "Night", "🌙", "Qorong'u vaqt", "zamon", False),
    ("Kun", "Day", "🌅", "Yorug'lik vaqti", "zamon", False),

    # === FAN ===
    ("Matn", "Text", "📝", "Yozilgan so'zlar", "fan", False),
    ("Raqam", "Number", "🔢", "Hisoblash uchun", "fan", False),
    ("Matematika", "Mathematics", "🧮", "Raqamlar fanlari", "fan", False),
    ("Ilm", "Science", "🔬", "Tadqiqot fani", "fan", False),
    ("Dasturlash", "Programming", "💻", "Kompyuter tili", "fan", False),
    ("Kimyo", "Chemistry", "🧪", "Moddalar o'zgarishi", "fan", False),
    ("Fizika", "Physics", "⚛️", "Tabiat qonunlari", "fan", False),

    # === KASB ===
    ("Ovchi", "Hunter", "🏹", "Hayvon ovlovchi", "kasb", False),
    ("Dehqon", "Farmer", "👨‍🌾", "Ekin etishtiruvchi", "kasb", False),
    ("Sotuvchi", "Merchant", "🧑‍💼", "Savdo qiluvchi", "kasb", False),
    ("Harbiy", "Warrior", "⚔️", "Jangchi", "kasb", False),
    ("Usta", "Craftsman", "🔨", "Mahoratli ishchi", "kasb", False),
    ("O'qituvchi", "Teacher", "👨‍🏫", "Bilim beruvchi", "kasb", False),
    ("Shoir", "Poet", "✍️", "She'rxon", "kasb", False),
    ("Qo'shiqchi", "Singer", "🎤", "Musiqa ijro etuvchi", "kasb", False),
    ("Olim", "Scholar", "📚", "Ilmiy tadqiqotchi", "kasb", False),
    ("Injener", "Engineer", "👷", "Texnik mutaxassis", "kasb", False),

    # === MOLIYA ===
    ("Pul", "Money", "💰", "Qiymat o'lchovi", "moliya", False),
    ("Tanga", "Coin", "🪙", "Metall pul", "moliya", False),

    # === KIYIM ===
    ("Kiyim", "Clothes", "👕", "Tanani qoplash", "kiyim", False),
    ("Shapka", "Hat", "🎩", "Bosh kiyimi", "kiyim", False),
    ("Krossovka", "Shoes", "👟", "Oyoq kiyimi", "kiyim", False),

    # === TUTILGAN ===
    ("Baxt", "Happiness", "😊", "Izchillik hissi", "tutilgan", False),
    ("Sevgi", "Love", "❤️", "Kuchli his", "tutilgan", False),
    ("O'lim", "Death", "💀", "Hayot tugashi", "tutilgan", False),
    ("Kuch", "Power", "💪", "Jismoniy kuch", "tutilgan", False),
    ("Zakovat", "Wisdom", "🦉", "Aqlli fikrlash", "tutilgan", False),
    ("Jodugar", "Wizard", "🧙", "Sehr o'qituvchi", "tutilgan", False),
    ("Qahramon", "Hero", "🦸", "Mardona inson", "tutilgan", False),
    ("Ajdaho", "Dragon", "🐉", "Mifologik uchuvchi", "tutilgan", False),
    ("Feniks", "Phoenix", "🔥", "O'lib qayta tug'iladi", "tutilgan", False),
    ("Unikorn", "Unicorn", "🦄", "Mifologik ot", "tutilgan", False),
    ("Xazina", "Treasure", "💎", "Qimmatbaho narsa", "tutilgan", False),
    ("Olmos", "Diamond", "💎", "Qattiq tosh", "tutilgan", False),
    ("Kristall", "Crystal", "🔮", "Shaffof tosh", "tutilgan", False),
    ("Marmar", "Marble", "🪨", "Chiroyli tosh", "tutilgan", False),

    # === SPORT ===
    ("Sport", "Sport", "⚽", "Jismoniy mashq", "sport", False),
    ("Futbol", "Soccer", "⚽", "Mushuk bilan o'ynash", "sport", False),
    ("Basketbol", "Basketball", "🏀", "Katta to'p bilan", "sport", False),
    ("Suzish", "Swimming", "🏊", "Suvda harakatlanish", "sport", False),

    # === QO'SHIMCHA ===
    ("Mevalar", "Fruits", "🍇", "Mevalar to'plami", "osimlik", False),
    ("Yog'och", "Wood", "🪵", "Daraxt materiali", "tabiat", False),
    ("Temir panel", "Iron Plate", "⬜", "Yassi temir", "kimyo", False),
    ("Sim", "Wire", "〰️", "Yupqa temir", "kimyo", False),
    ("Aloqa", "Communication", "📞", "Muloqot", "texnologiya", False),
]

COMBINATIONS_DATA = [
    # === 4 TA ASOSIY ELEMENT ===
    ("Havo", "Olov", "Bug'"),
    ("Havo", "Suv", "Bulut"),
    ("Havo", "Yer", "Chang"),
    ("Yer", "Olov", "Lava"),
    ("Yer", "Suv", "Loy"),
    ("Olov", "Suv", "Bug'"),

    # === TABIAT - AVVALGI QATLAM ===
    ("Bug'", "Yer", "Tuproq"),
    ("Bug'", "Havo", "Bulut"),
    ("Lava", "Suv", "Tosh"),
    ("Lava", "Havo", "Tosh"),
    ("Lava", "Yer", "Tog'"),
    ("Tosh", "Olov", "Qum"),
    ("Tosh", "Suv", "Qum"),
    ("Tosh", "Havo", "Chang"),
    ("Qum", "Suv", "Loy"),
    ("Chang", "Suv", "Loy"),
    ("Chang", "Havo", "Bo'ron"),
    ("Tuproq", "Suv", "O'simlik"),
    ("Tuproq", "Don", "O'simlik"),
    ("Tosh", "Tosh", "Tog'"),
    ("Loy", "Isiqlik", "G'isht"),
    ("Loy", "Olov", "G'isht"),
    ("Qum", "Olov", "Shisha"),
    ("Qum", "Isiqlik", "Shisha"),

    # === OB-HAVO ===
    ("Bulut", "Suv", "Yomg'ir"),
    ("Bulut", "Sovuq", "Qor"),
    ("Bulut", "Chaqimoq", "Bo'ron"),
    ("Bulut", "Havo", "Atmosfera"),
    ("Yomg'ir", "Tuproq", "G'unazor"),
    ("Yomg'ir", "Olov", "Bug'"),
    ("Yomg'ir", "Quyosh", "Kamalak"),
    ("Qor", "Suv", "Buz"),
    ("Qor", "Sovuq", "Muzlik"),
    ("Chaqimoq", "Havo", "Energiya"),
    ("Chaqimoq", "Havo", "Elektr"),
    ("Chaqimoq", "Yer", "Zilzila"),
    ("Chaqimoq", "Suv", "Jon"),
    ("Energiya", "Havo", "Shamol"),
    ("Energiya", "Olov", "Portlash"),
    ("Energiya", "Tosh", "Bosim"),
    ("Bosim", "Tosh", "Olmos"),
    ("Bosim", "Yer", "Zilzila"),
    ("Shamol", "Suv", "Dengiz"),
    ("Shamol", "Yer", "Tornado"),
    ("Shamol", "Olov", "Tutun"),
    ("Shamol", "Qum", "Cho'l"),
    ("Shamol", "Suv", "Bo'ron"),
    ("Isiqlik", "Suv", "Bug'"),
    ("Isiqlik", "Tosh", "Lava"),
    ("Sovuq", "Suv", "Buz"),
    ("Sovuq", "Bulut", "Qor"),

    # === QUYOSH TIZIMI ===
    ("Quyosh", "Yer", "Kun"),
    ("Quyosh", "Energiya", "Kun"),
    ("Oy", "Yer", "Tun"),
    ("Quyosh", "Bulut", "Kun"),
    ("Quyosh", "Tog'", "Shafaq"),
    ("Quyosh", "Havo", "Atmosfera"),
    ("Yulduz", "Yulduz", "Galaktika"),
    ("Yulduz", "Yer", "Sayyora"),
    ("Sayyora", "Sayyora", "Quyosh tizimi"),
    ("Kosmos", "Tosh", "Sayyora"),
    ("Kosmos", "Quyosh", "Quyosh tizimi"),
    ("Kosmos", "Kosmos", "Galaktika"),
    ("Yulduz", "Kosmos", "Galaktika"),
    ("Sayyora", "Kosmos", "Quyosh tizimi"),

    # === O'SIMLIKLAR ===
    ("Tuproq", "Suv", "O'simlik"),
    ("O'simlik", "Quyosh", "Gul"),
    ("O'simlik", "Vaqt", "Daraxt"),
    ("O'simlik", "Tosh", "Yos"),
    ("Daraxt", "Daraxt", "O'rmon"),
    ("Daraxt", "Olov", "Ko'mir"),
    ("Daraxt", "Yer", "Yog'och"),
    ("Daraxt", "Quyosh", "Olma"),
    ("Daraxt", "Meva", "Mevalar"),
    ("G'unazor", "Quyosh", "Bug'doy"),
    ("G'unazor", "Suv", "O'simlik"),
    ("G'unazor", "Olov", "Somon"),
    ("O'simlik", "Don", "Daraxt"),
    ("O'simlik", "Suv", "O'simlik"),
    ("O'simlik", "Quyosh", "Kaktus"),
    ("O'simlik", "Issiqlik", "Kaktus"),
    ("Gul", "Vaqt", "Don"),
    ("Bug'doy", "Suv", "Xamir"),
    ("Bug'doy", "Vaqt", "Non"),
    ("Bug'doy", "Olov", "Somon"),
    ("Bug'doy", "Suv", "Guruch"),

    # === MEVALAR ===
    ("Daraxt", "Quyosh", "Olma"),
    ("Daraxt", "Quyosh", "Olma"),
    ("O'simlik", "Quyosh", "Meva"),
    ("O'simlik", "Suv", "Banan"),
    ("Mevalar", "Suv", "Sharbat"),
    ("Olma", "Vaqt", "Sharob"),
    ("Uzum", "Vaqt", "Sharob"),
    ("Uzum", "Qimmatbaho", "Sharob"),

    # === JONLILAR ===
    ("Suv", "Energiya", "Jon"),
    ("Chaqimoq", "Suv", "Jon"),
    ("Jon", "Loy", "Inson"),
    ("Jon", "Qum", "Hayvon"),
    ("Jon", "Suv", "Baliq"),
    ("Jon", "Havo", "Qush"),
    ("Jon", "O'simlik", "Hasharot"),
    ("Jon", "Bug'", "Bakteriya"),
    ("Hayvon", "Suv", "Delfin"),
    ("Hayvon", "Dengiz", "Kit"),
    ("Hayvon", "O'rmon", "Ayiq"),
    ("Hayvon", "Tog'", "Sher"),
    ("Hayvon", "Cho'l", "Fil"),
    ("Hayvon", "G'unazor", "Sigir"),
    ("Hayvon", "G'unazor", "Qo'y"),
    ("Hayvon", "Tuproq", "Ilon"),
    ("Hayvon", "Tosh", "Yilanchiq"),
    ("Hayvon", "Tuproq", "Chumoli"),
    ("Hayvon", "Suv", "Qurbaqa"),
    ("Hayvon", "Qor", "Ayiq"),
    ("Hayvon", "Suv", "O'rdak"),
    ("Hayvon", "Suv", "Qisqichbaqa"),
    ("Hayvon", "Tog'", "Ot"),
    ("Hayvon", "O'simlik", "Ari"),
    ("Hayvon", "Tosh", "Shilliqqurt"),
    ("Hayvon", "Tuproq", "Makon"),
    ("Hayvon", "Dengiz", "Sakkizoyoq"),
    ("Hayvon", "Tun", "Ko'rshapalak"),
    ("Hayvon", "O'rmon", "Tulk"),
    ("Hayvon", "O'rmon", "Bo'ri"),
    ("Hayvon", "G'unazor", "Cho'chqa"),
    ("Hayvon", "G'unazor", "Tovuq"),

    # === QUSHLAR ===
    ("Qush", "Suv", "O'rdak"),
    ("Qush", "Tog'", "Baliqchi qush"),
    ("Qush", "O'rmon", "Qarg'a"),
    ("Qush", "Tun", "Nayro"),
    ("Qush", "Dengiz", "Pingvin"),
    ("Qush", "Quyosh", "Tovus"),

    # === INSON ===
    ("Inson", "Tosh", "Asbob"),
    ("Inson", "Asbob", "Usta"),
    ("Inson", "Olov", "Dehqon"),
    ("Inson", "Baliq", "Sotuvchi"),
    ("Inson", "Hayvon", "Ovchi"),
    ("Inson", "Paxta", "Kiyim"),
    ("Inson", "Qalam", "Rassom"),
    ("Inson", "Musiqa", "Qo'shiqchi"),
    ("Inson", "Noutbuk", "O'qituvchi"),
    ("Inson", "Matn", "Shoir"),
    ("Inson", "Dori", "Doktor"),
    ("Inson", "Tanga", "Sotuvchi"),
    ("Inson", "Inson", "Sevgi"),
    ("Inson", "Inson", "Baxt"),
    ("Inson", "Vaqt", "O'lim"),
    ("Inson", "Zakovat", "Jodugar"),
    ("Inson", "Kuch", "Qahramon"),
    ("Inson", "Kompyuter", "Dasturlash"),
    ("Inson", "Internet", "Dasturlash"),
    ("Inson", "Telefon", "Aloqa"),

    # === QURILISH ===
    ("G'isht", "G'isht", "Devor"),
    ("Devor", "Devor", "Uy"),
    ("Uy", "Uy", "Shahar"),
    ("Uy", "Deraza", "Uy"),
    ("Uy", "Eshik", "Uy"),
    ("Uy", "Tom", "Uy"),
    ("Shisha", "Havo", "Deraza"),
    ("Devor", "Deraza", "Eshik"),
    ("Devor", "Tom", "Uy"),
    ("Tosh", "Tosh", "G'isht"),
    ("Beton", "G'isht", "Uy"),
    ("Shisha", "Shisha", "Deraza"),
    ("Uy", "Uy", "Qishloq"),

    # === ASBOB ===
    ("Tosh", "Tosh", "Pichoq"),
    ("Tosh", "Daraxt", "Ketmon"),
    ("Tosh", "Daraxt", "Arra"),
    ("Temir", "Temir", "Zanjir"),
    ("Temir", "Temir", "Asbob"),
    ("Daraxt", "Temir", "Asbob"),
    ("Temir", "Olov", "Temir panel"),
    ("Temir", "Suv", "Temir panel"),
    ("Temir panel", "Temir panel", "Pichoq"),
    ("Temir", "Pichoq", "Kilich"),
    ("Temir", "Kilich", "Qalqon"),
    ("Temir", "Kukun", "To'p"),
    ("Temir", "Kukun", "Miltiq"),

    # === TRANSPORT ===
    ("Asbob", "Asbob", "Avtomobil"),
    ("Avtomobil", "Avtomobil", "Poyezd"),
    ("Daraxt", "Suv", "Kema"),
    ("Daraxt", "Havo", "Samolyot"),
    ("Daraxt", "Energiya", "Avtomobil"),
    ("Temir", "Motor", "Avtomobil"),
    ("Temir", "Energiya", "Poyezd"),
    ("Yog'och", "Suv", "Kema"),
    ("Havo", "Motor", "Samolyot"),

    # === TEXNOLOGIYA ===
    ("Chaqimoq", "Temir", "Elektr"),
    ("Chaqimoq", "Havo", "Elektr"),
    ("Elektr", "Temir", "Lampanoch"),
    ("Elektr", "Qog'oz", "Kompyuter"),
    ("Elektr", "Temir", "Motor"),
    ("Elektr", "Motor", "Generator"),
    ("Kompyuter", "Kompyuter", "Internet"),
    ("Kompyuter", "Internet", "Dron"),
    ("Kompyuter", "Kamera", "Robot"),

    # === OVQAT ===
    ("Bug'doy", "Suv", "Xamir"),
    ("Bug'doy", "Olov", "Non"),
    ("Xamir", "Olov", "Non"),
    ("Non", "Sut", "Tort"),
    ("Non", "Go'sht", "Pizza"),
    ("Non", "Shokolad", "Tort"),
    ("Tovuq", "Olov", "Go'sht"),
    ("Sigir", "Olov", "Go'sht"),
    ("Tuxum", "Olov", "Tovuq"),
    ("Tovuq", "Tuxum", "Tovuq"),
    ("Sigir", "Olov", "Sut"),
    ("Ari", "Gul", "Asal"),
    ("Suv", "Qum", "Tuz"),
    ("Dengiz", "Quyosh", "Tuz"),
    ("Suv", "O'simlik", "Yog'"),
    ("Sut", "Vaqt", "Pishloq"),
    ("Sovuq", "Sut", "Muzqaymoq"),
    ("Suv", "Qahva", "Kofe"),
    ("Suv", "Gul", "Choy"),
    ("Uzum", "Vaqt", "Sharob"),
    ("Bug'doy", "Vaqt", "Pivo"),
    ("Mevalar", "Suv", "Sharbat"),
    ("Shakar", "Sut", "Shokolad"),

    # === KIMYO ===
    ("Havo", "Havo", "Kislorod"),
    ("Suv", "Elektr", "Vodorod"),
    ("Havo", "Azot", "Kislorod"),
    ("Tosh", "Olov", "Temir"),
    ("Tosh", "Qum", "Shisha"),
    ("Tosh", "Bosim", "Marmar"),
    ("Tosh", "Bosim", "Olmos"),
    ("Ko'mir", "Bosim", "Olmos"),
    ("Shisha", "Shisha", "Kristall"),
    ("Lava", "Tosh", "Marmar"),
    ("Olov", "Yer", "Ko'mir"),
    ("Daraxt", "Vaqt", "Ko'mir"),
    ("Ko'mir", "Bosim", "Neft"),

    # === ZAMON ===
    ("Vaqt", "Vaqt", "Kun"),
    ("Kun", "Kun", "Vaqt"),
    ("Quyosh", "Yer", "Kun"),
    ("Oy", "Yer", "Tun"),
    ("Kun", "Tun", "Vaqt"),

    # === SAN'AT ===
    ("Qalam", "Qog'oz", "Matn"),
    ("Inson", "Guitar", "Musiqa"),
    ("Inson", "Barabon", "Musiqa"),
    ("Inson", "Piyano", "Musiqa"),

    # === FAN ===
    ("Matn", "Matn", "Matematika"),
    ("Raqam", "Raqam", "Matematika"),
    ("Matematika", "Matn", "Ilm"),
    ("Ilm", "Kompyuter", "Dasturlash"),
    ("Ilm", "Suv", "Kimyo"),
    ("Ilm", "Energiya", "Fizika"),

    # === KASB ===
    ("Inson", "Hayvon", "Ovchi"),
    ("Inson", "O'simlik", "Dehqon"),
    ("Inson", "Tanga", "Sotuvchi"),
    ("Inson", "Kilich", "Harbiy"),
    ("Inson", "Asbob", "Usta"),
    ("Inson", "Noutbuk", "O'qituvchi"),

    # === MOLIYA ===
    ("Tanga", "Tanga", "Pul"),
    ("Temir", "Pichoq", "Tanga"),
    ("Oltin", "Oltin", "Tanga"),
    ("Pul", "Pul", "Xazina"),

    # === KIYIM ===
    ("Inson", "Paxta", "Kiyim"),
    ("Kiyim", "Kiyim", "Shapka"),
    ("Kiyim", "Kiyim", "Krossovka"),

    # === TUTILGAN ===
    ("Inson", "Inson", "Sevgi"),
    ("Sevgi", "Sevgi", "Baxt"),
    ("Inson", "Vaqt", "O'lim"),
    ("O'lim", "Olov", "Feniks"),
    ("Inson", "Zakovat", "Jodugar"),
    ("Jodugar", "Olov", "Feniks"),
    ("Jodugar", "Energiya", "Ajdaho"),
    ("Jodugar", "Hayvon", "Unikorn"),

    # === QIMMATBAHO ===
    ("Oltin", "Bosim", "Olmos"),
    ("Kumush", "Olov", "Kumush"),
    ("Mis", "Olov", "Mis"),
    ("Tosh", "Bosim", "Olmos"),

    # === SPORT ===
    ("Inson", "Inson", "Sport"),
    ("Inson", "Hayvon", "Futbol"),
    ("Inson", "Suv", "Suzish"),

    # === QO'SHIMCHA ZANJIR ===
    ("Yog'och", "Pichoq", "Kalit"),
    ("Temir", "Kalit", "Qulf"),
    ("Daraxt", "Qum", "Tuproq"),
    ("Tuproq", "O'simlik", "Daraxt"),
    ("Lava", "Havo", "Tosh"),
    ("Shisha", "Havo", "Deraza"),
    ("G'isht", "Deraza", "Uy"),
    ("Uy", "Ko'prik", "Shahar"),
    ("Qog'oz", "Qalam", "Matn"),
    ("Matn", "Vaqt", "Tarix"),
    ("Noutbuk", "Vaqt", "Tarix"),
    ("Inson", "Ilm", "Olim"),
    ("Inson", "Kompyuter", "Dasturlash"),
    ("Kompyuter", "Dasturlash", "Robot"),
    ("Kompyuter", "Kamera", "Dron"),
    ("Kompyuter", "Internet", "Veb-sayt"),
    ("Inson", "Internet", "Dasturlash"),
]


def seed_database():
    from flask import current_app
    app = current_app._get_current_object() if current_app else None
    
    if not app:
        from app import create_app
        app = create_app()
    
    with app.app_context():
        db.create_all()

        if Element.query.first():
            return

        element_map = {}
        seen_names = set()
        el_count = 0
        for name_uz, name_en, emoji, desc, cat, is_base in ELEMENTS_DATA:
            if name_uz in seen_names:
                continue
            seen_names.add(name_uz)
            el = Element(
                name_uz=name_uz,
                name_en=name_en,
                emoji=emoji,
                description=desc,
                category=cat,
                is_base=is_base,
            )
            db.session.add(el)
            db.session.flush()
            element_map[name_uz] = el.id
            el_count += 1

        db.session.commit()

        combo_count = 0
        seen_combos = set()
        for el1_name, el2_name, result_name in COMBINATIONS_DATA:
            if el1_name in element_map and el2_name in element_map and result_name in element_map:
                e1 = element_map[el1_name]
                e2 = element_map[el2_name]
                r = element_map[result_name]
                if e1 == r or e2 == r:
                    continue
                key = tuple(sorted([e1, e2]))
                if key in seen_combos:
                    continue
                seen_combos.add(key)
                combo = Combination(
                    element1_id=e1,
                    element2_id=e2,
                    result_id=r,
                )
                db.session.add(combo)
                combo_count += 1

        db.session.commit()


if __name__ == '__main__':
    seed_database()
