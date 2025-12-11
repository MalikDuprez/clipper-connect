// app/(app)/(tabs)/shop.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Pressable, 
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useScrollContext } from "./_layout";

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#EBEBEB",
  card: "#F8F8F8",
};

// Mock Data - Services
const SERVICES = [
  {
    id: "1",
    category: "Coupe",
    name: "Coupe Femme",
    salon: "Atelier Sophie",
    duration: "45 min",
    rating: 4.9,
    price: 45,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
  },
  {
    id: "2",
    category: "Coloration",
    name: "Balayage Complet",
    salon: "Atelier Sophie",
    duration: "2h30",
    rating: 5,
    price: 120,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
  },
  {
    id: "3",
    category: "Coupe",
    name: "Coupe Homme + Barbe",
    salon: "Barbershop Marco",
    duration: "1h",
    rating: 4.8,
    price: 50,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
  },
  {
    id: "4",
    category: "Soin",
    name: "Soin Kératine",
    salon: "Salon Élégance",
    duration: "1h30",
    rating: 4.7,
    price: 85,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400",
  },
];

// Mock Data - Produits
const PRODUCTS = [
  {
    id: "1",
    name: "Shampoing Réparateur",
    brand: "Kérastase",
    seller: "Atelier Sophie",
    price: 32,
    originalPrice: 38,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400",
  },
  {
    id: "2",
    name: "Huile Capillaire",
    brand: "Moroccanoil",
    seller: "Salon Élégance",
    price: 45,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
  },
  {
    id: "3",
    name: "Masque Hydratant",
    brand: "Olaplex",
    seller: "Barbershop Marco",
    price: 28,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400",
  },
  {
    id: "4",
    name: "Spray Thermo-Protecteur",
    brand: "GHD",
    seller: "Atelier Sophie",
    price: 25,
    originalPrice: 30,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400",
  },
];

