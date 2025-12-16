// app/(app)/(tabs)/salon.tsx
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
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useScrollContext, useCartContext } from "./_layout";
import SalonModal from "@components/shared/SalonModal";
import ProductModal from "@components/shared/ProductModal";
import CartModal from "@components/shared/CartModal";
import SuccessModal from "@components/shared/SuccessModal";

// Activer LayoutAnimation sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#EBEBEB",
  card: "#F8F8F8",
};

// Mock Data - Produits
const PRODUCTS = [
  {
    id: "1",
    name: "Shampoing Réparateur",
    brand: "Kérastase",
    seller: "Atelier Sophie",
    sellerId: "1",
    price: 32,
    originalPrice: 38,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400",
    offersDelivery: true,
    deliveryFee: 4.90,
  },
  {
    id: "2",
    name: "Huile Capillaire",
    brand: "Moroccanoil",
    seller: "Salon Élégance",
    sellerId: "3",
    price: 45,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
    offersDelivery: true,
    deliveryFee: 5.90,
  },
  {
    id: "3",
    name: "Masque Hydratant",
    brand: "Olaplex",
    seller: "Barbershop Marco",
    sellerId: "2",
    price: 28,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400",
    offersDelivery: false,
  },
  {
    id: "4",
    name: "Spray Thermo-Protecteur",
    brand: "GHD",
    seller: "Atelier Sophie",
    sellerId: "1",
    price: 25,
    originalPrice: 30,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400",
    offersDelivery: true,
    deliveryFee: 4.90,
  },
  {
    id: "5",
    name: "Sérum Brillance",
    brand: "Wella",
    seller: "Salon Élégance",
    sellerId: "3",
    price: 22,
    rating: 4.5,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400",
    offersDelivery: false,
  },
  {
    id: "6",
    name: "Après-Shampoing Nourrissant",
    brand: "L'Oréal Pro",
    seller: "Atelier Sophie",
    sellerId: "1",
    price: 18,
    originalPrice: 24,
    rating: 4.7,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400",
    offersDelivery: true,
    deliveryFee: 4.90,
  },
];

