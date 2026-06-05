export const krogerStores: Record<string, KrogerStore> = {
    bakers: { label: "Baker's Plus", value: 'bakers', imageUrl: 'https://www.scrapehero.com/store/wp-content/uploads/2020/01/Bakers_Plus_USA.png', cartUrl: 'https://www.bakersplus.com/cart' },
    citymarket: { label: 'City Market', value: 'citymarket', imageUrl: 'https://www.citymarket.com/android-chrome-512x512.png', cartUrl: 'https://www.citymarket.com/cart' },
    dillons: { label: 'Dillons', value: 'dillons', imageUrl: 'https://www.dillons.com/android-chrome-512x512.png', cartUrl: 'https://www.dillons.com/cart' },
    fredmeyer: { label: 'Fred Meyer', value: 'fredmeyer', imageUrl: 'https://www.fredmeyer.com/android-chrome-512x512.png', cartUrl: 'https://www.fredmeyer.com/cart' },
    frys: { label: "Fry's Food", value: 'frys', imageUrl: 'https://www.frysfood.com/android-chrome-512x512.png', cartUrl: 'https://www.frysfood.com/cart' },
    gerbes: { label: 'Gerbes', value: 'gerbes', imageUrl: 'https://www.gerbes.com/android-chrome-512x512.png', cartUrl: 'https://www.gerbes.com/cart' },
    kingsoopers: { label: 'King Soopers', value: 'kingsoopers', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/King_Soopers_logo.svg', cartUrl: 'https://www.kingsoopers.com/cart' },
    kroger: { label: 'Kroger', value: 'kroger', imageUrl: 'https://logos-world.net/wp-content/uploads/2021/09/Kroger-Logo.png', cartUrl: 'https://www.kroger.com/cart' },
    metromarket: { label: 'Metro Market', value: 'metromarket', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tqLFmcGZuWjQA2jzkpRs5UcTuQcnrNzGPA&s', cartUrl: 'https://www.metromarket.com/cart' },
    picknsave: { label: "Pick 'n Save", value: 'picknsave', imageUrl: 'https://www.picknsave.com/android-chrome-512x512.png', cartUrl: 'https://www.picknsave.com/cart' },
    qfc: { label: 'QFC', value: 'qfc', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Quality_Food_Centers_%28logo%29.svg', cartUrl: 'https://www.qfc.com/cart' },
    ralphs: { label: 'Ralphs', value: 'ralphs', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Ralphs.svg/1280px-Ralphs.svg.png', cartUrl: 'https://www.ralphs.com/cart' },
    smiths: { label: 'Smiths Food and Drug', value: 'smiths', imageUrl: 'https://www.smithsfoodanddrug.com/android-chrome-512x512.png', cartUrl: 'https://www.smithsfoodanddrug.com/cart' },
    food4less: { label: 'Food 4 Less', value: 'food4less', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCU_B1pmr_bn0OEehQIuxWx1JX60ZEkHnTfA&s', cartUrl: 'https://www.food4less.com/cart' },
    foodsco: { label: 'Foods Co.', value: 'foodsco', imageUrl: 'https://www.foodsco.net/android-chrome-512x512.png', cartUrl: 'https://www.foodsco.net/cart' },
    harristeeter: { label: 'Harris Teeter', value: 'harristeeter', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfN5HsPOOJAlP-G5uAfD05eqIU0DGJDNyDpA&s', cartUrl: 'https://www.harristeeter.com/cart' },
    vons: { label: 'Vons', value: 'vons', imageUrl: 'https://image.pngaaa.com/9/1748009-middle.png', cartUrl: 'https://www.vons.com/cart' },
    jaycfoods: { label: 'Jay C', value: 'jaycfoods', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/de/JayC_Food_Stores_logo.svg', cartUrl: 'https://www.jaycfoods.com/cart' },
    marianos: { label: 'Marianos', value: 'marianos', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Mariano%27s_logo.svg/1280px-Mariano%27s_logo.svg.png', cartUrl: 'https://www.marianos.com/cart' },
    payless: { label: 'Pay Less', value: 'payless', imageUrl: 'https://www.pay-less.com/android-chrome-512x512.png', cartUrl: 'https://www.pay-less.com/cart' },
    rulerfoods: { label: 'Ruler Foods', value: 'rulerfoods', imageUrl: 'https://cdn.cookielaw.org/logos/f95f67ef-e8ad-4274-9c69-04fd38042f86/18e82956-30b6-46a7-a497-c99cb3c93496/b5681bdb-cb29-4801-aefa-10089ff4f970/Ruler-Foods-by-Kroger-02-1.png', cartUrl: 'https://www.rulerfoods.com/cart' },
    copps: { label: 'Copps', value: 'copps', imageUrl: 'https://d1hbpr09pwz0sk.cloudfront.net/logo_url/copps-c5a2d75c', cartUrl: 'https://www.copps.com/cart' },
};

interface KrogerStore {
    label: string,
    value: string,
    imageUrl: string,
    cartUrl: string
}