// Mock Data - Salons
const SALONS = [
  {
    id: "1",
    name: "Atelier Sophie",
    address: "12 Rue de la Paix, Paris",
    distance: "0.8 km",
    rating: 4.9,
    reviews: 127,
    priceRange: "€€",
    isOpen: true,
    services: ["Coupe", "Coloration", "Soins"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
  },
  {
    id: "2",
    name: "Barbershop Marco",
    address: "45 Avenue Victor Hugo, Paris",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 98,
    priceRange: "€€",
    isOpen: true,
    services: ["Coupe Homme", "Barbe", "Rasage"],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
  },
  {
    id: "3",
    name: "Salon Élégance",
    address: "78 Boulevard Haussmann, Paris",
    distance: "1.5 km",
    rating: 4.7,
    reviews: 203,
    priceRange: "€€€",
    isOpen: false,
    services: ["Coupe", "Coloration", "Mariage"],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
  },
];

type TabType = "services" | "produits" | "salons";

export default function SalonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsScrolling } = useScrollContext();
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const isGoingDown = currentY > lastScrollY.current;
    const isGoingUp = currentY < lastScrollY.current;
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    if (isGoingDown && currentY > 30) {
      setIsScrolling(true);
    } else if (isGoingUp) {
      setIsScrolling(false);
    }
    
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 800);
    lastScrollY.current = currentY;
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Render Service Card
  const renderServiceCard = (item: typeof SERVICES[0]) => (
    <Pressable key={item.id} style={styles.serviceCard}>
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceSalon}>{item.salon}</Text>
        <View style={styles.serviceMeta}>
          <Text style={styles.serviceDuration}>{item.duration}</Text>
          <View style={styles.serviceRating}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.servicePriceContainer}>
        <Text style={styles.servicePrice}>{item.price}€</Text>
        <Pressable style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Réserver</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  // Render Product Card
  const renderProductCard = (item: typeof PRODUCTS[0]) => (
    <Pressable key={item.id} style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productContent}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSeller}>Vendu par {item.seller}</Text>
        <View style={styles.productRating}>
          <Ionicons name="star" size={12} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>{item.price}€</Text>
          {item.originalPrice && (
            <Text style={styles.productOriginalPrice}>{item.originalPrice}€</Text>
          )}
        </View>
        <Pressable style={styles.addToCartButton} onPress={addToCart}>
          <Ionicons name="cart-outline" size={16} color="#FFF" />
          <Text style={styles.addToCartText}>Ajouter</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  // Render Salon Card
  const renderSalonCard = (item: typeof SALONS[0]) => (
    <Pressable key={item.id} style={styles.salonCard}>
      <Image source={{ uri: item.image }} style={styles.salonImage} />
      <View style={styles.salonContent}>
        <View style={styles.salonHeader}>
          <Text style={styles.salonName}>{item.name}</Text>
          <View style={[styles.statusBadge, !item.isOpen && styles.statusClosed]}>
            <Text style={[styles.statusText, !item.isOpen && styles.statusTextClosed]}>
              {item.isOpen ? "Ouvert" : "Fermé"}
            </Text>
          </View>
        </View>
        <View style={styles.salonAddress}>
          <Ionicons name="location-outline" size={14} color={theme.textMuted} />
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
        <View style={styles.salonMeta}>
          <View style={styles.salonRating}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
          <Text style={styles.distanceText}>{item.distance}</Text>
          <Text style={styles.priceRange}>{item.priceRange}</Text>
        </View>
        <View style={styles.salonServices}>
          {item.services.slice(0, 3).map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{service}</Text>
            </View>
          ))}
        </View>
        <Pressable style={styles.viewSalonButton}>
          <Text style={styles.viewSalonText}>Voir le salon</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.text} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.pageTitle}>Salon</Text>
          {activeTab === "produits" && cartCount > 0 && (
            <Pressable style={styles.cartButton}>
              <Ionicons name="cart-outline" size={24} color={theme.text} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={18} color={theme.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={
                activeTab === "services" 
                  ? "Rechercher produits, services, salons.."
                  : activeTab === "produits"
                  ? "Rechercher un produit..."
                  : "Rechercher un salon..."
              }
              placeholderTextColor={theme.textMuted}
              style={styles.searchTextInput}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            onPress={() => setActiveTab("services")}
            style={[styles.tab, activeTab === "services" && styles.tabActive]}
          >
            <Ionicons 
              name="cut-outline" 
              size={16} 
              color={activeTab === "services" ? "#FFF" : theme.textMuted} 
            />
            <Text style={[styles.tabText, activeTab === "services" && styles.tabTextActive]}>
              Services
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => setActiveTab("produits")}
            style={[styles.tab, activeTab === "produits" && styles.tabActive]}
          >
            <Ionicons 
              name="basket-outline" 
              size={16} 
              color={activeTab === "produits" ? "#FFF" : theme.textMuted} 
            />
            <Text style={[styles.tabText, activeTab === "produits" && styles.tabTextActive]}>
              Produits
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => setActiveTab("salons")}
            style={[styles.tab, activeTab === "salons" && styles.tabActive]}
          >
            <Ionicons 
              name="storefront-outline" 
              size={16} 
              color={activeTab === "salons" ? "#FFF" : theme.textMuted} 
            />
            <Text style={[styles.tabText, activeTab === "salons" && styles.tabTextActive]}>
              Salons
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 160 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Services Tab */}
        {activeTab === "services" && (
          <View style={styles.listContainer}>
            <Text style={styles.resultsCount}>
              {SERVICES.length} services disponibles
            </Text>
            {SERVICES.map(renderServiceCard)}
          </View>
        )}

        {/* Produits Tab */}
        {activeTab === "produits" && (
          <View style={styles.listContainer}>
            <Text style={styles.resultsCount}>
              {PRODUCTS.length} produits disponibles
            </Text>
            <View style={styles.productsGrid}>
              {PRODUCTS.map(renderProductCard)}
            </View>
          </View>
        )}

        {/* Salons Tab */}
        {activeTab === "salons" && (
          <View style={styles.listContainer}>
            <Text style={styles.resultsCount}>
              {SALONS.length} salons à proximité
            </Text>
            {SALONS.map(renderSalonCard)}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  
  // Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.text,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  
  // Search
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchTextInput: {
    flex: 1,
    color: theme.text,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: theme.card,
  },
  tabActive: {
    backgroundColor: theme.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.textMuted,
  },
  tabTextActive: {
    color: "#FFF",
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 13,
    color: theme.textMuted,
    marginBottom: 16,
  },
  
  // Service Card
  serviceCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  serviceImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  serviceContent: {
    padding: 14,
    paddingBottom: 8,
  },
  serviceCategory: {
    fontSize: 12,
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
  },
  serviceSalon: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceDuration: {
    fontSize: 13,
    color: theme.textMuted,
  },
  serviceRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  servicePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.text,
  },
  bookButton: {
    backgroundColor: theme.text,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  
  // Product Card
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productCard: {
    width: "48%",
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 4,
  },
  productImage: {
    width: "100%",
    height: 140,
  },
  productContent: {
    padding: 12,
  },
  productBrand: {
    fontSize: 11,
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  productSeller: {
    fontSize: 11,
    color: theme.textMuted,
    marginBottom: 6,
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
  },
  productOriginalPrice: {
    fontSize: 13,
    color: theme.textMuted,
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.text,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
  
  // Salon Card
  salonCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  salonImage: {
    width: "100%",
    height: 160,
  },
  salonContent: {
    padding: 14,
  },
  salonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  salonName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusClosed: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  statusTextClosed: {
    color: "#C62828",
  },
  salonAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 13,
    color: theme.textMuted,
    flex: 1,
  },
  salonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  salonRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.text,
  },
  reviewsText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  distanceText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  priceRange: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: "500",
  },
  salonServices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: theme.background,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  viewSalonButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.background,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  viewSalonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },
});