// Mock Data - Salons
const SALONS = [
  {
    id: "1",
    name: "Atelier Sophie",
    address: "12 Rue de la Paix, Paris 2e",
    distance: "0.8 km",
    rating: 4.9,
    reviews: 127,
    priceRange: "€€",
    isOpen: true,
    offersHomeService: true,
    offersSalonService: true,
    homeServiceFee: 15,
    services: ["Coupe", "Coloration", "Balayage", "Soins"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
  },
  {
    id: "2",
    name: "Barbershop Marco",
    address: "45 Avenue Victor Hugo, Paris 16e",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 98,
    priceRange: "€€",
    isOpen: true,
    offersHomeService: false,
    offersSalonService: true,
    services: ["Coupe Homme", "Barbe", "Rasage"],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
  },
  {
    id: "3",
    name: "Salon Élégance",
    address: "78 Boulevard Haussmann, Paris 8e",
    distance: "1.5 km",
    rating: 4.7,
    reviews: 203,
    priceRange: "€€€",
    isOpen: false,
    offersHomeService: true,
    offersSalonService: true,
    homeServiceFee: 25,
    services: ["Coupe", "Coloration", "Mariage", "Extensions"],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
  },
  {
    id: "4",
    name: "Le Petit Salon",
    address: "23 Rue Montorgueil, Paris 1er",
    distance: "2.1 km",
    rating: 4.6,
    reviews: 64,
    priceRange: "€",
    isOpen: true,
    offersHomeService: true,
    offersSalonService: true,
    homeServiceFee: 10,
    services: ["Coupe", "Brushing", "Soins"],
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400",
  },
];

type TabType = "salons" | "produits";

// Types pour les modals
type SalonType = typeof SALONS[0];
type ProductType = typeof PRODUCTS[0];

export default function BoutiqueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setIsScrolling } = useScrollContext();
  const { addToCart, cartItems, cartCount, cartTotal, updateQuantity, removeItem, clearCart } = useCartContext();
  const [activeTab, setActiveTab] = useState<TabType>("salons");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  
  // States pour les modals
  const [selectedSalon, setSelectedSalon] = useState<SalonType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [salonModalVisible, setSalonModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successData, setSuccessData] = useState<{
    title: string;
    subtitle: string;
    recapImage?: string;
    recapTitle?: string;
    recapSubtitle?: string;
    recapItems?: { icon: string; text: string }[];
    priceLabel?: string;
    priceValue?: string;
    buttonText?: string;
  }>({ title: "", subtitle: "" });
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handlers pour ouvrir les modals
  const openSalonModal = (salon: SalonType) => {
    setSelectedSalon(salon);
    setSalonModalVisible(true);
  };

  const openProductModal = (product: ProductType) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const handleAddToCart = (product: ProductType, quantity: number, deliveryOption: string) => {
    const deliveryFee = deliveryOption === "home" ? (product.deliveryFee || 4.90) : 2.90;
    
    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity,
      image: product.image,
      deliveryOption,
      deliveryFee,
    });
  };

  const handleCheckout = () => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity) + item.deliveryFee, 0);
    
    clearCart();
    setCartModalVisible(false);
    setSuccessData({
      title: "Commande confirmée !",
      subtitle: "Votre commande a été enregistrée",
      recapTitle: `${itemCount} article${itemCount > 1 ? 's' : ''}`,
      recapItems: [
        { icon: "cube-outline", text: "Expédition sous 24-48h" },
      ],
      priceLabel: "Total payé",
      priceValue: `${total.toFixed(2)}€`,
      buttonText: "Parfait !",
    });
    setSuccessModalVisible(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const isGoingDown = currentY > lastScrollY.current;
    const isGoingUp = currentY < lastScrollY.current;
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    // Gestion de la tab bar
    if (isGoingDown && currentY > 30) {
      setIsScrolling(true);
    } else if (isGoingUp) {
      setIsScrolling(false);
    }
    
    // Gestion de la barre de recherche avec LayoutAnimation
    if (isGoingDown && currentY > 60 && showSearch) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowSearch(false);
    } else if (isGoingUp && currentY < lastScrollY.current - 15 && !showSearch) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowSearch(true);
    }
    
    // Reset au top
    if (currentY <= 10 && !showSearch) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowSearch(true);
    }
    
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 800);
    lastScrollY.current = currentY;
  };

  // Render Product Card - Layout fixe
  const renderProductCard = (item: typeof PRODUCTS[0]) => (
    <Pressable 
      key={item.id} 
      style={styles.productCard}
      onPress={() => openProductModal(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      {/* Badge livraison */}
      {item.offersDelivery && (
        <View style={styles.deliveryBadge}>
          <Ionicons name="bicycle" size={10} color="#FFF" />
        </View>
      )}
      
      <View style={styles.productContent}>
        {/* Zone info - hauteur fixe */}
        <View style={styles.productInfo}>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productSeller} numberOfLines={1}>{item.seller}</Text>
          <View style={styles.productRating}>
            <Ionicons name="star" size={10} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
        </View>
        
        {/* Zone prix + bouton - toujours en bas */}
        <View style={styles.productFooter}>
          <View style={styles.productPriceRow}>
            <Text style={styles.productPrice}>{item.price}€</Text>
            {item.originalPrice && (
              <Text style={styles.productOriginalPrice}>{item.originalPrice}€</Text>
            )}
          </View>
          <Pressable 
            style={styles.addToCartButton} 
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item, 1, "relay");
            }}
          >
            <Ionicons name="add" size={16} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  // Render Salon Card
  const renderSalonCard = (item: typeof SALONS[0]) => (
    <Pressable 
      key={item.id} 
      style={styles.salonCard}
      onPress={() => openSalonModal(item)}
    >
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
          <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
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

        {/* Badges Lieu */}
        <View style={styles.locationBadges}>
          {item.offersSalonService && (
            <View style={styles.locationBadge}>
              <Ionicons name="storefront" size={12} color={theme.textSecondary} />
              <Text style={styles.locationBadgeText}>En salon</Text>
            </View>
          )}
          {item.offersHomeService && (
            <View style={[styles.locationBadge, styles.locationBadgeHome]}>
              <Ionicons name="home" size={12} color={theme.text} />
              <Text style={[styles.locationBadgeText, styles.locationBadgeHomeText]}>
                À domicile
              </Text>
              {item.homeServiceFee && (
                <Text style={styles.locationBadgeFee}>+{item.homeServiceFee}€</Text>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.salonServices}>
          {item.services.slice(0, 4).map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{service}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.viewSalonButton}>
          <Text style={styles.viewSalonText}>Voir le salon</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.text} />
        </View>
      </View>
    </Pressable>
  );

  const headerHeight = insets.top + 8;
  const headerTotalHeight = headerHeight + (showSearch ? 160 : 90);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: headerHeight }]}>
        {/* Titre + Panier */}
        <View style={styles.headerTop}>
          <Text style={styles.pageTitle}>Boutique</Text>
          
          {/* Bouton Panier */}
          <Pressable 
            style={styles.cartButton}
            onPress={() => setCartModalVisible(true)}
          >
            <Ionicons name="cart-outline" size={24} color={theme.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search Bar - Conditionnelle */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Ionicons name="search" size={18} color={theme.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={
                  activeTab === "salons"
                    ? "Rechercher un salon..."
                    : "Rechercher un produit..."
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
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
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
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerTotalHeight }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Salons Tab */}
        {activeTab === "salons" && (
          <View style={styles.listContainer}>
            {SALONS.map(renderSalonCard)}
          </View>
        )}

        {/* Produits Tab */}
        {activeTab === "produits" && (
          <View style={styles.listContainer}>
            <View style={styles.productsGrid}>
              {PRODUCTS.map(renderProductCard)}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Modals */}
      <SalonModal
        visible={salonModalVisible}
        salon={selectedSalon}
        onClose={() => {
          setSalonModalVisible(false);
          setSelectedSalon(null);
        }}
        onSuccess={(data) => {
          setSalonModalVisible(false);
          setSelectedSalon(null);
          setSuccessData(data);
          setSuccessModalVisible(true);
        }}
      />

      <ProductModal
        visible={productModalVisible}
        product={selectedProduct}
        onClose={() => {
          setProductModalVisible(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onSuccess={(data) => {
          setProductModalVisible(false);
          setSelectedProduct(null);
          setSuccessData(data);
          setSuccessModalVisible(true);
        }}
      />

      <CartModal
        visible={cartModalVisible}
        items={cartItems}
        onClose={() => setCartModalVisible(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={successData.title}
        subtitle={successData.subtitle}
        recapImage={successData.recapImage}
        recapTitle={successData.recapTitle}
        recapSubtitle={successData.recapSubtitle}
        recapItems={successData.recapItems}
        priceLabel={successData.priceLabel}
        priceValue={successData.priceValue}
        buttonText={successData.buttonText}
      />
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
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
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
    height: 48,
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
    borderRadius: 20,
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
  
  // Product Card - Refonte avec layout fixe
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productCard: {
    width: (width - 52) / 2,
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  deliveryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: theme.text,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  productContent: {
    padding: 12,
    height: 140,
    justifyContent: "space-between",
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: 10,
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.text,
    lineHeight: 17,
    height: 34,
  },
  productSeller: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 4,
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text,
  },
  productOriginalPrice: {
    fontSize: 12,
    color: theme.textMuted,
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.text,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Salon Card
  salonCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  salonImage: {
    width: "100%",
    height: 150,
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
    flex: 1,
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
    fontSize: 12,
    fontWeight: "600",
    color: theme.text,
  },
  reviewsText: {
    fontSize: 11,
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
  
  // Location Badges
  locationBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.background,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  locationBadgeHome: {
    backgroundColor: theme.text,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.textSecondary,
  },
  locationBadgeHomeText: {
    color: "#FFF",
  },
  locationBadgeFee: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginLeft: 2,
  },
  
  // Services Tags
  salonServices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  serviceTag: {
    backgroundColor: theme.background,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  
  // View Salon Button
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