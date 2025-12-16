// app/(app)/(tabs)/activity.tsx
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Pressable, 
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useScrollContext } from "./_layout";
import { useBookingStore, BookingItem, BookingStatus } from "@stores/bookingStore";
import { useOrderStore, OrderItem, OrderStatus } from "@stores/orderStore";

const theme = {
  background: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  border: "#E5E5E5",
  card: "#F5F5F5",
  success: "#2E7D32",
  successLight: "#E8F5E9",
  warning: "#F57C00",
  warningLight: "#FFF3E0",
  error: "#D32F2F",
  errorLight: "#FFEBEE",
  info: "#1976D2",
  infoLight: "#E3F2FD",
};

type TabType = "active" | "upcoming" | "past";
type PastFilterType = "all" | "bookings" | "orders";

// ============================================
// DONNÉES MOCK POUR DÉMO
// ============================================
const MOCK_ACTIVE_BOOKING: BookingItem = {
  id: "mock-active-1",
  inspiration: {
    id: "insp-1",
    title: "Dégradé Américain",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
    category: "Homme",
    duration: "45 min",
    price: 35,
  },
  coiffeur: {
    id: "coif-1",
    name: "Marco Rossi",
    salon: "Barbershop Marco",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    rating: 4.8,
    phone: "+33 6 12 34 56 78",
  },
  date: "2025-01-15",
  dateFormatted: "15 Jan 2025",
  time: "14:30",
  location: "domicile",
  address: "12 Rue de la Paix, 75002 Paris",
  serviceFee: 10,
  status: "hairdresser_coming",
  rated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_UPCOMING_BOOKINGS: BookingItem[] = [
  {
    id: "mock-upcoming-1",
    inspiration: {
      id: "insp-2",
      title: "Balayage Naturel",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      category: "Femme",
      duration: "2h",
      price: 120,
    },
    coiffeur: {
      id: "coif-2",
      name: "Sophie Martin",
      salon: "Salon Élégance",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      rating: 4.9,
    },
    date: "2025-01-18",
    dateFormatted: "18 Jan 2025",
    time: "10:00",
    location: "salon",
    address: "45 Avenue Montaigne, 75008 Paris",
    status: "confirmed",
    rated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_PAST_BOOKINGS: BookingItem[] = [
  {
    id: "mock-past-1",
    inspiration: {
      id: "insp-3",
      title: "Coupe Homme Classic",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
      category: "Homme",
      duration: "30 min",
      price: 28,
    },
    coiffeur: {
      id: "coif-3",
      name: "Thomas Dubois",
      salon: "Le Figaro",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      rating: 4.7,
    },
    date: "2025-01-10",
    dateFormatted: "10 Jan 2025",
    time: "16:00",
    location: "salon",
    address: "8 Rue du Faubourg, 75009 Paris",
    status: "completed",
    rated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-past-2",
    inspiration: {
      id: "insp-4",
      title: "Coloration Châtain",
      image: "https://images.unsplash.com/photo-1560869713-da86bd4d0b69?w=400",
      category: "Femme",
      duration: "1h30",
      price: 85,
    },
    coiffeur: {
      id: "coif-4",
      name: "Julie Petit",
      salon: "Hair Studio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      rating: 4.6,
    },
    date: "2025-01-05",
    dateFormatted: "5 Jan 2025",
    time: "11:00",
    location: "domicile",
    address: "12 Rue de la Paix, 75002 Paris",
    serviceFee: 10,
    status: "completed",
    rated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_ACTIVE_ORDER: OrderItem = {
  id: "mock-order-1",
  products: [
    {
      id: "prod-1",
      name: "Shampooing Kérastase Nutritive",
      image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=200",
      price: 28,
      quantity: 1,
    },
    {
      id: "prod-2",
      name: "Masque Réparateur Olaplex",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200",
      price: 32,
      quantity: 2,
    },
  ],
  status: "shipped",
  deliveryMethod: "home",
  deliveryAddress: "12 Rue de la Paix, 75002 Paris",
  deliveryPrice: 4.90,
  subtotal: 92,
  total: 96.90,
  trackingNumber: "FR123456789",
  estimatedDelivery: "17 Jan 2025",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_PAST_ORDERS: OrderItem[] = [
  {
    id: "mock-order-2",
    products: [
      {
        id: "prod-3",
        name: "Huile Capillaire Moroccanoil",
        image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200",
        price: 45,
        quantity: 1,
      },
    ],
    status: "delivered",
    deliveryMethod: "relay",
    deliveryAddress: "Relais Colis - Tabac Le Central",
    deliveryPrice: 2.90,
    subtotal: 45,
    total: 47.90,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// ============================================
// HELPERS
// ============================================
const getBookingStatusConfig = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return { label: "En attente", color: theme.warning, bgColor: theme.warningLight, icon: "time-outline" };
    case "confirmed":
      return { label: "Confirmé", color: theme.success, bgColor: theme.successLight, icon: "checkmark-circle-outline" };
    case "hairdresser_coming":
      return { label: "En route", color: theme.info, bgColor: theme.infoLight, icon: "navigate-outline" };
    case "in_progress":
      return { label: "En cours", color: theme.info, bgColor: theme.infoLight, icon: "cut-outline" };
    case "completed":
      return { label: "Terminé", color: theme.success, bgColor: theme.successLight, icon: "checkmark-done-outline" };
    case "cancelled":
      return { label: "Annulé", color: theme.error, bgColor: theme.errorLight, icon: "close-circle-outline" };
    default:
      return { label: status, color: theme.textMuted, bgColor: theme.card, icon: "help-outline" };
  }
};

const getOrderStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "preparing":
      return { label: "En préparation", color: theme.warning, bgColor: theme.warningLight, icon: "cube-outline" };
    case "shipped":
      return { label: "Expédié", color: theme.info, bgColor: theme.infoLight, icon: "paper-plane-outline" };
    case "out_for_delivery":
      return { label: "En livraison", color: theme.info, bgColor: theme.infoLight, icon: "bicycle-outline" };
    case "delivered":
      return { label: "Livré", color: theme.success, bgColor: theme.successLight, icon: "checkmark-done-outline" };
    case "cancelled":
      return { label: "Annulé", color: theme.error, bgColor: theme.errorLight, icon: "close-circle-outline" };
    default:
      return { label: status, color: theme.textMuted, bgColor: theme.card, icon: "help-outline" };
  }
};

// ============================================
// COMPOSANTS
// ============================================

// Badge de statut
const StatusBadge = ({ label, color, bgColor }: { label: string; color: string; bgColor: string }) => (
  <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
    <Text style={[styles.statusText, { color }]}>{label}</Text>
  </View>
);

// Carte RDV En cours (grande avec tracking)
const ActiveBookingCard = ({ booking, onContact, onCancel }: { 
  booking: BookingItem; 
  onContact: () => void;
  onCancel: () => void;
}) => {
  const statusConfig = getBookingStatusConfig(booking.status);
  
  return (
    <View style={styles.activeCard}>
      <View style={styles.activeCardHeader}>
        <View style={styles.activeCardType}>
          <Ionicons name="cut" size={16} color={theme.text} />
          <Text style={styles.activeCardTypeText}>Rendez-vous</Text>
        </View>
        <StatusBadge {...statusConfig} />
      </View>
      
      <View style={styles.activeCardContent}>
        <Image source={{ uri: booking.coiffeur.image }} style={styles.activeCoiffeurImage} />
        <View style={styles.activeCardInfo}>
          <Text style={styles.activeCoiffeurName}>{booking.coiffeur.name}</Text>
          <Text style={styles.activeServiceName}>{booking.inspiration.title}</Text>
          <View style={styles.activeMetaRow}>
            <Ionicons name={booking.location === "domicile" ? "home-outline" : "location-outline"} size={14} color={theme.textMuted} />
            <Text style={styles.activeMetaText}>
              {booking.location === "domicile" ? "À domicile" : booking.coiffeur.salon}
            </Text>
          </View>
        </View>
      </View>

      {booking.status === "hairdresser_coming" && (
        <View style={styles.trackingSection}>
          <View style={styles.trackingInfo}>
            <Ionicons name="navigate" size={20} color={theme.info} />
            <Text style={styles.trackingText}>Arrivée estimée dans ~15 min</Text>
          </View>
          <View style={styles.trackingBar}>
            <View style={[styles.trackingProgress, { width: "60%" }]} />
          </View>
        </View>
      )}

      <View style={styles.activeCardActions}>
        <Pressable style={styles.activeActionBtn} onPress={onContact}>
          <Ionicons name="call-outline" size={18} color={theme.text} />
          <Text style={styles.activeActionText}>Contacter</Text>
        </Pressable>
        <Pressable style={[styles.activeActionBtn, styles.activeActionBtnDanger]} onPress={onCancel}>
          <Ionicons name="close-outline" size={18} color={theme.error} />
          <Text style={[styles.activeActionText, { color: theme.error }]}>Annuler</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Carte Commande En cours
const ActiveOrderCard = ({ order, onTrack }: { order: OrderItem; onTrack: () => void }) => {
  const statusConfig = getOrderStatusConfig(order.status);
  const productCount = order.products.reduce((sum, p) => sum + p.quantity, 0);
  
  return (
    <View style={styles.activeCard}>
      <View style={styles.activeCardHeader}>
        <View style={styles.activeCardType}>
          <Ionicons name="cube" size={16} color={theme.text} />
          <Text style={styles.activeCardTypeText}>Commande</Text>
        </View>
        <StatusBadge {...statusConfig} />
      </View>
      
      <View style={styles.orderProductsRow}>
        {order.products.slice(0, 3).map((product, index) => (
          <Image 
            key={product.id} 
            source={{ uri: product.image }} 
            style={[styles.orderProductThumb, { marginLeft: index > 0 ? -12 : 0 }]} 
          />
        ))}
        <Text style={styles.orderProductCount}>
          {productCount} article{productCount > 1 ? "s" : ""} • {order.total.toFixed(2)}€
        </Text>
      </View>

      {order.estimatedDelivery && (
        <View style={styles.deliveryInfo}>
          <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
          <Text style={styles.deliveryText}>Livraison estimée : {order.estimatedDelivery}</Text>
        </View>
      )}

      <Pressable style={styles.trackOrderBtn} onPress={onTrack}>
        <Ionicons name="locate-outline" size={18} color="#FFF" />
        <Text style={styles.trackOrderBtnText}>Suivre ma commande</Text>
      </Pressable>
    </View>
  );
};

// Carte RDV À venir
const UpcomingBookingCard = ({ booking, onModify, onCancel }: { 
  booking: BookingItem; 
  onModify: () => void;
  onCancel: () => void;
}) => {
  const statusConfig = getBookingStatusConfig(booking.status);
  
  return (
    <View style={styles.upcomingCard}>
      <Image source={{ uri: booking.inspiration.image }} style={styles.upcomingImage} />
      <View style={styles.upcomingContent}>
        <View style={styles.upcomingHeader}>
          <Text style={styles.upcomingSalon}>{booking.coiffeur.salon}</Text>
          <StatusBadge {...statusConfig} />
        </View>
        <Text style={styles.upcomingService}>{booking.inspiration.title}</Text>
        
        <View style={styles.upcomingMeta}>
          <View style={styles.upcomingMetaItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{booking.dateFormatted}</Text>
          </View>
          <View style={styles.upcomingMetaItem}>
            <Ionicons name="time-outline" size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{booking.time}</Text>
          </View>
          <View style={styles.upcomingMetaItem}>
            <Ionicons name={booking.location === "domicile" ? "home-outline" : "location-outline"} size={14} color={theme.textMuted} />
            <Text style={styles.metaText}>{booking.location === "domicile" ? "À domicile" : "Au salon"}</Text>
          </View>
        </View>

        <View style={styles.upcomingCoiffeur}>
          <Image source={{ uri: booking.coiffeur.image }} style={styles.coiffeurAvatar} />
          <View style={styles.coiffeurInfo}>
            <Text style={styles.coiffeurName}>{booking.coiffeur.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={styles.ratingText}>{booking.coiffeur.rating}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>{booking.inspiration.price}€</Text>
        </View>

        <View style={styles.upcomingActions}>
          <Pressable style={styles.actionBtn} onPress={onModify}>
            <Text style={styles.actionBtnText}>Modifier</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.actionBtnOutline]} onPress={onCancel}>
            <Text style={styles.actionBtnTextOutline}>Annuler</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Carte Passée (RDV ou Commande)
const PastBookingCard = ({ booking, onRate, onRebook }: { 
  booking: BookingItem; 
  onRate: () => void;
  onRebook: () => void;
}) => {
  const statusConfig = getBookingStatusConfig(booking.status);
  const isCancelled = booking.status === "cancelled";
  
  return (
    <View style={[styles.pastCard, isCancelled && styles.pastCardCancelled]}>
      <Image source={{ uri: booking.inspiration.image }} style={styles.pastImage} />
      <View style={styles.pastContent}>
        <View style={styles.pastHeader}>
          <View style={styles.pastTypeIcon}>
            <Ionicons name="cut" size={12} color={theme.textMuted} />
          </View>
          {isCancelled && <StatusBadge {...statusConfig} />}
        </View>
        <Text style={styles.pastTitle}>{booking.inspiration.title}</Text>
        <Text style={styles.pastSubtitle}>{booking.coiffeur.salon}</Text>
        <Text style={styles.pastMeta}>
          {booking.dateFormatted} • {booking.inspiration.price}€
        </Text>
        
        {!isCancelled && (
          <View style={styles.pastActions}>
            {!booking.rated && (
              <Pressable style={styles.rateBtn} onPress={onRate}>
                <Ionicons name="star-outline" size={14} color={theme.text} />
                <Text style={styles.rateBtnText}>Noter</Text>
              </Pressable>
            )}
            <Pressable style={styles.rebookBtn} onPress={onRebook}>
              <Ionicons name="refresh-outline" size={14} color="#FFF" />
              <Text style={styles.rebookBtnText}>Réserver</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const PastOrderCard = ({ order }: { order: OrderItem }) => {
  const statusConfig = getOrderStatusConfig(order.status);
  const isCancelled = order.status === "cancelled";
  const productCount = order.products.reduce((sum, p) => sum + p.quantity, 0);
  
  return (
    <View style={[styles.pastCard, isCancelled && styles.pastCardCancelled]}>
      <View style={styles.pastOrderImages}>
        {order.products.slice(0, 2).map((product) => (
          <Image key={product.id} source={{ uri: product.image }} style={styles.pastOrderThumb} />
        ))}
      </View>
      <View style={styles.pastContent}>
        <View style={styles.pastHeader}>
          <View style={styles.pastTypeIcon}>
            <Ionicons name="cube" size={12} color={theme.textMuted} />
          </View>
          {isCancelled && <StatusBadge {...statusConfig} />}
        </View>
        <Text style={styles.pastTitle}>
          {productCount} article{productCount > 1 ? "s" : ""}
        </Text>
        <Text style={styles.pastSubtitle}>
          {order.products[0].name}{order.products.length > 1 ? ` +${order.products.length - 1}` : ""}
        </Text>
        <Text style={styles.pastMeta}>{order.total.toFixed(2)}€</Text>
        
        {!isCancelled && (
          <View style={styles.pastActions}>
            <Pressable style={styles.rebookBtn}>
              <Ionicons name="refresh-outline" size={14} color="#FFF" />
              <Text style={styles.rebookBtnText}>Commander</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

// État vide
const EmptyState = ({ tab, onAction }: { tab: TabType; onAction: () => void }) => {
  const config = {
    active: {
      icon: "flash-outline" as const,
      title: "Aucune activité en cours",
      subtitle: "Vos prestations et livraisons en cours apparaîtront ici",
      buttonText: "Découvrir",
    },
    upcoming: {
      icon: "calendar-outline" as const,
      title: "Aucun rendez-vous prévu",
      subtitle: "Réservez votre prochaine coupe ou soin",
      buttonText: "Réserver maintenant",
    },
    past: {
      icon: "time-outline" as const,
      title: "Aucun historique",
      subtitle: "Vos rendez-vous et commandes passés apparaîtront ici",
      buttonText: "Explorer",
    },
  };

  const { icon, title, subtitle, buttonText } = config[tab];

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon} size={48} color={theme.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      <Pressable style={styles.emptyButton} onPress={onAction}>
        <Text style={styles.emptyButtonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

// ============================================
// ÉCRAN PRINCIPAL
// ============================================
export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setIsScrolling } = useScrollContext();
  
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [pastFilter, setPastFilter] = useState<PastFilterType>("all");
  
  // Stores
  const { 
    bookings, 
    getActiveBookings, 
    getUpcomingBookings, 
    getPastBookings,
    cancelBooking,
    rateBooking,
  } = useBookingStore();
  
  const { 
    orders,
    getActiveOrders, 
    getPastOrders,
  } = useOrderStore();

  // Combiner données mock + store pour démo
  const activeBookings = [...getActiveBookings(), MOCK_ACTIVE_BOOKING];
  const activeOrders = [...getActiveOrders(), MOCK_ACTIVE_ORDER];
  const upcomingBookings = [...getUpcomingBookings(), ...MOCK_UPCOMING_BOOKINGS];
  const pastBookings = [...getPastBookings(), ...MOCK_PAST_BOOKINGS];
  const pastOrders = [...getPastOrders(), ...MOCK_PAST_ORDERS];

  // Scroll handling
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

  // Handlers
  const handleCancelBooking = (id: string) => {
    cancelBooking(id);
  };

  const handleRateBooking = (id: string) => {
    // TODO: Ouvrir modal de notation
    rateBooking(id);
  };

  const handleRebook = (booking: BookingItem) => {
    // TODO: Pré-remplir le flow de réservation
    router.push("/(tabs)/");
  };

  const handleGoToInspiration = () => {
    router.push("/(tabs)/");
  };

  // Tabs
  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "active", label: "En cours", count: activeBookings.length + activeOrders.length },
    { key: "upcoming", label: "À venir", count: upcomingBookings.length },
    { key: "past", label: "Passées", count: pastBookings.length + pastOrders.length },
  ];

  // Rendu du contenu selon l'onglet
  const renderContent = () => {
    switch (activeTab) {
      case "active":
        if (activeBookings.length === 0 && activeOrders.length === 0) {
          return <EmptyState tab="active" onAction={handleGoToInspiration} />;
        }
        return (
          <>
            {activeBookings.map((booking) => (
              <ActiveBookingCard
                key={booking.id}
                booking={booking}
                onContact={() => {}}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            ))}
            {activeOrders.map((order) => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onTrack={() => {}}
              />
            ))}
          </>
        );

      case "upcoming":
        if (upcomingBookings.length === 0) {
          return <EmptyState tab="upcoming" onAction={handleGoToInspiration} />;
        }
        return (
          <>
            {upcomingBookings.map((booking) => (
              <UpcomingBookingCard
                key={booking.id}
                booking={booking}
                onModify={() => {}}
                onCancel={() => handleCancelBooking(booking.id)}
              />
            ))}
          </>
        );

      case "past":
        if (pastBookings.length === 0 && pastOrders.length === 0) {
          return <EmptyState tab="past" onAction={handleGoToInspiration} />;
        }
        
        // Filtrer selon le sous-filtre sélectionné
        const showBookings = pastFilter === "all" || pastFilter === "bookings";
        const showOrders = pastFilter === "all" || pastFilter === "orders";
        
        // Combiner et trier par date (plus récent en premier)
        const combinedPastItems: Array<{ type: "booking" | "order"; data: BookingItem | OrderItem; date: Date }> = [];
        
        if (showBookings) {
          pastBookings.forEach((booking) => {
            combinedPastItems.push({ type: "booking", data: booking, date: new Date(booking.date) });
          });
        }
        
        if (showOrders) {
          pastOrders.forEach((order) => {
            combinedPastItems.push({ type: "order", data: order, date: order.createdAt });
          });
        }
        
        // Tri chronologique inversé (plus récent en premier)
        combinedPastItems.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        return (
          <>
            {/* Sous-filtres */}
            <View style={styles.pastFiltersContainer}>
              {[
                { key: "all" as PastFilterType, label: "Tout" },
                { key: "bookings" as PastFilterType, label: "Rendez-vous" },
                { key: "orders" as PastFilterType, label: "Commandes" },
              ].map((filter) => (
                <Pressable
                  key={filter.key}
                  style={[
                    styles.pastFilterChip,
                    pastFilter === filter.key && styles.pastFilterChipActive,
                  ]}
                  onPress={() => setPastFilter(filter.key)}
                >
                  <Text
                    style={[
                      styles.pastFilterText,
                      pastFilter === filter.key && styles.pastFilterTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Liste filtrée */}
            <View style={styles.pastListContainer}>
              {combinedPastItems.map((item) => {
                if (item.type === "booking") {
                  const booking = item.data as BookingItem;
                  return (
                    <PastBookingCard
                      key={booking.id}
                      booking={booking}
                      onRate={() => handleRateBooking(booking.id)}
                      onRebook={() => handleRebook(booking)}
                    />
                  );
                } else {
                  const order = item.data as OrderItem;
                  return <PastOrderCard key={order.id} order={order} />;
                }
              })}
            </View>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Activité</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab.key && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab.key && styles.tabBadgeTextActive]}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.text,
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: theme.card,
    gap: 6,
  },
  tabActive: {
    backgroundColor: theme.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.textSecondary,
  },
  tabTextActive: {
    color: "#FFF",
  },
  tabBadge: {
    backgroundColor: theme.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.textMuted,
  },
  tabBadgeTextActive: {
    color: "#FFF",
  },

  // Content
  content: {
    paddingHorizontal: 20,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Active Card (En cours)
  activeCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  activeCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  activeCardType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeCardTypeText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.textSecondary,
  },
  activeCardContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activeCoiffeurImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  activeCardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  activeCoiffeurName: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.text,
  },
  activeServiceName: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  activeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  activeMetaText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  trackingSection: {
    backgroundColor: theme.infoLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  trackingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  trackingText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.info,
  },
  trackingBar: {
    height: 4,
    backgroundColor: "rgba(25, 118, 210, 0.2)",
    borderRadius: 2,
  },
  trackingProgress: {
    height: 4,
    backgroundColor: theme.info,
    borderRadius: 2,
  },
  activeCardActions: {
    flexDirection: "row",
    gap: 10,
  },
  activeActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.background,
  },
  activeActionBtnDanger: {
    backgroundColor: theme.errorLight,
  },
  activeActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },

  // Order Card
  orderProductsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  orderProductThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.card,
  },
  orderProductCount: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  deliveryText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  trackOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.text,
    paddingVertical: 14,
    borderRadius: 14,
  },
  trackOrderBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },

  // Upcoming Card (À venir)
  upcomingCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  upcomingImage: {
    width: "100%",
    height: 140,
  },
  upcomingContent: {
    padding: 16,
  },
  upcomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  upcomingSalon: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.text,
  },
  upcomingService: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  upcomingMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 14,
  },
  upcomingMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: theme.textMuted,
  },
  upcomingCoiffeur: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginBottom: 14,
  },
  coiffeurAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  coiffeurInfo: {
    flex: 1,
    marginLeft: 10,
  },
  coiffeurName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: theme.textMuted,
  },
  priceText: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.text,
  },
  upcomingActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.text,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  actionBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionBtnTextOutline: {
    color: theme.text,
    fontWeight: "600",
    fontSize: 14,
  },

  // Past Card (Passées)
  pastCard: {
    flexDirection: "row",
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 12,
  },
  pastCardCancelled: {
    opacity: 0.7,
  },
  pastImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  pastOrderImages: {
    width: 80,
    height: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  pastOrderThumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  pastContent: {
    flex: 1,
    marginLeft: 12,
  },
  pastHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  pastTypeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  pastTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.text,
  },
  pastSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  pastMeta: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 4,
  },
  pastActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  rateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.text,
  },
  rebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.text,
  },
  rebookBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFF",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: theme.text,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },

  // Past Filters (sous-filtres)
  pastFiltersContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  pastFilterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: theme.card,
  },
  pastFilterChipActive: {
    backgroundColor: theme.text,
  },
  pastFilterText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.textSecondary,
  },
  pastFilterTextActive: {
    color: "#FFF",
  },
  pastListContainer: {
    gap: 12,
  },
});